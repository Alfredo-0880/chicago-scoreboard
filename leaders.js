// Each team's all-time (career) leaders in a few key stats. ESPN doesn't
// keep franchise records, so this is copied by hand from Wikipedia's team
// records pages and articles (checked 2026-11-06), and for the Bears and
// White Sox, whose pages give only the leader, from StatMuse and Baseball
// Reference (2026-11-12). Players still active keep adding to their totals,
// so these go out of date; update them here. years are the seasons each
// player played for the team, from their own Wikipedia article where the
// source list didn't give them (playing years only, not coaching; an NBA
// season counts as the year it started through the year it ended).
//
// Each category lists the top 5 where a source gives it, and only the
// leader otherwise (note says so). Players tied for a spot share its rank,
// and a tie at 5th lists everyone tied. note says what the numbers cover
// where it isn't plain.

const ALL_TIME_LEADERS = {
  bears: {
    note: "Ranks 2–5 from StatMuse (Wikipedia lists only each leader), as of 2026-11-12. Sacks count from 1982, when they became an official stat.",
    categories: [
      {
        name: "Passing yards",
        leaders: [
          { rank: 1, name: "Jay Cutler", value: "23,443", years: "2009–2016" },
          { rank: 2, name: "Sid Luckman", value: "14,686", years: "1939–1950" },
          { rank: 3, name: "Jim Harbaugh", value: "11,567", years: "1987–1993" },
          { rank: 4, name: "Jim McMahon", value: "11,203", years: "1982–1988" },
          { rank: 5, name: "Mitchell Trubisky", value: "10,609", years: "2017–2020" },
        ],
      },
      {
        name: "Rushing yards",
        leaders: [
          { rank: 1, name: "Walter Payton", value: "16,726", years: "1975–1987" },
          { rank: 2, name: "Matt Forte", value: "8,602", years: "2008–2015" },
          { rank: 3, name: "Neal Anderson", value: "6,166", years: "1986–1993" },
          { rank: 4, name: "Rick Casares", value: "5,657", years: "1955–1964" },
          { rank: 5, name: "Gale Sayers", value: "4,956", years: "1965–1971" },
        ],
      },
      {
        name: "Receiving yards",
        leaders: [
          { rank: 1, name: "Johnny Morris", value: "5,059", years: "1958–1967" },
          { rank: 2, name: "Harlon Hill", value: "4,616", years: "1954–1961" },
          { rank: 3, name: "Alshon Jeffery", value: "4,549", years: "2012–2016" },
          { rank: 4, name: "Walter Payton", value: "4,538", years: "1975–1987" },
          { rank: 5, name: "Mike Ditka", value: "4,503", years: "1961–1966" },
        ],
      },
      {
        name: "Sacks",
        leaders: [
          { rank: 1, name: "Richard Dent", value: "124.5", years: "1983–1993, 1995" },
          { rank: 2, name: "Steve McMichael", value: "92.5", years: "1981–1993" },
          { rank: 3, name: "Dan Hampton", value: "57", years: "1979–1990" },
          { rank: 4, name: "Alex Brown", value: "43.5", years: "2002–2009" },
          { rank: 5, name: "Adewale Ogunleye", value: "42", years: "2004–2009" },
          { rank: 5, name: "Trace Armstrong", value: "42", years: "1989–1994" },
        ],
      },
    ],
  },
  bulls: {
    note: "As of the end of the 2025–26 season.",
    categories: [
      {
        name: "Points",
        leaders: [
          { rank: 1, name: "Michael Jordan", value: "29,277", years: "1984–1993, 1995–1998" },
          { rank: 2, name: "Scottie Pippen", value: "15,123", years: "1987–1998, 2003–2004" },
          { rank: 3, name: "Bob Love", value: "12,623", years: "1968–1976" },
          { rank: 4, name: "Luol Deng", value: "10,286", years: "2004–2014" },
          { rank: 5, name: "Jerry Sloan", value: "10,233", years: "1966–1976" },
        ],
      },
      {
        name: "Rebounds",
        leaders: [
          { rank: 1, name: "Michael Jordan", value: "5,836", years: "1984–1993, 1995–1998" },
          { rank: 2, name: "Tom Boerwinkle", value: "5,745", years: "1968–1978" },
          { rank: 3, name: "Scottie Pippen", value: "5,726", years: "1987–1998, 2003–2004" },
          { rank: 4, name: "Joakim Noah", value: "5,387", years: "2007–2016" },
          { rank: 5, name: "Jerry Sloan", value: "5,385", years: "1966–1976" },
        ],
      },
      {
        name: "Assists",
        leaders: [
          { rank: 1, name: "Michael Jordan", value: "5,012", years: "1984–1993, 1995–1998" },
          { rank: 2, name: "Scottie Pippen", value: "4,494", years: "1987–1998, 2003–2004" },
          { rank: 3, name: "Kirk Hinrich", value: "3,811", years: "2003–2010, 2012–2016" },
          { rank: 4, name: "Norm Van Lier", value: "3,676", years: "1971–1978" },
          { rank: 5, name: "Derrick Rose", value: "2,516", years: "2008–2016" },
        ],
      },
    ],
  },
  cubs: {
    categories: [
      {
        name: "Hits",
        leaders: [
          { rank: 1, name: "Cap Anson", value: "2,995", years: "1876–1897" },
          { rank: 2, name: "Ernie Banks", value: "2,583", years: "1953–1971" },
          { rank: 3, name: "Billy Williams", value: "2,510", years: "1959–1974" },
          { rank: 4, name: "Ryne Sandberg", value: "2,385", years: "1982–1994, 1996–1997" },
          { rank: 5, name: "Mark Grace", value: "2,201", years: "1988–2000" },
        ],
      },
      {
        name: "Home runs",
        leaders: [
          { rank: 1, name: "Sammy Sosa", value: "545", years: "1992–2004" },
          { rank: 2, name: "Ernie Banks", value: "512", years: "1953–1971" },
          { rank: 3, name: "Billy Williams", value: "392", years: "1959–1974" },
          { rank: 4, name: "Ron Santo", value: "337", years: "1960–1973" },
          { rank: 5, name: "Ryne Sandberg", value: "282", years: "1982–1994, 1996–1997" },
        ],
      },
      {
        name: "Pitching wins",
        leaders: [
          { rank: 1, name: "Charlie Root", value: "201", years: "1926–1941" },
          { rank: 2, name: "Mordecai Brown", value: "188", years: "1904–1912, 1916" },
          { rank: 3, name: "Bill Hutchison", value: "181", years: "1889–1895" },
          { rank: 4, name: "Larry Corcoran", value: "175", years: "1880–1885" },
          { rank: 5, name: "Fergie Jenkins", value: "167", years: "1966–1973, 1982–1983" },
        ],
      },
    ],
  },
  whitesox: {
    note: "Ranks 2–5 from Baseball Reference (Wikipedia lists only each leader), as of 2026-11-12.",
    categories: [
      {
        name: "Hits",
        leaders: [
          { rank: 1, name: "Luke Appling", value: "2,749", years: "1930–1943, 1945–1950" },
          { rank: 2, name: "Nellie Fox", value: "2,470", years: "1950–1963" },
          { rank: 3, name: "Paul Konerko", value: "2,292", years: "1999–2014" },
          { rank: 4, name: "Frank Thomas", value: "2,136", years: "1990–2005" },
          { rank: 5, name: "Eddie Collins", value: "2,007", years: "1915–1926" },
        ],
      },
      {
        name: "Home runs",
        leaders: [
          { rank: 1, name: "Frank Thomas", value: "448", years: "1990–2005" },
          { rank: 2, name: "Paul Konerko", value: "432", years: "1999–2014" },
          { rank: 3, name: "José Abreu", value: "243", years: "2014–2022" },
          { rank: 4, name: "Harold Baines", value: "221", years: "1980–1989, 1996–1997, 2000–2001" },
          { rank: 5, name: "Carlton Fisk", value: "214", years: "1981–1993" },
        ],
      },
      {
        name: "Pitching wins",
        leaders: [
          { rank: 1, name: "Ted Lyons", value: "260", years: "1923–1942, 1946" },
          { rank: 2, name: "Red Faber", value: "254", years: "1914–1933" },
          { rank: 3, name: "Ed Walsh", value: "195", years: "1904–1916" },
          { rank: 4, name: "Billy Pierce", value: "186", years: "1949–1961" },
          { rank: 5, name: "Wilbur Wood", value: "163", years: "1967–1978" },
        ],
      },
    ],
  },
  blackhawks: {
    note: "Regular season only. Wikipedia lists the top 5 in goals, and only the leader in assists and points.",
    categories: [
      {
        name: "Goals",
        leaders: [
          { rank: 1, name: "Bobby Hull", value: "604", years: "1957–1972" },
          { rank: 2, name: "Stan Mikita", value: "541", years: "1959–1979" },
          { rank: 3, name: "Patrick Kane", value: "446", years: "2007–2023" },
          { rank: 4, name: "Steve Larmer", value: "406", years: "1981–1993" },
          { rank: 5, name: "Denis Savard", value: "377", years: "1980–1990, 1995–1997" },
        ],
      },
      { name: "Assists", leaders: [{ rank: 1, name: "Stan Mikita", value: "926", years: "1959–1979" }] },
      { name: "Points", leaders: [{ rank: 1, name: "Stan Mikita", value: "1,467", years: "1959–1979" }] },
    ],
  },
  fire: {
    note: "All competitions: MLS, playoffs, U.S. Open Cup, CONCACAF, and others.",
    categories: [
      {
        name: "Goals",
        leaders: [
          { rank: 1, name: "Ante Razov", value: "95", years: "1998–2000, 2001–2004" },
          { rank: 2, name: "Nemanja Nikolić", value: "56", years: "2017–2019" },
          { rank: 3, name: "Chris Rolfe", value: "55", years: "2005–2009, 2012–2014" },
          { rank: 4, name: "Hugo Cuypers", value: "44", years: "2024–2026" },
          { rank: 5, name: "Josh Wolff", value: "39", years: "1998–2002" },
        ],
      },
      {
        name: "Appearances",
        leaders: [
          { rank: 1, name: "C. J. Brown", value: "350", years: "1998–2010" },
          { rank: 2, name: "Logan Pause", value: "317", years: "2003–2014" },
          { rank: 3, name: "Gonzalo Segares", value: "256", years: "2005–2009, 2010–2014" },
          { rank: 4, name: "Chris Armas", value: "254", years: "1998–2007" },
          { rank: 5, name: "Zach Thornton", value: "253", years: "1998–2006" },
        ],
      },
    ],
  },
  sky: { categories: [] },
  stars: {
    note: "NWSL goals only. Wikipedia's list has no sources and may be out of date.",
    categories: [
      {
        name: "Goals",
        leaders: [
          { rank: 1, name: "Sam Kerr", value: "35", years: "2018–2019" },
          { rank: 1, name: "Christen Press", value: "35", years: "2014–2017" },
          { rank: 3, name: "Sofia Huerta", value: "22", years: "2015–2018" },
          { rank: 4, name: "Alyssa Mautz", value: "13", years: "2012–2022" },
          { rank: 5, name: "Jen Hoy", value: "12", years: "2013–2017" },
        ],
      },
    ],
  },
};

function teamAllTimeLeaders(favorite) {
  return ALL_TIME_LEADERS[favorite.key];
}
