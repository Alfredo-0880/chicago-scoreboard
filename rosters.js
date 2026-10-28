// Team rosters from ESPN. Some sports send players in groups (football:
// offense, defense...; baseball: pitchers, catchers...), others as one list,
// which is grouped here by position.

async function fetchRoster(favorite) {
  const leagueInfo = leagueInfoFor(favorite.league);
  const url = `${ESPN_SITE_API}/site/v2/sports/${leagueInfo.sport}/${leagueInfo.league}/teams/${favorite.scheduleTeamId}/roster`;
  return parseRoster(await fetchJson(url));
}

// ESPN's names for football's roster groups, made readable.
const ROSTER_GROUP_NAMES = {
  offense: "Offense",
  defense: "Defense",
  specialTeam: "Special teams",
  injuredReserveOrOut: "Injured reserve or out",
  suspended: "Suspended",
  practiceSquad: "Practice squad",
};

// Returns [{ name: "Offense", players: [{ name, jersey, position, positionName, details }] }].
function parseRoster(espnData) {
  const athletes = espnData.athletes || [];
  const isGrouped = athletes.length > 0 && Array.isArray(athletes[0].items);
  const groups = isGrouped
    ? athletes.map((group) => ({ name: ROSTER_GROUP_NAMES[group.position] || group.position, players: group.items.map(parsePlayer) }))
    : groupByPosition(athletes.map(parsePlayer));

  return groups
    .filter((group) => group.players.length > 0)
    .map((group) => ({ ...group, players: group.players.sort(byJerseyNumber) }));
}

function parsePlayer(athlete) {
  const position = athlete.position || {};
  return {
    name: athlete.displayName || athlete.fullName || "Unknown player",
    jersey: athlete.jersey || "",
    position: position.abbreviation || "",
    positionName: position.displayName || position.name || "",
    details: playerDetails(athlete),
  };
}

// Everything a roster can show about a player, ready to show. Each team's
// roster picks which ones (see ROSTER_DETAILS). Anything ESPN leaves out
// becomes a dash.
function playerDetails(athlete) {
  const years = athlete.experience && athlete.experience.years;
  const salary = athlete.contract && athlete.contract.salary;
  const hand = (field) => (athlete[field] && athlete[field].displayValue) || "—";
  return {
    bats: hand("bats"),
    throws: hand("throws"),
    // Hockey: the side a skater shoots from, or a goalie's glove hand.
    hand: hand("hand"),
    birthDate: athlete.dateOfBirth ? formatBirthDate(athlete.dateOfBirth) : "—",
    birthPlace: (athlete.birthPlace && athlete.birthPlace.displayText) || "—",
    age: athlete.age ? String(athlete.age) : "—",
    height: athlete.displayHeight || "—",
    weight: athlete.displayWeight || "—",
    experience: years === undefined || years === null ? "—" : years === 0 ? "Rookie" : `${years} ${years === 1 ? "yr" : "yrs"}`,
    college: (athlete.college && athlete.college.name) || "—",
    salary: salary ? formatSalary(salary) : "—",
  };
}

// "2005-07-17T07:00Z" -> "Jul 17, 2005". Read in UTC so the day never
// shifts with the viewer's time zone.
function formatBirthDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

// 4384642 -> "$4.4M"; 915000 -> "$915K"
function formatSalary(dollars) {
  if (dollars >= 1000000) return `$${(dollars / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  return `$${Math.round(dollars / 1000)}K`;
}

// One list -> groups like "Guards", "Forwards", in the order positions first appear.
function groupByPosition(players) {
  const groups = new Map();
  for (const player of players) {
    const name = player.positionName ? `${player.positionName}s` : "Players";
    groups.set(name, [...(groups.get(name) || []), player]);
  }
  return [...groups].map(([name, groupPlayers]) => ({ name, players: groupPlayers }));
}

// Lowest number first; players without a number go last.
function byJerseyNumber(a, b) {
  const numberA = a.jersey === "" ? Infinity : Number(a.jersey);
  const numberB = b.jersey === "" ? Infinity : Number(b.jersey);
  return numberA - numberB || a.name.localeCompare(b.name);
}
