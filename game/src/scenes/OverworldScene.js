// The city map. Pick a location and go. Pawlice Station stays locked until the
// Museum and the Renaissance Faire are cleared.
const MAP_NODES = [
  { key: 'museum',  name: 'The Museum',        x: 220, y: 320, scene: 'Level' },
  { key: 'faire',   name: 'Renaissance Faire', x: 480, y: 190, scene: 'Level' },
  { key: 'station', name: 'Pawlice Station',   x: 740, y: 320, scene: 'Boss' },
];

class OverworldScene extends Phaser.Scene {
  constructor() { super('Overworld'); }

  create() {
    this.cleared = Progress.get(this);
    this.drawBackdrop();
    this.drawRoads();
    this.drawNodes();

    this.add.text(GAME_W / 2, 30, 'CAT CITY', {
      fontFamily: FONT, fontSize: '34px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5);

    // Info panel at the bottom.
    this.add.rectangle(40, 408, 880, 92, 0x10131f, 0.82).setOrigin(0);
    this.nameText = this.add.text(GAME_W / 2, 432, '', {
      fontFamily: FONT, fontSize: '28px', fontStyle: 'bold', color: COLORS.ink,
    }).setOrigin(0.5);
    this.statusText = this.add.text(GAME_W / 2, 470, '', {
      fontFamily: FONT, fontSize: '18px', color: COLORS.dim,
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, GAME_H - 18, 'Left / Right choose    Enter go    Esc title', {
      fontFamily: FONT, fontSize: '14px', color: COLORS.dim,
    }).setOrigin(0.5);

    // Selection marker bobbing above the chosen location.
    this.cursor = this.add.triangle(0, 0, 0, 0, 28, 0, 14, 22, 0xffb347).setDepth(5);
    this.cursorTween = this.tweens.add({
      targets: this.cursor, scaleY: 0.7, duration: 450, yoyo: true, repeat: -1,
    });
    this.ring = this.add.circle(0, 0, 38).setStrokeStyle(4, 0xffffff, 0.9).setDepth(4);

    // Start on the first place that is open and not yet cleared.
    const first = MAP_NODES.findIndex((n) => this.isUnlocked(n) && !this.cleared[n.key]);
    this.index = first >= 0 ? first : 0;
    this.refresh();

    const kb = this.input.keyboard;
    const once = (fn) => (ev) => { if (!ev.repeat) fn(); };
    kb.on('keydown-LEFT', once(() => this.move(-1)));
    kb.on('keydown-A', once(() => this.move(-1)));
    kb.on('keydown-RIGHT', once(() => this.move(1)));
    kb.on('keydown-D', once(() => this.move(1)));
    kb.on('keydown-ENTER', once(() => this.enter()));
    kb.on('keydown-SPACE', once(() => this.enter()));
    kb.on('keydown-ESC', once(() => this.scene.start('Title')));
  }

  isUnlocked(node) {
    return node.key !== 'station' || (!!this.cleared.museum && !!this.cleared.faire);
  }

  drawBackdrop() {
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x16314a).setOrigin(0);
    const g = this.add.graphics();
    g.fillStyle(0x2f5d46, 1);
    g.fillRoundedRect(40, 80, 880, 320, 40);
    // City blocks, seeded so the map looks the same every time.
    let seed = 5;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    g.fillStyle(0x336b4f, 1);
    for (let i = 0; i < 34; i++) {
      g.fillRect(60 + rnd() * 800, 96 + rnd() * 250, 30 + rnd() * 50, 20 + rnd() * 40);
    }
  }

  drawRoads() {
    const g = this.add.graphics();
    g.lineStyle(10, 0xcdbf9a, 1);
    g.beginPath();
    g.moveTo(MAP_NODES[0].x, MAP_NODES[0].y);
    for (let i = 1; i < MAP_NODES.length; i++) g.lineTo(MAP_NODES[i].x, MAP_NODES[i].y);
    g.strokePath();
  }

  drawNodes() {
    const icons = this.add.graphics().setDepth(3);
    MAP_NODES.forEach((n, i) => {
      const done = !!this.cleared[n.key];
      const open = this.isUnlocked(n);
      const color = done ? 0x7bd88f : open ? 0xffb347 : 0x555a70;

      const dot = this.add.circle(n.x, n.y, 28, color).setStrokeStyle(4, 0x10131f).setDepth(2);
      dot.setInteractive({ useHandCursor: true });
      dot.on('pointerover', () => { this.index = i; this.refresh(); });
      dot.on('pointerdown', () => { this.index = i; this.refresh(); this.enter(); });

      this.add.text(n.x, n.y + 48, n.name, {
        fontFamily: FONT, fontSize: '18px', color: COLORS.ink, stroke: '#10131f', strokeThickness: 4,
      }).setOrigin(0.5).setDepth(3);

      if (done) {
        // check mark
        icons.lineStyle(6, 0x10331c, 1);
        icons.beginPath();
        icons.moveTo(n.x - 11, n.y);
        icons.lineTo(n.x - 3, n.y + 9);
        icons.lineTo(n.x + 12, n.y - 9);
        icons.strokePath();
      } else if (!open) {
        // padlock
        icons.fillStyle(0x23273a, 1);
        icons.fillRect(n.x - 10, n.y - 2, 20, 15);
        icons.lineStyle(4, 0x23273a, 1);
        icons.beginPath();
        icons.arc(n.x, n.y - 3, 7, Math.PI, 0, false);
        icons.strokePath();
      }
    });
  }

  move(step) {
    this.index = (this.index + step + MAP_NODES.length) % MAP_NODES.length;
    playSfx('move');
    this.refresh();
  }

  refresh() {
    const n = MAP_NODES[this.index];
    this.cursor.setPosition(n.x, n.y - 60);
    this.ring.setPosition(n.x, n.y);
    this.nameText.setText(n.name);

    const done = !!this.cleared[n.key];
    let status;
    let colour = COLORS.dim;
    if (this.cleared.station) {
      status = 'Cat City is yours, Mayor.';
      colour = COLORS.good;
    } else if (!this.isUnlocked(n)) {
      status = 'Big Dog\'s gang blocks the road. Clear the Museum and the Faire first.';
      colour = COLORS.danger;
    } else if (done) {
      status = 'Cleared. Enter to play it again.';
      colour = COLORS.good;
    } else {
      status = n.scene === 'Boss' ? 'Big Dog is waiting. Enter to go.' : 'Enter to go.';
      colour = COLORS.accent;
    }
    this.statusText.setText(status).setColor(colour);
  }

  enter() {
    const n = MAP_NODES[this.index];
    if (!this.isUnlocked(n)) {
      playSfx('hurt');
      this.cameras.main.shake(100, 0.004);
      return;
    }
    playSfx('select');
    if (n.scene === 'Level') this.scene.start('Level', { level: n.key });
    else this.scene.start('Boss');
  }
}
