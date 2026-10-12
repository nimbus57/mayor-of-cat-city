class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    this.add.text(GAME_W / 2, 170, 'MAYOR OF', {
      fontFamily: FONT, fontSize: '40px', color: COLORS.ink,
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, 250, 'CAT CITY', {
      fontFamily: FONT, fontSize: '96px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5);

    const prompt = this.add.text(GAME_W / 2, 400, 'press Enter', {
      fontFamily: FONT, fontSize: '24px', color: COLORS.dim,
    }).setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });

    this.input.keyboard.on('keydown-ENTER', (ev) => {
      if (!ev.repeat) this.scene.start('Intro');
    });
  }
}
