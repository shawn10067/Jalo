import axios from "axios";
import { BookArray, bookify } from "./book";

export const getGenericTheOdds = async (
  sportID: string,
  apiKey: string
): Promise<BookArray> => {
  const oddsAPI = `https://api.the-odds-api.com/v4/sports/${sportID}/odds/?apiKey=${apiKey}&regions=us&markets=spreads&bookmakers=fanduel,pinnacle,draftkings,betmgm`;
  const resp = await axios.get(oddsAPI);
  const books = [];
  resp.data.forEach((book) => {
    const bookObject = bookify(book);
    books.push(bookObject);
  });
  return books;
};
