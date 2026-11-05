// Where each Chicago team plays. ESPN's data names the stadium and has a
// photo for most of them, but not their size or age, so this list is
// written by hand. Facts were checked against each stadium's Wikipedia
// article on 2026-11-05. When a team moves or a stadium is renamed, change
// it here (and in the tests).
//
// Photos come from ESPN, or from Wikimedia Commons where ESPN has none;
// Commons photos must keep their author and license in the credit.

const STADIUMS = [
  {
    name: "Soldier Field",
    teams: ["bears", "fire"],
    address: "1410 Special Olympics Drive, Chicago, IL",
    opened: "1924",
    capacity: "62,500",
    surface: "Grass",
    roof: "Open air",
    photo: { url: "https://a.espncdn.com/i/venues/nfl/day/3933.jpg", credit: "ESPN" },
  },
  {
    name: "United Center",
    teams: ["bulls", "blackhawks"],
    address: "1901 West Madison Street, Chicago, IL",
    opened: "1994",
    capacity: "20,917 for basketball, 19,717 for hockey",
    surface: "Hardwood for the Bulls, ice for the Blackhawks",
    roof: "Indoor",
    photo: { url: "https://a.espncdn.com/i/venues/nba/day/1847.jpg", credit: "ESPN" },
  },
  {
    name: "Wrigley Field",
    teams: ["cubs"],
    address: "1060 West Addison Street, Chicago, IL",
    opened: "1914",
    capacity: "41,649",
    surface: "Grass",
    roof: "Open air",
    photo: { url: "https://a.espncdn.com/i/venues/mlb/day/16.jpg", credit: "ESPN" },
  },
  {
    name: "Rate Field",
    teams: ["whitesox"],
    address: "333 West 35th Street, Chicago, IL",
    opened: "1991",
    capacity: "40,615",
    surface: "Grass",
    roof: "Open air",
    photo: { url: "https://a.espncdn.com/i/venues/mlb/day/4.jpg", credit: "ESPN" },
  },
  {
    name: "Wintrust Arena",
    teams: ["sky"],
    address: "200 East Cermak Road, Chicago, IL",
    opened: "2017",
    capacity: "10,387",
    surface: "Hardwood",
    roof: "Indoor",
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Wintrust-arena-exterior.jpg",
      credit: "Swinterroth, CC BY-SA 4.0",
      link: "https://commons.wikimedia.org/wiki/File:Wintrust-arena-exterior.jpg",
    },
  },
  {
    name: "Northwestern Medicine Field at Martin Stadium",
    teams: ["stars"],
    address: "2235 Campus Drive, Evanston, IL",
    opened: "1997",
    note: "Expanded to 12,023 seats in 2024.",
    capacity: "12,023",
    surface: "Artificial turf",
    roof: "Open air",
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Wisconsin_at_Northwestern_football_%28October_19%2C_2024%29_IMG_3218_%281%29.jpg/1280px-Wisconsin_at_Northwestern_football_%28October_19%2C_2024%29_IMG_3218_%281%29.jpg",
      credit: "SecretName101, CC BY 4.0",
      link: "https://commons.wikimedia.org/wiki/File:Wisconsin_at_Northwestern_football_(October_19,_2024)_IMG_3218_(1).jpg",
    },
  },
];

// The stadiums the given teams play in, each once and in the order above,
// with `teams` turned into every favorite team that plays there.
function stadiumsFor(favorites) {
  const keys = favorites.map((favorite) => favorite.key);
  return STADIUMS.filter((stadium) => stadium.teams.some((key) => keys.includes(key))).map((stadium) => ({
    ...stadium,
    teams: FAVORITE_TEAMS.filter((favorite) => stadium.teams.includes(favorite.key)),
  }));
}
