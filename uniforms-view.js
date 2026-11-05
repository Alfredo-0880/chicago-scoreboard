// Draws the Uniforms tab: each team's uniforms, drawn in their colors with
// a short description, and a real picture where a free one exists.

function uniformsPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => uniformCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's current uniforms, drawn in their colors. Written by hand from Wikipedia (ESPN doesn't keep uniforms).</div>
    <div class="uniform-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters.
function uniformCardHtml(favorite, logos) {
  const { uniforms, picture } = teamUniforms(favorite);
  const isBasketball = leagueInfoFor(favorite.league).sport === "basketball";
  const items = uniforms
    .map(
      (uniform, index) => `
        <li class="uniform">
          ${uniformDrawingSvg(uniform, `${favorite.label} ${uniform.name} uniform`, `${favorite.key}-${index}`, isBasketball)}
          <div class="uniform-name">${escapeHtml(uniform.name)}</div>
          <p class="uniform-description">${escapeHtml(uniform.description)}</p>
        </li>`
    )
    .join("");
  const noAlternate = uniforms.some((uniform) => uniform.name === "Alternate") ? "" : `<p class="uniform-note">No alternate uniform.</p>`;
  return `
    <section class="uniform-card" style="--team-color:${favorite.color}">
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
      </div>
      <ul class="uniform-row">${items}</ul>
      ${noAlternate}
      ${picture ? uniformPictureHtml(picture) : ""}
    </section>`;
}

function uniformPictureHtml({ url, alt, caption, credit, link }) {
  return `
    <figure class="uniform-picture">
      <img src="${url}" alt="${escapeHtml(alt)}" loading="lazy" onerror="this.parentElement.classList.add('missing')">
      <figcaption>${escapeHtml(caption)} Picture: <a href="${link}" target="_blank" rel="noopener">${escapeHtml(credit)}</a></figcaption>
    </figure>`;
}

const JERSEY_WITH_SLEEVES = "M30,10 L44,6 Q50,13 56,6 L70,10 L90,26 L81,38 L72,32 L72,80 L28,80 L28,32 L19,38 L10,26 Z";
const JERSEY_TANK = "M34,6 L44,6 Q50,17 56,6 L66,6 Q66,25 74,30 L74,80 L26,80 L26,30 Q34,25 34,6 Z";
const UNIFORM_BOTTOMS = "M28,83 L72,83 L75,112 L54,112 L50,98 L46,112 L25,112 Z";

// A jersey over pants or shorts, in the uniform's colors. clipId must be
// unique on the page.
function uniformDrawingSvg(uniform, label, clipId, isTank) {
  const jersey = isTank ? JERSEY_TANK : JERSEY_WITH_SLEEVES;
  const pinstripes = uniform.pinstripes
    ? Array.from({ length: 16 }, (_, index) => `<line x1="${12 + index * 5}" y1="0" x2="${12 + index * 5}" y2="82" stroke="${uniform.pinstripes}" stroke-width="0.8"/>`).join("")
    : "";
  const band = uniform.band ? `<rect x="0" y="36" width="100" height="10" fill="${uniform.band}"/>` : "";
  return `
    <svg class="uniform-drawing" viewBox="0 0 100 116" role="img" aria-label="${escapeHtml(label)}">
      <defs><clipPath id="jersey-${clipId}"><path d="${jersey}"/></clipPath></defs>
      <path class="${isTank ? "jersey-tank" : "jersey-sleeves"}" d="${jersey}" fill="${uniform.jersey}"/>
      <g clip-path="url(#jersey-${clipId})">${pinstripes}${band}</g>
      <path d="${jersey}" fill="none" stroke="${uniform.trim}" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="50" y="68" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="22"
            fill="${uniform.numbers}" stroke="${uniform.trim}" stroke-width="0.8">10</text>
      <path d="${UNIFORM_BOTTOMS}" fill="${uniform.bottoms}" stroke="${uniform.trim}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;
}
