import { Badge } from "@/modules/app/component/badge";
import React from "react";
import BSC from "@/assets/bsc.svg";
import CrossFi from "@/assets/xfi.svg";

type BetStatus = "Running" | "Won" | "Lost" | "Cancelled";
type Chain = "bsc" | "crossfi";

interface BetCardProps {
  mode: string; // e.g., "Single" or "Multiple"
  status: BetStatus;
  match: string;
  stake: string;
  returnAmount: string;
  date: string;
  time: string;
  chain: Chain;
}

export function BetCard({
  mode,
  status,
  match,
  stake,
  returnAmount,
  date,
  time,
  chain,
}: BetCardProps) {
  const statusColorMap: Record<BetStatus, string> = {
    Running: "secondary",
    Won: "green",
    Lost: "red",
    Cancelled: "indigo",
  };

  const ChainIcon = chain === "bsc" ? BSC : CrossFi;

  return (
    <div className="max-h-[140px] h-full w-full">
      <div className="bg-primary rounded-tr-xl rounded-tl-xl py-2.5 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <Badge color="primary" className="text-xs font-semibold">
            {mode}
          </Badge>
          <Badge
            color={statusColorMap[status]}
            className="text-xs font-semibold ml-2"
          >
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 font-medium text-sm">
          <p className="text-muted">{date}</p>
          <p className="text-muted">{time}</p>
          <p className="underline cursor-pointer">Details</p>
        </div>
      </div>
      <div className="bg-white/10 rounded-br-xl rounded-bl-xl p-4 flex items-center justify-between h-full">
        <p>{match}</p>
        <div className="w-1/2 flex items-center gap-3">
          <div className="p-3 w-full bg-primary rounded-xl font-medium">
            <p className="text-sm text-muted">Total Stake</p>
            <div className="flex items-center gap-2 mt-2">
              <ChainIcon className="size-5" />
              <p className="text-sm">{stake}</p>
            </div>
          </div>
          <div className="p-3 w-full bg-primary rounded-xl font-medium">
            <p className="text-sm text-muted">Total Return</p>
            <div className="flex items-center gap-2 mt-2">
              <ChainIcon className="size-5" />
              <p className="text-sm">{returnAmount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
