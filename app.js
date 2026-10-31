// The page's state, data loading, team cards, and tabs. Each tab's content is
// drawn by its own file: games-view.js, standings-view.js, playoffs-view.js,
// rosters-view.js, news-view.js, highlights-view.js, history-view.js,
// championships-view.js, funfacts-view.js, socials-view.js, careerstats-view.js,
// injuries-view.js.

const state = {
  page: "games", // "games" | "standings" | "playoffs" | "rosters" | "news" | "highlights" | "history" | "championships" | "funfacts" | "social" | "stats" | "injuries"
  selectedTeam: "all", // "all" or a FAVORITE_TEAMS key
  gamesShown: "final", // "final" | "upcoming"
  selectedLeague: "NFL",
  playoffsView: "seeds", // Playoff Picture: "bracket" | "seeds" (Playoff Race) | "race" (Wild Card)
  // Each entry: { status: "loading" | "loaded" | "error", value }
  standings: {},
  games: {},
  injuries: {},
  injuryHistory: {}, // each team's recent injury updates, loaded when picked on Injuries
  playoffs: {}, // loaded per league, the first time its Playoff Picture is opened
  rosters: {}, // loaded per team, the first time its roster (or Stats) is opened
  careerStats: {}, // each player's career stats, keyed "bears-4431611", loaded when tapped
  statsPlayer: null, // the player open on the Stats tab (a careerStats key), or null
  statsView: "season", // "season" | "past" | "career", kept when opening another player
  news: {}, // each team's stories and videos, loaded the first time its News or Highlights is opened
  history: {}, // past seasons, keyed "bears-2005", loaded when picked
  historySeason: null, // season picked on Team History (null: most recent)
  pastStandings: {}, // past seasons' standings, keyed "NFL-2005", loaded when picked
  standingsSeason: null, // season picked on League Standings (null: current season)
  playoffsSeason: null, // season picked on Playoff Picture (null: current season)
  pastPlayoffs: {}, // past seasons' playoff games, keyed "MLB-2016", loaded when picked
  openSeries: [], // bracket series whose games are shown (seriesKey in playoffs-view.js)
  lastUpdated: null,
  refreshing: false,
  calendarMessage: null, // confirmation shown after downloading a calendar
  themeChoice: savedThemeChoice(), // "auto" | "light" | "dark", from theme.js
};

const PAGES = [
  { key: "games", label: "Games" },
  { key: "standings", label: "League Standings" },
  { key: "playoffs", label: "Playoff Picture" },
  { key: "rosters", label: "Rosters" },
  { key: "stats", label: "Stats" },
  { key: "injuries", label: "Injuries" },
  { key: "news", label: "News" },
  { key: "highlights", label: "Highlights" },
  { key: "social", label: "Social" },
  { key: "history", label: "Team History" },
  { key: "championships", label: "Championships" },
  { key: "funfacts", label: "Fun Facts" },
];

// Load one piece of data into state[bucket][key], redrawing as it arrives.
async function load(bucket, key, fetchValue) {
  state[bucket][key] = { status: "loading" };
  try {
    state[bucket][key] = { status: "loaded", value: await fetchValue() };
  } catch (error) {
    console.error(`Could not load ${bucket} for ${key}`, error);
    state[bucket][key] = { status: "error" };
  }
  render();
}

// The Playoff Picture loads only for leagues someone actually looks at.
function loadPlayoffsIfNeeded() {
  if (state.page === "playoffs" && !state.playoffs[state.selectedLeague]) {
    const leagueInfo = leagueInfoFor(state.selectedLeague);
    load("playoffs", leagueInfo.key, () => fetchPlayoffs(leagueInfo, new Date()));
  }
}

// A roster loads the first time someone opens that team on the Rosters or Stats tab.
function loadRosterIfNeeded() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  if ((state.page === "rosters" || state.page === "stats") && favorite && !state.rosters[favorite.key]) {
    load("rosters", favorite.key, () => fetchRoster(favorite));
  }
}

// A player's career stats load the first time they're tapped on the Stats tab.
function loadCareerStatsIfNeeded() {
  const key = state.statsPlayer;
  if (state.page !== "stats" || !key || state.careerStats[key]) return;
  const [teamKey, playerId] = key.split("-");
  const favorite = FAVORITE_TEAMS.find((team) => team.key === teamKey);
  load("careerStats", key, () => fetchCareerStats(favorite, playerId));
}

