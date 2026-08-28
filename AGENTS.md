# AGENTS.md

Static portfolio website for Mateo Carvajal (designer/artist, Caracas). No build tools, no frameworks, no package manager. Pure HTML/CSS/JS. Font: Inter via Google Fonts.

## Layout & entrypoints
- `index.html` — main page (hero + accordion work-index, about, skills, contact, more). Pages link back with relative paths (`../index.html`).
- `projects/*.html` — one page per project. Seven exist (brokenbrain, unsounds-records, vindicta-studios, chollett-925, merch-design, shops, websites).
- `minesweeper.html` — hidden easter-egg game. **Do NOT link it visibly.** It is opened by clicking the hero portrait (`index.html`) via inline `onclick`. The portrait is deliberately reusable across pages; don't remove that trigger casually.
- `css/style.css`, `js/main.js` — shared by every page (single stylesheet/script, referenced as `../css` or `../js` from projects).

## Adding images (important)
- Originals are LARGE (often 100-400MB+, PNGs with transparent bg). **Never reference originals in HTML.**
- All `<img src>` must point to a `web/` subfolder next to the originals, e.g. `assets/CHOLLETT925/web/*.jpg` or `assets/CHOLLETT925/CUSTOM WORK/web/*.jpg`.
- Resize helper (1000px long edge, JPEG q85, auto-rotates EXIF): `C:\Users\Mateo\AppData\Local\Temp\opencode\resize-img.ps1` (`-src <file> -dst <web file>`). **Run it per-file in a fresh `powershell` process** (e.g. `& powershell -NoProfile -ExecutionPolicy Bypass -File $script -src ... -dst ...`); reusing one GDI+ process across many files leaks memory and crashes.
- Output extension is always `.jpg` (original `.png`/`.jpeg` → `.jpg`, uppercase kept).
- Keep originals in place; only the resized copies feed the site.

## Sliders / showcases (the site's core pattern)
- Gallery groups: `.slider-wrap` > `[data-slider]` `.slide.active`(first) etc., then `.slider-controls` with `.slider-arrows`, `.slider-current`/`.slider-total`, and `.fullsize-btn`. One `.slider-wrap` per group; each group has an `<h2 class="gallery-title">`.
- Class `squares` = square thumbnails; `adaptive` (BrokenBrain only) resizes to image ratio via JS in main.js.
- Web Dev showcase pages (`shops.html`, `websites.html`): `.showcase`/`.data-showcase` carousel; `.entry-media` may hold a `<video autoplay loop muted playsinline preload="auto">` (no controls, GIF-style). Size the video slot with inline `style="aspect-ratio: <W> / <H>; max-width: min(100%, calc(72vh * 0.75));"` using the video's actual pixel dimensions.
- Adding a slide = duplicate an `<article class="showcase-slide">` or `.slide` block and edit; counters are computed by main.js, nothing to hand-update.

## main.js quirks (do not "clean up")
- Scroll-spy (`navLinks`) maps href→element only for `#`-prefixed hrefs (`hash.startsWith("#")`) — this guard exists specifically so project pages (`../index.html#about`) don't throw. Keep it.
- `year` is set at the top of main.js — a `<span id="year">` in every footer.

## Minesweeper assets (`assets/minesweeper/`)
- `MINE.png` — mine icon. `face-happy.png` / `face-dead.png` / `face-cool.png` — the reset button, swapped on idle / loss / win respectively. All are swappable custom assets, referenced by those exact filenames.

## Repo hygiene
- Commit on each batch of changes (one logical commit per batch). Stage only the files involved in that batch.
- After committing, always ask before pushing.
- Git is initialized (`main`); current staged/unstaged state was in flux (large image originals may bloat the repo). Don't commit unless asked.
- `.gitattributes`: `* text=auto` (LF normalization).
- `opencode.json.txt` is an empty placeholder file — not active config.
