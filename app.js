// The page's state, data loading, team cards, and tabs. Each tab's content is
// drawn by its own file: today-view.js, games-view.js, standings-view.js, playoffs-view.js,
// rosters-view.js, news-view.js, highlights-view.js, history-view.js,
// championships-view.js, stadiums-view.js, uniforms-view.js, mascots-view.js, rivals-view.js, retired-numbers-view.js, hall-of-fame-view.js, leaders-view.js, coach-history-view.js, draft-picks-view.js, funfacts-view.js, socials-view.js, careerstats-view.js,
// injuries-view.js. The tab rows (and which pages are grouped) are in tabs.js.

const state = {
  page: "today", // opens on Today; "today" | "games" | "standings" | "playoffs" | "cups" | "rosters" | "news" | "highlights" | "history" | "championships" | "stadiums" | "uniforms" | "mascots" | "rivals" | "retired" | "halloffame" | "leaders" | "coaches" | "drafts" | "funfacts" | "social" | "stats" | "injuries" | "settings" | "diagnostics"
  selectedTeam: "all", // "all" or a FAVORITE_TEAMS key
  gamesShown: "final", // "final" | "upcoming"
  allFinals: false, // Final shows every result this season, not just the last 10
  openBoxScores: [], // Games tab games whose box score is shown (boxScoreKey in games-view.js)
  boxScores: {}, // boxScoreKey -> load state
  selectedLeague: "NFL",
  playoffsView: null, // Playoff Picture: "bracket" | "seeds" (Playoff Race) | "race" (Wild Card); null until one is tapped, so the league's first button shows (Bracket when there is one)
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
  statsSeason: null, // past season picked on Stats (null: current roster)
  news: {}, // each team's stories and videos, loaded the first time its News or Highlights is opened
  history: {}, // past seasons, keyed "bears-2005", loaded when picked
  historySeason: null, // season picked on Team History (null: most recent)
  seasonLeaders: {}, // a past season's team leaders, keyed like history, loaded with it
  seasonPlayers: {}, // everyone who played in a past season, loaded on Show all players
  pastStandings: {}, // past seasons' standings, keyed "NFL-2005", loaded when picked
  standingsSeason: null, // season picked on League Standings (null: current season)
  playoffsSeason: null, // season picked on Playoff Picture (null: current season)
  pastPlayoffs: {}, // past seasons' playoff games, keyed "MLB-2016", loaded when picked
  cups: {}, // cup tournaments (cups.js), keyed "nba", "leaguesCup", and "openCup", with "leaguesCupBracket" and "openCupBracket", each loaded the first time it's picked
  cupShown: "nba", // the cup picked on the Cups tab (cups-view.js); the NBA Cup, being played now
  openSeries: [], // bracket series whose games are shown (seriesKey in playoffs-view.js)
  lastUpdated: null,
  refreshing: false,
  calendarMessage: null, // confirmation shown after downloading a calendar
  notifyTeams: savedNotifyTeams(), // teams with final score notifications on (notify.js)
  notifyMessage: null, // what the last notifications tap did
  themeChoice: savedThemeChoice(), // "auto" | "light" | "dark", from theme.js
  lastGroupPages: {}, // the page last opened in each tab group (tabs.js), e.g. { history: "halloffame" }
  diagnosticsMessage: null, // what the last tap on the Diagnostics page did
};

// Load one piece of data into state[bucket][key], redrawing as it arrives.
async function load(bucket, key, fetchValue) {
  state[bucket][key] = { status: "loading" };
  try {
    state[bucket][key] = { status: "loaded", value: await fetchValue() };
  } catch (error) {
    recordProblem("ESPN", `Could not load ${bucket} for ${key}`, error);
    state[bucket][key] = { status: "error" };
  }
  render();
}

