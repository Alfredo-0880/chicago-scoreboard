// Draws the Playoff Picture tab. Buttons pick the view:
// - Bracket: round by round, during a league's postseason.
// - Playoff Race: the seeds, "if the season ended today" during the season,
//   or how it ended once the postseason starts.
// - Wild Card (Play-In in the NBA, Playoff Race in the WNBA): who's chasing
//   the last spots, and the cutoff line.
// MLS and the NWSL get no Wild Card button (Alfredo's choice). No league
// gets two buttons with the same name, so in its postseason the WNBA shows
// Bracket and its race (Alfredo's choice), not its seeds.
// A Season picker shows past seasons the same way (see "Past seasons" in
// playoffs.js for what ESPN has from those years).

const RACE_BUTTON_LABELS = { NBA: "Play-In", WNBA: "Playoff Race" };
const LEAGUES_WITHOUT_RACE_BUTTON = ["MLS", "NWSL"];

// The league's view buttons as [view, label] pairs.
function playoffViewButtons(leagueKey, inPostseason) {
  const buttons = inPostseason ? [["bracket", "Bracket"]] : [];
  const raceLabel = RACE_BUTTON_LABELS[leagueKey] || "Wild Card";
  const hasRace = !LEAGUES_WITHOUT_RACE_BUTTON.includes(leagueKey);
  // MLS and NWSL keep one button: Bracket in their postseason, seeds otherwise.
  if (!(inPostseason && (!hasRace || raceLabel === "Playoff Race"))) buttons.push(["seeds", "Playoff Race"]);
  if (hasRace && !buttons.some(([, label]) => label === raceLabel)) buttons.push(["race", raceLabel]);
  return buttons;
}

// A past season's buttons: Bracket where ESPN has past playoff games,
// Playoff Race, and Wild Card where that season had one (pastRaceSource).
function pastPlayoffViewButtons(leagueKey, season) {
  const buttons = hasPastBracket(leagueKey) ? [["bracket", "Bracket"]] : [];
  buttons.push(["seeds", "Playoff Race"]);
  const raceLabel = RACE_BUTTON_LABELS[leagueKey] || "Wild Card";
  if (pastRaceSource(leagueKey, season) && !buttons.some(([, label]) => label === raceLabel)) buttons.push(["race", raceLabel]);
  return buttons;
}

function playoffsPageHtml() {
  const leagueKey = state.selectedLeague;
  const season = playoffsSeasonFor(leagueKey);
  const playoffState = loadState("playoffs", leagueKey);
  const inPostseason = playoffState.status === "loaded" && playoffState.value.inPostseason;
  const buttons = season ? pastPlayoffViewButtons(leagueKey, season) : playoffViewButtons(leagueKey, inPostseason);
  // A view this league doesn't have (Wild Card picked in the NFL, then MLS
  // chosen) falls back to the league's first button.
  const view = buttons.some(([key]) => key === state.playoffsView) ? state.playoffsView : buttons[0][0];
  const options = [
    `<option value="">Current season</option>`,
    ...pastStandingsSeasons(leagueKey, new Date()).map(
      (year) => `<option value="${year}" ${year === season ? "selected" : ""}>${seasonLabel({ league: leagueKey }, year)}</option>`
    ),
  ].join("");
  return `
    <div class="controls">
      <div class="league-tabs" role="tablist" aria-label="League">${leagueTabsHtml()}</div>
      <label class="season-picker">Season
        <select data-action="playoffs-season" aria-label="Season">${options}</select>
      </label>
      <div class="toggle" role="group" aria-label="Playoff view">
        ${buttons.map(([key, label]) => toggleButtonHtml("playoffs-view", "view", key, label, view)).join("")}
      </div>
    </div>
    ${season ? pastPlayoffViewHtml(leagueKey, season, view) : playoffViewHtml(leagueKey, view, inPostseason)}`;
}

// The past season picked for this league, or null for the current season.
function playoffsSeasonFor(leagueKey) {
  return pastStandingsSeasons(leagueKey, new Date()).includes(state.playoffsSeason) ? state.playoffsSeason : null;
}

