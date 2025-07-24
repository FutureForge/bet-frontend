import { Badge } from "@/modules/app/component/badge";
import React from "react";
import BSC from "@/assets/bsc.svg";
import CrossFi from "@/assets/xfi.svg";
import { SingleBetSlip } from "@/utils/types/bet/bets.type";
import { getActiveChainDetails } from "@/utils/configs/global";
import { chains } from "@/modules/blockchain";
import { AllBets } from "..";
import {
  useUserBetsQuery,
  useUserClaimedBetsQuery,
  useUserLostBetsQuery,
  useUserUnclaimedBetsQuery,
} from "@/modules/query";
import { Button } from "@/modules/app/component/button";
import { useRouter } from "next/router";

export type BetStatus = "Running" | "Won" | "Lost" | "Cancelled";
type Chain = "bsc" | "crossfi";

interface BetCardProps extends SingleBetSlip {
  tag?: string;
  status?: string;
}
export const statusColorMap: Record<BetStatus, string> = {
  Running: "secondary",
  Won: "green",
  Lost: "red",
  Cancelled: "indigo",
};
export function BetCard(bet: BetCardProps) {
  const router = useRouter();

  const mode = bet.betSlip.betSlipResult === "pending" ? "Single" : "Multiple";
  const status =
    bet.betSlip.betSlipResult === "pending"
      ? "Running"
      : bet.betSlip.betSlipResult === "won"
      ? "Won"
      : "Lost";

  const chain = bet.betSlip.blockchain as Chain;
  const activeChain = chains.find((chainItem) => chainItem.chain === chain);

  const { logo, symbol } = getActiveChainDetails(activeChain?.id);
  const { data: userBets, isLoading: isUserBetsLoading } = useUserBetsQuery();
  const { data: userLostBets, isLoading: isUserLostBetsLoading } =
    useUserLostBetsQuery();
  const { data: userUnclaimedBets, isLoading: isUserUnclaimedBetsLoading } =
    useUserUnclaimedBetsQuery();
  const { data: userClaimedBets, isLoading: isUserClaimedBetsLoading } =
    useUserClaimedBetsQuery();

  // Combine all bets with appropriate tags
  const allBets = React.useMemo(() => {
    const combinedBets: AllBets[] = [];

    // Add unsettled bets (userBets)
    if (userBets) {
      userBets.forEach((bet: any) => {
        combinedBets.push({
          ...bet,
          tag: "unsettled",
          status: "Running",
        });
      });
    }

    // Add claimed bets (won)
    if (userClaimedBets) {
      userClaimedBets.forEach((bet: any) => {
        combinedBets.push({
          ...bet,
          tag: "claimed",
          status: "Won",
        });
      });
    }

    // Add unclaimed bets (settled but not claimed)
    if (userUnclaimedBets) {
      userUnclaimedBets.forEach((bet: any) => {
        combinedBets.push({
          ...bet,
          tag: "unclaimed",
          status: "Won",
        });
      });
    }

    // Add lost bets
    if (userLostBets) {
      userLostBets.forEach((bet: any) => {
        combinedBets.push({
          ...bet,
          tag: "lost",
          status: "Lost",
        });
      });
    }

    return combinedBets.filter((bets) => {
      return bets.betSelection.length !== 0;
    });
  }, [userBets, userClaimedBets, userUnclaimedBets, userLostBets]);

  const handleClick = () => {
    router.push(`/profile/${bet.betSlip._id}`);
  };
  return (
    <div className="max-h-[140px] h-full w-full cursor-pointer">
      <div className="bg-primary rounded-tr-xl rounded-tl-xl py-2.5 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <Badge color="primary" className="text-xs font-semibold">
            {mode}
          </Badge>
          <Badge
            color={statusColorMap[status as BetStatus]}
            className="text-xs font-semibold ml-2"
          >
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 font-medium text-sm">
          <p className="text-muted">
            {new Date(bet.betSlip.placedAt).toLocaleDateString()}
          </p>
          <p className="text-muted">
            {new Date(bet.betSlip.placedAt).toLocaleTimeString()}
          </p>
          <div
            onClick={handleClick}
            className="underline cursor-pointer hover:text-secondary transition-all duration-300 ease-in-out"
          >
            Details
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-br-xl rounded-bl-xl p-4 flex items-center justify-between h-full">
        <div className="flex-1">
          <p className="text-sm whitespace-pre-line">
            {bet.betSelection.length > 0 &&
              (bet.betSelection.length === 1
                ? `${bet.betSelection[0].homeTeam} v ${bet.betSelection[0].awayTeam}`
                : bet.betSelection.length === 2
                ? `${bet.betSelection[0].homeTeam} v ${bet.betSelection[0].awayTeam}\n${bet.betSelection[1].homeTeam} v ${bet.betSelection[1].awayTeam}`
                : `${bet.betSelection[0].homeTeam} v ${
                    bet.betSelection[0].awayTeam
                  }\n${bet.betSelection[1].homeTeam} v ${
                    bet.betSelection[1].awayTeam
                  }\nand ${bet.betSelection.length - 2} others`)}
          </p>
        </div>
        <div className="w-1/2 flex items-center gap-3">
          <div className="p-3 w-full bg-primary rounded-xl font-medium">
            <p className="text-sm text-muted">Total Stake</p>
            <div className="flex items-center gap-2 mt-2">
              {logo}
              <p className="text-sm">
                {bet.betSlip.totalBetAmount} {symbol}
              </p>
            </div>
          </div>
          <div className="p-3 w-full bg-primary rounded-xl font-medium">
            <p className="text-sm text-muted">Total Return</p>
            <div className="flex items-center gap-2 mt-2 w-full justify-between">
              <div className="flex items-center gap-2">
                {logo}
                <p className="text-sm">
                  {bet.betSlip.expectedPayment} {symbol}
                </p>
              </div>

              {status === "Won" && (
                <Button
                  className="rounded-md h-6 text-xs"
                  disabled={bet.tag === "claimed"}
                >
                  Claim
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
