// Draws the Games tab: recent results or upcoming games for the selected
// team(s), grouped by month.

// Games happening now, above the rest.
function liveSectionHtml(live) {
  return `<section class="live-now"><h3 class="month live-heading">Live now</h3>${live.map((game) => gameRowHtml(game)).join("")}</section>`;
}

function gamesPageHtml() {
  const favorites = selectedFavorites();
  const states = favorites.map((favorite) => ({ favorite, ...loadState("games", favorite.key) }));
  const loaded = states.filter((teamState) => teamState.status === "loaded");
  const failed = states.filter((teamState) => teamState.status === "error");
  const stillLoading = states.some((teamState) => teamState.status === "loading");

  const gamesByTeam = loaded.map((teamState) => teamState.value);
  const games = selectGames(gamesByTeam, state.gamesShown, state.allFinals);
  const countText = stillLoading && games.length === 0 ? "" : `${games.length} ${games.length === 1 ? "game" : "games"}`;

  let body;
  if (games.length > 0) {
    body = gameListHtml(games, gamesTabBoxScore);
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

  const live = liveGames(gamesByTeam);
  const liveSection = live.length ? liveSectionHtml(live) : "";

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
    ${body}
    ${state.gamesShown === "final" && hasHiddenFinals(gamesByTeam) ? allFinalsButtonHtml() : ""}`;
}

// Below Final: switches between the last 10 results per team and the whole
// season.
function allFinalsButtonHtml() {
  const label = state.allFinals ? `Show only the last ${GAMES_PER_TEAM}` : "Show all games";
  return `<button class="pill-button show-all-games" data-action="all-finals">${label}</button>`;
}

// The teams (and their games) a calendar download covers: the selected team,
// or every team with upcoming games when All teams is selected. Empty while
// any of those teams' games are still loading.
function calendarTeams() {
  const states = selectedFavorites().map((favorite) => ({ favorite, ...loadState("games", favorite.key) }));
  if (states.some((teamState) => teamState.status !== "loaded")) return [];
  return states
    .map(({ favorite, value }) => ({ favorite, games: value }))
    .filter(({ games }) => calendarGames(games).length > 0);
}

// Offers the upcoming games as a calendar file: one team's, or all teams'.
function calendarHtml() {
  const teams = calendarTeams();
  const count = teams.reduce((total, { games }) => total + calendarGames(games).length, 0);
  if (count === 0) return "";

  const isAllTeams = state.selectedTeam === "all";
  const label = isAllTeams ? "Add all games to calendar" : `Add ${teams[0].favorite.label} games to calendar`;
  const fromTeams = isAllTeams ? ` from ${teams.length} ${teams.length === 1 ? "team" : "teams"}` : "";
  return `
    <div class="calendar">
      <button class="pill-button" data-action="download-calendar">${label}</button>
      <span class="calendar-note">${
        state.calendarMessage ||
        `${count} upcoming ${count === 1 ? "game" : "games"}${fromTeams}, each with a reminder 1 hour before`
      }</span>
    </div>`;
}

function toggleButtonHtml(action, dataName, value, label, current) {
  return `<button class="${value === current ? "active" : ""}" data-action="${action}" data-${dataName}="${value}"
                  aria-pressed="${value === current}">${label}</button>`;
}

// boxScoreFor(game), when given, says whether a game offers a box score and
// whether it is open (see gameRowHtml); Team History leaves it out.
function gameListHtml(games, boxScoreFor = () => null) {
  let html = "";
  let currentMonth = "";
  for (const game of games) {
    const month = displayDate(game.date, { month: "long", year: "numeric" });
    if (month !== currentMonth) {
      html += `<h3 class="month">${month}</h3>`;
      currentMonth = month;
    }
    html += gameRowHtml(game, boxScoreFor(game));
  }
  return html;
}

// On the Games tab, every finished game offers its box score.
function gamesTabBoxScore(game) {
  if (!game.completed) return null;
  const key = boxScoreKey(game);
  return { open: state.openBoxScores.includes(key), state: loadState("boxScores", key) };
}

function boxScoreKey(game) {
  return `${game.teamKey}:${game.id}`;
}

function teamFor(game) {
  return FAVORITE_TEAMS.find((team) => team.key === game.teamKey);
}

// Each team's season so far on upcoming games, from the standings the app
// already loads. The app sets standingsForLeague (league key -> loaded
// standings, or null); the tests leave it returning null.
let standingsForLeague = () => null;

// ".727" (wins over games played, ".000" to "1.000"), or null before any games.
// ESPN gives no win percentage for the NHL or soccer, so it's counted from the record.
function winPercentText(team) {
  const games = team.record.split("-").map(Number).reduce((sum, count) => sum + count, 0);
  const percent = team.winPercent > 0 ? team.winPercent : games > 0 ? Number(team.record.split("-")[0]) / games : null;
  if (percent === null) return null;
  return percent >= 1 ? "1.000" : percent.toFixed(3).replace(/^0/, "");
}

// "Season: Bears .727 · Lions .636", or for soccer (ranked by points, not
// wins) the records: "Season: Fire 16-7-11 · Crew 14-9-11". Only for
// upcoming games in the standings' season (not 2027 spring training against
// 2026 standings), and not preseason games.
function seasonRecordText(game, standings = standingsForLeague(teamFor(game).league)) {
  if (game.state !== "pre" || game.preseason || !standings || !game.seasonName) return null;
  if (!standings.season.name.startsWith(game.seasonName)) return null;
  const favorite = teamFor(game);
  const teams = standings.divisions.flatMap((division) => division.teams);
  const ours = teams.find((team) => team.abbreviation === favorite.abbreviation);
  const theirs = teams.find((team) => team.abbreviation === game.opponentAbbreviation);
  if (!ours || !theirs) return null;
  const isSoccer = leagueInfoFor(favorite.league).sport === "soccer";
  const show = (team) => (isSoccer ? team.record : winPercentText(team));
  if (!show(ours) || !show(theirs)) return null;
  return `Season: ${favorite.label} ${show(ours)} · ${game.opponent} ${show(theirs)}`;
}

// boxScore: null for no box score button, or { open, state } where state is
// the box score's load state (only read while open).
function gameRowHtml(game, boxScore = null) {
  const favorite = teamFor(game);
  const details = [game.note, game.venue && `${game.venue.name} · ${game.venue.city}`].filter(Boolean);
  const forecast = gameForecastText(game);
  const winChance = winChanceText(game);
  const seasonRecord = seasonRecordText(game);
  const boxScoreButton = boxScore
    ? `<button class="series-games-toggle box-score-toggle" data-action="box-score" data-game="${escapeHtml(boxScoreKey(game))}" aria-expanded="${boxScore.open}">
         ${boxScore.open ? "Hide box score ▾" : "Box score ▸"}
       </button>`
    : "";

  return `
    <article class="game" style="--team-color:${favorite.color}">
      <div class="game-date">
        <span class="day-of-week">${displayDate(game.date, { weekday: "short" })}</span>
        <span class="day">${displayDate(game.date, { day: "numeric" })}</span>
      </div>
      <div class="matchup">
        <div class="teams">
          <span class="our-team">${logoHtml(game.ourLogos, initials(favorite.label), "logo-small")}${favorite.label}</span>
          <span class="at">${game.isHome ? "vs" : "@"}</span>
          <span class="opponent">${logoHtml(game.opponentLogos, game.opponentAbbreviation || "", "logo-small")}${escapeHtml(game.opponent)}</span>
        </div>
        ${details.map((detail) => `<div class="game-detail">${escapeHtml(detail)}</div>`).join("")}
        ${forecast ? `<div class="game-detail game-forecast">${escapeHtml(forecast)}</div>` : ""}
        ${seasonRecord ? `<div class="game-detail game-season-record">${escapeHtml(seasonRecord)}</div>` : ""}
        ${winChance ? `<div class="game-detail game-win-chance">${escapeHtml(winChance)}</div>` : ""}
        ${boxScoreButton}
      </div>
      <div class="result">${resultHtml(game)}</div>
      ${boxScore && boxScore.open ? boxScorePanelHtml(boxScore.state, boxScoreKey(game)) : ""}
    </article>`;
}

// A finished game's box score, under its row: a table per kind of player.
function boxScorePanelHtml(boxScoreState, key) {
  if (boxScoreState.status === "loading") return `<div class="box-score"><p class="box-score-note">Loading box score…</p></div>`;
  if (boxScoreState.status === "error") {
    return `
      <div class="box-score">
        <p class="box-score-note">Couldn't load the box score. Check your internet connection.</p>
        <button class="pill-button" data-action="box-score-retry" data-game="${escapeHtml(key)}">Try again</button>
      </div>`;
  }
  if (boxScoreState.value.length === 0) return `<div class="box-score"><p class="box-score-note">ESPN has no box score for this game.</p></div>`;
  return `<div class="box-score">${boxScoreState.value.map(boxScoreTableHtml).join("")}</div>`;
}

function boxScoreTableHtml(table) {
  return `
    <h4 class="box-score-title">${escapeHtml(table.title)}</h4>
    <div class="stats-table-scroll">
      <table class="stats-table">
        <thead><tr><th>Player</th>${table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
        <tbody>
          ${table.rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td>${row.values.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>`;
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
  const time = game.timeKnown ? displayDate(game.date, { hour: "numeric", minute: "2-digit" }) : "Time TBD";
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
