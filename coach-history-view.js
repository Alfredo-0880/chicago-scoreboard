// Draws the Coaches tab: each team's head coaches (managers in baseball),
// newest first, with years, regular-season record, and titles.

const COACHES_SHOWN = 12;

function coachHistoryPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => coachHistoryCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's head coaches, newest first. Copied from Wikipedia (ESPN doesn't keep past coaches).</div>
    <div class="uniform-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters. Long lists show the
// newest COACHES_SHOWN and fold the rest away.
function coachHistoryCardHtml(favorite, logos) {
  const { coaches, recordStyle, note } = teamCoachHistory(favorite);
  const title = leagueInfoFor(favorite.league).sport === "baseball" ? "Managers" : "Head coaches";
  const newest = coaches.slice(0, COACHES_SHOWN).map(coachRowHtml).join("");
  const older = coaches.slice(COACHES_SHOWN);
  const rest = older.length
    ? `<details class="coach-more">
         <summary>Show all ${coaches.length}</summary>
         <ol class="coach-list">${older.map(coachRowHtml).join("")}</ol>
       </details>`
    : "";
  const notes = [recordStyle && `Records are ${recordStyle}.`, note].filter(Boolean);
  return `
    <section class="uniform-card" style="--team-color:${favorite.color}">
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
      </div>
      <h3 class="hof-group">${title} (${coaches.length})</h3>
      <ol class="coach-list">${newest}</ol>
      ${rest}
      ${notes.map((text) => `<p class="uniform-note">${escapeHtml(text)}</p>`).join("")}
    </section>`;
}

function coachRowHtml(coach) {
  const details = [coach.years, coach.interim && "Interim", coach.titles, coach.note].filter(Boolean);
  return `
    <li class="coach-row">
      <span class="leader-player">
        <span class="hof-name">${escapeHtml(coach.name)}</span>
        <span class="retired-details">${details.map(escapeHtml).join(" · ")}</span>
      </span>
      ${coach.record ? `<span class="leader-value">${coach.record}</span>` : ""}
    </li>`;
}
