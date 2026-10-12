// A placeholder scene. It shows its own name and jumps to the next scene on Enter.
// This is how v01 proves the scene manager works before any real scene exists.
// Each stub gets replaced by a real scene in a later version.
class StubScene extends Phaser.Scene {
  constructor(key, nextKey, note) {
    super(key);
    this.nextKey = nextKey;
    this.note = note;
  }

  create() {
    this.add.text(GAME_W / 2, GAME_H / 2 - 40, this.sys.settings.key.toUpperCase(), {
      fontFamily: FONT, fontSize: '56px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, GAME_H / 2 + 30, this.note, {
      fontFamily: FONT, fontSize: '22px', color: COLORS.ink, align: 'center',
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, GAME_H - 50, 'Enter: next scene', {
      fontFamily: FONT, fontSize: '18px', color: COLORS.dim,
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ENTER', (ev) => {
      if (!ev.repeat) this.scene.start(this.nextKey);
    });
  }
}
