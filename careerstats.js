// Each player's career stats from ESPN, loaded one player at a time when
// someone taps them on the Stats tab.
//
// ESPN sends far more stats than fit on a phone, so each sport lists the
// ones shown, in sections. A section is shown only when the player has
// numbers in it (a receiver's Passing section is all zeros, for example).
// - categories: ESPN's names for where the section's stats are. Hockey
//   files a player's stats under their position, so it lists several.
// - stats: [label, ESPN's name for the stat].
// gamesStat is the stat shown first, read from the first section shown.
//
// Soccer comes from a different ESPN address, whose totals count only the
// player's games in that league (MLS or the NWSL), and it has no assists.

const CAREER_STATS = {
  football: {
    gamesLabel: "Games played",
    gamesStat: "gamesPlayed",
    sections: [
      {
        title: "Passing",
        categories: ["passing"],
        stats: [
          ["Passing yards", "passingYards"],
          ["Touchdowns", "passingTouchdowns"],
          ["Interceptions", "interceptions"],
          ["Completions", "completions"],
          ["Attempts", "passingAttempts"],
          ["Completion percentage", "completionPct"],
          ["Passer rating", "QBRating"],
        ],
      },
      {
        title: "Rushing",
        categories: ["rushing"],
        stats: [
          ["Rushing yards", "rushingYards"],
          ["Touchdowns", "rushingTouchdowns"],
          ["Carries", "rushingAttempts"],
          ["Yards per carry", "yardsPerRushAttempt"],
        ],
      },
      {
        title: "Receiving",
        categories: ["receiving"],
        stats: [
          ["Receiving yards", "receivingYards"],
          ["Touchdowns", "receivingTouchdowns"],
          ["Receptions", "receptions"],
          ["Yards per reception", "yardsPerReception"],
        ],
      },
      {
        title: "Defense",
        categories: ["defensive"],
        stats: [
          ["Tackles", "totalTackles"],
          ["Sacks", "sacks"],
          ["Interceptions", "interceptions"],
          ["Forced fumbles", "fumblesForced"],
          ["Passes defended", "passesDefended"],
        ],
      },
      {
        title: "Kicking",
        categories: ["kicking"],
        stats: [
          ["Field goals made", "fieldGoalsMade-fieldGoalAttempts"],
          ["Field goal percentage", "fieldGoalPct"],
          ["Longest field goal", "longFieldGoalMade"],
          ["Extra points", "extraPointsMade"],
        ],
      },
      {
        title: "Punting",
        categories: ["punting"],
        stats: [
          ["Punts", "punts"],
          ["Average punt", "grossAvgPuntYards"],
          ["Longest punt", "longPunt"],
          ["Inside the 20", "puntsInside20"],
        ],
      },
      {
        title: "Returns",
        categories: ["returning"],
        stats: [
          ["Kick returns", "kickReturns"],
          ["Kick return yards", "kickReturnYards"],
          ["Punt returns", "puntReturns"],
          ["Punt return yards", "puntReturnYards"],
        ],
      },
    ],
  },
  basketball: {
    gamesLabel: "Games played",
    gamesStat: "gamesPlayed",
    sections: [
      {
        title: "Per game",
        categories: ["averages"],
        stats: [
          ["Points", "avgPoints"],
          ["Rebounds", "avgRebounds"],
          ["Assists", "avgAssists"],
          ["Steals", "avgSteals"],
          ["Blocks", "avgBlocks"],
          ["Minutes", "avgMinutes"],
          ["Field goal percentage", "fieldGoalPct"],
          ["3-point percentage", "threePointFieldGoalPct"],
          ["Free throw percentage", "freeThrowPct"],
        ],
      },
      {
        title: "Career totals",
        categories: ["totals"],
        stats: [
          ["Points", "points"],
          ["Rebounds", "totalRebounds"],
          ["Assists", "assists"],
          ["Steals", "steals"],
          ["Blocks", "blocks"],
        ],
      },
    ],
  },
  baseball: {
    gamesLabel: "Games played",
    gamesStat: "gamesPlayed",
    sections: [
      {
        title: "Batting",
        categories: ["career-batting"],
        stats: [
          ["Batting average", "avg"],
          ["Home runs", "homeRuns"],
          ["Runs batted in", "RBIs"],
          ["Hits", "hits"],
          ["Runs", "runs"],
          ["Stolen bases", "stolenBases"],
          ["On-base plus slugging", "OPS"],
        ],
      },
      {
        title: "Pitching",
        categories: ["pitching"],
        stats: [
          ["Wins", "wins"],
          ["Losses", "losses"],
          ["Earned run average", "ERA"],
          ["Strikeouts", "strikeouts"],
          ["Innings pitched", "innings"],
          ["Walks plus hits per inning", "WHIP"],
          ["Saves", "saves"],
        ],
      },
    ],
  },
  hockey: {
    gamesLabel: "Games played",
    gamesStat: "games",
    sections: [
      {
        title: "Skating",
        categories: ["center", "left-wing", "right-wing", "defense"],
        stats: [
          ["Goals", "goals"],
          ["Assists", "assists"],
          ["Points", "points"],
          ["Plus/minus", "plusMinus"],
          ["Penalty minutes", "penaltyMinutes"],
          ["Power play goals", "powerPlayGoals"],
          ["Game-winning goals", "gameWinningGoals"],
          ["Time on ice per game", "timeOnIcePerGame"],
        ],
      },
      {
        title: "Goaltending",
        categories: ["goaltender"],
        stats: [
          ["Wins", "wins"],
          ["Losses", "losses"],
          ["Overtime losses", "overtimeLosses"],
          ["Save percentage", "savePct"],
          ["Goals against average", "avgGoalsAgainst"],
          ["Shutouts", "shutouts"],
        ],
      },
    ],
  },
  soccer: {
    gamesLabel: "Appearances",
    gamesStat: "appearances",
    sections: [
      {
        title: "Overall",
        categories: ["general"],
        stats: [
          ["Substitute appearances", "subIns"],
          ["Yellow cards", "yellowCards"],
          ["Red cards", "redCards"],
        ],
      },
      {
        title: "Attacking",
        categories: ["offensive"],
        stats: [
          ["Goals", "totalGoals"],
          ["Shot assists", "shotAssists"],
          ["Passes", "totalPasses"],
          ["Accurate passes", "accuratePasses"],
        ],
      },
      {
        title: "Defending",
        categories: ["defensive"],
        stats: [
          ["Tackles", "totalTackles"],
          ["Interceptions", "interceptions"],
          ["Clearances", "totalClearance"],
          ["Shots blocked", "blockedShots"],
        ],
      },
      {
        title: "Goalkeeping",
        categories: ["goalKeeping"],
        stats: [
          ["Penalty kicks saved", "penaltyKicksSaved"],
          ["Crosses claimed", "crossesCaught"],
          ["Punches", "punches"],
          ["Smothers", "smothers"],
        ],
      },
    ],
  },
};

