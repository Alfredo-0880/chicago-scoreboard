// Draws the League Standings tab: the selected league's division tables,
// this season or a past one, with the Chicago teams highlighted. The wild
// card race is on the Playoff Picture tab (playoffs-view.js).

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
  const leagueKey = state.selectedLeague;
  const season = standingsSeasonFor(leagueKey);
  const options = [
    `<option value="">Current season</option>`,
    ...pastStandingsSeasons(leagueKey, new Date()).map(
      (year) => `<option value="${year}" ${year === season ? "selected" : ""}>${seasonLabel({ league: leagueKey }, year)}</option>`
    ),
  ].join("");
  const leagueState = season ? loadState("pastStandings", pastStandingsKey(leagueKey, season)) : loadState("standings", leagueKey);
  return `
    <div class="controls">
      <div class="league-tabs" role="tablist" aria-label="League">${leagueTabsHtml()}</div>
      <label class="season-picker">Season
        <select data-action="standings-season" aria-label="Season">${options}</select>
      </label>
    </div>
    ${standingsBodyHtml(leagueKey, leagueState)}`;
}

// The past season picked for this league, or null for the current season
// (also when the pick doesn't exist in this league, like the NHL in 2005).
function standingsSeasonFor(leagueKey) {
  return pastStandingsSeasons(leagueKey, new Date()).includes(state.standingsSeason) ? state.standingsSeason : null;
}

function pastStandingsKey(leagueKey, season) {
  return `${leagueKey}-${season}`;
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
