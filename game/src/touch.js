// On-screen buttons for phones and tablets: left, right and down for the left thumb,
// scratch and jump for the right thumb, and a small MAP button that works like Esc.
// The Mayor reads these alongside the keyboard, so both always work.
// Shown on touch devices. ?touch=1 in the URL forces them on (try them with a mouse), ?touch=0 hides them.
function touchControlsWanted(scene) {
  let force = null;
  try { force = new URLSearchParams(window.location.search).get('touch'); } catch (e) { /* ignore */ }
  if (force === '1') return true;
  if (force === '0') return false;
  return !!scene.sys.game.device.input.touch;
}

class TouchControls {
  constructor(scene, onBack) {
    this.held = { left: false, right: false, down: false, jump: false, scratch: false };
    // A tap can start and end between two frames. Presses are latched here until
    // the Mayor reads them, so a quick tap still jumps or scratches.
    this.pressed = { jump: false, scratch: false };
    this.enabled = touchControlsWanted(scene);
    if (!this.enabled) return;

    // Two thumbs at once (run and jump) needs more than Phaser's default single touch pointer.
    const input = scene.input;
    if (input.manager.pointersTotal < TOUCH.pointers + 1) input.addPointer(TOUCH.pointers + 1 - input.manager.pointersTotal);

    const owners = {};   // button name -> Set of pointer ids holding it
    const press = (name, pointer) => {
      const set = owners[name];
      if (!set.size && name in this.pressed) this.pressed[name] = true;
      set.add(pointer.id);
      this.held[name] = true;
      buttons[name].setFillStyle(TOUCH.color, TOUCH.pressedAlpha);
    };
    const release = (name, pointer) => {
      const set = owners[name];
      set.delete(pointer.id);
      if (set.size) return;
      this.held[name] = false;
      buttons[name].setFillStyle(TOUCH.color, TOUCH.alpha);
    };
    const releasePointer = (pointer) => { for (const name in owners) if (owners[name].has(pointer.id)) release(name, pointer); };

    const buttons = {};
    for (const name of ['left', 'right', 'down', 'jump', 'scratch']) {
      owners[name] = new Set();
      const b = this.makeButton(scene, name);
      buttons[name] = b;
      b.on('pointerdown', (pointer) => press(name, pointer));
      // Sliding a thumb from one button onto another moves the press with it.
      b.on('pointerover', (pointer) => { if (pointer.isDown) press(name, pointer); });
      b.on('pointerout', (pointer) => { if (owners[name].has(pointer.id)) release(name, pointer); });
    }
    input.on('pointerup', releasePointer);
    input.on('pointerupoutside', releasePointer);

    const back = this.makeButton(scene, 'back');
    back.on('pointerdown', () => onBack());
  }

  // Returns true once per press of jump or scratch.
  consume(name) {
    const was = this.pressed[name];
    this.pressed[name] = false;
    return was;
  }

  makeButton(scene, name) {
    const [x, y, r] = TOUCH.buttons[name];
    const b = scene.add.circle(x, y, r, TOUCH.color, TOUCH.alpha)
      .setStrokeStyle(3, 0xffffff, TOUCH.strokeAlpha)
      .setScrollFactor(0).setDepth(100);
    b.setInteractive(new Phaser.Geom.Circle(r, r, r * TOUCH.hitPad), Phaser.Geom.Circle.Contains);

    const ink = 0xffffff;
    const s = r * 0.84;   // arrow size; triangle points run 0..s and the shape is centred on (x, y)
    const arrows = {
      left: [s, 0, s, s, 0, s / 2],
      right: [0, 0, 0, s, s, s / 2],
      down: [0, 0, s, 0, s / 2, s],
    };
    if (arrows[name]) {
      scene.add.triangle(x, y, ...arrows[name], ink, 0.85).setScrollFactor(0).setDepth(101);
    } else {
      const label = { jump: 'JUMP', scratch: 'SCRATCH', back: 'MAP' }[name];
      scene.add.text(x, y, label, {
        fontFamily: FONT, fontSize: name === 'back' ? '13px' : '15px', fontStyle: 'bold', color: COLORS.ink,
      }).setOrigin(0.5).setAlpha(0.9).setScrollFactor(0).setDepth(101);
    }
    return b;
  }
}
