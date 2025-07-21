import { SelectedOutcome } from "../matches/matches.type";

export type BetPlaced = {
  betId: number;
  bettor: string;
  amount: number;
  totalOdds: number;
  matchIds: number[];
};

export type BetSlipResponse = {
  data: {
    betSlip: BetSlip;
    betSelection: BetSelection;
  }[];
  success: boolean;
};

export type SingleBetSlip = {
  betSlip: BetSlip;
  betSelection: BetSelection;
};

export type BetSelection = {
  _id: string;
  betSlipId: string;
  matchId: number;
  selectedOutcome: SelectedOutcome;
  oddsAtPlacement: number;
  selectionResult: SelectionResult;
  matchResult: MatchResult;
  homeTeam: string;
  awayTeam: string;
  matchStartTime: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}[];

export type SelectionResult = "won" | "lost" | "void" | "pending";
export type MatchResult = "pending" | "home" | "away" | "draw";

export type BetSlip = {
  claimSignature: string;
  _id: string;
  userAddress: `0x${string}`;
  betSlipId: number;
  totalOdds: number;
  totalBetAmount: number;
  expectedPayment: number;
  betSlipResult: "won" | "lost" | "pending" | "voided";
  status: "pending" | "resolved" | "claimed";
  isClaimed: boolean;
  placedAt: string;
  actualWinnings: number;
  blockchain: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  resolvedAt?: string;
};
