// Live scores. During a game, ESPN's team schedule has the clock but no
// score, so live scores come from the league's scoreboard and are merged
// into the team's games.

const LIVE_CHECK_SECONDS = 30;

// Games that need live scores: being played now, or past their start time
// but not yet marked as started.
function gamesNeedingLiveScores(games, now) {
  return games.filter((game) => !game.completed && (game.state === "in" || (game.state === "pre" && game.date <= now)));
}

// ESPN scoreboard -> Map of game id -> { state, completed, statusDetail,
// scores: { BOS: "27", CHI: "21" }, winners: { BOS: false, CHI: true } }.
function parseScoreboard(espnData) {
  const liveById = new Map();
  for (const event of espnData.events || []) {
    const competition = event.competitions && event.competitions[0];
    if (!competition) continue;
    const scores = {};
    const winners = {};
    for (const competitor of competition.competitors) {
      scores[competitor.team.abbreviation] = scoreOf(competitor);
      winners[competitor.team.abbreviation] = competitor.winner === true;
    }
    const status = competition.status.type;
    liveById.set(event.id, {
      state: status.state,
      completed: status.completed,
      statusDetail: status.shortDetail,
      scores,
      winners,
    });
  }
  return liveById;
}

// The game with the scoreboard's latest score and status, or the game
// unchanged if the scoreboard doesn't list it.
function applyLiveScore(game, favorite, live) {
  if (!live) return game;
  return {
    ...game,
    state: live.state,
    completed: live.completed,
    statusDetail: live.statusDetail,
    ourScore: live.scores[favorite.abbreviation] ?? game.ourScore,
    theirScore: live.scores[game.opponentAbbreviation] ?? game.theirScore,
    won: live.winners[favorite.abbreviation] === true,
  };
}

// Checks the scoreboard for every league with a Chicago game on now, and
// merges in the scores. Does nothing (and loads nothing) when no game is on.
async function updateLiveScores() {
  const now = new Date();
  const teamsWithLiveGames = FAVORITE_TEAMS.filter((favorite) => {
    const gamesState = loadState("games", favorite.key);
    return gamesState.status === "loaded" && gamesNeedingLiveScores(gamesState.value, now).length > 0;
  });
  if (teamsWithLiveGames.length === 0) return;

  const leagueKeys = [...new Set(teamsWithLiveGames.map((favorite) => favorite.league))];
  const scoreboards = await Promise.all(
    leagueKeys.map(async (leagueKey) => {
      const leagueInfo = leagueInfoFor(leagueKey);
      try {
        const url = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/scoreboard`;
        return [leagueKey, parseScoreboard(await fetchJson(url))];
      } catch (error) {
        console.error(`Could not load live ${leagueKey} scores`, error);
        return [leagueKey, new Map()];
      }
    })
  );
  const liveByLeague = new Map(scoreboards);

  for (const favorite of teamsWithLiveGames) {
    const gamesState = state.games[favorite.key];
    const liveById = liveByLeague.get(favorite.league);
    gamesState.value = gamesState.value.map((game) => applyLiveScore(game, favorite, liveById.get(game.id)));
  }
  render();
}
