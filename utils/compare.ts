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
  // find the closest match for the game in the books array
  const closestMatch = stringSimilarity.findBestMatch(
    game.home + " vs " + game.away,
    books.map((book) => book.homeTeam + " vs " + book.awayTeam)
  );

  // return the game with the bookmaker odds attached to it
  return {
    ...game,
    bookmakers: books[closestMatch.bestMatchIndex].bookmakers,
  };
};

// import the games.json file to test the function as a commonjs module
const games = require("../games.json");

// test it with the demoBookArray
export const demoGameArray: Array<GameWithOdds> = games.map((game: Game) => {
  return findClosestMatch(game, demoBookArray);
});

// console.dir(demoGameArray, { depth: null });

// we want the best games, this method called 'getBestGames' will return the best games. All games objects have a negative spread (and not a positive one), which is based on the higher win percentage team (whether its the home or away team)
// we want to find the games where the bookmaker (negative) spread is more than the actual spread, so we can bet on the team with the higher win percentage
// we will filter out the games where the bookmaker negative spread is greater (in magnitude) than the actual spread

export const getBestGames = (
  games: Array<GameWithOdds>
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

  // return the games where there exists at least one bookmaker with a negative spread greater than the actual spread, and the absolute value of the negative spread is greater than 8
  return games.filter(
    (game) => game.bookmakers.length > 0 && Math.abs(game.spread) > 8
  );
};

// test it with the demoGameArray
// console.dir(getBestGames(demoGameArray), { depth: null });
// console.dir(demoGameArray.length, { depth: null });
