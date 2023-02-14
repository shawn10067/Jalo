import { Game, GameArray } from "./utils/game";

const puppeteer = require("puppeteer-core");
const axios = require("axios");
const { gamify } = require("./utils/game");

// get google.com html and console.log it
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
      const columns = row.querySelectorAll("td");
      return Array.from(columns, (column) => column.innerText);
    });
  });

  const gamesToday: Game[] = allRowsFromTableWithId.filter((row: GameArray) => {
    const game = gamify(row);
    if (game) {
      return true;
    }
  });

  console.log(gamesToday);

  await browser.close();
})();

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.goto("https://developer.chrome.com/");

//   // Set screen size
//   await page.setViewport({ width: 1080, height: 1024 });

//   // Type into search box
//   await page.type(".search-box__input", "automate beyond recorder");

//   // Wait and click on first result
//   const searchResultSelector = ".search-box__link";
//   await page.waitForSelector(searchResultSelector);
//   await page.click(searchResultSelector);

//   // Locate the full title with a unique string
//   const textSelector = await page.waitForSelector(
//     "text/Customize and automate"
//   );
//   const fullTitle = await textSelector.evaluate((el) => el.textContent);

//   // Print the full title
//   console.log('The title of this blog post is "%s".', fullTitle);

//   await browser.close();
// })();
