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

## v04

### v04: The Mayor walks and jumps

#### What changed since v03
- Start now leads from the intro into a real level: a 3600px wide, 540px tall scrolling stage with a floor and nothing else.
- `player.js`: the `Mayor` class. Arrows or WASD to walk, Space / Up / W to jump. It faces the way it moves.
- Jump feel: a short grace period after walking off a ledge (coyote time), a short buffer if you press jump just before landing, and a shorter hop if you let go of jump early. The numbers are in `PLAYER` in `config.js`.
- `textures.js`: all art is generated from rectangles and triangles at startup. No image files. The Mayor is an orange box with ears and a red sash.
- `levels.js`: level data (name, width, colours). Platforms are an empty list for now.
- `LevelScene.js`: camera follows the Mayor, a slow-scrolling skyline sits behind. Esc returns to the title.
- The leftover `StubScene` is gone because no stubs remain.

#### Try it
Walk right until the camera scrolls. Tap jump and hold jump and compare the heights.

#### Next (v05)
Contra-style platform tiers to jump between, and an exit door.

## v05

### v05: Platform tiers and an exit

#### What changed since v04
- The level has three tiers of platforms above the floor (`TIER.A`, `TIER.B`, `TIER.C` in `levels.js`), 100px apart. A full jump rises about 123px, so each tier is one jump above the last.
- Platforms are one-way. Jump up through them from below and land on top. This is the Contra feel.
- Down + Jump while standing on a platform drops you through it. The floor is solid, so it does not drop.
- An exit door at the far end of the level. Touching it shows LEVEL CLEAR and returns to the title. The real destination comes in later versions.
- Platform data is a plain list of `[left x, top y, width]` in `levels.js`. To change the layout, edit the list.

#### Try it
Climb from the floor to the top tier at the middle of the level, then drop back down with Down + Space. Then reach the door at the far right.

#### Next (v06)
Scratch attack, enemies, knockouts and wake-ups, and Mayor health.

## v06

### v06: Scratch, enemies, health

#### What changed since v05
- Scratch with J, Z or X. White claw marks flash in front of the Mayor for a moment. The hit area is a box in front of you (`scratchReach` in `config.js`).
- `enemy.js`: two enemy kinds, both patrolling back and forth on whatever they stand on.
  - Rat: knocked out for good. It shows `x_x`.
  - Raccoon: knocked out for about 3 seconds, then wakes up. It shows `z z z` and flickers for the last 0.7 seconds as a warning. Scratching it again resets the timer.
- Touching an awake enemy costs 1 HP, knocks you back and gives you about a second of invulnerability while you blink. Knocked-out enemies are harmless to touch.
- Health shows as three red squares under the controls hint. At 0 HP the screen says OUT COLD and the level restarts.
- Enemy placement is a list in `levels.js`: `[kind, patrol centre x, surface y, patrol half-width]`. Keep each patrol inside the platform it stands on.
- Sound effects for jump, scratch, knockout, getting hurt and winning.

#### Known rough edges
- Enemies only patrol. They do not chase or attack.
- Knocked-out enemies are shown by a dark tint and a text marker, not art.
- The exit door still just shows LEVEL CLEAR and returns to the title.

#### Try it
Scratch a raccoon and watch it wake up. Scratch a rat and confirm it stays down. Let enemies hit you three times.

#### Next (v07)
The Big Dog boss fight: he throws things from the right side of the screen, you scratch them back at him.

## v07

### v07: Big Dog boss fight

#### What changed since v06
- New `BossScene`: a single-screen arena. Big Dog stands on the right as a solid wall. The Mayor has a floor and a few one-way platforms on the left.
- Big Dog throws junk (a can, a bone or a boot) aimed at where you are. He flashes yellow a moment before each throw.
- Scratch a thrown item and it flies back at him, glowing yellow. Only reflected items hurt him. Items that hit you cost 1 HP.
- Five hits win. His health shows as a bar at the top right.
- He gets faster as he is hurt: shorter gaps between throws and faster items. All the numbers are in `BOSS` in `config.js`.
- Finishing the Museum level now leads to the boss. After the win the game returns to the title for now.
- The art for Big Dog and the thrown items is placeholder shapes in `textures.js`.

#### Known rough edges
- The boss only throws. He has no other attacks and no phases.
- Your health carries nothing between scenes. You start the boss fight at 3 HP.
- The Pawlice Station is reached by finishing the Museum. A map to choose levels arrives in v08.

#### Try it
Scratch a thrown item right as it reaches you. Then let a few hit you to see the OUT COLD restart.

#### Next (v08)
The overworld map with the city's locations, which launches each level and the boss.
