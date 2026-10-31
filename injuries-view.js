// Draws the Injuries tab: each selected team's current injury report, and
// with one team picked, its recent history of injury updates.

function injuriesPageHtml() {
  const blocks = selectedFavorites().map(injuryBlockHtml).join("");
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  const history = favorite
    ? injuryHistoryHtml(favorite, loadState("injuryHistory", favorite.key))
    : `<div class="season-note">Tap a team name to see its recent injury history too.</div>`;
  return `
    ${teamFilterHtml()}
    ${blocks}
    ${history}
    <div class="season-note">Injury reports live from ESPN. Return dates are estimates.</div>`;
}

// Every update ESPN still has, newest first: "Oct 31, 2026 · Name · Status".
function injuryHistoryHtml(favorite, historyState) {
  let body;
  if (historyState.status === "loading") {
    body = `<p class="injury-empty">Loading the ${favorite.label}' injury history…</p>`;
  } else if (historyState.status === "error") {
    body = `<p class="injury-empty">Couldn't load the injury history. Try Refresh.</p>`;
  } else if (historyState.value === null) {
    return "";
  } else if (historyState.value.length === 0) {
    body = `<p class="injury-empty">ESPN has no recent injury updates for the ${favorite.label}.</p>`;
  } else {
    const oldest = historyState.value.at(-1).date;
    body = `
      <p class="injury-history-note">${historyState.value.length} ${historyState.value.length === 1 ? "update" : "updates"} from ESPN, back to ${escapeHtml(chicagoDate(oldest, { month: "long", year: "numeric" }))}. ESPN doesn't keep older injury reports.</p>
      <ol class="injury-history">${historyState.value.map(injuryUpdateHtml).join("")}</ol>`;
  }
  return `
    <section class="injury-team" style="--team-color:${favorite.color}">
      <h2 class="injury-team-name">Recent history</h2>
      ${body}
    </section>`;
}

function injuryUpdateHtml(update) {
  const facts = [update.injury, update.returnDate && `Est. return ${chicagoDate(update.returnDate, { month: "short", day: "numeric" })}`].filter(Boolean);
  return `
    <li class="injury-update">
      <span class="injury-update-date">${escapeHtml(chicagoDate(update.date, { month: "short", day: "numeric", year: "numeric" }))}</span>
      <span class="player">${escapeHtml(update.player)}</span>
      <span class="status-badge ${update.severity}">${escapeHtml(update.status)}</span>
      ${facts.length ? `<span class="injury-facts">${escapeHtml(facts.join(" · "))}</span>` : ""}
    </li>`;
}

function injuryBlockHtml(favorite) {
  const injuryState = loadState("injuries", favorite.key);
  let body;
  if (injuryState.status === "loading") {
    body = `<p class="injury-empty">Loading…</p>`;
  } else if (injuryState.status === "error") {
    body = `<p class="injury-empty">Couldn't load this injury report. Try Refresh.</p>`;
  } else if (injuryState.value === null) {
    body = `<p class="injury-empty">ESPN doesn't publish injury reports for ${favorite.league}.</p>`;
  } else if (injuryState.value.length === 0) {
    body = `<p class="injury-empty">No injuries reported.</p>`;
  } else {
    body = injuryState.value.map(injuryRowHtml).join("");
  }

  return `
    <section class="injury-team" style="--team-color:${favorite.color}">
      <h2 class="injury-team-name">${logoHtml(chicagoTeamLogos(favorite), initials(favorite.label), "logo-heading")}${favorite.label}</h2>
      ${body}
    </section>`;
}

function injuryRowHtml(injury) {
  const facts = [
    injury.injury,
    injury.returnDate && `Est. return ${chicagoDate(injury.returnDate, { month: "short", day: "numeric" })}`,
  ].filter(Boolean);

  return `
    <div class="injury ${injury.severity}">
      <div>
        <span class="player">${escapeHtml(injury.player)}</span>
        <span class="position">${escapeHtml(injury.position)}</span>
        ${facts.length ? `<div class="injury-facts">${escapeHtml(facts.join(" · "))}</div>` : ""}
        ${injury.comment ? `<div class="injury-comment">${escapeHtml(injury.comment)}</div>` : ""}
      </div>
      <span class="status-badge ${injury.severity}">${escapeHtml(injury.status)}</span>
    </div>`;
}
