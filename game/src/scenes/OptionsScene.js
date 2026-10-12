class OptionsScene extends Phaser.Scene {
  constructor() { super('Options'); }

  create() {
    this.add.text(GAME_W / 2, 120, 'OPTIONS', {
      fontFamily: FONT, fontSize: '56px', fontStyle: 'bold', color: COLORS.accent,
    }).setOrigin(0.5);

    const back = () => { playSfx('back'); this.scene.start('Title'); };

    buildMenu(this, [
      { label: () => 'Sound: ' + (Settings.soundOn ? 'ON' : 'OFF'), action: () => Settings.toggleSound() },
      { label: 'Back', action: back },
    ], GAME_W / 2, 270, 60);

    this.input.keyboard.on('keydown-ESC', (ev) => { if (!ev.repeat) back(); });

    this.add.text(GAME_W / 2, GAME_H - 36, 'Enter toggles    Esc goes back', {
      fontFamily: FONT, fontSize: '16px', color: COLORS.dim,
    }).setOrigin(0.5);
  }
}
