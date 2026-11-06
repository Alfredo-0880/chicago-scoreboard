// The uniforms each team wore in past seasons, for the Team History tab.
// ESPN has no uniform data, so this is written by hand from Wikipedia (the
// teams' articles and "Logos and uniforms of the Chicago Bears", checked
// 2026-11-05). Only uniforms Wikipedia describes are listed, so some
// seasons have fewer than a team really wore, and some have none.
// One-game uniforms (City Edition, Winter Classic, holiday) aren't listed.
//
// seasons: the seasons a uniform was worn, as [from, to] ranges (to null =
// still worn). Seasons are numbered as ESPN and the History tab number
// them: NBA and NHL seasons by the year they end (2011 = 2010-11).
//
// Colors are as in uniforms.js: jersey, trim, numbers, bottoms, and
// optional pinstripes or band. The drawings are close, not exact.
// Pictures are freely licensed ones from Wikimedia Commons, credited as
// their licenses require.

// A uniform that is still worn today, with the colors from uniforms.js.
function uniformWornToday(teamKey, name, seasons, description) {
  const today = UNIFORMS[teamKey].uniforms.find((uniform) => uniform.name === name);
  return { ...today, seasons, description: description || today.description };
}

const PAST_UNIFORMS = {
  bears: {
    uniforms: [
      uniformWornToday("bears", "Home", [[2005, null]]),
      uniformWornToday("bears", "Away", [[2005, null]]),
      uniformWornToday("bears", "Alternate", [[2005, 2011], [2018, 2024]], "Orange jersey, with navy as the trim. Worn a few times a season; it was retired after 2011 and brought back in 2018."),
      { name: "Throwback", seasons: [[2010, 2010], [2012, 2018]], jersey: "#0B162A", trim: "#C83803", numbers: "#C83803", bottoms: "#FFFFFF", description: "The 1940s \"Monsters of the Midway\" throwback: navy jersey with orange numbers and sleeve stripes, white pants, and a navy helmet with no logo." },
      { name: "Throwback", seasons: [[2019, 2024]], jersey: "#FFFFFF", trim: "#0B162A", numbers: "#0B162A", bottoms: "#0B162A", description: "The 1936 throwback from the team's 100th season: white jersey with navy block numbers and orange and navy stripes, navy pants, and striped socks." },
    ],
    pictures: [
      {
        seasons: [[2010, 2018]],
        url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Ch_bears_uniforms.png",
        alt: "Chicago Bears uniforms, 2010 to 2018",
        caption: "Home, away, and the 1940s throwback (2010–2018).",
        credit: "Fernando Martello, CC BY-SA 4.0",
        link: "https://commons.wikimedia.org/wiki/File:Ch_bears_uniforms.png",
      },
      {
        seasons: [[2019, 2021]],
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chicago_Bears_Uniforms_%282019%29.png/1280px-Chicago_Bears_Uniforms_%282019%29.png",
        alt: "Chicago Bears uniforms, 2019 to 2021",
        caption: "Home, away, orange alternate, and the 1936 throwback (2019–2021).",
        credit: "TheGoodGeneral 1, CC BY 4.0",
        link: "https://commons.wikimedia.org/wiki/File:Chicago_Bears_Uniforms_(2019).png",
      },
      {
        seasons: [[2022, 2024]],
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Chicago_Bears_Uniforms_%282022%29.png/1280px-Chicago_Bears_Uniforms_%282022%29.png",
        alt: "Chicago Bears uniforms, 2022 to 2024",
        caption: "The uniforms from 2022 to 2024, with the orange helmet added in 2022.",
        credit: "TheGoodGeneral 1, CC BY 4.0",
        link: "https://commons.wikimedia.org/wiki/File:Chicago_Bears_Uniforms_(2022).png",
      },
      {
        seasons: [[2025, 2025]],
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Chicago_Bears_Uniforms_%282025%29.png/1280px-Chicago_Bears_Uniforms_%282025%29.png",
        alt: "Chicago Bears uniforms, 2025",
        caption: "Only home and away in 2025, in honor of owner Virginia Halas McCaskey.",
        credit: "DaRealConMan, CC BY-SA 4.0",
        link: "https://commons.wikimedia.org/wiki/File:Chicago_Bears_Uniforms_(2025).png",
      },
    ],
  },
  bulls: {
    // From 2017-18 to 2020-21 the red uniform was worn at home and the white
    // one away; before and after, the other way around.
    uniforms: [
      uniformWornToday("bulls", "Home", [[2005, 2017]], "White with \"BULLS\" and numbers in red, trimmed in black."),
      uniformWornToday("bulls", "Home", [[2022, null]]),
      { ...UNIFORMS.bulls.uniforms[1], name: "Home", seasons: [[2018, 2021]], description: "Red \"Icon\" uniform with \"BULLS\" and numbers in white, worn at home from 2017-18 to 2020-21." },
      uniformWornToday("bulls", "Away", [[2005, 2017]], "Red with \"BULLS\" and numbers in white, trimmed in black."),
      uniformWornToday("bulls", "Away", [[2022, null]]),
      { ...UNIFORMS.bulls.uniforms[0], name: "Away", seasons: [[2018, 2021]], description: "White \"Association\" uniform with \"BULLS\" and numbers in red, worn on the road from 2017-18 to 2020-21." },
      { name: "Alternate", seasons: [[2005, 2006]], jersey: "#111111", trim: "#CE1141", numbers: "#CE1141", bottoms: "#111111", description: "Black uniform without pinstripes, with \"CHICAGO\" across the front." },
      { name: "Alternate", seasons: [[2007, 2019]], jersey: "#111111", trim: "#CE1141", numbers: "#FFFFFF", bottoms: "#111111", description: "Black uniform styled like the red and white ones, with a red diamond on the shorts. Sleeves were added for 2014-15, and Nike named it the \"Statement\" uniform in 2017." },
      { name: "Alternate", seasons: [[2020, 2025]], jersey: "#111111", trim: "#CE1141", numbers: "#CE1141", bottoms: "#111111", pinstripes: "#4A4A4A", description: "Black \"Statement\" uniform with dark gray pinstripes, a red diamond, and four six-point stars on the waistband." },
      { name: "Throwback", seasons: [[2006, 2006]], jersey: "#CE1141", trim: "#1D428A", numbers: "#FFFFFF", bottoms: "#1D428A", description: "Honored the old Chicago Stags with red tops and blue shorts." },
    ],
  },
  cubs: {
    uniforms: [
      uniformWornToday("cubs", "Home", [[2005, null]]),
      uniformWornToday("cubs", "Away", [[2005, null]]),
      uniformWornToday("cubs", "Alternate", [[2005, null]]),
      { name: "Second road", seasons: [[2014, 2015]], jersey: "#B9BCBE", trim: "#0E3386", numbers: "#CC3433", bottoms: "#B9BCBE", description: "A second gray road uniform with \"Cubs\" in block letters, blue piping, and red block numbers. It lasted two seasons." },
      { name: "City Connect", seasons: [[2021, 2024]], jersey: "#0C2340", trim: "#8DB9E3", numbers: "#8DB9E3", bottoms: "#0C2340", description: "Navy with light blue, with \"Wrigleyville\" across the chest like the Wrigley Field marquee." },
      { name: "Powder blue", seasons: [[2025, null]], jersey: "#8DB9E3", trim: "#0E3386", numbers: "#CC3433", bottoms: "#FFFFFF", description: "Powder blue home alternate inspired by Chicago blues music, with red numbers. Worn at Friday day games in the summer." },
    ],
  },
  whitesox: {
    uniforms: [
      uniformWornToday("whitesox", "Home", [[2005, null]]),
      uniformWornToday("whitesox", "Away", [[2005, null]]),
      uniformWornToday("whitesox", "Alternate", [[2005, null]]),
      { name: "Throwback", seasons: [[2012, 2012]], jersey: "#FFFFFF", trim: "#C8102E", numbers: "#C8102E", bottoms: "#FFFFFF", pinstripes: "#C8102E", description: "The 1972 uniform with red pinstripes, worn at home on Sundays." },
      { name: "Throwback", seasons: [[2013, 2023]], jersey: "#FFFFFF", trim: "#C8102E", numbers: "#0C2340", bottoms: "#FFFFFF", band: "#0C2340", description: "The 1983 \"Winning Ugly\" uniform, with \"SOX\" inside a blue stripe trimmed in red across the chest. Worn at home on Sundays." },
      { name: "City Connect", seasons: [[2021, 2024]], jersey: "#27251F", trim: "#C4CED4", numbers: "#FFFFFF", bottoms: "#27251F", pinstripes: "#C4CED4", description: "All black with silver pinstripes and \"Southside\" across the chest." },
      { name: "City Connect", seasons: [[2025, null]], jersey: "#C8102E", trim: "#27251F", numbers: "#FFFFFF", bottoms: "#27251F", pinstripes: "#27251F", description: "Red with black sleeves and pinstripes, based on the Chicago Bulls (who have the same owner)." },
    ],
  },
  blackhawks: {
    uniforms: [
      uniformWornToday("blackhawks", "Home", [[2005, null]]),
      uniformWornToday("blackhawks", "Away", [[2005, null]]),
      uniformWornToday("blackhawks", "Alternate", [[2005, 2007], [2009, 2009]], "Black sweater with red and white stripes, worn from 1996 to 2007 and again in 2008-09."),
      { name: "Alternate", seasons: [[2010, 2011]], jersey: "#000000", trim: "#CF0A2C", numbers: "#FFFFFF", bottoms: "#000000", band: "#D9C9A3", description: "Based on the 1936-37 sweater: black with a wide beige stripe across the chest, and the old round Black Hawks logo. First worn at the 2009 Winter Classic." },
    ],
  },
  fire: {
    uniforms: [
      { name: "Home", seasons: [[2005, 2011]], jersey: "#E4202C", trim: "#FFFFFF", numbers: "#FFFFFF", bottoms: "#E4202C", band: "#FFFFFF", description: "All-red shirt with a white stripe across the chest, like a Chicago firefighter's coat." },
      { name: "Home", seasons: [[2012, 2013]], jersey: "#E4202C", trim: "#FFFFFF", numbers: "#FFFFFF", bottoms: "#E4202C", band: "#1B3C8C", description: "Red shirt with the chest stripe changed from white to blue." },
      { name: "Home", seasons: [[2021, 2023]], jersey: "#16164E", trim: "#E4202C", numbers: "#FFFFFF", bottoms: "#16164E", description: "Navy shirt and shorts with red socks." },
      { name: "Home", seasons: [[2024, 2025]], jersey: "#E4202C", trim: "#FFFFFF", numbers: "#FFFFFF", bottoms: "#E4202C", description: "All red: shirt, shorts, and socks." },
      { name: "Third", seasons: [[2005, 2005], [2014, 2016]], jersey: "#FFFFFF", trim: "#E4202C", numbers: "#E4202C", bottoms: "#FFFFFF", band: "#41B6E6", description: "Third shirt based on the Flag of Chicago." },
    ],
  },
  sky: {
    uniforms: [
      { name: "Home", seasons: [[2006, 2010]], jersey: "#FFFFFF", trim: "#418FDE", numbers: "#418FDE", bottoms: "#FFFFFF", description: "White with light blue on the sides and a light blue collar." },
      { name: "Away", seasons: [[2006, 2010]], jersey: "#418FDE", trim: "#FFCD00", numbers: "#FFFFFF", bottoms: "#418FDE", description: "Light blue with gold on the sides and a gold collar." },
      { name: "Home", seasons: [[2011, 2018]], jersey: "#FFFFFF", trim: "#418FDE", numbers: "#FFCD00", bottoms: "#FFFFFF", description: "White with light blue stripes on the sides, and the team name and numbers in gold." },
      { name: "Away", seasons: [[2011, 2018]], jersey: "#418FDE", trim: "#FFCD00", numbers: "#FFCD00", bottoms: "#418FDE", description: "Light blue with gold stripes on the sides, and the team name and numbers in gold." },
      { name: "Alternate", seasons: [[2016, 2018]], jersey: "#FFCD00", trim: "#418FDE", numbers: "#418FDE", bottoms: "#FFCD00", description: "Gold uniform, added in 2016 when every WNBA game became a matchup of two colored uniforms." },
      uniformWornToday("sky", "Home", [[2021, null]]),
      uniformWornToday("sky", "Away", [[2021, null]]),
      uniformWornToday("sky", "Alternate", [[2021, null]]),
    ],
  },
  stars: {
    // The club took its new name and colors in 2025; Wikipedia doesn't
    // describe the Red Stars' uniforms.
    uniforms: [uniformWornToday("stars", "Home", [[2025, null]]), uniformWornToday("stars", "Away", [[2025, null]])],
  },
};

const UNIFORM_ORDER = ["Home", "Away", "Alternate", "Third", "Throwback"];

function wornIn(seasons, season) {
  return seasons.some(([from, to]) => season >= from && (to === null || season <= to));
}

// { uniforms, picture } for one season: the uniforms worn then (home, away,
// alternate, third, throwback, then the rest), and a picture or null.
function uniformsForSeason(favorite, season) {
  const { uniforms, pictures = [] } = PAST_UNIFORMS[favorite.key];
  const rank = (uniform) => (UNIFORM_ORDER.includes(uniform.name) ? UNIFORM_ORDER.indexOf(uniform.name) : UNIFORM_ORDER.length);
  return {
    uniforms: uniforms.filter((uniform) => wornIn(uniform.seasons, season)).sort((a, b) => rank(a) - rank(b)),
    picture: pictures.find((picture) => wornIn(picture.seasons, season)) || null,
  };
}
