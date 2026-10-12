"""Headless smoke test for the game.

Loads the page in headless Chromium, plays a short script of key presses and checks,
prints anything the page logged as an error, and saves screenshots.

Usage:
    python3 tools/smoke.py [target] steps.json

    PHASER_JS=/path/to/phaser.min.js python3 tools/smoke.py tools/steps_full_flow.json
    PHASER_JS=/path/to/phaser.min.js python3 tools/smoke.py some/other/index.html tools/steps_full_flow.json
    (get Phaser with: npm pack phaser@3.80.1 && tar -xzf phaser-3.80.1.tgz package/dist/phaser.min.js,
     or put it at tools/phaser.min.js, which is the default and is ignored by git)

Target defaults to game/index.html. It can be a path to an .html file or to a folder that
holds an index.html, relative to the current directory or to the repo root.
To test an older version, check out its tag first (git checkout v05) or export it with git worktree.
Set VIEWPORT=1000x900 to change the window size.
Each step is [action, argument, wait_ms]:
    press / down / up  a key name (Enter, Escape, ArrowRight, Space, j ...)
    shot               a name; saves tools/_shots/<label>_<name>.png (label is the folder name, e.g. game)
    eval               JavaScript run in the page (the Phaser game is the global `game`); result is printed

Needs: pip install playwright && playwright install chromium
"""
import json
import os
import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PHASER = pathlib.Path(os.environ.get('PHASER_JS', ROOT / 'tools' / 'phaser.min.js'))
SHOTS = pathlib.Path(os.environ.get('SHOTS_DIR', ROOT / 'tools' / '_shots'))
SHOTS.mkdir(parents=True, exist_ok=True)
DEFAULT_TARGET = 'game/index.html'


def resolve_target(target):
    path = pathlib.Path(target)
    if not path.is_absolute() and not path.exists():
        path = ROOT / target
    if path.is_dir():
        path = path / 'index.html'
    if not path.is_file():
        sys.exit(f'smoke.py: no page found at {target}')
    path = path.resolve()
    label = path.parent.name if path.stem == 'index' else path.stem
    return path, label


def run(target, steps, viewport=None):
    if viewport is None:
        w, h = os.environ.get('VIEWPORT', '960x540').split('x')
        viewport = (int(w), int(h))
    path, label = resolve_target(target)
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': viewport[0], 'height': viewport[1]})
        # Software WebGL prints harmless GL performance warnings; ignore those.
        page.on('console', lambda m: errors.append(f'console.{m.type}: {m.text}')
                if (m.type == 'error' or (m.type == 'warning' and 'GL' not in m.text)) else None)
        page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
        page.route('https://cdnjs.cloudflare.com/**',
                   lambda r: r.fulfill(path=str(PHASER), content_type='application/javascript'))
        page.goto(path.as_uri())
        page.wait_for_timeout(800)
        page.mouse.click(viewport[0] - 4, viewport[1] - 4)  # give the page keyboard focus, away from any menu item
        for act, arg, wait in steps:
            if act == 'press':
                page.keyboard.press(arg)
            elif act == 'down':
                page.keyboard.down(arg)
            elif act == 'up':
                page.keyboard.up(arg)
            elif act == 'shot':
                page.screenshot(path=str(SHOTS / f'{label}_{arg}.png'))
            elif act == 'eval':
                print('eval ->', page.evaluate(arg))
            page.wait_for_timeout(wait)
        browser.close()
    print(label, 'ERRORS:' if errors else 'no errors', *errors, sep='\n' if errors else ' ')
    return errors


if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) == 1:
        args = [DEFAULT_TARGET] + args
    if len(args) != 2:
        sys.exit('usage: python3 tools/smoke.py [target] steps.json   (target defaults to game/index.html)')
    steps = json.loads(pathlib.Path(args[1]).read_text())
    sys.exit(1 if run(args[0], steps) else 0)