// News and highlights load for the teams on screen, the first time each is shown.
function loadNewsIfNeeded() {
  if (state.page !== "news" && state.page !== "highlights") return;
  for (const favorite of selectedFavorites()) {
    if (!state.news[favorite.key]) load("news", favorite.key, () => fetchTeamArticles(favorite));
  }
}

// A past season's standings load the first time they're picked.
function loadPastStandingsIfNeeded() {
  const season = standingsSeasonFor(state.selectedLeague);
  if (state.page !== "standings" || !season) return;
  const key = pastStandingsKey(state.selectedLeague, season);
  if (!state.pastStandings[key]) load("pastStandings", key, () => fetchLeagueStandings(leagueInfoFor(state.selectedLeague), season));
}

// A past season's playoffs (and the standings its Playoff Race and Wild Card
// come from) load the first time they're picked on Playoff Picture.
function loadPastPlayoffsIfNeeded() {
  const season = playoffsSeasonFor(state.selectedLeague);
  if (state.page !== "playoffs" || !season) return;
  const leagueInfo = leagueInfoFor(state.selectedLeague);
  const key = pastStandingsKey(leagueInfo.key, season);
  if (!state.pastStandings[key]) load("pastStandings", key, () => fetchLeagueStandings(leagueInfo, season));
  if (hasPastBracket(leagueInfo.key) && !state.pastPlayoffs[key]) load("pastPlayoffs", key, () => fetchPastPlayoffs(leagueInfo, season));
}

// A team's injury history loads the first time it's picked on Injuries.
function loadInjuryHistoryIfNeeded() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  if (state.page === "injuries" && favorite && !state.injuryHistory[favorite.key]) {
    load("injuryHistory", favorite.key, () => fetchInjuryHistory(favorite));
  }
}

// A past season loads the first time it's shown.
function loadHistoryIfNeeded() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  if (state.page !== "history" || !favorite) return;
  const season = historySeasonFor(favorite);
  const key = historyKey(favorite, season);
  if (!state.history[key]) load("history", key, () => fetchSeasonHistory(favorite, season));
}

async function loadEverything() {
  state.refreshing = true;
  state.playoffs = {};
  state.rosters = {};
  state.careerStats = {};
  state.injuryHistory = {};
  state.news = {};
  render();
  loadPlayoffsIfNeeded();
  loadRosterIfNeeded();
  loadCareerStatsIfNeeded();
  loadInjuryHistoryIfNeeded();
  loadNewsIfNeeded();
  await Promise.all([
    ...LEAGUES.map((leagueInfo) => load("standings", leagueInfo.key, () => fetchLeagueStandings(leagueInfo))),
    ...FAVORITE_TEAMS.map((favorite) => load("games", favorite.key, () => fetchTeamGames(favorite))),
    ...FAVORITE_TEAMS.map((favorite) => load("injuries", favorite.key, () => fetchTeamInjuries(favorite))),
  ]);
  state.refreshing = false;
  state.lastUpdated = new Date();
  render();
  updateLiveScores();
}

function loadState(bucket, key) {
  return state[bucket][key] || { status: "loading" };
}

function hasLiveGame(favorite) {
  const gamesState = loadState("games", favorite.key);
  return gamesState.status === "loaded" && gamesState.value.some((game) => game.state === "in");
}

// A Chicago team's logos come from its league's standings, once they load.
function chicagoTeamLogos(favorite) {
  const standingsState = loadState("standings", favorite.league);
  const standing = standingsState.status === "loaded" && findTeamStanding(standingsState.value, favorite.abbreviation);
  return standing ? standing.team.logos : null;
}

// Teams whose data a tab should show, following the team filter.
function selectedFavorites() {
  return state.selectedTeam === "all"
    ? FAVORITE_TEAMS
    : FAVORITE_TEAMS.filter((favorite) => favorite.key === state.selectedTeam);
}

// Redraws the header's logo ticker only when its logos change, so the
// sliding animation isn't restarted by every redraw of the page.
let shownTickerHtml = null;

