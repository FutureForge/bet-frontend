import { Badge } from "@/modules/app/component/badge";
import {
  BetStatus,
  statusColorMap,
} from "@/modules/profile/components/bet-card";
import { useRouter } from "next/router";
import XFI from "@/assets/xfi.svg";
import Back from "@/assets/back.svg";
import React from "react";

export default function BetPage() {
  const router = useRouter();
  const { _id } = router.query;

  if (!router.isReady) return <p>Loading...</p>; // ensures `_id` is available

  return (
    <div className="p-6 md:px-8 px-4 max-w-[1440px] mx-auto">
      <button className="flex items-center gap-2 mb-6 text-muted hover:text-white transition-all duration-300 ease-in-out" onClick={() => router.back()}>
        <Back /> Back
      </button>
      <div className="bg-primary rounded-tr-xl rounded-tl-xl py-2.5 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <Badge color="primary" className="text-xs font-semibold">
            Multiple
          </Badge>
          <Badge
            color={statusColorMap[status as BetStatus]}
            className="text-xs font-semibold ml-2"
          >
            Won
          </Badge>
        </div>
        <div className="flex items-center gap-2 font-medium text-sm">
          <p className="text-muted">26/03/2025</p>
          <p className="text-muted">Finished</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full py-4 px-5 mb-6">
        <div className="flex gap-3 flex-col">
          <p className="text-muted">Total Odds</p>
          <p className="font-medium">2.14</p>
        </div>
        <div className="flex gap-3 flex-col">
          <p className="text-muted">Total Stake</p>
          <div className="flex items-center gap-2">
            <XFI className="size-5" />
            <p className="font-medium">2.14 XFI</p>
          </div>
        </div>
        <div className="flex gap-3 flex-col">
          <p className="text-muted">Total Return</p>
          <div className="flex items-center gap-2">
            <XFI className="size-5" />
            <p className="font-medium">2.14 XFI</p>
          </div>
        </div>
      </div>
      <SingleBet
        index={1}
        homeTeam="Newcastle United"
        awayTeam="Real Madrid"
        homeScore={0}
        awayScore={0}
        pick="Away@2.14"
        market="1x2"
        result="Away"
        outcome="Won"
      />
    </div>
  );
}

type SingleBetProps = {
  index: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | string;
  awayScore: number | string;
  pick: string;
  market: string;
  result: string;
  outcome: "Won" | "Lost"; // can extend to "Pending", etc.
};

function SingleBet({
  index,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  pick,
  market,
  result,
  outcome,
}: SingleBetProps) {
  return (
    <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between h-full">
      <div className="flex items-center w-1/2 gap-14">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-6 rounded-md bg-[#3475DA4A] font-medium">
            {index}
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 font-medium mb-2 w-48">
              <p className="text-sm whitespace-pre-line w-[130px] truncate">
                {homeTeam}
              </p>
              <p className="text-sm whitespace-pre-line text-right">
                {homeScore}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 font-medium mb-2 w-48">
              <p className="text-sm whitespace-pre-line w-[130px] truncate">
                {awayTeam}
              </p>
              <p className="text-sm whitespace-pre-line text-right">
                {awayScore}
              </p>
            </div>
          </div>
        </div>

        <Badge color={outcome === "Won" ? "green" : "red"}>{outcome}</Badge>
      </div>

      <div className="w-1/2 flex items-center gap-3">
        <div className="p-3 w-full bg-primary rounded-xl font-medium">
          <p className="text-sm text-muted">Pick</p>
          <div className="flex items-center gap-2 mt-2">{pick}</div>
        </div>
        <div className="p-3 w-full bg-primary rounded-xl font-medium">
          <p className="text-sm text-muted">Market</p>
          <div className="flex items-center gap-2 mt-2 w-full justify-between">
            <div className="flex items-center gap-2">{market}</div>
          </div>
        </div>
        <div className="p-3 w-full bg-[#244166] rounded-xl font-medium">
          <p className="text-sm text-muted">Result</p>
          <div className="flex items-center gap-2 mt-2 w-full justify-between">
            <div className="flex items-center gap-2">{result}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
