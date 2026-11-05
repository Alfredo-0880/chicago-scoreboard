// Draws the Rivals tab: each team's main rival, a short history, and this
// season's games against them.

function rivalsPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => rivalCardHtml(favorite, chicagoTeamLogos(favorite), loadState("games", favorite.key)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's main rival. Histories written by hand from Wikipedia; this season's games are live from ESPN.</div>
    <div class="uniform-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters. gamesState: the
// team's games as loaded ({ status, value }).
function rivalCardHtml(favorite, logos, gamesState) {
  const rival = teamRival(favorite);
  const header = `
    <div class="trophy-header">
      ${logoHtml(logos, initials(favorite.label), "logo-heading")}
      <h2 class="trophy-team">${favorite.label}</h2>
    </div>`;
  if (!rival) {
    return `
      <section class="uniform-card" style="--team-color:${favorite.color}">
        ${header}
        <p class="rival-history">Wikipedia names no main rival for the ${favorite.label} yet.</p>
      </section>`;
  }
  return `
    <section class="uniform-card" style="--team-color:${favorite.color}">
      ${header}
      <div class="rival-name">vs ${escapeHtml(rival.name)}</div>
      <p class="rival-history">${escapeHtml(rival.history)}</p>
      ${rivalSeasonHtml(favorite, rival, gamesState)}
    </section>`;
}

function rivalSeasonHtml(favorite, rival, gamesState) {
  if (gamesState.status === "loading") return `<div class="message">Loading this season's games…</div>`;
  if (gamesState.status === "error") return `<div class="message">Couldn't load this season's games. Try Refresh.</div>`;
  const { played, upcoming, record } = gamesAgainstRival(gamesState.value, rival);
  if (played.length === 0 && upcoming.length === 0) {
    return `<div class="message">No games against the ${escapeHtml(rival.name)} this season.</div>`;
  }
  const sport = leagueInfoFor(favorite.league).sport;
  const recordHtml = played.length > 0 ? `<div class="rival-record">This season: ${rivalRecordText(record, sport)}</div>` : "";
  return `
    ${recordHtml}
    ${gameListHtml([...played, ...upcoming])}`;
}
