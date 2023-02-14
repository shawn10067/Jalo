import axios from "axios";
import { bookify } from "../utils/book";
import { Game, GameArray, gamify } from "../utils/game";
import puppeteer from "puppeteer-core";
import { getGenericMassey } from "../utils/genericMassey";

export const sports = {
  ncaab: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey("https://masseyratings.com/cb/ncaa-d1/games");
    },
    getOdds: async (apiKey) => {
      const oddsAPI = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${apiKey}&regions=us&markets=spreads&bookmakers=fanduel,pinnacle,draftkings,betmgm`;
      const resp = await axios.get(oddsAPI);
      const books = [];
      resp.data.forEach((book) => {
        const bookObject = bookify(book);
        books.push(bookObject);
      });
      return books;
    },
  },
  nba: {
    getGames: (): Promise<Game[]> => {
      return getGenericMassey("https://masseyratings.com/cb/nba/games");
    },
    getOdds: async (apiKey: string) => {
      const oddsAPI = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${apiKey}&regions=us&markets=spreads&bookmakers=fanduel,pinnacle,draftkings,betmgm`;
      const resp = await axios.get(oddsAPI);
      const books = [];
      resp.data.forEach((book) => {
        const bookObject = bookify(book);
        books.push(bookObject);
      });
      return books;
    },
  },
};
