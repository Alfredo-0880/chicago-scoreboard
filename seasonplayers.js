// Who played in a past season, for Team History. ESPN keeps no past
// rosters (it returns today's roster for any season), but two things still
// know who played: each season's team leaders, and each game's box score.
// Neither has a player's age, height, or salary from back then.

// The leader categories each sport shows, as ESPN names them. ESPN sends
// more (and some twice, like "Passing Leader" and "Passing Yards").
const LEADER_CATEGORIES = {
  football: ["Passing Yards", "Passing Touchdowns", "Rushing Yards", "Rushing Touchdowns", "Receiving Yards", "Receptions", "Tackles", "Sacks", "Interceptions"],
  basketball: ["Points Per Game", "Rebounds Per Game", "Assists Per Game", "Steals Per Game", "Blocks Per Game", "Field Goal Percentage", "Minutes Per Game"],
  baseball: ["Batting Average", "Home Runs", "Runs Batted In", "Hits", "Stolen Bases", "Wins", "Earned Run Average", "Strikeouts", "Saves"],
  hockey: ["Goals", "Assists", "Points", "Plus/Minus Rating", "Wins", "Save Percentage", "Goals Against Average", "Shutouts"],
  soccer: ["Goals", "Assists", "Shots On Target", "Saves", "Yellow Cards"],
};

// Returns [{ category, player, value }], or [] when ESPN has no leaders
// for the season (the NWSL's past seasons).
async function fetchSeasonLeaders(favorite, season) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const seasonType = leagueInfo.sport === "soccer" ? 1 : 2; // regular season
  const url = `https://sports.core.api.espn.com/v2/sports/${leagueInfo.sport}/leagues/${leagueInfo.league}/seasons/${season}/types/${seasonType}/teams/${favorite.espnTeamId}/leaders`;
  let leaders;
  try {
    leaders = await fetchJson(url);
  } catch (error) {
    return [];
  }
  // Leaders link to players instead of naming them; each player loads once.
  const picked = pickLeaderCategories(leagueInfo.sport, leaders);
  const links = [...new Set(picked.map((category) => category.leaders[0].athlete.$ref))];
  const names = {};
  await Promise.all(
    links.map(async (link) => {
      names[link] = (await fetchJson(secureUrl(link))).displayName;
    })
  );
  return parseSeasonLeaders(leagueInfo.sport, leaders, names);
}

// The sport's categories that ESPN sent, in the sport's order, first copy only.
function pickLeaderCategories(sport, leaders) {
  const categories = (leaders.categories || []).filter((category) => category.leaders && category.leaders.length > 0);
  return LEADER_CATEGORIES[sport]
    .map((name) => categories.find((category) => category.displayName === name))
    .filter(Boolean);
}

// names: player link -> name.
function parseSeasonLeaders(sport, leaders, names) {
  return pickLeaderCategories(sport, leaders).map((category) => {
    const leader = category.leaders[0];
    return { category: category.displayName, player: names[leader.athlete.$ref] || "Unknown player", value: leaderValue(leader.displayValue) };
  });
}

// Soccer leaders come as "Matches: 24, Goals: 9"; the last number is the stat.
function leaderValue(displayValue) {
  const parts = String(displayValue).split(", ");
  return parts[parts.length - 1].replace(/^[^:]*:\s*/, "");
}

// Box scores are requested a batch at a time; a baseball season has 162.
const BOX_SCORES_AT_ONCE = 20;

// Everyone who played in the season's games: [{ name, position }], by name.
// Returns [] when ESPN has no box scores with players (past NWSL seasons).
async function fetchSeasonPlayers(favorite, games) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const played = games.filter((game) => game.state === "post");
  const players = new Map();
  for (let start = 0; start < played.length; start += BOX_SCORES_AT_ONCE) {
    const summaries = await Promise.all(
      played.slice(start, start + BOX_SCORES_AT_ONCE).map((game) =>
        fetchJson(`${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/summary?event=${game.id}`).catch(() => null)
      )
    );
    for (const summary of summaries.filter(Boolean)) {
      for (const player of boxScorePlayers(favorite, summary)) {
        const known = players.get(player.name);
        if (!known || (!known.position && player.position)) players.set(player.name, player);
      }
    }
  }
  return [...players.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// The Chicago team's players in one game's box score. Most sports list them
// by stat group (football has no positions there); soccer lists the lineup,
// where only starters and players who came on count.
function boxScorePlayers(favorite, summary) {
  const ours = (team) => isOurTeam(favorite, team || {});
  const box = ((summary.boxscore || {}).players || []).find((side) => ours(side.team));
  if (box) {
    return box.statistics.flatMap((group) =>
      (group.athletes || []).map(({ athlete }) => ({
        name: athlete.displayName,
        position: (athlete.position && athlete.position.abbreviation) || "",
      }))
    );
  }
  const lineup = (summary.rosters || []).find((side) => ours(side.team));
  if (!lineup) return [];
  return (lineup.roster || [])
    .filter((entry) => entry.starter || entry.subbedIn)
    .map((entry) => {
      // A substitute's position is "SUB", which says nothing about where they play.
      const position = (entry.position && entry.position.abbreviation) || "";
      return { name: entry.athlete.displayName, position: position === "SUB" ? "" : position };
    });
}

// Older seasons use older names ("CWS" for the White Sox, "Chicago Red
// Stars"); the Cubs and White Sox play each other, so baseball can't just
// look for "Chicago".
function isOurTeam(favorite, team) {
  if (team.abbreviation === favorite.abbreviation || team.displayName === favorite.fullName) return true;
  return leagueInfoFor(favorite.league).sport === "soccer" && /^Chicago/.test(team.displayName || "");
}
