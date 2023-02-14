// the 'bookify' method has the following input and output:
/* 
    Input: {
        "id": "35c3fd6a2e4a55210835a4261718cc5a",
        "sport_key": "basketball_ncaab",
        "sport_title": "NCAAB",
        "commence_time": "2023-02-14T23:30:00Z",
        "home_team": "South Carolina Gamecocks",
        "away_team": "Vanderbilt Commodores",
        "bookmakers": [
        {
            "key": "fanduel",
            "title": "FanDuel",
            "last_update": "2023-02-14T09:04:03Z",
            "markets": [
            {
                "key": "spreads",
                "last_update": "2023-02-14T09:04:03Z",
                "outcomes": [
                {
                    "name": "South Carolina Gamecocks",
                    "price": 1.83,
                    "point": 5.5
                },
                { "name": "Vanderbilt Commodores", "price": 1.98, "point": -5.5 }
                ]
            }
            ]
        },
        {
            "key": "thescore",
            "title": "theScore",
            "last_update": "2023-02-14T12:04:23Z",
            "markets": [
            {
                "key": "spreads",
                "last_update": "2023-02-14T12:04:23Z",
                "outcomes": [
                { "name": "Vanderbilt Commodores", "price": 1.96, "point": -5.0 },
                {
                    "name": "South Carolina Gamecocks",
                    "price": 1.89,
                    "point": 5.0
                }
                ]
            }
            ]
        }... and so on (for the other bookmakers)
        ]
    }

    Output:  {
        commence_time: '2023-02-14T23:30:00Z',
        homeTeam: 'South Carolina Gamecocks',
        awayTeam: 'Vanderbilt Commodores',
        bookmakers: [
        {
            bookmaker: 'fanduel',
            lastUpdate: '2023-02-14T09:04:03Z',
            homePrice: 1.83,
            awayPrice: 1.98,
            homeSpread: 5.5,
            awaySpread: -5.5
        },
        {
            bookmaker: 'thescore',
            lastUpdate: '2023-02-14T12:04:23Z',
            homePrice: 1.89,
            awayPrice: 1.96,
            homeSpread: 5,
            awaySpread: -5
        },
    ],
    }
*/

// generate the book object type
export type Book = {
  commenceTime: Date;
  homeTeam: string;
  awayTeam: string;
  bookmakers: Array<{
    bookmaker: string;
    lastUpdate: Date;
    homePrice: number;
    awayPrice: number;
    homeSpread: number;
    awaySpread: number;
  }>;
};

// generate the book array type
export type BookArray = Array<Book>;

// generate the input type
export type BookInput = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        price: number;
        point: number;
      }>;
    }>;
  }>;
};

export const bookify = (book: BookInput): Book => {
  const bookArray = book.bookmakers.map((bookmaker) => {
    const bookmakerObject = {
      bookmaker: bookmaker.key,
      lastUpdate: new Date(bookmaker.last_update),
      homePrice: bookmaker.markets[0].outcomes[0].price,
      awayPrice: bookmaker.markets[0].outcomes[1].price,
      homeSpread: bookmaker.markets[0].outcomes[0].point,
      awaySpread: bookmaker.markets[0].outcomes[1].point,
    };
    return bookmakerObject;
  });
  const bookObject: Book = {
    commenceTime: new Date(book.commence_time),
    homeTeam: book.home_team,
    awayTeam: book.away_team,
    bookmakers: bookArray,
  };
  return bookObject;
};

// import the books.json file to test the function as a commonjs module
const books = require("../sample-json/books.json");

export const demoBookArray: BookArray = books.map((book: BookInput) => {
  return bookify(book);
});

// console.dir(demoBookArray, { depth: null });
