// Draws the Settings page, opened from the Settings button in the top row.
// It holds the time zone choice (common.js): every option is listed, so
// people can see them all at once, and the chosen one is marked. Below it
// are final score notifications (notify.js), moved here from the Games tab;
// notifyHtml is that panel, drawn by the app from its saved choices.

function settingsPageHtml(notifyHtml = "") {
  const options = TIME_ZONE_CHOICES.map((choice) => {
    const chosen = choice.value === timeZoneChoice;
    return `
      <button class="time-zone-option ${chosen ? "active" : ""}" role="radio" aria-checked="${chosen}"
              data-action="time-zone" data-zone="${choice.value}">${escapeHtml(timeZoneLabel(choice.value))}</button>`;
  }).join("");
  return `
    <div class="season-note">Settings are saved on this device.</div>
    <section class="settings-group">
      <h3 class="hof-group">Time zone</h3>
      <p class="uniform-note">Game times and dates show in this time zone. Away from Chicago? Pick yours. Now showing ${escapeHtml(timeZoneDescription())}.</p>
      <div class="time-zone-options" role="radiogroup" aria-label="Time zone">${options}</div>
    </section>
    ${notifyHtml}`;
}
