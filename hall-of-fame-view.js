// Draws the Hall of Fame tab: everyone Wikipedia lists as a Hall of Famer
// for each team, in groups, with position, years, and induction year where
// Wikipedia gives them.

function hallOfFamePageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => hallOfFameCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's Hall of Famers, from its league's Hall of Fame. Copied from Wikipedia (ESPN doesn't keep them).</div>
    <div class="uniform-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters.
function hallOfFameCardHtml(favorite, logos) {
  const { hall, groups } = teamHallOfFame(favorite);
  const body = groups.length
    ? `<div class="hof-hall">${escapeHtml(hall)}</div>${groups.map(hallOfFameGroupHtml).join("")}`
    : `<p class="uniform-note">Wikipedia lists no Hall of Famers for the ${favorite.label}.</p>`;
  return `
    <section class="uniform-card" style="--team-color:${favorite.color}">
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
      </div>
      ${body}
    </section>`;
}

function hallOfFameGroupHtml({ title, members }) {
  const rows = members
    .map((member) => {
      const details = [member.role, member.years, member.inducted && `Inducted ${member.inducted}`, member.note].filter(Boolean);
      return `
        <li class="hof-member">
          <span class="hof-name">${escapeHtml(member.name)}</span>
          ${details.length ? `<span class="retired-details">${details.map(escapeHtml).join(" · ")}</span>` : ""}
        </li>`;
    })
    .join("");
  return `
    <h3 class="hof-group">${escapeHtml(title)} (${members.length})</h3>
    <ul class="hof-list">${rows}</ul>`;
}
