// The page's state, data loading, team cards, and tabs. Each tab's content is
// drawn by its own file: games-view.js, standings-view.js, playoffs-view.js,
// injuries-view.js.

const state = {
  page: "games", // "games" | "standings" | "playoffs" | "injuries"
  selectedTeam: "all", // "all" or a FAVORITE_TEAMS key
  gamesShown: "final", // "final" | "upcoming"
  selectedLeague: "NFL",
  standingsView: "divisions", // "divisions" | "wildcard"
  // Each entry: { status: "loading" | "loaded" | "error", value }
  standings: {},
  games: {},
  injuries: {},
  playoffs: {}, // loaded per league, the first time its Playoff picture is opened
  lastUpdated: null,
  refreshing: false,
  calendarMessage: null, // confirmation shown after downloading a calendar
};

const PAGES = [
  { key: "games", label: "Games" },
  { key: "standings", label: "League standings" },
  { key: "playoffs", label: "Playoff picture" },
  { key: "injuries", label: "Injuries" },
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

// The Playoff picture loads only for leagues someone actually looks at.
function loadPlayoffsIfNeeded() {
  if (state.page === "playoffs" && !state.playoffs[state.selectedLeague]) {
    const leagueInfo = leagueInfoFor(state.selectedLeague);
    load("playoffs", leagueInfo.key, () => fetchPlayoffs(leagueInfo, new Date()));
  }
}

async function loadEverything() {
  state.refreshing = true;
  state.playoffs = {};
  render();
  loadPlayoffsIfNeeded();
  await Promise.all([
    ...LEAGUES.map((leagueInfo) => load("standings", leagueInfo.key, () => fetchLeagueStandings(leagueInfo))),
    ...FAVORITE_TEAMS.map((favorite) => load("games", favorite.key, () => fetchTeamGames(favorite))),
    ...FAVORITE_TEAMS.map((favorite) => load("injuries", favorite.key, () => fetchTeamInjuries(favorite))),
  ]);
  state.refreshing = false;
  state.lastUpdated = new Date();
  render();
}

function loadState(bucket, key) {
  return state[bucket][key] || { status: "loading" };
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

function render() {
  renderTeamCards();
  renderPageTabs();
  renderUpdatedAt();
  const page = document.getElementById("page");
  if (state.page === "games") page.innerHTML = gamesPageHtml();
  else if (state.page === "standings") page.innerHTML = standingsPageHtml();
  else if (state.page === "playoffs") page.innerHTML = playoffsPageHtml();
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
    state.selectedLeague = favorite.league;
  },
  "filter-team": (button) => {
    state.selectedTeam = button.dataset.team;
  },
  "download-calendar": () => {
    const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
    const games = loadState("games", favorite.key).value;
    downloadCalendar(favorite, buildCalendar(favorite, games, new Date()));
    const count = calendarGames(games).length;
    state.calendarMessage = `Downloaded ${favorite.key}-games.ics with ${count} games. Open it to add them to your calendar.`;
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
  "standings-view": (button) => {
    state.standingsView = button.dataset.view;
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
  render();
});

loadEverything();
