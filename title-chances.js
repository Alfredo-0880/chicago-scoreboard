// Each team's chances to win its division, its conference, and the league,
// for the team cards (Alfredo, 2026-11-25). The NFL and NBA have ESPN's
// power index projections (FPI and BPI). MLB and the WNBA have only a
// title chance, from the sportsbook "futures" odds ESPN lists (World Series
// and WNBA winner). The NHL's futures there are undated, from a sportsbook
// that has closed, so they're left out, and MLS and the NWSL have none.
// One request per league answers for every team in it.

const TITLE_CHANCE_LEAGUES = {
  NFL: { title: "Super Bowl" },
  NBA: { title: "NBA title" },
  MLB: { title: "World Series", futuresMarket: /World Series - Winner/ },
  WNBA: { title: "WNBA title", futuresMarket: /^WNBA - Winner/ },
};

// league key -> Map of ESPN team id -> { playoffs, playIn, division,
// conference, title } (ESPN's text: "22.7%", ">99.9%"; playIn is the NBA's
// only, else null), or for futures leagues { title, source, season } (the
// sportsbook, and the season bet on, which after a season ends is the next). The app fills it; the tests leave it empty.
const titleChances = {};

// The title odds for the season being bet on: after a season ends (MLB in
// November), that's the next one, so the year after the standings' is
// tried first.
async function fetchFuturesChances(leagueKey, seasonName) {
  const leagueInfo = leagueInfoFor(leagueKey);
  const year = seasonYearFromName(seasonName);
  for (const season of [year + 1, year]) {
    const url = `https://sports.core.api.espn.com/v2/sports/${leagueInfo.sport}/leagues/${leagueInfo.league}/seasons/${season}/futures?limit=50`;
    const chances = parseFuturesChances(await fetchJson(url), TITLE_CHANCE_LEAGUES[leagueKey].futuresMarket, season);
    if (chances.size > 0) return chances;
  }
  return new Map();
}

// American odds -> the chance they imply (impliedChance is in predictor.js).
// A futures market's chances add up to far more than 100% (the sportsbook's
// cut), so every team's is scaled down by the same amount to add up to 100.
function parseFuturesChances(data, marketName, season) {
  const market = ((data && data.items) || []).find((item) => marketName.test(item.name || ""));
  const book = market && (market.futures || [])[0];
  const chances = new Map();
  if (!book) return chances;
  const entries = (book.books || [])
    .map((entry) => ({ teamId: (/\/teams\/(\d+)/.exec((entry.team && entry.team.$ref) || "") || [])[1], chance: impliedChance(entry.value) }))
    .filter((entry) => entry.teamId && entry.chance !== null);
  const total = entries.reduce((sum, entry) => sum + entry.chance, 0);
  const source = (book.provider && book.provider.name) || "sportsbook";
  for (const entry of entries) chances.set(entry.teamId, { title: percentText((100 * entry.chance) / total), source, season });
  return chances;
}

// 3.87 -> "3.9%", 0.04 -> "<0.1%".
function percentText(percent) {
  return percent < 0.1 ? "<0.1%" : `${percent.toFixed(1)}%`;
}

// "2026" -> 2026, "2026-27" -> 2027: ESPN files a season under the year it ends.
function seasonYearFromName(seasonName) {
  const split = /^(\d{4})-(\d{2})/.exec(seasonName);
  return split ? Number(split[1].slice(0, 2) + split[2]) : Number(seasonName.slice(0, 4));
}

async function fetchTitleChances(leagueKey, seasonName) {
  const leagueInfo = leagueInfoFor(leagueKey);
  if (TITLE_CHANCE_LEAGUES[leagueKey].futuresMarket) return fetchFuturesChances(leagueKey, seasonName);
  const url = `https://sports.core.api.espn.com/v2/sports/${leagueInfo.sport}/leagues/${leagueInfo.league}/seasons/${seasonYearFromName(seasonName)}/powerindex?limit=40`;
  return parsePowerIndex(await fetchJson(url));
}

// ESPN's power index -> Map of team id -> chances. The NFL's numbers are in
// "predictives", the NBA's in "stats". Reaching the final ("make title
// game") means winning the conference. The playoff (and NBA play-in)
// chances say more for a team far from a title (Alfredo, 2026-11-25).
function parsePowerIndex(data) {
  const chances = new Map();
  for (const item of (data && data.items) || []) {
    const teamId = /\/teams\/(\d+)/.exec((item.team && item.team.$ref) || "");
    if (!teamId) continue;
    const values = Object.fromEntries([...(item.predictives || []), ...(item.stats || [])].map((stat) => [stat.name, stat.displayValue]));
    const division = values.probwindiv;
    const conference = values.probmaketitlegame;
    const title = values.probwintitle;
    const playoffs = values.probmakeplayoffs || null;
    const playIn = values.playinchance || null;
    if (division && conference && title) chances.set(teamId[1], { playoffs, playIn, division, conference, title });
  }
  return chances;
}

// The card's two lines: ["Playoffs 0.6% · Play-in 9.5%", "Division 0% ·
// Conference 0% · NBA title 0%"], or null. The first is left out when ESPN
// gives no playoff chance. The NHL's are the app's own estimate
// (nhl-estimate.js: a Map by team abbreviation), and say so.
function titleChancesLines(favorite, chancesByLeague = titleChances) {
  // MLS and the NWSL (mls-estimate.js): the season's outcome once it's over,
  // else the Fire's own playoff estimate.
  if (favorite.league === "MLS" || favorite.league === "NWSL") {
    const entry = chancesByLeague[favorite.league];
    if (!entry) return null;
    if (entry.seasonOver) return [entry.seasonOver];
    const estimate = entry.estimate;
    if (!estimate) return null;
    return [`Our estimate: Round One ${percentText(estimate.roundOne)} · ${estimate.conferenceName} ${percentText(estimate.conference)} · MLS Cup ${percentText(estimate.cup)}`];
  }
  if (favorite.league === "NHL") {
    const estimate = chancesByLeague.NHL && chancesByLeague.NHL.get(favorite.abbreviation);
    return estimate ? [`Our estimate: Playoffs ${percentText(estimate.playoffs)} · Division ${percentText(estimate.division)}`] : null;
  }
  const league = TITLE_CHANCE_LEAGUES[favorite.league];
  const chances = league && chancesByLeague[favorite.league] && chancesByLeague[favorite.league].get(favorite.espnTeamId);
  if (!chances) return null;
  // The year, since these can be for next season while the card shows this one's.
  if (chances.source) return [`${chances.season} ${league.title} ${chances.title} (from ${chances.source} odds)`];
  const playoffs = [chances.playoffs && `Playoffs ${chances.playoffs}`, chances.playIn && `Play-in ${chances.playIn}`].filter(Boolean).join(" · ");
  const titles = `Division ${chances.division} · Conference ${chances.conference} · ${league.title} ${chances.title}`;
  return playoffs ? [playoffs, titles] : [titles];
}
