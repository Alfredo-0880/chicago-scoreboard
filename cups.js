// Cup tournaments beside the leagues, for the Cups tab (Alfredo,
// 2026-11-25). First the NBA Cup's group stage, for the Bulls' group.
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
