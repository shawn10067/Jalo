import puppeteer from "puppeteer-core";
import { Game, GameArray, gamify } from "./game";

export const getGenericMassey = async (url: string) => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
    headless: true,
  });
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
    if (game) {
      gamesToday.push(game);
    }
  });
  const gamesLeft = gamesToday.filter((game) => game.dateString !== "FINAL");

  await browser.close();

  return gamesLeft;
};
