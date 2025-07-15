import { Chains } from "@/modules/blockchain";

export type FootballData = {
  data: CountryData[];
  success: boolean;
};

export type SingleFootballData = {
  data: Fixture;
  success: boolean;
};

export type CountryData = {
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
    tableWidget: WidgetConfig;
  };
  fixtures: Fixture[];
};

export type Fixture = {
  id: number;
  date: string;
  time: string;
  timezone: string;
  venue: string;
  leagueCountry: string;
  leagueName: string;
  leagueLogo: string;
  leagueFlag: string;
  matchDay: string;
  homeTeamId: number;
  homeTeam: string;
  homeTeamLogo: string;
  awayTeamId: number;
  awayTeam: string;
  awayTeamLogo: string;
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  widget: WidgetConfig;
  prediction: {
    homePercent: string;
    awayPercent: string;
    drawPercent: string;
    advice: string;
    h2hHome: string;
    h2hAway: string;
    h2hGoalsHome: string;
    h2hGoalsAway: string;
    h2hTotalHome: string;
    h2hTotalAway: string;
    odds: {
      home: number;
      draw: number;
      away: number;
    };
  };
  matchStats: {
    status: string;
    isHomeWinner: null | boolean;
    isAwayWinner: null | boolean;
  };
};

export type WidgetConfig =
  | {
      type: "standings";
      config: {
        host: string;
        league: number;
        team: string;
        season: number;
        theme: string;
        showErrors: boolean;
        showLogos: boolean;
      };
    }
  | {
      type: "game";
      config: {
        host: string;
        id: string;
        theme: string;
        refresh: number;
        showErrors: boolean;
        showLogos: boolean;
      };
    };

export type BetSlip = {
  userAddress: string;
  betSlipId: number;
  totalBetAmount: number;
  blockchain: Chains;
  selections: {
    matchId: number;
    selectedOutcome: SelectedOutcome;
    oddsAtPlacement: number;
  }[];
};

export type SelectedOutcome = "home" | "away" | "draw";

export const ContractOutcome = {
  NONE: 0,
  HOME: 1,
  DRAW: 2,
  AWAY: 3,
};
