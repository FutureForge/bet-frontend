import React, { useEffect, useState } from "react";
import { BetCard } from "./components/bet-card";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "../app/component/tabs/tabs.snippets";

type Tab = "all" | "settled" | "unsettled";

const mockBets = [
  {
    id: 1,
    mode: "Single",
    status: "Running" as const,
    match: "Newcastle United v Real Madrid",
    stake: "2,230 XFI",
    returnAmount: "2,230,238 XFI",
    date: "26/03/2025",
    time: "08:43",
    chain: "bsc" as const,
  },
  {
    id: 2,
    mode: "Multiple",
    status: "Won" as const,
    match:
      "Newcastle United v Real Madrid\nNewcastle United v Real Madrid\nand 4 others",
    stake: "2,230 XFI",
    returnAmount: "2,230,238 XFI",
    date: "26/03/2025",
    time: "Finished",
    chain: "crossfi" as const,
  },
  {
    id: 3,
    mode: "Single",
    status: "Lost" as const,
    match: "Newcastle United v Real Madrid",
    stake: "2,230 XFI",
    returnAmount: "2,230,238 XFI",
    date: "26/03/2025",
    time: "Finished",
    chain: "crossfi" as const,
  },
  {
    id: 4,
    mode: "Multiple",
    status: "Won" as const,
    match:
      "Newcastle United v Real Madrid\nNewcastle United v Real Madrid\nand 4 others",
    stake: "2,230 XFI",
    returnAmount: "2,230,238 XFI",
    date: "26/03/2025",
    time: "Finished",
    chain: "crossfi" as const,
  },
];

const settledBets = mockBets.filter((bet) => bet.status !== "Running");
const unsettledBets = mockBets.filter((bet) => bet.status === "Running");

export function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-6 py-4 text-white">
      {/* Header */}
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
            <TabsTrigger disabled={loading} value="all">
              All
            </TabsTrigger>
            <TabsTrigger disabled={loading} value="settled">
              Settled
            </TabsTrigger>
            <TabsTrigger disabled={loading} value="unsettled">
              Unsettled
            </TabsTrigger>
          </TabsList>
          {activeTab === "all" && (
            <div className="flex items-center gap-3 text-sm">
              {loading ? (
                <>
                  <div className="bg-gray-700 h-6 w-16 rounded-md animate-pulse" />
                  <div className="bg-gray-700 h-6 w-16 rounded-md animate-pulse" />
                  <div className="bg-gray-700 h-6 w-20 rounded-md animate-pulse" />
                </>
              ) : (
                <>
                  <span className="bg-[#14AE5C33] text-[#14AE5C] px-2 py-1 rounded-md border border-[#14AE5C]">
                    Wins: 7
                  </span>
                  <span className="bg-[#EC221F33] text-[#EC221F] px-2 py-1 rounded-md border border-[#EC221F]">
                    Losses: 5
                  </span>
                  <span className="bg-[#E8B9311A] text-[#E8B931] px-2 py-1 rounded-md border border-[#E8B931]">
                    Running: 2
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* All Bets */}
        <TabsContent value="all">
          <div className="mt-6 flex flex-col gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <BetCardSkeleton key={i} />
                ))
              : mockBets.map((bet) => <BetCard key={bet.id} {...bet} />)}
          </div>
        </TabsContent>

        {/* Settled Bets */}
        <TabsContent value="settled">
          <div className="mt-6 flex flex-col gap-8">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <BetCardSkeleton key={i} />
                ))
              : settledBets.map((bet) => <BetCard key={bet.id} {...bet} />)}
          </div>
        </TabsContent>

        {/* Unsettled Bets */}
        <TabsContent value="unsettled">
          <div className="mt-6 flex flex-col gap-8">
            {loading
              ? Array.from({ length: 1 }).map((_, i) => (
                  <BetCardSkeleton key={i} />
                ))
              : unsettledBets.map((bet) => <BetCard key={bet.id} {...bet} />)}
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