// A box score loads the first time its game is opened. key is "teamKey:gameId".
function loadBoxScore(key) {
  const [teamKey, gameId] = key.split(":");
  const favorite = FAVORITE_TEAMS.find((team) => team.key === teamKey);
  load("boxScores", key, () => fetchBoxScore(favorite, gameId));
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

// A past season's players load the first time it's picked on Stats, from
// its box scores (shared with Team History's Show all players).
function loadStatsSeasonIfNeeded() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  if (state.page !== "stats" || !favorite) return;
  const season = statsSeasonFor(favorite);
  const key = season && historyKey(favorite, season);
  if (!season || state.seasonPlayers[key]) return;
  load("seasonPlayers", key, async () => {
    const history = (state.history[key] && state.history[key].value) || (await fetchSeasonHistory(favorite, season));
    return fetchSeasonPlayers(favorite, [...history.regular, ...history.postseason]);
  });
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
  if (!state.seasonLeaders[key]) load("seasonLeaders", key, () => fetchSeasonLeaders(favorite, season));
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
  // Games as they were, so a game that ended since the last load still notifies.
  const gamesBefore = new Map(FAVORITE_TEAMS.map((favorite) => [favorite.key, loadState("games", favorite.key).value]));
  await Promise.all([
    ...LEAGUES.map((leagueInfo) => load("standings", leagueInfo.key, () => fetchLeagueStandings(leagueInfo))),
    ...FAVORITE_TEAMS.map((favorite) => load("games", favorite.key, () => fetchTeamGames(favorite))),
    ...FAVORITE_TEAMS.map((favorite) => load("injuries", favorite.key, () => fetchTeamInjuries(favorite))),
  ]);
  for (const favorite of FAVORITE_TEAMS) {
    const before = gamesBefore.get(favorite.key);
    const after = loadState("games", favorite.key);
    if (before && after.status === "loaded") {
      showFinalNotifications(favorite, before, after.value, state.notifyTeams, notificationPermission());
    }
  }
  state.refreshing = false;
  state.lastUpdated = new Date();
  render();
  updateLiveScores();
  loadCupsIfNeeded();
  loadForecastIfNeeded();
  loadTitleChances();
  loadWinChancesIfNeeded("all"); // on Refresh, recheck every win chance
}

// Each team's division, conference, and title chances where there are any
// (title-chances.js: NFL, NBA, and title odds for MLB and the WNBA), for
// the team cards, once the standings say which season it is. Reloaded on Refresh. Test settings skip them: the saved
// data doesn't include them.
async function loadTitleChances() {
  if (savedAnswerFor) return;
  // The NHL's are the app's own estimate, from its standings (nhl-estimate.js).
  const nhlStandings = loadState("standings", "NHL");
  if (nhlStandings.status === "loaded") titleChances.NHL = estimateNhlChances(nhlStandings.value);
  await loadSoccerOutlook();
  await Promise.all(
    Object.keys(TITLE_CHANCE_LEAGUES).map(async (leagueKey) => {
      const standingsState = loadState("standings", leagueKey);
      if (standingsState.status !== "loaded") return;
      try {
        titleChances[leagueKey] = await fetchTitleChances(leagueKey, standingsState.value.season.name);
      } catch (error) {
        recordProblem("ESPN", `Could not load the ${leagueKey} title chances`, error);
      }
    })
  );
  render();
}

