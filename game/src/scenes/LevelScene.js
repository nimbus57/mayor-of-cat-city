// A fixed-height, horizontally scrolling level.
class LevelScene extends Phaser.Scene {
  constructor() { super('Level'); }

  init(data) {
    this.levelKey = (data && data.level) || 'museum';
  }

  create() {
    const level = LEVELS[this.levelKey];
    this.level = level;

    this.physics.world.gravity.y = GRAVITY;
    this.physics.world.setBounds(0, 0, level.width, GAME_H);
    this.cameras.main.setBounds(0, 0, level.width, GAME_H);
    this.cameras.main.setBackgroundColor(level.bg);

    // Far background that scrolls slower than the world.
    this.sky = this.add.tileSprite(0, 0, GAME_W, GAME_H, 'skyline')
      .setOrigin(0).setScrollFactor(0).setAlpha(0.35);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(level.width / 2, GROUND_Y + 20, 'ground')
      .setDisplaySize(level.width, 40).setTint(level.tint).refreshBody();

    this.player = new Mayor(this, 80, GROUND_Y - 60);
    this.physics.add.collider(this.player, this.platforms);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    // On-screen text stays put (scroll factor 0).
    this.add.text(GAME_W - 16, 14, level.name, {
      fontFamily: FONT, fontSize: '22px', color: COLORS.ink,
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);

    this.add.text(16, 14, 'Arrows/WASD move   Space jump   Esc title', {
      fontFamily: FONT, fontSize: '14px', color: COLORS.dim,
    }).setScrollFactor(0).setDepth(50);

    this.input.keyboard.on('keydown-ESC', (ev) => { if (!ev.repeat) this.scene.start('Title'); });
  }

  update(time) {
    this.sky.tilePositionX = this.cameras.main.scrollX * 0.3;
    this.player.update(time);
  }
}
