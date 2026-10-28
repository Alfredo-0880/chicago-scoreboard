// Draws the Rosters tab: tap a team name to see its players.

// Which details each team's roster shows under a player's name, as
// [label, detail] pairs. Teams not listed show no details.
const CAREER_DETAILS = [
  ["Age", "age"],
  ["Height", "height"],
  ["Weight", "weight"],
  ["Experience", "experience"],
  ["College", "college"],
  ["Salary", "salary"],
];
const BASEBALL_DETAILS = [
  ["Bats", "bats"],
  ["Throws", "throws"],
  ["Age", "age"],
  ["Height", "height"],
  ["Weight", "weight"],
  ["Birth place", "birthPlace"],
];
const ROSTER_DETAILS = {
  bears: CAREER_DETAILS,
  bulls: CAREER_DETAILS,
  cubs: BASEBALL_DETAILS,
  whitesox: BASEBALL_DETAILS,
};

function rostersPageHtml() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  return `
    ${teamFilterHtml()}
    ${favorite ? rosterHtml(favorite) : `<div class="message">Tap a team name to see its roster.</div>`}`;
}

function rosterHtml(favorite) {
  const rosterState = loadState("rosters", favorite.key);
  if (rosterState.status === "loading") {
    return `<div class="message">Loading the ${favorite.label} roster…</div>`;
  }
  if (rosterState.status === "error") {
    return errorMessageHtml(`Couldn't load the ${favorite.label} roster`);
  }
  if (rosterState.value.length === 0) {
    return `<div class="message">ESPN hasn't listed a ${favorite.label} roster.</div>`;
  }

  const playerCount = rosterState.value.reduce((count, group) => count + group.players.length, 0);
  const detailList = ROSTER_DETAILS[favorite.key];
  const groups = rosterState.value
    .map(
      (group) => `
      <section class="division">
        <h2 class="division-title">${escapeHtml(group.name)}</h2>
        <table class="standings-table roster-table">
          <thead><tr><th>#</th><th>Player</th><th>Position</th></tr></thead>
          <tbody>
            ${group.players
              .map(
                (player) => `
              <tr>
                <td class="jersey">${escapeHtml(player.jersey)}</td>
                <td>${escapeHtml(player.name)}${detailList ? playerDetailsHtml(player.details, detailList) : ""}</td>
                <td title="${escapeHtml(player.positionName)}">${escapeHtml(player.position)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </section>`
    )
    .join("");
  return `<div class="season-note">${favorite.label} roster: ${playerCount} players, live from ESPN.</div>${groups}`;
}

// "Age 24 · Height 6' 1" · Weight 226 lbs · ...", each value with its label.
function playerDetailsHtml(details, detailList) {
  return `
    <div class="player-details">
      ${detailList
        .map(([label, key]) => `<span class="detail"><span class="detail-label">${label}</span> ${escapeHtml(details[key])}</span>`)
        .join(" · ")}
    </div>`;
}
