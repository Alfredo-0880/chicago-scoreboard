// Draws the Playoff Picture tab. Two buttons pick the view:
// - "If It Ended Today" seeds during a league's season, or a round-by-round
//   Bracket during its postseason.
// - The wild card race (called Play-In in the NBA, Playoff Race in leagues
//   without wild cards): who's in, who's chasing, and the cutoff line.

// What each league calls the race for the last playoff spots.
const RACE_BUTTON_LABELS = { NBA: "Play-In", WNBA: "Playoff Race", MLS: "Playoff Race", NWSL: "Playoff Race" };

function raceLabel(leagueKey) {
  return RACE_BUTTON_LABELS[leagueKey] || "Wild Card";
}

function playoffsPageHtml() {
  const leagueKey = state.selectedLeague;
  const playoffState = loadState("playoffs", leagueKey);
  const inPostseason = playoffState.status === "loaded" && playoffState.value.inPostseason;
  const standingsState = loadState("standings", leagueKey);
  return `
    <div class="controls">
      <div class="league-tabs" role="tablist" aria-label="League">${leagueTabsHtml()}</div>
      <div class="toggle" role="group" aria-label="Playoff view">
        ${toggleButtonHtml("playoffs-view", "view", "picture", inPostseason ? "Bracket" : "If It Ended Today", state.playoffsView)}
        ${toggleButtonHtml("playoffs-view", "view", "race", raceLabel(leagueKey), state.playoffsView)}
      </div>
    </div>
    ${state.playoffsView === "race" ? wildCardHtml(leagueKey, standingsState) : playoffsBodyHtml(leagueKey)}`;
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

  const standingsState = loadState("standings", leagueKey);
  if (standingsState.status === "loading") {
    return `<div class="message">Loading ${leagueKey} standings…</div>`;
  }
  if (standingsState.status === "error") {
    return errorMessageHtml(`Couldn't load ${leagueKey} standings`);
  }
  return seedsHtml(standingsState.value);
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

// Regular season: who's in if the season ended today, then who's chasing.
function seedsHtml(standings) {
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
    <div class="season-note">If the ${escapeHtml(standings.season.name)} season ended today. ${escapeHtml(standings.season.type)} standings, live from ESPN.</div>
    ${groups.join("")}`;
}
