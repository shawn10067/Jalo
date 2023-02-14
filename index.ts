import { Game, GameArray } from "./utils/game";

const puppeteer = require("puppeteer-core");
const axios = require("axios");
const { gamify } = require("./utils/game");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://masseyratings.com/cb/ncaa-d1/games");
  const tableWithId = await page.$("#mytable0");
  await tableWithId.screenshot({ path: "example.png" });
  const allRowsFromTableWithId = await page.evaluate(() => {
    const rows = document.querySelectorAll("#mytable0 tr");
    return Array.from(rows, (row) => {
      const columns: NodeListOf<HTMLElement> = row.querySelectorAll("td");
      return Array.from(columns, (column: HTMLElement) => column.innerText);
    });
  });

  const gamesToday: Game[] = [];

  allRowsFromTableWithId.forEach((row: GameArray) => {
    const game = gamify(row);
    if (game) {
      return gamesToday.push(game);
    }
  });

  const gamesLeft = gamesToday.filter((game) => game.dateString !== "FINAL");

  console.log(gamesLeft);

  await browser.close();
})();
