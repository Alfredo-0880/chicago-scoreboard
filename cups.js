// Cup tournaments beside the leagues, for the Cups tab (Alfredo,
// 2026-11-25): the NBA Cup's group stage, for the Bulls' group, and the
// Leagues Cup's tables (MLS and Liga MX teams), and the Fire's U.S. Open
// Cup games, round by round.
//
// ESPN has no NBA Cup group table, but it labels each group game "NBA Cup -
// Group Play". The Bulls' four Cup opponents are their group, so the table
// is built from all five teams' Cup games: the other four teams' schedules
// are loaded (a season's schedule each, about 1 MB) the first time Cups opens.

const NBA_CUP_GROUP_NOTE = /NBA Cup - Group/i;

// The Bulls' group: their Cup opponents' abbreviations, from their own games.
function nbaCupGroupOpponents(teamGames) {
  return [...new Set(teamGames.filter((game) => NBA_CUP_GROUP_NOTE.test(game.note)).map((game) => game.opponentAbbreviation))];
}

// A Cup game from a team schedule's event, or null if it isn't one:
// { id, date, completed, home: { abbreviation, name, score }, away: {...} }.
function nbaCupGame(event) {
  const competition = event.competitions && event.competitions[0];
  if (!competition || !(competition.notes || []).some((note) => NBA_CUP_GROUP_NOTE.test(note.headline || ""))) return null;
  const side = (homeAway) => {
    const competitor = competition.competitors.find((each) => each.homeAway === homeAway);
    return {
      abbreviation: competitor.team.abbreviation,
      name: competitor.team.shortDisplayName || competitor.team.displayName,
      logos: logosFrom(competitor.team),
      score: scoreOf(competitor),
    };
  };
  return { id: event.id, date: new Date(event.date), completed: competition.status.type.completed === true, home: side("home"), away: side("away") };
}

// The group's games, from the favorite's opponents' schedules: games where
// both teams are in the group, each once.
async function fetchNbaCupGroup(favorite, teamGames) {
  const opponents = nbaCupGroupOpponents(teamGames);
  if (opponents.length === 0) return { teams: [], games: [] };
  const groupTeams = new Set([favorite.abbreviation, ...opponents]);
  const schedules = await Promise.all(
    opponents.map((abbreviation) => fetchJson(`${ESPN_SITE_API}/site/v2/sports/basketball/nba/teams/${abbreviation.toLowerCase()}/schedule`))
  );
  const games = new Map();
  for (const schedule of schedules) {
    for (const event of schedule.events || []) {
      const game = nbaCupGame(event);
      if (game && groupTeams.has(game.home.abbreviation) && groupTeams.has(game.away.abbreviation)) games.set(game.id, game);
    }
  }
  return { teams: [...groupTeams], games: [...games.values()].sort((a, b) => a.date - b.date) };
}

// The group table: each team's wins, losses, and point differential, best
// first. Ties are broken by point differential, then points scored (the
// NBA's head-to-head step isn't modeled).
function nbaCupGroupTable({ teams, games }) {
  const rows = new Map(teams.map((abbreviation) => [abbreviation, { abbreviation, name: abbreviation, logos: null, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 }]));
  for (const game of games) {
    for (const [us, them] of [[game.home, game.away], [game.away, game.home]]) {
      const row = rows.get(us.abbreviation);
      row.name = us.name;
      row.logos = row.logos || us.logos;
      if (!game.completed || us.score === null || them.score === null) continue;
      const [ours, theirs] = [Number(us.score), Number(them.score)];
      row.pointsFor += ours;
      row.pointsAgainst += theirs;
      if (ours > theirs) row.wins++;
      else row.losses++;
    }
  }
  return [...rows.values()]
    .map((row) => ({ ...row, differential: row.pointsFor - row.pointsAgainst }))
    .sort((a, b) => b.wins - a.wins || b.differential - a.differential || b.pointsFor - a.pointsFor);
}

