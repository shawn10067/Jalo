// utils imports
import { GameWithOdds, findClosestMatch, getBestGames } from "../utils/compare";
import { sports } from "./sports";
import { stringify } from "../utils/stringify";
import { getGenericTheOdds } from "../utils/genericTheOdds";
import { getGenericMassey } from "../utils/genericMassey";
import { sportsOptionsSettings } from "./sportsOptions";
const chalk = require("chalk");

// config imports
require("dotenv").config();

// get the api key from the .env file
const apiKey = process.env.API_KEY;

export type sportTypes = "basketball" | "soccer";

// the function 'crunchSports' that, for each sport that is true in the sportsOptionsSettings object, get the best games and print them to the console
const crunchSports = async () => {
  for (const sport in sportsOptionsSettings) {
    if (sportsOptionsSettings[sport].enabled) {
      const gamesToday = await getGenericMassey(sports[sport].gamesLink);
      const oddsToday = await getGenericTheOdds(
        sports[sport].oddsSportID,
        apiKey
      );

      // for each game, find the closest match in the bookmakers array
      const matchedGames: GameWithOdds[] = [];
      gamesToday.forEach((game) => {
        const matchedGame = findClosestMatch(game, oddsToday);
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

      // if there are no games, continue to the next sport
      if (bestGamesStrings.length === 0) {
        continue;
      }

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
