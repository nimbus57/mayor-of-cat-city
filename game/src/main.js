Settings.load();

const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'game',
  backgroundColor: '#14182b',
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [
    BootScene,
    TitleScene,
    OptionsScene,
    QuitScene,
    IntroScene,
    new StubScene('Level', 'Overworld', 'The side-scrolling level goes here.'),
    new StubScene('Overworld', 'Title', 'The city map goes here.'),
  ],
};

new Phaser.Game(config);
