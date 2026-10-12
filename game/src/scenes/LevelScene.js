// A fixed-height, horizontally scrolling level with Contra-style platform tiers.
class LevelScene extends Phaser.Scene {
  constructor() { super('Level'); }

  init(data) {
    this.levelKey = (data && data.level) || 'museum';
  }

  create() {
    const level = LEVELS[this.levelKey];
    this.level = level;
    this.now = 0;
    this.ending = false;

    this.physics.world.gravity.y = GRAVITY;
    this.physics.world.setBounds(0, 0, level.width, GAME_H);
    this.cameras.main.setBounds(0, 0, level.width, GAME_H);
    this.cameras.main.setBackgroundColor(level.bg);

    // Far background that scrolls slower than the world.
    this.sky = this.add.tileSprite(0, 0, GAME_W, GAME_H, 'skyline')
      .setOrigin(0).setScrollFactor(0).setAlpha(0.35);

    // The floor is solid. Platforms are one-way: you land on top but can jump up through them.
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(level.width / 2, GROUND_Y + 20, 'ground')
      .setDisplaySize(level.width, 40).setTint(level.tint).refreshBody();

    for (const [x, y, w] of level.platforms) {
      const p = this.platforms.create(x + w / 2, y + 8, 'platform')
        .setDisplaySize(w, 16).setTint(level.tint).refreshBody();
      p.setData('oneway', true);
      p.body.checkCollision.down = false;
      p.body.checkCollision.left = false;
      p.body.checkCollision.right = false;
    }

    // Exit door at the far end.
    this.door = this.physics.add.staticImage(level.exitX, GROUND_Y - 36, 'door');
    this.add.text(level.exitX, GROUND_Y - 92, 'EXIT', {
      fontFamily: FONT, fontSize: '18px', color: COLORS.accent,
    }).setOrigin(0.5);

    this.player = new Mayor(this, 80, GROUND_Y - 60);
    this.physics.add.collider(
      this.player, this.platforms,
      (player, plat) => {
        if (player.body.touching.down) player.standingOneWay = plat.getData('oneway') === true;
      },
      (player, plat) => !(plat.getData('oneway') && this.now < player.dropUntil),
      this,
    );
    this.physics.add.overlap(this.player, this.door, () => this.completeLevel());

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    // On-screen text stays put (scroll factor 0).
    this.add.text(GAME_W - 16, 14, level.name, {
      fontFamily: FONT, fontSize: '22px', color: COLORS.ink,
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);

    this.add.text(16, 14, 'Arrows/WASD move   Space jump   Down+Space drop   Esc title', {
      fontFamily: FONT, fontSize: '14px', color: COLORS.dim,
    }).setScrollFactor(0).setDepth(50);

    this.input.keyboard.on('keydown-ESC', (ev) => { if (!ev.repeat) this.scene.start('Title'); });
  }

  completeLevel() {
    if (this.ending) return;
    this.ending = true;
    this.physics.pause();
    this.add.text(GAME_W / 2, GAME_H / 2 - 20, 'LEVEL CLEAR', {
      fontFamily: FONT, fontSize: '64px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(60);
    this.time.delayedCall(2200, () => this.scene.start('Title'));
  }

  update(time) {
    if (this.ending) return;
    this.now = time;
    this.sky.tilePositionX = this.cameras.main.scrollX * 0.3;
    this.player.update(time);
  }
}
