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
