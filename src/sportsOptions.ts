import { sportTypes } from ".";

export const generalOptions = {
  baseketball: true,
  soccer: true,
};

export const sportsOptionsSettings: {
  [key: string]: {
    enabled: boolean;
    sport: sportTypes;
  };
} = {
  nba: {
    enabled: generalOptions.baseketball && true,
    sport: "basketball",
  },
  ncaab: {
    enabled: generalOptions.baseketball && true,
    sport: "basketball",
  },
  europeBasketball: {
    enabled: generalOptions.baseketball && true,
    sport: "basketball",
  },
  mexicoSoccer: {
    enabled: generalOptions.soccer && true,
    sport: "soccer",
  },
  italySoccer: {
    enabled: generalOptions.soccer && true,
    sport: "soccer",
  },
  germanySoccer: {
    enabled: generalOptions.soccer && true,
    sport: "soccer",
  },
  spainSoccer: {
    enabled: generalOptions.soccer && true,
    sport: "soccer",
  },
  franceSoccer: {
    enabled: generalOptions.soccer && true,
    sport: "soccer",
  },
  englandSoccer: {
    enabled: generalOptions.soccer && true,
    sport: "soccer",
  },
};
