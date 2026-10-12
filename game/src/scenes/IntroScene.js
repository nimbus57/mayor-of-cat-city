// The opening story. Enter or Space finishes the current page, then advances.
// Esc skips the whole intro.
const INTRO_PAGES = [
  'The last mayor of Cat City has quit.',
  'That leaves you.\nCongratulations, interim mayor.',
  'Meanwhile, Big Dog and his gang of animal hooligans have taken over the Pawlice Station.',
  'Time to get it back.',
];

class IntroScene extends Phaser.Scene {
  constructor() { super('Intro'); }

  create() {
    this.drawSkyline();

    this.pageIndex = 0;
    this.typing = false;
    this.typeTimer = null;

    this.bodyText = this.add.text(GAME_W / 2, GAME_H / 2 - 20, '', {
      fontFamily: FONT, fontSize: '32px', color: COLORS.ink, align: 'center',
      wordWrap: { width: 760 }, lineSpacing: 10,
    }).setOrigin(0.5);

    this.hint = this.add.text(GAME_W / 2, 36, 'Enter: continue    Esc: skip', {
      fontFamily: FONT, fontSize: '16px', color: COLORS.dim,
    }).setOrigin(0.5);

    const advance = (ev) => { if (!ev || !ev.repeat) this.advance(); };
    this.input.keyboard.on('keydown-ENTER', advance);
    this.input.keyboard.on('keydown-SPACE', advance);
    this.input.keyboard.on('keydown-ESC', (ev) => { if (!ev.repeat) this.finish(); });
    this.input.on('pointerdown', () => this.advance());

    this.showPage(0);
  }

  // A fixed, hand-made night skyline so the text has something behind it.
  drawSkyline() {
    const g = this.add.graphics();
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let x = 0;
    while (x < GAME_W) {
      const w = Math.min(40 + Math.floor(rnd() * 60), GAME_W - x);
      const h = 80 + Math.floor(rnd() * 170);
      g.fillStyle(0x1d2340, 1);
      g.fillRect(x, GAME_H - h, w - 4, h);
      g.fillStyle(0xffd88a, 0.55);
      for (let wy = GAME_H - h + 12; wy < GAME_H - 14; wy += 24) {
        for (let wx = x + 7; wx < x + w - 14; wx += 16) {
          if (rnd() < 0.25) g.fillRect(wx, wy, 7, 10);
        }
      }
      x += w;
    }
    g.setDepth(-1);
  }

  showPage(i) {
    const full = INTRO_PAGES[i];
    this.fullText = full;
    this.bodyText.setText('');
    this.typing = true;
    let n = 0;
    if (this.typeTimer) this.typeTimer.remove(false);
    this.typeTimer = this.time.addEvent({
      delay: 28,
      repeat: full.length - 1,
      callback: () => {
        n += 1;
        this.bodyText.setText(full.slice(0, n));
        if (n >= full.length) this.typing = false;
      },
    });
  }

  advance() {
    if (this.typing) {
      // First press finishes the line.
      this.typeTimer.remove(false);
      this.bodyText.setText(this.fullText);
      this.typing = false;
      return;
    }
    playSfx('select');
    this.pageIndex += 1;
    if (this.pageIndex >= INTRO_PAGES.length) this.finish();
    else this.showPage(this.pageIndex);
  }

  finish() {
    this.scene.start('Overworld');
  }
}