// The picked cup (cups.js) loads the first time it's shown.
function loadCupsIfNeeded() {
  if (state.page !== "cups") return;
  // Test settings' saved data doesn't include the cups.
  if (savedAnswerFor) {
    if (state.cups.nba) return;
    state.cups.nba = { status: "loaded", value: { season: "", groups: [], notInTestSettings: true } };
    state.cups.leaguesCup = { status: "loaded", value: { season: "", tables: [], notInTestSettings: true } };
    state.cups.openCup = { status: "loaded", value: { season: "", games: [], notInTestSettings: true } };
    state.cups.leaguesCupBracket = { status: "loaded", value: Object.assign([], { notInTestSettings: true }) };
    state.cups.openCupBracket = state.cups.leaguesCupBracket;
    render();
    return;
  }
  if (state.cupShown === "leaguesCup") {
    if (!state.cups.leaguesCup) load("cups", "leaguesCup", fetchLeaguesCupStandings);
    if (!state.cups.leaguesCupBracket) load("cups", "leaguesCupBracket", () => fetchCupBracket(CUP_BRACKETS.leaguesCup));
    return;
  }
  if (state.cupShown === "openCup") {
    const fire = FAVORITE_TEAMS.find((team) => team.key === "fire");
    if (!state.cups.openCup) load("cups", "openCup", () => fetchOpenCupRun(fire));
    if (!state.cups.openCupBracket) load("cups", "openCupBracket", () => fetchCupBracket(CUP_BRACKETS.openCup));
    return;
  }
  if (!state.cups.nba) load("cups", "nba", () => fetchNbaCupGroups(nbaCupYear(new Date())));
}

// The Fire's and Stars' cards (mls-estimate.js): their league's playoff games
// (the same ones Playoff Picture shows) say whether a team's season is over,
// and for a team still in the MLS playoffs, the app's own estimate.
async function loadSoccerOutlook() {
  for (const favorite of FAVORITE_TEAMS.filter((team) => team.league === "MLS" || team.league === "NWSL")) {
    if (!state.playoffs[favorite.league]) await load("playoffs", favorite.league, () => fetchPlayoffs(leagueInfoFor(favorite.league), new Date()));
    const playoffState = loadState("playoffs", favorite.league);
    const standingsState = loadState("standings", favorite.league);
    if (playoffState.status !== "loaded" || standingsState.status !== "loaded") continue;
    const rounds = playoffState.value.rounds || [];
    const finalRound = rounds[rounds.length - 1];
    const finished = Boolean(playoffState.value.finished) || Boolean(finalRound && finalRound.series.length === 1 && finalRound.series[0].completed && /championship|final|cup/i.test(finalRound.name));
    const seasonOver = seasonOverText(favorite.abbreviation, rounds, finished);
    const estimate = !seasonOver && favorite.league === "MLS" ? estimateMlsChances(standingsState.value, rounds).get(favorite.abbreviation) : null;
    titleChances[favorite.league] = { seasonOver, estimate };
  }
}

// ESPN's win chances (predictor.js) load for games in the next week when
// Upcoming or Today is open. recheck (winChanceGamesToLoad) asks again for
// ones already loaded: "all" on Refresh, "blank" every hour. A chance being
// rechecked keeps showing until the new one arrives, and stays if that
// fails. Test settings skip them: the saved data doesn't include them.
async function loadWinChancesIfNeeded(recheck = "none") {
  if (savedAnswerFor) return;
  if (!(state.page === "today" || (state.page === "games" && state.gamesShown === "upcoming"))) {
    // Refresh elsewhere: forget them, so they load fresh when Upcoming or Today opens.
    if (recheck === "all") winChances.clear();
    return;
  }
  const allGames = FAVORITE_TEAMS.flatMap((favorite) => {
    const gamesState = loadState("games", favorite.key);
    return gamesState.status === "loaded" ? gamesState.value : [];
  });
  const games = winChanceGamesToLoad(allGames, winChances, new Date(), recheck);
  if (games.length === 0) return;
  for (const game of games) {
    if (!winChances.has(winChanceKey(game))) winChances.set(winChanceKey(game), { status: "loading" });
  }
  await Promise.all(
    games.map(async (game) => {
      const key = winChanceKey(game);
      try {
        winChances.set(key, { status: "loaded", value: await fetchWinChance(game) });
      } catch (error) {
        recordProblem("ESPN", `Could not load the win chances for game ${game.id}`, error);
        const before = winChances.get(key);
        if (!before || before.status !== "loaded") winChances.set(key, { status: "error" });
      }
    })
  );
  render();
}

