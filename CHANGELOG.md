# Changelog

One section per version, oldest first. Each section is that version's original CHANGES.md.

## v01

### v01: Skeleton

First version. Nothing playable yet. The point is the structure everything else plugs into.

#### What is here
- `index.html` loads Phaser 3.80.1 from a CDN, then the game scripts in order.
- Fixed 960x540 logical resolution. The canvas scales to fit its container but never changes shape.
- Five scenes registered with Phaser's scene manager: Boot, Title, Intro, Level, Overworld.
- Intro, Level and Overworld are `StubScene` placeholders. Each one shows its name and moves to the next on Enter.

#### Try it
Press Enter on the title. You should walk through Intro, Level, Overworld and land back on the title.

#### Next (v02)
Real title menu (Start / Options / Quit), an Options screen with a sound toggle, and a Thanks for Playing screen.

## v02

### v02: Title menu, options, quit

#### What changed since v01
- Title screen has a real menu: Start, Options, Quit. Up/Down or W/S to move, Enter or Space to choose. Mouse and touch work too.
- Options screen with one setting, Sound ON/OFF. It is saved in the browser (`localStorage`) and loaded at startup.
- Quit goes to a Thanks for playing screen, because a web page cannot close its own tab. Enter returns to the title.
- `audio.js`: tiny synthesized beeps for menu moves and selects. They respect the Sound setting.
- `ui.js`: `buildMenu()`, the reusable menu used by Title and Options.
- `config.js` gained the `Settings` object.

#### Try it
Turn Sound OFF in Options, go back, and move through the menu. It should be silent. Reload the page and confirm the setting stuck (this may not persist inside some embeds).

#### Next (v03)
The intro story: the last mayor quit, you are the interim mayor, Big Dog's gang holds the Pawlice Station.

## v03

### v03: Intro story

#### What changed since v02
- New `IntroScene`. Four pages of text typed out one letter at a time over a night skyline:
  the last mayor quit, you are the interim mayor, Big Dog's gang has the Pawlice Station, time to get it back.
- Enter or Space finishes the current line first, then advances. Esc skips the whole intro. A click or tap also advances.
- The intro text lives in the `INTRO_PAGES` array at the top of the file. Edit the wording there.
- Start on the title now plays the intro, then lands on the Level stub.

#### Try it
Start a new game and press Enter once mid-sentence (it should finish the line), then again to move on.

#### Next (v04)
The Mayor appears: walking and jumping on placeholder boxes in a scrolling, fixed-height level.
