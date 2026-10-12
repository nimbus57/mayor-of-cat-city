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

  // Things Big Dog throws. Three shapes, 28 x 28 each.
  bake('item_can', 28, 28, (d) => {
    d.fillStyle(0xb7bfcc); d.fillRect(3, 6, 22, 22);
    d.fillStyle(0xd9dee8); d.fillRect(1, 2, 26, 6);
    d.fillStyle(0x7a8294); d.fillRect(8, 10, 2, 16); d.fillRect(14, 10, 2, 16); d.fillRect(20, 10, 2, 16);
  });
  bake('item_bone', 28, 28, (d) => {
    d.fillStyle(0xf1e6c8); d.fillRect(4, 11, 20, 6);
    d.fillCircle(5, 10, 4); d.fillCircle(5, 18, 4); d.fillCircle(23, 10, 4); d.fillCircle(23, 18, 4);
  });
  bake('item_boot', 28, 28, (d) => {
    d.fillStyle(0x8a5a33); d.fillRect(8, 2, 12, 16); d.fillRect(8, 16, 20, 10);
    d.fillStyle(0x3b2412); d.fillRect(8, 24, 20, 4);
  });

  // Big Dog, facing left toward the Mayor. 130 x 150.
  bake('bigdog', 130, 150, (d) => {
    d.fillStyle(0x6d4326); d.fillRect(30, 70, 100, 80);                   // body
    d.fillStyle(0x8a5a33); d.fillRect(0, 0, 100, 84);                     // head
    d.fillStyle(0x4a2c17); d.fillRect(76, 4, 24, 58);                     // floppy ear
    d.fillStyle(0xc79a6b); d.fillRect(0, 44, 40, 36);                     // snout
    d.fillStyle(0x111111); d.fillRect(0, 46, 12, 10);                     // nose
    d.fillStyle(0xffffff); d.fillRect(40, 24, 16, 14);                    // eye
    d.fillStyle(0xcc2222); d.fillRect(40, 28, 8, 8);                      // pupil
    d.fillStyle(0x1a1008); d.fillRect(34, 15, 30, 6);                     // angry brow
    d.fillStyle(0xffffff); d.fillRect(6, 74, 5, 8); d.fillRect(18, 74, 5, 8);    // fangs
    d.fillStyle(0x2b2b33); d.fillRect(20, 82, 90, 12);                    // spiked collar
    d.fillStyle(0xcfd3dc);
    d.fillTriangle(26, 82, 32, 70, 38, 82); d.fillTriangle(48, 82, 54, 70, 60, 82);
    d.fillTriangle(70, 82, 76, 70, 82, 82); d.fillTriangle(92, 82, 98, 70, 104, 82);
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
