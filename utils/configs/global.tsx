import { Chains, chains, getChain } from "@/modules/blockchain";
import XFI from "@/assets/xfi.svg";

export function getActiveChainDetails(chainId: number = 4157): {
  logo: React.ReactElement;
  symbol: string;
} {
  const chain = getChain(chainId);

  if (!chain) {
    throw new Error("Chain info needed");
  }

  if (chain.chain === Chains.CROSSFI) {
    return {
      logo: <XFI className="size-4" />,
      symbol: "XFI",
    };
  } else if (chain.chain === Chains.BNB) {
    return {
      logo: <XFI className="size-4" />,
      symbol: "BNB",
    };
  }

  return {
    logo: <XFI className="size-4" />,
    symbol: "UNKNOWN",
  };
}
