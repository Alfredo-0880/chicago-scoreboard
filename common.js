// Shared by every part of the app: which leagues and teams we follow, and
// small formatting helpers.

const LEAGUES = [
  { key: "NFL", sport: "football", league: "nfl" },
  { key: "NBA", sport: "basketball", league: "nba" },
  { key: "MLB", sport: "baseball", league: "mlb" },
  { key: "NHL", sport: "hockey", league: "nhl" },
];

const FAVORITE_TEAMS = [
  { key: "bears", league: "NFL", abbreviation: "CHI", label: "Bears", fullName: "Chicago Bears", color: "#0B162A" },
  { key: "bulls", league: "NBA", abbreviation: "CHI", label: "Bulls", fullName: "Chicago Bulls", color: "#CE1141" },
  { key: "cubs", league: "MLB", abbreviation: "CHC", label: "Cubs", fullName: "Chicago Cubs", color: "#0E3386" },
  { key: "blackhawks", league: "NHL", abbreviation: "CHI", label: "Blackhawks", fullName: "Chicago Blackhawks", color: "#CE1126" },
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

function initials(label) {
  return label.slice(0, 2).toUpperCase();
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
