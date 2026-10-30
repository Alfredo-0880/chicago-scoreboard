// Recent news from ESPN for each Chicago team. ESPN tags league-wide stories
// (power rankings, award races) with every team, so a story counts only if
// its headline or summary names the team.

const NEWS_PER_TEAM = 10;

// Words that mean a story is about the team. "Fire" and "Stars" alone are
// ordinary words, so those teams need their full names.
const NEWS_NAMES = {
  fire: ["Chicago Fire", "Fire FC"],
  stars: ["Chicago Stars", "Stars FC"],
};

async function fetchTeamNews(favorite) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const url = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/news?team=${favorite.scheduleTeamId}&limit=50`;
  return parseTeamNews(favorite, await fetchJson(url));
}

// The team's newest stories: [{ headline, summary, published, link, image, teamKey }].
function parseTeamNews(favorite, espnData) {
  const names = NEWS_NAMES[favorite.key] || [favorite.label];
  const mentionsTeam = new RegExp(`\\b(${names.join("|")})\\b`);
  return (espnData.articles || [])
    .filter((article) => mentionsTeam.test(`${article.headline || ""} ${article.description || ""}`))
    .map((article) => parseArticle(favorite, article))
    .filter(Boolean)
    .sort(newestFirst)
    .slice(0, NEWS_PER_TEAM);
}

function parseArticle(favorite, article) {
  const link = secureUrl(article.links && article.links.web && article.links.web.href);
  if (!article.headline || !link) return null;
  const image = (article.images || []).map((picture) => secureUrl(picture.url)).find(Boolean) || null;
  return {
    headline: article.headline,
    summary: article.description || "",
    published: new Date(article.published),
    link,
    image,
    teamKey: favorite.key,
  };
}

// ESPN still sends some links as http://; its site serves them all over https.
// Anything that isn't a web link is dropped.
function secureUrl(url) {
  if (typeof url !== "string") return null;
  if (url.startsWith("https://")) return url;
  if (url.startsWith("http://")) return `https://${url.slice("http://".length)}`;
  return null;
}

function newestFirst(a, b) {
  return b.published - a.published;
}

// Several teams' stories in one list, newest first, each story once even if
// it's about two of the teams.
function mergeNews(storiesByTeam) {
  const byLink = new Map();
  for (const story of storiesByTeam.flat()) {
    if (!byLink.has(story.link)) byLink.set(story.link, story);
  }
  return [...byLink.values()].sort(newestFirst);
}
