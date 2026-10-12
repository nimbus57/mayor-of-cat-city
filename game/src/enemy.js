// Enemy kinds. To add one: add an entry here, draw its texture in textures.js,
// and place it in a level's `enemies` list.
//   wakes:  true  = gets back up after wakeMs; false = stays down for good
const ENEMY_TYPES = {
  rat:     { w: 28, h: 20, speed: 55, wakes: false },
  raccoon: { w: 30, h: 28, speed: 75, wakes: true, wakeMs: 3200 },
};

class Enemy extends Phaser.Physics.Arcade.Sprite {
  // x: centre of patrol. surfaceY: top of whatever it stands on. range: patrol half-width.
  constructor(scene, x, surfaceY, typeKey, range) {
    const def = ENEMY_TYPES[typeKey];
    super(scene, x, surfaceY - def.h / 2 - 1, typeKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.def = def;
    this.homeX = x;
    this.range = range;
    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.mode = 'patrol';   // 'patrol' or 'ko'
    this.wakeAt = 0;
    this.setCollideWorldBounds(true);
    this.setDepth(8);

    // Little marker above a knocked-out enemy: z z z means it will wake up, x_x means it will not.
    this.marker = scene.add.text(x, this.y, def.wakes ? 'z z z' : 'x_x', {
      fontFamily: FONT, fontSize: '14px', color: COLORS.ink,
    }).setOrigin(0.5).setDepth(12).setVisible(false);
  }

  update(time) {
    if (this.mode === 'patrol') {
      if (this.x > this.homeX + this.range) this.dir = -1;
      else if (this.x < this.homeX - this.range) this.dir = 1;
      this.setVelocityX(this.dir * this.def.speed);
      this.setFlipX(this.dir < 0);
      return;
    }

    // Knocked out.
    this.setVelocityX(0);
    this.marker.setPosition(this.x, this.y - this.def.h / 2 - 12);
    if (this.def.wakes) {
      const left = this.wakeAt - time;
      if (left <= 0) this.wake();
      // Flicker for the last 0.7s as a warning that it is about to get up.
      else this.setAlpha(left < 700 && Math.floor(time / 90) % 2 ? 0.45 : 1);
    }
  }

  knockOut(time) {
    this.mode = 'ko';
    this.setTint(0x777788);
    this.setVelocity(0, -140);
    this.marker.setVisible(true);
    if (this.def.wakes) this.wakeAt = time + this.def.wakeMs;   // scratching again resets the timer
  }

  wake() {
    this.mode = 'patrol';
    this.clearTint();
    this.setAlpha(1);
    this.marker.setVisible(false);
  }

  // Hit box for scratch checks, taken from the physics body.
  hitRect() {
    const b = this.body;
    return new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height);
  }
}
