// Loads a favorite team's whole schedule (played and upcoming games) from
// ESPN and turns each game into a simple object.

async function fetchTeamGames(favorite) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const schedules = await Promise.all(leagueInfo.scheduleQueries.map((query) => fetchJson(teamScheduleUrl(favorite, query))));
  schedules.push(...(await finishedSeasonSchedules(favorite, schedules)));

  const gamesById = new Map();
  for (const schedule of schedules) {
    for (const event of schedule.events || []) {
      const game = parseGame(favorite, event);
      if (game) gamesById.set(game.id, game);
    }
  }
  return [...gamesById.values()].sort((a, b) => a.date - b.date);
}

// After a season ends, ESPN's schedule jumps ahead to the next one (in
// November the White Sox schedule is 2027's), so Final would have no games.
// ESPN says so: the season it sent ("requestedSeason") is later than the
// current one ("season"). Then the current season's schedule is loaded too,
// so Final shows its results while Upcoming shows the next season's games.
// If that load fails, the next season's games still show. Test settings
// skip it: the saved ESPN answers don't include it.
async function finishedSeasonSchedules(favorite, schedules) {
  const current = finishedSeasonToAdd(schedules[0]);
  if (!current || savedAnswerFor) return [];
  const leagueInfo = leagueInfoFor(favorite.league);
  try {
    return await Promise.all(leagueInfo.scheduleQueries.map((query) => fetchJson(teamScheduleUrl(favorite, `${query}&season=${current}`))));
  } catch (error) {
    recordProblem("ESPN", `Could not load the ${current} ${favorite.label} schedule`, error);
    return [];
  }
}

// The current season's year when ESPN sent a later season's schedule
// instead, or null.
function finishedSeasonToAdd(schedule) {
  const sent = schedule && schedule.requestedSeason && schedule.requestedSeason.year;
  const current = schedule && schedule.season && schedule.season.year;
  return sent && current && sent > current ? current : null;
}

// One part of a team's schedule; query picks it (for example "seasontype=2").
function teamScheduleUrl(favorite, query) {
  const leagueInfo = leagueInfoFor(favorite.league);
  return `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/teams/${favorite.scheduleTeamId}/schedule?${query}`;
}

function parseGame(favorite, event) {
  const competition = event.competitions && event.competitions[0];
  if (!competition) return null;
  // Match by full name too: ESPN's abbreviations change over the years
  // (the White Sox were "CWS" in older seasons, "CHW" now).
  const ours = competition.competitors.find(
    (c) => c.team.abbreviation === favorite.abbreviation || c.team.displayName === favorite.fullName
  );
  const theirs = competition.competitors.find((c) => c !== ours);
  if (!ours || !theirs) return null;

  const status = competition.status.type;
  const venue = competition.venue || {};
  const address = venue.address || {};
  const note = competition.notes && competition.notes[0] && competition.notes[0].headline;
  const seasonType = event.seasonType && event.seasonType.name;

  const timeKnown = competition.timeValid !== false;
  return {
    id: event.id,
    teamKey: favorite.key,
    date: timeKnown ? new Date(event.date) : dateWithoutTime(event.date),
    timeKnown,
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
    // Preseason (spring training in baseball) is ESPN's season type 1.
    preseason: Boolean(event.seasonType && event.seasonType.type === 1),
    // "2026" or "2026-27", to match the game with that season's standings.
    seasonName: (event.season && event.season.displayName) || null,
  };
}

// A game with no start time yet: ESPN gives it a placeholder of midnight
// Eastern ("2027-07-16T04:00Z"), which is 11 PM the night before in Chicago,
// so the game would show a day early. Its date part is the game's day, so
// keep that and put the game at midday, which is that day in every US time
// zone.
function dateWithoutTime(espnDate) {
  return new Date(`${espnDate.slice(0, 10)}T17:00:00Z`);
}

// ESPN sends scores as {value, displayValue} in schedules but as plain
// strings elsewhere.
function scoreOf(competitor) {
  const score = competitor.score;
  if (score === undefined || score === null) return null;
  return typeof score === "object" ? score.displayValue : String(score);
}

const GAMES_PER_TEAM = 10;

// Whether Final leaves out any team's older results.
function hasHiddenFinals(gamesByTeam) {
  return gamesByTeam.some((games) => games.filter((game) => game.completed).length > GAMES_PER_TEAM);
}

// Games being played right now, for the Live now section.
function liveGames(gamesByTeam) {
  return gamesByTeam.flat().filter((game) => game.state === "in").sort((a, b) => a.date - b.date);
}

// Final: each team's most recent results (or, with allFinals, every result
// this season), newest first.
// Upcoming: each team's next games, soonest first. (Games being played now
// are shown separately, in Live now.)
function selectGames(gamesByTeam, show, allFinals = false) {
  const selected = [];
  for (const games of gamesByTeam) {
    if (show === "final") {
      const finals = games.filter((game) => game.completed);
      selected.push(...(allFinals ? finals : finals.slice(-GAMES_PER_TEAM)));
    } else {
      selected.push(...games.filter((game) => game.state === "pre").slice(0, GAMES_PER_TEAM));
    }
  }
  return selected.sort((a, b) => (show === "final" ? b.date - a.date : a.date - b.date));
}
