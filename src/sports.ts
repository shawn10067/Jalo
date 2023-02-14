import axios from "axios";
import { bookify } from "../utils/book";
import { Game, GameArray, gamify } from "../utils/game";
import puppeteer from "puppeteer-core";
import { getGenericMassey } from "../utils/genericMassey";
import { getGenericTheOdds } from "../utils/genericTheOdds";

export const sports = {
  ncaab: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey("https://masseyratings.com/cb/ncaa-d1/games");
    },
    getOdds: async (apiKey) => {
      return getGenericTheOdds("basketball_ncaab", apiKey);
    },
  },
  nba: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey("https://masseyratings.com/nba/games");
    },
    getOdds: async (apiKey: string) => {
      return getGenericTheOdds("basketball_nba", apiKey);
    },
  },
  mexicoSoccer: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey(
        "https://masseyratings.com/dls/mexico-primera/games"
      );
    },
    getOdds: async (apiKey: string) => {
      return getGenericTheOdds("soccer_mexico_ligamx", apiKey);
    },
  },
  italySoccer: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey(
        "https://masseyratings.com/dls/italy-serie-a/games"
      );
    },
    getOdds: async (apiKey: string) => {
      return getGenericTheOdds("soccer_italy_serie_a", apiKey);
    },
  },
  germanySoccer: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey(
        "https://masseyratings.com/dls/germany-bundesliga/games"
      );
    },
    getOdds: async (apiKey: string) => {
      return getGenericTheOdds("soccer_germany_bundesliga", apiKey);
    },
  },
  spainSoccer: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey(
        "https://masseyratings.com/dls/spain-primera-division/games"
      );
    },
    getOdds: async (apiKey: string) => {
      return getGenericTheOdds("soccer_spain_la_liga", apiKey);
    },
  },
  franceSoccer: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey(
        "https://masseyratings.com/dls/france-ligue-1/games"
      );
    },
    getOdds: async (apiKey: string) => {
      return getGenericTheOdds("soccer_france_ligue_one", apiKey);
    },
  },
  englandSoccer: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey(
        "https://masseyratings.com/dls/england-premier-league/games"
      );
    },
    getOdds: async (apiKey: string) => {
      return getGenericTheOdds("soccer_epl", apiKey);
    },
  },
};
