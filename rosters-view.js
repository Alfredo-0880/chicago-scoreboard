// Draws the Rosters tab: tap a team name to see its players.

// Teams whose roster also shows each player's age, height, weight,
// experience, college, and salary.
const DETAILED_ROSTER_TEAMS = ["bears"];

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
  const showDetails = DETAILED_ROSTER_TEAMS.includes(favorite.key);
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
                <td>${escapeHtml(player.name)}${showDetails ? playerDetailsHtml(player.details) : ""}</td>
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

// "24 · 6' 1" · 226 lbs · 3 yrs · USC · $4.4M", each labeled for screen readers.
function playerDetailsHtml(details) {
  const items = [
    ["Age", details.age],
    ["Height", details.height],
    ["Weight", details.weight],
    ["Experience", details.experience],
    ["College", details.college],
    ["Salary", details.salary],
  ];
  return `
    <div class="player-details">
      ${items.map(([label, value]) => `<span title="${label}" aria-label="${label}: ${escapeHtml(value)}">${escapeHtml(value)}</span>`).join(" · ")}
    </div>`;
}
