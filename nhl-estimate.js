// The app's own estimate of NHL playoff and division chances (Alfredo,
// 2026-11-25), since no projections or current odds the app can read exist
// for the NHL. It plays out the rest of the season NHL_SIMULATIONS times
// from the standings: each team's remaining games (of 82) are wins,
// overtime losses, or regulation losses at the rates of its record so far,
// pulled toward an average team because early records are noisy. Then the
// NHL's rules pick the playoff teams: the top 3 in each division and the
// next 2 in each conference (wild cards). It knows only records: not
// injuries, schedules, or who's actually good, so it's much rougher than
// ESPN's or a sportsbook's, and the card says it's ours.

const NHL_SEASON_GAMES = 82;
const NHL_SIMULATIONS = 5000;
// Records count as if each team had also played this many average games
// (winning 45%, losing 12% in overtime), so 10 games say less than 60.
// Hockey records are noisy: about 40 games in, a record is roughly half
// skill and half luck, so this pulls strongly toward average. (With 10,
// the 8-14-2 Blackhawks came out under 0.1%; with 40, about 1%.)
const NHL_AVERAGE_GAMES = 40;
const NHL_AVERAGE = { win: 0.45, overtimeLoss: 0.12 };

// A small repeatable random number generator (mulberry32), so the same
// standings always give the same estimate.
function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// NHL standings -> Map of team abbreviation -> { playoffs, division }, each
// a percentage.
function estimateNhlChances(standings, simulations = NHL_SIMULATIONS, random = seededRandom(124)) {
  const teams = standings.divisions.flatMap((division) =>
    division.teams.map((team) => {
      const played = team.wins + team.losses + team.overtimeLosses;
      const weight = played + NHL_AVERAGE_GAMES;
      return {
        abbreviation: team.abbreviation,
        division: division.title,
        conference: division.conference,
        points: team.points,
        remaining: Math.max(0, NHL_SEASON_GAMES - played),
        winRate: (team.wins + NHL_AVERAGE.win * NHL_AVERAGE_GAMES) / weight,
        overtimeLossRate: (team.overtimeLosses + NHL_AVERAGE.overtimeLoss * NHL_AVERAGE_GAMES) / weight,
      };
    })
  );
  const counts = new Map(teams.map((team) => [team.abbreviation, { playoffs: 0, division: 0 }]));
  for (let run = 0; run < simulations; run++) {
    const finals = teams.map((team) => {
      let points = team.points;
      for (let game = 0; game < team.remaining; game++) {
        const roll = random();
        if (roll < team.winRate) points += 2;
        else if (roll < team.winRate + team.overtimeLossRate) points += 1;
      }
      // A tiny random amount breaks ties (the NHL's tiebreakers aren't modeled).
      return { ...team, final: points + random() * 0.01 };
    });
    for (const playoffTeam of nhlPlayoffTeams(finals)) counts.get(playoffTeam).playoffs++;
    for (const winner of nhlDivisionWinners(finals)) counts.get(winner).division++;
  }
  return new Map([...counts].map(([abbreviation, { playoffs, division }]) => [
    abbreviation,
    { playoffs: (100 * playoffs) / simulations, division: (100 * division) / simulations },
  ]));
}

function byFinalPoints(a, b) {
  return b.final - a.final;
}

function nhlDivisionWinners(teams) {
  const divisions = [...new Set(teams.map((team) => team.division))];
  return divisions.map((division) => teams.filter((team) => team.division === division).sort(byFinalPoints)[0].abbreviation);
}

// The top 3 in each division, then the 2 best others in each conference.
function nhlPlayoffTeams(teams) {
  const playoffTeams = [];
  for (const conference of new Set(teams.map((team) => team.conference))) {
    const inConference = teams.filter((team) => team.conference === conference);
    const divisionTop = [...new Set(inConference.map((team) => team.division))].flatMap((division) =>
      inConference.filter((team) => team.division === division).sort(byFinalPoints).slice(0, 3)
    );
    const wildCards = inConference.filter((team) => !divisionTop.includes(team)).sort(byFinalPoints).slice(0, 2);
    playoffTeams.push(...divisionTop, ...wildCards);
  }
  return playoffTeams.map((team) => team.abbreviation);
}
