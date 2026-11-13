// Draws the Today tab: every Chicago game today, across all eight teams, in
// start-time order: not started yet, live, and final. It uses the schedules
// the Games tab loads, so live scores update here too.

// A date's day in Chicago, "11/12/2026", so games compare by Chicago's
// calendar day whatever the viewer's time zone.
function chicagoDayKey(date) {
  return chicagoDate(date, { year: "numeric", month: "numeric", day: "numeric" });
}

// Today's games, earliest first: those that start today in Chicago, plus any
// still being played from last night (a game that runs past midnight).
function todaysGames(gamesByTeam, now) {
  const today = chicagoDayKey(now);
  return gamesByTeam
    .flat()
    .filter((game) => chicagoDayKey(game.date) === today || game.state === "in")
    .sort((a, b) => a.date - b.date);
}

// The first game after today, for a day with none, or null.
function nextGameAfterToday(gamesByTeam, now) {
  const today = chicagoDayKey(now);
  const later = gamesByTeam.flat().filter((game) => game.state === "pre" && game.date > now && chicagoDayKey(game.date) !== today);
  return later.sort((a, b) => a.date - b.date)[0] || null;
}

function todayPageHtml() {
  const now = new Date();
  const states = FAVORITE_TEAMS.map((favorite) => ({ favorite, ...loadState("games", favorite.key) }));
  const loaded = states.filter((teamState) => teamState.status === "loaded");
  const failed = states.filter((teamState) => teamState.status === "error");
  const stillLoading = states.some((teamState) => teamState.status === "loading");
  const gamesByTeam = loaded.map((teamState) => teamState.value);
  const games = todaysGames(gamesByTeam, now);

  const day = chicagoDate(now, { weekday: "long", month: "long", day: "numeric" });
  const count = stillLoading && games.length === 0 ? "" : ` · ${games.length} Chicago ${games.length === 1 ? "game" : "games"}`;

  let body;
  if (games.length > 0) {
    body = games.map((game) => gameRowHtml(game, gamesTabBoxScore(game))).join("");
  } else if (stillLoading) {
    body = `<div class="message">Loading today's games…</div>`;
  } else if (failed.length === states.length) {
    body = errorMessageHtml("Couldn't load today's games");
  } else {
    const next = nextGameAfterToday(gamesByTeam, now);
    const nextText = next
      ? `Next: ${teamFor(next).label} ${next.isHome ? "vs" : "@"} ${escapeHtml(next.opponent)}, ${chicagoDate(next.date, { weekday: "long", month: "short", day: "numeric" })}${
          next.timeKnown ? ` at ${chicagoDate(next.date, { hour: "numeric", minute: "2-digit" })}` : ""
        }.`
      : "No upcoming Chicago games are scheduled yet.";
    body = `
      <div class="message">
        <div class="message-title">No Chicago games today</div>
        ${nextText}
      </div>`;
  }

  const failedNote =
    failed.length > 0 && failed.length < states.length
      ? `<div class="notice">Couldn't load games for ${failed.map((teamState) => teamState.favorite.label).join(", ")}. Try Refresh.</div>`
      : "";

  return `
    <div class="season-note">${day}${count}. Times are Chicago time; live scores update every ${LIVE_CHECK_SECONDS} seconds.</div>
    ${failedNote}
    ${body}`;
}
