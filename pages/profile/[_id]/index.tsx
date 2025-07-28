import { Badge } from "@/modules/app/component/badge";
import {
  BetStatus,
  statusColorMap,
} from "@/modules/profile/components/bet-card";
import { useRouter } from "next/router";
import Back from "@/assets/back.svg";
import React from "react";
import { useGetSingleFixtureQuery, useSingleBetQuery } from "@/modules/query";
import { getActiveChainDetails } from "@/utils/configs/global";
import { chains } from "@/modules/blockchain";
import Head from "next/head";

export default function BetPage() {
  const router = useRouter();
  const { _id } = router.query;

  if (!router.isReady) return <p>Loading...</p>; // ensures `_id` is available

  const { data: singleBet, isLoading: isSingleBetLoading } = useSingleBetQuery(
    _id as string
  );
  const { betSelection, betSlip } = singleBet || {};
  const mode = betSelection?.length === 1 ? "Single" : "Multiple";

  // Get chain details for logo and symbol
  const chain = betSlip?.blockchain as "bsc" | "crossfi";
  const activeChain = chains.find((chainItem) => chainItem.chain === chain);
  const { logo, symbol } = getActiveChainDetails(activeChain?.id);

  // Determine status
  const status =
    betSlip?.betSlipResult === "pending"
      ? "Running"
      : betSlip?.betSlipResult === "won"
      ? "Won"
      : "Lost";

  console.log({ singleBet });

  return (
    <div className="p-6 md:px-8 px-4 max-w-[1440px] mx-auto">
      <Head>
        <title>Crossbet - Bet smarter, win faster.</title>
        <meta name="description" content={`one bet can change everything`} />
      </Head>
      <button
        className="flex items-center gap-2 mb-6 text-muted hover:text-white transition-all duration-300 ease-in-out"
        onClick={() => router.back()}
      >
        <Back /> Back
      </button>
      {isSingleBetLoading || !router.isReady ? (
        <>
          {/* Header skeleton */}
          <div className="bg-primary rounded-tr-xl rounded-tl-xl py-2.5 px-3 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 h-5 w-16 rounded-md" />
              <div className="bg-white/20 h-5 w-12 rounded-md ml-2" />
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 h-4 w-20 rounded-md" />
              <div className="bg-white/20 h-4 w-16 rounded-md" />
            </div>
          </div>

          {/* Stats section skeleton */}
          <div className="flex items-center justify-between w-full py-4 px-5 mb-6">
            <div className="flex gap-3 flex-col">
              <div className="bg-white/10 h-4 w-20 rounded-md animate-pulse" />
              <div className="bg-white/20 h-5 w-12 rounded-md animate-pulse" />
            </div>
            <div className="flex gap-3 flex-col">
              <div className="bg-white/10 h-4 w-24 rounded-md animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="bg-white/20 h-5 w-5 rounded-md animate-pulse" />
                <div className="bg-white/20 h-5 w-16 rounded-md animate-pulse" />
              </div>
            </div>
            <div className="flex gap-3 flex-col">
              <div className="bg-white/10 h-4 w-24 rounded-md animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="bg-white/20 h-5 w-5 rounded-md animate-pulse" />
                <div className="bg-white/20 h-5 w-16 rounded-md animate-pulse" />
              </div>
            </div>
          </div>

          {/* Single bet skeleton */}
          <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between h-full animate-pulse">
            <div className="flex items-center w-1/2 gap-14">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 size-6 rounded-md" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 w-48">
                    <div className="bg-white/20 h-4 w-32 rounded-md" />
                    <div className="bg-white/20 h-4 w-6 rounded-md" />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-2 w-48">
                    <div className="bg-white/20 h-4 w-32 rounded-md" />
                    <div className="bg-white/20 h-4 w-6 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="bg-white/20 h-6 w-12 rounded-md" />
            </div>
            <div className="w-1/2 flex items-center gap-3">
              <div className="p-3 w-full bg-primary rounded-xl">
                <div className="bg-white/20 h-4 w-12 rounded-md mb-2" />
                <div className="bg-white/20 h-4 w-16 rounded-md" />
              </div>
              <div className="p-3 w-full bg-primary rounded-xl">
                <div className="bg-white/20 h-4 w-16 rounded-md mb-2" />
                <div className="bg-white/20 h-4 w-12 rounded-md" />
              </div>
              <div className="p-3 w-full bg-[#244166] rounded-xl">
                <div className="bg-white/20 h-4 w-16 rounded-md mb-2" />
                <div className="bg-white/20 h-4 w-12 rounded-md" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="bg-primary rounded-tr-xl rounded-tl-xl py-2.5 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Badge color="primary" className="text-xs font-semibold">
                {mode}
              </Badge>
              <Badge
                color={statusColorMap[status as BetStatus]}
                className="text-xs font-semibold ml-2 first-letter:uppercase"
              >
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 font-medium text-sm">
              <p className="text-muted">
                {new Date(betSlip?.placedAt || "").toLocaleDateString()}
              </p>
              <p className="text-muted">
                {new Date(betSlip?.placedAt || "").toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full py-4 px-5 mb-6">
            <div className="flex gap-3 flex-col">
              <p className="text-muted">Total Odds</p>
              <p className="font-medium">{betSlip?.totalOdds}</p>
            </div>
            <div className="flex gap-3 flex-col">
              <p className="text-muted">Total Stake</p>
              <div className="flex items-center gap-2">
                {logo}
                <p className="font-medium">
                  {betSlip?.totalBetAmount} {symbol}
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-col">
              <p className="text-muted">Total Return</p>
              <div className="flex items-center gap-2">
                {logo}
                <p className="font-medium">
                  {betSlip?.expectedPayment} {symbol}
                </p>
              </div>
            </div>
          </div>
          {betSelection?.map((selection, index) => (
            <SingleBet
              key={selection._id}
              index={index + 1}
              homeTeam={selection.homeTeam}
              awayTeam={selection.awayTeam}
              // homeScore={0} // This would need to come from match data
              // awayScore={0} // This would need to come from match data
              matchId={selection.matchId}
              pick={`${selection.selectedOutcome}@${selection.oddsAtPlacement}`}
              market="1x2"
              result={selection.matchResult}
              outcome={
                selection.selectionResult === "won"
                  ? "Won"
                  : selection.selectionResult === "lost"
                  ? "Lost"
                  : "Pending"
              }
              router={router}
            />
          ))}
        </>
      )}
    </div>
  );
}

type SingleBetProps = {
  index: number;
  homeTeam: string;
  awayTeam: string;
  pick: string;
  market: string;
  matchId: number;
  result: string;
  outcome: "Won" | "Lost" | "Pending"; // can extend to "Pending", etc.
  router: any; // NextRouter type
};

function SingleBet({
  index,
  homeTeam,
  awayTeam,
  pick,
  market,
  matchId,
  result,
  outcome,
  router,
}: SingleBetProps) {
  const { data: singleFixture } = useGetSingleFixtureQuery(matchId);
  console.log({ singleFixture });

  return (
    <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between h-full">
      <div className="flex items-center w-1/2 gap-14">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-6 rounded-md bg-[#3475DA4A] font-medium">
            {index}
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 font-medium mb-2 w-48">
              <button
                onClick={() => router.push(`/match/${matchId}`)}
                className="text-sm whitespace-pre-line w-[130px] truncate text-left hover:text-blue-400 transition-colors duration-200 cursor-pointer"
              >
                {homeTeam}
              </button>
              <p className="text-sm whitespace-pre-line text-right">
                click to view score
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 font-medium mb-2 w-48">
              <button
                onClick={() => router.push(`/match/${matchId}`)}
                className="text-sm whitespace-pre-line w-[130px] truncate text-left hover:text-blue-400 transition-colors duration-200 cursor-pointer"
              >
                {awayTeam}
              </button>
              <p className="text-sm whitespace-pre-line text-right">
                click to view score
              </p>
            </div>
          </div>
        </div>

        <Badge
          color={
            outcome === "Won"
              ? "green"
              : outcome === "Lost"
              ? "red"
              : "secondary"
          }
        >
          {outcome}
        </Badge>
      </div>

      <div className="w-1/2 flex items-center gap-3">
        <div className="p-3 w-full bg-primary rounded-xl font-medium">
          <p className="text-sm text-muted">Pick</p>
          <div className="flex items-center gap-2 mt-2 uppercase">{pick}</div>
        </div>
        <div className="p-3 w-full bg-primary rounded-xl font-medium">
          <p className="text-sm text-muted">Market</p>
          <div className="flex items-center gap-2 mt-2 w-full justify-between">
            <div className="flex items-center gap-2 uppercase">{market}</div>
          </div>
        </div>
        <div className="p-3 w-full bg-[#244166] rounded-xl font-medium">
          <p className="text-sm text-muted">Result</p>
          <div className="flex items-center gap-2 mt-2 w-full justify-between">
            <div className="flex items-center gap-2 uppercase">{result}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
