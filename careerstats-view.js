// Draws the Stats tab: tap a team, then a player, to see their career stats.

function careerStatsPageHtml() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  return `
    ${teamFilterHtml()}
    ${favorite ? careerStatsTeamHtml(favorite) : `<div class="message">Tap a team name, then a player, to see their career stats.</div>`}`;
}

// The team's roster, each player a button that opens their stats.
function careerStatsTeamHtml(favorite) {
  const rosterState = loadState("rosters", favorite.key);
  if (rosterState.status === "loading") {
    return `<div class="message">Loading the ${favorite.label} players…</div>`;
  }
  if (rosterState.status === "error") {
    return errorMessageHtml(`Couldn't load the ${favorite.label} players`);
  }
  const { groups } = rosterState.value;
  if (groups.length === 0) {
    return `<div class="message">ESPN hasn't listed a ${favorite.label} roster.</div>`;
  }
  const note =
    leagueInfoFor(favorite.league).sport === "soccer"
      ? `Tap a player to see their career ${favorite.league} stats, from ESPN. ESPN counts only ${favorite.league} games and doesn't list assists.`
      : "Tap a player to see their career stats, from ESPN.";
  const groupsHtml = groups
    .map(
      (group) => `
      <section class="division">
        <h2 class="division-title">${escapeHtml(group.name)}</h2>
        <div class="stats-players">
          ${group.players.map((player) => careerStatsPlayerHtml(favorite, player)).join("")}
        </div>
      </section>`
    )
    .join("");
  return `<div class="season-note">${note}</div>${groupsHtml}`;
}

// Player ids are only unique within a league, so stats are kept per team.
function careerStatsKey(favorite, player) {
  return `${favorite.key}-${player.id}`;
}

function careerStatsPlayerHtml(favorite, player) {
  const key = careerStatsKey(favorite, player);
  const isOpen = state.statsPlayer === key;
  return `
    <div class="stats-player ${isOpen ? "open" : ""}" style="--team-color:${favorite.color}">
      <button class="stats-player-button" data-action="player-stats" data-player="${escapeHtml(key)}" aria-expanded="${isOpen}">
        <span class="jersey">${escapeHtml(player.jersey)}</span>
        <span class="stats-player-name">${escapeHtml(player.name)}</span>
        <span class="stats-player-position" title="${escapeHtml(player.positionName)}">${escapeHtml(player.position)}</span>
        <span class="stats-chevron" aria-hidden="true">${isOpen ? "▾" : "▸"}</span>
      </button>
      ${isOpen ? careerStatsPanelHtml(player, loadState("careerStats", key)) : ""}
    </div>`;
}

function careerStatsPanelHtml(player, statsState) {
  if (statsState.status === "loading") {
    return `<div class="stats-panel"><div class="stats-message">Loading ${escapeHtml(player.name)}'s career stats…</div></div>`;
  }
  if (statsState.status === "error") {
    return `<div class="stats-panel"><div class="stats-message">Couldn't load ${escapeHtml(player.name)}'s stats. Tap Refresh and try again.</div></div>`;
  }
  const { games, sections } = statsState.value;
  if (sections.length === 0) {
    return `<div class="stats-panel"><div class="stats-message">ESPN has no career stats for ${escapeHtml(player.name)} yet.</div></div>`;
  }
  const gamesHtml = games
    ? `<div class="stats-games"><span class="detail-label">${escapeHtml(games.label)}</span> ${escapeHtml(games.value)}</div>`
    : "";
  const sectionsHtml = sections
    .map(
      (section) => `
      <div class="stats-section">
        <h3 class="stats-section-title">${escapeHtml(section.title)}</h3>
        <div class="stats-grid">
          ${section.stats
            .map(
              (stat) => `
            <div class="stat">
              <div class="stat-value">${escapeHtml(stat.value)}</div>
              <div class="stat-label">${escapeHtml(stat.label)}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");
  return `<div class="stats-panel">${gamesHtml}${sectionsHtml}</div>`;
}
