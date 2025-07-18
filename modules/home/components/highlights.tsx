import { Popover } from "@/modules/app/component/popover";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/modules/app/component/tabs/tabs.snippets";
import Title from "@/modules/app/component/title";
import { useGetAllFixtureQuery, useUserChainInfo } from "@/modules/query";
import React, { useMemo } from "react";
import BetSlip from "@/assets/bet-slip.svg";
import Caret from "@/assets/caret.svg";
import Xmark from "@/assets/xmark.svg";
import { EmptyMessage } from "./emptyMessage";
import XFI from "@/assets/xfi.svg";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { chain1, chain2, client } from "@/utils/configs";
import dayjs from "dayjs";
import {
  CountryData,
  Fixture,
  SelectedOutcome,
} from "@/utils/types/matches/matches.type";
import { useBetSlipStore } from "../stores";
import { Checkbox } from "@/modules/app/component/checkbox";
import { ScrollArea } from "@/modules/app/scroll-area/scroll-area";
import { Button } from "@/modules/app/component/button";

const choices = ["Single", "Multiple"];

export default function Highlights() {
  const { account } = useUserChainInfo();
  const { data: allFixtures } = useGetAllFixtureQuery() as {
    data?: CountryData[];
  };

  const { groupedByDate, tabs, sortedDateKeys } = useMemo(() => {
    if (!allFixtures)
      return { groupedByDate: {}, tabs: [], sortedDateKeys: [] };

    const dateMap: Record<string, Record<string, Fixture[]>> = {};

    allFixtures.forEach((countryBlock: CountryData) => {
      countryBlock.fixtures.forEach((fixture: Fixture) => {
        const dateKey = dayjs(fixture.date).format("YYYY-MM-DD");
        if (!dateMap[dateKey]) dateMap[dateKey] = {};
        if (!dateMap[dateKey][fixture.leagueCountry])
          dateMap[dateKey][fixture.leagueCountry] = [];
        dateMap[dateKey][fixture.leagueCountry].push(fixture);
      });
    });

    const today = dayjs().format("YYYY-MM-DD");

    // Generate next 6 days from today
    const next6Days = Array.from({ length: 6 }, (_, i) =>
      dayjs()
        .add(i + 1, "day")
        .format("YYYY-MM-DD")
    );

    // Create array of dates starting with today, then next 6 days
    const targetDates = [today, ...next6Days];

    // Filter to only include dates that have fixtures, but prioritize the target dates
    const availableDates = Object.keys(dateMap).sort();
    const finalDates = targetDates.filter((date) =>
      availableDates.includes(date)
    );

    // If we don't have enough dates from our target range, fill with other available dates
    const remainingDates = availableDates.filter(
      (date) => !targetDates.includes(date)
    );
    const allDates = [...finalDates, ...remainingDates].slice(0, 7); // Max 7 tabs

    const tabLabels = allDates.map((date) =>
      date === today ? "Today" : dayjs(date).format("MMM DD")
    );

    return {
      groupedByDate: dateMap,
      tabs: tabLabels,
      sortedDateKeys: allDates,
    };
  }, [allFixtures]);

  const {
    selections,
    addSelection,
    removeSelection,
    clearSelections,
    updateStake,
    mode,
  } = useBetSlipStore();

  const outcomeOptions = [
    { key: "home" as SelectedOutcome, label: "Home" },
    { key: "draw" as SelectedOutcome, label: "Draw" },
    { key: "away" as SelectedOutcome, label: "Away" },
  ];

  // Check if Multiple tab should be disabled
  const hasMultipleSelectionsFromSameFixture = useMemo(() => {
    const fixtureSelectionCount = selections.reduce((acc, selection) => {
      acc[selection.matchId] = (acc[selection.matchId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.values(fixtureSelectionCount).some((count) => count > 1);
  }, [selections]);

  // Check if selection should be disabled in multiple mode
  const isSelectionDisabled = (matchId: number, outcome: SelectedOutcome) => {
    if (mode !== "multiple") return false;

    const existingSelectionForMatch = selections.find(
      (sel) => sel.matchId === matchId
    );
    const isCurrentSelection = selections.some(
      (sel) => sel.matchId === matchId && sel.selectedOutcome === outcome
    );

    // Disable if there's already a selection for this match and it's not the current selection
    return existingSelectionForMatch && !isCurrentSelection;
  };

  const handleAddSelection = (selection: {
    matchId: number;
    homeTeam: string;
    awayTeam: string;
    selectedOutcome: SelectedOutcome;
    odds: number;
  }) => {
    // In multiple mode, prevent adding if there's already a selection for this match
    if (mode === "multiple") {
      const existingSelectionForMatch = selections.find(
        (sel) => sel.matchId === selection.matchId
      );
      const isCurrentSelection = selections.some(
        (sel) =>
          sel.matchId === selection.matchId &&
          sel.selectedOutcome === selection.selectedOutcome
      );

      if (existingSelectionForMatch && !isCurrentSelection) {
        return; // Don't add selection
      }
    }

    addSelection(selection);
  };
  const totalOdds = useMemo(() => {
    if (mode !== "multiple" || selections.length === 0) return 0;

    // Multiply odds but ignore zero odds (invalid matches)
    const validOdds = selections
      .map((sel) => sel.odds)
      .filter((odds) => odds > 0);

    if (validOdds.length === 0) return 0;

    return validOdds.reduce((acc, odds) => acc * odds, 1);
  }, [mode, selections]);

  // Default stake for calculation (use actual input later)
  const stake = 0.5;

  // Calculate estimated payout safely
  const estimatedPayout = useMemo(() => {
    if (totalOdds <= 0 || stake <= 0) return 0;
    return (totalOdds * stake).toFixed(2);
  }, [totalOdds, stake]);
  const betDetails = [
    {
      label: "Total Odds",
      value: totalOdds > 0 ? totalOdds.toFixed(2) : "0.00",
    },
    {
      label: "Total Stake",
      value: stake.toFixed(2),
    },
    {
      label: "Est payout",
      value: estimatedPayout,
    },
  ];
  return (
    <div className="flex gap-10 relative">
      {/* LEFT COLUMN */}
      <div className="w-[70%] flex flex-col gap-4">
        <Title title="Highlights" />

        <TabsRoot defaultValue="Today">
          <TabsList className="flex gap-2 mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {sortedDateKeys.map((dateKey, idx) => (
            <TabsContent key={dateKey} value={tabs[idx]} className="mt-4">
              <ScrollArea.Root className="h-[600px]">
                <div className="flex flex-col gap-6 max-h-[600px] scrollbar scrollbar-thin">
                  {Object.entries(groupedByDate[dateKey] || {}).map(
                    ([countryName, matches]) => (
                      <div key={countryName} className="rounded-lg p-4 bg-card">
                        {/* COUNTRY HEADER + 1 X 2 HEADING */}
                        <div className="flex justify-between px-3 bg-primary py-2.5 rounded-tr-xl rounded-tl-xl text-sm mb-2">
                          <span className="font-semibold">{countryName}</span>
                          <div className="grid grid-cols-3 gap-4 w-1/2 text-center">
                            <span>1</span>
                            <span>X</span>
                            <span>2</span>
                          </div>
                        </div>

                        {/* FIXTURES LIST */}
                        {matches.map((match) => (
                          <div
                            key={match.id}
                            className="flex items-center justify-between py-3 border-b border-gray-700 last:border-none"
                          >
                            {/* LEFT: TEAMS & TIME */}
                            <div className="flex items-start gap-4 w-1/2">
                              <div className="flex flex-col text-gray-400 text-xs">
                                <span>{match.time}</span>
                                {match.matchStats?.status && (
                                  <span>{match.matchStats.status}</span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white flex items-center gap-2">
                                  <img
                                    src={match.homeTeamLogo}
                                    alt={match.homeTeam}
                                    className="w-5 h-5"
                                  />
                                  {match.homeTeam}
                                </span>
                                <span className="text-white flex items-center gap-2">
                                  <img
                                    src={match.awayTeamLogo}
                                    alt={match.awayTeam}
                                    className="w-5 h-5"
                                  />
                                  {match.awayTeam}
                                </span>
                              </div>
                            </div>

                            {/* RIGHT: ODDS */}
                            <div className="grid grid-cols-3 gap-4 w-1/2">
                              {outcomeOptions.map((option) => {
                                const oddsValue =
                                  option.key === "home"
                                    ? match.prediction?.odds?.home
                                    : option.key === "draw"
                                    ? match.prediction?.odds?.draw
                                    : match.prediction?.odds?.away;

                                const isSelected = selections.some(
                                  (sel) =>
                                    sel.matchId === match.id &&
                                    sel.selectedOutcome === option.key
                                );

                                const isDisabled = isSelectionDisabled(
                                  match.id,
                                  option.key
                                );

                                return (
                                  <button
                                    key={option.key}
                                    onClick={() =>
                                      handleAddSelection({
                                        matchId: match.id,
                                        homeTeam: match.homeTeam,
                                        awayTeam: match.awayTeam,
                                        selectedOutcome: option.key,
                                        odds: oddsValue || 0,
                                      })
                                    }
                                    disabled={isDisabled}
                                    className={`flex flex-col rounded-md py-3 w-full text-left p-3 ${
                                      isSelected
                                        ? "bg-secondary"
                                        : isDisabled
                                        ? "bg-muted opacity-50 cursor-not-allowed"
                                        : "bg-primary hover:bg-secondary/85"
                                    }`}
                                  >
                                    <span className="font-semibold text-lg">
                                      {oddsValue || "-"}
                                    </span>
                                    <span className="text-sm">
                                      {option.key === "draw"
                                        ? "Draw"
                                        : option.key === "home"
                                        ? match.homeTeam
                                        : match.awayTeam}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </ScrollArea.Root>
            </TabsContent>
          ))}
        </TabsRoot>
      </div>

      {/* RIGHT COLUMN (Bet Slip) */}
      <div className="sticky flex-1" style={{ height: "626px" }}>
        <div className="bg-primary rounded-2xl border border-stroke relative overflow-y-hidden ">
          <div>
            <div className="flex items-center justify-between p-4 pb-0">
              <Popover.Root>
                <Popover.Trigger>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <BetSlip className="size-6" />
                    <p>Bet Slip</p>
                    <Caret className="size-5" />
                  </div>
                </Popover.Trigger>
                <Popover.Content>hello</Popover.Content>
              </Popover.Root>
              <button onClick={clearSelections}>
                <Xmark className="size-6" />
              </button>
            </div>

            <TabsRoot defaultValue={choices[0]} className="h-full">
              <TabsList>
                {choices.map((choice) => (
                  <TabsTrigger
                    key={choice}
                    value={choice}
                    variant="underline"
                    className="w-full h-[52px]"
                    disabled={
                      choice === "Multiple" &&
                      hasMultipleSelectionsFromSameFixture
                    }
                  >
                    {choice}
                  </TabsTrigger>
                ))}
              </TabsList>

              {choices.map((choice) => (
                <TabsContent key={choice} value={choice}>
                  <div className="flex justify-end mb-2 px-4">
                    <button
                      className="hover:opacity-85 transition-all duration-200 ease-in-out"
                      onClick={clearSelections}
                    >
                      Clear All
                    </button>
                  </div>

                  <ScrollArea.Root>
                    <div className="h-[330px] overflow-y-auto scrollbar-hide scrollbar scrollbar-thin scrollbar-none pb-20">
                      {selections.length === 0 ? (
                        <EmptyMessage />
                      ) : (
                        selections.map((sel, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-2 border-b border-b-stroke mb-2 "
                          >
                            <div className="flex flex-col justify-between p-4 gap-1">
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <Checkbox
                                    checked={true}
                                    label={sel.selectedOutcome}
                                  />
                                  <p className="font-semibold text-s capitalize"></p>
                                </div>

                                <button
                                  onClick={() =>
                                    removeSelection(
                                      sel.matchId,
                                      sel.selectedOutcome
                                    )
                                  }
                                >
                                  <Xmark className="size-4" />
                                </button>
                              </div>

                              <div className="flex items-center justify-between w-full">
                                <p className="text-xs text-gray-400">
                                  {sel.homeTeam} v {sel.awayTeam}
                                </p>
                                <p>1x2</p>
                              </div>
                            </div>

                            {/* Individual stake input for single mode */}
                            {choice === "Single" && (
                              <div className="px-4 pb-2">
                                <input
                                  type="number"
                                  className="w-full rounded-md border border-gray-700 bg-background px-2 py-1 text-sm"
                                  placeholder="Enter stake"
                                  value={sel.stake || ""}
                                  onChange={(e) =>
                                    updateStake(
                                      sel.matchId,
                                      sel.selectedOutcome,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea.Root>
                </TabsContent>
              ))}
            </TabsRoot>

            <div className="border-t border-t-stroke mt-auto sticky bottom-0 bg-primary">
              {/* Multiple mode stake input */}
              {mode === "multiple" && selections.length > 0 && (
                <div className="p-4 pb-0">
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-700 bg-background px-2 py-1 text-sm"
                    placeholder="Enter total stake"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 p-4 pb-0">
                {betDetails.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted">{detail.label}</span>
                    <span className="flex items-center gap-1">
                      {detail.value}{" "}
                      {detail.label !== "Total Odds" && (
                        <>
                          XFI
                          <XFI className="size-4" />
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center w-full p-4">
                {!account?.address ? (
                  <ConnectButton
                    client={client}
                    chains={[chain1, chain2]}
                    wallets={[createWallet("io.metamask")]}
                    connectButton={{
                      label: "Connect Wallet",
                      className:
                        "!font-instrument !rounded-xl !w-full !flex !items-center !justify-center hover:!scale-105 !duration-300 !ease-in-out !transition !bg-secondary !text-white !h-10",
                    }}
                  />
                ) : (
                  <div className="w-full">
                    <Button
                      disabled={selections.length === 0}
                      variant="primary"
                      className="rounded-xl w-full"
                      onClick={() => {
                        // Handle bet submission logic here
                        console.log("Bet submitted");
                      }}
                    >
                      Place Bet
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
