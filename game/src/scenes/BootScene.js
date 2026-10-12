// Runs once at startup. Later versions use it to generate textures.
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    // Stop arrow keys and space from scrolling the web page.
    this.input.keyboard.addCapture('UP,DOWN,LEFT,RIGHT,SPACE');
    // Clicking the game gives it keyboard focus (matters when embedded in a page).
    this.input.on('pointerdown', () => window.focus());
    this.scene.start('Title');
  }
}
