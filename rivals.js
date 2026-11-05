// Each team's main rival. Who the rivals are and their histories are
// written by hand from Wikipedia (the rivalry articles and the teams'
// articles, checked 2026-11-05); this season's games against them come
// live from the schedules the app already loads.
//
// abbreviation is how ESPN's schedules name the rival. Alfredo picked the
// Fire's rival (Wikipedia says fans disagree), and chose to show no rival
// for the Stars, since Wikipedia names none.

const RIVALS = {
  bears: {
    name: "Green Bay Packers",
    abbreviation: "GB",
    history:
      "The NFL's most-played matchup, with 213 meetings between two of the league's oldest teams. They have met three times in the playoffs, most recently in the 2025 season's NFC Wild Card round, which the Bears won 31–27.",
  },
  bulls: {
    name: "Detroit Pistons",
    abbreviation: "DET",
    history:
      "At its fiercest in the late 1980s, when Michael Jordan's Bulls met the Pistons in the playoffs four years in a row. Detroit won in 1988, 1989, and 1990 before the Bulls swept them in 1991.",
  },
  cubs: {
    name: "St. Louis Cardinals",
    abbreviation: "STL",
    history:
      "Also called the I-55 Series, since both cities sit on Interstate 55 (once Route 66). Fans of both teams fill each other's ballparks, and the Cardinals lead in World Series titles, 11 to the Cubs' 3.",
  },
  whitesox: {
    name: "Chicago Cubs",
    abbreviation: "CHC",
    history:
      "The Crosstown Classic. Apart from the 1906 World Series, which the White Sox won, the two Chicago teams never met in an official game until interleague play began in 1997.",
  },
  blackhawks: {
    name: "Detroit Red Wings",
    abbreviation: "DET",
    history:
      "Two of the NHL's Original Six teams, who have met 16 times in the playoffs, starting with the 1934 Stanley Cup Final, which Chicago won. It was the league's most intense rivalry until the teams were put in different conferences in 2013.",
  },
  fire: {
    name: "New England Revolution",
    abbreviation: "NE",
    history:
      "MLS's most frequent playoff matchup: they met in the playoffs 8 times in 10 seasons from 2000 to 2009, and each team won 4.",
  },
  sky: {
    name: "Indiana Fever",
    abbreviation: "IND",
    history:
      "Grew from the rivalry between the Sky's Angel Reese and the Fever's Caitlin Clark, which began in the 2023 NCAA championship game and helped bring many new fans to the WNBA.",
  },
  stars: null,
};

function teamRival(favorite) {
  return RIVALS[favorite.key];
}

// This season's games against the rival, leaving out preseason games:
// { played, upcoming, record }. The record counts only finished games with
// a score.
function gamesAgainstRival(games, rival) {
  const against = games.filter((game) => game.opponentAbbreviation === rival.abbreviation && !game.preseason);
  const played = against.filter((game) => game.completed);
  const scored = played.filter((game) => game.ourScore !== null && game.theirScore !== null);
  const ties = scored.filter((game) => game.ourScore === game.theirScore).length;
  const wins = scored.filter((game) => game.won).length;
  return {
    played,
    upcoming: against.filter((game) => !game.completed),
    record: { wins, losses: scored.length - wins - ties, ties },
  };
}

// "1 win, 1 loss", adding ties (draws in soccer) only when there are any.
function rivalRecordText({ wins, losses, ties }, sport) {
  const count = (number, one, many) => `${number} ${number === 1 ? one : many}`;
  const parts = [count(wins, "win", "wins"), count(losses, "loss", "losses")];
  if (ties > 0) parts.push(sport === "soccer" ? count(ties, "draw", "draws") : count(ties, "tie", "ties"));
  return parts.join(", ");
}
