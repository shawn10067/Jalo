// utils imports
import type { Book, BookArray, BookInput } from "../utils/book";
import { bookify } from "../utils/book";
import { Game, GameArray } from "../utils/game";
const { gamify } = require("../utils/game");
import { GameWithOdds, findClosestMatch, getBestGames } from "../utils/compare";
import { sports } from "./sports";
import { stringify } from "../utils/stringify";
const chalk = require("chalk");

// api imports
const puppeteer = require("puppeteer-core");
const axios = require("axios");

// config imports
require("dotenv").config();

// get the api key from the .env file
const apiKey = process.env.API_KEY;

const sportsOptionsSettings = {
  ncaab: true,
  nba: true,
};

// the function 'crunchSports' that, for each sport that is true in the sportsOptionsSettings object, get the best games and print them to the console
const crunchSports = async () => {
  for (const sport in sportsOptionsSettings) {
    if (sportsOptionsSettings[sport]) {
      const gamesLeft: Game[] = await sports[sport].getGames();
      const books: BookArray = await sports[sport].getOdds(apiKey);

      const matchedGames: GameWithOdds[] = [];
      gamesLeft.forEach((game) => {
        const matchedGame = findClosestMatch(game, books);
        if (matchedGame) {
          matchedGames.push(matchedGame);
        }
      });

      // format each game into a legible and pretty string, using chalk. Inlucde each bookmaker price and their negative spread. Also include the actual spread and game time and teams.
      const bestGames = getBestGames(matchedGames);
      const bestGamesStrings = stringify(bestGames);

      // print the stringified games to the console, with the number of games at the top

      // console.log(
      //   `\nThere are ${
      //     bestGamesStrings.length
      //   } games to bet on in the ${chalkAnimation.rainbow(sport)}:`
      // );

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
