// Draws the Cups tab: tournaments beside the leagues (cups.js), one at a
// time, picked with buttons like the league buttons on other tabs (Alfredo,
// 2026-11-25): the Bulls' NBA Cup group (table, then games), the Leagues
// Cup's tables, or the Fire's U.S. Open Cup rounds, each cup but the NBA
// Cup with its knockout bracket below.

const CUPS = [
  { key: "nba", label: "NBA Cup" },
  { key: "leaguesCup", label: "Leagues Cup" },
  { key: "openCup", label: "U.S. Open Cup" },
];

// shown: the picked cup's key. cupStates: each cup's load state by key.
function cupsPageHtml(shown, cupStates) {
  const buttons = CUPS.map(
    (cup) => `
      <button class="league-tab ${cup.key === shown ? "active" : ""}" role="tab" aria-selected="${cup.key === shown}"
              data-action="cup" data-cup="${cup.key}">${cup.label}</button>`
  ).join("");
  const state = cupStates[shown] || { status: "loading" };
  return `
    <div class="controls">
      <div class="league-tabs" role="tablist" aria-label="Cup">${buttons}</div>
    </div>
    <div class="season-note">Cup tournaments played alongside the league seasons.</div>
    ${CUP_SECTIONS[shown](state, cupStates)}`;
}

// All six NBA Cup groups' tables (Alfredo, 2026-11-26), the Bulls' group
// first with its games, then the rest in Wikipedia's order (East A to C,
// then West A to C).
function nbaCupSectionHtml(nbaCupState) {
  const bulls = FAVORITE_TEAMS.find((team) => team.key === "bulls");
  const heading = `<h2 class="division-title">NBA Cup</h2>`;
  if (nbaCupState.status === "loading") return `<section class="division">${heading}<div class="message">Loading the NBA Cup groups…</div></section>`;
  if (nbaCupState.status === "error") return `<section class="division">${heading}${errorMessageHtml("Couldn't load the NBA Cup groups")}</section>`;
  const { season, groups, notInTestSettings } = nbaCupState.value;
  if (notInTestSettings) {
    return `<section class="division">${heading}<div class="message">The NBA Cup groups use live data; test settings don't include them.</div></section>`;
  }
  if (groups.length === 0) {
    return `<section class="division">${heading}<div class="message">Wikipedia doesn't list the ${escapeHtml(season)} groups yet.</div></section>`;
  }
  const isBullsGroup = (group) => group.teams.includes(bulls.abbreviation);
  const ordered = [...groups.filter(isBullsGroup), ...groups.filter((group) => !isBullsGroup(group))];
  const groupHtml = (group) => {
    const rows = nbaCupGroupTable(group)
      .map(
        (row, index) => `
        <tr class="${row.abbreviation === bulls.abbreviation ? "favorite" : ""}">
          <td class="seed">${index + 1}</td>
          <td><span class="team-name">${logoHtml(row.logos, row.abbreviation, "logo-small")}${escapeHtml(row.name)}</span></td>
          <td>${row.wins}-${row.losses}</td>
          <td>${row.differential > 0 ? "+" : ""}${row.differential}</td>
        </tr>`
      )
      .join("");
    const games = isBullsGroup(group) ? `<h3 class="hof-group">Group games</h3><ol class="series-games">${group.games.map(nbaCupGameHtml).join("")}</ol>` : "";
    return `
      <section class="division">
        <h2 class="division-title">${escapeHtml(group.name)}${isBullsGroup(group) ? " · Bulls' group" : ""}</h2>
        <table class="standings-table picture-table cup-table">
          <thead><tr><th></th><th>Team</th><th>W-L</th><th>Pt diff</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${games}
      </section>`;
  };
  return `
    <div class="season-note">${escapeHtml(season)} group stage. Each group winner, plus the best runner-up in each conference, reaches the knockout rounds in December. Ties here go to point differential. Groups from Wikipedia, scores from ESPN.</div>
    ${ordered.map(groupHtml).join("")}`;
}

