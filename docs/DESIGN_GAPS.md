# Design gaps

Where the prototype and the design document disagree. These are the designer's findings from comparing `docs/DESIGN.md` (the design doc, whose source of truth is the .docx) with the game in `game/`.

Nothing here is decided. Do not resolve any of these in code until the designer answers the questions at the bottom.

## Tone
- The doc: nobody gets hurt. Enemies are dizzied and captured. Big Dog is converted, not defeated.
- The prototype: knock-out wording, such as `x_x`, `OUT COLD` and `BIG DOG IS DOWN!`.

## Level order
- The doc: Pawlice Station is Level 1, and Big Dog escapes at the end of it.
- The prototype: Pawlice Station is the locked final level and holds the Big Dog fight.
- Open question: is the throw-and-reflect fight the end of Level 1 (he escapes) or the final showdown (he is converted)?

## Enemies
- The doc: one enemy type in palette swaps. They seek the player when in sight range, leash back to their area, and attack in melee. Mini-bosses guard sub-areas.
- The prototype: rats and raccoons that only patrol.
- Wake-ups (raccoons getting back up) are the designer's idea and are not in the doc.

## Museum and Renaissance Faire
- The doc: the Museum is light-and-shadow stealth with a puzzle finale. The Faire is Assassin's Creed-style traversal.
- The prototype: both are placeholder copies of the same platformer layout.

## Power bar
- Specified in the doc (section 4.2). Deliberately not built yet.

## In the prototype but not in the doc
- Contra-style platform tiers.
- The overworld map.
- The throw-and-reflect boss fight.
- The "last mayor quit" intro.
- Phaser as the engine. The doc recommends Godot.

## Questions for the designer
1. Where does the throw-and-reflect fight sit: the end of Level 1, or the final showdown?
2. Should the prototype follow the doc's tone? That would mean enemies are dizzy and captured, and the Mayor is dizzied instead of losing hit points. If so, do enemies still wake up?
3. What is the next step: the power bar, a tone pass, or touch controls?
