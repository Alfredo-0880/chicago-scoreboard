// Light or dark theme, and team colors. The theme choice (Auto, Light, or
// Dark) is saved in this browser; Auto follows the device's own setting.
// The colors choice (Classic or a team) is saved too. This file loads in the
// page's <head> so the theme is set before anything is drawn, with no flash
// of the wrong colors.

const THEME_CHOICES = ["auto", "light", "dark"];
const THEME_STORAGE_KEY = "chicago-scoreboard-theme";
const systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

// Saved choice, or "auto" if there is none or the browser blocks storage.
function savedThemeChoice() {
  try {
    const choice = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_CHOICES.includes(choice) ? choice : "auto";
  } catch {
    return "auto";
  }
}

function saveThemeChoice(choice) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage can be blocked (private browsing); the theme still applies
    // until the page closes.
  }
}

// "auto" becomes "light" or "dark" depending on the device's setting.
function resolveTheme(choice, deviceIsDark) {
  if (choice === "auto") return deviceIsDark ? "dark" : "light";
  return choice;
}

function applyTheme(choice) {
  document.documentElement.dataset.theme = resolveTheme(choice, systemDarkQuery.matches);
}

applyTheme(savedThemeChoice());

// Classic is the original navy and red; each team's colors are in
// styles.css. Listed here, not taken from FAVORITE_TEAMS, because this file
// loads before common.js.
const COLOR_CHOICES = ["classic", "bears", "bulls", "cubs", "whitesox", "blackhawks", "fire", "sky", "stars"];
const COLORS_STORAGE_KEY = "chicago-scoreboard-colors";

// Saved choice, or "classic" if there is none or the browser blocks storage.
function savedColorChoice() {
  try {
    const choice = localStorage.getItem(COLORS_STORAGE_KEY);
    return COLOR_CHOICES.includes(choice) ? choice : "classic";
  } catch {
    return "classic";
  }
}

function saveColorChoice(choice) {
  try {
    localStorage.setItem(COLORS_STORAGE_KEY, choice);
  } catch {
    // As with the theme, the colors still apply until the page closes.
  }
}

function applyColors(choice) {
  if (choice === "classic") delete document.documentElement.dataset.colors;
  else document.documentElement.dataset.colors = choice;
}

applyColors(savedColorChoice());
