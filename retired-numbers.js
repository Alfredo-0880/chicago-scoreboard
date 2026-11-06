// Each team's retired numbers. ESPN has none, so this is written by hand
// from Wikipedia (the teams' articles and the "Chicago Bears retired
// numbers" template, checked 2026-11-05). When a team retires a number, add
// it here (and change the tests if the count changes).
//
// years (with the team) and retired (the year the number was retired) are
// null where Wikipedia's list doesn't give them. leagueWide is a number the
// whole league retired, which the team honors too.

const RETIRED_NUMBERS = {
  bears: {
    numbers: [
      { number: "3", name: "Bronko Nagurski", position: "FB/LB/T", years: "1930–1937, 1943", retired: null },
      { number: "5", name: "George McAfee", position: "RB/DB/PR", years: "1940–1941, 1945–1950", retired: null },
      { number: "7", name: "George Halas", position: "End, head coach, and founder", years: "1920–1983", retired: null },
      { number: "28", name: "Willie Galimore", position: "RB", years: "1957–1963", retired: null },
      { number: "34", name: "Walter Payton", position: "RB", years: "1975–1987", retired: null },
      { number: "40", name: "Gale Sayers", position: "RB/KR", years: "1965–1971", retired: null },
      { number: "41", name: "Brian Piccolo", position: "RB/FB", years: "1965–1969", retired: null },
      { number: "42", name: "Sid Luckman", position: "QB/DB/P", years: "1939–1950", retired: null },
      { number: "51", name: "Dick Butkus", position: "MLB", years: "1965–1973", retired: null },
      { number: "56", name: "Bill Hewitt", position: "End", years: "1932–1936", retired: null },
      { number: "61", name: "Bill George", position: "MG/MLB", years: "1952–1965", retired: null },
      { number: "66", name: "Clyde \"Bulldog\" Turner", position: "C/LB", years: "1940–1952", retired: null },
      { number: "77", name: "Red Grange", position: "RB/DB", years: "1925, 1929–1934", retired: null },
      { number: "89", name: "Mike Ditka", position: "TE", years: "1961–1966", retired: null },
    ],
    leagueWide: null,
  },
  bulls: {
    numbers: [
      { number: "1", name: "Derrick Rose", position: "PG", years: "2008–2016", retired: "2026" },
      { number: "4", name: "Jerry Sloan", position: "G/SF", years: "1966–1976", retired: "1978" },
      { number: "10", name: "Bob Love", position: "F", years: "1968–1976", retired: "1994" },
      { number: "23", name: "Michael Jordan", position: "SG", years: "1984–1993, 1995–1998", retired: "1994" },
      { number: "33", name: "Scottie Pippen", position: "SF", years: "1987–1998, 2003–2004", retired: "2005" },
    ],
    leagueWide: { number: "6", name: "Bill Russell", league: "the NBA", retired: "2022" },
  },
  cubs: {
    numbers: [
      { number: "10", name: "Ron Santo", position: "3B", years: null, retired: "2003" },
      { number: "14", name: "Ernie Banks", position: "SS/1B", years: null, retired: "1982" },
      { number: "23", name: "Ryne Sandberg", position: "2B", years: null, retired: "2005" },
      { number: "26", name: "Billy Williams", position: "LF", years: null, retired: "1987" },
      { number: "31", name: "Ferguson Jenkins", position: "P", years: null, retired: "2009" },
      { number: "31", name: "Greg Maddux", position: "P", years: null, retired: "2009" },
    ],
    leagueWide: { number: "42", name: "Jackie Robinson", league: "MLB", retired: "1997" },
  },
  whitesox: {
    numbers: [
      { number: "2", name: "Nellie Fox", position: "2B", years: null, retired: "1976" },
      { number: "3", name: "Harold Baines", position: "RF/DH", years: null, retired: "1989" },
      { number: "4", name: "Luke Appling", position: "SS", years: null, retired: "1975" },
      { number: "9", name: "Minnie Miñoso", position: "LF", years: null, retired: "1983" },
      { number: "11", name: "Luis Aparicio", position: "SS", years: null, retired: "1984" },
      { number: "13", name: "Ozzie Guillén", position: "SS and manager", years: null, retired: "2026" },
      { number: "14", name: "Paul Konerko", position: "1B", years: null, retired: "2015" },
      { number: "16", name: "Ted Lyons", position: "P and manager", years: null, retired: "1987" },
      { number: "19", name: "Billy Pierce", position: "P", years: null, retired: "1987" },
      { number: "35", name: "Frank Thomas", position: "1B/DH", years: null, retired: "2010" },
      { number: "56", name: "Mark Buehrle", position: "P", years: null, retired: "2017" },
      { number: "72", name: "Carlton Fisk", position: "C", years: null, retired: "1997" },
    ],
    leagueWide: { number: "42", name: "Jackie Robinson", league: "MLB", retired: "1997" },
  },
  blackhawks: {
    numbers: [
      { number: "1", name: "Glenn Hall", position: "G", years: "1957–1967", retired: "1988" },
      { number: "3", name: "Keith Magnuson", position: "D", years: "1969–1980", retired: "2008" },
      { number: "3", name: "Pierre Pilote", position: "D", years: "1955–1968", retired: "2008" },
      { number: "7", name: "Chris Chelios", position: "D", years: "1990–1999", retired: "2024" },
      { number: "9", name: "Bobby Hull", position: "LW", years: "1957–1972", retired: "1983" },
      { number: "18", name: "Denis Savard", position: "C", years: "1980–1990, 1995–1997", retired: "1998" },
      { number: "21", name: "Stan Mikita", position: "C", years: "1958–1980", retired: "1980" },
      { number: "35", name: "Tony Esposito", position: "G", years: "1969–1984", retired: "1988" },
      { number: "81", name: "Marián Hossa", position: "RW", years: "2009–2017", retired: "2022" },
    ],
    leagueWide: { number: "99", name: "Wayne Gretzky", league: "the NHL", retired: "2000" },
  },
  fire: { numbers: [], leagueWide: null },
  sky: {
    numbers: [
      { number: "3", name: "Candace Parker", position: "F", years: "2021–2022", retired: null },
      { number: "14", name: "Allie Quigley", position: "G", years: "2013–2022", retired: null },
    ],
    leagueWide: null,
  },
  stars: { numbers: [], leagueWide: null },
};

// { numbers (lowest first), leagueWide } for one team.
function teamRetiredNumbers(favorite) {
  const { numbers, leagueWide } = RETIRED_NUMBERS[favorite.key];
  return { numbers: [...numbers].sort((a, b) => Number(a.number) - Number(b.number)), leagueWide };
}
