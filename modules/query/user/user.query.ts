import { Chains, getChainInfoById } from "@/modules/blockchain";
import { BACKEND_URL, client } from "@/utils/configs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useActiveAccount,
  useActiveWallet,
  useWalletBalance,
  useActiveWalletChain,
} from "thirdweb/react";
import { queryKeys } from "../query-keys";
import axios from "axios";

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
      // console.error("Unsupported chain:", error);
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

export function useUserDBQuery() {
  const { account } = useUserChainInfo();
  const userAddress = account?.address;

  return useQuery({
    queryKey: [queryKeys.user.saveUser, { userAddress }],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/users/address/${userAddress}`
        );
        return res.data;
      } catch (error: any) {

        // Check if it's a 502 error with "user doesn't exist" message
        if (
          error.response?.status === 502 &&
          error.response?.data?.message?.includes("User doesnt exist")
        ) {
          try {
            const createUserRes = await axios.post(`${BACKEND_URL}/users`, {
              address: userAddress,
            });

            return createUserRes.data;
          } catch (createError) {
            // console.error("Failed to create user:", createError);
            throw createError;
          }
        }

        throw error;
      }
    },
    enabled: !!userAddress,
    refetchInterval: 5000,
  });
}

// 0x1234567890abcdef1234567890abcdef12345678
