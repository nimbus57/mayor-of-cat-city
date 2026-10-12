// A web page cannot close its own tab, so Quit shows a goodbye screen instead.
class QuitScene extends Phaser.Scene {
  constructor() { super('Quit'); }

  create() {
    this.add.text(GAME_W / 2, GAME_H / 2 - 30, 'Thanks for playing!', {
      fontFamily: FONT, fontSize: '56px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, GAME_H / 2 + 40, 'Cat City will be here when you get back.', {
      fontFamily: FONT, fontSize: '22px', color: COLORS.ink,
    }).setOrigin(0.5);

    const prompt = this.add.text(GAME_W / 2, GAME_H - 60, 'press Enter for the title screen', {
      fontFamily: FONT, fontSize: '18px', color: COLORS.dim,
    }).setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });

    const toTitle = (ev) => { if (!ev.repeat) this.scene.start('Title'); };
    this.input.keyboard.on('keydown-ENTER', toTitle);
    this.input.keyboard.on('keydown-ESC', toTitle);
    this.input.on('pointerdown', () => this.scene.start('Title'));
  }
}