async function fetchCareerStats(favorite, playerId) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const url =
    leagueInfo.sport === "soccer"
      ? `https://sports.core.api.espn.com/v2/sports/soccer/leagues/${leagueInfo.league}/athletes/${playerId}/statistics`
      : `https://site.web.api.espn.com/apis/common/v3/sports/${leagueInfo.sport}/${leagueInfo.league}/athletes/${playerId}/stats`;
  return careerSummary(leagueInfo.sport, parseCareerStats(await fetchJson(url)));
}

// Both ESPN addresses -> { category: { stat: "8,503" } }. Most sports list
// each category's stat names beside its career totals; soccer pairs each
// stat with its value.
function parseCareerStats(espnData) {
  const lookup = {};
  for (const category of espnData.categories || []) {
    const values = {};
    (category.names || []).forEach((name, index) => {
      values[name] = (category.totals || [])[index];
    });
    lookup[category.name] = values;
  }
  for (const category of ((espnData.splits || {}).categories) || []) {
    lookup[category.name] = Object.fromEntries((category.stats || []).map((stat) => [stat.name, stat.displayValue]));
  }
  return lookup;
}

// What the Stats tab shows for a player:
// { games: { label, value } or null, sections: [{ title, stats: [{ label, value }] }] }.
function careerSummary(sport, lookup) {
  const sportStats = CAREER_STATS[sport];
  const sections = [];
  let games = null;
  for (const section of sportStats.sections) {
    const categoryName = section.categories.find((name) => lookup[name]);
    if (!categoryName) continue;
    const values = lookup[categoryName];
    // Games come from the first section the player has, even one hidden for
    // being all zeros, so a soccer player with no cards still shows appearances.
    if (!games && values[sportStats.gamesStat] !== undefined) {
      games = { label: sportStats.gamesLabel, value: values[sportStats.gamesStat] };
    }
    const stats = section.stats.map(([label, name]) => ({ label, value: values[name] ?? "—" }));
    if (stats.some((stat) => hasNumber(stat.value))) sections.push({ title: section.title, stats });
  }
  return { games, sections };
}

// "8,503", "-100", ".903" count; "0", "0.0", "0-0", "--", and "—" don't.
function hasNumber(value) {
  return /[1-9]/.test(value);
}
