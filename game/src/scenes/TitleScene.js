class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    this.add.text(GAME_W / 2, 110, 'MAYOR OF', {
      fontFamily: FONT, fontSize: '36px', color: COLORS.ink,
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, 175, 'CAT CITY', {
      fontFamily: FONT, fontSize: '88px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5);

    buildMenu(this, [
      { label: 'Start',   action: () => { Progress.reset(this); this.scene.start('Intro'); } },
      { label: 'Options', action: () => this.scene.start('Options') },
      { label: 'Quit',    action: () => this.scene.start('Quit') },
    ], GAME_W / 2, 320, 56);

    this.add.text(GAME_W / 2, GAME_H - 36, 'Up / Down choose    Enter select', {
      fontFamily: FONT, fontSize: '16px', color: COLORS.dim,
    }).setOrigin(0.5);
  }
}
