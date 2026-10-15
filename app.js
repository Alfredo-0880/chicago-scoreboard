// The page's state, data loading, team cards, and tabs. Each tab's content is
// drawn by its own file: games-view.js, standings-view.js, injuries-view.js.

const state = {
  page: "games", // "games" | "standings" | "injuries"
  selectedTeam: "all", // "all" or a FAVORITE_TEAMS key
  gamesShown: "final", // "final" | "upcoming"
  selectedLeague: "NFL",
  standingsView: "divisions", // "divisions" | "wildcard"
  // Each entry: { status: "loading" | "loaded" | "error", value }
  standings: {},
  games: {},
  injuries: {},
  lastUpdated: null,
  refreshing: false,
};

const PAGES = [
  { key: "games", label: "Games" },
  { key: "standings", label: "League standings" },
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

async function loadEverything() {
  state.refreshing = true;
  render();
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
      const { team, division, divisionRank } = standing;
      const placeDetails = [
        team.playoffSeed && `${ordinal(team.playoffSeed)} in ${escapeHtml(division.conference)}`,
        leagueInfoFor(favorite.league).rankedByPoints && `${team.points} pts`,
      ].filter(Boolean);
      body = `
        <div class="card-record">${escapeHtml(team.record)}</div>
        <div class="card-detail">
          ${ordinal(divisionRank)}, ${escapeHtml(division.title)}
          ${placeDetails.length ? `<br>${placeDetails.join(" · ")}` : ""}
          <br><span class="card-season">${escapeHtml(standings.season.name)} ${escapeHtml(standings.season.type)}</span>
        </div>`;
    }
  }

  const selected = favorite.key === state.selectedTeam;
  return `
    <button class="team-card ${selected ? "selected" : ""}" style="--team-color:${favorite.color}"
            data-action="select-team" data-team="${favorite.key}" aria-pressed="${selected}">
      <div class="card-team">
        <span class="card-badge">${initials(favorite.label)}</span>
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
  ACTIONS[button.dataset.action](button);
  render();
});

loadEverything();
