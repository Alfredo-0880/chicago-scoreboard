// Each team's official website and social media accounts. ESPN doesn't list
// these, so they were copied from the social links on each team's own
// official website (October 2026). If a team changes an account, update
// it here.

const TEAM_LINKS = {
  bears: {
    website: "https://www.chicagobears.com/",
    socials: [
      ["Instagram", "https://www.instagram.com/chicagobears"],
      ["X", "https://x.com/ChicagoBears"],
      ["Facebook", "https://www.facebook.com/ChicagoBears"],
      ["TikTok", "https://www.tiktok.com/@chicagobears"],
      ["YouTube", "https://www.youtube.com/channel/UCP0Cdc6moLMyDJiO0s-yhbQ"],
      ["Snapchat", "https://www.snapchat.com/add/chicagobearsnfl"],
    ],
  },
  bulls: {
    website: "https://www.nba.com/bulls/",
    socials: [
      ["Instagram", "https://www.instagram.com/chicagobulls"],
      ["X", "https://x.com/chicagobulls"],
      ["Facebook", "https://www.facebook.com/chicagobulls"],
      ["TikTok", "https://www.tiktok.com/@chicagobulls"],
      ["YouTube", "https://www.youtube.com/chicagobulls"],
    ],
  },
  cubs: {
    website: "https://www.mlb.com/cubs",
    socials: [
      ["Instagram", "https://www.instagram.com/cubs"],
      ["X", "https://x.com/Cubs"],
      ["Facebook", "https://www.facebook.com/Cubs"],
      ["TikTok", "https://www.tiktok.com/@cubs"],
      ["YouTube", "https://www.youtube.com/channel/UCnU7B7B0U0t2vs-2HMLjgvg"],
      ["Threads", "https://www.threads.net/@cubs"],
      ["Snapchat", "https://www.snapchat.com/add/cubs"],
    ],
  },
  whitesox: {
    website: "https://www.mlb.com/whitesox",
    socials: [
      ["Instagram", "https://www.instagram.com/whitesox"],
      ["X", "https://x.com/whitesox"],
      ["Facebook", "https://www.facebook.com/WhiteSox"],
      ["TikTok", "https://www.tiktok.com/@whitesox"],
      ["YouTube", "https://www.youtube.com/channel/UCve-Ci-M4CkBOmNi2LQdCRg"],
      ["Threads", "https://www.threads.net/@whitesox"],
      ["Snapchat", "https://www.snapchat.com/add/whitesox"],
    ],
  },
  blackhawks: {
    website: "https://www.nhl.com/blackhawks/",
    socials: [
      ["Instagram", "https://www.instagram.com/NHLBlackhawks"],
      ["X", "https://x.com/nhlblackhawks"],
      ["Facebook", "https://www.facebook.com/NHLBlackhawks"],
      ["TikTok", "https://www.tiktok.com/@NHLBlackhawks"],
      ["YouTube", "https://www.youtube.com/blackhawks"],
      ["Threads", "https://www.threads.net/@NHLBlackhawks"],
      ["Snapchat", "https://www.snapchat.com/add/NHLBlackhawks"],
    ],
  },
  fire: {
    website: "https://www.chicagofirefc.com/",
    socials: [
      ["Instagram", "https://www.instagram.com/chicagofire"],
      ["X", "https://x.com/ChicagoFire"],
      ["Facebook", "https://www.facebook.com/chicagofire"],
      ["YouTube", "https://www.youtube.com/c/chicagofire"],
    ],
  },
  sky: {
    website: "https://sky.wnba.com/",
    socials: [
      ["Instagram", "https://www.instagram.com/chicagosky"],
      ["X", "https://x.com/chicagosky"],
      ["Facebook", "https://www.facebook.com/chicagosky"],
      ["TikTok", "https://www.tiktok.com/@chicagosky"],
      ["YouTube", "https://www.youtube.com/user/ChicagoSkyBasketball"],
    ],
  },
  stars: {
    website: "https://chicagostars.com/",
    socials: [
      ["Instagram", "https://www.instagram.com/thechicagostars"],
      ["X", "https://x.com/thechicagostars"],
      ["Facebook", "https://www.facebook.com/thechicagostars"],
      ["TikTok", "https://www.tiktok.com/@thechicagostars"],
      ["YouTube", "https://www.youtube.com/chicagoredstarsnwsl"],
      ["LinkedIn", "https://www.linkedin.com/company/thechicagostars"],
    ],
  },
};

// { website, socials: [{ name, url }] } for a team.
function teamLinks(favorite) {
  const links = TEAM_LINKS[favorite.key] || { website: null, socials: [] };
  return { website: links.website, socials: links.socials.map(([name, url]) => ({ name, url })) };
}
