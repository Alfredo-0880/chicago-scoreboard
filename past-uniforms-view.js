// Draws the uniforms a team wore in one past season, for the Team History
// tab. Reuses the Uniforms tab's drawings and picture.

function pastUniformsHtml(favorite, season) {
  const label = seasonLabel(favorite, season);
  const heading = `<h2 class="history-heading">${label} uniforms</h2>`;
  const { uniforms, picture } = uniformsForSeason(favorite, season);
  if (uniforms.length === 0) {
    return `${heading}<p class="injury-empty">Wikipedia doesn't describe the ${favorite.label}' uniforms for ${label}.</p>`;
  }
  const isBasketball = leagueInfoFor(favorite.league).sport === "basketball";
  const items = uniforms
    .map(
      (uniform, index) => `
        <li class="uniform">
          ${uniformDrawingSvg(uniform, `${label} ${favorite.label} ${uniform.name} uniform`, `past-${favorite.key}-${index}`, isBasketball)}
          <div class="uniform-name">${escapeHtml(uniform.name)}</div>
          <p class="uniform-description">${escapeHtml(uniform.description)}</p>
        </li>`
    )
    .join("");
  return `
    ${heading}
    <section class="uniform-card" style="--team-color:${favorite.color}">
      <ul class="uniform-row">${items}</ul>
      ${picture ? uniformPictureHtml(picture) : ""}
      <p class="uniform-note">Drawn from Wikipedia's descriptions; one-game uniforms aren't shown.</p>
    </section>`;
}
