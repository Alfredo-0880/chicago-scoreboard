// Draws the Cups tab: tournaments beside the leagues (cups.js), one at a
// time, picked with buttons like the league buttons on other tabs (Alfredo,
// 2026-11-25): the Bulls' NBA Cup group (table, then games) or the Leagues
// Cup's tables.

const CUPS = [
  { key: "nba", label: "NBA Cup" },
  { key: "leaguesCup", label: "Leagues Cup" },
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
    <div class="season-note">Cup tournaments played alongside the league seasons. The U.S. Open Cup is coming next.</div>
    ${shown === "leaguesCup" ? leaguesCupSectionHtml(state) : nbaCupSectionHtml(state)}`;
}

function nbaCupSectionHtml(nbaCupState) {
  const bulls = FAVORITE_TEAMS.find((team) => team.key === "bulls");
  const heading = `<h2 class="division-title">NBA Cup · Bulls' group</h2>`;
  if (nbaCupState.status === "loading") return `<section class="division">${heading}<div class="message">Loading the Bulls' NBA Cup group…</div></section>`;
  if (nbaCupState.status === "error") return `<section class="division">${heading}${errorMessageHtml("Couldn't load the NBA Cup group")}</section>`;
  const group = nbaCupState.value;
  if (group.notInTestSettings) {
    return `<section class="division">${heading}<div class="message">The NBA Cup group uses live data; test settings don't include it.</div></section>`;
  }
  if (group.teams.length === 0) {
    return `<section class="division">${heading}<div class="message">The Bulls have no NBA Cup group games on their schedule this season.</div></section>`;
  }
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
  const games = group.games.map(nbaCupGameHtml).join("");
  return `
    <section class="division">
      ${heading}
      <table class="standings-table picture-table">
        <thead><tr><th></th><th>Team</th><th>W-L</th><th>Pt diff</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="uniform-note">Each group winner, plus the best runner-up in each conference, reaches the knockout rounds in December. Ties here go to point differential.</p>
      <h3 class="hof-group">Group games</h3>
      <ol class="series-games">${games}</ol>
    </section>`;
}

// "Fri, Nov 14 · Hawks 117 @ Bulls 125", the winner in bold, or the date for a game not played yet.
function nbaCupGameHtml(game) {
  const when = displayDate(game.date, { weekday: "short", month: "short", day: "numeric" });
  if (!game.completed) {
    return `<li class="series-game">${escapeHtml(when)} · ${escapeHtml(game.away.name)} @ ${escapeHtml(game.home.name)}</li>`;
  }
  const homeWon = Number(game.home.score) > Number(game.away.score);
  const side = (team, won) => {
    const text = `${escapeHtml(team.name)} ${escapeHtml(team.score)}`;
    return won ? `<strong>${text}</strong>` : text;
  };
  return `<li class="series-game">${escapeHtml(when)} · ${side(game.away, !homeWon)} @ ${side(game.home, homeWon)}</li>`;
}

// The Leagues Cup's two tables, the Fire highlighted, quarterfinalists marked.
function leaguesCupSectionHtml(leaguesCupState) {
  const fire = FAVORITE_TEAMS.find((team) => team.key === "fire");
  if (leaguesCupState.status === "loading") return `<section class="division"><h2 class="division-title">Leagues Cup</h2><div class="message">Loading the Leagues Cup…</div></section>`;
  if (leaguesCupState.status === "error") return `<section class="division"><h2 class="division-title">Leagues Cup</h2>${errorMessageHtml("Couldn't load the Leagues Cup")}</section>`;
  const { season, tables, notInTestSettings } = leaguesCupState.value;
  if (notInTestSettings) return `<section class="division"><h2 class="division-title">Leagues Cup</h2><div class="message">The Leagues Cup uses live data; test settings don't include it.</div></section>`;
  if (tables.length === 0) return `<section class="division"><h2 class="division-title">Leagues Cup</h2><div class="message">ESPN has no Leagues Cup tables right now.</div></section>`;
  const tableHtml = ({ name, rows }) => `
      <h3 class="hof-group">${escapeHtml(name)} teams</h3>
      <table class="standings-table picture-table">
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
