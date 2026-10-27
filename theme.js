// Light or dark theme. The choice (Auto, Light, or Dark) is saved in this
// browser; Auto follows the device's own setting. This file loads in the
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
