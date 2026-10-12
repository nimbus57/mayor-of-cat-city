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

    // Enemies patrol their platform. A scratch knocks them out; some wake back up.
    this.enemies = this.physics.add.group();
    for (const [type, x, y, range] of level.enemies) {
      this.enemies.add(new Enemy(this, x, y, type, range));
    }
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => this.onTouchEnemy(enemy));

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    // On-screen text stays put (scroll factor 0).
    this.add.text(GAME_W - 16, 14, level.name, {
      fontFamily: FONT, fontSize: '22px', color: COLORS.ink,
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(50);

    this.add.text(16, 14, 'Arrows/WASD move   Space jump   J scratch   Esc title', {
      fontFamily: FONT, fontSize: '14px', color: COLORS.dim,
    }).setScrollFactor(0).setDepth(50);

    this.hud = makeHud(this, this.player);
    this.hud.refresh();

    this.input.keyboard.on('keydown-ESC', (ev) => { if (!ev.repeat) this.scene.start('Title'); });
  }

  onTouchEnemy(enemy) {
    if (this.ending || enemy.mode !== 'patrol') return;   // knocked-out enemies are harmless
    if (this.player.hurt(this.now, enemy.x)) {
      this.hud.refresh();
      this.cameras.main.shake(120, 0.006);
      if (this.player.hp <= 0) this.gameOver();
    }
  }

  gameOver() {
    if (this.ending) return;
    this.ending = true;
    this.physics.pause();
    this.player.setTint(0x888888);
    this.add.text(GAME_W / 2, GAME_H / 2 - 20, 'OUT COLD', {
      fontFamily: FONT, fontSize: '64px', fontStyle: 'bold', color: COLORS.danger,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(60);
    this.time.delayedCall(1400, () => this.scene.restart({ level: this.levelKey }));
  }

  completeLevel() {
    if (this.ending) return;
    this.ending = true;
    this.physics.pause();
    playSfx('win');
    this.add.text(GAME_W / 2, GAME_H / 2 - 30, 'LEVEL CLEAR', {
      fontFamily: FONT, fontSize: '64px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(60);
    this.add.text(GAME_W / 2, GAME_H / 2 + 30, 'Next stop: Pawlice Station', {
      fontFamily: FONT, fontSize: '24px', color: COLORS.ink,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(60);
    this.time.delayedCall(2200, () => this.scene.start('Boss'));
  }

  update(time) {
    if (this.ending) return;
    this.now = time;
    this.sky.tilePositionX = this.cameras.main.scrollX * 0.3;
    this.player.update(time);

    // Resolve the scratch against every enemy, once per enemy per swing.
    const rect = this.player.scratchRect(time);
    for (const enemy of this.enemies.getChildren()) {
      enemy.update(time);
      if (rect && !this.player.attackHits.has(enemy)
          && Phaser.Geom.Intersects.RectangleToRectangle(rect, enemy.hitRect())) {
        this.player.attackHits.add(enemy);
        enemy.knockOut(time);
        playSfx('ko');
      }
    }
  }
}