// The Leagues Cup: MLS and Liga MX teams, each league's teams ranked in one
// table, the best four of each reaching the quarterfinals. ESPN has these
// tables. A draw goes to a penalty shootout: 2 points for the winner, 1 for
// the loser.
async function fetchLeaguesCupStandings() {
  return parseLeaguesCupStandings(await fetchJson(`${ESPN_SITE_API}/v2/sports/soccer/concacaf.leagues.cup/standings`));
}

// ESPN's answer -> { season: "2026 Leagues Cup", tables: [{ name: "MLS",
// rows: [{ abbreviation, name, logos, played, wins, draws, losses,
// goalDifference, points, advanced }] }] }, rows in ESPN's rank order.
function parseLeaguesCupStandings(data) {
  const tables = (data.children || []).map((group) => {
    const rows = ((group.standings && group.standings.entries) || []).map((entry) => {
      const stats = Object.fromEntries((entry.stats || []).map((stat) => [stat.name, stat]));
      const value = (name) => (stats[name] ? Number(stats[name].value) : 0);
      return {
        abbreviation: entry.team.abbreviation,
        name: entry.team.shortDisplayName || entry.team.displayName,
        logos: logosFrom(entry.team),
        rank: value("rank") || 99,
        played: value("gamesPlayed"),
        wins: value("wins"),
        draws: value("ties"),
        losses: value("losses"),
        goalDifference: value("pointDifferential"),
        points: value("points"),
        advanced: Boolean(entry.note && /qualif/i.test(entry.note.description || "")),
      };
    });
    return { name: group.name, rows: rows.sort((a, b) => a.rank - b.rank) };
  });
  return { season: (data.season && data.season.displayName) || "Leagues Cup", tables };
}

// The U.S. Open Cup is knockout only, so there's no table: the Fire's games
// in it this season, from their U.S. Open Cup schedule on ESPN, which names
// each game's round ("Round of 32").
async function fetchOpenCupRun(fire) {
  return parseOpenCupRun(await fetchJson(`${ESPN_SITE_API}/site/v2/sports/soccer/usa.open/teams/${fire.espnTeamId}/schedule`), fire);
}

// ESPN's answer -> { season: "2026 U.S. Open Cup", games: [{ round, date,
// completed, home, away }] }, earliest first. Each side: { abbreviation,
// name, logos, score, shootout (penalties, or null), won }.
function parseOpenCupRun(data, fire) {
  const side = (competitor) => {
    const score = competitor.score && typeof competitor.score === "object" ? competitor.score : { displayValue: competitor.score };
    const shootout = competitor.shootoutScore ?? score.shootoutScore ?? null;
    return {
      abbreviation: competitor.team.abbreviation,
      name: competitor.team.id === fire.espnTeamId ? fire.label : competitor.team.shortDisplayName || competitor.team.displayName,
      logos: logosFrom(competitor.team),
      score: score.displayValue ?? "",
      shootout: shootout === null ? null : Number(shootout),
      won: competitor.winner === true,
    };
  };
  const games = (data.events || [])
    .map((event) => {
      const competition = event.competitions[0];
      const home = competition.competitors.find((team) => team.homeAway === "home");
      const away = competition.competitors.find((team) => team.homeAway === "away");
      return {
        round: (event.seasonType && event.seasonType.name) || "",
        date: new Date(event.date),
        completed: Boolean(competition.status && competition.status.type && competition.status.type.completed),
        home: side(home),
        away: side(away),
      };
    })
    .sort((a, b) => a.date - b.date);
  return { season: (data.season && data.season.displayName) || "U.S. Open Cup", games };
}

// The cups' knockout brackets (Alfredo, 2026-11-26), from ESPN's
// scoreboard for each cup. The scoreboard lists the cup's rounds with their
// dates (its calendar), but only answers for a day or a month, so a bracket
// loads each month from its first round on (about 700 KB for a busy month,
// little for an empty one) and keeps those rounds' games. Each game's round
// is in its note ("U.S. Open Cup, Round of 16"), which is used for the name,
// since the calendar shortens some ("Rd of 16").
const CUP_BRACKETS = {
  leaguesCup: { slug: "concacaf.leagues.cup", firstRound: "Quarterfinals" },
  // Its first two rounds are mostly amateur and lower-division clubs.
  openCup: { slug: "usa.open", firstRound: "Round of 32" },
};

