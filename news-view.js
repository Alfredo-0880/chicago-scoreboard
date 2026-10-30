// Draws the News tab: the selected team's newest stories, or every team's
// mixed together. Each story opens on ESPN in a new tab.

function newsPageHtml() {
  const states = selectedFavorites().map((favorite) => ({ favorite, ...loadState("news", favorite.key) }));
  const stories = mergeNews(states.filter((teamState) => teamState.status === "loaded").map((teamState) => teamState.value));
  const stillLoading = states.some((teamState) => teamState.status === "loading");
  const failed = states.filter((teamState) => teamState.status === "error");

  let body;
  if (stories.length > 0) {
    body = stories.map(storyHtml).join("");
  } else if (stillLoading) {
    body = `<div class="message">Loading news…</div>`;
  } else if (failed.length === states.length) {
    body = errorMessageHtml("Couldn't load the news");
  } else {
    body = `<div class="message">No recent stories about ${state.selectedTeam === "all" ? "these teams" : "this team"} on ESPN.</div>`;
  }

  const failedNote =
    failed.length > 0 && failed.length < states.length
      ? `<div class="notice">Couldn't load news for ${failed.map((teamState) => teamState.favorite.label).join(", ")}. Try Refresh.</div>`
      : "";

  return `
    ${teamFilterHtml()}
    <div class="season-note">The latest stories that name the team, from ESPN. Tap a story to read it on ESPN.</div>
    ${failedNote}
    <div class="news-list">${body}</div>`;
}

function storyHtml(story) {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === story.teamKey);
  const date = chicagoDate(story.published, { month: "short", day: "numeric" });
  return `
    <a class="story" href="${escapeHtml(story.link)}" target="_blank" rel="noopener noreferrer" style="--team-color:${favorite.color}">
      ${story.image ? `<img class="story-image" src="${escapeHtml(story.image)}" alt="" loading="lazy">` : ""}
      <div class="story-text">
        <div class="story-headline">${escapeHtml(story.headline)}</div>
        ${story.summary ? `<div class="story-summary">${escapeHtml(story.summary)}</div>` : ""}
        <div class="story-meta">${favorite.label} · ${date}</div>
      </div>
    </a>`;
}
