// Draws the Championships tab: each team's league titles, how many, and
// the years.

function championshipsPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => championshipCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">League championships only. Written by hand from the historical record (ESPN doesn't keep title history).</div>
    <div class="trophy-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters.
function championshipCardHtml(favorite, logos) {
  const { title, count, years } = teamChampionships(favorite);
  const yearsHtml = count
    ? `<ul class="trophy-years">${years
        .map(({ year, note }) => `<li><span class="trophy-year">${year}</span>${note ? ` <span class="trophy-note">${escapeHtml(note)}</span>` : ""}</li>`)
        .join("")}</ul>`
    : `<p class="trophy-none">No ${escapeHtml(title)} titles yet.</p>`;

  return `
    <section class="trophy-card" style="--team-color:${favorite.color}">
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
        <span class="trophy-count" aria-label="${count} ${escapeHtml(title)} titles">\u{1F3C6} ${count}</span>
      </div>
      <div class="trophy-title">${escapeHtml(pluralTitle(title, count))}</div>
      ${yearsHtml}
    </section>`;
}

// "Stanley Cup" -> "Stanley Cups"; "World Series" stays "World Series".
function pluralTitle(title, count) {
  if (count === 1 || title.endsWith("Series")) return title;
  return `${title}s`;
}
