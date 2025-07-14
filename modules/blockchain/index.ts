import {
  chain1,
  chain2,
  client,
  chain1Contract,
  chain2Contract,
} from "@/utils/configs";
import { ethers } from "ethers";
import {
  Hex,
  waitForReceipt,
  getContract as getContractThirdweb,
  Chain,
} from "thirdweb";
import { useUserChainInfo } from "../query";
import BetContractABI from "./abi/bet-contract.json";

export enum Chains {
  BNB = "bnb",
  CROSSFI = "crossfi",
}

export const chains: {
  id: number;
  chain: Chains;
}[] = [
  { id: 4157, chain: Chains.CROSSFI },
  { id: 97, chain: Chains.BNB },
];

export function getChainInfoById(chainId: number) {
  const chainEntry = chains.find((chain) => chain.id === chainId);

  if (!chainEntry) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  if (chainEntry.chain === Chains.CROSSFI) {
    return chain1;
  } else if (chainEntry.chain === Chains.BNB) {
    return chain2;
  }

  throw new Error(`Unsupported chain: ${chainEntry.chain}`);
}

export const providerChain1 = new ethers.providers.JsonRpcProvider(chain1.rpc);
export const providerChain2 = new ethers.providers.JsonRpcProvider(chain2.rpc);

export function getBetContractActiveChain() {
  const { activeChain } = useUserChainInfo();

  if (!activeChain?.id) {
    throw new Error("No active chain found");
  }

  const chain = getChainInfoById(activeChain.id);
  const chainEntry = chains.find((chain) => chain.id === activeChain.id);

  if (!chainEntry) {
    throw new Error(`Unsupported chain ID: ${activeChain.id}`);
  }

  let chainContract: string;

  if (chainEntry.chain === Chains.CROSSFI) {
    chainContract = chain1Contract;
  } else if (chainEntry.chain === Chains.BNB) {
    chainContract = chain2Contract;
  } else {
    throw new Error(`Unsupported chain: ${chainEntry.chain}`);
  }

  const contract = getContractCustom({
    contractAddress: chainContract,
    chain,
    abi: BetContractABI,
  });

  return contract;
}

export function getContractEthers({
  contractAddress,
  abi,
  chain,
}: {
  contractAddress: string;
  abi: any;
  chain: Chains;
}) {
  let provider;

  if (chain === Chains.CROSSFI) {
    provider = providerChain1;
  } else if (chain === Chains.BNB) {
    provider = providerChain2;
  }

  const contract = new ethers.Contract(contractAddress, abi, provider);
  return contract;
}

export function getContractCustom({
  contractAddress,
  chain,
  abi,
}: {
  contractAddress: string;
  chain: Chain;
  abi: any;
}) {
  if (abi) {
    return getContractThirdweb({
      client,
      chain,
      address: contractAddress,
      abi: abi,
    });
  }

  return getContractThirdweb({
    client,
    chain,
    address: contractAddress,
    abi: abi,
  });
}

export function decimalOffChain(number: bigint | string | number) {
  if (!number) return;
  const value = ethers.utils.formatEther(number);

  return value;
}

export function decimalOnChain(number: bigint | string | number) {
  if (!number) return;
  const value = ethers.utils.parseEther(number.toString());

  return value;
}

export async function waitForTransaction(txHash: string, chain: Chain) {
  const receipt = await waitForReceipt({
    client,
    chain,
    transactionHash: txHash as Hex,
  });

  return receipt;
}
