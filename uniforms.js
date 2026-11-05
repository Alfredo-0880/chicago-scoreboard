// Each team's current uniforms. ESPN has no uniform data, so this is
// written by hand from the teams' Wikipedia articles (checked 2026-11-05).
// When a team changes a uniform, change it here (and in the tests).
//
// The app draws each uniform in its colors. A real picture is shown only
// where a freely licensed one exists (on Wikimedia Commons, with its
// credit); other teams' uniform pictures on Wikipedia are "fair use" only.
//
// jersey, trim, numbers, and bottoms (pants or shorts) are colors.
// Optional: pinstripes (a color), band (a color across the chest).

const UNIFORMS = {
  bears: {
    uniforms: [
      { name: "Home", jersey: "#0B162A", trim: "#C83803", numbers: "#FFFFFF", bottoms: "#FFFFFF", description: "Navy jersey with white numbers trimmed in orange, white pants, navy helmet." },
      { name: "Away", jersey: "#FFFFFF", trim: "#C83803", numbers: "#0B162A", bottoms: "#0B162A", description: "White jersey with navy numbers trimmed in orange, navy pants, navy helmet." },
      { name: "Alternate", jersey: "#C83803", trim: "#0B162A", numbers: "#FFFFFF", bottoms: "#FFFFFF", description: "Orange jersey with white numbers, white pants, and an orange helmet." },
    ],
    picture: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Chicago_Bears_Uniforms_%28%282026%29%29.png/1280px-Chicago_Bears_Uniforms_%28%282026%29%29.png",
      alt: "Chicago Bears uniforms",
      caption: "All five 2026 Bears uniforms, including the throwback and the new Rivalry uniform.",
      credit: "TheGoodGeneral 1, CC BY 4.0",
      link: "https://commons.wikimedia.org/wiki/File:Chicago_Bears_Uniforms_((2026)).png",
    },
  },
  bulls: {
    uniforms: [
      { name: "Home", jersey: "#FFFFFF", trim: "#CE1141", numbers: "#CE1141", bottoms: "#FFFFFF", description: "White \"Association\" uniform with \"BULLS\" and numbers in red, trimmed in black." },
      { name: "Away", jersey: "#CE1141", trim: "#000000", numbers: "#FFFFFF", bottoms: "#CE1141", description: "Red \"Icon\" uniform with \"BULLS\" and numbers in white, trimmed in black." },
      { name: "Alternate", jersey: "#111111", trim: "#CE1141", numbers: "#CE1141", bottoms: "#111111", pinstripes: "#CE1141", description: "Black \"Statement\" uniform with red pinstripes and \"CHICAGO\" across the chest." },
    ],
  },
  cubs: {
    uniforms: [
      { name: "Home", jersey: "#FFFFFF", trim: "#0E3386", numbers: "#0E3386", bottoms: "#FFFFFF", pinstripes: "#0E3386", description: "White with blue pinstripes, the Cubs logo on the chest, and blue numbers." },
      { name: "Away", jersey: "#B9BCBE", trim: "#0E3386", numbers: "#CC3433", bottoms: "#B9BCBE", description: "Gray with \"Chicago\" in blue letters and red numbers, both outlined in white." },
      { name: "Alternate", jersey: "#0E3386", trim: "#CC3433", numbers: "#CC3433", bottoms: "#B9BCBE", description: "Blue jersey with the walking cub logo and red numbers outlined in white, usually worn on the road." },
    ],
  },
  whitesox: {
    uniforms: [
      { name: "Home", jersey: "#FFFFFF", trim: "#27251F", numbers: "#27251F", bottoms: "#FFFFFF", pinstripes: "#27251F", description: "White with black pinstripes and the \"SOX\" logo." },
      { name: "Away", jersey: "#B9BCBE", trim: "#27251F", numbers: "#27251F", bottoms: "#B9BCBE", description: "Gray with \"Chicago\" in black letters." },
      { name: "Alternate", jersey: "#27251F", trim: "#C4CED4", numbers: "#FFFFFF", bottoms: "#B9BCBE", description: "Black jersey with the script \"Sox\" logo." },
    ],
  },
  blackhawks: {
    uniforms: [
      { name: "Home", jersey: "#CF0A2C", trim: "#000000", numbers: "#FFFFFF", bottoms: "#000000", description: "Red sweater with black and white stripes on the sleeves and waist." },
      { name: "Away", jersey: "#FFFFFF", trim: "#CF0A2C", numbers: "#000000", bottoms: "#000000", description: "White sweater with black, white, and red stripes on the sleeves and waist." },
      { name: "Alternate", jersey: "#000000", trim: "#CF0A2C", numbers: "#FFFFFF", bottoms: "#000000", description: "Black sweater, the 1996–2007 design brought back for the team's 100th season in 2025–26." },
    ],
  },
  fire: {
    uniforms: [
      { name: "Home", jersey: "#E4202C", trim: "#FFFFFF", numbers: "#FFFFFF", bottoms: "#E4202C", band: "#FFFFFF", description: "Red shirt with a white band across the chest, red shorts, and red socks." },
      { name: "Away", jersey: "#D6DDE0", trim: "#0A174A", numbers: "#0A174A", bottoms: "#D6DDE0", description: "Light gray shirt and shorts with navy blue details." },
      { name: "Alternate", jersey: "#FFFFFF", trim: "#0A174A", numbers: "#0A174A", bottoms: "#FFFFFF", band: "#0A174A", description: "White third kit with a navy and red band across the chest." },
    ],
  },
  sky: {
    uniforms: [
      { name: "Home", jersey: "#FFFFFF", trim: "#FFCD00", numbers: "#418FDE", bottoms: "#FFFFFF", pinstripes: "#C9D3DE", description: "White \"Heroine\" uniform with \"SKY\" in yellow and blue." },
      { name: "Away", jersey: "#0B1A2E", trim: "#5BC2E7", numbers: "#5BC2E7", bottoms: "#0B1A2E", description: "Dark \"Explorer\" uniform with \"CHICAGO\" across the chest." },
      { name: "Alternate", jersey: "#1F6FD1", trim: "#FFFFFF", numbers: "#FFFFFF", bottoms: "#1F6FD1", description: "Blue \"Rebel\" uniform with \"Chi-Town\" across the chest." },
    ],
  },
  stars: {
    uniforms: [
      { name: "Home", jersey: "#FFFFFF", trim: "#37B5E9", numbers: "#0A1F44", bottoms: "#37B5E9", pinstripes: "#37B5E9", description: "White shirt with light blue stripes, light blue shorts, and white socks." },
      { name: "Away", jersey: "#101010", trim: "#C8102E", numbers: "#FFFFFF", bottoms: "#101010", description: "Black shirt and shorts with red trim and light blue socks." },
    ],
  },
};

function teamUniforms(favorite) {
  return UNIFORMS[favorite.key];
}
