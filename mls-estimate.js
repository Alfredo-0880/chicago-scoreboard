// The app's own estimate of the Fire's chances in the MLS playoffs, and
// what the card says once a team's season is over (Alfredo, 2026-11-25).
// Like the NHL estimate, it knows only records, so it's rough and says so.
//
// It plays out the rest of the MLS playoffs MLS_SIMULATIONS times: Round
// One series (best of three, from ESPN's games so far), then single matches
// in the conference semifinals, conference final, and MLS Cup. Seeds are
// each conference's order in the standings; the 1/8 winner meets the 4/5
// winner and the 2/7 the 3/6. Each match goes to a team with the chance
// strength / (strength + other's), where strength is points per game
// pulled toward average, and the host's is raised a little. Draws end in
// penalties, so every match has a winner.

const MLS_SIMULATIONS = 5000;
const MLS_AVERAGE_GAMES = 17; // records pulled toward 1.4 points a game as if half a season more were played
const MLS_HOME_EDGE = 1.2;

function mlsStrength(team) {
  const games = team.wins + team.losses + team.ties;
  return (team.points + 1.4 * MLS_AVERAGE_GAMES) / (games + MLS_AVERAGE_GAMES);
}

// Each conference's teams by seed: { East: [{ abbreviation, seed, strength, points }], ... }.
function mlsSeeds(standings) {
  const seeds = {};
  for (const division of standings.divisions) {
    seeds[division.conference] = division.teams.map((team, index) => ({
      abbreviation: team.abbreviation, seed: index + 1, strength: mlsStrength(team), points: team.points,
    }));
  }
  return seeds;
}

// One match: the host wins with its strength raised by the home edge.
function hostWins(host, visitor, random) {
  const hostStrength = host.strength * MLS_HOME_EDGE;
  return random() < hostStrength / (hostStrength + visitor.strength);
}

// ESPN's Round One series (best of three) for a conference's slot: the
// series with the higher seed (1 to 4) in it, other than the wild card
// match. -> { higher, lower, wins }, or null if ESPN doesn't list it yet.
function mlsRoundOneSeries(conferenceSeeds, rounds, higherSeed) {
  const higher = conferenceSeeds[higherSeed - 1];
  const series = rounds
    .flatMap((round) => round.series)
    .find((each) => each.teams.some((team) => team.abbreviation === higher.abbreviation) && !isWildCardSeries(each, conferenceSeeds));
  if (!series) return null;
  const otherTeam = series.teams.find((team) => team.abbreviation !== higher.abbreviation);
  const lower = conferenceSeeds.find((team) => team.abbreviation === otherTeam.abbreviation);
  if (!lower) return null;
  const higherTeam = series.teams.find((team) => team.abbreviation === higher.abbreviation);
  return { higher, lower, wins: { [higher.abbreviation]: higherTeam.wins, [lower.abbreviation]: otherTeam.wins } };
}

// The wild card match is seeds 8 and 9.
function isWildCardSeries(series, conferenceSeeds) {
  const seeds = series.teams.map((team) => (conferenceSeeds.find((each) => each.abbreviation === team.abbreviation) || {}).seed);
  return seeds.includes(8) && seeds.includes(9);
}

// Plays out a best-of-three from its current wins: games 1 and 3 at the higher seed.
function playRoundOne({ higher, lower, wins }, random) {
  const won = { ...wins };
  while (won[higher.abbreviation] < 2 && won[lower.abbreviation] < 2) {
    const gameNumber = won[higher.abbreviation] + won[lower.abbreviation] + 1;
    const [host, visitor] = gameNumber === 2 ? [lower, higher] : [higher, lower];
    won[hostWins(host, visitor, random) ? host.abbreviation : visitor.abbreviation]++;
  }
  return won[higher.abbreviation] === 2 ? higher : lower;
}

// A single match at the better seed (or, for MLS Cup, more points).
function playMatch(a, b, random, byPoints = false) {
  const aHosts = byPoints ? a.points >= b.points : a.seed <= b.seed;
  const [host, visitor] = aHosts ? [a, b] : [b, a];
  return hostWins(host, visitor, random) ? host : visitor;
}

// MLS standings and ESPN's playoff rounds -> Map of team abbreviation ->
// { roundOne, conference, cup, conferenceName } (percentages, and "East" or
// "West"), for the teams still alive.
function estimateMlsChances(standings, rounds, simulations = MLS_SIMULATIONS, random = seededRandom(124)) {
  const seeds = mlsSeeds(standings);
  const conferences = Object.keys(seeds);
  const series = Object.fromEntries(conferences.map((conference) => [conference, [1, 2, 3, 4].map((seed) => mlsRoundOneSeries(seeds[conference], rounds, seed))]));
  if (conferences.some((conference) => series[conference].includes(null))) return new Map();
  const counts = new Map();
  const count = (team, key) => {
    const entry = counts.get(team.abbreviation) || { roundOne: 0, conference: 0, cup: 0 };
    entry[key]++;
    counts.set(team.abbreviation, entry);
  };
  for (let run = 0; run < simulations; run++) {
    const champions = conferences.map((conference) => {
      const [one, two, three, four] = series[conference].map((each) => playRoundOne(each, random));
      [one, two, three, four].forEach((team) => count(team, "roundOne"));
      const champion = playMatch(playMatch(one, four, random), playMatch(two, three, random), random);
      count(champion, "conference");
      return champion;
    });
    count(playMatch(champions[0], champions[1], random, true), "cup");
  }
  const conferenceOf = (abbreviation) => conferences.find((conference) => seeds[conference].some((team) => team.abbreviation === abbreviation));
  return new Map([...counts].map(([abbreviation, entry]) => [abbreviation, {
    conferenceName: conferenceOf(abbreviation),
    roundOne: (100 * entry.roundOne) / simulations,
    conference: (100 * entry.conference) / simulations,
    cup: (100 * entry.cup) / simulations,
  }]));
}

// What a team's card says once its season is over, from its league's
// playoff rounds, or null while it's still playing (or before the playoffs):
// "Season over: missed the playoffs", "... lost in Semifinals", "... won the
// title". seasonFinished: the final has been played. A round named like a
// game note (ESPN's current MLS rounds: "NE leads series 1-0") isn't named.
function seasonOverText(abbreviation, rounds, seasonFinished) {
  if (rounds.length === 0) return null;
  const ours = rounds.flatMap((round) => round.series.map((series) => ({ round: round.name, series })))
    .filter(({ series }) => series.teams.some((team) => team.abbreviation === abbreviation));
  if (ours.length === 0) return "Season over: missed the playoffs";
  const last = ours[ours.length - 1];
  if (!last.series.completed) return null;
  if (last.series.winner && last.series.winner.abbreviation !== abbreviation) {
    return /\d/.test(last.round) ? "Season over: lost in the playoffs" : `Season over: lost in the ${last.round}`;
  }
  return seasonFinished ? "Season over: won the title" : null;
}
