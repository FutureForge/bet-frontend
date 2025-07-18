import { create } from "zustand";
import { persist } from "zustand/middleware";

type Selection = {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  selectedOutcome: "home" | "away" | "draw";
  odds: number;
  stake?: number;
};

type BetSlipStore = {
  selections: Selection[];
  mode: "single" | "multiple";
  addSelection: (selection: Selection) => void;
  removeSelection: (
    matchId: number,
    outcome: Selection["selectedOutcome"]
  ) => void;
  updateStake: (
    matchId: number,
    outcome: Selection["selectedOutcome"],
    value: number
  ) => void;
  setMode: (mode: "single" | "multiple") => void;
  clearSelections: () => void;
};

export const useBetSlipStore = create<BetSlipStore>()(
  persist(
    (set, get) => ({
      selections: [],
      mode: "single",
      addSelection: (selection) => {
        const { selections, mode } = get();

        const exists = selections.find(
          (s) =>
            s.matchId === selection.matchId &&
            s.selectedOutcome === selection.selectedOutcome
        );

        // Toggle behavior
        let newSelections;
        if (exists) {
          newSelections = selections.filter(
            (s) =>
              !(
                s.matchId === selection.matchId &&
                s.selectedOutcome === selection.selectedOutcome
              )
          );
        } else {
          if (mode === "multiple") {
            const existingSelectionForMatch = selections.find(
              (sel) => sel.matchId === selection.matchId
            );
            if (existingSelectionForMatch) {
              return; // Don't add selection
            }
          }
          newSelections = [...selections, selection];
        }

        const matchIds = new Set(newSelections.map((s) => s.matchId));
        const newMode = matchIds.size <= 1 ? "single" : "multiple";

        set({ selections: newSelections, mode: newMode });
      },
      removeSelection: (matchId, outcome) => {
        const newSelections = get().selections.filter(
          (s) => !(s.matchId === matchId && s.selectedOutcome === outcome)
        );
        const matchIds = new Set(newSelections.map((s) => s.matchId));
        const newMode = matchIds.size <= 1 ? "single" : "multiple";
        set({ selections: newSelections, mode: newMode });
      },
      updateStake: (matchId, outcome, value) => {
        set((state) => ({
          selections: state.selections.map((s) =>
            s.matchId === matchId && s.selectedOutcome === outcome
              ? { ...s, stake: value }
              : s
          ),
        }));
      },
      setMode: (mode) => {
        const { selections } = get();
        if (mode === "multiple") {
          const fixtureSelectionCount = selections.reduce((acc, selection) => {
            acc[selection.matchId] = (acc[selection.matchId] || 0) + 1;
            return acc;
          }, {} as Record<number, number>);

          const hasMultipleFromSameFixture = Object.values(
            fixtureSelectionCount
          ).some((count) => count > 1);

          if (hasMultipleFromSameFixture) {
            const seenFixtures = new Set<number>();
            const filteredSelections = selections.filter((selection) => {
              if (seenFixtures.has(selection.matchId)) {
                return false;
              }
              seenFixtures.add(selection.matchId);
              return true;
            });

            set({ mode, selections: filteredSelections });
            return;
          }
        }

        set({ mode });
      },
      clearSelections: () => set({ selections: [], mode: "single" }),
    }),
    {
      name: "bet-slip-storage", // localStorage key
    }
  )
);
