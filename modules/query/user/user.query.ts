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
import { BetSlipResponse } from "@/utils/types/bet/bets.type";
import { User, UserResponse } from "@/utils/types/user/user.types";

const customUserAddress = "0xa1f91a0E64AB09B985C4d5Ac30e652a7F6c0B2a6"

export function useUserChainInfo() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  return { account, wallet, activeChain };
}

export function useUserNativeBalance() {
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
      address: customUserAddress,
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
        const res = await axios.get<UserResponse>(
          `${BACKEND_URL}/users/address/${customUserAddress}`
        );
        return res.data.data as User;
      } catch (error: any) {
        // Check if it's a 502 error with "user doesn't exist" message
        if (
          error.response?.status === 502 &&
          error.response?.data?.message?.includes("User doesnt exist")
        ) {
          try {
            const createUserRes = await axios.post<UserResponse>(
              `${BACKEND_URL}/users`,
              {
                address: customUserAddress,
              }
            );

            return createUserRes.data.data as User;
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

export function useUserLostBetsQuery() {
  const { account } = useUserChainInfo();
  const userAddress = account?.address;

  return useQuery({
    queryKey: [queryKeys.bets.lost, { userAddress }],
    queryFn: async () => {
      const res = await axios.get<BetSlipResponse>(
        `${BACKEND_URL}/bets/user/lost/${customUserAddress}`
      );

      const bets = res.data.data;

      return bets;
    },
    enabled: !!userAddress,
    refetchInterval: 50000,
  });
}

export function useUserUnclaimedBetsQuery() {
  const { account } = useUserChainInfo();
  const userAddress = account?.address;

  return useQuery({
    queryKey: [queryKeys.bets.unclaimed, { userAddress }],
    queryFn: async () => {
      const res = await axios.get<BetSlipResponse>(
        `${BACKEND_URL}/bets/user/unclaimed/${customUserAddress}`
      );

      const bets = res.data.data;

      return bets;
    },
    enabled: !!userAddress,
    refetchInterval: 50000,
  });
}

export function useUserClaimedBetsQuery() {
  const { account } = useUserChainInfo();
  const userAddress = account?.address;

  return useQuery({
    queryKey: [queryKeys.bets.claimed, { userAddress }],
    queryFn: async () => {
      const res = await axios.get<BetSlipResponse>(
        `${BACKEND_URL}/bets/user/claimed/${customUserAddress}`
      );

      const bets = res.data.data;

      return bets;
    },
    enabled: !!userAddress,
    refetchInterval: 50000,
  });
}

export function useUserBetsQuery() {
  const { account } = useUserChainInfo();
  const userAddress = account?.address;

  return useQuery({
    queryKey: [queryKeys.bets.bets, { userAddress }],
    queryFn: async () => {
      const res = await axios.get<BetSlipResponse>(
        `${BACKEND_URL}/bets/user/${customUserAddress}`
      );

      const bets = res.data.data;

      return bets;
    },
    enabled: !!userAddress,
    refetchInterval: 50000,
  });
}

// 0x1234567890abcdef1234567890abcdef12345678