// "Fri, Nov 14 · Hawks 117 @ Bulls 125", each team with its logo (Alfredo,
// 2026-11-26), the winner in bold, or the date for a game not played yet.
function nbaCupGameHtml(game) {
  const when = displayDate(game.date, { weekday: "short", month: "short", day: "numeric" });
  const homeWon = game.completed && Number(game.home.score) > Number(game.away.score);
  const side = (team, won) => {
    const text = game.completed ? `${escapeHtml(team.name)} ${escapeHtml(team.score)}` : escapeHtml(team.name);
    return `<span class="team-name">${logoHtml(team.logos, team.abbreviation, "logo-small")}${won ? `<strong>${text}</strong>` : text}</span>`;
  };
  return `<li class="series-game">${escapeHtml(when)} · ${side(game.away, game.completed && !homeWon)} @ ${side(game.home, homeWon)}</li>`;
}

// The Leagues Cup's two tables, the Fire highlighted, quarterfinalists
// marked, then the knockout bracket below them (Alfredo, 2026-11-26).
function leaguesCupSectionHtml(leaguesCupState, cupStates = {}) {
  return leaguesCupTablesHtml(leaguesCupState) + leaguesCupFireGamesHtml(cupStates.leaguesCupFire) + cupBracketHtml("Leagues Cup", "Leagues Cup knockout rounds", cupStates.leaguesCupBracket);
}

// A cup's knockout bracket (cups.js), drawn like the Playoff Picture's
// brackets, the Fire highlighted. cupName: "Leagues Cup". what: the
// rounds it shows, for the line above them.
function cupBracketHtml(cupName, what, bracketState = { status: "loading" }) {
  const heading = `<h2 class="division-title">${escapeHtml(cupName)} bracket</h2>`;
  if (bracketState.status === "loading") return `<section class="division">${heading}<div class="message">Loading the ${escapeHtml(cupName)} bracket…</div></section>`;
  if (bracketState.status === "error") return `<section class="division">${heading}${errorMessageHtml(`Couldn't load the ${cupName} bracket`)}</section>`;
  const rounds = bracketState.value;
  if (rounds.notInTestSettings) return "";
  if (rounds.length === 0) return `<section class="division">${heading}<div class="message">The knockout rounds haven't started yet.</div></section>`;
  return bracketHtml("MLS", rounds, { note: `${what}, from ESPN. Each number is the team's goals; rounds go from first to latest.` });
}

function leaguesCupTablesHtml(leaguesCupState) {
  const fire = FAVORITE_TEAMS.find((team) => team.key === "fire");
  if (leaguesCupState.status === "loading") return `<section class="division"><h2 class="division-title">Leagues Cup</h2><div class="message">Loading the Leagues Cup…</div></section>`;
  if (leaguesCupState.status === "error") return `<section class="division"><h2 class="division-title">Leagues Cup</h2>${errorMessageHtml("Couldn't load the Leagues Cup")}</section>`;
  const { season, tables, notInTestSettings } = leaguesCupState.value;
  if (notInTestSettings) return `<section class="division"><h2 class="division-title">Leagues Cup</h2><div class="message">The Leagues Cup uses live data; test settings don't include it.</div></section>`;
  if (tables.length === 0) return `<section class="division"><h2 class="division-title">Leagues Cup</h2><div class="message">ESPN has no Leagues Cup tables right now.</div></section>`;
  const tableHtml = ({ name, rows }) => `
      <h3 class="hof-group">${escapeHtml(name)} teams</h3>
      <table class="standings-table picture-table cup-table">
        <thead><tr><th></th><th>Team</th><th>W-D-L</th><th>GD</th><th>Pts</th><th></th></tr></thead>
        <tbody>${rows
          .map(
            (row) => `
          <tr class="${row.abbreviation === fire.abbreviation && name === "MLS" ? "favorite" : ""} ${row.advanced ? "" : "outside"}">
            <td class="seed">${row.rank}</td>
            <td><span class="team-name">${logoHtml(row.logos, row.abbreviation, "logo-small")}${escapeHtml(row.name)}</span></td>
            <td>${row.wins}-${row.draws}-${row.losses}</td>
            <td>${row.goalDifference > 0 ? "+" : ""}${row.goalDifference}</td>
            <td>${row.points}</td>
            <td>${row.advanced ? `<span class="picture-status in">Quarterfinals</span>` : ""}</td>
          </tr>`
          )
          .join("")}</tbody>
      </table>`;
  return `
    <section class="division">
      <h2 class="division-title">${escapeHtml(season)}</h2>
      ${tables.map(tableHtml).join("")}
      <p class="uniform-note">MLS and Liga MX teams play each other; each league's top four reach the quarterfinals. A draw goes to penalties: 2 points for the winner, 1 for the loser. From ESPN.</p>
    </section>`;
}

