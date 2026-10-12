// Tiny synthesized sound effects. No audio files, just WebAudio beeps.
// Every call checks Settings.soundOn, so the Options toggle silences everything.
let _audioCtx = null;

function getAudioCtx() {
  if (!_audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _audioCtx = new AC();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

// name: [startHz, seconds, waveform, endHz (optional slide)]
const SFX = {
  move:    [440, 0.05, 'square'],
  select:  [660, 0.09, 'square'],
  back:    [330, 0.08, 'square'],
  jump:    [300, 0.12, 'square', 620],
  scratch: [900, 0.10, 'sawtooth', 300],
  ko:      [420, 0.16, 'triangle', 120],
  hurt:    [260, 0.22, 'square', 70],
  win:     [400, 0.50, 'square', 1200],
};

function playSfx(name) {
  if (!Settings.soundOn) return;
  const def = SFX[name];
  if (!def) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const [startHz, seconds, wave, endHz] = def;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(startHz, t);
  if (endHz) osc.frequency.exponentialRampToValueAtTime(endHz, t + seconds);
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + seconds + 0.02);
}
