// Chicago's weather forecast for outdoor home games: the Bears and Fire at
// Soldier Field, the Cubs at Wrigley Field, the White Sox at Rate Field, and
// the Stars in Bridgeview. (The Bulls, Blackhawks, and Sky play indoors.)
// One forecast for the city, hour by hour for the next 16 days, from
// Open-Meteo, which is free and needs no key.

const OUTDOOR_HOME_TEAMS = ["bears", "cubs", "whitesox", "fire", "stars"];
const FORECAST_DAYS = 16;
const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=41.88&longitude=-87.63" +
  "&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m" +
  "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code" +
  `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago&forecast_days=${FORECAST_DAYS}`;

// The forecast once loaded (parseForecast), or null: before it loads, if
// it failed, or in the tests. The app sets it.
let chicagoForecast = null;

// Whether a game gets a forecast: an outdoor home game that hasn't started
// and is within the forecast's 16 days.
function needsForecast(game, now) {
  return (
    OUTDOOR_HOME_TEAMS.includes(game.teamKey) &&
    game.isHome &&
    game.state === "pre" &&
    game.date - now < FORECAST_DAYS * 24 * 60 * 60 * 1000
  );
}

async function fetchChicagoForecast() {
  const response = await fetch(FORECAST_URL);
  if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
  return parseForecast(await response.json());
}

// Open-Meteo's answer -> { hours: Map("2026-11-22T12:00" -> {...}),
// days: Map("2026-11-22" -> {...}) }, in Chicago time.
function parseForecast(data) {
  const hours = new Map();
  data.hourly.time.forEach((time, index) => {
    hours.set(time, {
      temperature: data.hourly.temperature_2m[index],
      rainChance: data.hourly.precipitation_probability[index],
      code: data.hourly.weather_code[index],
      wind: data.hourly.wind_speed_10m[index],
    });
  });
  const days = new Map();
  data.daily.time.forEach((day, index) => {
    days.set(day, {
      high: data.daily.temperature_2m_max[index],
      low: data.daily.temperature_2m_min[index],
      rainChance: data.daily.precipitation_probability_max[index],
      code: data.daily.weather_code[index],
    });
  });
  return { hours, days };
}

// A time's hour in Chicago, "2026-11-22T12:00", rounded to the nearest
// hour, the way Open-Meteo labels its hours. Always Chicago time, whatever
// time zone the app shows, since the forecast is for Chicago.
function chicagoHourKey(date) {
  const rounded = new Date(Math.round(date.getTime() / 3600000) * 3600000);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(rounded)
      .map((part) => [part.type, part.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:00`;
}

// Open-Meteo's weather codes (the WMO's), as words with a picture.
function weatherWords(code) {
  if (code === 0) return "☀️ Clear";
  if (code === 1) return "🌤️ Mostly clear";
  if (code === 2) return "⛅ Partly cloudy";
  if (code === 3) return "☁️ Cloudy";
  if (code === 45 || code === 48) return "🌫️ Fog";
  if (code >= 51 && code <= 55) return "🌦️ Drizzle";
  if (code === 56 || code === 57 || code === 66 || code === 67) return "🌧️ Freezing rain";
  if (code >= 61 && code <= 65) return "🌧️ Rain";
  if (code >= 71 && code <= 77) return "❄️ Snow";
  if (code >= 80 && code <= 82) return "🌦️ Rain showers";
  if (code === 85 || code === 86) return "🌨️ Snow showers";
  if (code >= 95) return "⛈️ Thunderstorms";
  return "Weather unknown";
}

// "Forecast: ☁️ Cloudy, 59°F, 71% chance of rain or snow, wind 9 mph" for a game,
// or null when it gets none. A game with no start time yet gets the day's
// forecast instead.
function gameForecastText(game, forecast = chicagoForecast, now = new Date()) {
  if (!forecast || !needsForecast(game, now)) return null;
  if (game.timeKnown) {
    const hour = forecast.hours.get(chicagoHourKey(game.date));
    if (!hour) return null;
    return `Forecast: ${weatherWords(hour.code)}, ${Math.round(hour.temperature)}°F, ${hour.rainChance}% chance of rain or snow, wind ${Math.round(hour.wind)} mph`;
  }
  const day = forecast.days.get(chicagoHourKey(game.date).slice(0, 10));
  if (!day) return null;
  return `Forecast for the day: ${weatherWords(day.code)}, high ${Math.round(day.high)}°F, low ${Math.round(day.low)}°F, ${day.rainChance}% chance of rain or snow`;
}
