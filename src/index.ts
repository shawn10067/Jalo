// utils imports
import type { Book, BookArray, BookInput } from "../utils/book";
import { bookify } from "../utils/book";
import { Game, GameArray } from "../utils/game";
const { gamify } = require("../utils/game");
import { GameWithOdds, findClosestMatch, getBestGames } from "../utils/compare";
import { sports } from "./sports";
const chalk = require("chalk");

// api imports
const puppeteer = require("puppeteer-core");
const axios = require("axios");

// config imports
require("dotenv").config();

// get the api key from the .env file
const apiKey = process.env.API_KEY;

(async () => {
  const gamesLeftNcaab: Game[] = await sports.nba.getGames();
  const booksNcaab: BookArray = await sports.nba.getOdds(process.env.API_KEY);

  const matchedGames: GameWithOdds[] = [];
  gamesLeftNcaab.forEach((game) => {
    const matchedGame = findClosestMatch(game, booksNcaab);
    if (matchedGame) {
      matchedGames.push(matchedGame);
    }
  });

  // format each game into a legible and pretty string, using chalk. Inlucde each bookmaker price and their negative spread. Also include the actual spread and game time and teams.
  const bestGamesStrings: string[] = [];
  getBestGames(matchedGames).forEach((game) => {
    const gameString = `${chalk.greenBright(game.home)} vs ${chalk.redBright(
      game.away
    )} at ${chalk.yellowBright(
      game.dateString
    )}, with a spread of ${chalk.cyanBright(game.spread)}`;
    const bookmakerStrings: string[] = [];
    game.bookmakers.forEach((bookmaker) => {
      // get the negative spread, team, and price
      const negativeSpread =
        bookmaker.homeSpread > bookmaker.awaySpread
          ? bookmaker.awaySpread
          : bookmaker.homeSpread;
      const negativeTeam =
        bookmaker.homeSpread > bookmaker.awaySpread ? game.away : game.home;
      const negativeTeamPrice =
        bookmaker.homeSpread > bookmaker.awaySpread
          ? bookmaker.awayPrice
          : bookmaker.homePrice;

      // format the string
      const bookmakerString = `${chalk.blue(
        bookmaker.bookmaker
      )} has ${chalk.magentaBright(negativeTeamPrice)} for ${
        negativeTeam === game.home
          ? chalk.green(negativeTeam)
          : chalk.red(negativeTeam)
      } at ${chalk.cyan(negativeSpread)}`;
      bookmakerStrings.push(bookmakerString);
    });
    const bookmakerStringsJoinedByNewLine = bookmakerStrings.join("\n");
    const finalString = `${gameString}\n${bookmakerStringsJoinedByNewLine}`;

    bestGamesStrings.push(finalString);
  });

  // print the stringified games to the console, with the number of games at the top
  console.log(`There are ${bestGamesStrings.length} games to bet on:`);
  bestGamesStrings.forEach((game) => {
    console.log("*******************************");
    console.log(game);
  });
})();
