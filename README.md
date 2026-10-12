# Mayor of Cat City

A side-scrolling platformer prototype in plain JavaScript and Phaser 3. You are the interim mayor of Cat City. Big Dog and his gang of animal hooligans have taken over the Pawlice Station.

This project is built one small step at a time in git. Each step is one commit on `main`, tagged with its version number (`v01`, `v02`, ...). Every tagged commit is a complete, playable game in `game/`.

## Versions
- `CHANGELOG.md` says what each version changed, what is rough, and what to try.
- `git tag` lists the versions. `git log --oneline --decorate` shows them in order.
- `git show v05` shows what one step changed. `git diff v04 v06` compares any two.
- `git checkout v05` puts an older version in `game/` to play it. `git checkout main` comes back.

## Folders
```
index.html          forwards to game/ (the entry point for GitHub Pages)
game/               the game
docs/               the design document (.docx, the source of truth), a text copy, and the gaps list
tools/              smoke test and its step files
CHANGELOG.md        one section per version
NOTES.md            assumptions, what was and was not checked, open questions, agent log
AGENT_BRIEF.md      rules for anyone (person or agent) continuing the work
```

## Design
`docs/mayor_of_cat_city_design_doc(1).docx` is the design document and the source of truth. `docs/DESIGN.md` is a plain-text copy generated from it. `docs/DESIGN_GAPS.md` lists where the prototype and the design document disagree, and the questions waiting on the designer.

## Run it
Play it online at https://nimbus57.github.io/mayor-of-cat-city/ (GitHub Pages, serving `main`).

Or open `game/index.html` in a desktop browser. It loads Phaser 3.80.1 from a CDN, so it needs an internet connection. To run offline, download `phaser.min.js` from the Phaser package, put it next to `index.html`, and change the script tag to point at it.

## Controls
- Arrows or WASD: move
- Space, Up or W: jump
- Down + Space on a platform: drop through it
- J, Z or X: scratch
- Esc: back

Keyboard only for now. There are no touch controls.

## Layout of the game
```
game/index.html          loads Phaser, then every script in order
game/src/config.js       constants: resolution, physics, player and boss numbers, settings, progress
game/src/audio.js        synthesized sound effects
game/src/ui.js           menu and health display helpers
game/src/textures.js     all placeholder art, drawn from shapes at startup
game/src/levels.js       level data: platforms and enemy placement
game/src/player.js       the Mayor
game/src/enemy.js        enemy kinds and behavior
game/src/scenes/         one file per scene
game/src/main.js         the Phaser config and scene list
```

## Testing
`tools/smoke.py` plays a short scripted run of the game in headless Chromium and reports errors. It tests `game/index.html` by default, or a path you give it. See the top of that file. Step files for the main flows are in `tools/`.

## Handing it to an agent
See `AGENT_BRIEF.md`. Findings and open questions live in `NOTES.md` and `docs/DESIGN_GAPS.md`.