// The Fire's U.S. Open Cup games, a round per line: "Round of 32 · Tue,
// Apr 14 · Fire 2 @ Detroit 1", each team with its logo (Alfredo,
// 2026-11-26), the winner in bold, then whether they went out.
function openCupSectionHtml(openCupState, cupStates = {}) {
  return openCupRunHtml(openCupState) + cupBracketHtml("U.S. Open Cup", "U.S. Open Cup from the Round of 32", cupStates.openCupBracket);
}

function openCupRunHtml(openCupState) {
  const heading = (text) => `<h2 class="division-title">${escapeHtml(text)}</h2>`;
  if (openCupState.status === "loading") return `<section class="division">${heading("U.S. Open Cup")}<div class="message">Loading the Fire's U.S. Open Cup games…</div></section>`;
  if (openCupState.status === "error") return `<section class="division">${heading("U.S. Open Cup")}${errorMessageHtml("Couldn't load the U.S. Open Cup")}</section>`;
  const { season, games, notInTestSettings } = openCupState.value;
  if (notInTestSettings) return `<section class="division">${heading("U.S. Open Cup")}<div class="message">The U.S. Open Cup uses live data; test settings don't include it.</div></section>`;
  if (games.length === 0) return `<section class="division">${heading(season || "U.S. Open Cup")}<div class="message">The Fire have no U.S. Open Cup games this season.</div></section>`;
  const rows = games.map((game) => fireCupGameHtml(game, true)).join("");
  const last = games[games.length - 1];
  const fireLost = last.completed && ![last.home, last.away].some((team) => team.abbreviation === FAVORITE_TEAMS.find((t) => t.key === "fire").abbreviation && team.won);
  return `
    <section class="division">
      ${heading(season)}
      <h3 class="hof-group">The Fire's games</h3>
      <ol class="series-games">${rows}</ol>
      <p class="uniform-note">${fireLost ? `The Fire went out in the ${escapeHtml(last.round)}. ` : ""}A knockout tournament for American clubs of every level; penalties in parentheses. From ESPN.</p>
    </section>`;
}

// The Fire's Leagues Cup group games (Alfredo, 2026-11-26), between the
// tables and the bracket; their knockout games are in the bracket.
function leaguesCupFireGamesHtml(fireState = { status: "loading" }) {
  const heading = `<h3 class="hof-group">The Fire's group games</h3>`;
  if (fireState.status === "loading") return `<section class="division">${heading}<div class="message">Loading the Fire's Leagues Cup games…</div></section>`;
  if (fireState.status === "error") return `<section class="division">${heading}${errorMessageHtml("Couldn't load the Fire's Leagues Cup games")}</section>`;
  if (fireState.value.notInTestSettings) return "";
  const groupGames = fireState.value.games.filter((game) => /league phase|group/i.test(game.round));
  if (groupGames.length === 0) return `<section class="division">${heading}<div class="message">The Fire have no Leagues Cup group games this season.</div></section>`;
  return `
    <section class="division">
      ${heading}
      <ol class="series-games">${groupGames.map((game) => fireCupGameHtml(game, false)).join("")}</ol>
    </section>`;
}

// One of the Fire's cup games: "Tue, Apr 14 · Fire 2 @ Detroit 1", each
// team with its logo, the winner in bold, penalties in parentheses, and
// its round first when showRound (a knockout cup's games each differ).
function fireCupGameHtml(game, showRound) {
  const sideHtml = (team) => {
    const text = game.completed ? `${escapeHtml(team.name)} ${escapeHtml(team.score)}${team.shootout === null ? "" : ` (${team.shootout})`}` : escapeHtml(team.name);
    return `<span class="team-name">${logoHtml(team.logos, team.abbreviation, "logo-small")}${team.won ? `<strong>${text}</strong>` : text}</span>`;
  };
  const when = displayDate(game.date, { weekday: "short", month: "short", day: "numeric" });
  const round = showRound ? `<span class="picture-status in">${escapeHtml(game.round)}</span> ` : "";
  return `<li class="series-game">${round}${escapeHtml(when)} · ${sideHtml(game.away)} @ ${sideHtml(game.home)}</li>`;
}

const CUP_SECTIONS = { nba: nbaCupSectionHtml, leaguesCup: leaguesCupSectionHtml, openCup: openCupSectionHtml };
