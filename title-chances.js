// Each team's chances to win its division, its conference, and the league,
// for the team cards (Alfredo, 2026-11-25). They come from ESPN's power
// index projections: the NFL's FPI and the NBA's BPI. The NHL, MLB, MLS, and
// NWSL have none from ESPN, and the WNBA's has no division or conference.
// One request per league answers for every team in it.

const TITLE_CHANCE_LEAGUES = {
  NFL: { title: "Super Bowl" },
  NBA: { title: "NBA title" },
};

// league key -> Map of ESPN team id -> { playoffs, playIn, division,
// conference, title } (ESPN's text: "22.7%", ">99.9%"; playIn is the NBA's
// only, else null). The app fills it; the tests leave it empty.
const titleChances = {};

// "2026" -> 2026, "2026-27" -> 2027: ESPN files a season under the year it ends.
function seasonYearFromName(seasonName) {
  const split = /^(\d{4})-(\d{2})/.exec(seasonName);
  return split ? Number(split[1].slice(0, 2) + split[2]) : Number(seasonName.slice(0, 4));
}

async function fetchTitleChances(leagueKey, seasonName) {
  const leagueInfo = leagueInfoFor(leagueKey);
  const url = `https://sports.core.api.espn.com/v2/sports/${leagueInfo.sport}/leagues/${leagueInfo.league}/seasons/${seasonYearFromName(seasonName)}/powerindex?limit=40`;
  return parsePowerIndex(await fetchJson(url));
}

// ESPN's power index -> Map of team id -> chances. The NFL's numbers are in
// "predictives", the NBA's in "stats". Reaching the final ("make title
// game") means winning the conference. The playoff (and NBA play-in)
// chances say more for a team far from a title (Alfredo, 2026-11-25).
function parsePowerIndex(data) {
  const chances = new Map();
  for (const item of (data && data.items) || []) {
    const teamId = /\/teams\/(\d+)/.exec((item.team && item.team.$ref) || "");
    if (!teamId) continue;
    const values = Object.fromEntries([...(item.predictives || []), ...(item.stats || [])].map((stat) => [stat.name, stat.displayValue]));
    const division = values.probwindiv;
    const conference = values.probmaketitlegame;
    const title = values.probwintitle;
    const playoffs = values.probmakeplayoffs || null;
    const playIn = values.playinchance || null;
    if (division && conference && title) chances.set(teamId[1], { playoffs, playIn, division, conference, title });
  }
  return chances;
}

// The card's two lines: ["Playoffs 0.6% · Play-in 9.5%", "Division 0% ·
// Conference 0% · NBA title 0%"], or null. The first is left out when ESPN
// gives no playoff chance.
function titleChancesLines(favorite, chancesByLeague = titleChances) {
  const league = TITLE_CHANCE_LEAGUES[favorite.league];
  const chances = league && chancesByLeague[favorite.league] && chancesByLeague[favorite.league].get(favorite.espnTeamId);
  if (!chances) return null;
  const playoffs = [chances.playoffs && `Playoffs ${chances.playoffs}`, chances.playIn && `Play-in ${chances.playIn}`].filter(Boolean).join(" · ");
  const titles = `Division ${chances.division} · Conference ${chances.conference} · ${league.title} ${chances.title}`;
  return playoffs ? [playoffs, titles] : [titles];
}
