// Loads a favorite team's whole schedule (played and upcoming games) from
// ESPN and turns each game into a simple object.

async function fetchTeamGames(favorite) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const baseUrl = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/teams/${favorite.scheduleTeamId}/schedule`;
  const schedules = await Promise.all(leagueInfo.scheduleQueries.map((query) => fetchJson(`${baseUrl}?${query}`)));

  const gamesById = new Map();
  for (const schedule of schedules) {
    for (const event of schedule.events || []) {
      const game = parseGame(favorite, event);
      if (game) gamesById.set(game.id, game);
    }
  }
  return [...gamesById.values()].sort((a, b) => a.date - b.date);
}

function parseGame(favorite, event) {
  const competition = event.competitions && event.competitions[0];
  if (!competition) return null;
  const ours = competition.competitors.find((c) => c.team.abbreviation === favorite.abbreviation);
  const theirs = competition.competitors.find((c) => c !== ours);
  if (!ours || !theirs) return null;

  const status = competition.status.type;
  const venue = competition.venue || {};
  const address = venue.address || {};
  const note = competition.notes && competition.notes[0] && competition.notes[0].headline;
  const seasonType = event.seasonType && event.seasonType.name;

  return {
    id: event.id,
    teamKey: favorite.key,
    date: new Date(event.date),
    timeKnown: competition.timeValid !== false,
    // "pre" = scheduled, "in" = being played now, "post" = over
    state: status.state,
    completed: status.completed,
    statusDetail: status.shortDetail || status.description,
    isHome: ours.homeAway === "home",
    opponent: theirs.team.shortDisplayName || theirs.team.displayName,
    opponentAbbreviation: theirs.team.abbreviation,
    opponentLogos: logosFrom(theirs.team),
    ourLogos: logosFrom(ours.team),
    ourScore: scoreOf(ours),
    theirScore: scoreOf(theirs),
    won: ours.winner === true,
    venue: venue.fullName ? { name: venue.fullName, city: [address.city, address.state].filter(Boolean).join(", ") } : null,
    note: note || (seasonType && seasonType !== "Regular Season" ? seasonType : ""),
  };
}

// ESPN sends scores as {value, displayValue} in schedules but as plain
// strings elsewhere.
function scoreOf(competitor) {
  const score = competitor.score;
  if (score === undefined || score === null) return null;
  return typeof score === "object" ? score.displayValue : String(score);
}

const GAMES_PER_TEAM = 10;

// Games being played right now, for the Live now section.
function liveGames(gamesByTeam) {
  return gamesByTeam.flat().filter((game) => game.state === "in").sort((a, b) => a.date - b.date);
}

// Final: each team's most recent results, newest first.
// Upcoming: each team's next games, soonest first. (Games being played now
// are shown separately, in Live now.)
function selectGames(gamesByTeam, show) {
  const selected = [];
  for (const games of gamesByTeam) {
    if (show === "final") {
      selected.push(...games.filter((game) => game.completed).slice(-GAMES_PER_TEAM));
    } else {
      selected.push(...games.filter((game) => game.state === "pre").slice(0, GAMES_PER_TEAM));
    }
  }
  return selected.sort((a, b) => (show === "final" ? b.date - a.date : a.date - b.date));
}
