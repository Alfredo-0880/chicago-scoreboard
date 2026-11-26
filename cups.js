// Cup tournaments beside the leagues, for the Cups tab (Alfredo,
// 2026-11-25): the NBA Cup's group stage, all six groups with the Bulls'
// first, the Leagues Cup's tables (MLS and Liga MX teams), and the Fire's
// U.S. Open Cup games, round by round, each soccer cup with its bracket.
//
// ESPN has no NBA Cup groups or group tables, but it labels each group game
// "NBA Cup - Group Play". So the groups (their names and teams) and the
// nights they play come from Wikipedia's "<year> NBA Cup" article (Alfredo:
// use Wikipedia when ESPN doesn't have it), and the scores from ESPN's
// scoreboards for those nights (about a dozen, 120 KB each).

const NBA_CUP_GROUP_NOTE = /NBA Cup - Group/i;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// A Cup game from an ESPN event, or null if it isn't one:
// { id, date, completed, home: { abbreviation, name, logos, score }, away: {...} }.
function nbaCupGame(event) {
  const competition = event.competitions && event.competitions[0];
  if (!competition || !(competition.notes || []).some((note) => NBA_CUP_GROUP_NOTE.test(note.headline || ""))) return null;
  const side = (homeAway) => {
    const competitor = competition.competitors.find((each) => each.homeAway === homeAway);
    return {
      abbreviation: competitor.team.abbreviation,
      name: competitor.team.shortDisplayName || competitor.team.displayName,
      logos: logosFrom(competitor.team),
      score: scoreOf(competitor),
    };
  };
  return { id: event.id, date: new Date(event.date), completed: competition.status.type.completed === true, home: side("home"), away: side("away") };
}

// The NBA Cup is played in October to December, so from July on it's this
// year's, and before then last year's.
function nbaCupYear(now) {
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
}

