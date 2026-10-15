// Draws the League standings tab: division tables or the wild card race for
// the selected league, with the Chicago team highlighted.

function standingsPageHtml() {
  const leagueTabs = LEAGUES.map(
    (leagueInfo) => `
      <button class="league-tab ${leagueInfo.key === state.selectedLeague ? "active" : ""}" role="tab"
              aria-selected="${leagueInfo.key === state.selectedLeague}"
              data-action="league" data-league="${leagueInfo.key}">${leagueInfo.key}</button>`
  ).join("");
  const groupLabel = state.selectedLeague === "MLS" ? "Conferences" : "Divisions";
  const raceLabel = { NBA: "Play-in", MLS: "Playoff race" }[state.selectedLeague] || "Wild card";

  return `
    <div class="controls">
      <div class="league-tabs" role="tablist" aria-label="League">${leagueTabs}</div>
      <div class="toggle" role="group" aria-label="Standings view">
        ${toggleButtonHtml("standings-view", "view", "divisions", groupLabel, state.standingsView)}
        ${toggleButtonHtml("standings-view", "view", "wildcard", raceLabel, state.standingsView)}
      </div>
    </div>
    ${standingsBodyHtml()}`;
}

function standingsBodyHtml() {
  const leagueState = loadState("standings", state.selectedLeague);
  if (leagueState.status === "loading") {
    return `<div class="message">Loading ${state.selectedLeague} standings…</div>`;
  }
  if (leagueState.status === "error") {
    return errorMessageHtml(`Couldn't load ${state.selectedLeague} standings`);
  }

  const standings = leagueState.value;
  const favorite = FAVORITE_TEAMS.find((team) => team.league === state.selectedLeague);
  const note = `<div class="season-note">${escapeHtml(standings.season.name)} ${escapeHtml(standings.season.type)} standings, live from ESPN</div>`;

  if (state.standingsView === "wildcard") {
    const races = wildCardRaces(standings).map((race) => standingsTableHtml(race.title, race.teams, favorite, race));
    return note + races.join("");
  }
  return note + standings.divisions.map((division) => standingsTableHtml(division.title, division.teams, favorite)).join("");
}

// race (optional) draws a dashed line under the last team that gets in.
function standingsTableHtml(title, teams, favorite, race) {
  const showPoints = leagueInfoFor(favorite.league).rankedByPoints;
  const rows = teams.map((team, index) => {
    const row = `
      <tr class="${team.abbreviation === favorite.abbreviation ? "favorite" : ""}">
        <td>${escapeHtml(team.name)}</td>
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
