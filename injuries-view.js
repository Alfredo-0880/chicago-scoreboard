// Draws the Injuries tab: each selected team's current injury report.

function injuriesPageHtml() {
  const blocks = selectedFavorites().map(injuryBlockHtml).join("");
  return `
    ${teamFilterHtml()}
    ${blocks}
    <div class="season-note">Injury reports live from ESPN. Return dates are estimates.</div>`;
}

function injuryBlockHtml(favorite) {
  const injuryState = loadState("injuries", favorite.key);
  let body;
  if (injuryState.status === "loading") {
    body = `<p class="injury-empty">Loading…</p>`;
  } else if (injuryState.status === "error") {
    body = `<p class="injury-empty">Couldn't load this injury report. Try Refresh.</p>`;
  } else if (injuryState.value.length === 0) {
    body = `<p class="injury-empty">No injuries reported.</p>`;
  } else {
    body = injuryState.value.map(injuryRowHtml).join("");
  }

  return `
    <section class="injury-team" style="--team-color:${favorite.color}">
      <h2 class="injury-team-name"><span class="card-badge">${initials(favorite.label)}</span>${favorite.label}</h2>
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
