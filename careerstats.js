// Each player's stats from ESPN (this season, each past season, and their
// whole career), loaded one player at a time when someone taps them on the
// Stats tab.
//
// ESPN sends far more stats than fit on a phone, so each sport lists the
// ones shown, in sections. A section is shown only when the player has
// numbers in it (a receiver's Passing section is all zeros, for example).
// - categories: ESPN's names for where the section's stats are. Hockey
//   files a player's stats under their position, so it lists several.
// - stats: [label, ESPN's name for the stat].
// gamesStat is the games played (or appearances) shown above the sections.
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

const ESPN_SOCCER_CORE_API = "https://sports.core.api.espn.com/v2/sports/soccer/leagues";

// A player's stats, ready for the Stats tab's three views:
// { sport, currentYear, career: careerSummary(...), seasons: [{ year, label, team, lookup }] }.
async function fetchCareerStats(favorite, playerId) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const currentYear = currentSeasonYear(favorite.league, new Date());
  if (leagueInfo.sport === "soccer") {
    const base = `${ESPN_SOCCER_CORE_API}/${leagueInfo.league}`;
    const [career, seasons] = await Promise.all([
      fetchJson(`${base}/athletes/${playerId}/statistics`),
      fetchSoccerSeasons(base, playerId, currentYear),
    ]);
    return { sport: "soccer", currentYear, career: careerSummary("soccer", parseCareerStats(career)), seasons };
  }
  const url = `https://site.web.api.espn.com/apis/common/v3/sports/${leagueInfo.sport}/${leagueInfo.league}/athletes/${playerId}/stats`;
  const espnData = await fetchJson(url);
  return {
    sport: leagueInfo.sport,
    currentYear,
    career: careerSummary(leagueInfo.sport, parseCareerStats(espnData)),
    seasons: parseSeasonStats(espnData),
  };
}

// The year ESPN files this season's games under. NBA and NHL seasons are
// named for the year they end (2026-27 is 2027) and start in October; the
// NFL's January and February games belong to the season before.
function currentSeasonYear(leagueKey, today) {
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 is January
  if (SEASONS_SPAN_TWO_YEARS.includes(leagueKey)) return month >= 9 ? year + 1 : year;
  if (leagueKey === "NFL") return month <= 1 ? year - 1 : year;
  return year;
}

// Soccer stats come one season at a time: ESPN lists the seasons a player
// has, then each one's regular season stats load from its own address.
// ESPN doesn't say which team a soccer player was on, so team is blank.
async function fetchSoccerSeasons(base, playerId, currentYear) {
  const seasonList = await fetchJson(`${base}/athletes/${playerId}/seasons`);
  const seasons = await Promise.all(
    soccerSeasonYears(seasonList, currentYear).map(async (year) => {
      try {
        return soccerSeason(year, await fetchJson(`${base}/seasons/${year}/types/1/athletes/${playerId}/statistics`));
      } catch (error) {
        return null; // a season ESPN has no stats for is left out
      }
    })
  );
  return seasons.filter(Boolean).sort(oldestFirst);
}

// Years from ESPN's season links (".../seasons/2025?lang=en"), oldest first,
// leaving out seasons that haven't started.
function soccerSeasonYears(seasonList, currentYear) {
  return (seasonList.items || [])
    .map((item) => Number(((item.$ref || "").match(/seasons\/(\d{4})/) || [])[1]))
    .filter((year) => year && year <= currentYear)
    .sort((a, b) => a - b);
}

// One soccer season, or null when the player made no appearances in it.
function soccerSeason(year, espnData) {
  const lookup = parseCareerStats(espnData);
  if (!hasNumber(gamesIn("soccer", lookup) || "")) return null;
  return { year, label: String(year), team: "", lookup };
}

