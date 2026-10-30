// Draws the News tab: the selected team's newest stories, or every team's
// mixed together. Each story opens on ESPN in a new tab.

function newsPageHtml() {
  const states = selectedFavorites().map((favorite) => ({ favorite, ...loadState("news", favorite.key) }));
  const stories = mergeNews(states.filter((teamState) => teamState.status === "loaded").map((teamState) => teamNews(teamState.value)));
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
    ${reportersHtml()}
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

// "Who covers the Bears": shown when one team is selected and its news has loaded.
function reportersHtml() {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
  const newsState = favorite && loadState("news", favorite.key);
  if (!newsState || newsState.status !== "loaded") return "";

  const reporters = teamReporters(newsState.value, loadState("injuries", favorite.key).value);
  const list = reporters.length
    ? `<ul class="reporter-list">${reporters
        .map(
          (reporter) => `
        <li>
          <span class="reporter-name">${escapeHtml(reporter.name)}</span>
          <span class="reporter-outlet">${escapeHtml(reporter.outlet)}</span>
          <span class="reporter-count">${reporter.mentions} recent ${reporter.mentions === 1 ? "mention" : "mentions"}</span>
        </li>`
        )
        .join("")}</ul>`
    : `<p class="reporter-empty">ESPN's recent stories don't name any reporters for the ${favorite.label}.</p>`;

  return `
    <section class="reporters" style="--team-color:${favorite.color}">
      <h2 class="reporters-title">Who covers the ${favorite.label}</h2>
      ${list}
      <p class="reporter-note">Reporters named in recent ESPN bylines and injury reports.</p>
    </section>`;
}
