# Agent brief: Mayor of Cat City

You are continuing a small browser game prototype kept in git. Before changing anything, read:
1. `README.md`
2. `NOTES.md`
3. `docs/DESIGN.md` (required): the design document as plain text. The source of truth is `docs/mayor_of_cat_city_design_doc(1).docx`. If the two disagree, the .docx wins.
4. `docs/DESIGN_GAPS.md` (required): where the prototype and the design document disagree, and the questions waiting on the designer.
5. The latest section of `CHANGELOG.md`.

## The game
A 2D side-scrolling platformer with a pun-heavy cat and police theme and a warm tone. The player is the interim mayor of Cat City. The last mayor quit. Big Dog and his animal hooligans hold the Pawlice Station. The player scratches enemies to knock them out (some wake back up), climbs Contra-style tiers of platforms, and finally scratches Big Dog's thrown items back at him. An overworld map links the locations.

## Current state
The latest tag (`git describe --tags`, currently `v09`) is complete: title, options, intro, overworld, two levels, boss, and on-screen touch buttons. It is a prototype. It may become the base of the real game, so read the code in `game/` before building on it.

## Rules for working
1. Make one small change per commit. One new behavior per version, small enough that the designer can read the whole change in a few minutes.
2. Commit it with a message like `v10: <short title>` and a body saying what changed, then tag that commit with the next version number (`git tag v10`, then `v11`, ...).
3. Experiments go on a branch (`git switch -c try-touch-controls`). Merge to `main` only when accepted, then tag the merge as the next version.
4. Never rewrite history. No amending, rebasing or force-pushing commits that already exist, and never move or delete a tag.
5. The repo is on GitHub as `origin` (https://github.com/nimbus57/mayor-of-cat-city). Ask the designer before every push, and say what will go up: which branch, which commits and which tags. Push only after they say yes. A yes covers that push only, not later ones. If they say no, leave the work committed locally.
6. Every commit on `main` must stay playable. Run `tools/smoke.py` against `game/index.html` (see the top of that file) and fix any console error before committing.
7. Add a section to `CHANGELOG.md` for each version in the same shape as the others: what changed, known rough edges, what to try, what comes next.
8. Append an entry to the Agent log in `NOTES.md`: what you changed, what you guessed, and any questions.
9. Keep to the existing stack: plain JavaScript, Phaser 3.80.1 from the CDN, no build step, no new libraries, fixed 960x540. All art stays as generated placeholder shapes in `textures.js`. Do not add image or audio files.
10. Put numbers in `config.js`, level layouts in `levels.js`, and enemy kinds in `enemy.js`, the way the existing code does.
11. Do not claim something works unless you ran it. If you could not test something, say so in `NOTES.md`.

## What you may not decide
The open design decisions at the bottom of `NOTES.md` and the questions in `docs/DESIGN_GAPS.md` belong to the designer. Do not pick for them. If a task depends on one, write your options and a recommendation into the Agent log and stop at that point. Do the parts that do not depend on it.

## Suggested next tasks, in order
1. Playtest `v09` by reading the code and running the smoke tests. List anything that looks unfair, broken or confusing in `NOTES.md`. Do not fix design questions.
2. Fix any real bugs found, committed and tagged as `v10`.
3. Stop and ask the designer about the power bar before building it.
