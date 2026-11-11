// Draws the Diagnostics page: the problems this device logged
// (diagnostics.js), newest first, with a button to clear them.

// entries: newest first. message: what the last tap here did, or null.
function diagnosticsPageHtml(entries, message) {
  const intro = `
    <div class="season-note">
      Problems the app ran into on this device: JavaScript errors and data that failed to load. The newest
      ${DIAGNOSTICS_KEPT} are kept here, on this device only; nothing is sent anywhere.
    </div>`;
  const confirmation = message ? `<div class="diagnostics-confirmation" role="status">${escapeHtml(message)}</div>` : "";
  if (entries.length === 0) {
    return `${intro}${confirmation}<div class="message">No problems logged on this device.</div>`;
  }
  return `
    ${intro}
    <div class="diagnostics-actions">
      <span>${entries.length} ${entries.length === 1 ? "problem" : "problems"} logged</span>
      <button class="diagnostics-clear" data-action="clear-diagnostics">Clear log</button>
    </div>
    ${confirmation}
    <ol class="diagnostics-list">${entries.map(diagnosticHtml).join("")}</ol>`;
}

function diagnosticHtml(entry) {
  const time = new Date(entry.time);
  const when = Number.isNaN(time.getTime())
    ? "Unknown time"
    : time.toLocaleString("en-US", { timeZone: "America/Chicago", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" });
  const where = [entry.tab, entry.team].filter(Boolean).join(" · ");
  return `
    <li class="diagnostic">
      <div class="diagnostic-head">
        <span class="diagnostic-kind">${escapeHtml(entry.kind || "Problem")}</span>
        <span class="diagnostic-when">${escapeHtml(when)}${where ? ` · ${escapeHtml(where)}` : ""}</span>
      </div>
      <div class="diagnostic-message">${escapeHtml(entry.message || "")}</div>
      ${entry.detail ? `<div class="diagnostic-detail">${escapeHtml(entry.detail)}</div>` : ""}
    </li>`;
}
