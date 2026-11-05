// Draws the Mascots tab: each team's mascot with a picture, the year it
// started, and a fun fact.

function mascotsPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => mascotCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's mascot. Written by hand from Wikipedia (ESPN doesn't keep mascots).</div>
    <div class="stadium-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters.
function mascotCardHtml(favorite, logos) {
  const mascot = teamMascot(favorite);
  const picture = mascot.photo
    ? `<figure class="stadium-photo mascot-photo">
        <img src="${mascot.photo.url}" alt="${escapeHtml(mascot.photo.alt)}" loading="lazy" onerror="this.parentElement.classList.add('missing')">
        <figcaption>${mascot.photo.caption ? `${escapeHtml(mascot.photo.caption)} ` : ""}Photo: <a href="${mascot.photo.link}" target="_blank" rel="noopener">${escapeHtml(mascot.photo.credit)}</a></figcaption>
      </figure>`
    : `<div class="mascot-no-photo">No free picture of ${escapeHtml(mascot.name)} is available yet.</div>`;
  return `
    <section class="stadium-card" style="--team-color:${favorite.color}">
      ${picture}
      <div class="stadium-body">
        <div class="trophy-header">
          ${logoHtml(logos, initials(favorite.label), "logo-heading")}
          <h2 class="stadium-name">${escapeHtml(mascot.name)}</h2>
        </div>
        <div class="stadium-home">${favorite.label} · ${mascot.debut ? `Since ${mascot.debut}` : "Start year not known"}</div>
        <p class="mascot-about">${escapeHtml(mascot.about)}</p>
        <p class="mascot-fact"><strong>Fun fact:</strong> ${escapeHtml(mascot.fact)}</p>
      </div>
    </section>`;
}
