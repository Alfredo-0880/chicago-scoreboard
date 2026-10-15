// Shared by every part of the app: which leagues and teams we follow, and
// small formatting helpers.

// How each league differs:
// - scheduleQueries: the schedule requests that together cover a season.
//   US leagues split it by season type; soccer splits played games from
//   upcoming fixtures.
// - rankedByPoints: standings go by points (hockey, soccer), not win %.
// - hasInjuryReports: ESPN publishes no injury reports for MLS or the NWSL.
// - seasonTypeNames: what ESPN's season type numbers mean in standings
//   (soccer numbers its regular season 1, where US leagues mean preseason).
const US_SEASON_TYPES = ["seasontype=1", "seasontype=2", "seasontype=3"];
const US_SEASON_TYPE_NAMES = { 1: "Preseason", 2: "Regular season", 3: "Postseason" };

const LEAGUES = [
  { key: "NFL", sport: "football", league: "nfl", scheduleQueries: US_SEASON_TYPES, seasonTypeNames: US_SEASON_TYPE_NAMES, rankedByPoints: false, hasInjuryReports: true },
  { key: "NBA", sport: "basketball", league: "nba", scheduleQueries: US_SEASON_TYPES, seasonTypeNames: US_SEASON_TYPE_NAMES, rankedByPoints: false, hasInjuryReports: true },
  { key: "WNBA", sport: "basketball", league: "wnba", scheduleQueries: US_SEASON_TYPES, seasonTypeNames: US_SEASON_TYPE_NAMES, rankedByPoints: false, hasInjuryReports: true },
  { key: "MLB", sport: "baseball", league: "mlb", scheduleQueries: US_SEASON_TYPES, seasonTypeNames: US_SEASON_TYPE_NAMES, rankedByPoints: false, hasInjuryReports: true },
  { key: "NHL", sport: "hockey", league: "nhl", scheduleQueries: US_SEASON_TYPES, seasonTypeNames: US_SEASON_TYPE_NAMES, rankedByPoints: true, hasInjuryReports: true },
  { key: "MLS", sport: "soccer", league: "usa.1", scheduleQueries: ["", "fixture=true"], seasonTypeNames: { 1: "Regular season" }, rankedByPoints: true, hasInjuryReports: false },
  { key: "NWSL", sport: "soccer", league: "usa.nwsl", scheduleQueries: ["", "fixture=true"], seasonTypeNames: { 1: "Regular season" }, rankedByPoints: true, hasInjuryReports: false },
];

// scheduleTeamId is what ESPN's schedule URLs use for the team. It is usually
// the abbreviation, but in soccer abbreviations are countries (chi = Chile),
// so the Fire and Stars use ESPN's team numbers.
const FAVORITE_TEAMS = [
  { key: "bears", league: "NFL", abbreviation: "CHI", scheduleTeamId: "chi", label: "Bears", fullName: "Chicago Bears", color: "#0B162A" },
  { key: "bulls", league: "NBA", abbreviation: "CHI", scheduleTeamId: "chi", label: "Bulls", fullName: "Chicago Bulls", color: "#CE1141" },
  { key: "cubs", league: "MLB", abbreviation: "CHC", scheduleTeamId: "chc", label: "Cubs", fullName: "Chicago Cubs", color: "#0E3386" },
  { key: "whitesox", league: "MLB", abbreviation: "CHW", scheduleTeamId: "chw", label: "White Sox", fullName: "Chicago White Sox", color: "#27251F" },
  { key: "blackhawks", league: "NHL", abbreviation: "CHI", scheduleTeamId: "chi", label: "Blackhawks", fullName: "Chicago Blackhawks", color: "#CE1126" },
  { key: "fire", league: "MLS", abbreviation: "CHI", scheduleTeamId: "182", label: "Fire", fullName: "Chicago Fire FC", color: "#AF2626" },
  { key: "sky", league: "WNBA", abbreviation: "CHI", scheduleTeamId: "chi", label: "Sky", fullName: "Chicago Sky", color: "#2A6EBB" },
  { key: "stars", league: "NWSL", abbreviation: "CHI", scheduleTeamId: "15360", label: "Stars", fullName: "Chicago Stars FC", color: "#C7102E" },
];

const ESPN_SITE_API = "https://site.api.espn.com/apis";

function leagueInfoFor(leagueKey) {
  return LEAGUES.find((leagueInfo) => leagueInfo.key === leagueKey);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ESPN returned ${response.status} for ${url}`);
  }
  return response.json();
}

function escapeHtml(text) {
  const element = document.createElement("span");
  element.textContent = String(text);
  return element.innerHTML;
}

// "Bears" -> "BE", "White Sox" -> "WS"
function initials(label) {
  const words = label.split(" ");
  const letters = words.length > 1 ? words.map((word) => word[0]).join("") : label.slice(0, 2);
  return letters.toUpperCase();
}

// A league can have more than one Chicago team (MLB has the Cubs and the
// White Sox).
function favoriteAbbreviations(leagueKey) {
  return FAVORITE_TEAMS.filter((team) => team.league === leagueKey).map((team) => team.abbreviation);
}

function ordinal(n) {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  const suffix = { 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th";
  return `${n}${suffix}`;
}

// All dates are shown in Chicago time, wherever the viewer is.
function chicagoDate(date, options) {
  return date.toLocaleString("en-US", { timeZone: "America/Chicago", ...options });
}
