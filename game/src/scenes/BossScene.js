// Big Dog on the right, the Mayor on the left. He throws things. A scratch sends a thrown
// item flying back at him (it glows yellow). Only reflected items hurt him.
class BossScene extends Phaser.Scene {
  constructor() { super('Boss'); }

  create() {
    this.now = 0;
    this.over = false;
    this.bossHp = BOSS.maxHp;
    this.nextThrowAt = 0;
    this.warned = false;

    this.physics.world.gravity.y = GRAVITY;
    this.physics.world.setBounds(0, 0, GAME_W, GAME_H);
    this.cameras.main.setBackgroundColor('#2a1630');
    this.add.tileSprite(0, 0, GAME_W, GAME_H, 'skyline')
      .setOrigin(0).setTint(0x8a4a7a).setAlpha(0.3);

    // Floor and a few one-way platforms on the Mayor's side.
    const tint = 0xb98ac0;
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(GAME_W / 2, GROUND_Y + 20, 'ground')
      .setDisplaySize(GAME_W, 40).setTint(tint).refreshBody();
    const layout = [
      [60, TIER.A, 180], [320, TIER.A, 180], [190, TIER.B, 180], [450, TIER.B, 160], [330, TIER.C, 160],
    ];
    for (const [x, y, w] of layout) {
      const p = this.platforms.create(x + w / 2, y + 8, 'platform')
        .setDisplaySize(w, 16).setTint(tint).refreshBody();
      p.setData('oneway', true);
      p.body.checkCollision.down = false;
      p.body.checkCollision.left = false;
      p.body.checkCollision.right = false;
    }

    // Big Dog is a solid, immovable wall on the right.
    this.dog = this.physics.add.staticImage(865, GROUND_Y - 75, 'bigdog');

    this.player = new Mayor(this, 120, GROUND_Y - 60);
    this.physics.add.collider(
      this.player, this.platforms,
      (player, plat) => {
        if (player.body.touching.down) player.standingOneWay = plat.getData('oneway') === true;
      },
      (player, plat) => !(plat.getData('oneway') && this.now < player.dropUntil),
      this,
    );
    this.physics.add.collider(this.player, this.dog);

    this.items = this.physics.add.group({ allowGravity: false });
    this.physics.add.overlap(this.player, this.items, (player, item) => this.onItemHitsPlayer(item));
    // Sprite first, group second: Phaser then passes the callback (dog, item) in that order.
    this.physics.add.overlap(this.dog, this.items, (dog, item) => this.onItemHitsDog(item));

    // HUD
    this.add.text(16, 14, 'Arrows/WASD move   Space jump   J scratch   Esc map', {
      fontFamily: FONT, fontSize: '14px', color: COLORS.dim,
    }).setDepth(50);
    this.add.text(GAME_W - 16, 14, 'Pawlice Station', {
      fontFamily: FONT, fontSize: '22px', color: COLORS.ink,
    }).setOrigin(1, 0).setDepth(50);
    this.hud = makeHud(this, this.player);
    this.hud.refresh();

    const barW = 240;
    const barX = GAME_W - 16 - barW;
    this.add.text(barX - 10, 48, 'BIG DOG', {
      fontFamily: FONT, fontSize: '16px', color: COLORS.ink,
    }).setOrigin(1, 0).setDepth(50);
    this.add.rectangle(barX, 48, barW, 16, 0x000000, 0.5)
      .setOrigin(0).setStrokeStyle(2, 0xffffff, 0.6).setDepth(50);
    this.bossBar = this.add.rectangle(barX, 48, barW, 16, 0xff9f43).setOrigin(0).setDepth(51);

    const tip = this.add.text(GAME_W / 2, 110, 'Scratch his throws back at him!', {
      fontFamily: FONT, fontSize: '22px', color: COLORS.accent,
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({ targets: tip, alpha: 0, delay: 3500, duration: 800 });

    this.input.keyboard.on('keydown-ESC', (ev) => { if (!ev.repeat) this.scene.start('Overworld'); });
  }

  // How long between throws right now. Shrinks as Big Dog takes damage.
  throwInterval() {
    const hitsTaken = BOSS.maxHp - this.bossHp;
    return Math.max(BOSS.minIntervalMs, BOSS.startIntervalMs - hitsTaken * BOSS.intervalStepMs);
  }

  throwItem() {
    const key = Phaser.Utils.Array.GetRandom(['item_can', 'item_bone', 'item_boot']);
    const sx = 780;
    const sy = 392;
    const item = this.items.create(sx, sy, key);
    item.body.setAllowGravity(false);
    item.reflected = false;
    item.setDepth(9);

    // Aim at where the Mayor is now, with a little scatter, never into the floor.
    const tx = this.player.x;
    const ty = Math.min(this.player.y + Phaser.Math.Between(-50, 30), GROUND_Y - 24);
    const angle = Math.atan2(ty - sy, tx - sx);
    const hitsTaken = BOSS.maxHp - this.bossHp;
    const speed = BOSS.speed + hitsTaken * BOSS.speedStep + Phaser.Math.Between(0, 50);
    item.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    item.setAngularVelocity(-360);
    playSfx('throw');
  }

  reflect(item) {
    item.reflected = true;
    item.setTintFill(0xfff2a0);
    const dx = this.dog.x - item.x;
    const dy = (this.dog.y - 30) - item.y;
    const len = Math.hypot(dx, dy) || 1;
    item.setVelocity((dx / len) * BOSS.reflectSpeed, (dy / len) * BOSS.reflectSpeed);
    item.setAngularVelocity(720);
    playSfx('reflect');
  }

  onItemHitsPlayer(item) {
    if (this.over || item.reflected) return;
    const fromX = item.x;
    item.destroy();
    if (this.player.hurt(this.now, fromX)) {
      this.hud.refresh();
      this.cameras.main.shake(120, 0.006);
      if (this.player.hp <= 0) this.gameOver();
    }
  }

  onItemHitsDog(item) {
    if (this.over || !item.reflected) return;
    item.destroy();
    this.damageBoss();
  }

  damageBoss() {
    this.bossHp -= 1;
    playSfx('hit');
    this.cameras.main.shake(150, 0.008);
    this.dog.setTintFill(0xffffff);
    this.time.delayedCall(90, () => { if (this.dog.active && !this.over) this.dog.clearTint(); });
    this.bossBar.setScale(Math.max(this.bossHp, 0) / BOSS.maxHp, 1);
    if (this.bossHp <= 0) this.win();
  }

  win() {
    this.over = true;
    for (const item of this.items.getChildren().slice()) item.destroy();
    this.physics.pause();
    this.dog.clearTint();
    this.dog.setAlpha(0.55);
    playSfx('win');
    this.add.text(GAME_W / 2, GAME_H / 2 - 40, 'BIG DOG IS DOWN!', {
      fontFamily: FONT, fontSize: '56px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5).setDepth(60);
    this.add.text(GAME_W / 2, GAME_H / 2 + 20, 'Pawlice Station is yours, Mayor.', {
      fontFamily: FONT, fontSize: '24px', color: COLORS.ink,
    }).setOrigin(0.5).setDepth(60);
    Progress.mark(this, 'station');
    this.time.delayedCall(3200, () => this.scene.start('Overworld'));
  }

  gameOver() {
    if (this.over) return;
    this.over = true;
    this.physics.pause();
    this.player.setTint(0x888888);
    this.add.text(GAME_W / 2, GAME_H / 2 - 20, 'OUT COLD', {
      fontFamily: FONT, fontSize: '64px', fontStyle: 'bold', color: COLORS.danger,
    }).setOrigin(0.5).setDepth(60);
    this.time.delayedCall(1400, () => this.scene.restart());
  }

  update(time) {
    if (this.over) return;
    this.now = time;
    this.player.update(time);

    // Throw on a timer. Big Dog flashes yellow just before each throw.
    if (!this.nextThrowAt) this.nextThrowAt = time + BOSS.firstThrowMs;
    if (time >= this.nextThrowAt) {
      this.throwItem();
      this.dog.clearTint();
      this.warned = false;
      this.nextThrowAt = time + this.throwInterval();
    } else if (!this.warned && time >= this.nextThrowAt - 350) {
      this.warned = true;
      this.dog.setTint(0xffd27a);
    }

    // Scratch: send any thrown item back at him. Clean up items that left the screen.
    const rect = this.player.scratchRect(time);
    for (const item of this.items.getChildren().slice()) {
      if (item.x < -60 || item.x > GAME_W + 60 || item.y < -60 || item.y > GAME_H + 60) {
        item.destroy();
        continue;
      }
      if (rect && !item.reflected && !this.player.attackHits.has(item)) {
        const b = item.body;
        if (Phaser.Geom.Intersects.RectangleToRectangle(rect, new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height))) {
          this.player.attackHits.add(item);
          this.reflect(item);
        }
      }
    }
  }
}
