import {
  chains,
  Chains,
  getBetContractActiveChain,
  getChain,
  getChainInfoById,
  waitForTransaction,
} from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { BetSlip } from "@/utils/types/matches/matches.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import {
  prepareContractCall,
  sendAndConfirmTransaction,
  toEther,
  toWei,
} from "thirdweb";
import BetContractABI from "@/modules/blockchain/abi/bet-contract.json";
import axios from "axios";
import { BACKEND_URL, client } from "@/utils/configs";
import { BetPlaced, SingleBetSlip } from "@/utils/types/bet/bets.type";
import { queryKeys } from "@/modules/query/query-keys";
import { useSwitchChainMutation } from "../user/user.mutation";

// Utility function to wait for chain switch
const waitForChainSwitch = async (
  delayMs: number = 2000
): Promise<void> => {
  // Wait for the chain switch to propagate
  await new Promise(resolve => setTimeout(resolve, delayMs));
};

export function usePlaceBetMutation() {
  const queryClient = useQueryClient();
  const { account, activeChain } = useUserChainInfo();
  const userAddress = account?.address;

  return useMutation({
    mutationFn: async ({
      betType,
      betSlip,
      totalOdds,
    }: {
      betType: "multiple" | "single";
      totalOdds: number;
      betSlip: Omit<BetSlip, "userAddress" | "betSlipId" | "blockchain">;
    }) => {
      // console.log({ betType, betSlip });

      if (!account) {
        throw new Error(`Need to connect wallet to place bet`);
      }

      if (!activeChain?.id) {
        throw new Error(`Need to connect wallet to place bet`);
      }

      const chain = getChain(activeChain.id);
      const chainInfo = getChainInfoById(activeChain.id);
      const betContract = getBetContractActiveChain(activeChain.id);
      const BET_CONTRACT_INTERFACE = new ethers.Interface(BetContractABI);

      if (betType === "multiple") {
        // Handle multiple bet type (existing logic)
        const matchIds = betSlip.selections.map((selection) =>
          BigInt(selection.matchId)
        );

        // Convert decimal odds to integer format (multiply by 100 to preserve 2 decimal places)
        const oddsAsInteger = Math.round(totalOdds * 100);

        const transaction = prepareContractCall({
          contract: betContract,
          method:
            "function placeBet(uint256[] calldata matchIds, uint256 totalOdds)",
          params: [matchIds, BigInt(oddsAsInteger)],
          value: toWei(betSlip.totalBetAmount.toString()),
        });

        const transactionReceipt = await sendAndConfirmTransaction({
          account,
          transaction,
        });

        if (transactionReceipt.status === "reverted") {
          throw new Error("Failed to place bet");
        }

        const event = transactionReceipt.logs.find(
          (log) =>
            log.address.toLowerCase() === betContract.address.toLowerCase()
        );

        if (!event) {
          throw new Error("BetPlaced event not found in transaction logs");
        }

        const data = event.data;
        const topics = event.topics;

        const decodedData = BET_CONTRACT_INTERFACE.decodeEventLog(
          "BetPlaced",
          data,
          topics
        );

        // Manually map the decoded data to the BetPlaced type
        const betPlacedEvent: BetPlaced = {
          betId: Number(decodedData[0]),
          bettor: decodedData[1],
          amount: Number(toEther(decodedData[2])),
          totalOdds: Number(decodedData[3]),
          matchIds: decodedData[4].map((id: any) => Number(id)),
        };

        const saveBetToDb = await axios.post(`${BACKEND_URL}/bets`, {
          userAddress,
          betSlipId: betPlacedEvent.betId,
          totalBetAmount: betSlip.totalBetAmount,
          blockchain: chain?.chain,
          selections: betSlip.selections.map((sel) => ({
            matchId: sel.matchId,
            selectedOutcome: sel.selectedOutcome,
            oddsAtPlacement: sel.oddsAtPlacement,
          })),
        });

        return saveBetToDb;
      } else {
        // Handle single bet type - process each selection individually
        const betResults = [];

        // Process each selection as a separate transaction
        for (let i = 0; i < betSlip.selections.length; i++) {
          const selection = betSlip.selections[i];
          const matchIds = [BigInt(selection.matchId.toString())];
          const selectionOdds = selection.oddsAtPlacement;

          // Convert decimal odds to integer format (multiply by 100 to preserve 2 decimal places)
          const oddsAsInteger = Math.round(selectionOdds * 100);

          const transaction = prepareContractCall({
            contract: betContract,
            method:
              "function placeBet(uint256[] calldata matchIds, uint256 totalOdds)",
            params: [matchIds, BigInt(oddsAsInteger)],
            value: toWei(betSlip.totalBetAmount.toString()),
          });

          const transactionReceipt = await sendAndConfirmTransaction({
            account,
            transaction,
          });

          if (transactionReceipt.status === "reverted") {
            throw new Error(`Failed to place single bet ${i + 1}`);
          }

          const event = transactionReceipt.logs.find(
            (log: any) =>
              log.address.toLowerCase() === betContract.address.toLowerCase()
          );

          if (!event) {
            throw new Error(
              `BetPlaced event not found in transaction logs for bet ${i + 1}`
            );
          }

          const data = event.data;
          const topics = event.topics;

          const decodedData = BET_CONTRACT_INTERFACE.decodeEventLog(
            "BetPlaced",
            data,
            topics
          );

          // Manually map the decoded data to the BetPlaced type
          const betPlacedEvent: BetPlaced = {
            betId: Number(decodedData[0]),
            bettor: decodedData[1],
            amount: Number(toEther(decodedData[2])),
            totalOdds: Number(decodedData[3]),
            matchIds: decodedData[4].map((id: any) => Number(id)),
          };

          // Save each single bet to DB individually
          const saveBetToDb = await axios.post(`${BACKEND_URL}/bets`, {
            userAddress,
            betSlipId: betPlacedEvent.betId,
            totalBetAmount: betSlip.totalBetAmount,
            blockchain: chain?.chain,
            selections: [
              {
                matchId: betSlip.selections[i].matchId,
                selectedOutcome: betSlip.selections[i].selectedOutcome,
                oddsAtPlacement: betSlip.selections[i].oddsAtPlacement,
              },
            ],
          });

          betResults.push(saveBetToDb);
        }

        return betResults;
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bets.bets });
    },
    onError: (error, variables, context) => {
      // Handle error
    },
  });
}

