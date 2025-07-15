export const queryKeys = {
  user: {
    user: ["user"] as const,
    saveUser: ["save-user"] as const,
  },
  matches: {
    allMatches: ["all-matches"] as const,
    single: ["single-matches"] as const,
  },
  bets: {
    unclaimed: ["unclaimed-bet"] as const,
    claimed: ["claimed-bet"] as const,
    bets: ["bets"] as const,
  },
};
