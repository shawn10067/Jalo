import puppeteer from "puppeteer-core";
import { Game, GameArray, gamify } from "./game";
import dayjs = require("dayjs");

export const getGenericMassey = async (urls: string[]) => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
    headless: true,
  });

  // get all the game predictions from the whole array
  let gamesLeft: Game[] = [];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url);

    // get the table
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
      // ensure that the game is today and not final
      const today = new Date();
      const gameDate = game && dayjs(game.date);
      if (game && gameDate.get("D") === today.getDate()) {
        gamesToday.push(game);
      }
    });

    const gamesLeftToday = gamesToday.filter(
      (game) => game.dateString !== "FINAL"
    );

    gamesLeft = [...gamesLeft, ...gamesLeftToday];
  }

  await browser.close();
  return gamesLeft;
};