function pastPlayoffViewHtml(leagueKey, season, view) {
  const key = pastStandingsKey(leagueKey, season);
  const label = seasonLabel({ league: leagueKey }, season);
  if (view === "bracket") {
    const playoffState = loadState("pastPlayoffs", key);
    if (playoffState.status === "loading") return `<div class="message">Loading the ${label} ${leagueKey} playoffs…</div>`;
    if (playoffState.status === "error") return errorMessageHtml(`Couldn't load the ${label} ${leagueKey} playoffs`);
    return playoffState.value.rounds.length === 0
      ? `<div class="message">ESPN has no ${label} ${leagueKey} playoff games.</div>`
      : bracketHtml(leagueKey, playoffState.value.rounds, { note: `${label} ${leagueKey} playoffs, from ESPN. Rounds go from first to last.`, openSeries: state.openSeries });
  }
  const standingsState = loadState("pastStandings", key);
  if (standingsState.status === "loading") return `<div class="message">Loading ${label} ${leagueKey} standings…</div>`;
  if (standingsState.status === "error") return errorMessageHtml(`Couldn't load ${label} ${leagueKey} standings`);
  const standings = standingsState.value;
  if (view === "race") {
    const races = pastRaceSource(leagueKey, season) === "clinches" ? pastWildCardRaces(standings, season) : wildCardRaces(standings);
    return `<div class="season-note">The ${label} wild card race, from ESPN's final standings.</div>${races
      .map((race) => standingsTableHtml(race.title, race.teams, standings.league, race))
      .join("")}`;
  }
  const groups = pastPlayoffPicture(standings, season);
  if (groups.length === 0) {
    return `<div class="message">ESPN doesn't mark which teams made the ${label} ${leagueKey} playoffs. League Standings has that season's final table.</div>`;
  }
  return seedsHtml(standings, groups, `Who made the ${label} playoffs, from ESPN's final standings.`);
}

function playoffViewHtml(leagueKey, view, inPostseason) {
  if (view === "race") return wildCardHtml(leagueKey, loadState("standings", leagueKey));
  if (view === "seeds") return standingsOrMessage(leagueKey, (standings) => currentSeedsHtml(standings, inPostseason));
  return playoffsBodyHtml(leagueKey);
}

// Draws something from the league's standings, or says they're loading or failed.
function standingsOrMessage(leagueKey, draw) {
  const standingsState = loadState("standings", leagueKey);
  if (standingsState.status === "loading") {
    return `<div class="message">Loading ${leagueKey} standings…</div>`;
  }
  if (standingsState.status === "error") {
    return errorMessageHtml(`Couldn't load ${leagueKey} standings`);
  }
  return draw(standingsState.value);
}

// The race for the last playoff spots, from the league's standings, with a
// dashed line under the last team that gets in.
function wildCardHtml(leagueKey, standingsState) {
  if (standingsState.status === "loading") {
    return `<div class="message">Loading ${leagueKey} standings…</div>`;
  }
  if (standingsState.status === "error") {
    return errorMessageHtml(`Couldn't load ${leagueKey} standings`);
  }
  const standings = standingsState.value;
  const races = wildCardRaces(standings).map((race) => standingsTableHtml(race.title, race.teams, standings.league, race));
  return `<div class="season-note">${escapeHtml(standings.season.name)} ${escapeHtml(standings.season.type)} standings, live from ESPN</div>${races.join("")}`;
}

function playoffsBodyHtml(leagueKey) {
  const playoffState = loadState("playoffs", leagueKey);
  if (playoffState.status === "loading") {
    return `<div class="message">Loading the ${leagueKey} playoff picture…</div>`;
  }
  if (playoffState.status === "error") {
    return errorMessageHtml(`Couldn't load the ${leagueKey} playoff picture`);
  }
  if (playoffState.value.inPostseason) {
    return bracketHtml(leagueKey, playoffState.value.rounds, { openSeries: state.openSeries });
  }
  return standingsOrMessage(leagueKey, (standings) => currentSeedsHtml(standings, false));
}

// Postseason: each round, oldest first, with each series' teams and wins.
// note: the line above the rounds (a past season names its year).
// openSeries: the seriesKey of each series whose games are shown.
function bracketHtml(leagueKey, rounds, { note = `${leagueKey} postseason, live from ESPN. Rounds go from first to latest.`, openSeries = [] } = {}) {
  if (rounds.length === 0) {
    return `<div class="message">The ${leagueKey} postseason has started, but ESPN hasn't listed any games yet.</div>`;
  }
  const chicagoTeams = favoriteAbbreviations(leagueKey);
  const roundsHtml = rounds
    .map(
      (round) => `
      <section class="division">
        <h2 class="division-title">${escapeHtml(round.name)}</h2>
        ${round.series.map((series) => seriesHtml(series, chicagoTeams, round.name, openSeries)).join("")}
      </section>`
    )
    .join("");
  return `<div class="season-note">${escapeHtml(note)}</div>${roundsHtml}`;
}

// Names a series for opening its games: "World Series CHC-CLE 2016-10-25".
function seriesKey(roundName, series) {
  const teams = series.teams.map((team) => team.abbreviation).sort().join("-");
  return `${roundName} ${teams} ${series.start.toISOString().slice(0, 10)}`;
}

