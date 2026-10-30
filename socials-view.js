// Draws the Social tab: each team's official website and social accounts.

function socialsPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => socialsCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Official accounts, as linked from each team's own website. Links open in a new tab.</div>
    <div class="trophy-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters.
function socialsCardHtml(favorite, logos) {
  const { website, socials } = teamLinks(favorite);
  const link = (url, text, className) =>
    `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
  return `
    <section class="trophy-card" style="--team-color:${favorite.color}">
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
      </div>
      ${website ? `<p class="team-website">${link(website, "Official website ↗", "website-link")}</p>` : ""}
      <div class="social-links">
        ${socials.map(({ name, url }) => link(url, name, "social-link")).join("")}
      </div>
    </section>`;
}
