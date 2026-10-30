// Draws the League Standings tab: the selected league's division tables,
// with the Chicago teams highlighted. The wild card race is on the Playoff
// Picture tab (playoffs-view.js).

// One button per league; shared with the Playoff Picture tab.
function leagueTabsHtml() {
  return LEAGUES.map(
    (leagueInfo) => `
      <button class="league-tab ${leagueInfo.key === state.selectedLeague ? "active" : ""}" role="tab"
              aria-selected="${leagueInfo.key === state.selectedLeague}"
              data-action="league" data-league="${leagueInfo.key}">${leagueInfo.key}</button>`
  ).join("");
}

function standingsPageHtml() {
  return `
    <div class="controls">
      <div class="league-tabs" role="tablist" aria-label="League">${leagueTabsHtml()}</div>
    </div>
    ${standingsBodyHtml(state.selectedLeague, loadState("standings", state.selectedLeague))}`;
}

function standingsBodyHtml(leagueKey, leagueState) {
  if (leagueState.status === "loading") {
    return `<div class="message">Loading ${leagueKey} standings…</div>`;
  }
  if (leagueState.status === "error") {
    return errorMessageHtml(`Couldn't load ${leagueKey} standings`);
  }

  const standings = leagueState.value;
  const note = `<div class="season-note">${escapeHtml(standings.season.name)} ${escapeHtml(standings.season.type)} standings, live from ESPN</div>`;
  return note + standings.divisions.map((division) => standingsTableHtml(division.title, division.teams, standings.league)).join("");
}

// race (optional) draws a dashed line under the last team that gets in.
function standingsTableHtml(title, teams, leagueKey, race) {
  const showPoints = leagueInfoFor(leagueKey).rankedByPoints;
  const chicagoTeams = favoriteAbbreviations(leagueKey);
  const rows = teams.map((team, index) => {
    const row = `
      <tr class="${chicagoTeams.includes(team.abbreviation) ? "favorite" : ""}">
        <td><span class="team-name">${logoHtml(team.logos, team.abbreviation, "logo-small")}${escapeHtml(team.name)}</span></td>
        <td>${escapeHtml(team.record)}</td>
        ${showPoints ? `<td>${team.points}</td>` : ""}
      </tr>`;
    const lineAfter = race && index === race.spots - 1 && index < teams.length - 1;
    const line = lineAfter
      ? `<tr class="cutoff"><td colspan="${showPoints ? 3 : 2}"><span>${escapeHtml(race.lineLabel)}</span></td></tr>`
      : "";
    return row + line;
  });

  return `
    <section class="division">
      <h2 class="division-title">${escapeHtml(title)}</h2>
      <table class="standings-table">
        <thead><tr><th>Team</th><th>Record</th>${showPoints ? "<th>Pts</th>" : ""}</tr></thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    </section>`;
}
