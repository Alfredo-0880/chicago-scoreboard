// The Crosstown Classic, Cubs vs White Sox, season by season: each
// regular season's series since interleague play began in 1997 (the teams'
// only other meeting was the 1906 World Series). Copied from Wikipedia's
// "Cubs–White Sox rivalry" season-by-season table on 2026-11-18. The 30
// seasons add up to the all-time record in rivals.js (Cubs 80–78), and
// 2003, 2004, 2010, 2025, and 2026 match ESPN's game results. Add each new
// season at the top.
//
// winner is null for a split season. atCubs and atSox are the games at
// each team's ballpark ({ leader, record }, leader null for a split), or
// null when they didn't play there that year.

const CROSSTOWN_SEASONS = [
  { year: 2026, winner: null, record: "3–3", atCubs: { leader: "Cubs", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2025, winner: "Cubs", record: "5–1", atCubs: { leader: "Cubs", record: "3–0" }, atSox: { leader: "Cubs", record: "2–1" } },
  { year: 2024, winner: "Cubs", record: "4–0", atCubs: { leader: "Cubs", record: "2–0" }, atSox: { leader: "Cubs", record: "2–0" } },
  { year: 2023, winner: "Cubs", record: "3–1", atCubs: { leader: null, record: "1–1" }, atSox: { leader: "Cubs", record: "2–0" } },
  { year: 2022, winner: "White Sox", record: "3–1", atCubs: { leader: "White Sox", record: "2–0" }, atSox: { leader: null, record: "1–1" } },
  { year: 2021, winner: "White Sox", record: "5–1", atCubs: { leader: "White Sox", record: "3–0" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2020, winner: null, record: "3–3", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "Cubs", record: "2–1" } },
  { year: 2019, winner: null, record: "2–2", atCubs: { leader: null, record: "1–1" }, atSox: { leader: null, record: "1–1" } },
  { year: 2018, winner: "Cubs", record: "4–2", atCubs: { leader: "Cubs", record: "2–1" }, atSox: { leader: "Cubs", record: "2–1" } },
  { year: 2017, winner: "Cubs", record: "3–1", atCubs: { leader: null, record: "1–1" }, atSox: { leader: "Cubs", record: "2–0" } },
  { year: 2016, winner: null, record: "2–2", atCubs: { leader: "Cubs", record: "2–0" }, atSox: { leader: "White Sox", record: "2–0" } },
  { year: 2015, winner: null, record: "3–3", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "Cubs", record: "2–1" } },
  { year: 2014, winner: "White Sox", record: "3–1", atCubs: { leader: "White Sox", record: "2–0" }, atSox: { leader: null, record: "1–1" } },
  { year: 2013, winner: "Cubs", record: "4–0", atCubs: { leader: "Cubs", record: "2–0" }, atSox: { leader: "Cubs", record: "2–0" } },
  { year: 2012, winner: "White Sox", record: "4–2", atCubs: { leader: "White Sox", record: "3–0" }, atSox: { leader: "Cubs", record: "2–1" } },
  { year: 2011, winner: "White Sox", record: "4–2", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2010, winner: "White Sox", record: "4–2", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2009, winner: "White Sox", record: "4–2", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2008, winner: null, record: "3–3", atCubs: { leader: "Cubs", record: "3–0" }, atSox: { leader: "White Sox", record: "3–0" } },
  { year: 2007, winner: "Cubs", record: "5–1", atCubs: { leader: "Cubs", record: "2–1" }, atSox: { leader: "Cubs", record: "3–0" } },
  { year: 2006, winner: "White Sox", record: "4–2", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2005, winner: null, record: "3–3", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "Cubs", record: "2–1" } },
  { year: 2004, winner: "Cubs", record: "4–2", atCubs: { leader: "Cubs", record: "3–0" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2003, winner: "White Sox", record: "4–2", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2002, winner: null, record: "3–3", atCubs: { leader: "Cubs", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2001, winner: "White Sox", record: "4–2", atCubs: { leader: "White Sox", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 2000, winner: null, record: "3–3", atCubs: { leader: "Cubs", record: "2–1" }, atSox: { leader: "White Sox", record: "2–1" } },
  { year: 1999, winner: "White Sox", record: "4–2", atCubs: { leader: "White Sox", record: "3–0" }, atSox: { leader: "Cubs", record: "2–1" } },
  { year: 1998, winner: "Cubs", record: "3–0", atCubs: { leader: "Cubs", record: "3–0" }, atSox: null },
  { year: 1997, winner: "White Sox", record: "2–1", atCubs: null, atSox: { leader: "White Sox", record: "2–1" } },
];
