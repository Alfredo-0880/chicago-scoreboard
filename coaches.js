// Each team's head coach in past seasons, for Team History. ESPN only lists
// the current coach (it returns today's coach for any past season), so
// these were written by hand in October 2026, from Claude's knowledge
// rather than a checked source; correct any entry found wrong. When a
// coach changed during a season, both are listed. Seasons are numbered like
// Team History's: NBA and NHL seasons by the year they end (2011 is 2010-11).
// Add each finished season here.
//
// [first season, last season, coach]
const PAST_HEAD_COACHES = {
  bears: [
    [2005, 2012, "Lovie Smith"],
    [2013, 2014, "Marc Trestman"],
    [2015, 2017, "John Fox"],
    [2018, 2021, "Matt Nagy"],
    [2022, 2023, "Matt Eberflus"],
    [2024, 2024, "Matt Eberflus, then Thomas Brown (interim)"],
    [2025, 2025, "Ben Johnson"],
  ],
  bulls: [
    [2005, 2007, "Scott Skiles"],
    [2008, 2008, "Scott Skiles, then Jim Boylan (interim)"],
    [2009, 2010, "Vinny Del Negro"],
    [2011, 2015, "Tom Thibodeau"],
    [2016, 2018, "Fred Hoiberg"],
    [2019, 2019, "Fred Hoiberg, then Jim Boylen"],
    [2020, 2020, "Jim Boylen"],
    [2021, 2026, "Billy Donovan"],
  ],
  cubs: [
    [2005, 2006, "Dusty Baker"],
    [2007, 2009, "Lou Piniella"],
    [2010, 2010, "Lou Piniella, then Mike Quade (interim)"],
    [2011, 2011, "Mike Quade"],
    [2012, 2013, "Dale Sveum"],
    [2014, 2014, "Rick Renteria"],
    [2015, 2019, "Joe Maddon"],
    [2020, 2023, "David Ross"],
    [2024, 2025, "Craig Counsell"],
  ],
  whitesox: [
    [2005, 2011, "Ozzie Guillén"],
    [2012, 2016, "Robin Ventura"],
    [2017, 2020, "Rick Renteria"],
    [2021, 2021, "Tony La Russa"],
    [2022, 2022, "Tony La Russa, then Miguel Cairo (acting)"],
    [2023, 2023, "Pedro Grifol"],
    [2024, 2024, "Pedro Grifol, then Grady Sizemore (interim)"],
    [2025, 2025, "Will Venable"],
  ],
  blackhawks: [
    // No 2004-05 season: the NHL lockout.
    [2006, 2006, "Trent Yawney"],
    [2007, 2007, "Trent Yawney, then Denis Savard"],
    [2008, 2008, "Denis Savard"],
    [2009, 2009, "Denis Savard, then Joel Quenneville"],
    [2010, 2018, "Joel Quenneville"],
    [2019, 2019, "Joel Quenneville, then Jeremy Colliton"],
    [2020, 2021, "Jeremy Colliton"],
    [2022, 2022, "Jeremy Colliton, then Derek King (interim)"],
    [2023, 2024, "Luke Richardson"],
    [2025, 2025, "Luke Richardson, then Anders Sorensen (interim)"],
    [2026, 2026, "Jeff Blashill"],
  ],
  fire: [
    [2005, 2006, "Dave Sarachan"],
    [2007, 2007, "Dave Sarachan, then Juan Carlos Osorio"],
    [2008, 2009, "Denis Hamlett"],
    [2010, 2010, "Carlos de los Cobos"],
    [2011, 2011, "Carlos de los Cobos, then Frank Klopas (interim)"],
    [2012, 2013, "Frank Klopas"],
    [2014, 2014, "Frank Yallop"],
    [2015, 2015, "Frank Yallop, then Brian Bliss (interim)"],
    [2016, 2019, "Veljko Paunović"],
    [2020, 2020, "Raphaël Wicky"],
    [2021, 2021, "Raphaël Wicky, then Frank Klopas (interim)"],
    [2022, 2023, "Ezra Hendrickson"],
    [2024, 2024, "Frank Klopas"],
    [2025, 2025, "Gregg Berhalter"],
  ],
  sky: [
    // The Sky's first season was 2006.
    [2006, 2006, "Dave Cowens"],
    [2007, 2007, "Bo Overton"],
    [2008, 2009, "Steven Key"],
    [2010, 2016, "Pokey Chatman"],
    [2017, 2018, "Amber Stocks"],
    [2019, 2022, "James Wade"],
    [2023, 2023, "James Wade, then Emre Vatansever"],
    [2024, 2024, "Teresa Weatherspoon"],
    [2025, 2025, "Tyler Marsh"],
  ],
  stars: [
    // The NWSL's first season was 2013. 2025 is left out until it's checked.
    [2013, 2021, "Rory Dames"],
    [2022, 2023, "Chris Petrucelli"],
    [2024, 2024, "Lorne Donaldson"],
  ],
};

// The head coach for a team's season, or null when it isn't listed.
function pastHeadCoach(favorite, season) {
  const entry = (PAST_HEAD_COACHES[favorite.key] || []).find(([first, last]) => season >= first && season <= last);
  return entry ? entry[2] : null;
}
