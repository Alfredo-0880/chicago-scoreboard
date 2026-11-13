// The tab rows. The main row has single tabs and two groups, History and
// Team Info; opening a group shows a second row with its pages. state.page
// is always a page key ("halloffame"), never a group.

const MAIN_TABS = [
  { key: "today", label: "Today" },
  { key: "games", label: "Games" },
  { key: "standings", label: "League Standings" },
  { key: "playoffs", label: "Playoff Picture" },
  { key: "rosters", label: "Rosters" },
  { key: "stats", label: "Stats" },
  { key: "injuries", label: "Injuries" },
  { key: "news", label: "News" },
  { key: "highlights", label: "Highlights" },
  {
    key: "history",
    label: "History",
    pages: [
      { key: "history", label: "Seasons" },
      { key: "championships", label: "Championships" },
      { key: "coaches", label: "Coaches" },
      { key: "drafts", label: "Draft Picks" },
      { key: "retired", label: "Retired Numbers" },
      { key: "halloffame", label: "Hall of Fame" },
      { key: "leaders", label: "All-Time Leaders" },
    ],
  },
  {
    key: "teaminfo",
    label: "Team Info",
    pages: [
      { key: "stadiums", label: "Stadiums" },
      { key: "uniforms", label: "Uniforms" },
      { key: "mascots", label: "Mascots" },
      { key: "rivals", label: "Rivals" },
      { key: "funfacts", label: "Fun Facts" },
      { key: "social", label: "Social" },
    ],
  },
];

// The group a page belongs to, or null for a single tab.
function groupForPage(page) {
  return MAIN_TABS.find((tab) => tab.pages && tab.pages.some((each) => each.key === page)) || null;
}

// The page to open when a group is tapped: the one last used in it, or its
// first. lastPages maps a group key to a page key.
function pageForGroup(groupKey, lastPages) {
  const group = MAIN_TABS.find((tab) => tab.key === groupKey);
  const last = lastPages[groupKey];
  return group.pages.some((page) => page.key === last) ? last : group.pages[0].key;
}

function mainTabsHtml(page) {
  const group = groupForPage(page);
  return MAIN_TABS.map((tab) => {
    const selected = tab.pages ? tab === group : tab.key === page;
    const target = tab.pages ? `data-action="page-group" data-group="${tab.key}"` : `data-action="page" data-page="${tab.key}"`;
    return `
      <button class="page-tab ${selected ? "active" : ""}" role="tab" aria-selected="${selected}" ${target}>${tab.label}</button>`;
  }).join("");
}

// The open group's pages, or nothing for a single tab.
function subTabsHtml(page) {
  const group = groupForPage(page);
  if (!group) return "";
  return group.pages
    .map(
      (each) => `
      <button class="sub-tab ${each.key === page ? "active" : ""}" role="tab" aria-selected="${each.key === page}"
              data-action="page" data-page="${each.key}">${each.label}</button>`
    )
    .join("");
}

// A page's name as a person reads it: "History › Hall of Fame", "Games".
function pageLabel(page) {
  const group = groupForPage(page);
  if (group) return `${group.label} › ${group.pages.find((each) => each.key === page).label}`;
  const tab = MAIN_TABS.find((each) => each.key === page);
  return tab ? tab.label : page.charAt(0).toUpperCase() + page.slice(1);
}
