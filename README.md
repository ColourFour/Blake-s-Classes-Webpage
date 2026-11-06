# Little Reading Garden / 阅读小花园

Buildless English alphabet and simplified Chinese starter activities, hosted at the existing GitHub Pages address.

- `index.html`, `reading.css`, `reading.js`: reading garden, lessons, local progress, decorating, and drawing studio.
- English: all 26 upper/lowercase letters, in nine groups; adult sound prompts and device-spoken names/example words. Letter matching is not a decoding assessment.
- Chinese: 12 simplified characters, in six pairs; Mandarin device speech and optional pinyin.
- Each lesson teaches its symbols before recognition practice. Choice distractors come only from the current or earlier groups. Help and assisted completion earn the same decoration. Replays do not duplicate rewards.
- Progress is stored in `little-reading-garden-v1` in this browser's localStorage. It does not sync. Storage failures show a notice. No microphone, analytics, account, or network service is used by the reading application. Device speech availability varies.
- Drawing supports pointer input and keyboard arrows/Space, undo, clear, and PNG download. Drawings are not persisted automatically.
- `math.html`: preserved original math homepage. Existing math files and their old progress keys remain available.
- `scripts/generate-site.js`: generates the original math materials and `math.html`; does not overwrite the new reading homepage or this README.
- `scripts/audit-site.js`: verifies local links and original math materials.

Checks: `node --check reading.js`, `node scripts/audit-site.js`.
Preview: serve this directory with any static web server. No dependencies or build step.

Before publishing: exercise both language paths, wrong-answer feedback, hints, assisted completion, reward persistence after reload, replay deduplication, language toggle, drawing/undo/download, and narrow layouts. Audio pronunciation should also be checked by an adult on the child's actual device.

Teaching reference: https://ies.ed.gov/ncee/wwc/PracticeGuide/21
This is a foundational practice companion, not a full reading curriculum or diagnostic tool.
