import React, { useEffect, useState } from "react";
import { BetCard } from "./components/bet-card";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "../app/component/tabs/tabs.snippets";
import {
  useUserBetsQuery,
  useUserChainInfo,
  useUserClaimedBetsQuery,
  useUserDBQuery,
  useUserLostBetsQuery,
  useUserUnclaimedBetsQuery,
} from "../query";
import { useRouter } from "next/router";
import { User } from "@/utils/types/user/user.types";
import { SingleBetSlip } from "@/utils/types/bet/bets.type";
import { Header } from "./components/header";
import { getActiveChainDetails } from "@/utils/configs/global";
import Head from "next/head";
import { getFormatAddress } from "../app/utils";

export interface AllBets extends SingleBetSlip {
  tag?: string;
  status?: string;
}

type Tab =
  | "all"
  | "settled"
  | "unsettled"
  | "claimed"
  | "unclaimed"
  | "won"
  | "lost";

function EmptyTabMessage({ tab }: { tab: Tab }) {
  const copy: Record<Tab, string> = {
    all: "You haven’t placed any bets yet.",
    settled: "No settled bets yet.",
    unsettled: "No running bets at the moment.",
    claimed: "No claimed winnings yet.",
    unclaimed: "No unclaimed winnings. Nice!",
    won: "No winning bets yet.",
    lost: "No lost bets. Keep it up!",
  };

  return (
    <div className="py-10 text-center text-sm text-muted">
      {copy[tab] ?? "No data."}
    </div>
  );
}
export function ProfilePage() {
  const { account, activeChain } = useUserChainInfo();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const { logo: chainLogo, symbol: chainSymbol } = getActiveChainDetails(
    activeChain?.id
  );

  const { data: userDBInfo } = useUserDBQuery();
  const {
    crossfiTotalWagered,
    crossfiTotalWon,
    crossfiWinCount,
    crossfiLossCount,
    bnbTotalWagered,
    bnbTotalWon,
    bnbWinCount,
    bnbLossCount,
  } = (userDBInfo as User) || {};

  let winCount, lossCount, totalWagered, totalWon;

  if (chainSymbol === "XFI") {
    (winCount = crossfiWinCount),
      (lossCount = crossfiLossCount),
      (totalWagered = crossfiTotalWagered),
      (totalWon = crossfiTotalWon);
  } else {
    winCount = bnbWinCount;
    lossCount = bnbLossCount;
    totalWagered = bnbTotalWagered;
    totalWon = bnbTotalWon;
  }

  const { data: userLostBets, isLoading: isUserLostBetsLoading } =
    useUserLostBetsQuery();
  const { data: userUnclaimedBets, isLoading: isUserUnclaimedBetsLoading } =
    useUserUnclaimedBetsQuery();
  const { data: userClaimedBets, isLoading: isUserClaimedBetsLoading } =
    useUserClaimedBetsQuery();
  const { data: userBets, isLoading: isUserBetsLoading } = useUserBetsQuery();

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

    return combinedBets
      .filter((bets) => {
        return bets.betSelection.length !== 0;
      })
      .reverse();
  }, [userBets, userClaimedBets, userUnclaimedBets, userLostBets]);

  // Filter bets based on active tab
  const filteredBets = React.useMemo(() => {
    switch (activeTab) {
      case "all":
        return allBets;
      case "settled":
        return allBets.filter(
          (bet) =>
            bet.tag === "claimed" ||
            bet.tag === "unclaimed" ||
            bet.tag === "lost"
        );
      case "unsettled":
        return allBets.filter((bet) => bet.tag === "unsettled");
      case "claimed":
        return allBets.filter((bet) => bet.tag === "claimed");
      case "unclaimed":
        return allBets.filter((bet) => bet.tag === "unclaimed");
      case "won":
        return allBets.filter(
          (bet) => bet.tag === "claimed" || bet.tag === "unclaimed"
        );
      case "lost":
        return allBets.filter((bet) => bet.tag === "lost");
      default:
        return allBets;
    }
  }, [allBets, activeTab]);

  const isLoading =
    isUserBetsLoading ||
    isUserClaimedBetsLoading ||
    isUserUnclaimedBetsLoading ||
    isUserLostBetsLoading;

  // useEffect(() => {
  //   if (!account) {
  //     router.push("/");
  //   }
  // }, [account]);

  return (
    <div className="px-6 py-4 text-white">
      <Head>
        <title>
          Crossbet - Profile: {getFormatAddress(account?.address!)} - Bet
          smarter, win faster.
        </title>
        <meta name="description" content={`one bet can change everything`} />
      </Head>

      {/* Header */}
      <Header
        totalWon={totalWon}
        totalWagered={totalWagered}
        chainSymbol={chainSymbol}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Bets</h1>
      </div>

      {/* Tabs */}
      <TabsRoot
        defaultValue="all"
        onValueChange={(value) => setActiveTab(value as Tab)}
        className="mt-6"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger disabled={isLoading} value="all">
              All
            </TabsTrigger>
            <TabsTrigger disabled={isLoading} value="settled">
              Settled
            </TabsTrigger>
            <TabsTrigger disabled={isLoading} value="unsettled">
              Unsettled
            </TabsTrigger>
            <TabsTrigger disabled={isLoading} value="claimed">
              Claimed
            </TabsTrigger>
            <TabsTrigger disabled={isLoading} value="unclaimed">
              Unclaimed
            </TabsTrigger>
            <TabsTrigger disabled={isLoading} value="won">
              Won
            </TabsTrigger>
            <TabsTrigger disabled={isLoading} value="lost">
              Lost
            </TabsTrigger>
          </TabsList>
          {activeTab === "all" && (
            <div className="flex items-center gap-3 text-sm">
              {isLoading ? (
                <>
                  <div className="bg-gray-700 h-6 w-16 rounded-md animate-pulse" />
                  <div className="bg-gray-700 h-6 w-16 rounded-md animate-pulse" />
                  <div className="bg-gray-700 h-6 w-20 rounded-md animate-pulse" />
                </>
              ) : (
                <>
                  <span className="bg-[#14AE5C33] text-[#14AE5C] px-2 py-1 rounded-md border border-[#14AE5C]">
                    Wins: {winCount}
                  </span>
                  <span className="bg-[#EC221F33] text-[#EC221F] px-2 py-1 rounded-md border border-[#EC221F]">
                    Losses: {lossCount}
                  </span>
                  <span className="bg-[#E8B9311A] text-[#E8B931] px-2 py-1 rounded-md border border-[#E8B931]">
                    Running: {userBets?.length || 0}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* All Bets */}
        <TabsContent value="all">
          <div className="mt-6 flex flex-col gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <BetCardSkeleton key={i} />
              ))
            ) : filteredBets.length === 0 ? (
              <EmptyTabMessage tab={activeTab} />
            ) : (
              filteredBets.map((bet, index) => <BetCard key={index} {...bet} />)
            )}
          </div>
        </TabsContent>

        {/* Settled Bets */}
        <TabsContent value="settled">
          <div className="mt-6 flex flex-col gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <BetCardSkeleton key={i} />
              ))
            ) : filteredBets.length === 0 ? (
              <EmptyTabMessage tab={activeTab} />
            ) : (
              filteredBets.map((bet, index) => <BetCard key={index} {...bet} />)
            )}
          </div>
        </TabsContent>

        {/* Unsettled Bets */}
        <TabsContent value="unsettled">
          <div className="mt-6 flex flex-col gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <BetCardSkeleton key={i} />
              ))
            ) : filteredBets.length === 0 ? (
              <EmptyTabMessage tab={activeTab} />
            ) : (
              filteredBets.map((bet, index) => <BetCard key={index} {...bet} />)
            )}
          </div>
        </TabsContent>

        {/* Claimed Bets */}
        <TabsContent value="claimed">
          <div className="mt-6 flex flex-col gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <BetCardSkeleton key={i} />
              ))
            ) : filteredBets.length === 0 ? (
              <EmptyTabMessage tab={activeTab} />
            ) : (
              filteredBets.map((bet, index) => <BetCard key={index} {...bet} />)
            )}
          </div>
        </TabsContent>

        {/* Unclaimed Bets */}
        <TabsContent value="unclaimed">
          <div className="mt-6 flex flex-col gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <BetCardSkeleton key={i} />
              ))
            ) : filteredBets.length === 0 ? (
              <EmptyTabMessage tab={activeTab} />
            ) : (
              filteredBets.map((bet, index) => <BetCard key={index} {...bet} />)
            )}
          </div>
        </TabsContent>

        {/* Won Bets */}
        <TabsContent value="won">
          <div className="mt-6 flex flex-col gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <BetCardSkeleton key={i} />
              ))
            ) : filteredBets.length === 0 ? (
              <EmptyTabMessage tab={activeTab} />
            ) : (
              filteredBets.map((bet, index) => <BetCard key={index} {...bet} />)
            )}
          </div>
        </TabsContent>

        {/* Lost Bets */}
        <TabsContent value="lost">
          <div className="mt-6 flex flex-col gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <BetCardSkeleton key={i} />
              ))
            ) : filteredBets.length === 0 ? (
              <EmptyTabMessage tab={activeTab} />
            ) : (
              filteredBets.map((bet, index) => <BetCard key={index} {...bet} />)
            )}
          </div>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

