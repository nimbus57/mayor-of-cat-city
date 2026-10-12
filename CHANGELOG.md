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
