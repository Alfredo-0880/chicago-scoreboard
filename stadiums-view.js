// Draws the Stadiums tab: a photo and the key facts for where each team
// plays.

function stadiumsPageHtml() {
  const cards = stadiumsFor(selectedFavorites()).map(stadiumCardHtml).join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Where each team plays its home games. Written by hand (ESPN doesn't keep stadium details).</div>
    <div class="stadium-list">${cards}</div>`;
}

function stadiumCardHtml(stadium) {
  const teamNames = stadium.teams.map((team) => team.label);
  const homeOf = teamNames.length > 1 ? `${teamNames.slice(0, -1).join(", ")} and ${teamNames.at(-1)}` : teamNames[0];
  const { url, credit, link } = stadium.photo;
  const creditHtml = link ? `<a href="${link}" target="_blank" rel="noopener">${escapeHtml(credit)}</a>` : escapeHtml(credit);
  const facts = [
    ["Address", stadium.address],
    ["Opened", stadium.note ? `${stadium.opened}. ${stadium.note}` : stadium.opened],
    ["Capacity", stadium.capacity],
    ["Surface", stadium.surface],
    ["Roof", stadium.roof],
  ];
  return `
    <section class="stadium-card" style="--team-color:${stadium.teams[0].color}">
      <figure class="stadium-photo">
        <img src="${url}" alt="${escapeHtml(stadium.name)}" loading="lazy" onerror="this.parentElement.classList.add('missing')">
        <figcaption>Photo: ${creditHtml}</figcaption>
      </figure>
      <div class="stadium-body">
        <h2 class="stadium-name">${escapeHtml(stadium.name)}</h2>
        <div class="stadium-home">Home of the ${escapeHtml(homeOf)}</div>
        <dl class="stadium-facts">
          ${facts.map(([label, value]) => `<div><dt>${label}</dt> <dd>${escapeHtml(value)}</dd></div>`).join("")}
        </dl>
      </div>
    </section>`;
}
