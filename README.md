# Grade 1 Math Adventure / 一年级数学冒险

Static printable bilingual Grade 1 math program.

- `index.html`: parent/teacher note and 12-week map.
- `printable.html`: compatibility doorway for older printable links.
- `week-01-day-01.html` through `week-12-day-05.html`: daily printable pages.
- `week-01-challenge.html` through `week-12-challenge.html`: online weekly challenge tests with scoring and a short reward game.
- `week-01-game.html` through `week-12-game.html`: unique unlockable weekly reward games.
- `week-01-print.html` through `week-12-print.html`: weekly compiled print packets. Each week prints as 10 pages.
- `full-program-print.html`: full 12-week compiled print packet.
- `styles.css`: shared screen design system.
- `print.css`: print stylesheet.
- `script.js`: small language toggle.
- `scripts/generate-site.js`: reusable structured day-data model plus daily and compiled-print renderers.
- `scripts/audit-site.js`: static QA audit for links, page structure, print packets, challenges, and games.
- `QUALITY_CHECKLIST.md`: product QA checklist for future page/content changes.

Run `node scripts/generate-site.js` after editing the generator to rebuild all pages.
Run `node scripts/audit-site.js` before publishing.
