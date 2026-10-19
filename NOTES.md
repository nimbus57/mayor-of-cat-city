# Notes

Where things stand, what was assumed, and what has and has not been checked.

## Assumptions made (change any of these)
- Phaser 3.80.1 from a CDN, plain script tags, no build step, no modules. Chosen for ease of editing.
- Logical resolution is fixed at 960x540. The canvas scales to fit the page but keeps its shape.
- Quit shows a Thanks for playing screen, because a web page cannot close its own tab.
- Pawlice Station is the final level and holds the Big Dog fight, since the final level is where he throws things. The two levels before it are the Museum and the Renaissance Faire, which are location names from earlier design notes. Their layouts are placeholders.
- Level layout: a floor plus one-way platforms on three tiers, 100px apart. A full jump rises about 123px.
- Enemies: rats stay knocked out, raccoons wake after about 3.2 seconds. They only patrol. They do not chase.
- Health: 3 hits. 0 HP restarts the level or the fight.
- Boss: 5 reflected hits wins. He throws faster as he is hurt.
- Added beyond what was asked, because they affect how a platformer feels: coyote time, jump buffering, variable jump height, and Down + Jump to drop through platforms.
- The scratch/roar power bar from the earlier design is not built, as requested.

## What was checked
Every version was loaded in headless Chromium with Phaser 3.80.1 and played through a scripted run. No console errors in any version.
- v01 to v03: scene flow, menu movement, Sound toggle, intro paging.
- v04: walking, jumping, camera.
- v05: jumping up through a platform and landing on it, dropping through with Down + Space, exit door returning to the title.
- v06: scratch knocks out a rat (stays down) and a raccoon (wakes after about 3 seconds), contact damage, 0 HP restart.
- v07: thrown item is reflected by a scratch, reflected item damages Big Dog, 5 hits ends the fight. This test caught one bug (the dog ignored reflected items), now fixed.
- v08: the full loop Title, Intro, map, Museum, map, Faire, map, locked then unlocked station, boss, map, Title.
- v09: with a simulated touchscreen (`TOUCH=1`, `tools/steps_touch.json`): walk with the arrow buttons, slide a press from one arrow to the other, release, quick-tap jump, scratch, hold down + tap jump to drop through a platform, MAP button back to the map. Buttons hidden on desktop, shown with `?touch=1` and clickable with the mouse, hidden with `?touch=0`. All the older step files still pass.

## What was not checked
- How the controls feel under a real keyboard. The tests drive the game with synthetic key events and by moving the Mayor directly. Jump height, speed, enemy speed and boss pacing are guesses until someone plays it.
- Sound. The beeps are generated in code and the tests cannot hear them.
- A full manual playthrough of either level from start to end, including whether every platform jump is comfortable.
- Real phones. The touch buttons (v09) were only driven by simulated touches, never by a thumb on a real screen.
- Whether the Sound setting survives a reload inside an embedded page. Storage may be blocked there.

## Rough edges worth knowing
- Knocked-out enemies are a dark tint plus a text marker, not art.
- Progress on the map is not saved across page loads.
- Both levels use the same two enemy types.
- Thrown items aim at where you are when they are thrown and do not track you.

## Open design decisions (belong to the game's designer)
- What the scratch/roar power bar does: a resource, a charge-up or a cooldown, and what the roar does.
- The full enemy roster and what each one does that is different.
- Whether the Mayor should have a second attack, and whether the boss gets phases.
- Art direction, and when to replace the placeholder shapes.
- Touch controls: decided by the designer on 2026-10-19. On-screen buttons that copy the keyboard (built in v09), not tap-to-move gestures.

## Agent log
Append one entry per working session: date, what changed, what was guessed, questions for the designer.

### 2026-10-19
- Changed: smoke tests fixed for v08 (separate commit, no tag), then v09 touch controls.
- Found: `tools/smoke.py` pressed keys with zero hold time. Phaser forgets a key released before the next frame, so before this fix the scripted jumps, drops and scratches mostly did nothing, and the earlier "What was checked" entries for v04 to v06 probably did not test what they say. Presses are now held 50ms, and the movement, platform, combat and boss scripts were rerun against v08 and pass with the expected results.
- Found: the movement, platform, combat and boss scripts were written for v04 to v07 and broke on v08, which added the map between the intro and the levels. Updated to go through the map.
- Guessed: button positions and sizes (`TOUCH` in `config.js`), and that MAP sits top centre. Buttons show only on touch devices, with `?touch=1` / `?touch=0` to override.
- Questions for the designer: after playing on a phone, are the buttons the right size and place? Should the Mayor's start point move out from under the left arrow? Is an on-screen way back from the map to the title wanted?
