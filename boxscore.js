// One finished game's box score: how each Chicago player did in it, for the
// Games tab. ESPN's game summary has a stat group per kind of player
// (passing, batting, goalies...) for most sports, and a lineup with each
// player's stats for soccer.

// The tables each sport shows, a few stats each, like the Stats tab. A table
// takes the stat group whose name, or one of whose stat keys, is `group`
// (basketball and baseball groups have no names).
const BOX_SCORE_TABLES = {
  football: [
    { title: "Passing", group: "passing", stats: [["completions/passingAttempts", "C/ATT"], ["passingYards", "YDS"], ["passingTouchdowns", "TD"], ["interceptions", "INT"]] },
    { title: "Rushing", group: "rushing", stats: [["rushingAttempts", "CAR"], ["rushingYards", "YDS"], ["rushingTouchdowns", "TD"]] },
    { title: "Receiving", group: "receiving", stats: [["receptions", "REC"], ["receivingYards", "YDS"], ["receivingTouchdowns", "TD"]] },
    { title: "Defense", group: "defensive", stats: [["totalTackles", "TCKL"], ["sacks", "SACKS"], ["passesDefended", "PD"]] },
  ],
  basketball: [
    { title: "Players", group: "points", stats: [["minutes", "MIN"], ["points", "PTS"], ["rebounds", "REB"], ["assists", "AST"]] },
  ],
  baseball: [
    { title: "Batting", group: "hits-atBats", stats: [["atBats", "AB"], ["runs", "R"], ["hits", "H"], ["RBIs", "RBI"], ["homeRuns", "HR"]] },
    { title: "Pitching", group: "fullInnings.partInnings", stats: [["fullInnings.partInnings", "IP"], ["hits", "H"], ["earnedRuns", "ER"], ["strikeouts", "K"]] },
  ],
  hockey: [
    { title: "Forwards", group: "forwards", stats: [["goals", "G"], ["assists", "A"], ["shotsTotal", "S"], ["timeOnIce", "TOI"]] },
    { title: "Defense", group: "defenses", stats: [["goals", "G"], ["assists", "A"], ["shotsTotal", "S"], ["timeOnIce", "TOI"]] },
    { title: "Goalies", group: "goalies", stats: [["shotsAgainst", "SA"], ["saves", "SV"], ["savePct", "SV%"], ["timeOnIce", "TOI"]] },
  ],
  // Soccer stats come per player, not per group; only goalkeepers have saves.
  soccer: [
    { title: "Players", stats: [["totalGoals", "G"], ["goalAssists", "A"], ["totalShots", "SH"], ["saves", "SV"]] },
  ],
};

// Shown for a stat ESPN didn't send for that player.
const MISSING_STAT = "–";

async function fetchBoxScore(favorite, gameId) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const summary = await fetchJson(`${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/summary?event=${gameId}`);
  return parseBoxScore(favorite, summary);
}

// [{ title, columns, rows: [{ name, values }] }], leaving out tables with no
// players; [] when ESPN has no box score for the game.
function parseBoxScore(favorite, summary) {
  const sport = leagueInfoFor(favorite.league).sport;
  const tables = sport === "soccer" ? soccerBoxScore(favorite, summary) : groupedBoxScore(favorite, summary, BOX_SCORE_TABLES[sport]);
  return tables.filter((table) => table.rows.length > 0);
}

function groupedBoxScore(favorite, summary, tableSpecs) {
  const side = ((summary.boxscore || {}).players || []).find((players) => isOurTeam(favorite, players.team || {}));
  if (!side) return [];
  return tableSpecs.map(({ title, group, stats }) => {
    const found = side.statistics.find((candidate) => candidate.name === group || (candidate.keys || []).includes(group));
    // A player who didn't play is listed with no stats.
    const athletes = found ? found.athletes.filter((entry) => entry.stats && entry.stats.length > 0) : [];
    return {
      title,
      columns: stats.map(([, label]) => label),
      rows: athletes.map((entry) => ({
        name: entry.athlete.displayName,
        values: stats.map(([key]) => {
          const index = found.keys.indexOf(key);
          return index === -1 ? MISSING_STAT : entry.stats[index];
        }),
      })),
    };
  });
}

// Everyone who started or came on, in lineup order.
function soccerBoxScore(favorite, summary) {
  const lineup = (summary.rosters || []).find((side) => isOurTeam(favorite, side.team || {}));
  if (!lineup) return [];
  const [{ title, stats }] = BOX_SCORE_TABLES.soccer;
  const played = (lineup.roster || []).filter((entry) => entry.starter || entry.subbedIn);
  return [
    {
      title,
      columns: stats.map(([, label]) => label),
      rows: played.map((entry) => {
        const byName = Object.fromEntries((entry.stats || []).map((stat) => [stat.name, stat.displayValue]));
        return { name: entry.athlete.displayName, values: stats.map(([key]) => byName[key] ?? MISSING_STAT) };
      }),
    },
  ];
}
