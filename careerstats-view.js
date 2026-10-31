// Draws the Stats tab: tap a team, then a player, to see their stats for
// this season, each past season, or their whole career. A Season picker
// lists a past season's players instead (from its box scores, since ESPN
// keeps no past rosters), whose first stats button is that season.

function careerStatsPageHtml() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  if (!favorite) {
    return `
      ${teamFilterHtml()}
      <div class="message">Tap a team name, then a player, to see their career stats.</div>`;
  }
  const season = statsSeasonFor(favorite);
  const options = [
    `<option value="">Current season</option>`,
    ...pastSeasons(favorite, new Date()).map(
      (year) => `<option value="${year}" ${year === season ? "selected" : ""}>${seasonLabel(favorite, year)}</option>`
    ),
  ].join("");
  return `
    ${teamFilterHtml()}
    <div class="controls">
      <label class="season-picker">Season
        <select data-action="stats-season" aria-label="Season">${options}</select>
      </label>
    </div>
    ${season ? pastSeasonPlayersHtml(favorite, season) : careerStatsTeamHtml(favorite)}`;
}

// The past season picked on Stats (Team History's seasons), or null for now.
function statsSeasonFor(favorite) {
  return pastSeasons(favorite, new Date()).includes(state.statsSeason) ? state.statsSeason : null;
}

// Everyone who played in a past season, each opening their stats.
function pastSeasonPlayersHtml(favorite, season) {
  const label = seasonLabel(favorite, season);
  const playersState = loadState("seasonPlayers", historyKey(favorite, season));
  if (playersState.status === "loading") {
    return `<div class="message">Loading everyone who played for the ${label} ${favorite.label}, from that season's box scores…</div>`;
  }
  if (playersState.status === "error") {
    return errorMessageHtml(`Couldn't load the ${label} ${favorite.label} players`);
  }
  if (playersState.value.length === 0) {
    return `<div class="message">ESPN's box scores don't list the ${label} ${favorite.label} players.</div>`;
  }
  return `
    <div class="season-note">${playersState.value.length} players appeared in a ${label} game. Tap one to see their ${label} stats, every season, and their career, from ESPN.</div>
    <div class="stats-players">
      ${playersState.value.map((player) => careerStatsPlayerHtml(favorite, { ...player, jersey: "", positionName: "" }, season)).join("")}
    </div>`;
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
      ? `Tap a player to see their ${favorite.league} stats this season, in past seasons, and over their career, from ESPN. ESPN counts only ${favorite.league} regular season games and doesn't list assists.`
      : "Tap a player to see their stats this season, in past seasons, and over their career, from ESPN.";
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

// seasonYear: the past season the player is listed under, or undefined now.
function careerStatsPlayerHtml(favorite, player, seasonYear) {
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
      ${isOpen ? careerStatsPanelHtml(player, loadState("careerStats", key), state.statsView, seasonYear && { year: seasonYear, label: seasonLabel(favorite, seasonYear) }) : ""}
    </div>`;
}

// view: "season" | "past" | "career"
// pastSeason: { year, label } when the first button shows a past season
// (picked on the Season dropdown) instead of this one.
function careerStatsPanelHtml(player, statsState, view, pastSeason) {
  const message = (text) => `<div class="stats-panel"><div class="stats-message">${text}</div></div>`;
  if (statsState.status === "loading") return message(`Loading ${escapeHtml(player.name)}'s stats…`);
  if (statsState.status === "error") {
    return message(`Couldn't load ${escapeHtml(player.name)}'s stats. Tap Refresh and try again.`);
  }
  const { sport, currentYear, career, seasons } = statsState.value;
  const toggle = `
    <div class="toggle stats-toggle" role="group" aria-label="Which stats">
      ${toggleButtonHtml("stats-view", "view", "season", pastSeason ? `${escapeHtml(pastSeason.label)} Season` : "This season", view)}
      ${toggleButtonHtml("stats-view", "view", "past", "Past seasons", view)}
      ${toggleButtonHtml("stats-view", "view", "career", "Career", view)}
    </div>`;
  let body;
  if (view === "career") {
    body = career.sections.length > 0
      ? statTilesHtml(career)
      : `<div class="stats-message">ESPN has no career stats for ${escapeHtml(player.name)} yet.</div>`;
  } else if (view === "past") {
    const tables = pastSeasonTables(sport, seasons, currentYear);
    body = tables.length > 0
      ? tables.map(seasonTableHtml).join("")
      : `<div class="stats-message">${escapeHtml(player.name)} has no stats from past seasons.</div>`;
  } else {
    const current = currentSeasonSummaries(sport, seasons, pastSeason ? pastSeason.year : currentYear);
    body = current.length > 0
      ? current
          .map(({ label, team, summary }) => `
            <div class="stats-season-heading">${escapeHtml(label)}${team ? ` · ${escapeHtml(team)}` : ""}</div>
            ${statTilesHtml(summary)}`)
          .join("")
      : `<div class="stats-message">${
          pastSeason ? `ESPN has no ${escapeHtml(pastSeason.label)} stats for ${escapeHtml(player.name)}.` : `${escapeHtml(player.name)} hasn't played yet this season.`
        }</div>`;
  }
  return `<div class="stats-panel">${toggle}${body}</div>`;
}

// Games played, then each section as tiles: big number, label underneath.
function statTilesHtml({ games, sections }) {
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
  return gamesHtml + sectionsHtml;
}

// One section of Past seasons as a table, one row per season, with the
// team in small type under the year. Wide tables scroll sideways inside
// their box (the season column stays put), so the page itself never does.
function seasonTableHtml(table) {
  const headings = ["Season", table.gamesLabel, ...table.statLabels];
  return `
    <div class="stats-section">
      <h3 class="stats-section-title">${escapeHtml(table.title)}</h3>
      <div class="stats-table-scroll">
        <table class="stats-table">
          <thead><tr>${headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join("")}</tr></thead>
          <tbody>
            ${table.rows
              .map(
                (row) => `
              <tr>
                <td>${escapeHtml(row.label)}${row.team ? `<div class="stats-team">${escapeHtml(row.team)}</div>` : ""}</td>
                <td>${escapeHtml(row.games)}</td>
                ${row.values.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}
