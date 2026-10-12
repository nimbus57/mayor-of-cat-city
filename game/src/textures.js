// All art is generated here from simple shapes, so there are no image files yet.
// Swap these for real sprites later by loading images in BootScene instead.
function makeTextures(scene) {
  if (scene.textures.exists('player')) return;

  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const bake = (key, w, h, draw) => {
    g.clear();
    draw(g);
    g.generateTexture(key, w, h);
  };

  // The Mayor, facing right. 28 x 36.
  bake('player', 28, 36, (d) => {
    d.fillStyle(0xf29b38); d.fillRect(0, 8, 28, 28);                      // body
    d.fillTriangle(2, 10, 7, 0, 13, 10);                                  // left ear
    d.fillTriangle(15, 10, 21, 0, 26, 10);                                // right ear
    d.fillStyle(0xc0392b); d.fillRect(0, 28, 28, 4);                      // mayor's sash
    d.fillStyle(0xffffff); d.fillRect(14, 14, 5, 6); d.fillRect(21, 14, 5, 6); // eyes
    d.fillStyle(0x1b1b1b); d.fillRect(17, 16, 2, 4); d.fillRect(24, 16, 2, 4); // pupils
  });

  // Alley rat, facing right. 28 x 20. Stays down once knocked out.
  bake('rat', 28, 20, (d) => {
    d.fillStyle(0xe0a0a8); d.fillRect(0, 15, 5, 2);                       // tail
    d.fillStyle(0x9aa0b4); d.fillRect(3, 6, 20, 14);                      // body
    d.fillRect(20, 8, 8, 10);                                             // head
    d.fillCircle(21, 6, 4);                                               // ear
    d.fillStyle(0xff4d4d); d.fillRect(24, 11, 2, 2);                      // eye
    d.fillStyle(0x222222); d.fillRect(27, 14, 1, 2);                      // nose
  });

  // Raccoon thug, facing right. 30 x 28. Gets back up after a few seconds.
  bake('raccoon', 30, 28, (d) => {
    d.fillStyle(0x4b4658); d.fillRect(0, 14, 9, 12);                      // striped tail
    d.fillStyle(0xb9b6c4); d.fillRect(2, 14, 2, 12); d.fillRect(6, 14, 2, 12);
    d.fillStyle(0x8d8a99); d.fillRect(6, 10, 24, 18);                     // body
    d.fillTriangle(18, 10, 21, 2, 25, 10); d.fillTriangle(25, 10, 28, 2, 30, 10); // ears
    d.fillStyle(0x1e1c26); d.fillRect(18, 13, 12, 6);                     // mask
    d.fillStyle(0xffffff); d.fillRect(21, 15, 2, 2); d.fillRect(26, 15, 2, 2);   // eyes
  });

  // Neutral grey blocks. Levels colour them with setTint().
  bake('platform', 32, 16, (d) => {
    d.fillStyle(0xcfcfcf); d.fillRect(0, 0, 32, 16);
    d.fillStyle(0xffffff); d.fillRect(0, 0, 32, 4);
    d.fillStyle(0x9a9a9a); d.fillRect(0, 14, 32, 2);
  });

  bake('ground', 32, 40, (d) => {
    d.fillStyle(0xbdbdbd); d.fillRect(0, 0, 32, 40);
    d.fillStyle(0xffffff); d.fillRect(0, 0, 32, 6);
    d.fillStyle(0xa0a0a0); d.fillRect(0, 22, 32, 2);
  });

  // Exit door: a glowing doorway in a wooden frame. 44 x 72.
  bake('door', 44, 72, (d) => {
    d.fillStyle(0x6b4f3a); d.fillRect(0, 0, 44, 72);
    d.fillStyle(0xfff0b0); d.fillRect(6, 8, 32, 64);
    d.fillStyle(0xffd24a); d.fillRect(6, 8, 32, 8);
  });

  // Distant city, tiles horizontally. Seeded so it looks the same every run.
  bake('skyline', 480, 540, (d) => {
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let x = 0;
    while (x < 480) {
      const w = Math.min(30 + Math.floor(rnd() * 40), 480 - x);
      const h = 120 + Math.floor(rnd() * 220);
      d.fillStyle(0x2c3354); d.fillRect(x, 540 - h, w - 4, h);
      d.fillStyle(0xffd88a);
      for (let wy = 540 - h + 12; wy < 520; wy += 22) {
        for (let wx = x + 6; wx < x + w - 12; wx += 14) {
          if (rnd() < 0.28) d.fillRect(wx, wy, 6, 9);
        }
      }
      x += w;
    }
  });

  g.destroy();
}
