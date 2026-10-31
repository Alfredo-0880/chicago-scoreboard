// Loads each league's injury report from ESPN and keeps the favorite team's
// players.

// Returns null when ESPN has no injury reports for the team's league.
async function fetchTeamInjuries(favorite) {
  const leagueInfo = leagueInfoFor(favorite.league);
  if (!leagueInfo.hasInjuryReports) return null;
  const report = await fetchJson(`${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/injuries`);
  return teamInjuriesFromReport(favorite, report);
}

function teamInjuriesFromReport(favorite, report) {
  const teamReport = (report.injuries || []).find((team) => team.displayName === favorite.fullName);
  // ESPN also lists healthy ("Active") players when there is news about them.
  const injured = teamReport ? teamReport.injuries.filter((injury) => !isActive(injury)) : [];
  const injuries = injured.map(parseInjury);
  return injuries.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.player.localeCompare(b.player));
}

function isActive(injury) {
  return (injury.type && injury.type.name) === "INJURY_STATUS_ACTIVE";
}

const SEVERITY_ORDER ={ out: 0, doubtful: 1, questionable: 2, probable: 3 };

function parseInjury(injury) {
  const athlete = injury.athlete || {};
  const details = injury.details || {};
  const comment = injury.shortComment || "";
  return {
    player: athlete.displayName || "Unknown player",
    position: (athlete.position && athlete.position.abbreviation) || "",
    status: injury.status || "Unknown",
    severity: severityOf(injury.type && injury.type.name),
    injury: details.type || "",
    returnDate: details.returnDate ? new Date(`${details.returnDate}T12:00:00Z`) : null,
    // Some reports only repeat the status ("out", "ir"); keep real sentences.
    comment: comment.length > 20 ? comment : "",
  };
}

// ESPN's status names look like INJURY_STATUS_60DAYIL or INJURY_STATUS_DAYTODAY.
function severityOf(typeName) {
  const name = typeName || "";
  if (name.includes("PROBABLE")) return "probable";
  if (name.includes("QUESTIONABLE") || name.includes("DAYTODAY")) return "questionable";
  if (name.includes("DOUBTFUL")) return "doubtful";
  if (/OUT|IL|IR|SUSPENSION|RESERVE/.test(name.replace("INJURY_STATUS_", ""))) return "out";
  return "questionable";
}

// Recent history: every injury update ESPN still has for a team, newest
// first. ESPN keeps no past seasons' reports, only these updates, which go
// back about a year and a half for the Bears but just weeks for most teams.

// Returns null when ESPN has no injury history for the team's league.
async function fetchInjuryHistory(favorite) {
  const leagueInfo = leagueInfoFor(favorite.league);
  if (!leagueInfo.hasInjuryReports) return null;
  const listUrl = `https://sports.core.api.espn.com/v2/sports/${leagueInfo.sport}/leagues/${leagueInfo.league}/teams/${favorite.espnTeamId}/injuries?limit=200`;
  // Each update is its own link, and leaves out the player's name. Names
  // come from the roster, or for players not on it (baseball's long-term
  // injured list, players who left) from ESPN's record of the player.
  const [list, roster] = await Promise.all([fetchJson(listUrl), fetchRoster(favorite)]);
  const entries = await Promise.all((list.items || []).map((item) => fetchJson(secureUrl(item.$ref))));
  const names = new Map(roster.groups.flatMap((group) => group.players.map((player) => [player.id, player.name])));
  const missing = [...new Map(entries.filter((entry) => !names.has(athleteIdOf(entry))).map((entry) => [athleteIdOf(entry), entry.athlete.$ref]))];
  await Promise.all(
    missing.map(async ([id, url]) => {
      try {
        names.set(id, (await fetchJson(secureUrl(url))).displayName);
      } catch (error) {
        // Left unnamed ("Former player") if ESPN's record won't load.
      }
    })
  );
  return parseInjuryHistory(entries, names);
}

// "…/seasons/2026/athletes/4361748?lang=en" -> "4361748"
function athleteIdOf(entry) {
  return (((entry.athlete || {}).$ref || "").match(/athletes\/(\d+)/) || [])[1];
}

// [{ date, player, status, severity, injury, returnDate }], newest first.
// names: Map of ESPN player number -> name.
function parseInjuryHistory(entries, names) {
  return entries
    .map((entry) => {
      const athleteId = athleteIdOf(entry);
      const details = entry.details || {};
      return {
        date: new Date(entry.date),
        player: names.get(athleteId) || "Former player",
        status: entry.status || "Unknown",
        severity: isActive(entry) ? "returned" : severityOf(entry.type && entry.type.name), // "Active": back from injury
        injury: details.type && details.type !== "Undisclosed" ? details.type : "",
        returnDate: details.returnDate ? new Date(`${details.returnDate}T12:00:00Z`) : null,
      };
    })
    .sort((a, b) => b.date - a.date);
}
