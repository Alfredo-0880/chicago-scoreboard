// Builds a calendar file (.ics) of a team's upcoming games, with a reminder
// before each one, so the phone's own calendar can notify about games.
// Format: RFC 5545, which Apple, Google, and Outlook calendars all read.

const REMINDER_MINUTES = 60;

// How long to block out on the calendar for each game.
const GAME_LENGTH_MINUTES = { football: 210, basketball: 150, baseball: 180, hockey: 150, soccer: 120 };

// Regular season and postseason games that haven't started yet. Preseason
// games are left out.
function calendarGames(games) {
  return games.filter((game) => game.state === "pre" && game.note !== "Preseason");
}

function buildCalendar(favorite, games, createdAt) {
  return buildMultiTeamCalendar(`${favorite.label} games`, [{ favorite, games }], createdAt);
}

// One calendar file for several teams: teams is [{ favorite, games }]. Each
// game keeps the same ID as in that team's own file, so importing both
// doesn't create duplicates.
function buildMultiTeamCalendar(calendarName, teams, createdAt) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Chicago Scoreboard//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeCalendarText(calendarName)}`,
  ];
  for (const { favorite, games } of teams) {
    const sport = leagueInfoFor(favorite.league).sport;
    for (const game of calendarGames(games)) {
      lines.push(...calendarEventLines(favorite, sport, game, createdAt));
    }
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldCalendarLine).join("\r\n") + "\r\n";
}

function calendarEventLines(favorite, sport, game, createdAt) {
  const title = `${favorite.label} ${game.isHome ? "vs" : "@"} ${game.opponent}`;
  const location = game.venue ? [game.venue.name, game.venue.city].filter(Boolean).join(", ") : "";
  // When ESPN hasn't set a start time, add the game as an all-day event.
  const when = game.timeKnown
    ? [
        `DTSTART:${calendarTime(game.date)}`,
        `DTEND:${calendarTime(new Date(game.date.getTime() + GAME_LENGTH_MINUTES[sport] * 60000))}`,
      ]
    : [`DTSTART;VALUE=DATE:${calendarDay(game.date)}`];

  return [
    "BEGIN:VEVENT",
    `UID:${game.id}-${favorite.key}@chicago-scoreboard`,
    `DTSTAMP:${calendarTime(createdAt)}`,
    ...when,
    `SUMMARY:${escapeCalendarText(title)}`,
    ...(location ? [`LOCATION:${escapeCalendarText(location)}`] : []),
    ...(game.note ? [`DESCRIPTION:${escapeCalendarText(game.note)}`] : []),
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeCalendarText(`${title} starts in ${REMINDER_MINUTES} minutes`)}`,
    `TRIGGER:-PT${REMINDER_MINUTES}M`,
    "END:VALARM",
    "END:VEVENT",
  ];
}

// 2026-10-21T23:30:00Z -> 20261021T233000Z
function calendarTime(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

// The game's date in Chicago, as 20261021.
function calendarDay(date) {
  const [month, day, year] = chicagoDate(date, { year: "numeric", month: "2-digit", day: "2-digit" }).split("/");
  return `${year}${month}${day}`;
}

// Commas, semicolons, and backslashes have special meanings in calendar
// files, so text has to escape them.
function escapeCalendarText(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

// Calendar lines may be at most 75 characters; longer ones continue on the
// next line, which starts with a space.
function foldCalendarLine(line) {
  const parts = [];
  let rest = line;
  while (rest.length > 75) {
    parts.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  parts.push(rest);
  return parts.join("\r\n");
}

// Hands the calendar file to the browser as a download, e.g. bulls-games.ics.
function downloadCalendar(fileName, calendarText) {
  const file = new Blob([calendarText], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 10000);
}
