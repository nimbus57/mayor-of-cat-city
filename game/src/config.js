// Fixed logical resolution. The canvas is scaled to fit its container,
// but the game always thinks in 960 x 540.
const GAME_W = 960;
const GAME_H = 540;

const FONT = '"Courier New", Courier, monospace';

const COLORS = {
  ink: '#f4efe4',
  accent: '#ffb347',
  dim: '#7f86a3',
  danger: '#ff6b6b',
  good: '#7bd88f',
};

// Physics and level constants. Pixels and milliseconds.
const GRAVITY = 1100;
const GROUND_Y = 500;   // top of the floor. The floor is 40px thick and ends at the bottom edge.

const PLAYER = {
  speed: 230,
  jump: 520,        // takes off at this speed, so a full jump rises about 123px
  jumpCut: 200,     // releasing jump early caps the upward speed at this
  coyoteMs: 90,     // still allowed to jump this long after walking off a ledge
  bufferMs: 110,    // a jump pressed this early before landing still counts
  dropMs: 300,      // Down + Jump on a platform ignores platforms for this long
  maxHp: 3,
  scratchMs: 160,         // how long the claws are out (and can hit)
  scratchCooldownMs: 330, // minimum time between scratches
  scratchReach: 46,       // how far in front of the Mayor a scratch reaches
  invulnMs: 1200,         // time you cannot be hurt again after a hit
  stunMs: 250,            // time you lose control after a hit
};

// The Big Dog fight. Everything speeds up as he loses health.
const BOSS = {
  maxHp: 5,
  firstThrowMs: 1800,    // pause before the first throw
  startIntervalMs: 1700, // time between throws at full health
  intervalStepMs: 220,   // faster by this much per hit taken
  minIntervalMs: 700,
  speed: 250,            // thrown item speed at full health
  speedStep: 30,         // faster by this much per hit taken
  reflectSpeed: 620,     // speed of an item you scratched back
};

// Player settings that survive a page reload. Storage can be blocked
// (private windows, embeds), so every access is wrapped in try/catch.
const Settings = {
  soundOn: true,

  load() {
    try {
      const v = localStorage.getItem('mocc.sound');
      if (v !== null) this.soundOn = v === '1';
    } catch (e) { /* storage unavailable, keep defaults */ }
  },

  save() {
    try { localStorage.setItem('mocc.sound', this.soundOn ? '1' : '0'); } catch (e) { /* ignore */ }
  },

  toggleSound() {
    this.soundOn = !this.soundOn;
    this.save();
  },
};
