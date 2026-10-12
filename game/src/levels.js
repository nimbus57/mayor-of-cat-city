// Level data lives here so a level is just a list, not code.
//
// The level is a fixed 540px tall. Platforms sit on three tiers above the floor.
// A full jump rises about 123px and the tiers are 100px apart, so each tier is
// one jump above the last.
const TIER = { A: 400, B: 300, C: 200 };   // y of the top surface of each tier

const LEVELS = {
  museum: {
    name: 'The Museum',
    width: 3600,
    bg: '#1b2038',
    tint: 0x9aa4d6,     // colour applied to the grey platform and floor art
    exitX: 3480,        // x of the exit door, standing on the floor
    // [left edge x, top surface y, width]
    platforms: [
      [300, TIER.A, 160], [560, TIER.A, 160], [700, TIER.B, 200],
      [1000, TIER.B, 180], [1250, TIER.C, 200], [1500, TIER.A, 220], [1800, TIER.A, 160],
      [2000, TIER.B, 200], [2300, TIER.C, 200], [2600, TIER.B, 200], [2850, TIER.A, 220],
      [3100, TIER.A, 160], [3300, TIER.B, 160],
    ],
    // [kind, patrol centre x, surface y it stands on, patrol half-width]
    // Keep the patrol inside the platform it stands on, or it will walk off.
    enemies: [
      ['rat', 700, GROUND_Y, 120],
      ['rat', 380, TIER.A, 55],
      ['raccoon', 1100, GROUND_Y, 150],
      ['raccoon', 1090, TIER.B, 60],
      ['rat', 1650, GROUND_Y, 160],
      ['rat', 2100, TIER.B, 70],
      ['raccoon', 2200, GROUND_Y, 200],
      ['raccoon', 2400, TIER.C, 70],
      ['raccoon', 2950, GROUND_Y, 180],
      ['rat', 3180, TIER.A, 55],
      ['rat', 3200, GROUND_Y, 150],
    ],
  },

  faire: {
    name: 'Renaissance Faire',
    width: 3200,
    bg: '#2b2216',
    tint: 0xd9b36a,
    exitX: 3080,
    platforms: [
      [280, TIER.A, 180], [520, TIER.A, 140], [640, TIER.B, 200], [920, TIER.C, 180],
      [1150, TIER.B, 160], [1350, TIER.A, 200], [1650, TIER.A, 160], [1800, TIER.B, 200],
      [2080, TIER.C, 200], [2350, TIER.B, 160], [2550, TIER.A, 200], [2850, TIER.A, 140],
    ],
    enemies: [
      ['rat', 370, TIER.A, 60],
      ['raccoon', 700, GROUND_Y, 160],
      ['raccoon', 740, TIER.B, 70],
      ['rat', 1000, GROUND_Y, 140],
      ['raccoon', 1010, TIER.C, 60],
      ['rat', 1450, TIER.A, 70],
      ['raccoon', 1600, GROUND_Y, 200],
      ['rat', 1900, TIER.B, 70],
      ['raccoon', 2180, TIER.C, 70],
      ['rat', 2300, GROUND_Y, 160],
      ['raccoon', 2650, TIER.A, 70],
      ['raccoon', 2750, GROUND_Y, 150],
    ],
  },
};
