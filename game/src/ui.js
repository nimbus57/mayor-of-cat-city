// The Mayor's health: a row of red squares in the top-left corner.
// Call refresh() after the Mayor's hp changes.
function makeHud(scene, player) {
  const pips = [];
  for (let i = 0; i < PLAYER.maxHp; i++) {
    pips.push(
      scene.add.rectangle(16 + i * 30, 44, 22, 22, 0xff6b6b)
        .setOrigin(0).setStrokeStyle(2, 0xffffff, 0.6).setScrollFactor(0).setDepth(50),
    );
  }
  return {
    refresh() {
      pips.forEach((p, i) => p.setFillStyle(i < player.hp ? 0xff6b6b : 0x3a2430));
    },
  };
}

// A vertical keyboard-and-pointer menu shared by the Title and Options scenes.
// items: [{ label: string | () => string, action: () => void }]
function buildMenu(scene, items, x, startY, gap) {
  let index = 0;

  const labelOf = (item) => (typeof item.label === 'function' ? item.label() : item.label);

  const texts = items.map((item, i) => {
    const t = scene.add.text(x, startY + i * gap, '', {
      fontFamily: FONT, fontSize: '34px', color: COLORS.dim,
    }).setOrigin(0.5);
    t.setInteractive({ useHandCursor: true });
    t.on('pointerover', () => { if (index !== i) { index = i; refresh(); } });
    t.on('pointerdown', () => { index = i; activate(); });
    return t;
  });

  function refresh() {
    texts.forEach((t, i) => {
      const selected = i === index;
      t.setText((selected ? '> ' : '  ') + labelOf(items[i]) + (selected ? ' <' : '  '));
      t.setColor(selected ? COLORS.accent : COLORS.dim);
    });
  }

  function activate() {
    playSfx('select');
    items[index].action();
    refresh();
  }

  function move(step) {
    index = (index + step + items.length) % items.length;
    playSfx('move');
    refresh();
  }

  const kb = scene.input.keyboard;
  const once = (fn) => (ev) => { if (!ev.repeat) fn(); };
  kb.on('keydown-UP', once(() => move(-1)));
  kb.on('keydown-W', once(() => move(-1)));
  kb.on('keydown-DOWN', once(() => move(1)));
  kb.on('keydown-S', once(() => move(1)));
  kb.on('keydown-ENTER', once(activate));
  kb.on('keydown-SPACE', once(activate));

  refresh();
  return { refresh };
}
