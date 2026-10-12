// The Mayor. Walks, jumps, and faces the way it moves.
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
    });

    this.facing = 1;
    this.coyoteUntil = 0;
    this.bufferUntil = 0;
  }

  update(time) {
    const k = this.keys;
    const body = this.body;
    const grounded = body.blocked.down || body.touching.down;
    if (grounded) this.coyoteUntil = time + PLAYER.coyoteMs;

    // Walking: instant start and stop, which is what a platformer like this wants.
    const dir = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0);
    this.setVelocityX(dir * PLAYER.speed);
    if (dir !== 0) {
      this.facing = dir;
      this.setFlipX(dir < 0);
    }

    // Jumping, with a short grace period before landing and after leaving a ledge.
    const Key = Phaser.Input.Keyboard;
    const pressed = Key.JustDown(k.space) || Key.JustDown(k.up) || Key.JustDown(k.w);
    const held = k.space.isDown || k.up.isDown || k.w.isDown;
    if (pressed) this.bufferUntil = time + PLAYER.bufferMs;

    if (time <= this.bufferUntil && time <= this.coyoteUntil) {
      this.setVelocityY(-PLAYER.jump);
      this.bufferUntil = 0;
      this.coyoteUntil = 0;
    }

    // Let go of jump early for a shorter hop.
    if (!held && body.velocity.y < -PLAYER.jumpCut) this.setVelocityY(-PLAYER.jumpCut);
  }
}
