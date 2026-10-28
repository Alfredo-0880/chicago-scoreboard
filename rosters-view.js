// Draws the Rosters tab: tap a team name to see its players.

// Which details each team's roster shows under a player's name, as
// [label, detail] pairs. A label can depend on the player (hockey goalies
// "catch" rather than "shoot"). Soccer shows two lines that depend on the
// player, so its entry is a function returning the lines (see
// rosterDetailLines). Teams not listed show no details.
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
const HOCKEY_DETAILS = [
  ["Age", "age"],
  ["Height", "height"],
  ["Weight", "weight"],
  [(player) => (player.position === "G" ? "Catches" : "Shoots"), "hand"],
  ["Birth place", "birthPlace"],
  ["Birthdate", "birthDate"],
];
const SKY_DETAILS = [
  ["Age", "age"],
  ["Height", "height"],
  ["College", "college"],
];
const SOCCER_PLAYER_DETAILS = [
  ["Age", "age"],
  ["Height", "height"],
  ["Weight", "weight"],
  ["Nationality", "nationality"],
];
const SOCCER_SEASON_DETAILS = [
  ["Appearances", "appearances"],
  ["Substitutions", "substitutions"],
  ["Assists", "assists"],
  ["Fouls committed", "foulsCommitted"],
  ["Fouls against", "foulsAgainst"],
  ["Yellow cards", "yellowCards"],
  ["Red cards", "redCards"],
];
const FIELD_PLAYER_DETAILS = [
  ["Goals", "goals"],
  ["Total shots", "totalShots"],
  ["Shots on goal", "shotsOnGoal"],
];
const GOALKEEPER_DETAILS = [
  ["Shots saved", "shotsSaved"],
  ["Goals against", "goalsAgainst"],
];

// Line 1: the player. Line 2: this season, with goalkeeper or field player stats.
function soccerDetails(player) {
  const positionStats = player.position === "G" ? GOALKEEPER_DETAILS : FIELD_PLAYER_DETAILS;
  return [SOCCER_PLAYER_DETAILS, [...SOCCER_SEASON_DETAILS, ...positionStats]];
}

const ROSTER_DETAILS = {
  bears: CAREER_DETAILS,
  bulls: CAREER_DETAILS,
  cubs: BASEBALL_DETAILS,
  whitesox: BASEBALL_DETAILS,
  blackhawks: HOCKEY_DETAILS,
  sky: SKY_DETAILS,
  fire: soccerDetails,
  stars: soccerDetails,
};

// The lines of details a team's roster shows for a player (none for
// teams not in ROSTER_DETAILS).
function rosterDetailLines(teamKey, player) {
  const details = ROSTER_DETAILS[teamKey];
  if (!details) return [];
  return typeof details === "function" ? details(player) : [details];
}

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
                <td>${escapeHtml(player.name)}${rosterDetailLines(favorite.key, player).map((line) => playerDetailsHtml(player, line)).join("")}</td>
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
function playerDetailsHtml(player, detailList) {
  return `
    <div class="player-details">
      ${detailList
        .map(([label, key]) => {
          const text = typeof label === "function" ? label(player) : label;
          return `<span class="detail"><span class="detail-label">${text}</span> ${escapeHtml(player.details[key])}</span>`;
        })
        .join(" · ")}
    </div>`;
}
