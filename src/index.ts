// utils imports
import type { BookArray } from "../utils/book";
import { Game, GameArray } from "../utils/game";
import { GameWithOdds, findClosestMatch, getBestGames } from "../utils/compare";
import { sports } from "./sports";
import { stringify } from "../utils/stringify";
const chalk = require("chalk");

// config imports
require("dotenv").config();

// get the api key from the .env file
const apiKey = process.env.API_KEY;

export type sportTypes = "basketball" | "soccer";

const sportsOptionsSettings: {
  [key: string]: {
    enabled: boolean;
    sport: sportTypes;
  };
} = {
  ncaab: {
    enabled: true,
    sport: "basketball",
  },
  nba: {
    enabled: true,
    sport: "basketball",
  },
  mexicoSoccer: {
    enabled: true,
    sport: "soccer",
  },
  italySoccer: {
    enabled: true,
    sport: "soccer",
  },
  germanySoccer: {
    enabled: true,
    sport: "soccer",
  },
  spainSoccer: {
    enabled: true,
    sport: "soccer",
  },
  franceSoccer: {
    enabled: true,
    sport: "soccer",
  },
  englandSoccer: {
    enabled: true,
    sport: "soccer",
  },
};

// the function 'crunchSports' that, for each sport that is true in the sportsOptionsSettings object, get the best games and print them to the console
const crunchSports = async () => {
  for (const sport in sportsOptionsSettings) {
    if (sportsOptionsSettings[sport].enabled) {
      const gamesLeft: Game[] = await sports[sport].getGames();
      const books: BookArray = await sports[sport].getOdds(apiKey);

      // for each game, find the closest match in the bookmakers array
      const matchedGames: GameWithOdds[] = [];
      gamesLeft.forEach((game) => {
        const matchedGame = findClosestMatch(game, books);
        if (matchedGame) {
          matchedGames.push(matchedGame);
        }
      });

      // format each game into a legible and pretty string, using chalk. Inlucde each bookmaker price and their negative spread. Also include the actual spread and game time and teams.
      const bestGames = getBestGames(
        matchedGames,
        sportsOptionsSettings[sport].sport
      );
      const bestGamesStrings = stringify(bestGames);

      // print the stringified games to the console, with the number of games at the top
      console.log(
        `\n*******************************${chalk.bgCyan.italic(
          sport.toLocaleUpperCase()
        )}: ${bestGamesStrings.length}`
      );

      bestGamesStrings.forEach((game) => {
        console.log(game, "\n");
      });
    }
  }
};

// run the function
crunchSports();