// Fixed: Chain switching now properly waits for the switch to complete before proceeding with the transaction
// This ensures the correct contract is used for the target chain

export function useClaimBetMutation() {
  const queryClient = useQueryClient();
  const { account, activeChain } = useUserChainInfo();

  const switchChain = useSwitchChainMutation();

  //6870311edf273038533398fc

  return useMutation({
    mutationFn: async ({
      id,
      claimSignature,
      chain,
      betId,
      rewardAmount,
    }: {
      id: string;
      claimSignature: string;
      chain: "crossfi" | "bnb";
      betId: number;
      rewardAmount: number;
    }) => {
      if (!account) {
        throw new Error(`Need to connect wallet to claim bet`);
      }

      const selectedChain = chains.find((selChain) => selChain.chain === chain);

      if (!selectedChain) {
        throw new Error(`Invalid chain: ${chain}`);
      }

      // Check if we're already on the correct chain
      const isOnCorrectChain = activeChain?.id === selectedChain.id;

      if (!isOnCorrectChain) {
        // Switch to the correct chain and wait for it to complete
        await switchChain.mutateAsync({
          chain: selectedChain.chain as Chains,
        });

        // Wait for the chain switch to propagate
        await waitForChainSwitch(2000);
      }

      // Get the chain info and contract for the target chain (not the current active chain)
      const chainInfo = getChainInfoById(selectedChain.id);
      const betContract = getBetContractActiveChain(selectedChain.id);

      const reward = ethers.parseEther(rewardAmount.toString());
      // claim from blockchain logic
      const transaction = prepareContractCall({
        contract: betContract,
        method:
          "function claimWithSignature(uint256 _betId,uint256 _reward, bytes calldata _signature)",
        params: [BigInt(betId), reward, claimSignature as `0x${string}`],
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        account,
        transaction,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Failed to claim bet");
      }

      // update db
      const updateBetDB = await axios.post<SingleBetSlip>(
        `${BACKEND_URL}/bets/${id}/claim`
      );

      return updateBetDB.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bets.claimed, queryKeys.bets.unclaimed],
      });
    },
    onError: (error, variables, context) => {},
  });
}
