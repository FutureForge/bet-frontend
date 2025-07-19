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
  totalStake: number; // For multiple bets
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
  updateTotalStake: (value: number) => void;
  setMode: (mode: "single" | "multiple") => void;
  clearSelections: () => void;
};

export const useBetSlipStore = create<BetSlipStore>()(
  persist(
    (set, get) => ({
      selections: [],
      mode: "single",
      totalStake: 0,
      addSelection: (selection) => {
        const { selections, mode } = get();

        // Check if this exact selection already exists
        const exists = selections.find(
          (s) =>
            s.matchId === selection.matchId &&
            s.selectedOutcome === selection.selectedOutcome
        );

        // If selection exists, remove it (toggle behavior)
        if (exists) {
          const newSelections = selections.filter(
            (s) =>
              !(
                s.matchId === selection.matchId &&
                s.selectedOutcome === selection.selectedOutcome
              )
          );
          
          // Auto-determine mode based on remaining selections
          const newMode = newSelections.length <= 1 ? "single" : "multiple";
          set({ selections: newSelections, mode: newMode });
          return;
        }

        // For single mode: allow multiple selections but only one per match
        if (mode === "single") {
          const existingSelectionForMatch = selections.find(
            (sel) => sel.matchId === selection.matchId
          );
          if (existingSelectionForMatch) {
            // Replace the existing selection for this match
            const newSelections = selections.map((s) =>
              s.matchId === selection.matchId ? selection : s
            );
            set({ selections: newSelections, mode: "single" });
            return;
          }
        }

        // For multiple mode: only allow one selection per match
        if (mode === "multiple") {
          const existingSelectionForMatch = selections.find(
            (sel) => sel.matchId === selection.matchId
          );
          if (existingSelectionForMatch) {
            // Replace the existing selection for this match
            const newSelections = selections.map((s) =>
              s.matchId === selection.matchId ? selection : s
            );
            set({ selections: newSelections, mode: "multiple" });
            return;
          }
        }

        // Add new selection
        const newSelections = [...selections, selection];
        
        // Auto-determine mode based on selection count
        const newMode = newSelections.length <= 1 ? "single" : "multiple";
        
        set({ selections: newSelections, mode: newMode });
      },
      removeSelection: (matchId, outcome) => {
        const newSelections = get().selections.filter(
          (s) => !(s.matchId === matchId && s.selectedOutcome === outcome)
        );
        
        // Auto-determine mode based on remaining selections
        const newMode = newSelections.length <= 1 ? "single" : "multiple";
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
      updateTotalStake: (value) => {
        set({ totalStake: value });
      },
      setMode: (mode) => {
        const { selections } = get();
        
        if (mode === "single") {
          // In single mode, keep all selections but ensure only one per match
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
        
        if (mode === "multiple") {
          // In multiple mode, ensure only one selection per match
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
        
        set({ mode });
      },
      clearSelections: () => set({ selections: [], mode: "single", totalStake: 0 }),
    }),
    {
      name: "bet-slip-storage", // localStorage key
    }
  )
);