function renderLogoTicker() {
  const html = logoTickerHtml(FAVORITE_TEAMS.map((favorite) => ({ label: favorite.label, logos: chicagoTeamLogos(favorite) })));
  if (html === shownTickerHtml) return;
  document.getElementById("logoTrack").innerHTML = html;
  shownTickerHtml = html;
}

function render() {
  renderLogoTicker();
  renderTeamCards();
  renderPageTabs();
  renderThemeToggle();
  renderUpdatedAt();
  const page = document.getElementById("page");
  if (state.page === "games") page.innerHTML = gamesPageHtml();
  else if (state.page === "standings") page.innerHTML = standingsPageHtml();
  else if (state.page === "playoffs") page.innerHTML = playoffsPageHtml();
  else if (state.page === "rosters") page.innerHTML = rostersPageHtml();
  else if (state.page === "news") page.innerHTML = newsPageHtml();
  else if (state.page === "highlights") page.innerHTML = highlightsPageHtml();
  else if (state.page === "history") page.innerHTML = historyPageHtml();
  else if (state.page === "championships") page.innerHTML = championshipsPageHtml();
  else if (state.page === "funfacts") page.innerHTML = funFactsPageHtml();
  else if (state.page === "social") page.innerHTML = socialsPageHtml();
  else if (state.page === "stats") page.innerHTML = careerStatsPageHtml();
  else page.innerHTML = injuriesPageHtml();
}

function renderTeamCards() {
  document.getElementById("teamCards").innerHTML = FAVORITE_TEAMS.map(teamCardHtml).join("");
}

function teamCardHtml(favorite) {
  const standingsState = loadState("standings", favorite.league);
  let body;

  if (standingsState.status === "loading") {
    body = `<div class="card-record placeholder">&nbsp;</div><div class="card-detail">Loading…</div>`;
  } else if (standingsState.status === "error") {
    body = `<div class="card-record">—</div><div class="card-detail">Couldn't load. Try Refresh.</div>`;
  } else {
    const standings = standingsState.value;
    const standing = findTeamStanding(standings, favorite.abbreviation);
    if (!standing) {
      body = `<div class="card-record">—</div><div class="card-detail">Not in ESPN's standings</div>`;
    } else {
      const place = placeSummary(favorite.league, standing).map(escapeHtml).join("<br>");
      body = `
        <div class="card-record">${escapeHtml(standing.team.record)}</div>
        <div class="card-detail">
          ${place}
          <br><span class="card-season">${escapeHtml(standings.season.name)} ${escapeHtml(standings.season.type)}</span>
        </div>`;
    }
  }

  const selected = favorite.key === state.selectedTeam;
  return `
    <button class="team-card ${selected ? "selected" : ""}" style="--team-color:${favorite.color}"
            data-action="select-team" data-team="${favorite.key}" aria-pressed="${selected}">
      <div class="card-team">
        ${logoHtml(chicagoTeamLogos(favorite), initials(favorite.label), "logo-badge")}
        <span class="card-name">${favorite.label} · ${favorite.league}</span>
        ${hasLiveGame(favorite) ? `<span class="live-badge">Live</span>` : ""}
      </div>
      ${body}
    </button>`;
}

function renderPageTabs() {
  document.getElementById("pageTabs").innerHTML = PAGES.map(
    (page) => `
      <button class="page-tab ${page.key === state.page ? "active" : ""}" role="tab"
              aria-selected="${page.key === state.page}" data-action="page" data-page="${page.key}">${page.label}</button>`
  ).join("");
}

function renderThemeToggle() {
  const labels = { auto: "Auto", light: "Light", dark: "Dark" };
  document.getElementById("themeToggle").innerHTML = THEME_CHOICES.map((choice) =>
    toggleButtonHtml("theme", "choice", choice, labels[choice], state.themeChoice)
  ).join("");
}

function renderUpdatedAt() {
  document.getElementById("updatedAt").textContent = state.lastUpdated
    ? `Updated ${chicagoDate(state.lastUpdated, { hour: "numeric", minute: "2-digit" })}`
    : "Loading live data…";
  const refreshButton = document.getElementById("refreshButton");
  refreshButton.disabled = state.refreshing;
  refreshButton.textContent = state.refreshing ? "Refreshing…" : "Refresh";
}

