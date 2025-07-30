import { Chains } from "@/modules/blockchain";
import { chain1, chain2 } from "@/utils/configs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSwitchActiveWalletChain } from "thirdweb/react";

export function useSwitchChainMutation() {
  const switchActiveChain = useSwitchActiveWalletChain();
  return useMutation({
    mutationFn: async ({ chain }: { chain: Chains }) => {
      let chainInfo;

      if (chain === Chains.CROSSFI) {
        chainInfo = chain1;
      } else if (chain === Chains.BNB) {
        chainInfo = chain2;
      }

      if (!chainInfo) {
        throw new Error("Chain info needed");
      }

      try {
        const result = await switchActiveChain(chainInfo);
        return result;
      } catch (error) {
        // console.error("Failed to switch chain:", error);
        // throw new Error(`Failed to switch to ${chain} chain: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    onSuccess: (data, variables, context) => {
      console.log(`Successfully switched to ${variables.chain} chain`);
    },
    onError: (error, variables, context) => {
      // console.error(`Failed to switch to ${variables.chain} chain:`, error);
    },
    meta: {
      loadingMessage: {
        title: "Switching Network",
        description: "Connecting to the selected blockchain network...",
      },
      successMessage: {
        title: "Network Switched",
        description: "Successfully connected to the new network!",
      },
      errorMessage: {
        title: "Network Switch Failed",
        description: "Failed to switch networks. Please try again.",
      },
    },
  });
}
