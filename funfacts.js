// Fun Facts about each Chicago team and its people. ESPN's data has none,
// so these are written by hand from well-documented history and were
// reviewed by Alfredo. Add, fix, or remove facts here.

const FUN_FACTS = {
  bears: [
    "Founded in 1920 as the Decatur Staleys; moved to Chicago in 1921 and became the Bears in 1922.",
    "George Halas (“Papa Bear”) was a founder, player, and owner, and coached the team for 40 seasons.",
    "The Bears–Packers rivalry is the NFL’s oldest; they first played in 1921.",
    "The NFL’s Man of the Year award is named for Bears legend Walter Payton.",
  ],
  bulls: [
    "The 1995-96 Bulls went 72-10, an NBA record until the 2015-16 Warriors went 73-9.",
    "Michael Jordan won six NBA Finals MVP awards, all with the Bulls.",
    "Phil Jackson coached all six Bulls championship teams.",
    "Benny the Bull has been the mascot since 1969.",
  ],
  cubs: [
    "The 2016 World Series title ended a 108-year championship drought.",
    "Wrigley Field opened in 1914, and its famous outfield ivy was planted in 1937.",
    "Wrigley didn’t have lights for night games until 1988.",
    "Ernie Banks, “Mr. Cub,” was known for saying “Let’s play two!”",
  ],
  whitesox: [
    "One of the American League’s original teams in 1901.",
    "The 2005 World Series sweep ended an 88-year drought.",
    "Eight players were banned after the 1919 “Black Sox” World Series scandal.",
    "Mark Buehrle threw a perfect game for the White Sox in 2009.",
  ],
  blackhawks: [
    "One of the NHL’s “Original Six” teams, founded in 1926.",
    "The 2010 Stanley Cup ended a 49-year drought; Patrick Kane scored the Cup-winning goal in overtime.",
    "Fans cheer loudly all the way through the national anthem at home games.",
    "The name was spelled “Black Hawks,” two words, until 1986.",
  ],
  fire: [
    "Founded on October 8, 1997, the 126th anniversary of the Great Chicago Fire.",
    "Won both the MLS Cup and the U.S. Open Cup in their very first season, 1998.",
    "Moved back to Soldier Field in 2020.",
    "Signed Robert Lewandowski, one of soccer’s all-time great goal scorers.",
  ],
  sky: [
    "Joined the WNBA in 2006.",
    "Won their first WNBA title in 2021, after reaching the Finals for the first time in 2014.",
    "Candace Parker, from the Chicago suburb of Naperville, won the 2021 title with her hometown team.",
    "Have played home games at Wintrust Arena since 2018.",
  ],
  stars: [
    "One of the NWSL’s original teams in 2013, as the Chicago Red Stars; renamed Chicago Stars FC in 2025.",
    "Reached the NWSL Championship game in 2019 and 2021.",
    "Goalkeeper Alyssa Naeher won the 2019 World Cup with the U.S. team.",
  ],
};

function teamFunFacts(favorite) {
  return FUN_FACTS[favorite.key] || [];
}
