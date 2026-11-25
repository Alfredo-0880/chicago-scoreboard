// Win chances for upcoming games, from ESPN's game summary: its "Matchup
// Predictor" (NFL, NBA, and MLB games), or, when it has none (the NHL), the
// chances implied by the sportsbook odds ESPN lists for the game (Alfredo,
// 2026-11-25). Each game is a separate request, so only games in the next
// WIN_CHANCE_DAYS days get one, and only when Upcoming or Today is open
// (Claude's choice). The two chances can fall short of 100: the rest is a
// tie (NFL) or a draw (soccer).

const WIN_CHANCE_DAYS = 7;

// "NFL:401873081" -> { status: "loading" | "loaded" | "error", value }, where
// value is { home, away, source } (percentages, and "ESPN" or the sportsbook's
// name) or null when there are neither. The
// app fills it; the tests leave it empty.
const winChances = new Map();

function winChanceKey(game) {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === game.teamKey);
  return `${favorite.league}:${game.id}`;
}

function needsWinChance(game, now) {
  return game.state === "pre" && game.date - now < WIN_CHANCE_DAYS * 24 * 60 * 60 * 1000;
}

async function fetchWinChance(game) {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === game.teamKey);
  const leagueInfo = leagueInfoFor(favorite.league);
  const summary = await fetchJson(`${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/summary?event=${game.id}`);
  return parsePredictor(summary) || chancesFromOdds(summary);
}

// ESPN's game summary -> { home, away, source: "ESPN" }, or null without a predictor.
function parsePredictor(summary) {
  const predictor = summary && summary.predictor;
  if (!predictor || !predictor.homeTeam || !predictor.awayTeam) return null;
  const home = Number(predictor.homeTeam.gameProjection);
  const away = Number(predictor.awayTeam.gameProjection);
  return Number.isFinite(home) && Number.isFinite(away) ? { home, away, source: "ESPN" } : null;
}

// American odds -> the chance they imply: -166 -> 166/266, +140 -> 100/240.
function impliedChance(moneyLine) {
  const odds = Number(moneyLine);
  if (!Number.isFinite(odds) || odds === 0) return null;
  return odds < 0 ? -odds / (-odds + 100) : 100 / (odds + 100);
}

// The win chances implied by the first sportsbook's moneyline odds in ESPN's
// summary ("pickcenter"), or null. A sportsbook's chances add up to more
// than 100% (its cut), so they're scaled to add up to 100, counting a
// draw's odds where a game can end in one (soccer).
function chancesFromOdds(summary) {
  const book = ((summary && summary.pickcenter) || []).find((entry) => entry.homeTeamOdds && entry.awayTeamOdds);
  if (!book) return null;
  const home = impliedChance(book.homeTeamOdds.moneyLine);
  const away = impliedChance(book.awayTeamOdds.moneyLine);
  if (home === null || away === null) return null;
  const draw = book.drawOdds ? impliedChance(book.drawOdds.moneyLine) || 0 : 0;
  const total = home + away + draw;
  const source = (book.provider && book.provider.name) || "sportsbook";
  return { home: (100 * home) / total, away: (100 * away) / total, source };
}

// "ESPN win chance: Bears 44% · Lions 55%", or "Win chance from DraftKings
// odds: Blackhawks 40% · Kraken 60%", for a game row, or null.
function winChanceText(game, chances = winChances) {
  if (game.state !== "pre") return null;
  const entry = chances.get(winChanceKey(game));
  if (!entry || entry.status !== "loaded" || !entry.value) return null;
  const favorite = FAVORITE_TEAMS.find((team) => team.key === game.teamKey);
  const ours = game.isHome ? entry.value.home : entry.value.away;
  const theirs = game.isHome ? entry.value.away : entry.value.home;
  const label = entry.value.source === "ESPN" ? "ESPN win chance" : `Win chance from ${entry.value.source} odds`;
  return `${label}: ${favorite.label} ${Math.round(ours)}% · ${game.opponent} ${Math.round(theirs)}%`;
}
