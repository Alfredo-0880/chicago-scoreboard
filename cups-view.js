// Draws the Cups tab: tournaments beside the leagues (cups.js). First the
// Bulls' NBA Cup group: the table, then the group's games.

function cupsPageHtml(nbaCupState) {
  return `
    <div class="season-note">Cup tournaments played alongside the league seasons. More are coming: the Leagues Cup and U.S. Open Cup.</div>
    ${nbaCupSectionHtml(nbaCupState)}`;
}

function nbaCupSectionHtml(nbaCupState) {
  const bulls = FAVORITE_TEAMS.find((team) => team.key === "bulls");
  const heading = `<h2 class="division-title">NBA Cup · Bulls' group</h2>`;
  if (nbaCupState.status === "loading") return `<section class="division">${heading}<div class="message">Loading the Bulls' NBA Cup group…</div></section>`;
  if (nbaCupState.status === "error") return `<section class="division">${heading}${errorMessageHtml("Couldn't load the NBA Cup group")}</section>`;
  const group = nbaCupState.value;
  if (group.notInTestSettings) {
    return `<section class="division">${heading}<div class="message">The NBA Cup group uses live data; test settings don't include it.</div></section>`;
  }
  if (group.teams.length === 0) {
    return `<section class="division">${heading}<div class="message">The Bulls have no NBA Cup group games on their schedule this season.</div></section>`;
  }
  const rows = nbaCupGroupTable(group)
    .map(
      (row, index) => `
      <tr class="${row.abbreviation === bulls.abbreviation ? "favorite" : ""}">
        <td class="seed">${index + 1}</td>
        <td><span class="team-name">${logoHtml(row.logos, row.abbreviation, "logo-small")}${escapeHtml(row.name)}</span></td>
        <td>${row.wins}-${row.losses}</td>
        <td>${row.differential > 0 ? "+" : ""}${row.differential}</td>
      </tr>`
    )
    .join("");
  const games = group.games.map(nbaCupGameHtml).join("");
  return `
    <section class="division">
      ${heading}
      <table class="standings-table picture-table">
        <thead><tr><th></th><th>Team</th><th>W-L</th><th>Pt diff</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="uniform-note">Each group winner, plus the best runner-up in each conference, reaches the knockout rounds in December. Ties here go to point differential.</p>
      <h3 class="hof-group">Group games</h3>
      <ol class="series-games">${games}</ol>
    </section>`;
}

// "Fri, Nov 14 · Hawks 117 @ Bulls 125", the winner in bold, or the date for a game not played yet.
function nbaCupGameHtml(game) {
  const when = displayDate(game.date, { weekday: "short", month: "short", day: "numeric" });
  if (!game.completed) {
    return `<li class="series-game">${escapeHtml(when)} · ${escapeHtml(game.away.name)} @ ${escapeHtml(game.home.name)}</li>`;
  }
  const homeWon = Number(game.home.score) > Number(game.away.score);
  const side = (team, won) => {
    const text = `${escapeHtml(team.name)} ${escapeHtml(team.score)}`;
    return won ? `<strong>${text}</strong>` : text;
  };
  return `<li class="series-game">${escapeHtml(when)} · ${side(game.away, !homeWon)} @ ${side(game.home, homeWon)}</li>`;
}
