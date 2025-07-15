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
import { BACKEND_URL } from "@/utils/configs";
import { BetPlaced, SingleBetSlip } from "@/utils/types/bet/bets.type";
import { queryKeys } from "@/modules/query/query-keys";

export function usePlaceBetMutation() {
  const queryClient = useQueryClient();
  const { account, activeChain } = useUserChainInfo();
  const userAddress = account?.address;

  return useMutation({
    mutationFn: async (
      betSlip: Omit<BetSlip, "userAddress" | "betSlipId" | "blockchain">
    ) => {
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

      const totalOdds = betSlip.selections.reduce((acc, selection) => {
        const result = parseFloat((acc * selection.oddsAtPlacement).toFixed(4));
        return result;
      }, 1);

      const matchIds = betSlip.selections.map((selection) =>
        BigInt(selection.matchId)
      );

      const transaction = prepareContractCall({
        contract: betContract,
        method:
          "function placeBet(uint256[] calldata matchIds, uint256 totalOdds)",
        params: [matchIds, BigInt(totalOdds)],
        value: toWei(betSlip.totalBetAmount.toString()),
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        account,
        transaction,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Failed to claim bet");
      }

      const event = transactionReceipt.logs.find(
        (log) => log.address.toLowerCase() === betContract.address.toLowerCase()
      );

      if (!event) {
        throw new Error("BetPlaced event not found in transaction logs");
      }

      const data = event.data;
      const topics = event.topics;

      //   const data =
      //     "0x0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000126ed50000000000000000000000000000000000000000000000000000000000126ed6";
      //   const topics = [
      //     "0x499ffb54a593a4bdb41f41f1f5416928075d02ef4904812d5c3b4208e37de375",
      //     "0x0000000000000000000000000000000000000000000000000000000000000001",
      //     "0x000000000000000000000000a1f91a0e64ab09b985c4d5ac30e652a7f6c0b2a6",
      //   ];

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
        // betSlipId: 999,
        totalBetAmount: betSlip.totalBetAmount,
        blockchain: chain?.chain,
        selections: betSlip.selections.map((sel) => ({
          matchId: sel.matchId,
          selectedOutcome: sel.selectedOutcome,
          oddsAtPlacement: sel.oddsAtPlacement,
        })),
      });

      return saveBetToDb;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bets.bets });
    },
    onError: (error, variables, context) => {
      // Handle error
    },
  });
}

// TODO: make sure the bet they want to claim aligns with the right blockchain so we call the right contract

export function useClaimBetMutation() {
  const queryClient = useQueryClient();
  const { account, activeChain } = useUserChainInfo();
  const userAddress = account?.address;

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
      console.log({ id, claimSignature, chain, betId, rewardAmount });

      if (!account) {
        throw new Error(`Need to connect wallet to place bet`);
      }

      if (!activeChain?.id) {
        throw new Error(`Need to connect wallet to place bet`);
      }

      const selectedChain = chains.find((selChain) => selChain.chain === chain);

      if (!selectedChain) {
        throw new Error(`Need a selected chain to claim`);
      }

      const reward = ethers.parseEther(rewardAmount.toString());
      const chainInfo = getChainInfoById(selectedChain.id);
      const betContract = getBetContractActiveChain(selectedChain.id);
      const BET_CONTRACT_INTERFACE = new ethers.Interface(BetContractABI);

      console.log({ selectedChain });
      console.log({ betContract });

      // claim from blockchain logic

      const transaction = prepareContractCall({
        contract: betContract,
        method:
          "function claimWithSignature(uint256 _betId,uint256 _reward, bytes calldata _signature)",
        params: [BigInt(betId), reward, claimSignature as `0x${string}`],
      });
      console.log({ transaction });

      const transactionReceipt = await sendAndConfirmTransaction({
        account,
        transaction,
      });
      console.log({ transactionReceipt });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Failed to claim bet");
      }

      // update db
      const updateBetDB = await axios.post<SingleBetSlip>(
        `${BACKEND_URL}/bets/${id}/claim`
      );
      console.log({ updateBetDB });

      return updateBetDB.data.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bets.claimed, queryKeys.bets.unclaimed],
      });
    },
    onError: (error, variables, context) => {},
  });
}
