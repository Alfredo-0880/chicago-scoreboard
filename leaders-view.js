// Draws the All-Time Leaders tab: each team's career leaders in a few key
// stats, with the top 5 where Wikipedia lists them.

function allTimeLeadersPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => allTimeLeadersCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's career leaders. Copied from Wikipedia (ESPN doesn't keep franchise records), so active players' totals can lag.</div>
    <div class="uniform-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters.
function allTimeLeadersCardHtml(favorite, logos) {
  const { categories, onlyLeader, note } = teamAllTimeLeaders(favorite);
  const notes = [onlyLeader && "Wikipedia lists only the leader in each category.", note].filter(Boolean);
  const body = categories.length
    ? `<div class="leader-grid">${categories.map(leaderCategoryHtml).join("")}</div>
       ${notes.map((text) => `<p class="uniform-note">${escapeHtml(text)}</p>`).join("")}`
    : `<p class="uniform-note">Wikipedia lists no all-time leaders for the ${favorite.label}.</p>`;
  return `
    <section class="uniform-card" style="--team-color:${favorite.color}">
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
      </div>
      ${body}
    </section>`;
}

function leaderCategoryHtml({ name, leaders }) {
  const rows = leaders
    .map(
      (leader) => `
        <li class="leader">
          <span class="leader-rank">${leader.rank}</span>
          <span class="leader-player">
            <span class="hof-name">${escapeHtml(leader.name)}</span>
            ${leader.years ? `<span class="retired-details">${escapeHtml(leader.years)}</span>` : ""}
          </span>
          <span class="leader-value">${escapeHtml(leader.value)}</span>
        </li>`
    )
    .join("");
  return `
    <section class="leader-category">
      <h3 class="hof-group">${escapeHtml(name)}</h3>
      <ol class="leader-list">${rows}</ol>
    </section>`;
}
