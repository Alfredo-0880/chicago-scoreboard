// Draws the Rivals tab: each team's main rival, a short history, and this
// season's games against them.

function rivalsPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => rivalCardHtml(favorite, chicagoTeamLogos(favorite), loadState("games", favorite.key)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's main rival. Histories and all-time records copied from Wikipedia; this season's games are live from ESPN.</div>
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
      ${rivalAllTimeHtml(rival.allTime)}
      ${rivalSeasonHtml(favorite, rival, gamesState)}
      ${favorite.key === "cubs" || favorite.key === "whitesox" ? crosstownHtml(CROSSTOWN_SEASONS) : ""}
    </section>`;
}

// The Crosstown Classic, season by season, on the Cubs and White Sox cards
// (the only Chicago teams that play each other). The Cubs' main rival is
// the Cardinals, so this is how their card shows the White Sox.
const CROSSTOWN_SHOWN = 10;

// How many seasons each team won and how many were split, and the games.
function crosstownSummary(seasons) {
  const count = (winner) => seasons.filter((season) => season.winner === winner).length;
  const games = { Cubs: 0, "White Sox": 0 };
  for (const season of seasons) {
    // "5–1" is the winner's wins first; a split's two numbers are equal.
    const [winnerWins, loserWins] = season.record.split("–").map(Number);
    const winner = season.winner || "Cubs";
    games[winner] += winnerWins;
    games[winner === "Cubs" ? "White Sox" : "Cubs"] += loserWins;
  }
  return { cubsSeasons: count("Cubs"), soxSeasons: count("White Sox"), splits: count(null), games };
}

function crosstownHtml(seasons) {
  const { cubsSeasons, soxSeasons, splits, games } = crosstownSummary(seasons);
  const first = seasons[seasons.length - 1].year;
  const rows = seasons.map(crosstownSeasonHtml);
  const older = rows.slice(CROSSTOWN_SHOWN);
  return `
    <div class="crosstown">
      <h3 class="hof-group">Crosstown Classic by season</h3>
      <p class="rival-history">Since ${first}: the Cubs won ${cubsSeasons} season series, the White Sox ${soxSeasons}, and ${splits} were split. In games, Cubs ${games.Cubs}, White Sox ${games["White Sox"]}.</p>
      <ol class="coach-list">${rows.slice(0, CROSSTOWN_SHOWN).join("")}</ol>
      ${
        older.length
          ? `<details class="coach-more"><summary>Show all ${seasons.length} seasons</summary><ol class="coach-list">${older.join("")}</ol></details>`
          : ""
      }
      <p class="uniform-note">From Wikipedia's Cubs–White Sox rivalry article. The North Side is Wrigley Field; the South Side is the White Sox' park.</p>
    </div>`;
}

// "2025" over "Cubs won 5–1 · North Side: Cubs 3–0 · South Side: Cubs 2–1".
function crosstownSeasonHtml(season) {
  const result = season.winner ? `${season.winner} won ${season.record}` : `Split ${season.record}`;
  const at = (place, games) =>
    games ? `${place}: ${games.leader ? `${games.leader} ${games.record}` : `split ${games.record}`}` : `${place}: no games`;
  const details = [result, at("North Side", season.atCubs), at("South Side", season.atSox)];
  return `
    <li class="coach-row">
      <span class="leader-player">
        <span class="hof-name">${season.year}</span>
        <span class="retired-details">${details.map(escapeHtml).join(" · ")}</span>
      </span>
    </li>`;
}

function rivalAllTimeHtml({ regularSeason, playoffs, note }) {
  const regular = regularSeason
    ? `Regular season: ${escapeHtml(allTimeRecordText(regularSeason))}`
    : "Wikipedia doesn't list a regular-season record.";
  const rows = [regular, playoffs && `Playoffs: ${escapeHtml(allTimeRecordText(playoffs))}`].filter(Boolean);
  return `
    <div class="rival-all-time">
      <h3 class="hof-group">All-time record</h3>
      <ul class="rival-all-time-list">${rows.map((row) => `<li>${row}</li>`).join("")}</ul>
      ${note ? `<p class="uniform-note">${escapeHtml(note)}</p>` : ""}
    </div>`;
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
