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

## Checks

Run from this directory:

```
node --check reading.js
node --check curriculum.js
node scripts/audit-reading.js
node scripts/audit-site.js
```

Reading checks cover all 60 chapters, alphabet coverage, target counts and lengths, cumulative passage vocabulary, required activity stages, local assets, American spelling, absence of time estimates, legacy state migration, and unavailable storage. Browser QA covers word-building mistakes/corrections, hints, audio controls, chapter completion, drawing return, reload/resume, and bilingual navigation. Browser speech pronunciation must still be reviewed on the child's own device.
