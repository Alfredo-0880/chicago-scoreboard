// The playoff picture: a bracket of series while a league is in its
// postseason, or "if the season ended today" seeds during its season.

// Is the league in its postseason right now? If so, load its playoff games.
// Returns { inPostseason: false } or { inPostseason: true, rounds }.
async function fetchPlayoffs(leagueInfo, today) {
  const baseUrl = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/scoreboard`;
  const scoreboard = await fetchJson(baseUrl);
  const phase = scoreboard.leagues && scoreboard.leagues[0] && scoreboard.leagues[0].season;
  if (!isPostseasonName(phase && phase.type && phase.type.name)) {
    return { inPostseason: false };
  }

  // A postseason spans at most a few months: fetch this month, the two
  // before it, and the next one. A month can hold hundreds of regular season
  // games (MLB's September has 370), so the limit must be high enough that
  // the playoff games at the end of the month aren't cut off.
  const months = [-2, -1, 0, 1].map((offset) => monthKey(today, offset));
  const pages = await Promise.all(months.map((month) => fetchJson(`${baseUrl}?dates=${month}&limit=1000`)));
  const events = pages.flatMap((page) => page.events || []).filter(isPostseasonEvent);
  return { inPostseason: true, rounds: buildRounds(events) };
}

function isPostseasonName(name) {
  return /post|playoff/i.test(name || "");
}

function isPostseasonEvent(event) {
  const season = event.season || {};
  return season.type === 3 || isPostseasonName(season.slug);
}

// 2026-10-23, -2 -> "202608"
function monthKey(date, offset) {
  const month = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
  return `${month.getUTCFullYear()}${String(month.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Groups playoff games into series (same two teams, same round), and
// series into rounds, earliest round first. ESPN writes round names
// differently from game to game ("WNBA Finals", "WNBA FINALS" in 2025), so
// they're compared ignoring capitals, and it leaves the name off some games
// (Game 3 of the 2016 Red Sox-Indians ALDS), which then join the two teams'
// latest series. Teams can meet twice in one postseason (a 2020 NHL bubble
// round robin, then a series), so the round still matters.
function buildRounds(events) {
  const seriesByTeams = new Map(); // "5-16" -> that pair's series, oldest first
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  for (const event of sorted) {
    const competition = event.competitions && event.competitions[0];
    if (!competition || competition.competitors.length !== 2) continue;
    const teams = competition.competitors.map((competitor) => competitor.id).sort().join("-");
    const pairSeries = seriesByTeams.get(teams) || [];
    const round = roundName(competition);
    const unnamed = round === GENERIC_ROUND_NAME;
    let series = unnamed
      ? pairSeries.at(-1)
      : pairSeries.find((existing) => existing.round.toLowerCase() === round.toLowerCase() || existing.round === GENERIC_ROUND_NAME);
    if (!series) {
      series = { round, start: new Date(event.date), games: [] };
      pairSeries.push(series);
    } else if (series.round === GENERIC_ROUND_NAME) {
      series.round = round;
    }
    series.games.push(competition);
    seriesByTeams.set(teams, pairSeries);
  }

  // Rounds in the order they started, each named as ESPN first wrote it.
  const allSeries = [...seriesByTeams.values()].flat().sort((a, b) => a.start - b.start);
  const rounds = new Map(); // "wnba finals" -> { name, series }
  for (const series of allSeries) {
    const key = series.round.toLowerCase();
    const round = rounds.get(key) || { name: series.round, series: [] };
    round.series.push(summarizeSeries(series));
    rounds.set(key, round);
  }
  return [...rounds.values()];
}

// ESPN's shorthand for MLB rounds, spelled out for readers who don't know it.
const ROUND_NAMES = {
  ALWC: "AL Wild Card Series",
  NLWC: "NL Wild Card Series",
  ALDS: "AL Division Series",
  NLDS: "NL Division Series",
  ALCS: "AL Championship Series",
  NLCS: "NL Championship Series",
};

// The name for a game ESPN gives no round name.
const GENERIC_ROUND_NAME = "Playoffs";

// "ALCS - Game 5" -> "AL Championship Series"; "World Series - Game 1" -> "World Series".
// ESPN sometimes numbers a round's series ("WNBA SEMIFINALS 2" in 2019); the
// number is dropped so they share one round. A game named just "PLAYOFFS"
// counts as unnamed.
function roundName(competition) {
  const headline = (competition.notes && competition.notes[0] && competition.notes[0].headline) || GENERIC_ROUND_NAME;
  const shortName = headline.split(" - ")[0].trim().replace(/\s+\d$/, "");
  if (/^playoffs?$/i.test(shortName)) return GENERIC_ROUND_NAME;
  return ROUND_NAMES[shortName] || shortName;
}

// One series: both teams with their wins, whether it's over, ESPN's
// one-line summary ("TB wins series 4-2"), and each game (seriesGame).
function summarizeSeries(series) {
  const latest = series.games[series.games.length - 1];
  const espnSeries = latest.series || null;
  const winsFromSeries = (competitor) => {
    const entry = espnSeries && (espnSeries.competitors || []).find((c) => c.id === competitor.id);
    return entry ? entry.wins : null;
  };
  // Without ESPN series info (single games), count wins game by game.
  const winsFromGames = (competitor) =>
    series.games.filter((game) => game.competitors.some((c) => c.id === competitor.id && c.winner === true)).length;

  const teams = latest.competitors.map((competitor) => ({
    abbreviation: competitor.team.abbreviation,
    name: competitor.team.shortDisplayName || competitor.team.displayName,
    logos: logosFrom(competitor.team),
    wins: winsFromSeries(competitor) ?? winsFromGames(competitor),
  }));
  const completed = espnSeries ? espnSeries.completed === true : latest.status.type.completed;
  const leader = teams[0].wins === teams[1].wins ? null : teams[0].wins > teams[1].wins ? teams[0] : teams[1];

  return {
    teams,
    completed,
    winner: completed ? leader : null,
    summary: (espnSeries && espnSeries.summary) || (completed && leader ? `${leader.name} win` : "Scheduled"),
    start: series.start,
    games: withoutMadeUpRainouts(series.games.map(seriesGame)),
  };
}

// ESPN keeps a postponed game next to the one that made it up (2016 ALDS
// Game 3 was rained out, then played the next day), so it's left out once
// the same game number has been played.
function withoutMadeUpRainouts(games) {
  return games.filter(
    (game) => game.completed || !/Postponed|Canceled/i.test(game.detail) || !games.some((other) => other !== game && other.number === game.number)
  );
}

// One game of a series: { number, date, away, home, completed, detail }, where
// away and home are { name, score, winner } and detail is ESPN's status
// ("Final", "Final/10" for 10 innings, "Final/OT").
function seriesGame(competition, index) {
  const headline = (competition.notes && competition.notes[0] && competition.notes[0].headline) || "";
  const gameNumber = headline.match(/Game (\d+)/i);
  const side = (homeAway) => {
    const competitor = competition.competitors.find((c) => c.homeAway === homeAway) || competition.competitors[homeAway === "away" ? 0 : 1];
    return {
      name: competitor.team.shortDisplayName || competitor.team.displayName,
      score: competitor.score === undefined || competitor.score === null ? null : String(competitor.score.displayValue ?? competitor.score),
      winner: competitor.winner === true,
    };
  };
  const statusType = (competition.status && competition.status.type) || {};
  return {
    number: gameNumber ? Number(gameNumber[1]) : index + 1,
    date: competition.date ? new Date(competition.date) : null,
    away: side("away"),
    home: side("home"),
    completed: statusType.completed === true,
    detail: statusType.shortDetail || statusType.detail || "",
  };
}

// "If the season ended today": for each conference (or the whole league),
// the teams that would make the playoffs, then the teams on the outside.
// Built on the same rules as the wild card race in standings.js.
function playoffPicture(leagueStandings) {
  const leagueKey = leagueStandings.league;
  const rules = WILD_CARD_RULES[leagueKey];
  return wildCardRaces(leagueStandings).map((race) => {
    const racers = new Set(race.teams);
    const conference = rules.wholeLeague
      ? null
      : leagueStandings.divisions.filter((division) => race.title.startsWith(`${division.conference} `));
    const automatic = conference
      ? conference
          .flatMap((division) => division.teams.map((team, index) => ({ team, divisionLeader: index === 0 && !division.isConference })))
          .filter(({ team }) => !racers.has(team))
          .sort((a, b) => bySeed(a.team, b.team))
      : [];
    const lastIn = race.teams[race.spots - 1];

    const entries = [
      ...automatic.map(({ team, divisionLeader }) => automaticEntry(rules, team, divisionLeader)),
      ...race.teams.map((team, index) =>
        index < race.spots
          ? { team, status: rules.name, label: RACE_LABELS[rules.name] }
          : { team, status: "out", label: distanceBehind(leagueKey, team, lastIn) }
      ),
    ];
    return {
      title: rules.wholeLeague ? leagueKey : race.title.replace(` ${rules.name} race`, ""),
      spotsIn: automatic.length + race.spots,
      lineLabel: rules.name === "play-in" ? "play-in line" : "playoff line",
      entries,
    };
  });
}

const RACE_LABELS = { "wild card": "Wild card", "play-in": "Play-in", playoff: "In" };

// Teams that are in without needing the race: NFL division winners, the
// NHL's top 3 in each division, and the NBA's top 6 seeds.
function automaticEntry(rules, team, divisionLeader) {
  if (rules.skipPerDivision === 1 && divisionLeader) return { team, status: "division", label: "Division leader" };
  if (rules.skipPerDivision > 1) return { team, status: "in", label: `Top ${rules.skipPerDivision} in division` };
  return { team, status: "in", label: `Top ${rules.skipSeeds} seed` };
}

// How far a team trails the last team in: points for hockey and soccer,
// games back for the others.
function distanceBehind(leagueKey, team, lastIn) {
  if (leagueInfoFor(leagueKey).rankedByPoints) {
    const points = lastIn.points - team.points;
    return points === 0 ? "Out on tiebreaker" : `${points} ${points === 1 ? "pt" : "pts"} back`;
  }
  const games = (lastIn.wins - team.wins + (team.losses - lastIn.losses)) / 2;
  return games === 0 ? "Out on tiebreaker" : `${games} ${games === 1 ? "game" : "games"} back`;
}

// Past seasons ---------------------------------------------------------------

// When each league's playoffs are played, as [first month, last month]
// (1 is January). The NFL's are in the January and February after its
// season. MLS and the NWSL are missing: ESPN doesn't mark their past
// playoff games, so they have no past brackets.
const POSTSEASON_MONTHS = {
  NFL: { months: [1, 2], yearAfter: true },
  MLB: { months: [9, 11] },
  NBA: { months: [4, 6], bySeason: { 2020: [8, 10], 2021: [5, 7] } }, // 2020 bubble, 2021 late start
  NHL: { months: [4, 6], bySeason: { 2020: [8, 9], 2021: [5, 7] } },
  WNBA: { months: [8, 10] },
};

function hasPastBracket(leagueKey) {
  return Boolean(POSTSEASON_MONTHS[leagueKey]);
}

// A past season's playoffs, in the same shape fetchPlayoffs returns.
async function fetchPastPlayoffs(leagueInfo, season) {
  const baseUrl = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/scoreboard`;
  const pages = await Promise.all(postseasonMonths(leagueInfo.key, season).map((month) => fetchJson(`${baseUrl}?dates=${month}&limit=1000`)));
  const events = pages.flatMap((page) => page.events || []).filter((event) => isPostseasonEvent(event) && !isAllStarGame(event));
  return { inPostseason: true, rounds: buildRounds(events) };
}

// ("MLB", 2016) -> ["201609", "201610", "201611"]
function postseasonMonths(leagueKey, season) {
  const timing = POSTSEASON_MONTHS[leagueKey];
  const [first, last] = (timing.bySeason && timing.bySeason[season]) || timing.months;
  const year = timing.yearAfter ? season + 1 : season;
  const months = [];
  for (let month = first; month <= last; month++) months.push(`${year}${String(month).padStart(2, "0")}`);
  return months;
}

// ESPN files the NFL's Pro Bowl (AFC vs NFC) as a postseason game.
function isAllStarGame(event) {
  const competitors = (event.competitions && event.competitions[0] && event.competitions[0].competitors) || [];
  return competitors.some((competitor) => /^(AFC|NFC)$/.test((competitor.team && competitor.team.abbreviation) || ""));
}

// How a past season ended, from ESPN's clinch marks rather than today's
// playoff rules (which have changed: MLB had 1 wild card per league until
// 2012, the NFL 6 playoff teams per conference until 2020). Same shape as
// playoffPicture. Empty when ESPN marked no clinches (past MLS and NWSL).
function pastPlayoffPicture(leagueStandings, season) {
  const teams = leagueStandings.divisions.flatMap((division) => division.teams);
  if (!teams.some((team) => team.clinch)) return [];
  const leagueKey = leagueStandings.league;
  return playoffGroups(leagueStandings, season).map(({ title, teams: groupTeams }) => {
    const madeIt = groupTeams.filter(madePlayoffs).sort(bySeed);
    const missed = groupTeams.filter((team) => !madePlayoffs(team)).sort(bySeed);
    return {
      title,
      spotsIn: madeIt.length,
      lineLabel: "playoff line",
      entries: [
        ...madeIt.map((team) => clinchEntry(leagueKey, team)),
        ...missed.map((team) => ({ team, status: "out", label: lostPlayIn(team) ? "Lost in play-in" : "Missed playoffs" })),
      ],
    };
  });
}

// The WNBA has seeded its whole league together since 2016; other leagues
// (and the WNBA before then) seed each conference.
const WHOLE_LEAGUE_PLAYOFFS_SINCE = { WNBA: 2016, NWSL: 2013 };

function playoffGroups(leagueStandings, season) {
  const since = WHOLE_LEAGUE_PLAYOFFS_SINCE[leagueStandings.league];
  const teams = leagueStandings.divisions.flatMap((division) => division.teams);
  if (since && season >= since) return [{ title: leagueStandings.league, teams }];
  const byConference = new Map();
  for (const division of leagueStandings.divisions) {
    byConference.set(division.conference, [...(byConference.get(division.conference) || []), ...division.teams]);
  }
  return [...byConference].map(([title, conferenceTeams]) => ({ title, teams: conferenceTeams }));
}

// ESPN's clinch descriptions vary by league and year. A few seen:
// "Clinched Division", "Clinched Division and Bye", "Clinched Best League
// Record", "Clinched Wild Card", "Clinched Playoff Berth", "Clinched
// Play-in Berth" (reached the NBA play-in and lost there), and "Clinched
// Playoff - Won Play-In".
function lostPlayIn(team) {
  return /Play-?in Berth/i.test(team.clinch);
}

function madePlayoffs(team) {
  return Boolean(team.clinch) && !lostPlayIn(team);
}

function wonDivision(team) {
  return /Division|Best League Record/i.test(team.clinch);
}

// Only MLB and the NFL call their non-division teams wild cards; in other
// leagues "Clinched Playoff Berth" just means the team got in.
function clinchEntry(leagueKey, team) {
  if (wonDivision(team)) return { team, status: "division", label: "Division winner" };
  if (/Won Play-?In/i.test(team.clinch)) return { team, status: "in", label: "Won play-in" };
  if ((leagueKey === "MLB" || leagueKey === "NFL") && /Wild Card|Playoff Berth/i.test(team.clinch)) {
    return { team, status: "wild card", label: "Wild card" };
  }
  return { team, status: "in", label: "Made playoffs" };
}

// Past wild card races for MLB and the NFL, where division winners are in
// and everyone else chases the wild cards: as many spots as ESPN marked.
function pastWildCardRaces(leagueStandings, season) {
  return playoffGroups(leagueStandings, season).map(({ title, teams }) => {
    const contenders = teams.filter((team) => !wonDivision(team)).sort(bySeed);
    return {
      title: `${title} wild card race`,
      lineLabel: "wild card line",
      spots: contenders.filter(madePlayoffs).length,
      teams: contenders,
    };
  });
}

// Which past seasons have a Wild Card view, and how it's built: MLB and the
// NFL from ESPN's clinch marks; the NHL (since its 2013-14 format, skipping
// the 2020 bubble and 2021's realigned divisions) and the NBA (since the
// 2020-21 play-in) with today's rules.
function pastRaceSource(leagueKey, season) {
  if (leagueKey === "MLB" || leagueKey === "NFL") return "clinches";
  if (leagueKey === "NHL" && season >= 2014 && season !== 2020 && season !== 2021) return "rules";
  if (leagueKey === "NBA" && season >= 2021) return "rules";
  return null;
}
