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
    </div>
    ${postseason.length ? `<h2 class="history-heading">Playoffs</h2>${gameListHtml(postseason)}` : ""}
    <h2 class="history-heading">Regular season</h2>
    ${gameListHtml(regular)}
    <div class="season-note">Results from ESPN. ESPN doesn't keep past rosters or coaches, so they aren't shown.</div>`;
}