async function fetchCupBracket({ slug, firstRound }) {
  const scoreboard = `${ESPN_SITE_API}/site/v2/sports/soccer/${slug}/scoreboard`;
  const months = cupBracketMonths(await fetchJson(scoreboard), firstRound);
  const answers = await Promise.all(months.map((month) => fetchJson(`${scoreboard}?dates=${month}`)));
  return cupBracketRounds(answers.flatMap((answer) => answer.events || []), firstRound);
}

// The months, as ESPN writes them ("202608"), from the first round's start
// to the last round's end.
function cupBracketMonths(scoreboard, firstRound) {
  const calendar = (scoreboard.leagues && scoreboard.leagues[0] && scoreboard.leagues[0].calendar) || [];
  const entries = calendar.flatMap((part) => part.entries || []);
  const first = entries.findIndex((entry) => entry.label.toLowerCase() === firstRound.toLowerCase());
  if (first === -1) return [];
  const month = (date) => date.getUTCFullYear() * 12 + date.getUTCMonth();
  const from = month(new Date(entries[first].startDate));
  // The end is the last moment's month: an end of "2027-01-01T00:00Z" means December.
  const to = month(new Date(new Date(entries[entries.length - 1].endDate).getTime() - 1));
  const months = [];
  for (let each = from; each <= to; each++) months.push(`${Math.floor(each / 12)}${String((each % 12) + 1).padStart(2, "0")}`);
  return months;
}

// Rounds in bracketHtml's shape (playoffs-view.js), from firstRound on,
// in the order they were played: each knockout game is a one-game series.
// Each team's number is its goals, and a shootout is told in the summary
// ("Monterrey win 5-4 on penalties").
function cupBracketRounds(events, firstRound) {
  const roundOf = (event) => (event.competitions[0].altGameNote || "").split(", ").pop();
  const games = [...new Map(events.map((event) => [event.id, event])).values()].sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstGame = games.find((event) => roundOf(event).toLowerCase() === firstRound.toLowerCase());
  if (!firstGame) return [];
  const knockout = games.filter((event) => new Date(event.date) >= new Date(firstGame.date));
  const names = [...new Set(knockout.map(roundOf))];
  return names.map((name) => ({ name, series: knockout.filter((event) => roundOf(event) === name).map(cupKnockoutSeries) }));
}

function cupKnockoutSeries(event) {
  const competition = event.competitions[0];
  const completed = Boolean(competition.status && competition.status.type && competition.status.type.completed);
  // Away team first, like the other brackets' "away @ home".
  const ordered = ["away", "home"].map((side) => competition.competitors.find((competitor) => competitor.homeAway === side));
  const teams = ordered.map((competitor) => ({
    name: competitor.team.shortDisplayName || competitor.team.displayName,
    abbreviation: competitor.team.abbreviation,
    logos: logosFrom(competitor.team),
    wins: completed ? Number(competitor.score) : "",
  }));
  const winnerIndex = completed ? ordered.findIndex((competitor) => competitor.winner === true) : -1;
  const winner = winnerIndex === -1 ? null : teams[winnerIndex];
  const note = (competition.notes || []).map((each) => each.headline || each.text).find(Boolean);
  const loser = winner && teams.find((team) => team !== winner);
  const summary = !completed
    ? displayDate(new Date(event.date), { weekday: "short", month: "short", day: "numeric" })
    : note || (winner ? `${winner.name} win ${winner.wins}–${loser.wins}` : `${teams[0].wins}–${teams[1].wins}`);
  return { teams, completed, winner, summary, start: new Date(event.date), games: [] };
}
