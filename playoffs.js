// The playoff picture: a bracket of series while a league is in its
// postseason, or "if the season ended today" seeds during its season.

// Is the league in its postseason right now? If so, load its playoff games.
// Returns { inPostseason: false } or { inPostseason: true, rounds }.
async function fetchPlayoffs(leagueInfo, today) {
  const baseUrl = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/scoreboard`;
  const scoreboard = await fetchJson(baseUrl);
  const phase = scoreboard.leagues && scoreboard.leagues[0] && scoreboard.leagues[0].season;
  if (!isPostseasonName(phase && phase.type && phase.type.name)) {
    return { inPostseason: false };
  }

  // A postseason spans at most a few months: fetch this month, the two
  // before it, and the next one. A month can hold hundreds of regular season
  // games (MLB's September has 370), so the limit must be high enough that
  // the playoff games at the end of the month aren't cut off.
  const months = [-2, -1, 0, 1].map((offset) => monthKey(today, offset));
  const pages = await Promise.all(months.map((month) => fetchJson(`${baseUrl}?dates=${month}&limit=1000`)));
  const events = pages.flatMap((page) => page.events || []).filter(isPostseasonEvent);
  return { inPostseason: true, rounds: buildRounds(events) };
}

function isPostseasonName(name) {
  return /post|playoff/i.test(name || "");
}

function isPostseasonEvent(event) {
  const season = event.season || {};
  return season.type === 3 || isPostseasonName(season.slug);
}

// 2026-10-23, -2 -> "202608"
function monthKey(date, offset) {
  const month = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
  return `${month.getUTCFullYear()}${String(month.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Groups playoff games into series (same round, same two teams), and series
// into rounds, earliest round first.
function buildRounds(events) {
  const seriesByKey = new Map();
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  for (const event of sorted) {
    const competition = event.competitions && event.competitions[0];
    if (!competition || competition.competitors.length !== 2) continue;
    const round = roundName(competition);
    const teamIds = competition.competitors.map((competitor) => competitor.id).sort();
    const key = `${round}|${teamIds.join("-")}`;
    const series = seriesByKey.get(key) || { round, start: new Date(event.date), games: [] };
    series.games.push(competition);
    seriesByKey.set(key, series);
  }

  const rounds = new Map();
  for (const series of seriesByKey.values()) {
    const list = rounds.get(series.round) || [];
    list.push(summarizeSeries(series));
    rounds.set(series.round, list);
  }
  return [...rounds].map(([name, seriesList]) => ({ name, series: seriesList }));
}

// ESPN's shorthand for MLB rounds, spelled out for readers who don't know it.
const ROUND_NAMES = {
  ALWC: "AL Wild Card Series",
  NLWC: "NL Wild Card Series",
  ALDS: "AL Division Series",
  NLDS: "NL Division Series",
  ALCS: "AL Championship Series",
  NLCS: "NL Championship Series",
};

// "ALCS - Game 5" -> "AL Championship Series"; "World Series - Game 1" -> "World Series"
function roundName(competition) {
  const headline = (competition.notes && competition.notes[0] && competition.notes[0].headline) || "Playoffs";
  const shortName = headline.split(" - ")[0].trim();
  return ROUND_NAMES[shortName] || shortName;
}

// One series: both teams with their wins, whether it's over, and ESPN's
// one-line summary ("TB wins series 4-2").
function summarizeSeries(series) {
  const latest = series.games[series.games.length - 1];
  const espnSeries = latest.series || null;
  const winsFromSeries = (competitor) => {
    const entry = espnSeries && (espnSeries.competitors || []).find((c) => c.id === competitor.id);
    return entry ? entry.wins : null;
  };
  // Without ESPN series info (single games), count wins game by game.
  const winsFromGames = (competitor) =>
    series.games.filter((game) => game.competitors.some((c) => c.id === competitor.id && c.winner === true)).length;

  const teams = latest.competitors.map((competitor) => ({
    abbreviation: competitor.team.abbreviation,
    name: competitor.team.shortDisplayName || competitor.team.displayName,
    logos: logosFrom(competitor.team),
    wins: winsFromSeries(competitor) ?? winsFromGames(competitor),
  }));
  const completed = espnSeries ? espnSeries.completed === true : latest.status.type.completed;
  const leader = teams[0].wins === teams[1].wins ? null : teams[0].wins > teams[1].wins ? teams[0] : teams[1];

  return {
    teams,
    completed,
    winner: completed ? leader : null,
    summary: (espnSeries && espnSeries.summary) || (completed && leader ? `${leader.name} win` : "Scheduled"),
    start: series.start,
  };
}

// "If the season ended today": for each conference (or the whole league),
// the teams that would make the playoffs, then the teams on the outside.
// Built on the same rules as the wild card race in standings.js.
function playoffPicture(leagueStandings) {
  const leagueKey = leagueStandings.league;
  const rules = WILD_CARD_RULES[leagueKey];
  return wildCardRaces(leagueStandings).map((race) => {
    const racers = new Set(race.teams);
    const conference = rules.wholeLeague
      ? null
      : leagueStandings.divisions.filter((division) => race.title.startsWith(`${division.conference} `));
    const automatic = conference
      ? conference
          .flatMap((division) => division.teams.map((team, index) => ({ team, divisionLeader: index === 0 && !division.isConference })))
          .filter(({ team }) => !racers.has(team))
          .sort((a, b) => bySeed(a.team, b.team))
      : [];
    const lastIn = race.teams[race.spots - 1];

    const entries = [
      ...automatic.map(({ team, divisionLeader }) => automaticEntry(rules, team, divisionLeader)),
      ...race.teams.map((team, index) =>
        index < race.spots
          ? { team, status: rules.name, label: RACE_LABELS[rules.name] }
          : { team, status: "out", label: distanceBehind(leagueKey, team, lastIn) }
      ),
    ];
    return {
      title: rules.wholeLeague ? leagueKey : race.title.replace(` ${rules.name} race`, ""),
      spotsIn: automatic.length + race.spots,
      lineLabel: rules.name === "play-in" ? "play-in line" : "playoff line",
      entries,
    };
  });
}

const RACE_LABELS = { "wild card": "Wild card", "play-in": "Play-in", playoff: "In" };

// Teams that are in without needing the race: NFL division winners, the
// NHL's top 3 in each division, and the NBA's top 6 seeds.
function automaticEntry(rules, team, divisionLeader) {
  if (rules.skipPerDivision === 1 && divisionLeader) return { team, status: "division", label: "Division leader" };
  if (rules.skipPerDivision > 1) return { team, status: "in", label: `Top ${rules.skipPerDivision} in division` };
  return { team, status: "in", label: `Top ${rules.skipSeeds} seed` };
}

// How far a team trails the last team in: points for hockey and soccer,
// games back for the others.
function distanceBehind(leagueKey, team, lastIn) {
  if (leagueInfoFor(leagueKey).rankedByPoints) {
    const points = lastIn.points - team.points;
    return points === 0 ? "Out on tiebreaker" : `${points} ${points === 1 ? "pt" : "pts"} back`;
  }
  const games = (lastIn.wins - team.wins + (team.losses - lastIn.losses)) / 2;
  return games === 0 ? "Out on tiebreaker" : `${games} ${games === 1 ? "game" : "games"} back`;
}
