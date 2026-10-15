// Loads league standings from ESPN's public feed and turns them into a
// simple shape the page can draw.

async function fetchLeagueStandings(leagueInfo) {
  const url = `${ESPN_SITE_API}/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/standings?level=3`;
  return parseLeagueStandings(leagueInfo.key, await fetchJson(url));
}

// ESPN nests league -> conferences -> divisions -> entries, and each team's
// numbers are a list of {name, value, displayValue} stats. Leagues without
// divisions (MLS) put the entries right on each conference, and then the
// conference is drawn as one group.
function parseLeagueStandings(leagueKey, espnData) {
  const leagueInfo = leagueInfoFor(leagueKey);
  const divisions = [];
  let season = null;

  for (const conference of espnData.children || []) {
    const groups = conference.children || [conference];
    for (const division of groups) {
      const standings = division.standings;
      if (!standings) continue;
      season = season || {
        name: standings.seasonDisplayName,
        type: leagueInfo.seasonTypeNames[standings.seasonType] || "",
      };
      const teams = standings.entries.map((entry) => teamFromEntry(leagueKey, entry));
      teams.sort((a, b) => compareTeams(leagueKey, a, b));
      divisions.push({
        title: division === conference ? conference.name : divisionTitle(conference, division),
        conference: conference.abbreviation,
        teams,
      });
    }
  }

  if (divisions.length === 0) {
    throw new Error(`No standings found for ${leagueKey}`);
  }
  return { league: leagueKey, season, divisions };
}

function teamFromEntry(leagueKey, entry) {
  const stats = {};
  for (const stat of entry.stats) {
    stats[stat.name] = stat;
  }
  const number = (name) => (stats[name] ? Number(stats[name].value) : 0);
  const team = {
    name: entry.team.displayName,
    abbreviation: entry.team.abbreviation,
    wins: number("wins"),
    losses: number("losses"),
    ties: number("ties"),
    overtimeLosses: number("otLosses"),
    points: number("points"),
    winPercent: number("winPercent"),
    playoffSeed: number("playoffSeed"),
    rank: number("rank"),
  };
  team.record = formatRecord(leagueKey, team);
  return team;
}

function formatRecord(leagueKey, team) {
  if (leagueKey === "NHL") {
    return `${team.wins}-${team.losses}-${team.overtimeLosses}`;
  }
  if (leagueKey === "MLS") {
    // Soccer records are wins-draws-losses.
    return `${team.wins}-${team.ties}-${team.losses}`;
  }
  const ties = team.ties > 0 ? `-${team.ties}` : "";
  return `${team.wins}-${team.losses}${ties}`;
}

// Hockey and soccer rank by points; the other leagues by winning percentage.
// ESPN's playoff seed (or, in MLS, its rank) breaks ties, since it already
// applies each league's tiebreakers.
function compareTeams(leagueKey, a, b) {
  const primary = leagueInfoFor(leagueKey).rankedByPoints ? b.points - a.points : b.winPercent - a.winPercent;
  if (primary !== 0) return primary;
  return bySeed(a, b);
}

function bySeed(a, b) {
  return (a.playoffSeed || a.rank || 99) - (b.playoffSeed || b.rank || 99);
}

// Make division names short and consistent: "NFC North", "AL Central",
// "East · Atlantic". (ESPN's own short names cut words, like "AL Cent".)
function divisionTitle(conference, division) {
  const conferenceName = conference.abbreviation || conference.name;
  const name = division.name.replace(/ Division$/, "").replace(conference.name, conferenceName);
  return name.startsWith(conferenceName) ? name : `${conferenceName} · ${name}`;
}

// Where a favorite team sits: its division, its rank there, and its
// conference seed.
function findTeamStanding(leagueStandings, abbreviation) {
  for (const division of leagueStandings.divisions) {
    const index = division.teams.findIndex((team) => team.abbreviation === abbreviation);
    if (index !== -1) {
      return { division, divisionRank: index + 1, team: division.teams[index] };
    }
  }
  return null;
}

// How each league fills its last playoff spots:
// - skipPerDivision: division leaders that are already in, so not in the race
// - skipSeeds: conference seeds that are already in (NBA's top 6)
// - spots: how many teams in the race get in (or reach the play-in)
const WILD_CARD_RULES = {
  NFL: { skipPerDivision: 1, skipSeeds: 0, spots: 3, name: "wild card" },
  MLB: { skipPerDivision: 1, skipSeeds: 0, spots: 3, name: "wild card" },
  NHL: { skipPerDivision: 3, skipSeeds: 0, spots: 2, name: "wild card" },
  NBA: { skipPerDivision: 0, skipSeeds: 6, spots: 4, name: "play-in" },
  MLS: { skipPerDivision: 0, skipSeeds: 0, spots: 9, name: "playoff" },
};

// One race per conference, ranked by ESPN's conference seed.
function wildCardRaces(leagueStandings) {
  const rules = WILD_CARD_RULES[leagueStandings.league];
  const raceByConference = new Map();

  for (const division of leagueStandings.divisions) {
    const contenders = division.teams
      .slice(rules.skipPerDivision)
      .filter((team) => !team.playoffSeed || team.playoffSeed > rules.skipSeeds);
    const race = raceByConference.get(division.conference) || [];
    raceByConference.set(division.conference, race.concat(contenders));
  }

  return [...raceByConference].map(([conference, teams]) => ({
    title: `${conference} ${rules.name} race`,
    lineLabel: `${rules.name} line`,
    spots: rules.spots,
    teams: teams.sort(bySeed),
  }));
}
