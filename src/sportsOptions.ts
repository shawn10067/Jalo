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
    enabled: false || generalOptions.baseketball,
    sport: "basketball",
  },
  ncaab: {
    enabled: false || generalOptions.baseketball,
    sport: "basketball",
  },
  europeBasketball: {
    enabled: false || generalOptions.baseketball,
    sport: "basketball",
  },
  mexicoSoccer: {
    enabled: false || generalOptions.soccer,
    sport: "soccer",
  },
  italySoccer: {
    enabled: false || generalOptions.soccer,
    sport: "soccer",
  },
  germanySoccer: {
    enabled: false || generalOptions.soccer,
    sport: "soccer",
  },
  spainSoccer: {
    enabled: false || generalOptions.soccer,
    sport: "soccer",
  },
  franceSoccer: {
    enabled: false || generalOptions.soccer,
    sport: "soccer",
  },
  englandSoccer: {
    enabled: false || generalOptions.soccer,
    sport: "soccer",
  },
};