// Chicago's weather forecast (forecast.js) loads once the games are in, and
// only when an outdoor home game is in the next 16 days. Test settings
// skip it: their saved data is ESPN's only.
async function loadForecastIfNeeded() {
  if (savedAnswerFor) return;
  const now = new Date();
  const anyGameNeedsIt = FAVORITE_TEAMS.some((favorite) => {
    const gamesState = loadState("games", favorite.key);
    return gamesState.status === "loaded" && gamesState.value.some((game) => needsForecast(game, now));
  });
  if (!anyGameNeedsIt) return;
  try {
    chicagoForecast = await fetchChicagoForecast();
  } catch (error) {
    recordProblem("Open-Meteo", "Could not load Chicago's weather forecast", error);
  }
  render();
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

// Where the app is, for the diagnostics log (diagnostics.js).
function currentPlaceForDiagnostics() {
  const team = FAVORITE_TEAMS.find((favorite) => favorite.key === state.selectedTeam);
  return { tab: pageLabel(state.page), team: team ? team.label : "All teams" };
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
  document.getElementById("footerTimeZone").textContent = timeZoneDescription();
  const page = document.getElementById("page");
  if (state.page === "today") page.innerHTML = todayPageHtml();
  else if (state.page === "games") page.innerHTML = gamesPageHtml();
  else if (state.page === "standings") page.innerHTML = standingsPageHtml();
  else if (state.page === "playoffs") page.innerHTML = playoffsPageHtml();
  else if (state.page === "rosters") page.innerHTML = rostersPageHtml();
  else if (state.page === "news") page.innerHTML = newsPageHtml();
  else if (state.page === "highlights") page.innerHTML = highlightsPageHtml();
  else if (state.page === "history") page.innerHTML = historyPageHtml();
  else if (state.page === "championships") page.innerHTML = championshipsPageHtml();
  else if (state.page === "stadiums") page.innerHTML = stadiumsPageHtml();
  else if (state.page === "uniforms") page.innerHTML = uniformsPageHtml();
  else if (state.page === "mascots") page.innerHTML = mascotsPageHtml();
  else if (state.page === "rivals") page.innerHTML = rivalsPageHtml();
  else if (state.page === "retired") page.innerHTML = retiredNumbersPageHtml();
  else if (state.page === "halloffame") page.innerHTML = hallOfFamePageHtml();
  else if (state.page === "leaders") page.innerHTML = allTimeLeadersPageHtml();
  else if (state.page === "coaches") page.innerHTML = coachHistoryPageHtml();
  else if (state.page === "drafts") page.innerHTML = draftPicksPageHtml();
  else if (state.page === "funfacts") page.innerHTML = funFactsPageHtml();
  else if (state.page === "social") page.innerHTML = socialsPageHtml();
  else if (state.page === "stats") page.innerHTML = careerStatsPageHtml();
  else if (state.page === "cups") page.innerHTML = cupsPageHtml(state.cupShown, { nba: loadState("cups", "nba"), leaguesCup: loadState("cups", "leaguesCup"), openCup: loadState("cups", "openCup"), leaguesCupBracket: loadState("cups", "leaguesCupBracket"), openCupBracket: loadState("cups", "openCupBracket") });
  else if (state.page === "settings") page.innerHTML = settingsPageHtml(notifyPanelHtml(state.notifyTeams, notificationPermission(), state.notifyMessage));
  else if (state.page === "diagnostics") page.innerHTML = diagnosticsPageHtml(readDiagnostics(), state.diagnosticsMessage);
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
      const chances = titleChancesLines(favorite);
      body = `
        <div class="card-record">${escapeHtml(standing.team.record)}</div>
        <div class="card-detail">
          ${place}
          <br><span class="card-season">${escapeHtml(standings.season.name)} ${escapeHtml(standings.season.type)}</span>
        </div>
        ${chances ? `<div class="card-chances" title="ESPN's projections">${chances.map(escapeHtml).join("<br>")}</div>` : ""}`;
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
  document.getElementById("pageTabs").innerHTML = mainTabsHtml(state.page);
  const subTabs = document.getElementById("subTabs");
  subTabs.innerHTML = subTabsHtml(state.page);
  subTabs.hidden = !groupForPage(state.page);
  // Redrawing a row scrolls it back to its start, which on a phone can hide
  // the selected tab, so center it again.
  for (const row of [document.getElementById("pageTabs"), subTabs]) {
    const active = row.querySelector(".active");
    if (active) row.scrollLeft = active.offsetLeft - row.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
  }
}

function renderThemeToggle() {
  const labels = { auto: "Auto", light: "Light", dark: "Dark" };
  document.getElementById("themeToggle").innerHTML = THEME_CHOICES.map((choice) =>
    toggleButtonHtml("theme", "choice", choice, labels[choice], state.themeChoice)
  ).join("");
}

// Drawn once, not on every render, so a live score update can't close the
// dropdown while someone is choosing.
function renderColorsPicker() {
  const labels = { classic: "Classic" };
  for (const team of FAVORITE_TEAMS) labels[team.key] = team.label;
  const picker = document.getElementById("colorsPicker");
  picker.innerHTML = COLOR_CHOICES.map((choice) => `<option value="${choice}">${labels[choice]}</option>`).join("");
  picker.value = savedColorChoice();
}

function renderUpdatedAt() {
  document.getElementById("updatedAt").textContent = state.lastUpdated
    ? `Updated ${displayDate(state.lastUpdated, { hour: "numeric", minute: "2-digit" })}`
    : "Loading live data…";
  const refreshButton = document.getElementById("refreshButton");
  refreshButton.disabled = state.refreshing;
  refreshButton.textContent = state.refreshing ? "Refreshing…" : "Refresh";
}

// "All teams" plus one button per team; used by the Games and Injuries tabs.
function teamFilterHtml() {
  const options = [{ key: "all", label: "All teams", color: ALL_TEAMS_COLOR }, ...FAVORITE_TEAMS];
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
    state.diagnosticsMessage = null;
    const group = groupForPage(state.page);
    if (group) state.lastGroupPages[group.key] = state.page;
  },
  "page-group": (button) => {
    state.page = pageForGroup(button.dataset.group, state.lastGroupPages);
  },
  "games-shown": (button) => {
    state.gamesShown = button.dataset.shown;
  },
  "box-score": (button) => {
    const key = button.dataset.game;
    const isOpen = state.openBoxScores.includes(key);
    state.openBoxScores = isOpen ? state.openBoxScores.filter((open) => open !== key) : [...state.openBoxScores, key];
    if (!isOpen && !state.boxScores[key]) loadBoxScore(key);
  },
  "box-score-retry": (button) => {
    loadBoxScore(button.dataset.game);
  },
  "notify-team": async (button) => {
    const favorite = FAVORITE_TEAMS.find((team) => team.key === button.dataset.team);
    const { notifyTeams, message } = await toggleNotifyTeam(state.notifyTeams, favorite);
    state.notifyTeams = notifyTeams;
    state.notifyMessage = message;
    saveNotifyTeams(notifyTeams);
    render();
  },
  "notify-all": async () => {
    const { notifyTeams, message } = await toggleNotifyAllTeams(state.notifyTeams);
    state.notifyTeams = notifyTeams;
    state.notifyMessage = message;
    saveNotifyTeams(notifyTeams);
    render();
  },
  cup: (button) => {
    state.cupShown = button.dataset.cup;
  },
  "time-zone": (button) => {
    timeZoneChoice = button.dataset.zone;
    saveTimeZoneChoice(timeZoneChoice);
  },
  "clear-diagnostics": () => {
    saveDiagnostics([]);
    state.diagnosticsMessage = "Log cleared.";
  },
  "all-finals": () => {
    state.allFinals = !state.allFinals;
  },
  league: (button) => {
    state.selectedLeague = button.dataset.league;
  },
  theme: (button) => {
    state.themeChoice = button.dataset.choice;
    saveThemeChoice(state.themeChoice);
    applyTheme(state.themeChoice);
  },
  "season-players": () => {
    // Everyone who played in the Team History season on screen, from its games.
    const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
    const key = historyKey(favorite, historySeasonFor(favorite));
    const { regular, postseason } = state.history[key].value;
    load("seasonPlayers", key, () => fetchSeasonPlayers(favorite, [...regular, ...postseason]));
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
  // Season pickers also carry a data-action, but they act on "change" (below).
  if (!button || !ACTIONS[button.dataset.action]) return;
  if (button.dataset.action !== "download-calendar") state.calendarMessage = null;
  ACTIONS[button.dataset.action](button);
  loadPlayoffsIfNeeded();
  loadRosterIfNeeded();
  loadCareerStatsIfNeeded();
  loadNewsIfNeeded();
  loadWinChancesIfNeeded();
  loadCupsIfNeeded();
  loadHistoryIfNeeded();
  loadPastStandingsIfNeeded();
  loadPastPlayoffsIfNeeded();
  loadInjuryHistoryIfNeeded();
  loadStatsSeasonIfNeeded();
  render();
});

