import axios from "axios";
import { bookify } from "../utils/book";
import { Game, GameArray, gamify } from "../utils/game";
import puppeteer from "puppeteer-core";
import { getGenericMassey } from "../utils/genericMassey";
import { getGenericTheOdds } from "../utils/genericTheOdds";

export const sports = {
  ncaab: {
    gamesLink: "https://masseyratings.com/cb/ncaa-d1/games",
    oddsSportID: "basketball_ncaab",
  },
  nba: {
    gamesLink: "https://masseyratings.com/nba/games",
    oddsSportID: "basketball_nba",
  },
  mexicoSoccer: {
    gamesLink: "https://masseyratings.com/dls/mexico-primera/games",
    oddsSportID: "soccer_mexico_ligamx",
  },
  italySoccer: {
    gamesLink: "https://masseyratings.com/dls/italy-serie-a/games",
    oddsSportID: "soccer_italy_serie_a",
  },
  germanySoccer: {
    gamesLink: "https://masseyratings.com/dls/germany-bundesliga/games",
    oddsSportID: "soccer_germany_bundesliga",
  },
  spainSoccer: {
    gamesLink: "https://masseyratings.com/dls/spain-primera-division/games",
    oddsSportID: "soccer_spain_la_liga",
  },
  franceSoccer: {
    gamesLink: "https://masseyratings.com/dls/france-ligue-1/games",
    oddsSportID: "soccer_france_ligue_one",
  },
  englandSoccer: {
    gamesLink: "https://masseyratings.com/dls/england-premier-league/games",
    oddsSportID: "soccer_epl",
  },
};
