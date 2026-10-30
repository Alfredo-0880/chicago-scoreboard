// Team History: a past season's record and game results, from ESPN's
// schedules. (ESPN doesn't keep past rosters or coaches; for those it
// returns today's, so they aren't shown.)

const HISTORY_FIRST_SEASON = 2005;

// NBA and NHL seasons cross two years; ESPN names them by the year they
// end (2011 = the 2010-11 season).
const SEASONS_SPAN_TWO_YEARS = ["NBA", "NHL"];

// Past seasons, newest first. The newest is the last one that has finished.
function pastSeasons(favorite, today) {
  const year = today.getFullYear();
  const latest = SEASONS_SPAN_TWO_YEARS.includes(favorite.league) ? year : year - 1;
  const seasons = [];
  for (let season = latest; season >= HISTORY_FIRST_SEASON; season--) seasons.push(season);
  return seasons;
}

// 2011 -> "2010-11" for NBA and NHL; "2011" otherwise.
function seasonLabel(favorite, season) {
  if (!SEASONS_SPAN_TWO_YEARS.includes(favorite.league)) return String(season);
  return `${season - 1}-${String(season).slice(2)}`;
}

async function fetchSeasonHistory(favorite, season) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const baseUrl = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/teams/${favorite.scheduleTeamId}/schedule?season=${season}`;
  // Soccer sends the whole season in one list; the US leagues split
  // regular season (2) and postseason (3).
  const queries = leagueInfo.sport === "soccer" ? [""] : ["&seasontype=2", "&seasontype=3"];
  const schedules = await Promise.all(queries.map((query) => fetchJson(baseUrl + query)));
  return parseSeasonHistory(favorite, schedules.flatMap((schedule) => schedule.events || []));
}

// { regular: [games], postseason: [games] }, each in date order. Preseason
// games are left out.
function parseSeasonHistory(favorite, events) {
  const history = { regular: [], postseason: [] };
  const seen = new Set();
  for (const event of events) {
    const phase = seasonPhase(event);
    const game = parseGame(favorite, event);
    if (!phase || !game || seen.has(game.id)) continue;
    seen.add(game.id);
    history[phase].push({ ...game, note: phase === "postseason" ? game.note : "" });
  }
  history.regular.sort((a, b) => a.date - b.date);
  history.postseason.sort((a, b) => a.date - b.date);
  return history;
}

// "regular", "postseason", or null for preseason, from ESPN's label for
// the game ("2010 Major League Soccer Regular Season", "Postseason", ...).
function seasonPhase(event) {
  const name = (event.seasonType && event.seasonType.name) || "";
  if (/pre-?season/i.test(name)) return null;
  if (/regular/i.test(name)) return "regular";
  return "postseason";
}

// The record from finished games, in each sport's style:
//   NFL "11-5" (or "11-5-1" with a tie), NBA/WNBA/MLB "62-20",
//   NHL "52-22-8" (overtime and shootout losses last, regular season only;
//   in the playoffs they're plain losses), soccer "9-9-12"
//   (wins-draws-losses). Null when ESPN has no results for the games.
function seasonRecord(favorite, games, isPlayoffs = false) {
  const finished = games.filter((game) => game.completed && game.ourScore !== null && game.theirScore !== null);
  if (finished.length === 0) return null;

  let wins = 0;
  let losses = 0;
  let ties = 0;
  let overtimeLosses = 0;
  for (const game of finished) {
    if (game.ourScore === game.theirScore) ties += 1;
    else if (game.won) wins += 1;
    else if (/OT|SO/.test(game.statusDetail || "")) overtimeLosses += 1;
    else losses += 1;
  }

  if (favorite.league === "NHL" && !isPlayoffs) return `${wins}-${losses}-${overtimeLosses}`;
  if (leagueInfoFor(favorite.league).sport === "soccer") return `${wins}-${ties}-${losses + overtimeLosses}`;
  if (favorite.league === "NFL" && ties > 0) return `${wins}-${losses + overtimeLosses}-${ties}`;
  return `${wins}-${losses + overtimeLosses}`;
}
