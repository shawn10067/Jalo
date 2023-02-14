import chalk = require("chalk");
import { GameWithOdds } from "./compare";

export const stringify = (game: GameWithOdds[]): string[] => {
  // array of strings to return
  const bestGamesStrings: string[] = [];

  // formatting each game with odds into a string
  // includes: game time, teams, spread, bookmaker, negative spread, negative team, negative team price
  game.forEach((game) => {
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
      const bookmakerString = `\t${chalk.blue(
        bookmaker.bookmaker
      )} has ${chalk.magentaBright(negativeTeamPrice)} for ${
        negativeTeam === game.home
          ? chalk.green(negativeTeam)
          : chalk.red(negativeTeam)
      } at ${chalk.cyan(negativeSpread)}`;
      bookmakerStrings.push(bookmakerString);
    });
    // join the bookmaker strings with a new line
    const bookmakerStringsJoinedByNewLine = bookmakerStrings.join("\n");
    const finalString = `${gameString}\n${bookmakerStringsJoinedByNewLine}`;

    // push the final string to the array
    bestGamesStrings.push(finalString);
  });

  return bestGamesStrings;
};
