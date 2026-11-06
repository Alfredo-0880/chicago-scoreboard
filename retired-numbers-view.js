// Draws the Retired Numbers tab: each team's retired numbers, with the
// player, position, years with the team, and the year it was retired.

function retiredNumbersPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => retiredNumbersCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's retired numbers. Written by hand from Wikipedia (ESPN doesn't keep them).</div>
    <div class="uniform-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters.
function retiredNumbersCardHtml(favorite, logos) {
  const { numbers, leagueWide } = teamRetiredNumbers(favorite);
  const rows = numbers.length
    ? `<ul class="retired-list">${numbers.map(retiredNumberRowHtml).join("")}</ul>`
    : `<p class="uniform-note">Wikipedia lists no retired numbers for the ${favorite.label}.</p>`;
  const league = leagueWide
    ? `<p class="uniform-note">Also honored: ${leagueWide.number} ${escapeHtml(leagueWide.name)}, retired by all of ${leagueWide.league} in ${leagueWide.retired}.</p>`
    : "";
  return `
    <section class="uniform-card" style="--team-color:${favorite.color}">
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
      </div>
      ${rows}
      ${league}
    </section>`;
}

function retiredNumberRowHtml(entry) {
  const details = [entry.position, entry.years].filter(Boolean).map(escapeHtml).join(" · ");
  return `
    <li class="retired-number">
      <span class="retired-badge">${entry.number}</span>
      <span class="retired-player">
        <span class="retired-name">${escapeHtml(entry.name)}</span>
        <span class="retired-details">${details}${entry.retired ? `<br>Retired ${entry.retired}` : ""}</span>
      </span>
    </li>`;
}