function BetCardSkeleton() {
  return (
    <div className="max-h-[140px] h-full w-full animate-pulse">
      <div className="bg-primary rounded-tr-xl rounded-tl-xl py-2.5 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <div className="bg-gray-700 w-20 h-4 rounded-md" />
          <div className="bg-gray-700 w-20 h-4 rounded-md" />
        </div>
        <div className="flex items-center gap-2 font-medium text-sm">
          <div className="bg-gray-700 w-20 h-4 rounded-md" />
          <div className="bg-gray-700 w-20 h-4 rounded-md" />
          <div className="bg-gray-700 w-20 h-4 rounded-md" />
        </div>
      </div>
      <div className="bg-white/10 rounded-br-xl rounded-bl-xl p-4 flex items-center justify-between h-full">
        <div className="bg-gray-700 w-40 h-4 rounded-md" />
        <div className="w-1/2 flex items-center gap-3">
          <div className="p-3 w-full bg-primary rounded-xl font-medium">
            <div className="bg-gray-700 w-20 h-4 rounded-md" />
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-gray-700 w-5 h-5 rounded-full" />
              <div className="bg-gray-700 w-20 h-4 rounded-md" />
            </div>
          </div>
          <div className="p-3 w-full bg-primary rounded-xl font-medium">
            <div className="bg-gray-700 w-20 h-4 rounded-md" />
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-gray-700 w-5 h-5 rounded-full" />
              <div className="bg-gray-700 w-20 h-4 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
