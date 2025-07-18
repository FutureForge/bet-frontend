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

      return switchActiveChain(chainInfo);
    },
    onSuccess: (data, variables, context) => {},
    onError: (error, variables, context) => {},
  });
}
