// Draws the Team History tab: pick a team and a past season to see its
// record and every game result.

function historyPageHtml() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  if (!favorite) {
    return `${teamFilterHtml()}<div class="message">Tap a team name to see its past seasons.</div>`;
  }

  const season = historySeasonFor(favorite);
  const options = pastSeasons(favorite, new Date())
    .map((year) => `<option value="${year}" ${year === season ? "selected" : ""}>${seasonLabel(favorite, year)}</option>`)
    .join("");

  return `
    ${teamFilterHtml()}
    <div class="controls">
      <label class="season-picker">Season
        <select data-action="history-season" aria-label="Season">${options}</select>
      </label>
    </div>
    ${seasonHistoryHtml(favorite, season)}`;
}

// The season shown: the one picked, or the most recent finished season.
function historySeasonFor(favorite) {
  const seasons = pastSeasons(favorite, new Date());
  return seasons.includes(state.historySeason) ? state.historySeason : seasons[0];
}

function historyKey(favorite, season) {
  return `${favorite.key}-${season}`;
}

function seasonHistoryHtml(favorite, season) {
  const label = seasonLabel(favorite, season);
  const historyState = loadState("history", historyKey(favorite, season));
  if (historyState.status === "loading") {
    return `<div class="message">Loading the ${label} ${favorite.label} season…</div>`;
  }
  if (historyState.status === "error") {
    return errorMessageHtml(`Couldn't load the ${label} ${favorite.label} season`);
  }

  const { regular, postseason } = historyState.value;
  const regularRecord = seasonRecord(favorite, regular);
  if (!regularRecord) {
    return `<div class="message">ESPN has no results for the ${label} ${favorite.label} season.</div>`;
  }
  const postseasonRecord = seasonRecord(favorite, postseason, true);
  const recordStyle = leagueInfoFor(favorite.league).sport === "soccer" ? " (wins-draws-losses)" : "";

  return `
    <div class="history-summary" style="--team-color:${favorite.color}">
      <div class="history-season">${label} ${favorite.label}</div>
      <div class="history-record">${escapeHtml(regularRecord)}</div>
      <div class="history-detail">Regular season${recordStyle}${
        postseasonRecord ? ` · Playoffs ${escapeHtml(postseasonRecord)}` : " · No playoff games"
      }</div>
      ${headCoachHtml(favorite, season)}
    </div>
    ${seasonLeadersHtml(favorite, label, loadState("seasonLeaders", historyKey(favorite, season)))}
    ${seasonPlayersHtml(favorite, label, state.seasonPlayers[historyKey(favorite, season)], [...regular, ...postseason].filter((game) => game.state === "post").length)}
    ${postseason.length ? `<h2 class="history-heading">Playoffs</h2>${gameListHtml(postseason)}` : ""}
    <h2 class="history-heading">Regular season</h2>
    ${gameListHtml(regular)}
    <div class="season-note">Results, leaders, and players from ESPN. Head coaches are kept by this app, since ESPN doesn't keep past coaches.</div>`;
}

// "Passing Yards · Kyle Orton · 1,869", one line per category.
function seasonLeadersHtml(favorite, label, leadersState) {
  let body;
  if (leadersState.status === "loading") body = `<p class="injury-empty">Loading the ${label} leaders…</p>`;
  else if (leadersState.status === "error") body = `<p class="injury-empty">Couldn't load the ${label} leaders.</p>`;
  else if (leadersState.value.length === 0) body = `<p class="injury-empty">ESPN has no team leaders for the ${label} ${favorite.label}.</p>`;
  else {
    body = `<ul class="season-leaders">${leadersState.value
      .map(
        (leader) => `
        <li><span class="detail-label">${escapeHtml(leader.category)}</span> <span class="player">${escapeHtml(leader.player)}</span> ${escapeHtml(leader.value)}</li>`
      )
      .join("")}</ul>`;
  }
  return `<h2 class="history-heading">${label} team leaders</h2>${body}`;
}

// Everyone who played, built from every game's box score, so it loads only
// when asked for (a baseball season has 162 games).
function seasonPlayersHtml(favorite, label, playersState, gameCount) {
  const heading = `<h2 class="history-heading">Everyone who played</h2>`;
  if (!playersState) {
    return `${heading}
      <button class="pill-button" data-action="season-players">Show all players</button>
      <p class="injury-empty">Loads ${gameCount} box scores, so it can take a few seconds.</p>`;
  }
  if (playersState.status === "loading") return `${heading}<p class="injury-empty">Loading ${gameCount} box scores…</p>`;
  if (playersState.status === "error") return `${heading}<p class="injury-empty">Couldn't load the box scores. Try again.</p>`;
  if (playersState.value.length === 0) return `${heading}<p class="injury-empty">ESPN's box scores don't list the ${label} ${favorite.label} players.</p>`;
  return `${heading}
    <p class="injury-empty">${playersState.value.length} players appeared in a ${label} game, from ESPN's box scores.</p>
    <ul class="season-players">${playersState.value
      .map((player) => `<li>${escapeHtml(player.name)}${player.position ? ` <span class="position">${escapeHtml(player.position)}</span>` : ""}</li>`)
      .join("")}</ul>`;
}

// "Head coach Lovie Smith", from the hand-kept list in coaches.js.
function headCoachHtml(favorite, season) {
  const coach = pastHeadCoach(favorite, season);
  return `<div class="history-coach"><span class="detail-label">Head coach</span> ${coach ? escapeHtml(coach) : "Not listed for this season"}</div>`;
}