// The season pickers on Team History, League Standings, Playoff Picture, and Stats.
document.addEventListener("change", (event) => {
  const action = event.target.dataset.action;
  if (action === "colors") {
    saveColorChoice(event.target.value);
    applyColors(event.target.value);
    return;
  }
  if (action === "history-season") {
    state.historySeason = Number(event.target.value);
    loadHistoryIfNeeded();
  } else if (action === "standings-season") {
    state.standingsSeason = event.target.value ? Number(event.target.value) : null;
    loadPastStandingsIfNeeded();
  } else if (action === "stats-season") {
    state.statsSeason = event.target.value ? Number(event.target.value) : null;
    state.statsPlayer = null;
    loadStatsSeasonIfNeeded();
  } else if (action === "playoffs-season") {
    state.playoffsSeason = event.target.value ? Number(event.target.value) : null;
    loadPastPlayoffsIfNeeded();
  } else {
    return;
  }
  render();
});

// A banner at the top while the app runs on saved data, so saved scores
// are never mistaken for live ones. When saved data was asked for but isn't
// here (the live site), the app shows live data with no banner; the miss is
// on the Diagnostics page.
function showTestSettingsBanner(mode) {
  if (mode !== "saved") return;
  const banner = document.createElement("div");
  banner.className = "test-banner";
  banner.setAttribute("role", "status");
  banner.textContent = savedDataDescription(SAVED_ESPN_ANSWERS_DATE);
  document.body.prepend(banner);
}

timeZoneChoice = savedTimeZoneChoice();
// Upcoming games show each team's season so far from the loaded standings (games-view.js).
standingsForLeague = (leagueKey) => {
  const standingsState = loadState("standings", leagueKey);
  return standingsState.status === "loaded" ? standingsState.value : null;
};
renderColorsPicker();
loadTestSettings().then((mode) => {
  showTestSettingsBanner(mode);
  loadEverything();
});
// Keep live scores current; this loads nothing while no game is on.
setInterval(updateLiveScores, LIVE_CHECK_SECONDS * 1000);
// Fill in win chances posted since the last check (sportsbooks post odds a day or two ahead).
setInterval(() => loadWinChancesIfNeeded("blank"), WIN_CHANCE_RECHECK_MINUTES * 60 * 1000);
// In Auto, follow the device when it switches between light and dark.
systemDarkQuery.addEventListener("change", () => {
  applyTheme(state.themeChoice);
  render();
});
