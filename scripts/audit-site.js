const fs = require("fs");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function count(haystack, needle) {
  return (haystack.match(new RegExp(needle, "g")) || []).length;
}

const htmlFiles = [
  "index.html",
  "printable.html",
  "full-program-print.html",
  ...fs.readdirSync(".").filter((file) => /^week-.*\.html$/.test(file)).sort()
];

const home = read("index.html");
if (!home.includes("data-buddy-status")) fail("index.html is missing buddy reward status");
for (let week = 1; week <= 12; week += 1) {
  const id = String(week).padStart(2, "0");
  if (!home.includes(`week-${id}-game.html`)) fail(`index.html does not link to week ${week} reward game`);
}

for (const file of htmlFiles) {
  const html = read(file);
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|#|mailto:)/.test(href)) continue;
    if (!fs.existsSync(href)) fail(`${file} links to missing file: ${href}`);
  }
  for (const match of html.matchAll(/src="([^"]+)"/g)) {
    const src = match[1];
    if (/^(https?:|data:)/.test(src)) continue;
    if (!fs.existsSync(src)) fail(`${file} references missing asset: ${src}`);
  }
}

for (const file of fs.readdirSync(".").filter((f) => /^week-\d\d-day-\d\d\.html$/.test(f))) {
  const html = read(file);
  if (count(html, 'class="task-group ') !== 3) fail(`${file} should have 3 daily task groups`);
  if (!html.includes("flow-reminder")) fail(`${file} is missing concrete-to-written flow reminder`);
  if (!html.includes("skill-strip")) fail(`${file} is missing skill journey strip`);
  for (const label of ["重点", "易混点", "引导问题", "小技巧"]) {
    if (!html.includes(label)) fail(`${file} is missing adult support label: ${label}`);
  }
}

for (let week = 1; week <= 12; week += 1) {
  const id = String(week).padStart(2, "0");
  const challengeHtml = read(`week-${id}-challenge.html`);
  const challengeMatch = challengeHtml.match(/<script type="application\/json" id="challengeData">([\s\S]*?)<\/script>/);
  if (!challengeMatch) fail(`week-${id}-challenge.html is missing challenge data`);
  const challenge = JSON.parse(challengeMatch[1]);
  if (challenge.questions.length < 10 || challenge.questions.length > 15) {
    fail(`week-${id}-challenge.html has ${challenge.questions.length} challenge questions`);
  }
  if (!challengeHtml.includes(`week-${id}-game.html`)) fail(`week-${id}-challenge.html does not link to reward game`);

  const gameHtml = read(`week-${id}-game.html`);
  const gameMatch = gameHtml.match(/<script type="application\/json" id="rewardGameData">([\s\S]*?)<\/script>/);
  if (!gameMatch) fail(`week-${id}-game.html is missing reward game data`);
  const game = JSON.parse(gameMatch[1]);
  if (game.rounds.length < 6) fail(`week-${id}-game.html has too few rounds`);

  const printHtml = read(`week-${id}-print.html`);
  if (count(printHtml, 'class="compiled-page"') !== 10) fail(`week-${id}-print.html should have 10 compiled sheets`);
  if (count(printHtml, 'class="compiled-problem"') !== 40) fail(`week-${id}-print.html should have 40 compiled problems`);
  if (count(printHtml, "小技巧") !== 10 || count(printHtml, "Tip") !== 10) {
    fail(`week-${id}-print.html should keep the teaching tip on every compiled sheet`);
  }
}

const fullProgram = read("full-program-print.html");
if (count(fullProgram, 'class="compiled-page"') !== 120) fail("full-program-print.html should have 120 compiled sheets");
if (count(fullProgram, 'class="compiled-problem"') !== 480) fail("full-program-print.html should have 480 compiled problems");
if (count(fullProgram, "小技巧") !== 120 || count(fullProgram, "Tip") !== 120) {
  fail("full-program-print.html should keep the teaching tip on every compiled sheet");
}

const stale = /Star Blocks|data-game-canvas|reward-game is-hidden|game-controls|game-tip|data-game-start/;
for (const file of ["script.js", "styles.css", "scripts/generate-site.js", ...htmlFiles]) {
  if (stale.test(read(file))) fail(`${file} contains stale legacy game markup or selectors`);
}

if (!process.exitCode) {
  console.log(`Audit passed for ${htmlFiles.length} HTML files.`);
}