// ESPN lists each category's stats season by season, with the team. A
// player traded midseason gets one row per team.
// Returns [{ year, label: "2026-27", team: "Chicago Bulls", lookup }], oldest first.
function parseSeasonStats(espnData) {
  const teams = Object.values(espnData.teams || {});
  const teamName = (id) => (teams.find((team) => team.id === id) || {}).displayName || "";
  const seasons = new Map();
  for (const category of espnData.categories || []) {
    for (const row of category.statistics || []) {
      const key = `${row.season.year}-${row.teamId}`;
      if (!seasons.has(key)) {
        seasons.set(key, { year: row.season.year, label: seasonYearsLabel(row.season), team: teamName(row.teamId), lookup: {} });
      }
      seasons.get(key).lookup[category.name] = Object.fromEntries((category.names || []).map((name, index) => [name, row.stats[index]]));
    }
  }
  return [...seasons.values()].sort(oldestFirst);
}

// ESPN calls NHL seasons "26-27"; the app calls every two-year season "2026-27".
function seasonYearsLabel(season) {
  return season.displayName.includes("-") ? `${season.year - 1}-${String(season.year).slice(2)}` : String(season.year);
}

function oldestFirst(a, b) {
  return a.year - b.year;
}

// The Past seasons view: one table per section, newest season first.
// Returns [{ title, gamesLabel, statLabels, rows: [{ label, team, games, values }] }],
// leaving out sections where no season has numbers. A season of zeros
// still gets its row (a keeper with no yellow cards that year).
function pastSeasonTables(sport, seasons, currentYear) {
  const sportStats = CAREER_STATS[sport];
  const past = seasons.filter((season) => season.year < currentYear).reverse();
  return sportStats.sections
    .map((section) => {
      const rows = past
        .map((season) => {
          const categoryName = section.categories.find((name) => season.lookup[name]);
          if (!categoryName) return null;
          const values = section.stats.map(([, name]) => season.lookup[categoryName][name] ?? "—");
          return { label: season.label, team: season.team, games: gamesIn(sport, season.lookup) ?? "—", values };
        })
        .filter(Boolean);
      return { title: section.title, gamesLabel: sportStats.gamesLabel, statLabels: section.stats.map(([label]) => label), rows };
    })
    .filter((table) => table.rows.some((row) => row.values.some(hasNumber)));
}

// The This season view: one summary per team the player played for this
// season (usually one), or [] when they haven't played yet.
function currentSeasonSummaries(sport, seasons, currentYear) {
  return seasons
    .filter((season) => season.year === currentYear)
    .map((season) => ({ label: season.label, team: season.team, summary: careerSummary(sport, season.lookup) }))
    .filter(({ summary }) => summary.sections.length > 0);
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
// Works the same for a career or one season, since both are lookups.
function careerSummary(sport, lookup) {
  const sportStats = CAREER_STATS[sport];
  const sections = [];
  for (const section of sportStats.sections) {
    const categoryName = section.categories.find((name) => lookup[name]);
    if (!categoryName) continue;
    const values = lookup[categoryName];
    const stats = section.stats.map(([label, name]) => ({ label, value: values[name] ?? "—" }));
    if (stats.some((stat) => hasNumber(stat.value))) sections.push({ title: section.title, stats });
  }
  const games = gamesIn(sport, lookup);
  return { games: games === undefined ? null : { label: sportStats.gamesLabel, value: games }, sections };
}

// Games played, from the first of the sport's categories the player has
// (even one hidden for being all zeros, so a soccer player with no cards
// still shows appearances), or undefined when ESPN doesn't say.
function gamesIn(sport, lookup) {
  const { gamesStat, sections } = CAREER_STATS[sport];
  for (const section of sections) {
    const categoryName = section.categories.find((name) => lookup[name]);
    if (categoryName && lookup[categoryName][gamesStat] !== undefined) return lookup[categoryName][gamesStat];
  }
  return undefined;
}

// "8,503", "-100", ".903" count; "0", "0.0", "0-0", "--", and "—" don't.
function hasNumber(value) {
  return /[1-9]/.test(value);
}
