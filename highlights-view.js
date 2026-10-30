// Draws the Highlights tab: the selected team's newest game highlights, or
// every team's mixed together. Videos play on ESPN's site, in a new tab.

function highlightsPageHtml() {
  const states = selectedFavorites().map((favorite) => ({ favorite, ...loadState("news", favorite.key) }));
  const loaded = states.filter((teamState) => teamState.status === "loaded");
  const videos = mergeNews(loaded.map((teamState) => teamHighlights(teamState.value)));
  const stillLoading = states.some((teamState) => teamState.status === "loading");
  const failed = states.filter((teamState) => teamState.status === "error");

  let body;
  if (videos.length > 0) {
    body = videos.map(videoHtml).join("");
  } else if (stillLoading) {
    body = `<div class="message">Loading highlights…</div>`;
  } else if (failed.length === states.length) {
    body = errorMessageHtml("Couldn't load highlights");
  } else {
    const who = state.selectedTeam === "all" ? "these teams" : FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam).label;
    body = `<div class="message">ESPN hasn't posted any recent game highlights for ${who}.</div>`;
  }

  const failedNote =
    failed.length > 0 && failed.length < states.length
      ? `<div class="notice">Couldn't load highlights for ${failed.map((teamState) => teamState.favorite.label).join(", ")}. Try Refresh.</div>`
      : "";

  return `
    ${teamFilterHtml()}
    <div class="season-note">Game highlights from ESPN. Tap a video to watch it on ESPN.</div>
    ${failedNote}
    <div class="news-list">${body}</div>`;
}

function videoHtml(video) {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === video.teamKey);
  const date = chicagoDate(video.published, { month: "short", day: "numeric" });
  return `
    <a class="story video" href="${escapeHtml(video.link)}" target="_blank" rel="noopener noreferrer"
       style="--team-color:${favorite.color}" aria-label="Watch on ESPN: ${escapeHtml(video.headline)}">
      <div class="video-thumb">
        ${video.image ? `<img class="story-image" src="${escapeHtml(video.image)}" alt="" loading="lazy">` : `<div class="story-image"></div>`}
        <span class="play" aria-hidden="true">▶</span>
      </div>
      <div class="story-text">
        <div class="story-headline">${escapeHtml(video.headline)}</div>
        <div class="story-meta">${favorite.label} · ${date} · Watch on ESPN</div>
      </div>
    </a>`;
}
