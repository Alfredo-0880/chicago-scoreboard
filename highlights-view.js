// Draws the Highlights tab: the selected team's newest game highlights, or
// every team's mixed together. Videos play on ESPN's site, in a new tab.
// When ESPN has none for a team, a button opens the game-highlights
// playlist on its official YouTube channel (Alfredo, 2026-11-25). The NFL's
// and MLB's game clips play only on YouTube itself, not in other sites'
// players, so the playlist opens there, the way ESPN's videos open on ESPN.

// Each team's game-highlights playlist, checked 2026-11-25. Teams without
// one of their own are left out: the Bulls' and Blackhawks' channels have
// none for this season, and the Stars' holds every NWSL game. Year-named
// playlists ("2026 Game Highlights") need the next year's added each season.
const YOUTUBE_HIGHLIGHTS = {
  bears: { playlist: "PLGCp3YYBaWlkaf1W3HKYncn308AXevBEQ", name: "Highlights" },
  cubs: { playlist: "PLMdj9p1kEttd0LI4iaK_K2TitFaez3wEY", name: "Cubs Highlights" },
  whitesox: { playlist: "PL1ksV9EA4Jo68T339UEPfqn3eC2aer_7s", name: "2026 Game Highlights" },
  fire: { playlist: "PLokF7aN_5Odg1BIXNqTanpaGY7alYozmA", name: "2026 Match Highlights" },
  sky: { playlist: "PLqgjpc05B5Dq61FvnbHQAxrZcrRJGMODD", name: "Game Highlights I 2026" },
};

// "Bears'", "White Sox'", but "Sky's" and "Fire's".
function possessive(label) {
  return /[sx]$/.test(label) ? `${label}'` : `${label}'s`;
}

// A button to the team's YouTube game highlights, or null when it has no playlist.
function youtubeHighlightsHtml(favorite) {
  const highlights = YOUTUBE_HIGHLIGHTS[favorite.key];
  if (!highlights) return null;
  return `
    <section class="youtube-highlights" style="--team-color:${favorite.color}">
      <h3 class="hof-group">${escapeHtml(possessive(favorite.label))} game highlights on YouTube</h3>
      <p class="uniform-note">ESPN hasn't posted recent highlights for the ${escapeHtml(favorite.label)}. The team's YouTube channel has them in its "${escapeHtml(highlights.name)}" playlist, which opens on YouTube.</p>
      <a class="pill-button youtube-button" href="https://www.youtube.com/playlist?list=${highlights.playlist}" target="_blank" rel="noopener noreferrer">
        ▶ Watch the ${escapeHtml(possessive(favorite.label))} game highlights on YouTube
      </a>
    </section>`;
}

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
    const favorite = FAVORITE_TEAMS.find((team) => team.key === state.selectedTeam);
    body =
      (favorite && youtubeHighlightsHtml(favorite)) ||
      `<div class="message">ESPN hasn't posted any recent game highlights for ${favorite ? favorite.label : "these teams"}.</div>`;
  }
  // With All teams, name the teams ESPN has none for that have YouTube highlights to pick.
  const onYouTube = state.selectedTeam === "all"
    ? loaded.filter((teamState) => teamHighlights(teamState.value).length === 0 && YOUTUBE_HIGHLIGHTS[teamState.favorite.key])
    : [];
  const youtubeNote = onYouTube.length
    ? `<div class="notice">No ESPN highlights right now for ${onYouTube.map((teamState) => teamState.favorite.label).join(", ")}. Pick ${onYouTube.length === 1 ? "it" : "one"} above for a button to its game highlights on YouTube.</div>`
    : "";

  const failedNote =
    failed.length > 0 && failed.length < states.length
      ? `<div class="notice">Couldn't load highlights for ${failed.map((teamState) => teamState.favorite.label).join(", ")}. Try Refresh.</div>`
      : "";

  return `
    ${teamFilterHtml()}
    <div class="season-note">Game highlights from ESPN; tap one to watch it on ESPN. When ESPN has none for a team, a button opens its game highlights on YouTube.</div>
    ${failedNote}
    ${youtubeNote}
    <div class="news-list">${body}</div>`;
}

function videoHtml(video) {
  const favorite = FAVORITE_TEAMS.find((team) => team.key === video.teamKey);
  const date = displayDate(video.published, { month: "short", day: "numeric" });
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