// "All teams" plus one button per team; used by the Games and Injuries tabs.
function teamFilterHtml() {
  const options = [{ key: "all", label: "All teams", color: "#57534A" }, ...FAVORITE_TEAMS];
  return `
    <nav class="team-filter" aria-label="Team">
      ${options
        .map(
          (option) => `
        <button class="team-button ${option.key === state.selectedTeam ? "active" : ""}" style="--team-color:${option.color}"
                data-action="filter-team" data-team="${option.key}" aria-pressed="${option.key === state.selectedTeam}">
          <span class="dot"></span>${option.label}
        </button>`
        )
        .join("")}
    </nav>`;
}

// One place handles every click, using the data-action on the button.
const ACTIONS = {
  "select-team": (button) => {
    const favorite = FAVORITE_TEAMS.find((team) => team.key === button.dataset.team);
    // Tapping the selected card again goes back to all teams.
    state.selectedTeam = state.selectedTeam === favorite.key ? "all" : favorite.key;
    state.historySeason = null;
    state.selectedLeague = favorite.league;
  },
  "filter-team": (button) => {
    state.selectedTeam = button.dataset.team;
    state.historySeason = null;
  },
  "download-calendar": () => {
    const teams = calendarTeams();
    const isAllTeams = state.selectedTeam === "all";
    const fileName = isAllTeams ? "chicago-games.ics" : `${teams[0].favorite.key}-games.ics`;
    const calendarText = isAllTeams
      ? buildMultiTeamCalendar("Chicago games", teams, new Date())
      : buildCalendar(teams[0].favorite, teams[0].games, new Date());
    downloadCalendar(fileName, calendarText);
    const count = teams.reduce((total, { games }) => total + calendarGames(games).length, 0);
    state.calendarMessage = `Downloaded ${fileName} with ${count} games. Open it to add them to your calendar.`;
  },
  page: (button) => {
    state.page = button.dataset.page;
  },
  "games-shown": (button) => {
    state.gamesShown = button.dataset.shown;
  },
  league: (button) => {
    state.selectedLeague = button.dataset.league;
  },
  theme: (button) => {
    state.themeChoice = button.dataset.choice;
    saveThemeChoice(state.themeChoice);
    applyTheme(state.themeChoice);
  },
  "player-stats": (button) => {
    // Tapping the open player again closes their stats.
    state.statsPlayer = state.statsPlayer === button.dataset.player ? null : button.dataset.player;
  },
  "stats-view": (button) => {
    state.statsView = button.dataset.view;
  },
  "series-games": (button) => {
    const key = button.dataset.series;
    state.openSeries = state.openSeries.includes(key) ? state.openSeries.filter((open) => open !== key) : [...state.openSeries, key];
  },
  "playoffs-view": (button) => {
    state.playoffsView = button.dataset.view;
  },
  refresh: () => {
    loadEverything();
  },
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  if (button.dataset.action !== "download-calendar") state.calendarMessage = null;
  ACTIONS[button.dataset.action](button);
  loadPlayoffsIfNeeded();
  loadRosterIfNeeded();
  loadCareerStatsIfNeeded();
  loadNewsIfNeeded();
  loadHistoryIfNeeded();
  loadPastStandingsIfNeeded();
  loadPastPlayoffsIfNeeded();
  loadInjuryHistoryIfNeeded();
  render();
});

// The season pickers on Team History, League Standings, and Playoff Picture.
document.addEventListener("change", (event) => {
  const action = event.target.dataset.action;
  if (action === "history-season") {
    state.historySeason = Number(event.target.value);
    loadHistoryIfNeeded();
  } else if (action === "standings-season") {
    state.standingsSeason = event.target.value ? Number(event.target.value) : null;
    loadPastStandingsIfNeeded();
  } else if (action === "playoffs-season") {
    state.playoffsSeason = event.target.value ? Number(event.target.value) : null;
    loadPastPlayoffsIfNeeded();
  } else {
    return;
  }
  render();
});

loadEverything();
// Keep live scores current; this loads nothing while no game is on.
setInterval(updateLiveScores, LIVE_CHECK_SECONDS * 1000);
// In Auto, follow the device when it switches between light and dark.
systemDarkQuery.addEventListener("change", () => {
  applyTheme(state.themeChoice);
  render();
});
