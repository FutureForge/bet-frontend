import { Badge } from "@/modules/app/component/badge";
import React from "react";
import BSC from "@/assets/bsc.svg";
import CrossFi from "@/assets/xfi.svg";
import { SingleBetSlip } from "@/utils/types/bet/bets.type";
import { getActiveChainDetails } from "@/utils/configs/global";
import { chains } from "@/modules/blockchain";

type BetStatus = "Running" | "Won" | "Lost" | "Cancelled";
type Chain = "bsc" | "crossfi";

interface BetCardProps extends SingleBetSlip {
  tag?: string;
  status?: string;
}

export function BetCard(bet: BetCardProps) {
  const statusColorMap: Record<BetStatus, string> = {
    Running: "secondary",
    Won: "green",
    Lost: "red",
    Cancelled: "indigo",
  };

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

  return (
    <div className="max-h-[140px] h-full w-full">
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
          <p className="underline cursor-pointer">Details</p>
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
            <div className="flex items-center gap-2 mt-2">
              {logo}
              <p className="text-sm">
                {bet.betSlip.expectedPayment} {symbol}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
