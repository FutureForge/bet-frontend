import { Chains } from "@/modules/blockchain";

// Actual API Response Types based on the real data
export type SingleFixtureAPIResponse = {
  data: SingleFixtureData;
  success: boolean;
};

export type SingleFixtureData = {
  id: number;
  date: string;
  time: string;
  timezone: string;
  venue: string;
  venueDetails: {
    id: number | null;
    name: string;
    city: string;
  };
  leagueCountry: string;
  leagueName: string;
  leagueLogo: string;
  leagueFlag: string | null;
  matchDay: string;
  homeTeamId: number;
  homeTeam: string;
  homeTeamLogo: string;
  awayTeamId: number;
  awayTeam: string;
  awayTeamLogo: string;
  referee: string | null;
  periods: {
    first: number;
    second: number;
  };
  status: {
    long: string;
    short: string;
    elapsed: number;
    extra: number | null;
  };
  goals: {
    home: number;
    away: number;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
  matchStats: {
    status: string;
    isHomeWinner: boolean | null;
    isAwayWinner: boolean | null;
  };
  widget: WidgetConfig;
};

// Legacy types for backward compatibility
export type SingleFixtureResponse = {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number;
      extra: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: TeamDetails;
    away: TeamDetails;
  };
  goals: {
    home: number;
    away: number;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
};

export type TeamDetails = {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
};

export type SingleFixtureRequest = {
  fixtureId: string;
  includePrediction?: boolean;
  forceRefresh?: boolean;
};

// Enhanced Fixture type with live data
export type EnhancedFixture = Fixture & {
  goals?: {
    home: number;
    away: number;
  };
  score?: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
  referee?: string | null;
  periods?: {
    first: number | null;
    second: number | null;
  };
  venueDetails?: {
    id: number;
    name: string;
    city: string;
  };
  status?: {
    long: string;
    short: string;
    elapsed: number;
    extra: number | null;
  };
};

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
