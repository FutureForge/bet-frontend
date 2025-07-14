import { Chains, getChainInfoById } from "@/modules/blockchain";
import { client } from "@/utils/configs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useActiveAccount,
  useActiveWallet,
  useWalletBalance,
  useActiveWalletChain,
} from "thirdweb/react";

export function useUserChainInfo() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  return { account, wallet, activeChain };
}

export function getUserNativeBalance() {
  const { account, activeChain } = useUserChainInfo();
  const userAddress = account?.address;

  let chainInfo;

  if (activeChain?.id) {
    try {
      chainInfo = getChainInfoById(activeChain.id);
    } catch (error) {
      console.error("Unsupported chain:", error);
    }
  }

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useWalletBalance(
    {
      chain: chainInfo,
      address: userAddress,
      client,
    },
    {
      enabled: !!userAddress && !!activeChain?.id,
      refetchInterval: 5000,
    }
  );

  return { balanceData, isBalanceLoading, isBalanceError };
}

export function useQueryExample() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {},
    initialData: null,
    enabled: true,
    refetchInterval: 5000,
  });
}
