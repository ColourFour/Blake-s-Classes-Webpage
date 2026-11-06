# Little Reading Garden / 阅读小花园

A buildless bilingual reading pathway at the existing GitHub Pages address. The simple home screen opens three stories per language; each story contains ten substantial chapters. There are no timers, deadlines, or duration labels.

## Curriculum

`curriculum.js` contains the authored chapter content. `reading.js` builds the activity sequences and saves progress. `index.html` and `reading.css` provide the interface.

English:
1. The Alphabet Garden: all 26 upper/lowercase letters, letter names, introductory sound models, oral language, and adult-read narratives.
2. The Picnic Map: 54 two- and three-letter target words, plus explicitly introduced helper words a/the/is. Short vowels and cumulative practice.
3. The Rainbow Crossing: 54 four- and five-letter target words. Consonant clusters precede sh/ch/th/ck/ll/ng. Silent-e and vowel-team patterns are outside this release.

Chinese:
1. The Character Garden: 27 basic simplified characters and review.
2. Hello, Neighbors: 27 additional characters in familiar vocabulary and phrases.
3. Our Picture Book: 27 additional characters in simple sentences.

Every story has nine introduction chapters and one cumulative review chapter. Every chapter includes oral work, learning or review, retrieval, word-building or character use, reading/listening, comprehension, rereading, drawing, paper writing, and recall. Optional pinyin supports new Chinese characters. Alphabet narratives are explicitly adult-read; other child passages contain only previously introduced targets and helper words. Audio models whole words and letter names, not isolated phonemes; a grown-up models phonemes and Chinese stroke order.

## Research and editorial decisions

- IES, Foundational Skills to Support Reading for Understanding: https://ies.ed.gov/ncee/wwc/PracticeGuide/21 — speech sounds and print, decoding, writing, and connected text.
- Department for Education, The Reading Framework: https://www.gov.uk/government/publications/the-reading-framework-teaching-the-foundations-of-literacy — systematic phonics, fluency, and comprehension.
- Chinese Ministry of Education, Chinese-language curriculum (2022): https://www.moe.gov.cn/srcsite/A26/s8001/202204/W020220420582344386456.pdf — basic characters in meaningful everyday contexts, oral language, and pinyin as support.

The ten-chapter structure, 54-word banks, and 27-character sets are editorial choices. They are not research-prescribed mastery quotas or age norms. Word length is the user-facing organization; spelling complexity controls sequencing. This home-practice companion is not an independently validated phonics program or diagnostic assessment. The parent view explains readiness, review, audio limits, and sources.

## State and compatibility

The existing `little-reading-garden-v1` storage key is retained. Legacy `done`, `board`, and `visits` data are preserved. New `chapters`, `resume`, `last`, `active`, and `review` fields store completion notes, activity position, latest chapter/story, and help used. Old mini-lesson completions do not falsely mark larger chapters complete. Assisted and comfortable completion both earn a stamp; repeated completion does not duplicate the stamp.

Audio uses installed American English/Mandarin browser voices. There is no microphone, account, analytics, or cross-device synchronization. Drawings must be downloaded explicitly. Storage failures display a notice.

Original math materials remain at `math.html`; the math generator continues to write that file without overwriting the reading homepage.

## Story games

Each completed chapter contributes its unique piece to a ten-piece collection. The tenth piece triggers an assembly animation and reveals a replayable game. Assisted completion counts, revisits never duplicate pieces, and losing a game never changes reading progress. Previously completed chapters also count automatically.

| Story | Game |
| --- | --- |
| English 1 | Bunny Flight — flap through flower gates |
| English 2 | Picnic Catch — catch falling fruit |
| English 3 | Rainbow Run — jump over garden blocks |
| Chinese 1 | Blossom Pairs — find six matching picture pairs |
| Chinese 2 | Cloud Stack — stack ten blocks |
| Chinese 3 | Gem Bounce — bounce a ball into gems |

`arcade.js` contains the original canvas/DOM games. The action games offer a gentle setting, and all games support pause, restart, and replay. Touch and keyboard controls are available; optional synthesized sound defaults off. Leaving the tab pauses play. Scores are stored separately in `reading-garden-arcade-v1`. No countdowns, ads, purchases, or online services are used. Animation respects reduced-motion preferences.

## Checks

Run from this directory:

```
node --check reading.js
node --check curriculum.js
node --check arcade.js
node scripts/audit-arcade.js
node scripts/audit-reading.js
node scripts/audit-site.js
```

Reading checks cover all 60 chapters, alphabet coverage, target counts and lengths, cumulative passage vocabulary, required activity stages, local assets, American spelling, absence of time estimates, legacy state migration, and unavailable storage. Browser QA covers word-building mistakes/corrections, hints, audio controls, chapter completion, drawing return, reload/resume, and bilingual navigation. Browser speech pronunciation must still be reviewed on the child's own device.

Game checks cover six catalogs, unlock guards, all game outcomes, pause/restart/close, and local scores. Browser checks cover nine-to-ten-piece completion, replay access after reload, all six game interfaces, and mobile layout.

## Child-perspective adversarial audit

The 2026-11-06 audit tested a beginning reader who wants to reach games quickly. It found skip buttons on recognition/building tasks, self-reported recall without an interaction, text-heavy adult instructions, intimidating long step counts, controls pushed off-screen by letter spacing, and one-collision flight rounds.

Fixes: help now models a target without advancing; recognition requires selecting it and word-building requires placing each sound-spelling. Incorrect tiles are rejected immediately with guidance. Recall uses supported recognition rather than an unverified “I tried” button. Every lesson has spoken directions and expandable adult notes. Activity groups contain at most five screens, with optional save/rest checkpoints; all original chapter material and saved positions are retained. Compact layouts keep primary controls visible. Games have spoken directions, a story-return control, and a prominent return option after a round. Flight has hearts and a ten-gate finish.

Run `node scripts/audit-child-flow.js` in addition to the existing checks. It exercises 866 recognition/build screens across all 60 chapters, repeated help, wrong answers, missing speech support, completion, and duplicate rewards. Browser checks include English matching and word building, Chinese recognition, repeated help, reload/resume, mobile layout, game-help pause, and return to the story.

Limits: guided selection is participation, not proof of independent reading. Oral language, retelling, and handwriting still need a grown-up. Audio depends on installed device voices. This was a simulated behavior audit, not observation of a child using the site. Earned games remain available, and no timer or punitive relocking was introduced.

## Picture-first entry

`picture-home.js` and `picture-home.css` provide the child-facing presentation. Two large generated picture buttons start or resume English (Bunny) and Chinese (Panda) directly. The welcome screen is a character picture with an arrow, and lesson directions speak on entry. Navigation, next/help/listen/save actions, story choices, and chapter stepping stones use pictures or icons; accessible text labels remain. The curriculum, earned rewards, and storage format are unchanged. Adult explanations remain in expandable notes and the grown-up dialog. Browser speech requires a suitable installed voice.

The artwork is stored in `assets/picture-entrances.jpg`; it was generated with the built-in ImageGen tool. Run `node scripts/audit-picture-home.js` to check both picture entry points, language routing, welcome presentation, and save-to-home behavior. Browser preview was unavailable during this update; no visual browser verification is claimed for this release.
