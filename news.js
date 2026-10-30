// Recent news and highlight videos from ESPN for each Chicago team. ESPN
// tags league-wide stories (power rankings, award races) with every team, so
// an item counts only if its headline or summary names the team. One
// download per team feeds both the News and Highlights tabs.

const NEWS_PER_TEAM = 10;

// Words that mean a story is about the team. "Fire" and "Stars" alone are
// ordinary words, so those teams need their full names.
const NEWS_NAMES = {
  fire: ["Chicago Fire", "Fire FC"],
  stars: ["Chicago Stars", "Stars FC"],
};

// Every recent item about the team, stories and videos, newest first.
async function fetchTeamArticles(favorite) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const url = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/news?team=${favorite.scheduleTeamId}&limit=50`;
  return parseTeamArticles(favorite, await fetchJson(url));
}

// [{ headline, summary, published, link, image, isVideo, byline, teamKey }], newest first.
function parseTeamArticles(favorite, espnData) {
  const names = NEWS_NAMES[favorite.key] || [favorite.label];
  const mentionsTeam = new RegExp(`\\b(${names.join("|")})\\b`);
  return (espnData.articles || [])
    .filter((article) => mentionsTeam.test(`${article.headline || ""} ${article.description || ""}`))
    .map((article) => parseArticle(favorite, article))
    .filter(Boolean)
    .sort(newestFirst);
}

// The News tab: the team's newest 10 items.
function parseTeamNews(favorite, espnData) {
  return teamNews(parseTeamArticles(favorite, espnData));
}

function teamNews(articles) {
  return articles.slice(0, NEWS_PER_TEAM);
}

// The Highlights tab: the team's newest 10 game highlight videos. ESPN calls
// videos "Media"; game highlights are titled "...Game Highlights", which
// leaves out analysis and feature clips.
function teamHighlights(articles) {
  return articles.filter((article) => article.isVideo && /\bhighlights\b/i.test(article.headline)).slice(0, NEWS_PER_TEAM);
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
    isVideo: article.type === "Media",
    byline: article.byline || "",
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

// Who covers a team: reporters named in the team's recent ESPN bylines and
// credited in its injury notes ("..., Brad Biggs of the Chicago Tribune
// reports"), most often named first. Returns [{ name, outlet, mentions }].
const MAX_REPORTERS = 6;
const NOT_A_REPORTER = /\b(staff|news services|associated press|field level media)\b/i;
const REPORTER_CREDIT = /\b([A-Z][\w.'-]+(?: [A-Z][\w.'-]+){1,2}) of (?:the )?([A-Z][\w.&'-]*(?: [A-Z][\w.&'-]*){0,4})/g;

function teamReporters(articles, injuries) {
  const reporters = new Map();
  const count = (name, outlet) => {
    const reporter = reporters.get(name) || { name, mentions: 0, outlets: new Map() };
    reporter.mentions += 1;
    reporter.outlets.set(outlet, (reporter.outlets.get(outlet) || 0) + 1);
    reporters.set(name, reporter);
  };

  for (const article of articles) {
    for (const name of bylineNames(article.byline)) count(name, "ESPN");
  }
  for (const injury of injuries || []) {
    for (const credit of (injury.comment || "").matchAll(REPORTER_CREDIT)) {
      count(credit[1], cleanOutlet(credit[2]));
    }
  }

  return [...reporters.values()]
    .map(({ name, mentions, outlets }) => ({ name, mentions, outlet: [...outlets].sort((a, b) => b[1] - a[1])[0][0] }))
    .sort((a, b) => b.mentions - a.mentions || a.name.localeCompare(b.name))
    .slice(0, MAX_REPORTERS);
}

// "Mike Reiss and Courtney Cronin" -> ["Mike Reiss", "Courtney Cronin"],
// leaving out wire credits like "Associated Press" and "ESPN staff", and
// one-word bylines like "ESPN" (a reporter has a first and last name).
function bylineNames(byline) {
  return (byline || "")
    .split(/,\s*|\s+and\s+/)
    .map((name) => name.trim())
    .filter((name) => name.includes(" ") && !NOT_A_REPORTER.test(name));
}

// "ESPN.com" -> "ESPN"; drops a trailing period.
function cleanOutlet(outlet) {
  const trimmed = outlet.trim().replace(/\.$/, "");
  return /^ESPN(\.com)?$/i.test(trimmed) ? "ESPN" : trimmed;
}
