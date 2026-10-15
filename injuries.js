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
