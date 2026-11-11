// The diagnostics log: JavaScript errors and failed ESPN loads, kept in
// this browser's storage so problems that happen while nobody is watching
// can be read later on the Diagnostics page (linked in the footer). Each
// device keeps its own log; nothing is sent anywhere. Loaded before the
// other files so it catches their errors too.

const DIAGNOSTICS_STORAGE_KEY = "chicagoScoreboard.diagnostics";
const DIAGNOSTICS_KEPT = 50;

// entries is newest first; returns it with entry added, keeping the newest.
function addDiagnostic(entries, entry, limit = DIAGNOSTICS_KEPT) {
  return [entry, ...entries].slice(0, limit);
}

// Storage can be missing or refuse (private windows), so the log is a
// convenience that never breaks the app.
function readDiagnostics() {
  try {
    const entries = JSON.parse(localStorage.getItem(DIAGNOSTICS_STORAGE_KEY) || "[]");
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function saveDiagnostics(entries) {
  try {
    localStorage.setItem(DIAGNOSTICS_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Nothing to do: the log just isn't kept on this device.
  }
}

// Where the app was: { tab, team }. app.js defines currentPlaceForDiagnostics;
// an error before it loads happened while the app was starting.
function placeForDiagnostics() {
  return typeof currentPlaceForDiagnostics === "function" ? currentPlaceForDiagnostics() : { tab: "Starting up", team: "" };
}

// Reports a problem in the browser's console, as before, and adds it to
// the log. kind is "ESPN" (a load that failed) or "JavaScript".
function recordProblem(kind, message, error) {
  console.error(message, error);
  const detail = error ? (error instanceof Error ? error.message : String(error)) : "";
  const entry = { time: new Date().toISOString(), kind, ...placeForDiagnostics(), message, detail };
  saveDiagnostics(addDiagnostic(readDiagnostics(), entry));
}

window.addEventListener("error", (event) => {
  const where = event.filename ? ` (${event.filename.split("/").pop()}, line ${event.lineno})` : "";
  recordProblem("JavaScript", `${event.message}${where}`);
});
window.addEventListener("unhandledrejection", (event) => recordProblem("JavaScript", "An error nothing caught", event.reason));
