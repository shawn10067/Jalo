// the 'gamify' method has the following input and output:
/* Input:   [
    'Mon 02.13\n9:00.PM.ET',
    'Texas\n@ Texas Tech',
    '# 5 (20-5)\n# 47 (13-12)',
    '0\n0',
    '69\n70',
    '48 %\n52 %',
    '-1.5',
    '140.5',
    ''
  ]
    Output:  {
        date: 'Mon 02.13',
        time: '9:00.PM.ET',
        home: 'Texas',
        away: 'Texas Tech',
        spread: '-1.5',
        homeWin: false,
        total: 140.5,
        homeScore: 69,
        awayScore: 70,
        homePercent: 48,
        awayPercent: 52,
    }
*/

// generate the array input type
export type GameArray = [
  string?,
  string?,
  string?,
  string?,
  string?,
  string?,
  string?,
  string?,
  string?
];

// generate the game object type
export type Game = {
  date: Date;
  dateString: string;
  home: string;
  away: string;
  spread: number;
  homeWin: boolean;
  total: number;
  homeScore: number;
  awayScore: number;
  homePercent: number;
  awayPercent: number;
};

const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// if the input is an empty array, return null
export const gamify = (arr: GameArray): Game | null => {
  if (arr.length <= 8) {
    return null;
  }
  // if the input is not an array, return null
  if (
    !Array.isArray(arr) ||
    arr.length <= 8 ||
    arr === undefined ||
    arr === null
  ) {
    return null;
  }

  const gameTime = arr[0].split("\n")[1];
  const gameDay = arr[0].split("\n")[0].split(" ")[1].trim().split(".")[1];
  const isFinal = gameTime === "FINAL";

  const currentTime = new Date();
  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth();

  const convertedTime = `${currentYear}-${currentMonth + 1}-${gameDay}${
    gameTime?.split(".")[0]
  }${gameTime?.split(".")[1]}`;

  const gameDate = isFinal ? "FINAL" : dayjs(convertedTime, "YYYY-M-Dh:mmA");

  // if the input is an array, return the object
  const game = {
    date: isFinal ? currentTime : gameDate,
    dateString: isFinal ? "FINAL" : gameDate.format("MMMM D, h:mmA"),
    home: arr[1].split("\n")[0],
    away: arr[1].split("\n")[1].split("@")[1].trim(),
    spread: parseFloat(arr[6]),
    total: parseFloat(arr[7]),
    homeScore: parseInt(arr[4].split("\n")[0].trim()),
    awayScore: parseInt(arr[4].split("\n")[1].trim()),
    homePercent: parseFloat(arr[5].split("\n")[0].split(" ")[0].trim()),
    awayPercent: parseFloat(arr[5].split("\n")[1].split(" ")[0].trim()),
  };

  return {
    ...game,
    homeWin: game.homeScore > game.awayScore,
  };
};

module.exports = { gamify };
