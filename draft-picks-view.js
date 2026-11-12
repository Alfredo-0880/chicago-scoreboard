// Draws the Draft Picks tab: each team's draft picks since 2005, newest
// first. The Cubs, White Sox, Blackhawks, and Fire come from Wikipedia
// (drafts.js), since ESPN has no draft data for their leagues.

const DRAFT_PICKS_SHOWN = 12;

// Not added yet: the Bears, Bulls, and Sky will come from ESPN, and the
// Stars from Wikipedia's NWSL Draft pages.
const DRAFT_PICKS_COMING = {
  bears: "ESPN",
  bulls: "ESPN",
  sky: "ESPN",
  stars: "Wikipedia (the NWSL held drafts from 2013 to 2024)",
};

// A team's picks newest first, with a row for each year that had none
// (noPick), or null when the team's picks aren't added yet.
function teamDraftPicks(favorite) {
  const team = WIKIPEDIA_DRAFT_PICKS[favorite.key];
  if (!team) return null;
  const noPickRows = Object.entries(team.noPick).map(([year, note]) => ({ year: Number(year), note }));
  const rows = [...team.picks, ...noPickRows].sort((a, b) => b.year - a.year || (a.pick ?? 0) - (b.pick ?? 0));
  return { rows, pickCount: team.picks.length, firstRoundOnly: team.rounds === "first", source: team.source };
}

function draftPicksPageHtml() {
  const cards = selectedFavorites()
    .map((favorite) => draftPicksCardHtml(favorite, chicagoTeamLogos(favorite)))
    .join("");
  return `
    ${teamFilterHtml()}
    <div class="season-note">Each team's draft picks since 2005, newest first. Copied from Wikipedia where ESPN has no draft data.</div>
    <div class="uniform-list">${cards}</div>`;
}

// logos: the team's logos, or null to show its letters. Long lists show the
// newest DRAFT_PICKS_SHOWN rows and fold the rest away.
function draftPicksCardHtml(favorite, logos) {
  const draft = teamDraftPicks(favorite);
  const header = `
      <div class="trophy-header">
        ${logoHtml(logos, initials(favorite.label), "logo-heading")}
        <h2 class="trophy-team">${favorite.label}</h2>
      </div>`;
  if (!draft) {
    return `
    <section class="uniform-card" style="--team-color:${favorite.color}">
      ${header}
      <p class="uniform-note">Draft picks for the ${favorite.label} aren't added yet. They'll come from ${DRAFT_PICKS_COMING[favorite.key]}.</p>
    </section>`;
  }
  const newest = draft.rows.slice(0, DRAFT_PICKS_SHOWN).map(draftPickRowHtml).join("");
  const older = draft.rows.slice(DRAFT_PICKS_SHOWN);
  const rest = older.length
    ? `<details class="coach-more">
         <summary>Show all ${draft.pickCount}</summary>
         <ol class="coach-list">${older.map(draftPickRowHtml).join("")}</ol>
       </details>`
    : "";
  const title = draft.firstRoundOnly ? "First-round picks" : "Draft picks";
  const notes = [
    draft.firstRoundOnly && "First round only: Wikipedia lists only the first-round picks.",
    `From Wikipedia's ${draft.source}.`,
  ].filter(Boolean);
  return `
    <section class="uniform-card" style="--team-color:${favorite.color}">
      ${header}
      <h3 class="hof-group">${title} (${draft.pickCount})</h3>
      <ol class="coach-list">${newest}</ol>
      ${rest}
      ${notes.map((text) => `<p class="uniform-note">${escapeHtml(text)}</p>`).join("")}
    </section>`;
}

// "Matt Shaw" over "2023 · Round 1, pick 13 · Shortstop · University of Maryland".
function draftPickRowHtml(row) {
  if (row.note) {
    return `
    <li class="coach-row">
      <span class="leader-player">
        <span class="hof-name">${row.year}</span>
        <span class="retired-details">${escapeHtml(row.note)}</span>
      </span>
    </li>`;
  }
  const details = [String(row.year), `Round ${row.round}, pick ${row.pick}`, row.position, row.from].filter(Boolean);
  return `
    <li class="coach-row">
      <span class="leader-player">
        <span class="hof-name">${escapeHtml(row.player)}</span>
        <span class="retired-details">${details.map(escapeHtml).join(" · ")}</span>
      </span>
    </li>`;
}
