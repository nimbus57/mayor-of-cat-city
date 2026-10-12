// The Mayor. Walks, jumps, drops through platforms, scratches, and can be hurt.
class Mayor extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setSize(22, 34).setOffset(3, 2);
    this.setDepth(10);

    this.keys = scene.input.keyboard.addKeys({
      left: 'LEFT', right: 'RIGHT', up: 'UP', down: 'DOWN',
      a: 'A', d: 'D', w: 'W', s: 'S', space: 'SPACE',
      j: 'J', z: 'Z', x: 'X',
    });

    this.facing = 1;
    this.hp = PLAYER.maxHp;
    this.coyoteUntil = 0;
    this.bufferUntil = 0;
    this.dropUntil = 0;            // while time < this, one-way platforms are ignored
    this.standingOneWay = false;   // set by the level's collider each frame
    this.attackUntil = 0;          // claws are out until this time
    this.attackReadyAt = 0;        // next time a scratch is allowed
    this.attackHits = new Set();   // things already hit by the current swing
    this.invulnUntil = 0;
    this.stunUntil = 0;
    this.claws = scene.add.graphics().setDepth(11);
  }

  update(time) {
    const k = this.keys;
    const body = this.body;
    const Key = Phaser.Input.Keyboard;
    const grounded = body.blocked.down || body.touching.down;
    if (grounded) this.coyoteUntil = time + PLAYER.coyoteMs;

    const stunned = time < this.stunUntil;

    // Walking: instant start and stop. Skipped briefly after being hurt.
    if (!stunned) {
      const dir = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0);
      this.setVelocityX(dir * PLAYER.speed);
      if (dir !== 0) {
        this.facing = dir;
        this.setFlipX(dir < 0);
      }
    }

    // Jumping, with a short grace period before landing and after leaving a ledge.
    const jumpPressed = Key.JustDown(k.space) || Key.JustDown(k.up) || Key.JustDown(k.w);
    const jumpHeld = k.space.isDown || k.up.isDown || k.w.isDown;
    const downHeld = k.down.isDown || k.s.isDown;
    if (jumpPressed) this.bufferUntil = time + PLAYER.bufferMs;

    if (!stunned && time <= this.bufferUntil && time <= this.coyoteUntil) {
      if (downHeld && this.standingOneWay) {
        // Down + Jump on a platform: fall through it instead of jumping.
        this.dropUntil = time + PLAYER.dropMs;
        this.setVelocityY(120);
      } else {
        this.setVelocityY(-PLAYER.jump);
        playSfx('jump');
      }
      this.bufferUntil = 0;
      this.coyoteUntil = 0;
    }

    // Let go of jump early for a shorter hop (not while flying back from a hit).
    if (!stunned && !jumpHeld && body.velocity.y < -PLAYER.jumpCut) this.setVelocityY(-PLAYER.jumpCut);

    // Scratch.
    const scratchPressed = Key.JustDown(k.j) || Key.JustDown(k.z) || Key.JustDown(k.x);
    if (scratchPressed && !stunned && time >= this.attackReadyAt) {
      this.attackUntil = time + PLAYER.scratchMs;
      this.attackReadyAt = time + PLAYER.scratchCooldownMs;
      this.attackHits.clear();
      playSfx('scratch');
    }
    this.drawClaws(time);

    // Blink while invulnerable.
    if (time < this.invulnUntil) this.setAlpha(Math.floor(time / 90) % 2 ? 0.35 : 1);
    else this.setAlpha(1);

    this.standingOneWay = false;
  }

  // The area in front of the Mayor that a scratch hits, or null when not scratching.
  scratchRect(time) {
    if (time >= this.attackUntil) return null;
    const b = this.body;
    const reach = PLAYER.scratchReach;
    const x = this.facing > 0 ? b.right - 2 : b.left - reach + 2;
    return new Phaser.Geom.Rectangle(x, b.center.y - 24, reach, 44);
  }

  drawClaws(time) {
    const g = this.claws;
    g.clear();
    const r = this.scratchRect(time);
    if (!r) return;
    const t = 1 - (this.attackUntil - time) / PLAYER.scratchMs;   // 0 at start, 1 at end
    g.lineStyle(3, 0xffffff, 1 - t * 0.6);
    for (let i = 0; i < 3; i++) {
      const x = this.facing > 0 ? r.x + 6 + i * 12 : r.right - 6 - i * 12;
      g.lineBetween(x, r.y + 4, x + this.facing * 14, r.bottom - 4);
    }
  }

  // Returns true if the hit landed (false while still invulnerable).
  hurt(time, fromX) {
    if (time < this.invulnUntil) return false;
    this.hp -= 1;
    this.invulnUntil = time + PLAYER.invulnMs;
    this.stunUntil = time + PLAYER.stunMs;
    this.setVelocity(this.x < fromX ? -220 : 220, -260);
    playSfx('hurt');
    return true;
  }
}
