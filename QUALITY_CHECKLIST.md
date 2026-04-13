# Quality Checklist / 质量检查清单

Use this before publishing generated pages or adding new content.

## Functional QA
- All local links resolve from `index.html`, daily pages, weekly print packets, challenges, and game pages.
- Language toggle works before and after interactive state changes.
- Daily `Mark Complete` updates `localStorage` and homepage week progress.
- The homepage buddy panel shows total collected day stamps and unlocked challenge games.
- Weekly challenge completion unlocks that week's reward game.
- Locked reward games clearly point back to the weekly challenge.

## Bilingual Content
- Every visible child, parent, button, status, and result string has Simplified Chinese and English.
- Chinese is short, natural, and parent-friendly.
- English is warm, simple, and uses American spelling.
- Dynamic result text does not mix Chinese concepts into English or English concepts into Chinese.

## Pedagogy
- Daily pages keep the `2 warm-up / 3 main-focus / 3 mixed-review` structure.
- Problems support `Build -> See -> Write` or an equivalent concrete-to-written path.
- Parent guidance includes `Emphasize`, `Watch for`, `Ask`, and `Tip`.
- Watch-for guidance names the likely misconception, not just a generic warning.
- Weekly challenges start with confidence-building questions and include cumulative review.

## Print
- Daily print keeps answer space, section grouping, adult guidance, and high contrast.
- Weekly packet print keeps exactly 4 questions per compiled sheet.
- Weekly and full-program compiled sheets keep `Emphasize`, `Watch`, `Ask`, and `Tip`.
- Question blocks avoid splitting across pages.
- Black-and-white output remains readable.

## Accessibility And UX
- Buttons and links are keyboard focus-visible.
- Touch targets are at least 44px tall.
- The page still makes sense with reduced motion enabled.
- Child-facing text stays short and visually supported.
- Reward language celebrates completion and effort, not only perfect accuracy.

## Reward Games
- Each week has a unique game name, theme, instruction, and at least 6 rounds.
- Games are choice-based or gentle interaction, not twitch-heavy.
- Replay is available without making the game the main curriculum.
- Locked/unlocked state is clear from both homepage and game page.
- Week cards show the unique reward game name, not just a generic game label.
