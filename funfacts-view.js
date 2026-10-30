// Draws the Fun facts tab: a card of facts for each selected team.

function funFactsPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => funFactsCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Written by hand from team history (ESPN doesn't keep fun facts).</div>
    <div class="trophy-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters.
function funFactsCardHtml(favorite, logos) {
  const facts = teamFunFacts(favorite);
  const body = facts.length
    ? `<ul class="fact-list">${facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>`
    : `<p class="trophy-none">No fun facts yet.</p>`;
  return `
    <section class="trophy-card" style="--team-color:${favorite.color}">
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
      </div>
      ${body}
    </section>`;
}