async function fetchNbaCupGroups(year) {
  const article = `${year} NBA Cup`;
  const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(article)}&prop=wikitext&format=json&formatversion=2&origin=*`);
  if (!response.ok) throw new Error(`Wikipedia returned ${response.status} for ${article}`);
  const answer = await response.json();
  const { groups, dates } = parseNbaCupGroups(answer.parse ? answer.parse.wikitext : "", year);
  const scoreboards = await Promise.all(dates.map((date) => fetchJson(`${ESPN_SITE_API}/site/v2/sports/basketball/nba/scoreboard?dates=${date}`)));
  const games = [...new Map(scoreboards.flatMap((board) => board.events || []).map(nbaCupGame).filter(Boolean).map((game) => [game.id, game])).values()];
  return { season: article, groups: nbaCupGroupsWithGames(groups, games) };
}

// Wikipedia's group stage -> { groups: [{ name: "East Group A", teamNames:
// ["Orlando Magic", ...] }], dates: ["20261030", ...] }: each group's table
// (a "Sports table" with section=, team_order=, and name_XXX=), and the
// date of each group game ("|date=October 30"), as ESPN writes dates.
function parseNbaCupGroups(wikitext, year) {
  const groupStage = (wikitext.split(/\n==\s*Group stage\s*==/i)[1] || "").split(/\n==[^=]/)[0];
  const groups = groupStage
    .split("{{#invoke:Sports table")
    .slice(1)
    .map((table) => {
      const value = (name) => ((table.match(new RegExp(`\\|\\s*${name}\\s*=([^|\\n]*)`)) || [])[1] || "").trim();
      // "[[2026–27 Detroit Pistons season|Detroit Pistons]]" -> "Detroit Pistons".
      const fullName = (code) => {
        const link = table.match(new RegExp(`\\|\\s*name_${code}\\s*=\\s*\\[\\[([^\\]]*)\\]\\]`));
        return link ? link[1].split("|").pop().trim() : value(`name_${code}`);
      };
      const codes = value("team_order").split(",").map((code) => code.trim()).filter(Boolean);
      return { name: value("section"), teamNames: codes.map(fullName).filter(Boolean) };
    })
    .filter((group) => group.name && group.teamNames.length > 0);
  const dates = [...new Set([...groupStage.matchAll(/\|\s*date\s*=\s*([A-Z][a-z]+) (\d{1,2})\b/g)]
    .filter(([, month]) => MONTHS.includes(month))
    .map(([, month, day]) => `${year}${String(MONTHS.indexOf(month) + 1).padStart(2, "0")}${day.padStart(2, "0")}`))].sort();
  return { groups, dates };
}

// Each group with its teams' ESPN abbreviations and its games. Wikipedia
// names teams in full ("Chicago Bulls") and ESPN by nickname ("Bulls"), so
// a team is the ESPN team whose nickname ends its name. A team with no
// games yet keeps its Wikipedia name.
function nbaCupGroupsWithGames(groups, games) {
  const espnTeams = new Map(games.flatMap((game) => [game.home, game.away]).map((team) => [team.abbreviation, team]));
  const abbreviationFor = (fullName) => {
    const team = [...espnTeams.values()].find((each) => fullName.toLowerCase().endsWith(` ${each.name.toLowerCase()}`));
    return team ? team.abbreviation : fullName;
  };
  return groups.map((group) => {
    const teams = group.teamNames.map(abbreviationFor);
    const groupGames = games.filter((game) => teams.includes(game.home.abbreviation) && teams.includes(game.away.abbreviation)).sort((a, b) => a.date - b.date);
    return { name: group.name, teams, games: groupGames };
  });
}

// The group table: each team's wins, losses, and point differential, best
// first. Ties are broken by point differential, then points scored (the
// NBA's head-to-head step isn't modeled).
function nbaCupGroupTable({ teams, games }) {
  const rows = new Map(teams.map((abbreviation) => [abbreviation, { abbreviation, name: abbreviation, logos: null, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 }]));
  for (const game of games) {
    for (const [us, them] of [[game.home, game.away], [game.away, game.home]]) {
      const row = rows.get(us.abbreviation);
      row.name = us.name;
      row.logos = row.logos || us.logos;
      if (!game.completed || us.score === null || them.score === null) continue;
      const [ours, theirs] = [Number(us.score), Number(them.score)];
      row.pointsFor += ours;
      row.pointsAgainst += theirs;
      if (ours > theirs) row.wins++;
      else row.losses++;
    }
  }
  return [...rows.values()]
    .map((row) => ({ ...row, differential: row.pointsFor - row.pointsAgainst }))
    .sort((a, b) => b.wins - a.wins || b.differential - a.differential || b.pointsFor - a.pointsFor);
}

// The Leagues Cup: MLS and Liga MX teams, each league's teams ranked in one
// table, the best four of each reaching the quarterfinals. ESPN has these
// tables. A draw goes to a penalty shootout: 2 points for the winner, 1 for
// the loser.
async function fetchLeaguesCupStandings() {
  return parseLeaguesCupStandings(await fetchJson(`${ESPN_SITE_API}/v2/sports/soccer/concacaf.leagues.cup/standings`));
}

// ESPN's answer -> { season: "2026 Leagues Cup", tables: [{ name: "MLS",
// rows: [{ abbreviation, name, logos, played, wins, draws, losses,
// goalDifference, points, advanced }] }] }, rows in ESPN's rank order.
function parseLeaguesCupStandings(data) {
  const tables = (data.children || []).map((group) => {
    const rows = ((group.standings && group.standings.entries) || []).map((entry) => {
      const stats = Object.fromEntries((entry.stats || []).map((stat) => [stat.name, stat]));
      const value = (name) => (stats[name] ? Number(stats[name].value) : 0);
      return {
        abbreviation: entry.team.abbreviation,
        name: entry.team.shortDisplayName || entry.team.displayName,
        logos: logosFrom(entry.team),
        rank: value("rank") || 99,
        played: value("gamesPlayed"),
        wins: value("wins"),
        draws: value("ties"),
        losses: value("losses"),
        goalDifference: value("pointDifferential"),
        points: value("points"),
        advanced: Boolean(entry.note && /qualif/i.test(entry.note.description || "")),
      };
    });
    return { name: group.name, rows: rows.sort((a, b) => a.rank - b.rank) };
  });
  return { season: (data.season && data.season.displayName) || "Leagues Cup", tables };
}

// The Fire's games in a cup this season, from their schedule for it on
// ESPN, which names each game's round ("Round of 32", "League Phase"): all
// of them for the U.S. Open Cup, which is knockout only, and the group
// games for the Leagues Cup (Alfredo, 2026-11-26). slug: ESPN's name for
// the cup ("usa.open").
async function fetchFireCupGames(slug, fire) {
  return parseFireCupGames(await fetchJson(`${ESPN_SITE_API}/site/v2/sports/soccer/${slug}/teams/${fire.espnTeamId}/schedule`), fire);
}

// ESPN's answer -> { season: "2026 U.S. Open Cup", games: [{ round, date,
// completed, home, away }] }, earliest first. Each side: { abbreviation,
// name, logos, score, shootout (penalties, or null), won }.
function parseFireCupGames(data, fire) {
  const side = (competitor) => {
    const score = competitor.score && typeof competitor.score === "object" ? competitor.score : { displayValue: competitor.score };
    const shootout = competitor.shootoutScore ?? score.shootoutScore ?? null;
    return {
      abbreviation: competitor.team.abbreviation,
      name: competitor.team.id === fire.espnTeamId ? fire.label : competitor.team.shortDisplayName || competitor.team.displayName,
      logos: logosFrom(competitor.team),
      score: score.displayValue ?? "",
      shootout: shootout === null ? null : Number(shootout),
      won: competitor.winner === true,
    };
  };
  const games = (data.events || [])
    .map((event) => {
      const competition = event.competitions[0];
      const home = competition.competitors.find((team) => team.homeAway === "home");
      const away = competition.competitors.find((team) => team.homeAway === "away");
      return {
        round: (event.seasonType && event.seasonType.name) || "",
        date: new Date(event.date),
        completed: Boolean(competition.status && competition.status.type && competition.status.type.completed),
        home: side(home),
        away: side(away),
      };
    })
    .sort((a, b) => a.date - b.date);
  return { season: (data.season && data.season.displayName) || "", games };
}

// The cups' knockout brackets (Alfredo, 2026-11-26), from ESPN's
// scoreboard for each cup. The scoreboard lists the cup's rounds with their
// dates (its calendar), but only answers for a day or a month, so a bracket
// loads each month from its first round on (about 700 KB for a busy month,
// little for an empty one) and keeps those rounds' games. Each game's round
// is in its note ("U.S. Open Cup, Round of 16"), which is used for the name,
// since the calendar shortens some ("Rd of 16").
const CUP_BRACKETS = {
  leaguesCup: { slug: "concacaf.leagues.cup", firstRound: "Quarterfinals" },
  // Its first two rounds are mostly amateur and lower-division clubs.
  openCup: { slug: "usa.open", firstRound: "Round of 32" },
};

async function fetchCupBracket({ slug, firstRound }) {
  const scoreboard = `${ESPN_SITE_API}/site/v2/sports/soccer/${slug}/scoreboard`;
  const months = cupBracketMonths(await fetchJson(scoreboard), firstRound);
  const answers = await Promise.all(months.map((month) => fetchJson(`${scoreboard}?dates=${month}`)));
  return cupBracketRounds(answers.flatMap((answer) => answer.events || []), firstRound);
}

// The months, as ESPN writes them ("202608"), from the first round's start
// to the last round's end.
function cupBracketMonths(scoreboard, firstRound) {
  const calendar = (scoreboard.leagues && scoreboard.leagues[0] && scoreboard.leagues[0].calendar) || [];
  const entries = calendar.flatMap((part) => part.entries || []);
  const first = entries.findIndex((entry) => entry.label.toLowerCase() === firstRound.toLowerCase());
  if (first === -1) return [];
  const month = (date) => date.getUTCFullYear() * 12 + date.getUTCMonth();
  const from = month(new Date(entries[first].startDate));
  // The end is the last moment's month: an end of "2027-01-01T00:00Z" means December.
  const to = month(new Date(new Date(entries[entries.length - 1].endDate).getTime() - 1));
  const months = [];
  for (let each = from; each <= to; each++) months.push(`${Math.floor(each / 12)}${String((each % 12) + 1).padStart(2, "0")}`);
  return months;
}

// Rounds in bracketHtml's shape (playoffs-view.js), from firstRound on,
// in the order they were played: each knockout game is a one-game series.
// Each team's number is its goals, and a shootout is told in the summary
// ("Monterrey win 5-4 on penalties").
function cupBracketRounds(events, firstRound) {
  const roundOf = (event) => (event.competitions[0].altGameNote || "").split(", ").pop();
  const games = [...new Map(events.map((event) => [event.id, event])).values()].sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstGame = games.find((event) => roundOf(event).toLowerCase() === firstRound.toLowerCase());
  if (!firstGame) return [];
  const knockout = games.filter((event) => new Date(event.date) >= new Date(firstGame.date));
  const names = [...new Set(knockout.map(roundOf))];
  return names.map((name) => ({ name, series: knockout.filter((event) => roundOf(event) === name).map(cupKnockoutSeries) }));
}

function cupKnockoutSeries(event) {
  const competition = event.competitions[0];
  const completed = Boolean(competition.status && competition.status.type && competition.status.type.completed);
  // Away team first, like the other brackets' "away @ home".
  const ordered = ["away", "home"].map((side) => competition.competitors.find((competitor) => competitor.homeAway === side));
  const teams = ordered.map((competitor) => ({
    name: competitor.team.shortDisplayName || competitor.team.displayName,
    abbreviation: competitor.team.abbreviation,
    logos: logosFrom(competitor.team),
    wins: completed ? Number(competitor.score) : "",
  }));
  const winnerIndex = completed ? ordered.findIndex((competitor) => competitor.winner === true) : -1;
  const winner = winnerIndex === -1 ? null : teams[winnerIndex];
  const note = (competition.notes || []).map((each) => each.headline || each.text).find(Boolean);
  const loser = winner && teams.find((team) => team !== winner);
  const summary = !completed
    ? displayDate(new Date(event.date), { weekday: "short", month: "short", day: "numeric" })
    : note || (winner ? `${winner.name} win ${winner.wins}–${loser.wins}` : `${teams[0].wins}–${teams[1].wins}`);
  return { teams, completed, winner, summary, start: new Date(event.date), games: [] };
}
