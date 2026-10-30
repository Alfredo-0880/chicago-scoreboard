// League championships won by each Chicago team. ESPN's data has no title
// history, so this list is written by hand from the historical record and
// checked by Alfredo. Past titles don't change: when a team wins a new one,
// add its year here (and to the tests).
//
// Years are the season of the title. The Bears' 1985 season ended with
// Super Bowl XX in January 1986, so it is listed as 1985.

const CHAMPIONSHIPS = {
  bears: {
    title: "NFL Championship",
    years: [1921, 1932, 1933, 1940, 1941, 1943, 1946, 1963, 1985],
    notes: { 1921: "as the Chicago Staleys", 1985: "Super Bowl XX" },
  },
  bulls: { title: "NBA Championship", years: [1991, 1992, 1993, 1996, 1997, 1998], notes: {} },
  cubs: { title: "World Series", years: [1907, 1908, 2016], notes: {} },
  whitesox: { title: "World Series", years: [1906, 1917, 2005], notes: {} },
  blackhawks: { title: "Stanley Cup", years: [1934, 1938, 1961, 2010, 2013, 2015], notes: {} },
  fire: { title: "MLS Cup", years: [1998], notes: {} },
  sky: { title: "WNBA Championship", years: [2021], notes: {} },
  stars: { title: "NWSL Championship", years: [], notes: {} },
};

// { title, count, years: [{ year, note }] } for a team, newest title last.
function teamChampionships(favorite) {
  const record = CHAMPIONSHIPS[favorite.key];
  if (!record) return { title: "", count: 0, years: [] };
  return {
    title: record.title,
    count: record.years.length,
    years: [...record.years].sort((a, b) => a - b).map((year) => ({ year, note: record.notes[year] || "" })),
  };
}