function seriesHtml(series, chicagoTeams, roundName, openSeries) {
  const teamRow = (team) => {
    const classes = [
      "series-team",
      series.winner === team ? "winner" : "",
      series.winner && series.winner !== team ? "eliminated" : "",
      chicagoTeams.includes(team.abbreviation) ? "favorite" : "",
    ].join(" ");
    return `
      <div class="${classes}">
        <span class="team-name">${logoHtml(team.logos, team.abbreviation, "logo-small")}${escapeHtml(team.name)}</span>
        <span class="series-wins">${team.wins}</span>
      </div>`;
  };
  // A one-game round (most NFL playoff games) has no games to list: the
  // score above is the whole story.
  if (series.games.length < 2) {
    return `
      <div class="series">
        ${series.teams.map(teamRow).join("")}
        <div class="series-summary">${escapeHtml(series.summary)}</div>
      </div>`;
  }
  const key = seriesKey(roundName, series);
  const isOpen = openSeries.includes(key);
  return `
    <div class="series">
      ${series.teams.map(teamRow).join("")}
      <div class="series-summary">
        ${escapeHtml(series.summary)}
        <button class="series-games-toggle" data-action="series-games" data-series="${escapeHtml(key)}" aria-expanded="${isOpen}">
          ${isOpen ? "Hide" : "Show"} ${series.games.length} games ${isOpen ? "▾" : "▸"}
        </button>
      </div>
      ${isOpen ? `<ol class="series-games">${series.games.map(seriesGameHtml).join("")}</ol>` : ""}
    </div>`;
}

// "Game 7 · Wed, Nov 2 · Cubs 8 @ Indians 7 · Final/10", with the winner in
// bold. A game not played yet shows its start time instead of scores.
function seriesGameHtml(game) {
  const when = game.date
    ? chicagoDate(game.date, game.completed ? { weekday: "short", month: "short", day: "numeric" } : { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "";
  const side = (team) => {
    const text = `${escapeHtml(team.name)}${game.completed && team.score !== null ? ` ${escapeHtml(team.score)}` : ""}`;
    return team.winner ? `<strong>${text}</strong>` : text;
  };
  const detail = game.completed && game.detail && game.detail !== "Final" ? ` · ${escapeHtml(game.detail)}` : "";
  return `
    <li class="series-game">
      <span class="series-game-number">Game ${game.number}</span>
      ${when ? `<span class="series-game-date">${escapeHtml(when)}</span>` : ""}
      <span class="series-game-score">${side(game.away)} @ ${side(game.home)}${detail}</span>
    </li>`;
}

// Who's in if the season ended today, then who's chasing. Once the
// postseason starts (seasonOver), the same seeds show how the season ended.
function currentSeedsHtml(standings, seasonOver) {
  const note = seasonOver
    ? `How the ${escapeHtml(standings.season.name)} regular season ended, from ESPN's final standings.`
    : `If the ${escapeHtml(standings.season.name)} season ended today. ${escapeHtml(standings.season.type)} standings, live from ESPN.`;
  return seedsHtml(standings, playoffPicture(standings), note);
}

// groups: from playoffPicture or pastPlayoffPicture. note is already escaped.
function seedsHtml(standings, pictureGroups, note) {
  const chicagoTeams = favoriteAbbreviations(standings.league);
  const showPoints = leagueInfoFor(standings.league).rankedByPoints;
  const groups = pictureGroups.map((group) => {
    const rows = group.entries.map((entry, index) => {
      const isIn = entry.status !== "out";
      const row = `
        <tr class="${chicagoTeams.includes(entry.team.abbreviation) ? "favorite" : ""} ${isIn ? "" : "outside"}">
          <td class="seed">${isIn ? index + 1 : ""}</td>
          <td><span class="team-name">${logoHtml(entry.team.logos, entry.team.abbreviation, "logo-small")}${escapeHtml(entry.team.name)}</span></td>
          <td>${escapeHtml(entry.team.record)}${showPoints ? ` · ${entry.team.points} pts` : ""}</td>
          <td><span class="picture-status ${entry.status.replace(" ", "-")}">${escapeHtml(entry.label)}</span></td>
        </tr>`;
      const line =
        index === group.spotsIn - 1 && index < group.entries.length - 1
          ? `<tr class="cutoff"><td colspan="4"><span>${escapeHtml(group.lineLabel)}</span></td></tr>`
          : "";
      return row + line;
    });
    return `
      <section class="division">
        <h2 class="division-title">${escapeHtml(group.title)}</h2>
        <table class="standings-table picture-table">
          <thead><tr><th>Seed</th><th>Team</th><th>Record</th><th></th></tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
      </section>`;
  });
  return `
    <div class="season-note">${note}</div>
    ${groups.join("")}`;
}
