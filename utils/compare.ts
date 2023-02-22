import { sportTypes } from "../src";
import { Book, BookArray, demoBookArray } from "./book";
import type { Game } from "./game";

const stringSimilarity = require("string-similarity");

// generate the game type with bookmaker odds attached to it
export type GameWithOdds = Game & {
  bookmakers: Array<{
    bookmaker: string;
    lastUpdate: Date;
    homePrice: number;
    awayPrice: number;
    homeSpread: number;
    awaySpread: number;
  }>;
};

// find the closest match for a game in the book array and return an instance of GameWithOdds for that game
export const findClosestMatch = (
  game: Game,
  books: BookArray
): GameWithOdds => {
  // if there is no bookmaker data for the game, return the game without the bookmaker data
  if (books === undefined || books === null || books.length === 0) {
    return {
      ...game,
      bookmakers: [],
    };
  }

  // find the closest match for the game in the books array
  const closestMatch = stringSimilarity.findBestMatch(
    game.home + " vs " + game.away,
    books.map((book) => book.homeTeam + " vs " + book.awayTeam)
  );

  // return the game with the bookmaker odds attached to it
  return {
    ...game,
    bookmakers: books[closestMatch.bestMatchIndex].bookmakers,
    home: books[closestMatch.bestMatchIndex].homeTeam,
    away: books[closestMatch.bestMatchIndex].awayTeam,
  };
};

// import the games.json file to test the function as a commonjs module
const games = require("../sample-json/games.json");

// test it with the demoBookArray
export const demoGameArray: Array<GameWithOdds> = games.map((game: Game) => {
  return findClosestMatch(game, demoBookArray);
});

// console.dir(demoGameArray, { depth: null });

// we want the best games, this method called 'getBestGames' will return the best games. All games objects have a negative spread (and not a positive one), which is based on the higher win percentage team (whether its the home or away team)
// we want to find the games where the bookmaker (negative) spread is more than the actual spread, so we can bet on the team with the higher win percentage
// we will filter out the games where the bookmaker negative spread is greater (in magnitude) than the actual spread

export const getBestGames = (
  games: Array<GameWithOdds>,
  sport: sportTypes
): Array<GameWithOdds> => {
  games.map((game) => {
    // filter the games where the bookmaker's negative spread is greater (in magnitude) than the actual spread
    game.bookmakers = game.bookmakers.filter((bookmaker) => {
      // find the bookmaker's negative spread
      const negativeSpread =
        bookmaker.homeSpread > bookmaker.awaySpread
          ? bookmaker.awaySpread
          : bookmaker.homeSpread;
      return negativeSpread > game.spread;
    });

    return game;
  });

  let SPREAD_ABS_THRESHOLD = 0;
  switch (sport) {
    case "basketball":
      SPREAD_ABS_THRESHOLD = 6;
      break;
    case "soccer":
      SPREAD_ABS_THRESHOLD = 0.5;
      break;
  }

  /* 
    return the games where there exists at least one bookmaker with a negative spread greater than the actual spread, 
    the absolute value of the negative spread is greater than 8, 
    and there is a difference between any bookmaker's negative spread and the actual spread is greater than SPREAD_DIFFERENCE_THRESHOLD 
  */
  return games.filter((game) => {
    const SPREAD_DIFFERENCE_THRESHOLD = 0.5;
    // game.bookmakers.length > 0 &&
    // Math.abs(game.spread) > spreadThreasold &&
    // Math.abs(game.spread) - Math.abs(game.bookmakers[0].homeSpread) > 0.5
    const bookmakerSpreads = game.bookmakers.filter((bookmaker) => {
      const negativeSpread =
        bookmaker.homeSpread > bookmaker.awaySpread
          ? bookmaker.awaySpread
          : bookmaker.homeSpread;

      // ensure that the difference between the bookmaker's negative spread and the actual spread is greater than 0.5
      return (
        Math.abs(game.spread) - Math.abs(negativeSpread) >
        SPREAD_DIFFERENCE_THRESHOLD
      );
    });

    return (
      game.bookmakers.length > 0 &&
      Math.abs(game.spread) > SPREAD_ABS_THRESHOLD &&
      bookmakerSpreads.length > 0
    );
  });
};

// test it with the demoGameArray
// console.dir(demoGameArray, { depth: null });
// console.dir(getBestGames(demoGameArray), { depth: null });
