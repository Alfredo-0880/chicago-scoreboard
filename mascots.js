// Each team's mascot. ESPN has no mascot data, so this is written by hand
// from Wikipedia (the mascots' own articles and the teams' articles,
// checked 2026-11-05). When a team gets a new mascot, change it here (and
// in the tests).
//
// debut is the year the mascot started, or null where Wikipedia doesn't
// say. Pictures are freely licensed photos from Wikimedia Commons, credited
// to their photographers as their licenses require; null where none exists.

const SPARKY_AND_SUPERNOVA_PHOTO = {
  url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Chicago%2C_Fire_and_Red_Stars_mascots%2C_Sparky_and_Supernova.JPG/960px-Chicago%2C_Fire_and_Red_Stars_mascots%2C_Sparky_and_Supernova.JPG",
  alt: "Sparky and Supernova",
  caption: "Sparky (the Dalmatian) with Supernova at a Stars game.",
  credit: "Harvardton, CC BY-SA 4.0",
  link: "https://commons.wikimedia.org/wiki/File:Chicago,_Fire_and_Red_Stars_mascots,_Sparky_and_Supernova.JPG",
};

const MASCOTS = {
  bears: {
    name: "Staley Da Bear",
    debut: "2003",
    about: "Named after A. E. Staley, who founded the Bears. \"Da Bear\" comes from the \"Da Bears!\" catchphrase of Saturday Night Live's \"Superfans\" sketches.",
    fact: "He has been named a Pro Bowl mascot three times: 2004, 2006, and 2007.",
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Staleythebear.jpg",
      alt: "Staley Da Bear",
      credit: "blueyeda73, CC BY 2.0",
      link: "https://commons.wikimedia.org/wiki/File:Staleythebear.jpg",
    },
  },
  bulls: {
    name: "Benny the Bull",
    debut: "1969",
    about: "Named after Ben Bentley, the Bulls' first public relations manager and stadium announcer. He is one of the longest-serving mascots in pro sports.",
    fact: "In a 1974 playoff game in Milwaukee, an early Benny was ejected along with coach Dick Motta and Jerry Sloan for interfering with play.",
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/20180206_UM-NW_Benny_The_Bull_7DM27126.jpg/960px-20180206_UM-NW_Benny_The_Bull_7DM27126.jpg",
      alt: "Benny the Bull",
      credit: "TonyTheTiger, CC BY-SA 4.0",
      link: "https://commons.wikimedia.org/wiki/File:20180206_UM-NW_Benny_The_Bull_7DM27126.jpg",
    },
  },
  cubs: {
    name: "Clark",
    debut: "2014",
    about: "A young, friendly cub named after Clark Street, which runs along Wrigley Field at the famous corner of Clark and Addison.",
    fact: "He is the Cubs' first official mascot in modern times, and the team says he descends from Joa, their live bear mascot in 1916.",
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Clark-the-Cub-01.jpg/960px-Clark-the-Cub-01.jpg",
      alt: "Clark",
      credit: "Arturo Pardavila III, CC BY 2.0",
      link: "https://commons.wikimedia.org/wiki/File:Clark-the-Cub-01.jpg",
    },
  },
  whitesox: {
    name: "Southpaw",
    debut: "2004",
    about: "His name means a left-handed pitcher, and it also points to Chicago's South Side, where the White Sox play.",
    fact: "He is in the Mascot Hall of Fame, and he rode on Illinois's float at Barack Obama's presidential inauguration.",
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Southpaw.jpg/960px-Southpaw.jpg",
      alt: "Southpaw",
      credit: "stringbot on Flickr, CC BY 2.0",
      link: "https://commons.wikimedia.org/wiki/File:Southpaw.jpg",
    },
  },
  blackhawks: {
    name: "Tommy Hawk",
    debut: "2001",
    about: "A hawk in a Blackhawks jersey and hockey pants, introduced in the 2001–02 season.",
    fact: "He wears the Blackhawks' famous four feathers on his head.",
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tommyhawk-mascot-2021.webp/960px-Tommyhawk-mascot-2021.webp",
      alt: "Tommy Hawk",
      credit: "Capt. Michael Ariola, public domain",
      link: "https://commons.wikimedia.org/wiki/File:Tommyhawk-mascot-2021.webp",
    },
  },
  fire: {
    name: "Sparky",
    debut: null,
    about: "A Dalmatian, the classic firehouse dog.",
    fact: "He usually wears the club's jersey, but sometimes shows up in firefighter gear.",
    photo: SPARKY_AND_SUPERNOVA_PHOTO,
  },
  sky: {
    name: "Skye the Lioness",
    debut: "2024",
    about: "Inspired by the famous lion statues at the entrance of the Art Institute of Chicago. She first appeared on August 28, 2024, at Wintrust Arena.",
    fact: "She replaced the Sky's earlier mascot, Sky Guy, who stayed through the 2024 season to help her get started.",
    photo: null,
  },
  stars: {
    name: "Supernova",
    debut: null,
    about: "The Stars' mascot. Wikipedia has little else about Supernova yet.",
    fact: "Supernova sometimes appears at Stars games alongside the Fire's Sparky.",
    photo: SPARKY_AND_SUPERNOVA_PHOTO,
  },
};

function teamMascot(favorite) {
  return MASCOTS[favorite.key];
}
