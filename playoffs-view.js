// Draws the Playoff Picture tab. Buttons pick the view:
// - Bracket: round by round, during a league's postseason.
// - Playoff Race: the seeds, "if the season ended today" during the season,
//   or how it ended once the postseason starts.
// - Wild Card (Play-In in the NBA, Playoff Race in the WNBA): who's chasing
//   the last spots, and the cutoff line.
// MLS and the NWSL get no Wild Card button (Alfredo's choice). No league
// gets two buttons with the same name, so in its postseason the WNBA shows
// Bracket and its race (Alfredo's choice), not its seeds.

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

function playoffsPageHtml() {
  const leagueKey = state.selectedLeague;
  const playoffState = loadState("playoffs", leagueKey);
  const inPostseason = playoffState.status === "loaded" && playoffState.value.inPostseason;
  const buttons = playoffViewButtons(leagueKey, inPostseason);
  // A view this league doesn't have (Wild Card picked in the NFL, then MLS
  // chosen) falls back to the league's first button.
  const view = buttons.some(([key]) => key === state.playoffsView) ? state.playoffsView : buttons[0][0];
  return `
    <div class="controls">
      <div class="league-tabs" role="tablist" aria-label="League">${leagueTabsHtml()}</div>
      <div class="toggle" role="group" aria-label="Playoff view">
        ${buttons.map(([key, label]) => toggleButtonHtml("playoffs-view", "view", key, label, view)).join("")}
      </div>
    </div>
    ${playoffViewHtml(leagueKey, view, inPostseason)}`;
}

function playoffViewHtml(leagueKey, view, inPostseason) {
  if (view === "race") return wildCardHtml(leagueKey, loadState("standings", leagueKey));
  if (view === "seeds") return standingsOrMessage(leagueKey, (standings) => seedsHtml(standings, inPostseason));
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
    return bracketHtml(leagueKey, playoffState.value.rounds);
  }
  return standingsOrMessage(leagueKey, (standings) => seedsHtml(standings, false));
}

// Postseason: each round, oldest first, with each series' teams and wins.
function bracketHtml(leagueKey, rounds) {
  if (rounds.length === 0) {
    return `<div class="message">The ${leagueKey} postseason has started, but ESPN hasn't listed any games yet.</div>`;
  }
  const chicagoTeams = favoriteAbbreviations(leagueKey);
  const roundsHtml = rounds
    .map(
      (round) => `
      <section class="division">
        <h2 class="division-title">${escapeHtml(round.name)}</h2>
        ${round.series.map((series) => seriesHtml(series, chicagoTeams)).join("")}
      </section>`
    )
    .join("");
  return `<div class="season-note">${leagueKey} postseason, live from ESPN. Rounds go from first to latest.</div>${roundsHtml}`;
}

function seriesHtml(series, chicagoTeams) {
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
  return `
    <div class="series">
      ${series.teams.map(teamRow).join("")}
      <div class="series-summary">${escapeHtml(series.summary)}</div>
    </div>`;
}

// Who's in if the season ended today, then who's chasing. Once the
// postseason starts (seasonOver), the same seeds show how the season ended.
function seedsHtml(standings, seasonOver) {
  const chicagoTeams = favoriteAbbreviations(standings.league);
  const showPoints = leagueInfoFor(standings.league).rankedByPoints;
  const groups = playoffPicture(standings).map((group) => {
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
    <div class="season-note">${
      seasonOver
        ? `How the ${escapeHtml(standings.season.name)} regular season ended, from ESPN's final standings.`
        : `If the ${escapeHtml(standings.season.name)} season ended today. ${escapeHtml(standings.season.type)} standings, live from ESPN.`
    }</div>
    ${groups.join("")}`;
}
