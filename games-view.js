// Draws the Games tab: recent results or upcoming games for the selected
// team(s), grouped by month.

function gamesPageHtml() {
  const favorites = selectedFavorites();
  const states = favorites.map((favorite) => ({ favorite, ...loadState("games", favorite.key) }));
  const loaded = states.filter((teamState) => teamState.status === "loaded");
  const failed = states.filter((teamState) => teamState.status === "error");
  const stillLoading = states.some((teamState) => teamState.status === "loading");

  const games = selectGames(loaded.map((teamState) => teamState.value), state.gamesShown);
  const countText = stillLoading && games.length === 0 ? "" : `${games.length} ${games.length === 1 ? "game" : "games"}`;

  let body;
  if (games.length > 0) {
    body = gameListHtml(games);
  } else if (stillLoading) {
    body = `<div class="message">Loading games…</div>`;
  } else if (failed.length === states.length) {
    body = errorMessageHtml("Couldn't load games");
  } else {
    const emptyText =
      state.gamesShown === "final"
        ? { title: "No results yet", hint: "The season hasn't started. Check Upcoming for the first game." }
        : { title: "No upcoming games", hint: "The season may be over, or the next schedule isn't out yet. Check Final for the latest results." };
    body = `
      <div class="message">
        <div class="message-title">${emptyText.title}</div>
        ${emptyText.hint}
      </div>`;
  }

  const failedNote =
    failed.length > 0 && failed.length < states.length
      ? `<div class="notice">Couldn't load games for ${failed.map((teamState) => teamState.favorite.label).join(", ")}. Try Refresh.</div>`
      : "";

  const live = liveGames(loaded.map((teamState) => teamState.value));
  const liveSection = live.length
    ? `<section class="live-now"><h3 class="month live-heading">Live now</h3>${live.map(gameRowHtml).join("")}</section>`
    : "";

  return `
    ${teamFilterHtml()}
    ${liveSection}
    <div class="controls">
      <div class="toggle" role="group" aria-label="Which games">
        ${toggleButtonHtml("games-shown", "shown", "final", "Final", state.gamesShown)}
        ${toggleButtonHtml("games-shown", "shown", "upcoming", "Upcoming", state.gamesShown)}
      </div>
      <span class="count">${countText}</span>
    </div>
    ${calendarHtml()}
    ${failedNote}
    ${body}`;
}

// With one team selected, offer its upcoming games as a calendar file.
function calendarHtml() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  const gamesState = favorite && loadState("games", favorite.key);
  if (!gamesState || gamesState.status !== "loaded") return "";

  const count = calendarGames(gamesState.value).length;
  if (count === 0) return "";
  return `
    <div class="calendar">
      <button class="pill-button" data-action="download-calendar">Add ${favorite.label} games to calendar</button>
      <span class="calendar-note">${
        state.calendarMessage ||
        `${count} upcoming ${count === 1 ? "game" : "games"}, each with a reminder 1 hour before`
      }</span>
    </div>`;
}

function toggleButtonHtml(action, dataName, value, label, current) {
  return `<button class="${value === current ? "active" : ""}" data-action="${action}" data-${dataName}="${value}"
                  aria-pressed="${value === current}">${label}</button>`;
}

function gameListHtml(games) {
  let html = "";
  let currentMonth = "";
  for (const game of games) {
    const month = chicagoDate(game.date, { month: "long", year: "numeric" });
    if (month !== currentMonth) {
      html += `<h3 class="month">${month}</h3>`;
      currentMonth = month;
    }
    html += gameRowHtml(game);
  }
  return html;
}

function teamFor(game) {
  return FAVORITE_TEAMS.find((team) => team.key === game.teamKey);
}

function gameRowHtml(game) {
  const favorite = teamFor(game);
  const details = [game.note, game.venue && `${game.venue.name} · ${game.venue.city}`].filter(Boolean);

  return `
    <article class="game" style="--team-color:${favorite.color}">
      <div class="game-date">
        <span class="day-of-week">${chicagoDate(game.date, { weekday: "short" })}</span>
        <span class="day">${chicagoDate(game.date, { day: "numeric" })}</span>
      </div>
      <div class="matchup">
        <div class="teams">
          <span class="our-team">${logoHtml(game.ourLogos, initials(favorite.label), "logo-small")}${favorite.label}</span>
          <span class="at">${game.isHome ? "vs" : "@"}</span>
          <span class="opponent">${logoHtml(game.opponentLogos, game.opponentAbbreviation || "", "logo-small")}${escapeHtml(game.opponent)}</span>
        </div>
        ${details.map((detail) => `<div class="game-detail">${escapeHtml(detail)}</div>`).join("")}
      </div>
      <div class="result">${resultHtml(game)}</div>
    </article>`;
}

// "21–27", or null when ESPN hasn't sent the score yet.
function scoreText(game) {
  if (game.ourScore === null || game.theirScore === null) return null;
  return `${escapeHtml(game.ourScore)}–${escapeHtml(game.theirScore)}`;
}

function resultHtml(game) {
  if (game.completed && scoreText(game) === null) {
    return `<div class="start-time">Final</div>`;
  }
  if (game.completed) {
    const tied = game.ourScore === game.theirScore;
    const outcome = tied ? "tie" : game.won ? "win" : "loss";
    // Soccer calls a tie a draw.
    const isSoccer = leagueInfoFor(teamFor(game).league).sport === "soccer";
    const labels = { win: ["W", "win"], loss: ["L", "loss"], tie: isSoccer ? ["D", "draw"] : ["T", "tie"] };
    const [letter, word] = labels[outcome];
    return `
      <div class="score">${scoreText(game)}</div>
      <span class="outcome ${outcome}" title="${word}">${letter}</span>`;
  }
  if (game.state === "in") {
    const score = scoreText(game);
    return `
      ${score ? `<div class="score">${score}</div>` : `<div class="start-time">Score loading…</div>`}
      <span class="live">Live · ${escapeHtml(game.statusDetail)}</span>`;
  }
  const time = game.timeKnown ? chicagoDate(game.date, { hour: "numeric", minute: "2-digit" }) : "Time TBD";
  return `<div class="start-time">${time}</div>`;
}

function errorMessageHtml(title) {
  return `
    <div class="message error">
      <div class="message-title">${title}</div>
      Check your internet connection, then try again.
      <div><button class="pill-button retry-button" data-action="refresh">Try again</button></div>
    </div>`;
}
