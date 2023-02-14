// utils imports
import type { Book, BookArray, BookInput } from "../utils/book";
import { bookify } from "../utils/book";
import { Game, GameArray } from "../utils/game";
const { gamify } = require("../utils/game");
import { GameWithOdds, findClosestMatch, getBestGames } from "../utils/compare";
const chalk = require("chalk");

// api imports
const puppeteer = require("puppeteer-core");
const axios = require("axios");

// config imports
require("dotenv").config();

// get the api key from the .env file
const apiKey = process.env.API_KEY;

(async () => {
  // puppeteer setup
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
    headless: true,
  });
  const page = await browser.newPage();

  // scrape masseyratings.com
  const todayGamesURL = "https://masseyratings.com/cb/ncaa-d1/games";
  await page.goto(todayGamesURL);

  // get the table
  const tableWithId = await page.$("#mytable0");
  const allRowsFromTableWithId = await page.evaluate(() => {
    const rows = document.querySelectorAll("#mytable0 tr");
    return Array.from(rows, (row) => {
      const columns: NodeListOf<HTMLElement> = row.querySelectorAll("td");
      return Array.from(columns, (column: HTMLElement) => column.innerText);
    });
  });

  // filter out the header row and get the games that are today and are not final
  const gamesToday: Game[] = [];
  allRowsFromTableWithId.forEach((row: GameArray) => {
    const game = gamify(row);
    if (game) {
      gamesToday.push(game);
    }
  });
  const gamesLeft = gamesToday.filter((game) => game.dateString !== "FINAL");

  // get the bookmaker odds
  const oddsAPI = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${apiKey}&regions=us&markets=spreads&bookmakers=fanduel,pinnacle,draftkings,betmgm`;
  const resp = await axios.get(oddsAPI);

  const books: BookArray = [];
  resp.data.forEach((book: BookInput) => {
    const bookObject: Book = bookify(book);
    books.push(bookObject);
  });

  const matchedGames: GameWithOdds[] = [];
  gamesLeft.forEach((game) => {
    const matchedGame = findClosestMatch(game, books);
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

  await browser.close();
})();
