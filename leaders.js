// Each team's all-time (career) leaders in a few key stats. ESPN doesn't
// keep franchise records, so this is copied by hand from Wikipedia's team
// records pages and articles (checked 2026-11-06). Players still active
// keep adding to their totals, so these go out of date; update them here.
//
// Wikipedia lists the top 5 for some teams and only the leader for others
// (onlyLeader). years (with the team) is left out where the list doesn't
// give it. Players tied for a spot share its rank. note says what the
// numbers cover where it isn't plain.

const ALL_TIME_LEADERS = {
  bears: {
    onlyLeader: true,
    categories: [
      { name: "Passing yards", leaders: [{ rank: 1, name: "Jay Cutler", value: "23,443", years: "2009–2016" }] },
      { name: "Rushing yards", leaders: [{ rank: 1, name: "Walter Payton", value: "16,726", years: "1975–1987" }] },
      { name: "Receiving yards", leaders: [{ rank: 1, name: "Johnny Morris", value: "5,059", years: "1958–1967" }] },
      { name: "Sacks", leaders: [{ rank: 1, name: "Richard Dent", value: "124.5", years: "1983–1993, 1995" }] },
    ],
  },
  bulls: {
    note: "As of the end of the 2025–26 season.",
    categories: [
      {
        name: "Points",
        leaders: [
          { rank: 1, name: "Michael Jordan", value: "29,277" },
          { rank: 2, name: "Scottie Pippen", value: "15,123" },
          { rank: 3, name: "Bob Love", value: "12,623" },
          { rank: 4, name: "Luol Deng", value: "10,286" },
          { rank: 5, name: "Jerry Sloan", value: "10,233" },
        ],
      },
      {
        name: "Rebounds",
        leaders: [
          { rank: 1, name: "Michael Jordan", value: "5,836" },
          { rank: 2, name: "Tom Boerwinkle", value: "5,745" },
          { rank: 3, name: "Scottie Pippen", value: "5,726" },
          { rank: 4, name: "Joakim Noah", value: "5,387" },
          { rank: 5, name: "Jerry Sloan", value: "5,385" },
        ],
      },
      {
        name: "Assists",
        leaders: [
          { rank: 1, name: "Michael Jordan", value: "5,012" },
          { rank: 2, name: "Scottie Pippen", value: "4,494" },
          { rank: 3, name: "Kirk Hinrich", value: "3,811" },
          { rank: 4, name: "Norm Van Lier", value: "3,676" },
          { rank: 5, name: "Derrick Rose", value: "2,516" },
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
    onlyLeader: true,
    categories: [
      { name: "Hits", leaders: [{ rank: 1, name: "Luke Appling", value: "2,749" }] },
      { name: "Home runs", leaders: [{ rank: 1, name: "Frank Thomas", value: "448" }] },
      { name: "Pitching wins", leaders: [{ rank: 1, name: "Ted Lyons", value: "260" }] },
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
      { name: "Assists", leaders: [{ rank: 1, name: "Stan Mikita", value: "926" }] },
      { name: "Points", leaders: [{ rank: 1, name: "Stan Mikita", value: "1,467" }] },
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
          { rank: 1, name: "Sam Kerr", value: "35" },
          { rank: 1, name: "Christen Press", value: "35" },
          { rank: 3, name: "Sofia Huerta", value: "22" },
          { rank: 4, name: "Alyssa Mautz", value: "13" },
          { rank: 5, name: "Jen Hoy", value: "12" },
        ],
      },
    ],
  },
};

function teamAllTimeLeaders(favorite) {
  return ALL_TIME_LEADERS[favorite.key];
}
