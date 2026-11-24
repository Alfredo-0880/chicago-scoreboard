// Final score notifications. Someone turns them on per team on the
// Settings page; while the app is open in a tab, a notification pops up when one of
// those teams' games ends. The app has no server, so nothing can be sent
// while the browser is closed.

const NOTIFY_STORAGE_KEY = "chicago-scoreboard-notify";

// The teams turned on, or none if nothing is saved or storage is blocked.
function savedNotifyTeams() {
  try {
    const keys = JSON.parse(localStorage.getItem(NOTIFY_STORAGE_KEY) || "[]");
    return Array.isArray(keys) ? keys.filter((key) => FAVORITE_TEAMS.some((team) => team.key === key)) : [];
  } catch {
    return [];
  }
}

function saveNotifyTeams(keys) {
  try {
    localStorage.setItem(NOTIFY_STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // The choice still holds until the page closes.
  }
}

// "granted" | "denied" | "default" (not asked yet) | "unsupported".
function notificationPermission() {
  return "Notification" in window ? Notification.permission : "unsupported";
}

// Games in `after` that are over but weren't in `before`. A game missing
// from `before` doesn't count, so the first load never notifies.
function newlyFinishedGames(before, after) {
  const wasOver = new Map(before.map((game) => [game.id, game.completed]));
  return after.filter((game) => game.completed && wasOver.get(game.id) === false);
}

// { title: "Final: Bulls 112, Celtics 108", body: "Bulls win at Celtics" }
function finalNotification(favorite, game) {
  const where = `${game.isHome ? "vs" : "at"} ${game.opponent}`;
  if (game.ourScore === null || game.theirScore === null) {
    return { title: `Final: ${favorite.label} ${where}`, body: "Open Chicago Scoreboard for the score" };
  }
  const isSoccer = leagueInfoFor(favorite.league).sport === "soccer";
  const outcome = game.ourScore === game.theirScore ? (isSoccer ? "draw" : "tie") : game.won ? "win" : "lose";
  return {
    title: `Final: ${favorite.label} ${game.ourScore}, ${game.opponent} ${game.theirScore}`,
    body: `${favorite.label} ${outcome} ${where}`,
  };
}

// Pops up a notification for each of the team's games that ended between
// `before` and `after`, if the team is turned on and the browser allows it.
function showFinalNotifications(favorite, before, after, notifyTeams, permission, show = showNotification) {
  if (!notifyTeams.includes(favorite.key) || permission !== "granted") return;
  for (const game of newlyFinishedGames(before, after)) {
    show({ ...finalNotification(favorite, game), icon: game.ourLogos && game.ourLogos.light, tag: `final-${game.id}` });
  }
}

// The tag stops the same game from notifying twice.
function showNotification({ title, body, icon, tag }) {
  const notification = new Notification(title, { body, icon, tag });
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

// Whether notifications may be shown, asking the browser the first time.
async function notificationsAllowed() {
  if (notificationPermission() === "unsupported") return false;
  const permission = notificationPermission() === "default" ? await Notification.requestPermission() : notificationPermission();
  return permission === "granted";
}

const NOTIFICATIONS_ON_BODY = "You'll get the final score when a game ends, while Chicago Scoreboard is open in a tab.";

// Turns a team on or off, asking the browser for permission the first time.
// Returns the teams now on and a message saying what happened.
async function toggleNotifyTeam(notifyTeams, favorite) {
  if (notifyTeams.includes(favorite.key)) {
    return { notifyTeams: notifyTeams.filter((key) => key !== favorite.key), message: `${favorite.label} notifications off` };
  }
  if (!(await notificationsAllowed())) return { notifyTeams, message: null };
  showNotification({ title: `${favorite.label} notifications on`, body: NOTIFICATIONS_ON_BODY, tag: `on-${favorite.key}` });
  return { notifyTeams: [...notifyTeams, favorite.key], message: `${favorite.label} notifications on` };
}

function allTeamsOn(notifyTeams) {
  return FAVORITE_TEAMS.every((favorite) => notifyTeams.includes(favorite.key));
}

// The All teams button: turns every team on, or every team off when all
// are already on.
async function toggleNotifyAllTeams(notifyTeams) {
  if (allTeamsOn(notifyTeams)) return { notifyTeams: [], message: "All team notifications off" };
  if (!(await notificationsAllowed())) return { notifyTeams, message: null };
  showNotification({ title: "All Chicago team notifications on", body: NOTIFICATIONS_ON_BODY, tag: "on-all" });
  return { notifyTeams: FAVORITE_TEAMS.map((favorite) => favorite.key), message: "All team notifications on" };
}

// The Settings page's panel: an All teams button, one button per team, and why it can't work if the
// browser blocks or lacks notifications.
function notifyPanelHtml(notifyTeams, permission, message) {
  const problem = {
    denied: "Notifications are blocked for this site. Allow them in your browser's site settings, then tap a team again.",
    unsupported: "This browser can't show notifications.",
  }[permission];
  const disabled = permission === "unsupported" ? " disabled" : "";
  const allOn = allTeamsOn(notifyTeams);
  // The same gray as the team filter's All teams button: a selected button
  // shows white text on its --team-color, so it needs one.
  const allButton = `
      <button class="team-button ${allOn ? "active" : ""}" style="--team-color:${ALL_TEAMS_COLOR}"
              data-action="notify-all" aria-pressed="${allOn}"${disabled}>
        <span class="dot"></span>All teams
      </button>`;
  const buttons = allButton + FAVORITE_TEAMS.map((favorite) => {
    const on = notifyTeams.includes(favorite.key);
    return `
      <button class="team-button ${on ? "active" : ""}" style="--team-color:${favorite.color}"
              data-action="notify-team" data-team="${favorite.key}" aria-pressed="${on}"${disabled}>
        <span class="dot"></span>${favorite.label}
      </button>`;
  }).join("");
  return `
    <section class="notify-panel" aria-label="Final score notifications">
      <div class="notify-title">🔔 Notify me of final scores</div>
      <div class="notify-note" role="status">${escapeHtml(
        problem || message || "Tap a team, or All teams, to get a notification when its games end, while this page is open in a tab."
      )}</div>
      <div class="team-filter notify-teams">${buttons}</div>
    </section>`;
}
