// Past MLS and NWSL playoff brackets copied from Wikipedia (soccer-brackets.js),
// turned into the same rounds the Playoff Picture draws from ESPN's games
// (bracketHtml in playoffs-view.js). Each team's number is its goals: in
// the match, or over both legs; in a best-of-three round, games won.

// The season's rounds, or null when there's no copied bracket for it.
// logosFor(favorite) gives a Chicago team's logos (or null for letters).
function soccerBracketRounds(leagueKey, season, logosFor = () => null) {
  const bracket = typeof SOCCER_BRACKETS !== "undefined" && SOCCER_BRACKETS[leagueKey] && SOCCER_BRACKETS[leagueKey][String(season)];
  if (!bracket) return null;
  return bracket.rounds.map((round) => ({
    name: round.name,
    series: round.series.map((series) => soccerSeries(leagueKey, season, series, logosFor)),
  }));
}

function soccerSeries(leagueKey, season, series, logosFor) {
  const [first, second] = series.teams.map((name) => soccerTeam(leagueKey, name, logosFor));
  const goals = (side) => series.games.reduce((total, game) => total + game[side], 0);
  const wonGame = (side, index) => {
    const [mine, theirs] = side === 0 ? series.games[index] : [...series.games[index]].reverse();
    const shootout = series.shootouts[index];
    return mine > theirs || (mine === theirs && shootout !== null && shootout[side] > shootout[1 - side]);
  };
  const gamesWon = (side) => series.games.filter((_, index) => wonGame(side, index)).length;
  first.wins = series.kind === "games" ? gamesWon(0) : goals(0);
  second.wins = series.kind === "games" ? gamesWon(1) : goals(1);
  const teams = [first, second];
  const winner = series.winner === null ? null : teams[series.winner];
  return {
    teams,
    completed: true,
    winner,
    summary: soccerSeriesSummary(series, teams, winner),
    // Only names the series for opening its games, which these don't list.
    start: new Date(Date.UTC(season, 0, 1)),
    games: [],
  };
}

// The Chicago team gets its abbreviation and logo, so it's highlighted like
// in ESPN's brackets; other teams show their initials.
function soccerTeam(leagueKey, name, logosFor) {
  const chicago = FAVORITE_TEAMS.find((team) => team.league === leagueKey && /^Chicago\b/.test(name));
  return {
    name,
    abbreviation: chicago ? chicago.abbreviation : initials(name).toUpperCase(),
    logos: chicago ? logosFor(chicago) : null,
    wins: 0,
  };
}

// "Chicago Fire win 3–2 on aggregate (1–2, 2–0)", "Real Salt Lake win on
// penalties (5–4) after 0–0", "Atlanta United FC win the series 2–1".
function soccerSeriesSummary(series, teams, winner) {
  if (!winner) return "Result not listed";
  const loser = teams.find((team) => team !== winner);
  // Each game's score from the winner's side, so it reads with the sentence.
  const scores = series.games.map((game) => (series.winner === 0 ? game : [...game].reverse()).join("–")).join(", ");
  if (series.kind === "games") return `${winner.name} win the series ${winner.wins}–${loser.wins} (${scores})`;
  const lastShootout = series.shootouts[series.shootouts.length - 1];
  const tied = winner.wins === loser.wins;
  if (tied && lastShootout) {
    const [a, b] = series.winner === 0 ? lastShootout : [...lastShootout].reverse();
    return `${winner.name} win on penalties (${a}–${b}) after ${winner.wins}–${loser.wins}${series.kind === "legs" ? ` on aggregate (${scores})` : ""}`;
  }
  if (series.kind === "legs") {
    return `${winner.name} win ${winner.wins}–${loser.wins} on aggregate${tied && series.awayGoals ? " (away goals)" : ""} (${scores})`;
  }
  return `${winner.name} win ${winner.wins}–${loser.wins}`;
}
