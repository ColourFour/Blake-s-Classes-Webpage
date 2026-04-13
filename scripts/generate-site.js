const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dayCount = 5;

const weeks = [
  { n: 1, zh: "一年级整数", en: "Grade 1 Whole Numbers", themeZh: "宝藏小岛", themeEn: "Treasure Island", focusZh: "数感、数数、比较、数字和数量配对", focusEn: "number sense, counting, comparing, and matching numerals to amounts", icon: "🏝️", itemZh: "探险帽", itemEn: "explorer hat", color: "#2f8f83", accent: "#f4c64d" },
  { n: 2, zh: "加减应用·10以内", en: "Addition and Subtraction Stories Within 10", themeZh: "动物烘焙坊", themeEn: "Animal Bakery", focusZh: "合起来、拿走、更多、少一些", focusEn: "joining, taking away, more, and fewer within 10", icon: "🧁", itemZh: "小围裙", itemEn: "tiny apron", color: "#c0575b", accent: "#ffd166" },
  { n: 3, zh: "加减应用·20以内", en: "Story Problems Within 20", themeZh: "月亮花园", themeEn: "Moon Garden", focusZh: "20以内故事题、比较和稍大的数量", focusEn: "story problems within 20, comparing, and slightly larger groups", icon: "🌙", itemZh: "月亮发夹", itemEn: "moon clip", color: "#4e72b8", accent: "#f7d774" },
  { n: 4, zh: "数阵图 + 数字规律", en: "Number Grids and Number Patterns", themeZh: "玩具火车镇", themeEn: "Toy Train Town", focusZh: "数阵、顺序、缺数、简单规律", focusEn: "grids, order, missing numbers, and simple patterns", icon: "🚂", itemZh: "小车票", itemEn: "little ticket", color: "#3b7a57", accent: "#f29e4c" },
  { n: 5, zh: "竖式谜 + 巧填算符", en: "Vertical Puzzles and Operation Signs", themeZh: "贴纸实验室", themeEn: "Sticker Lab", focusZh: "缺数、等式真假、选择 + 或 −", focusEn: "missing numbers, true equations, and choosing + or -", icon: "🔬", itemZh: "星星护目镜", itemEn: "star goggles", color: "#2d7d7b", accent: "#78c6a3" },
  { n: 6, zh: "奇偶数", en: "Odd and Even Numbers", themeZh: "森林野餐会", themeEn: "Forest Picnic", focusZh: "配对、单双、有没有剩下", focusEn: "pairing, odd and even, and leftovers", icon: "🧺", itemZh: "野餐披风", itemEn: "picnic cape", color: "#4d8b4a", accent: "#f6bd60" },
  { n: 7, zh: "几何·认识图形与角度", en: "Geometry: Shapes and Corners", themeZh: "云朵城堡", themeEn: "Cloud Castle", focusZh: "平面图形、立体图形、边和角、生活匹配", focusEn: "2D and 3D shapes, sides, corners, and real-world matches", icon: "🏰", itemZh: "云朵皇冠", itemEn: "cloud crown", color: "#5784ba", accent: "#9ee493" },
  { n: 8, zh: "位置与方向 + 观察物体", en: "Position, Direction, and Viewing Objects", themeZh: "小小飞行地图", themeEn: "Tiny Flight Map", focusZh: "上下左右、前后、移动路线、从哪里看", focusEn: "up, down, left, right, front, back, paths, and viewpoints", icon: "🗺️", itemZh: "指南针背包", itemEn: "compass backpack", color: "#2f7f98", accent: "#ffb703" },
  { n: 9, zh: "等量代换", en: "Equal Substitution", themeZh: "彩虹天平屋", themeEn: "Rainbow Balance House", focusZh: "一样多、替换、等量思考", focusEn: "same amount, replacing, and thinking about equality", icon: "⚖️", itemZh: "彩虹徽章", itemEn: "rainbow badge", color: "#32746d", accent: "#80ed99" },
  { n: 10, zh: "排队&重叠问题", en: "Line-Up and Overlap Problems", themeZh: "小侦探俱乐部", themeEn: "Little Detective Club", focusZh: "排队位置、前后第几、重叠和共同部分", focusEn: "order in line, positions, overlaps, and shared parts", icon: "🕵️", itemZh: "侦探放大镜", itemEn: "detective glass", color: "#51606f", accent: "#f4d35e" },
  { n: 11, zh: "两位数加减的进退位 + 还原问题", en: "Two-Digit Regrouping and Restoration Stories", themeZh: "十个一小屋", themeEn: "Tens-and-Ones Cottage", focusZh: "十位个位、进位退位、先后变化和还原", focusEn: "tens and ones, regrouping, and before-after restoration", icon: "🏡", itemZh: "十格小包", itemEn: "ten-frame satchel", color: "#8a6f3d", accent: "#74c69d" },
  { n: 12, zh: "逻辑推理 + 图形规律 + 综合复习", en: "Logic, Shape Patterns, and Cumulative Review", themeZh: "星光庆典", themeEn: "Starlight Celebration", focusZh: "线索推理、图形规律、综合复习和自信收官", focusEn: "clue reasoning, shape patterns, cumulative review, and a confident finish", icon: "🎉", itemZh: "星光伙伴", itemEn: "starlight buddy", color: "#a15c38", accent: "#7bdff2" }
];

const dayInfo = [
  { zh: "第1天：认识新想法", en: "Day 1: Meet the New Idea", rhythmZh: "看图、摆一摆、直接表示。", rhythmEn: "Use pictures, objects, and direct models." },
  { zh: "第2天：一起练一练", en: "Day 2: Guided Practice", rhythmZh: "提示还在，孩子开始多说一点。", rhythmEn: "Keep clues visible and invite the child to explain a little." },
  { zh: "第3天：换个样子练", en: "Day 3: Practice and Variation", rhythmZh: "换场景，减少一点视觉提示。", rhythmEn: "Change settings and reduce some visual cues." },
  { zh: "第4天：迁移小挑战", en: "Day 4: Mixed Transfer", rhythmZh: "轻提示，和旧知识连起来。", rhythmEn: "Use lighter scaffolds and connect to earlier learning." },
  { zh: "第5天：本周小庆祝", en: "Day 5: Week Review", rhythmZh: "综合复习，完成本周收藏。", rhythmEn: "Review, integrate, and collect the weekly reward." }
];

const icons = {
  treasure: ["⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐", "⭐"],
  fruit: ["🍎", "🍐", "🍊", "🍓", "🍇", "🍒"],
  bakery: ["🧁", "🍪", "🥐", "🥨", "🍩", "🥞"],
  garden: ["🌼", "🌱", "🌙", "⭐", "🪴", "🦋"],
  shapes: ["●", "■", "▲", "◆", "⬟", "★"],
  animals: ["🐰", "🐱", "🐶", "🐼", "🦊", "🐻"]
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function esc(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function t(zh, en) {
  return `<span class="lang zh">${zh}</span><span class="lang en">${en}</span>`;
}

function line(labelZh = "答案", labelEn = "Answer") {
  return `<div class="answer-line"><span>${t(labelZh, labelEn)}</span></div>`;
}

function dots(count, icon = "●", mutedFrom = 999) {
  return `<div class="dot-row">${Array.from({ length: count }, (_, i) => `<span class="dot${i >= mutedFrom ? " crossed" : ""}">${icon}</span>`).join("")}</div>`;
}

function groups(a, b, iconA = "●", iconB = "●", op = "+") {
  return `<div class="visual-groups"><span class="pill">${dots(a, iconA)}</span><span class="big-op">${op}</span><span class="pill">${dots(b, iconB)}</span></div>`;
}

function tenFrame(n) {
  return `<div class="ten-frame">${Array.from({ length: 10 }, (_, i) => `<span class="${i < n ? "filled" : ""}"></span>`).join("")}</div>`;
}

function numberPath(nums) {
  return `<div class="number-path">${nums.map(v => `<span>${v === null ? "?" : v}</span>`).join("")}</div>`;
}

function compareBars(a, b, labels = ["A", "B"]) {
  return `<div class="compare-bars"><div><b>${labels[0]}</b><span style="--w:${a}">${a}</span></div><div><b>${labels[1]}</b><span style="--w:${b}">${b}</span></div></div>`;
}

function pattern(items) {
  return `<div class="pattern-row">${items.map(x => `<span>${x}</span>`).join("")}<span class="blank-tile">?</span></div>`;
}

function grid(numbers, cols = 5) {
  return `<div class="mini-grid" style="--cols:${cols}">${numbers.map(n => `<span>${n === null ? "?" : n}</span>`).join("")}</div>`;
}

function equation(parts) {
  return `<div class="equation">${parts.map(p => `<span>${p}</span>`).join("")}</div>`;
}

function shapeSet(items) {
  return `<div class="shape-set">${items.map(s => `<span class="shape-token">${s}</span>`).join("")}</div>`;
}

function mapPath() {
  return `<div class="map-grid"><span>🏠</span><span>→</span><span>🌳</span><span>↑</span><span>⭐</span><span>←</span><span>🧁</span><span>↓</span><span>🏁</span></div>`;
}

function balance(left, right) {
  return `<div class="balance"><div>${left}</div><div class="beam">=</div><div>${right}</div></div>`;
}

function queue(n, mark) {
  return `<div class="queue">${Array.from({ length: n }, (_, i) => `<span class="${i + 1 === mark ? "marked" : ""}">${i + 1 === mark ? "🐥" : "○"}</span>`).join("")}</div>`;
}

function tensOnes(tens, ones) {
  return `<div class="place-value"><div><b>${t("十位", "Tens")}</b>${Array.from({ length: tens }, () => "<span class='ten-stick'></span>").join("")}</div><div><b>${t("个位", "Ones")}</b>${dots(ones, "●")}</div></div>`;
}

function p(section, zh, en, visual, answer = "") {
  return { section, zh, en, visual, answer };
}

function warmups(week, day) {
  const a = 3 + ((week.n + day) % 5);
  const b = 5 + ((week.n * 2 + day) % 6);
  if (week.n === 1) {
    return [
      p("warm", `数一数：有几颗星？`, `Count: how many stars?`, dots(a, "⭐")),
      p("warm", `圈出数字 ${b}。`, `Circle the number ${b}.`, numberPath([b - 2, b, b + 1, b - 1]))
    ];
  }
  if (week.n <= 3) {
    return [
      p("warm", `快数一数。`, `Quick count.`, tenFrame(Math.min(10, a + 1))),
      p("warm", `哪边更多？`, `Which side has more?`, compareBars(a, b, ["A", "B"]))
    ];
  }
  if (week.n <= 6) {
    return [
      p("warm", `补上缺少的数。`, `Fill the missing number.`, numberPath([a, a + 1, null, a + 3])),
      p("warm", `看一看：能配成一对吗？`, `Look: can they make pairs?`, dots(a + day, "●"))
    ];
  }
  if (week.n <= 8) {
    return [
      p("warm", `找一找相同的图形。`, `Find the matching shape.`, shapeSet(["●", "▲", "■", "▲"])),
      p("warm", `小箭头走到哪里？`, `Where does the arrow go?`, mapPath())
    ];
  }
  return [
    p("warm", `先看左边和右边。`, `Look at the left and right sides.`, balance("🍎🍎", "🍎🍎")),
    p("warm", `哪一个线索先知道？`, `Which clue do you know first?`, equation(["A", ">", "B", ",", "B", "=", "3"]))
  ];
}

function coreProblems(week, day) {
  const w = week.n;
  const d = day;
  if (w === 1) {
    return [
      p("core", `把数字和数量连起来：${4 + d}。`, `Match the numeral to the amount: ${4 + d}.`, dots(4 + d, "⭐")),
      p("core", `哪一堆比较多？`, `Which group has more?`, compareBars(5 + d, 3 + d, ["A", "B"])),
      p("core", `从 ${2 + d} 数到 ${7 + d}。`, `Count from ${2 + d} to ${7 + d}.`, numberPath([2 + d, 3 + d, 4 + d, null, 6 + d, 7 + d]))
    ];
  }
  if (w === 2) {
    const a = 2 + d, b = 3, c = 8 + (d % 2), take = 2 + (d % 3);
    return [
      p("core", `小兔有 ${a} 个蛋糕，又拿来 ${b} 个。一共有几个？`, `Bunny has ${a} cakes. ${b} more come. How many in all?`, groups(a, b, "🧁", "🧁")),
      p("core", `盘子里有 ${c} 块饼干，吃掉 ${take} 块。还剩几块？`, `There are ${c} cookies. ${take} are eaten. How many left?`, dots(c, "🍪", c - take)),
      p("core", `哪幅图表示“多 ${b} 个”？`, `Which picture shows “${b} more”?`, groups(a, b, "🐾", "🐾"))
    ];
  }
  if (w === 3) {
    const a = 9 + d, b = 4 + (d % 4), c = 13 + d, take = 5;
    return [
      p("core", `月亮花园有 ${a} 朵花，又开了 ${b} 朵。现在几朵？`, `The moon garden has ${a} flowers. ${b} more bloom. How many now?`, groups(a, b, "🌼", "🌼")),
      p("core", `${c} 颗星星藏起来 ${take} 颗。还看见几颗？`, `${c} stars, ${take} hide. How many can you still see?`, dots(c, "⭐", c - take)),
      p("core", `蓝花 ${12 + d} 朵，黄花 ${8 + d} 朵。蓝花多几朵？`, `${12 + d} blue flowers, ${8 + d} yellow flowers. How many more blue?`, compareBars(12 + d, 8 + d, ["A", "B"]))
    ];
  }
  if (w === 4) {
    return [
      p("core", `火车格子里少了哪个数？`, `Which number is missing in the train grid?`, grid([1 + d, 2 + d, null, 4 + d, 5 + d])),
      p("core", `看规律，下一站是什么？`, `Look at the pattern. What comes next?`, pattern(["🚂", "⭐", "🚂", "⭐", "🚂"])),
      p("core", `每次多 2，填空。`, `Add 2 each time. Fill in.`, numberPath([2, 4, 6, null, 10]))
    ];
  }
  if (w === 5) {
    return [
      p("core", `贴纸谜：□ + ${2 + d} = ${7 + d}。`, `Sticker puzzle: □ + ${2 + d} = ${7 + d}.`, equation(["□", "+", 2 + d, "=", 7 + d])),
      p("core", `选 + 还是 −：${6 + d} ○ ${2 + d} = ${8 + (d * 2)}。`, `Choose + or -: ${6 + d} ○ ${2 + d} = ${8 + d * 2}.`, equation([6 + d, "○", 2 + d, "=", 8 + d * 2])),
      p("core", `竖式里缺了谁？`, `Who is missing in the vertical puzzle?`, `<div class="vertical-math"><span>${3 + d}</span><span>+ □</span><strong>${8 + d}</strong></div>`)
    ];
  }
  if (w === 6) {
    const n = 5 + d;
    return [
      p("core", `${n} 个野餐杯，两两配对，有没有剩下？`, `${n} picnic cups. Pair them. Is one left?`, dots(n, "🥤")),
      p("core", `圈出偶数。`, `Circle the even number.`, numberPath([6 + d, 7 + d, 8 + d, 9 + d])),
      p("core", `把小饼干分给两只小熊，一样多吗？`, `Share cookies with two bears. Can it be equal?`, dots(8 + (d % 2), "🍪"))
    ];
  }
  if (w === 7) {
    return [
      p("core", `找有 3 个角的图形。`, `Find the shape with 3 corners.`, shapeSet(["●", "▲", "■", "◆"])),
      p("core", `哪个物品像圆柱？`, `Which object is like a cylinder?`, shapeSet(["🥫", "🎲", "⚽", "📕"])),
      p("core", `数一数：这个图形有几条边？`, `Count: how many sides does this shape have?`, shapeSet(["⬟"]))
    ];
  }
  if (w === 8) {
    return [
      p("core", `从房子出发：向右，再向上。到哪里？`, `Start at the house: right, then up. Where are you?`, mapPath()),
      p("core", `圈出小猫左边的东西。`, `Circle what is on the cat's left.`, `<div class="position-row"><span>🍎</span><span class="center">🐱</span><span>🧁</span></div>`),
      p("core", `从正面看，哪个像它？`, `From the front, which looks like it?`, shapeSet(["🏠", "⬜", "🔺", "▭"]))
    ];
  }
  if (w === 9) {
    return [
      p("core", `1 个苹果 = 2 颗星。2 个苹果 = 几颗星？`, `1 apple = 2 stars. 2 apples = how many stars?`, balance("🍎", "⭐ ⭐")),
      p("core", `小熊和 3 个方块一样重。画出一样重的一边。`, `Bear equals 3 blocks. Draw the equal side.`, balance("🐻", "■ ■ ■")),
      p("core", `如果 ◆ = 5，◆ + 2 = ?`, `If ◆ = 5, ◆ + 2 = ?`, equation(["◆", "=", 5, "  ", "◆ + 2 = ?"]))
    ];
  }
  if (w === 10) {
    return [
      p("core", `小鸭排第 ${2 + d}。请给它做记号。`, `Duck is number ${2 + d} in line. Mark it.`, queue(8, 2 + d)),
      p("core", `前面有 ${d + 1} 人，后面有 ${3} 人。一共有几人？`, `${d + 1} people are in front, 3 behind. How many in all?`, queue(d + 5, d + 2)),
      p("core", `红队有 6 人，蓝队有 5 人，2 人两个队都参加。总共有几人？`, `Red has 6, blue has 5, 2 are in both. How many people total?`, `<div class="overlap"><span>红 6</span><b>共同 2</b><span>蓝 5</span></div>`)
    ];
  }
  if (w === 11) {
    return [
      p("core", `看十位和个位：这个数是多少？`, `Look at tens and ones. What number is this?`, tensOnes(1 + (d % 2), 3 + d)),
      p("core", `${18 + d} + ${3}，先凑成 20。`, `${18 + d} + 3. Make 20 first.`, tensOnes(1, 8 + d)),
      p("core", `原来不知道。后来有 ${12 + d}，拿走前是多 ${3}。原来是多少？`, `We need the before number. After is ${12 + d}; before was 3 more. What was before?`, equation(["?", "-", 3, "=", 12 + d]))
    ];
  }
  return [
    p("core", `看线索：A 比 B 多，B 比 C 多。谁最多？`, `Use clues: A is more than B. B is more than C. Who has the most?`, equation(["A", ">", "B", ">", "C"])),
    p("core", `图形规律下一步是什么？`, `What shape comes next?`, pattern(["●", "▲", "▲", "●", "▲", "▲"])),
    p("core", `综合小题：先算，再比较。`, `Mixed task: solve first, then compare.`, compareBars(8 + d, 5 + d, ["8+?", "5+?"]))
  ];
}

function mixedProblems(week, day) {
  const pool = [
    () => p("mixed", `数一数并写数字。`, `Count and write the numeral.`, dots(6 + day, "⭐")),
    () => p("mixed", `哪边少？`, `Which side has fewer?`, compareBars(4 + day, 7 + day, ["A", "B"])),
    () => p("mixed", `合起来是多少？`, `How many in all?`, groups(3 + day, 2 + (day % 3), "🍎", "🍎")),
    () => p("mixed", `拿走后还剩多少？`, `How many are left after taking away?`, dots(8 + day, "🍪", 5 + day)),
    () => p("mixed", `补上数。`, `Fill in the number.`, numberPath([2 + day, null, 4 + day, 5 + day])),
    () => p("mixed", `选择 + 或 −。`, `Choose + or -.`, equation([5 + day, "○", 2, "=", 7 + day])),
    () => p("mixed", `能两两配对吗？`, `Can these pair up evenly?`, dots(6 + (day % 2), "●")),
    () => p("mixed", `找出四边形。`, `Find the quadrilateral.`, shapeSet(["●", "▲", "■", "★"])),
    () => p("mixed", `向右走一步。`, `Move one step right.`, mapPath()),
    () => p("mixed", `一样多吗？`, `Are the two sides equal?`, balance("🍎🍎🍎", "⭐ ⭐ ⭐")),
    () => p("mixed", `小鸡排第几？`, `What number is the chick in line?`, queue(7, 4)),
    () => p("mixed", `看十位个位。`, `Look at tens and ones.`, tensOnes(1, 5 + (day % 4)))
  ];
  const maxIndex = Math.min(pool.length, Math.max(3, week.n));
  return [pool[(week.n + day) % maxIndex](), pool[(week.n + day + 2) % maxIndex](), pool[(week.n + day + 4) % maxIndex]()];
}

function bonus(week, day) {
  const activities = [
    [`找 ${5 + day} 个小物品，排成一队，再换一种排法。`, `Find ${5 + day} small objects. Line them up, then make a new line.`],
    [`和家长玩“我藏了几个”的小侦探游戏。`, `Play a “how many did I hide?” detective game with an adult.`],
    [`用玩具摆出今天最喜欢的一题。`, `Use toys to build your favorite problem from today.`],
    [`画一个属于${week.themeZh}的小奖章。`, `Draw a tiny badge for ${week.themeEn}.`],
    [`给小伙伴讲一道题：先发生什么？后来呢？`, `Tell one problem to your buddy: what happened first, then next?`]
  ];
  const [zh, en] = activities[(week.n + day) % activities.length];
  return p("bonus", zh, en, `<div class="bonus-scene"><span>${week.icon}</span><span>✨</span><span>🧸</span></div>`);
}

function adultGuide(week, day) {
  const questions = [
    ["数量变多了还是变少了？", "Is the amount getting bigger or smaller?"],
    ["我们是在合起来、拿走，还是比较？", "Are we joining, taking away, or comparing?"],
    ["你先知道了什么？", "What do you know first?"],
    ["你能用手指或小物品摆出来吗？", "Can you show it with your fingers or objects?"],
    ["什么变了？什么没变？", "What changed? What stayed the same?"],
    ["这个图形/位置有什么线索？", "What clue do you see in the shape or position?"]
  ];
  const q = [questions[(week.n + day) % questions.length], questions[(week.n + day + 2) % questions.length], questions[(week.n + day + 4) % questions.length]];
  return {
    emphasizeZh: day <= 2 ? `先让孩子看图和指出关键变化，再写答案。` : day <= 4 ? `鼓励孩子说出“为什么”，不追求速度。` : `把本周新方法和以前会的数数、比较、画图连起来。`,
    emphasizeEn: day <= 2 ? `Let the child point to the picture and name the key change before writing.` : day <= 4 ? `Invite a short “why” without pushing speed.` : `Connect this week's idea to counting, comparing, and drawing.`,
    watchZh: week.n <= 3 ? `容易把“比较差多少”误当成“合起来”。` : week.n <= 6 ? `容易只看符号或表面图案，忘了检查规律。` : week.n <= 9 ? `容易混淆左右、形状名称或等号两边的关系。` : `容易漏掉自己、重叠部分或故事中的“原来/后来”。`,
    watchEn: week.n <= 3 ? `Watch for treating “how many more” as “total.”` : week.n <= 6 ? `Watch for guessing from the surface instead of checking the pattern.` : week.n <= 9 ? `Watch for left/right confusion, shape names, or equality as a relationship.` : `Watch for forgetting to count self, overlap, or before/after in a story.`,
    tipZh: `如果卡住，先遮住文字，只看图说故事；再回到题目找关键词。`,
    tipEn: `If stuck, cover the words, tell the picture story first, then return to the key words.`,
    questions: q
  };
}

function getDayData(week, day) {
  return {
    week,
    day,
    dayMeta: dayInfo[day - 1],
    tasks: [...warmups(week, day), ...coreProblems(week, day), ...mixedProblems(week, day)],
    bonus: bonus(week, day),
    guide: adultGuide(week, day)
  };
}

function pageHtml(week, day) {
  const file = `week-${pad(week.n)}-day-${pad(day)}.html`;
  const prev = day > 1 ? `week-${pad(week.n)}-day-${pad(day - 1)}.html` : week.n > 1 ? `week-${pad(week.n - 1)}-day-05.html` : "index.html";
  const next = day < 5 ? `week-${pad(week.n)}-day-${pad(day + 1)}.html` : week.n < 12 ? `week-${pad(week.n + 1)}-day-01.html` : "index.html";
  const { tasks, guide, dayMeta, bonus: bonusTask } = getDayData(week, day);
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(`Week ${week.n} Day ${day} - ${week.en}`)}</title>
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="print.css" media="print" />
  <script defer src="script.js"></script>
</head>
<body data-lang="zh" style="--week-color:${week.color};--week-accent:${week.accent}">
  <header class="site-bar no-print">
    <a class="home-link" href="index.html">${t("数学冒险地图", "Math Adventure Map")}</a>
    <button class="lang-toggle" type="button" data-lang-toggle>
      <span class="lang zh">English</span><span class="lang en">中文</span>
    </button>
  </header>
  <main class="worksheet">
    <section class="adventure-hero">
      <div class="hero-copy">
        <p class="eyebrow">${t(`第 ${week.n} 周 · ${week.themeZh}`, `Week ${week.n} · ${week.themeEn}`)}</p>
        <h1>${week.icon} ${t(dayMeta.zh, dayMeta.en)}</h1>
        <p>${t(week.zh, week.en)}</p>
        <p class="tiny-note">${t(dayMeta.rhythmZh, dayMeta.rhythmEn)}</p>
      </div>
      <aside class="avatar-card">
        <div class="avatar" aria-hidden="true"><span class="avatar-face">🐾</span><span class="avatar-item">${week.icon}</span></div>
        <strong>${t("今日完成奖励", "Today's Completion Reward")}</strong>
        <p>${t(`给小伙伴添上：${week.itemZh}`, `Add to your buddy: ${week.itemEn}`)}</p>
        <div class="stamp-box">${t("完成印章", "Completion Stamp")}</div>
      </aside>
    </section>

    <section class="parent-note top-note">
      <h2>${t("给家长 / 老师", "For Parent / Teacher")}</h2>
      <p>${t("这套12周练习把一年级数学做成每天一页的小冒险。每页先热身，再练本周重点，最后混合复习。请先让孩子看图、指一指、说一说，再写答案。打印前可用右上角切换语言；打印时会保留当前语言、答题空格和奖励框。", "This 12-week program turns Grade 1 math into a one-page daily adventure. Each page starts with warm-ups, practices the weekly focus, then reviews earlier ideas. Let the child look, point, and talk before writing. Use the top-right button to choose a language before printing; print keeps the current language, writing spaces, and reward box.")}</p>
    </section>

    <section class="task-section">
      <h2>${t("今天的8个小任务", "Today's 8 Little Tasks")}</h2>
      <div class="task-grid">
        ${tasks.map((task, i) => problemCard(task, i + 1)).join("\n        ")}
      </div>
    </section>

    <section class="bonus-card">
      <div class="bonus-label">${t("亲子加分彩蛋", "Parent-Child Wild Card")}</div>
      ${problemInner(bonusTask, false)}
      <div class="charm-box">${t("完成彩蛋贴纸", "Bonus Charm")}</div>
    </section>

    <section class="adult-support">
      <h2>${t("成人引导小站", "Adult Support Station")}</h2>
      <div class="support-grid">
        <div><h3>${t("重点帮什么", "What to Emphasize")}</h3><p>${t(guide.emphasizeZh, guide.emphasizeEn)}</p></div>
        <div><h3>${t("留意什么误会", "Misconception to Watch")}</h3><p>${t(guide.watchZh, guide.watchEn)}</p></div>
        <div><h3>${t("可以这样问", "Guiding Questions")}</h3><ul>${guide.questions.map(([zh, en]) => `<li>${t(zh, en)}</li>`).join("")}</ul></div>
        <div><h3>${t("今日小技巧", "Teaching Tip")}</h3><p>${t(guide.tipZh, guide.tipEn)}</p></div>
      </div>
    </section>

    <nav class="page-nav no-print">
      <a href="${prev}">${t("上一页", "Previous")}</a>
      <button type="button" onclick="window.print()">${t("打印这一页", "Print This Page")}</button>
      <a href="${next}">${t("下一页", "Next")}</a>
    </nav>
  </main>
</body>
</html>`;
}

function problemCard(task, num) {
  const sectionLabel = {
    warm: ["热身", "Warm-Up"],
    core: ["本周重点", "Main Idea"],
    mixed: ["复习", "Review"]
  }[task.section];
  return `<article class="problem-card">
    <div class="problem-top"><span class="problem-number">${num}</span><span class="problem-kind">${t(sectionLabel[0], sectionLabel[1])}</span></div>
    ${problemInner(task, true)}
  </article>`;
}

function problemInner(task, includeLine) {
  return `<p class="prompt">${t(task.zh, task.en)}</p>
    <div class="visual">${task.visual}</div>
    ${includeLine ? line() : line("记录", "Record")}`;
}

function indexHtml() {
  const weekLinks = weeks.map(w => `<article class="week-tile" style="--week-color:${w.color};--week-accent:${w.accent}">
    <span class="week-icon">${w.icon}</span>
    <strong>${t(`第 ${w.n} 周`, `Week ${w.n}`)}</strong>
    <span>${t(w.zh, w.en)}</span>
    <small>${t(w.themeZh, w.themeEn)}</small>
    <div class="week-actions">
      <a href="week-${pad(w.n)}-day-01.html">${t("开始本周", "Start Week")}</a>
      <a href="week-${pad(w.n)}-challenge.html">${t("每周挑战", "Weekly Challenge")}</a>
      <a href="week-${pad(w.n)}-print.html">${t("打印本周", "Print This Week")}</a>
    </div>
  </article>`).join("\n      ");
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Grade 1 Math Adventure / 一年级数学冒险</title>
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="print.css" media="print" />
  <script defer src="script.js"></script>
</head>
<body data-lang="zh">
  <header class="site-bar no-print">
    <a class="home-link" href="index.html">${t("数学冒险地图", "Math Adventure Map")}</a>
    <button class="lang-toggle" type="button" data-lang-toggle><span class="lang zh">English</span><span class="lang en">中文</span></button>
  </header>
  <main class="home">
    <section class="home-hero">
      <div>
        <p class="eyebrow">${t("12周 · 每周5页 · 可打印", "12 Weeks · 5 Pages Each · Printable")}</p>
        <h1>${t("一年级数学小冒险", "Grade 1 Math Adventure")}</h1>
        <p>${t("每天一页，像进入一个小小故事世界。孩子看图、圈画、写答案；大人用问题陪她想清楚。", "One page a day, like stepping into a tiny story world. The child looks, circles, draws, and writes; the adult guides with questions.")}</p>
      </div>
      <div class="home-mascot"><span>🐾</span><b>+</b><span>🎒</span></div>
    </section>
    <section class="print-actions">
      <div>
        <h2>${t("打印学习包", "Print Packets")}</h2>
        <p>${t("想一次打印更多页面？这里会打开专门的打印版，不会直接打印首页。每一天会排成2页：第1页是第1–4题，第2页是第5–8题和亲子彩蛋。", "Need to print more at once? These open dedicated print-first pages instead of printing the home page. Each day becomes 2 pages: Page 1 has Questions 1-4, Page 2 has Questions 5-8 plus the parent-child wild card.")}</p>
      </div>
      <div class="print-action-buttons">
        <a href="week-01-print.html">${t("打印本周", "Print This Week")}</a>
        <a href="full-program-print.html">${t("打印完整12周", "Print Full Program")}</a>
      </div>
    </section>
    <section class="parent-note">
      <h2>${t("项目说明", "Program Note")}</h2>
      <p>${t("目的：用清楚、温暖、可打印的网页，帮助刚开始阅读的一年级孩子建立数感、应用题理解、规律、几何、空间和推理能力。", "Purpose: clear, warm, printable pages for an early reader to build number sense, story-problem understanding, patterns, geometry, spatial thinking, and reasoning.")}</p>
      <p>${t("结构：每周5天。周初强支架，周中变式练习，周末复习整合。每页有2题热身、3题本周重点、3题混合复习和1个亲子彩蛋。", "Structure: 5 days per week. Early week gives strong scaffolding, midweek varies the practice, and week-end reviews and integrates. Each page has 2 warm-ups, 3 main-focus tasks, 3 mixed review tasks, and 1 parent-child wild card.")}</p>
      <p>${t("打印：打开任意页面，先切换到想用的语言，再点“打印这一页”。页面包含清晰答题线、奖励框和成人引导区，并尽量避免题块跨页断开。", "Printing: open any page, choose the language, then select “Print This Page.” Pages include writing lines, reward boxes, and adult guidance, with problem blocks kept together when possible.")}</p>
      <p>${t("成人提示：不要急着讲答案。优先问“变多还是变少？”“先知道什么？”“能摆出来吗？”让孩子用手指、小物品或图来解释。", "Adult prompts: do not rush to tell the answer. Ask “bigger or smaller?” “what do we know first?” “can you build it?” and let the child explain with fingers, objects, or pictures.")}</p>
      <p>${t("奖励：完成一页就给小伙伴添一件小物品；完成一周得到主题配饰；完成彩蛋可画一个特别贴纸。奖励看重参与、坚持和勇敢尝试，不只看全对。", "Rewards: completing a page adds a small item to the buddy; completing a week earns a themed accessory; completing the wild card earns a special sticker. Rewards celebrate effort, consistency, and brave tries, not only perfect accuracy.")}</p>
    </section>
    <section class="week-map">
      <h2>${t("选择一周开始", "Choose a Week")}</h2>
      <div class="week-grid">
      ${weekLinks}
      </div>
    </section>
  </main>
</body>
</html>`;
}

function compiledShell({ title, body, color = "#287c71", accent = "#f4c64d", introZh, introEn }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="print.css" media="print" />
  <script defer src="script.js"></script>
</head>
<body data-lang="zh" class="compiled-body" style="--week-color:${color};--week-accent:${accent}">
  <header class="site-bar no-print">
    <a class="home-link" href="index.html">${t("数学冒险地图", "Math Adventure Map")}</a>
    <div class="compiled-tools">
      <button class="lang-toggle" type="button" data-lang-toggle><span class="lang zh">English</span><span class="lang en">中文</span></button>
      <button class="lang-toggle" type="button" onclick="window.print()">${t("打印学习包", "Print Packet")}</button>
    </div>
  </header>
  <main class="compiled-print">
    <section class="compiled-cover no-print">
      <p class="eyebrow">${t("专用打印版", "Dedicated Print Layout")}</p>
      <h1>${t(introZh, introEn)}</h1>
      <p>${t("打印时会自动按每天2页分页：第1页为第1–4题，第2页为第5–8题和亲子彩蛋。每页都保留成人引导提示。", "Printing automatically paginates each day into 2 pages: Page 1 for Questions 1-4, Page 2 for Questions 5-8 plus the parent-child wild card. Adult guidance is kept on every page.")}</p>
      <button type="button" onclick="window.print()">${t("现在打印", "Print Now")}</button>
    </section>
    ${body}
  </main>
</body>
</html>`;
}

function sectionName(section) {
  return {
    warm: ["热身", "Warm-Up"],
    core: ["本周重点", "Main Idea"],
    mixed: ["复习", "Review"]
  }[section];
}

function compiledProblem(task, num) {
  const label = sectionName(task.section);
  return `<article class="compiled-problem">
    <div class="compiled-problem-top">
      <span class="compiled-number">${num}</span>
      <span class="compiled-kind">${t(label[0], label[1])}</span>
    </div>
    <p class="compiled-prompt">${t(task.zh, task.en)}</p>
    <div class="compiled-visual">${task.visual}</div>
    <div class="compiled-answer"><span>${t("写一写 / 画一画", "Write / Draw")}</span></div>
  </article>`;
}

function compiledGuide(guide) {
  return `<aside class="compiled-guide">
    <div><strong>${t("重点", "Emphasize")}</strong><p>${t(guide.emphasizeZh, guide.emphasizeEn)}</p></div>
    <div><strong>${t("留意", "Watch")}</strong><p>${t(guide.watchZh, guide.watchEn)}</p></div>
    <div><strong>${t("提问", "Ask")}</strong><ul>${guide.questions.map(([zh, en]) => `<li>${t(zh, en)}</li>`).join("")}</ul></div>
  </aside>`;
}

function compiledDayPages(week, day) {
  const data = getDayData(week, day);
  return [0, 1].map(pageIndex => {
    const start = pageIndex * 4;
    const tasks = data.tasks.slice(start, start + 4);
    const isSecondPage = pageIndex === 1;
    return `<section class="compiled-page" style="--week-color:${week.color};--week-accent:${week.accent}">
      <header class="compiled-page-head">
        <div>
          <p>${t(`第 ${week.n} 周 · 第 ${day} 天`, `Week ${week.n} · Day ${day}`)}</p>
          <h2>${week.icon} ${t(`${week.zh} · ${data.dayMeta.zh}`, `${week.en} · ${data.dayMeta.en}`)}</h2>
        </div>
        <div class="compiled-page-mark">${t(`第${day}天 · 第${pageIndex + 1}/2页`, `Day ${day} · Page ${pageIndex + 1} of 2`)}</div>
      </header>
      <div class="compiled-problem-grid">
        ${tasks.map((task, i) => compiledProblem(task, start + i + 1)).join("\n        ")}
      </div>
      ${isSecondPage ? `<section class="compiled-bonus"><strong>${t("可选亲子彩蛋", "Optional Wild Card")}</strong><p>${t(data.bonus.zh, data.bonus.en)}</p><div>${data.bonus.visual}</div></section>` : ""}
      ${compiledGuide(data.guide)}
    </section>`;
  }).join("\n");
}

function weekPrintHtml(week) {
  const body = Array.from({ length: dayCount }, (_, i) => compiledDayPages(week, i + 1)).join("\n");
  return compiledShell({
    title: `Week ${week.n} Print Packet - ${week.en}`,
    body,
    color: week.color,
    accent: week.accent,
    introZh: `第 ${week.n} 周打印学习包`,
    introEn: `Week ${week.n} Print Packet`
  });
}

function fullProgramPrintHtml() {
  const body = weeks.map(week => `<section class="compiled-week-divider" style="--week-color:${week.color};--week-accent:${week.accent}">
      <span>${week.icon}</span>
      <h2>${t(`第 ${week.n} 周：${week.zh}`, `Week ${week.n}: ${week.en}`)}</h2>
      <p>${t(week.focusZh, week.focusEn)}</p>
    </section>
    ${Array.from({ length: dayCount }, (_, i) => compiledDayPages(week, i + 1)).join("\n")}`).join("\n");
  return compiledShell({
    title: "Full Program Print Packet - Grade 1 Math Adventure",
    body,
    introZh: "完整12周打印学习包",
    introEn: "Full 12-Week Print Packet"
  });
}

function cq(conceptZh, conceptEn, zh, en, visual, answers) {
  return { conceptZh, conceptEn, zh, en, visual, answers: answers.map(String) };
}

function challengeQuestions(week) {
  const n = week.n;
  const review = [
    cq("累计复习", "Cumulative Review", "数一数。", "Count.", dots(7, "⭐"), [7]),
    cq("累计复习", "Cumulative Review", "3 + 4 = ?", "3 + 4 = ?", groups(3, 4, "🍎", "🍎"), [7])
  ];
  if (n === 1) return [
    cq("数数", "Counting", "有几颗星？", "How many stars?", dots(5, "⭐"), [5]),
    cq("数字配数量", "Numeral to Amount", "圈出 8。", "Circle 8.", numberPath([6, 8, 9, 7]), [8]),
    cq("比较", "Compare", "哪边更多？写 A 或 B。", "Which has more? Write A or B.", compareBars(6, 4, ["A", "B"]), ["A"]),
    cq("缺数", "Missing Number", "少了哪个数？", "What number is missing?", numberPath([3, 4, null, 6]), [5]),
    cq("数序", "Number Order", "10 前面是几？", "What comes before 10?", numberPath([8, 9, 10]), [9]),
    cq("比较", "Compare", "哪边更少？写 A 或 B。", "Which has fewer? Write A or B.", compareBars(7, 9, ["A", "B"]), ["A"]),
    cq("数量", "Quantity", "写出数量。", "Write the amount.", tenFrame(6), [6]),
    cq("数序", "Number Order", "从 4 数到 8，空格是？", "Count 4 to 8. What is blank?", numberPath([4, 5, null, 7, 8]), [6]),
    cq("比较", "Compare", "8 和 5，哪个大？", "8 and 5. Which is bigger?", equation([8, "?", 5]), [8]),
    cq("数量配对", "Match Amount", "这是一组几？", "How many in this group?", dots(10, "●"), [10]),
    ...review
  ];
  if (n === 2) return [
    cq("合起来", "Join", "一共有几个？", "How many in all?", groups(3, 2, "🧁", "🧁"), [5]),
    cq("拿走", "Take Away", "还剩几个？", "How many left?", dots(8, "🍪", 5), [5]),
    cq("合起来", "Join", "4 + 5 = ?", "4 + 5 = ?", groups(4, 5, "🐾", "🐾"), [9]),
    cq("拿走", "Take Away", "9 - 4 = ?", "9 - 4 = ?", dots(9, "🍩", 5), [5]),
    cq("比较", "Compare", "A 比 B 多几？", "How many more is A than B?", compareBars(7, 4, ["A", "B"]), [3]),
    cq("故事", "Story", "小猫有6个，又来2个。现在？", "Cat has 6. 2 more come. Now?", groups(6, 2, "🐱", "🐱"), [8]),
    cq("故事", "Story", "有7个，吃掉1个。还剩？", "7, eat 1. Left?", dots(7, "🍪", 6), [6]),
    cq("选择", "Choose", "变多用 + 还是 -？", "Bigger amount: + or -?", equation(["变多", "?", "+ / -"]), ["+", "加"]),
    cq("比较", "Compare", "哪边少？写 A 或 B。", "Which has fewer? Write A or B.", compareBars(5, 8, ["A", "B"]), ["A"]),
    cq("合起来", "Join", "2 + 6 = ?", "2 + 6 = ?", groups(2, 6, "⭐", "⭐"), [8]),
    ...review
  ];
  if (n === 3) return [
    cq("20以内加法", "Add Within 20", "12 + 4 = ?", "12 + 4 = ?", groups(12, 4, "🌼", "🌼"), [16]),
    cq("20以内减法", "Subtract Within 20", "15 - 5 = ?", "15 - 5 = ?", dots(15, "⭐", 10), [10]),
    cq("比较", "Compare", "14 比 9 多几？", "How many more is 14 than 9?", compareBars(14, 9, ["A", "B"]), [5]),
    cq("故事", "Story", "有11朵，又开3朵。现在？", "11 flowers, 3 more bloom. Now?", groups(11, 3, "🌼", "🌼"), [14]),
    cq("故事", "Story", "18颗星，藏6颗。看见？", "18 stars, 6 hide. Seen?", dots(18, "⭐", 12), [12]),
    cq("比较", "Compare", "哪边多？写 A 或 B。", "Which has more? Write A or B.", compareBars(13, 16, ["A", "B"]), ["B"]),
    cq("缺数", "Missing Number", "10 + □ = 16。", "10 + □ = 16.", equation([10, "+", "□", "=", 16]), [6]),
    cq("减法", "Subtraction", "17 - 4 = ?", "17 - 4 = ?", equation([17, "-", 4, "="]), [13]),
    cq("比较", "Compare", "16 和 12 差几？", "What is the difference between 16 and 12?", compareBars(16, 12, ["A", "B"]), [4]),
    cq("故事", "Story", "9本书，又得5本。现在？", "9 books, get 5 more. Now?", groups(9, 5, "📚", "📚"), [14]),
    ...review
  ];
  if (n === 4) return [
    cq("数阵", "Number Grid", "缺哪个数？", "Which number is missing?", grid([6, 7, null, 9, 10]), [8]),
    cq("规律", "Pattern", "下一个是？写 星 或 车。", "What comes next? Write star or train.", pattern(["🚂", "⭐", "🚂", "⭐", "🚂"]), ["星", "star", "⭐"]),
    cq("数列", "Number Pattern", "每次多2，空格是？", "Add 2 each time. Blank?", numberPath([2, 4, 6, null, 10]), [8]),
    cq("数列", "Number Pattern", "每次少1，空格是？", "Subtract 1 each time. Blank?", numberPath([9, 8, null, 6]), [7]),
    cq("数阵", "Number Grid", "中间少了几？", "What is missing?", grid([11, 12, 13, null, 15]), [14]),
    cq("规律", "Pattern", "下一个形状？写 圆 或 三角。", "Next shape? Write circle or triangle.", pattern(["●", "▲", "●", "▲", "●"]), ["三角", "triangle", "▲"]),
    cq("顺序", "Order", "13 后面是几？", "What comes after 13?", numberPath([12, 13, null]), [14]),
    cq("数列", "Pattern", "5, 10, 15, ?", "5, 10, 15, ?", numberPath([5, 10, 15, null]), [20]),
    cq("规律", "Pattern", "ABAB 下一个？", "ABAB. What comes next?", pattern(["A", "B", "A", "B"]), ["A"]),
    cq("数阵", "Grid", "这一行从几开始？", "What number starts this row?", grid([null, 22, 23, 24, 25]), [21]),
    ...review
  ];
  if (n === 5) return [
    cq("缺数", "Missing Number", "□ + 3 = 8。", "□ + 3 = 8.", equation(["□", "+", 3, "=", 8]), [5]),
    cq("算符", "Operation Sign", "7 ○ 2 = 9。写 + 或 -。", "7 ○ 2 = 9. Write + or -.", equation([7, "○", 2, "=", 9]), ["+", "加"]),
    cq("算符", "Operation Sign", "8 ○ 3 = 5。写 + 或 -。", "8 ○ 3 = 5. Write + or -.", equation([8, "○", 3, "=", 5]), ["-", "减"]),
    cq("竖式谜", "Vertical Puzzle", "缺了几？", "What is missing?", `<div class="vertical-math"><span>4</span><span>+ □</span><strong>9</strong></div>`, [5]),
    cq("等式", "Equation", "6 + □ = 10。", "6 + □ = 10.", equation([6, "+", "□", "=", 10]), [4]),
    cq("等式", "Equation", "□ - 2 = 5。", "□ - 2 = 5.", equation(["□", "-", 2, "=", 5]), [7]),
    cq("真假", "True/False", "5 + 2 = 8？写 对 或 错。", "5 + 2 = 8? Write yes or no.", equation([5, "+", 2, "=", 8]), ["错", "no", "n"]),
    cq("算符", "Sign", "10 ○ 4 = 6。", "10 ○ 4 = 6.", equation([10, "○", 4, "=", 6]), ["-", "减"]),
    cq("缺数", "Missing Number", "3 + □ = 7。", "3 + □ = 7.", equation([3, "+", "□", "=", 7]), [4]),
    cq("竖式", "Vertical", "2 + □ = 8。", "2 + □ = 8.", `<div class="vertical-math"><span>2</span><span>+ □</span><strong>8</strong></div>`, [6]),
    ...review
  ];
  if (n === 6) return [
    cq("奇偶", "Odd/Even", "能两两配对吗？写 偶 或 奇。", "Can all pair up? Write even or odd.", dots(6, "🥤"), ["偶", "even"]),
    cq("奇偶", "Odd/Even", "有一个剩下吗？写 奇 或 偶。", "One left? Write odd or even.", dots(7, "🍪"), ["奇", "odd"]),
    cq("判断", "Identify", "8 是奇数还是偶数？", "Is 8 odd or even?", tenFrame(8), ["偶", "even"]),
    cq("判断", "Identify", "9 是奇数还是偶数？", "Is 9 odd or even?", dots(9, "●"), ["奇", "odd"]),
    cq("配对", "Pairing", "10 个能平均给2只熊吗？", "Can 10 share equally with 2 bears?", dots(10, "🍪"), ["能", "yes", "y"]),
    cq("配对", "Pairing", "5 个能两两配对吗？", "Can 5 make pairs?", dots(5, "●"), ["不能", "no", "n"]),
    cq("找数", "Find Number", "圈出偶数。写一个。", "Circle an even number. Write one.", numberPath([3, 4, 5, 7]), [4]),
    cq("找数", "Find Number", "圈出奇数。写一个。", "Circle an odd number. Write one.", numberPath([2, 6, 9, 10]), [9]),
    cq("规律", "Pattern", "偶数后面下一个偶数？", "Next even number?", numberPath([2, 4, 6, null]), [8]),
    cq("配对", "Pairing", "11 两两配对，剩几个？", "Pair 11. How many left?", dots(11, "⭐"), [1]),
    ...review
  ];
  if (n === 7) return [
    cq("形状", "Shapes", "3个角的图形？", "Shape with 3 corners?", shapeSet(["●", "▲", "■"]), ["三角", "triangle", "▲"]),
    cq("形状", "Shapes", "4条边的图形？", "Shape with 4 sides?", shapeSet(["●", "■", "▲"]), ["方形", "正方形", "square", "■"]),
    cq("立体", "3D Shape", "哪个像球？写 A/B/C。", "Which is like a sphere? A/B/C.", shapeSet(["🥫", "🎲", "⚽"]), ["C"]),
    cq("角", "Corners", "这个图形有几个角？", "How many corners?", shapeSet(["⬟"]), [5]),
    cq("边", "Sides", "三角形有几条边？", "How many sides in a triangle?", shapeSet(["▲"]), [3]),
    cq("物体匹配", "Object Match", "罐头像什么？写 圆柱。", "A can is like what? Write cylinder.", shapeSet(["🥫"]), ["圆柱", "cylinder"]),
    cq("识别", "Identify", "圈出圆形。写 圆。", "Circle the circle. Write circle.", shapeSet(["●", "▲", "■"]), ["圆", "circle", "●"]),
    cq("识别", "Identify", "门像什么形？", "A door is like what shape?", shapeSet(["🚪", "▭"]), ["长方形", "rectangle"]),
    cq("角", "Corners", "圆有角吗？写 有 或 没有。", "Does a circle have corners? yes or no.", shapeSet(["●"]), ["没有", "no", "n"]),
    cq("分类", "Sort", "哪个不是平面图形？写球。", "Which is not flat? Write ball.", shapeSet(["●", "▲", "⚽"]), ["球", "ball", "⚽"]),
    ...review
  ];
  if (n === 8) return [
    cq("方向", "Direction", "从房子向右到哪里？", "Go right from the house. Where?", mapPath(), ["树", "tree", "🌳"]),
    cq("左右", "Left/Right", "猫左边是什么？", "What is left of the cat?", `<div class="position-row"><span>🍎</span><span class="center">🐱</span><span>🧁</span></div>`, ["苹果", "apple", "🍎"]),
    cq("上下", "Up/Down", "星星在房子的上面还是下面？", "Is the star above or below the house?", `<div class="map-grid"><span></span><span>⭐</span><span></span><span></span><span>🏠</span><span></span></div>`, ["上", "上面", "above", "up"]),
    cq("路线", "Path", "向右，再向下，终点？", "Right, then down. Finish?", mapPath(), ["终点", "finish", "🏁"]),
    cq("观察", "View", "从正面看像哪个？写 A/B/C。", "Front view. A/B/C?", shapeSet(["🏠", "⬜", "🔺"]), ["A"]),
    cq("前后", "Front/Back", "排队第1个在前还是后？", "Number 1 is front or back?", queue(5, 1), ["前", "front"]),
    cq("方向", "Direction", "箭头 ↑ 是向哪？", "Arrow ↑ points where?", equation(["↑"]), ["上", "up"]),
    cq("方向", "Direction", "箭头 ← 是向哪？", "Arrow ← points where?", equation(["←"]), ["左", "left"]),
    cq("位置", "Position", "蛋糕在猫右边吗？写 是/不是。", "Is cake right of cat? yes/no.", `<div class="position-row"><span>🍎</span><span class="center">🐱</span><span>🧁</span></div>`, ["是", "yes", "y"]),
    cq("观察", "View", "从上面看杯子像什么？", "From above, a cup looks like what?", shapeSet(["🥤", "○"]), ["圆", "circle", "○"]),
    ...review
  ];
  if (n === 9) return [
    cq("等量代换", "Substitution", "1苹果=2星。2苹果=几星？", "1 apple=2 stars. 2 apples=?", balance("🍎", "⭐ ⭐"), [4]),
    cq("等量", "Equal Amount", "两边一样多吗？", "Are both sides equal?", balance("● ● ●", "● ● ●"), ["是", "yes", "y"]),
    cq("代换", "Substitution", "◆=5，◆+2=?", "◆=5, ◆+2=?", equation(["◆", "=", 5, "◆+2=?"]), [7]),
    cq("天平", "Balance", "熊=3块。2熊=几块？", "Bear=3 blocks. 2 bears=?", balance("🐻", "■ ■ ■"), [6]),
    cq("等量", "Equal", "哪边重？写 A/B/一样。", "Which is heavier? A/B/same.", compareBars(5, 5, ["A", "B"]), ["一样", "same"]),
    cq("代换", "Substitution", "●=4，●-1=?", "●=4, ●-1=?", equation(["●", "=", 4, "●-1=?"]), [3]),
    cq("等号", "Equals", "等号表示一样多吗？", "Does equals mean same amount?", equation([3, "+", 2, "=", 5]), ["是", "yes", "y"]),
    cq("代换", "Substitution", "1杯=2饼。3杯=几饼？", "1 cup=2 cookies. 3 cups=?", balance("🥤", "🍪 🍪"), [6]),
    cq("等量", "Equal", "4 和 2+2 一样吗？", "Are 4 and 2+2 equal?", equation([4, "=", 2, "+", 2]), ["是", "yes", "y"]),
    cq("代换", "Substitution", "★=6，★+1=?", "★=6, ★+1=?", equation(["★", "=", 6, "★+1=?"]), [7]),
    ...review
  ];
  if (n === 10) return [
    cq("排队", "Line-Up", "小鸭排第几？", "What number is duck?", queue(7, 4), [4]),
    cq("排队", "Line-Up", "前2人，后3人，一共？", "2 in front, 3 behind. Total?", queue(6, 3), [6]),
    cq("重叠", "Overlap", "红6蓝5，共同2，总共？", "Red 6, blue 5, both 2. Total?", `<div class="overlap"><span>红 6</span><b>共同 2</b><span>蓝 5</span></div>`, [9]),
    cq("排队", "Line-Up", "第1个前面有几人？", "How many in front of number 1?", queue(5, 1), [0]),
    cq("排队", "Line-Up", "第5个前面有几人？", "How many in front of number 5?", queue(7, 5), [4]),
    cq("位置", "Position", "从左数第3个是谁？写小鸭。", "3rd from left. Write duck.", queue(6, 3), ["小鸭", "duck", "🐥"]),
    cq("重叠", "Overlap", "A有4，B有4，共同1，总共？", "A has 4, B has 4, both 1. Total?", `<div class="overlap"><span>A 4</span><b>共同 1</b><span>B 4</span></div>`, [7]),
    cq("排队", "Line-Up", "前3后2，一共？", "3 in front, 2 behind. Total?", queue(6, 4), [6]),
    cq("顺序", "Order", "第2后面是第几？", "After 2nd is what number?", numberPath([1, 2, null]), [3]),
    cq("重叠", "Overlap", "总数会加共同部分两次吗？", "Do we count overlap twice?", `<div class="overlap"><span>A</span><b>共同</b><span>B</span></div>`, ["不", "不会", "no", "n"]),
    ...review
  ];
  if (n === 11) return [
    cq("十位个位", "Tens and Ones", "这个数是多少？", "What number is this?", tensOnes(1, 5), [15]),
    cq("进位", "Regrouping", "18 + 3 = ?", "18 + 3 = ?", equation([18, "+", 3, "="]), [21]),
    cq("退位", "Regrouping", "22 - 5 = ?", "22 - 5 = ?", equation([22, "-", 5, "="]), [17]),
    cq("还原", "Restore", "? - 3 = 12。", "? - 3 = 12.", equation(["?", "-", 3, "=", 12]), [15]),
    cq("十位个位", "Place Value", "2个十和4个一。", "2 tens and 4 ones.", tensOnes(2, 4), [24]),
    cq("进位", "Make Ten", "9 + 4 = ?", "9 + 4 = ?", groups(9, 4, "●", "●"), [13]),
    cq("退位", "Subtract", "14 - 6 = ?", "14 - 6 = ?", equation([14, "-", 6, "="]), [8]),
    cq("还原", "Restore", "后来有10，又来5，原来？", "Now 10, 5 came. Before?", equation(["?", "+", 5, "=", 10]), [5]),
    cq("十位", "Tens", "30 里有几个十？", "How many tens in 30?", equation([30]), [3]),
    cq("个位", "Ones", "27 的个位是几？", "Ones digit in 27?", equation([27]), [7]),
    ...review
  ];
  return [
    cq("逻辑", "Logic", "A>B>C，谁最多？", "A>B>C. Who has most?", equation(["A", ">", "B", ">", "C"]), ["A"]),
    cq("图形规律", "Shape Pattern", "下一个是什么？", "What comes next?", pattern(["●", "▲", "▲", "●", "▲", "▲"]), ["圆", "circle", "●"]),
    cq("逻辑", "Logic", "B=3，A比B多。A可能是2吗？", "B=3, A is more. Can A be 2?", equation(["A", ">", "B", "B=3"]), ["不能", "no", "n"]),
    cq("综合", "Mixed", "8 + 5 = ?", "8 + 5 = ?", groups(8, 5, "⭐", "⭐"), [13]),
    cq("综合", "Mixed", "16 - 7 = ?", "16 - 7 = ?", equation([16, "-", 7, "="]), [9]),
    cq("图形", "Shapes", "4条边的图形？", "Shape with 4 sides?", shapeSet(["●", "▲", "■"]), ["方形", "正方形", "square", "■"]),
    cq("方向", "Direction", "← 是向哪？", "← points where?", equation(["←"]), ["左", "left"]),
    cq("等量", "Equal", "◆=4，◆+3=?", "◆=4, ◆+3=?", equation(["◆", "=", 4, "◆+3=?"]), [7]),
    cq("排队", "Line-Up", "小鸭排第几？", "What number is duck?", queue(6, 5), [5]),
    cq("奇偶", "Odd/Even", "9 是奇还是偶？", "Is 9 odd or even?", dots(9, "●"), ["奇", "odd"]),
    cq("规律", "Pattern", "2,4,6,?", "2,4,6,?", numberPath([2, 4, 6, null]), [8]),
    cq("数感", "Number Sense", "哪个大？12 或 15。", "Which is bigger? 12 or 15.", equation([12, "?", 15]), [15])
  ];
}

function challengeHtml(week) {
  const data = {
    week: week.n,
    titleZh: `第 ${week.n} 周每周挑战`,
    titleEn: `Week ${week.n} Weekly Challenge`,
    topicZh: week.zh,
    topicEn: week.en,
    themeZh: week.themeZh,
    themeEn: week.themeEn,
    icon: week.icon,
    rewardZh: week.itemZh,
    rewardEn: week.itemEn,
    threshold: 9,
    conceptsZh: week.focusZh,
    conceptsEn: week.focusEn,
    questions: challengeQuestions(week)
  };
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(`Week ${week.n} Weekly Challenge - ${week.en}`)}</title>
  <link rel="stylesheet" href="styles.css" />
  <script defer src="script.js"></script>
</head>
<body data-lang="zh" class="challenge-body" style="--week-color:${week.color};--week-accent:${week.accent}">
  <header class="site-bar no-print">
    <a class="home-link" href="index.html">${t("数学冒险地图", "Math Adventure Map")}</a>
    <button class="lang-toggle" type="button" data-lang-toggle><span class="lang zh">English</span><span class="lang en">中文</span></button>
  </header>
  <main class="challenge-shell" id="challengeApp">
    <section class="challenge-start" data-challenge-start>
      <p class="eyebrow">${week.icon} ${t(week.themeZh, week.themeEn)}</p>
      <h1>${t(data.titleZh, data.titleEn)}</h1>
      <p>${t("一次一个小题，慢慢来。计时器只是帮你知道用了多久，不会扣掉勇气分。", "One little question at a time. The timer only helps you see your pace. It does not take away bravery points.")}</p>
      <div class="challenge-start-grid">
        <div><strong>${t("检查内容", "Concepts")}</strong><p>${t(week.focusZh, week.focusEn)}</p></div>
        <div><strong>${t("题目数量", "Questions")}</strong><p>12</p></div>
        <div><strong>${t("红星目标", "Red Star Goal")}</strong><p>${t("答对9题或更多", "9 or more correct")}</p></div>
      </div>
      <button class="challenge-primary" type="button" data-start-challenge>${t("开始挑战", "Start Challenge")}</button>
    </section>
    <section class="challenge-card is-hidden" data-challenge-card>
      <div class="challenge-status">
        <span data-progress>${t("第 1 / 12 题", "Question 1 of 12")}</span>
        <span data-timer>00:00</span>
      </div>
      <div class="challenge-meter"><span data-meter></span></div>
      <div class="challenge-kind" data-kind></div>
      <p class="challenge-prompt" data-prompt></p>
      <div class="challenge-visual" data-visual></div>
      <form class="challenge-answer" data-answer-form>
        <label>${t("我的答案", "My Answer")}<input type="text" autocomplete="off" inputmode="text" data-answer-input /></label>
        <button class="challenge-primary" type="submit">${t("下一题", "Next")}</button>
      </form>
      <p class="challenge-soft">${t("想一想、指一指、再回答。", "Think, point, then answer.")}</p>
    </section>
    <section class="challenge-results is-hidden" data-results></section>
    <section class="reward-game is-hidden" data-game>
      <div class="game-head">
        <h2>${t("星星方块奖励游戏", "Star Blocks Reward Game")}</h2>
        <p>${t("每次60秒，最多玩2次。", "60 seconds each, up to 2 plays.")}</p>
      </div>
      <canvas width="200" height="320" data-game-canvas></canvas>
      <div class="game-controls">
        <button type="button" data-game-start>${t("开始游戏", "Start Game")}</button>
        <span data-game-info></span>
      </div>
      <p class="game-tip">${t("键盘：← → 移动，↑ 旋转，↓ 加速。", "Keyboard: ← → move, ↑ rotate, ↓ faster.")}</p>
    </section>
  </main>
  <script type="application/json" id="challengeData">${JSON.stringify(data)}</script>
</body>
</html>`;
}

const styles = `:root {
  --paper: #fffefa;
  --ink: #243642;
  --muted: #65727d;
  --line: #93a4b3;
  --soft: #f6fbf7;
  --card: #ffffff;
  --week-color: #2f8f83;
  --week-accent: #f4c64d;
  --shadow: 0 14px 35px rgba(36, 54, 66, .12);
}
* { box-sizing: border-box; }
html { background: #f3f7f4; }
body {
  margin: 0;
  color: var(--ink);
  font-family: "PingFang SC", "Microsoft YaHei", "Segoe UI", Arial, sans-serif;
  line-height: 1.5;
  background:
    radial-gradient(circle at 12% 8%, rgba(255,255,255,.95) 0 5%, transparent 6%),
    radial-gradient(circle at 88% 12%, rgba(255,255,255,.8) 0 4%, transparent 5%),
    linear-gradient(160deg, #eef8f0, #fff8e7 48%, #eaf7ff);
  min-height: 100vh;
}
body[data-lang="zh"] .lang.en, body[data-lang="en"] .lang.zh { display: none; }
a { color: inherit; text-decoration: none; }
.site-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(255,255,255,.88);
  border-bottom: 2px solid rgba(36,54,66,.08);
  backdrop-filter: blur(8px);
}
.home-link, .lang-toggle, .page-nav a, .page-nav button {
  min-height: 44px;
  border-radius: 8px;
  border: 2px solid var(--ink);
  background: white;
  padding: 10px 14px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}
.home, .worksheet { width: min(1120px, calc(100% - 28px)); margin: 0 auto; padding: 24px 0 48px; }
.home-hero, .adventure-hero {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 18px;
  align-items: stretch;
  background: linear-gradient(135deg, color-mix(in srgb, var(--week-color) 18%, white), color-mix(in srgb, var(--week-accent) 34%, white));
  border: 3px solid rgba(36,54,66,.12);
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--shadow);
  overflow: hidden;
}
.home-hero { --week-color: #287c71; --week-accent: #f4c64d; }
.eyebrow { margin: 0 0 8px; font-weight: 900; letter-spacing: 0; color: color-mix(in srgb, var(--week-color) 85%, black); }
h1 { margin: 0; font-size: 54px; line-height: 1.03; letter-spacing: 0; }
h2 { margin: 0 0 14px; font-size: 32px; }
h3 { margin: 0 0 8px; font-size: 18px; }
.home-hero p, .adventure-hero p, .parent-note p { font-size: 18px; max-width: 820px; }
.tiny-note { color: var(--muted); font-weight: 800; }
.home-mascot, .avatar-card {
  background: rgba(255,255,255,.82);
  border: 2px solid rgba(36,54,66,.12);
  border-radius: 8px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 18px;
}
.home-mascot { font-size: 58px; grid-auto-flow: column; }
.avatar { position: relative; width: 128px; height: 128px; display: grid; place-items: center; background: #fff; border: 3px solid var(--week-color); border-radius: 50%; margin-bottom: 8px; }
.avatar-face { font-size: 58px; }
.avatar-item { position: absolute; right: 8px; top: 6px; font-size: 34px; }
.stamp-box, .charm-box {
  width: 100%;
  min-height: 58px;
  display: grid;
  place-items: center;
  margin-top: 10px;
  border: 3px dashed var(--week-color);
  border-radius: 8px;
  background: white;
  font-weight: 900;
}
.parent-note, .task-section, .adult-support, .bonus-card, .week-map {
  margin-top: 18px;
  background: rgba(255,255,255,.9);
  border: 2px solid rgba(36,54,66,.11);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 8px 22px rgba(36,54,66,.07);
}
.top-note { border-left: 10px solid var(--week-color); }
.week-grid, .task-grid, .support-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.week-grid { grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
.week-tile {
  min-height: 166px;
  padding: 16px;
  border-radius: 8px;
  border: 3px solid color-mix(in srgb, var(--week-color) 55%, white);
  background: linear-gradient(180deg, white, color-mix(in srgb, var(--week-accent) 20%, white));
  display: grid;
  gap: 8px;
}
.week-icon { font-size: 34px; }
.week-tile strong { font-size: 24px; }
.week-tile small { color: var(--muted); font-weight: 800; }
.week-actions, .print-action-buttons, .compiled-tools { display: flex; flex-wrap: wrap; gap: 10px; }
.week-actions a, .print-action-buttons a, .compiled-cover button {
  border-radius: 8px;
  border: 2px solid var(--ink);
  background: white;
  padding: 10px 12px;
  font-weight: 900;
  text-align: center;
}
.week-actions a:last-child, .print-action-buttons a:last-child, .compiled-cover button {
  background: var(--week-color);
  color: white;
}
.print-actions {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  background: rgba(255,255,255,.92);
  border: 3px solid #cfded3;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 8px 22px rgba(36,54,66,.07);
}
.print-actions p { max-width: 760px; margin: 0; font-size: 17px; }
.problem-card {
  min-height: 330px;
  background: var(--card);
  border: 3px solid color-mix(in srgb, var(--week-color) 34%, #dfe8e2);
  border-radius: 8px;
  padding: 16px;
  break-inside: avoid;
  page-break-inside: avoid;
}
.problem-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.problem-number {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--week-color);
  color: white;
  font-weight: 950;
  font-size: 26px;
}
.problem-kind {
  padding: 6px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--week-accent) 34%, white);
  font-weight: 900;
}
.prompt { min-height: 58px; margin: 0 0 10px; font-size: 22px; font-weight: 850; line-height: 1.35; }
.visual {
  min-height: 118px;
  padding: 12px;
  border-radius: 8px;
  border: 2px dashed #b9c8d3;
  background: #fbfefd;
  display: grid;
  place-items: center;
  overflow-wrap: anywhere;
}
.dot-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; font-size: 28px; line-height: 1.1; }
.dot.crossed { opacity: .35; text-decoration: line-through; text-decoration-thickness: 4px; text-decoration-color: #b83232; }
.visual-groups { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; width: 100%; }
.pill { border: 2px solid #d7e2ea; background: white; border-radius: 8px; padding: 8px; }
.big-op { font-size: 34px; font-weight: 950; }
.ten-frame { display: grid; grid-template-columns: repeat(5, 34px); gap: 5px; }
.ten-frame span, .mini-grid span, .number-path span, .pattern-row span, .map-grid span {
  min-width: 34px;
  min-height: 34px;
  display: grid;
  place-items: center;
  border: 2px solid #aebdca;
  background: white;
  border-radius: 8px;
  font-size: 22px;
  font-weight: 900;
}
.ten-frame .filled { background: var(--week-accent); }
.number-path, .pattern-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.blank-tile { border-style: dashed !important; }
.mini-grid { display: grid; grid-template-columns: repeat(var(--cols), 48px); gap: 7px; }
.compare-bars { width: min(420px, 100%); display: grid; gap: 10px; }
.compare-bars div { display: grid; grid-template-columns: 58px 1fr; align-items: center; gap: 8px; }
.compare-bars span { width: calc(var(--w) * 7%); min-width: 44px; max-width: 100%; background: var(--week-accent); border: 2px solid #8f7f34; border-radius: 8px; padding: 7px; font-weight: 900; }
.equation { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; font-size: 30px; font-weight: 950; }
.equation span, .vertical-math span, .vertical-math strong { padding: 6px 10px; border-radius: 8px; background: white; border: 2px solid #c6d2db; }
.vertical-math { display: grid; justify-items: end; gap: 5px; font-size: 28px; font-weight: 950; }
.vertical-math strong { border-top: 4px solid var(--ink); }
.shape-set, .position-row, .queue, .bonus-scene { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; font-size: 34px; }
.shape-token { min-width: 54px; min-height: 54px; display: grid; place-items: center; border: 2px solid #b9c8d3; border-radius: 8px; background: white; }
.map-grid { display: grid; grid-template-columns: repeat(3, 48px); gap: 8px; }
.position-row .center { outline: 4px solid var(--week-accent); border-radius: 8px; }
.balance { display: grid; grid-template-columns: 1fr 54px 1fr; align-items: center; gap: 10px; width: 100%; text-align: center; font-size: 28px; }
.beam { font-weight: 950; font-size: 34px; }
.queue span { min-width: 34px; min-height: 34px; display: grid; place-items: center; border-bottom: 4px solid #9eacb8; }
.queue .marked { background: var(--week-accent); border-radius: 50%; }
.overlap { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; text-align: center; width: 100%; }
.overlap span, .overlap b { border: 3px solid var(--week-color); padding: 18px 8px; background: white; }
.overlap b { background: color-mix(in srgb, var(--week-accent) 45%, white); }
.place-value { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; }
.place-value > div { min-height: 86px; border: 2px solid #b9c8d3; border-radius: 8px; padding: 8px; background: white; }
.place-value b { display: block; margin-bottom: 6px; }
.ten-stick { display: inline-block; width: 18px; height: 62px; margin: 3px; border-radius: 5px; background: repeating-linear-gradient(180deg, var(--week-accent) 0 5px, #fff 5px 7px); border: 2px solid #9f8f4e; }
.answer-line { height: 46px; border-bottom: 3px solid var(--line); margin-top: 14px; color: var(--muted); font-weight: 850; }
.bonus-card { border-color: var(--week-color); background: linear-gradient(180deg, white, color-mix(in srgb, var(--week-accent) 16%, white)); }
.bonus-label { display: inline-block; padding: 7px 10px; background: var(--week-color); color: white; border-radius: 8px; font-weight: 950; margin-bottom: 10px; }
.adult-support { background: #f6faf8; border-top: 8px solid var(--week-color); }
.adult-support ul { margin: 0; padding-left: 22px; }
.support-grid > div { background: white; border: 2px solid #dfe8e2; border-radius: 8px; padding: 14px; }
.page-nav { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin: 22px 0 0; }
.compiled-body { background: #eef5ef; }
.compiled-print { width: min(980px, calc(100% - 28px)); margin: 0 auto; padding: 24px 0 48px; }
.compiled-cover {
  background: white;
  border: 3px solid var(--week-color);
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--shadow);
  margin-bottom: 18px;
}
.compiled-cover p { max-width: 760px; font-size: 18px; }
.compiled-page, .compiled-week-divider {
  background: white;
  border: 2px solid #cfd9d2;
  border-radius: 8px;
  padding: 18px;
  margin: 18px 0;
  box-shadow: 0 8px 22px rgba(36,54,66,.08);
}
.compiled-week-divider {
  border-left: 10px solid var(--week-color);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
}
.compiled-week-divider span { font-size: 38px; }
.compiled-week-divider h2, .compiled-week-divider p { margin: 0; }
.compiled-page-head {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: start;
  border-bottom: 3px solid var(--week-color);
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.compiled-page-head p { margin: 0 0 4px; font-weight: 900; color: var(--week-color); }
.compiled-page-head h2 { margin: 0; font-size: 24px; }
.compiled-page-mark {
  border: 2px solid var(--week-color);
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 950;
  background: color-mix(in srgb, var(--week-accent) 18%, white);
}
.compiled-problem-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.compiled-problem {
  border: 2px solid #b7c4bd;
  border-radius: 8px;
  padding: 10px;
  min-height: 238px;
  break-inside: avoid;
  page-break-inside: avoid;
}
.compiled-problem-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.compiled-number {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--week-color);
  color: white;
  font-size: 20px;
  font-weight: 950;
}
.compiled-kind {
  font-size: 13px;
  font-weight: 950;
  border: 1px solid #aebdca;
  border-radius: 8px;
  padding: 4px 7px;
}
.compiled-prompt { margin: 0 0 8px; min-height: 48px; font-size: 18px; font-weight: 850; line-height: 1.34; }
.compiled-visual {
  min-height: 82px;
  display: grid;
  place-items: center;
  border: 2px dashed #b9c8d3;
  border-radius: 8px;
  padding: 8px;
  background: #fbfefd;
}
.compiled-answer {
  margin-top: 9px;
  height: 36px;
  border-bottom: 3px solid var(--line);
  color: var(--muted);
  font-weight: 850;
}
.compiled-bonus {
  margin-top: 10px;
  border: 2px dashed var(--week-color);
  border-radius: 8px;
  padding: 8px 10px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
}
.compiled-bonus p { margin: 0; font-weight: 750; }
.compiled-guide {
  margin-top: 10px;
  border-top: 2px solid #cfd9d2;
  padding-top: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 10px;
  font-size: 13px;
}
.compiled-guide p, .compiled-guide ul { margin: 3px 0 0; }
.compiled-guide ul { padding-left: 18px; }
.challenge-body {
  background:
    radial-gradient(circle at 10% 10%, rgba(255,255,255,.9) 0 5%, transparent 6%),
    linear-gradient(160deg, color-mix(in srgb, var(--week-color) 12%, white), #fff8e8 52%, color-mix(in srgb, var(--week-accent) 20%, white));
}
.challenge-shell { width: min(900px, calc(100% - 28px)); margin: 0 auto; padding: 24px 0 48px; }
.challenge-start, .challenge-card, .challenge-results, .reward-game {
  background: rgba(255,255,255,.94);
  border: 3px solid color-mix(in srgb, var(--week-color) 50%, white);
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--shadow);
}
.challenge-start p { font-size: 19px; max-width: 760px; }
.challenge-start-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0;
}
.challenge-start-grid > div, .parent-summary, .missed-list li {
  border: 2px solid #d7e2da;
  border-radius: 8px;
  padding: 12px;
  background: #fbfefd;
}
.challenge-primary, .reward-button, .game-controls button {
  min-height: 48px;
  border: 2px solid var(--ink);
  border-radius: 8px;
  padding: 12px 16px;
  background: var(--week-color);
  color: white;
  font-size: 17px;
  font-weight: 950;
  cursor: pointer;
}
.challenge-primary:disabled, .reward-button:disabled, .game-controls button:disabled { opacity: .55; cursor: not-allowed; }
.is-hidden { display: none !important; }
.challenge-status {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  font-size: 18px;
  font-weight: 950;
}
.challenge-status span {
  border: 2px solid var(--week-color);
  border-radius: 8px;
  padding: 8px 10px;
  background: white;
}
.challenge-meter { height: 16px; border: 2px solid var(--week-color); border-radius: 999px; overflow: hidden; margin: 14px 0; background: white; }
.challenge-meter span { display: block; height: 100%; width: 0%; background: var(--week-accent); transition: width .25s ease; }
.challenge-kind {
  display: inline-block;
  border-radius: 8px;
  background: color-mix(in srgb, var(--week-accent) 30%, white);
  padding: 7px 10px;
  font-weight: 950;
  margin-bottom: 10px;
}
.challenge-prompt { margin: 0 0 14px; font-size: 30px; font-weight: 950; line-height: 1.22; }
.challenge-visual {
  min-height: 190px;
  display: grid;
  place-items: center;
  border: 3px dashed #b9c8d3;
  border-radius: 8px;
  background: white;
  padding: 18px;
  margin-bottom: 16px;
}
.challenge-visual .dot-row { font-size: 34px; }
.challenge-answer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: end;
}
.challenge-answer label { display: grid; gap: 6px; font-weight: 950; }
.challenge-answer input {
  width: 100%;
  border: 3px solid var(--week-color);
  border-radius: 8px;
  padding: 14px;
  font-size: 28px;
  font-weight: 900;
}
.challenge-soft { color: var(--muted); font-weight: 850; }
.result-top {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: center;
}
.praise-gif {
  width: 126px;
  height: 126px;
  border: 3px solid var(--week-color);
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--week-accent) 25%, white);
  font-size: 58px;
  animation: praisePop .8s steps(2, end) infinite;
}
@keyframes praisePop {
  0% { transform: rotate(-3deg) scale(1); }
  50% { transform: rotate(3deg) scale(1.06); }
}
.score-line { font-size: 36px; font-weight: 950; margin: 8px 0; }
.red-star {
  display: inline-grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #c62828;
  color: white;
  font-size: 38px;
  margin-right: 8px;
}
.avatar-reward {
  margin: 16px 0;
  border: 2px dashed var(--week-color);
  border-radius: 8px;
  padding: 14px;
  background: #fff;
  font-weight: 900;
}
.parent-summary { margin-top: 18px; }
.missed-list { display: grid; gap: 8px; padding-left: 0; list-style: none; }
.reward-game { margin-top: 18px; text-align: center; }
.reward-game canvas {
  width: 200px;
  height: 320px;
  max-width: 100%;
  background: #111827;
  border: 4px solid var(--ink);
  border-radius: 8px;
  image-rendering: pixelated;
}
.game-controls { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; align-items: center; margin-top: 12px; }
.game-tip { color: var(--muted); font-weight: 850; }
@media (max-width: 820px) {
  .home-hero, .adventure-hero, .week-grid, .task-grid, .support-grid, .print-actions, .compiled-page-head, .compiled-problem-grid, .compiled-guide, .challenge-start-grid, .challenge-answer, .result-top { grid-template-columns: 1fr; }
  h1 { font-size: 36px; }
  h2 { font-size: 26px; }
  .challenge-prompt { font-size: 24px; }
  .prompt { font-size: 20px; }
  .site-bar { align-items: stretch; }
}
@media (prefers-reduced-motion: no-preference) {
  .avatar-item { animation: bob 2.8s ease-in-out infinite; }
  @keyframes bob { 50% { transform: translateY(-5px); } }
}`;

const printCss = `@page { margin: 11mm; }
html, body { background: white !important; }
body { color: #111; font-size: 11pt; }
.no-print, .site-bar, .page-nav { display: none !important; }
.home, .worksheet { width: 100%; padding: 0; }
.home-hero, .adventure-hero, .parent-note, .task-section, .adult-support, .bonus-card, .week-map, .problem-card {
  box-shadow: none !important;
  background: white !important;
}
.adventure-hero {
  grid-template-columns: 1fr 45mm;
  padding: 8mm;
  border: 2pt solid #222;
}
h1 { font-size: 26pt; }
h2 { font-size: 17pt; }
.parent-note, .task-section, .adult-support, .bonus-card { margin-top: 5mm; padding: 5mm; border: 1.5pt solid #333; }
.task-grid { grid-template-columns: 1fr 1fr; gap: 5mm; }
.problem-card { min-height: 70mm; padding: 4mm; border: 1.5pt solid #333; break-inside: avoid; page-break-inside: avoid; }
.problem-number { background: #111 !important; color: white !important; }
.prompt { min-height: 16mm; font-size: 14pt; }
.visual { min-height: 30mm; border: 1.5pt dashed #555; background: white !important; }
.answer-line { height: 12mm; border-bottom: 1.5pt solid #222; }
.avatar { border-color: #222; }
.stamp-box, .charm-box { border: 1.5pt dashed #222; min-height: 18mm; }
.adult-support { break-inside: avoid; page-break-inside: avoid; }
.support-grid { grid-template-columns: 1fr 1fr; gap: 4mm; }
.support-grid > div { border: 1pt solid #333; }
.dot-row, .shape-set, .position-row, .queue, .bonus-scene { color: #111; }
.ten-frame span, .mini-grid span, .number-path span, .pattern-row span, .map-grid span, .shape-token { border-color: #111; }
.ten-frame .filled, .compare-bars span, .queue .marked, .overlap b { background: #ddd !important; }
.compiled-body { background: white !important; }
.compiled-print { width: 100%; padding: 0; }
.compiled-cover, .compiled-week-divider { display: none !important; }
.compiled-page {
  box-shadow: none !important;
  margin: 0 !important;
  padding: 6mm !important;
  border: 1.5pt solid #222 !important;
  border-radius: 0 !important;
  min-height: calc(100vh - 22mm);
  break-after: page;
  page-break-after: always;
  break-inside: avoid;
  page-break-inside: avoid;
}
.compiled-page:last-child {
  break-after: auto;
  page-break-after: auto;
}
.compiled-page-head {
  grid-template-columns: 1fr 42mm;
  gap: 4mm;
  border-bottom: 1.5pt solid #222;
  padding-bottom: 3mm;
  margin-bottom: 4mm;
}
.compiled-page-head p { margin: 0 0 1mm; color: #111; font-size: 10pt; }
.compiled-page-head h2 { font-size: 15pt; line-height: 1.18; }
.compiled-page-mark {
  border: 1.2pt solid #222;
  background: white !important;
  color: #111;
  padding: 2mm;
  font-size: 10pt;
}
.compiled-problem-grid {
  grid-template-columns: 1fr 1fr;
  gap: 4mm;
}
.compiled-problem {
  min-height: 58mm;
  padding: 3mm;
  border: 1.2pt solid #222;
  break-inside: avoid;
  page-break-inside: avoid;
}
.compiled-number { background: #111 !important; color: white !important; width: 9mm; height: 9mm; font-size: 13pt; }
.compiled-kind { border: 1pt solid #222; font-size: 8pt; }
.compiled-prompt { min-height: 13mm; font-size: 12.5pt; }
.compiled-visual { min-height: 23mm; border: 1pt dashed #444; background: white !important; padding: 2mm; }
.compiled-answer { height: 11mm; border-bottom: 1.5pt solid #222; }
.compiled-bonus {
  grid-template-columns: 30mm 1fr 28mm;
  margin-top: 3mm;
  border: 1pt dashed #222;
  padding: 2mm;
  font-size: 9pt;
}
.compiled-bonus .visual, .compiled-bonus .bonus-scene { min-height: 0; font-size: 16pt; }
.compiled-guide {
  grid-template-columns: 1fr 1fr 1.15fr;
  gap: 3mm;
  margin-top: 3mm;
  padding-top: 2mm;
  border-top: 1pt solid #222;
  font-size: 8.5pt;
}
.compiled-guide p, .compiled-guide ul { margin: 1mm 0 0; }
@media print { body[data-lang="zh"] .lang.en, body[data-lang="en"] .lang.zh { display: none !important; } }`;

const script = `(() => {
  const langKey = "grade1-math-adventure-lang";
  const body = document.body;
  const saved = localStorage.getItem(langKey);
  if (saved === "zh" || saved === "en") {
    body.dataset.lang = saved;
    document.documentElement.lang = saved === "zh" ? "zh-CN" : "en";
  }
  const text = (zh, en) => body.dataset.lang === "en" ? en : zh;
  const bilingual = (zh, en) => '<span class="lang zh">' + zh + '</span><span class="lang en">' + en + '</span>';

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = body.dataset.lang === "zh" ? "en" : "zh";
      body.dataset.lang = next;
      document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
      localStorage.setItem(langKey, next);
    });
  });

  const dataNode = document.getElementById("challengeData");
  if (!dataNode) return;
  const data = JSON.parse(dataNode.textContent);
  const app = document.getElementById("challengeApp");
  const startPanel = app.querySelector("[data-challenge-start]");
  const card = app.querySelector("[data-challenge-card]");
  const results = app.querySelector("[data-results]");
  const gamePanel = app.querySelector("[data-game]");
  const progress = app.querySelector("[data-progress]");
  const timer = app.querySelector("[data-timer]");
  const meter = app.querySelector("[data-meter]");
  const kind = app.querySelector("[data-kind]");
  const prompt = app.querySelector("[data-prompt]");
  const visual = app.querySelector("[data-visual]");
  const form = app.querySelector("[data-answer-form]");
  const input = app.querySelector("[data-answer-input]");
  const startButton = app.querySelector("[data-start-challenge]");
  const gameButton = app.querySelector("[data-game-start]");
  const gameInfo = app.querySelector("[data-game-info]");
  const canvas = app.querySelector("[data-game-canvas]");

  let index = 0;
  let startedAt = 0;
  let ticker = null;
  let responses = [];

  function fmt(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return m + ":" + s;
  }

  function normalize(value) {
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/\\s+/g, "")
      .replace("＋", "+")
      .replace("－", "-")
      .replace("加", "+")
      .replace("减", "-")
      .replace("不是", "no")
      .replace("不能", "no")
      .replace("不会", "no")
      .replace("对", "yes")
      .replace("是", "yes")
      .replace("能", "yes")
      .replace("错", "no")
      .replace("不", "no");
  }

  function updateTimer() {
    timer.textContent = fmt((Date.now() - startedAt) / 1000);
  }

  function showQuestion() {
    const q = data.questions[index];
    progress.innerHTML = bilingual("第 " + (index + 1) + " / " + data.questions.length + " 题", "Question " + (index + 1) + " of " + data.questions.length);
    meter.style.width = (index / data.questions.length * 100) + "%";
    kind.innerHTML = bilingual(q.conceptZh, q.conceptEn);
    prompt.innerHTML = bilingual(q.zh, q.en);
    visual.innerHTML = q.visual;
    input.value = "";
    input.focus();
  }

  function startChallenge() {
    startPanel.classList.add("is-hidden");
    card.classList.remove("is-hidden");
    startedAt = Date.now();
    responses = [];
    index = 0;
    updateTimer();
    ticker = setInterval(updateTimer, 1000);
    showQuestion();
  }

  function checkAnswer(answer, q) {
    const got = normalize(answer);
    return q.answers.some((a) => normalize(a) === got);
  }

  function revisitSuggestion(missed) {
    if (!missed.length) return bilingual("保持手感：下周继续先看图、再说想法。", "Keep the rhythm: next week, look first and explain your thinking.");
    const concepts = [...new Set(missed.map((m) => body.dataset.lang === "en" ? m.conceptEn : m.conceptZh))].slice(0, 3).join("、");
    return bilingual("建议回看：" + concepts + "。用小物品摆一摆会更稳。", "Revisit: " + concepts + ". Building with small objects will help.");
  }

  function finishChallenge() {
    clearInterval(ticker);
    ticker = null;
    meter.style.width = "100%";
    card.classList.add("is-hidden");
    const totalSeconds = Math.round((Date.now() - startedAt) / 1000);
    const correct = responses.filter((r) => r.correct).length;
    const missed = responses.filter((r) => !r.correct);
    const passed = correct >= data.threshold;
    const praiseZh = passed ? "红星到手！你又勇敢又认真。" : "完成就是进步！小伙伴为你鼓掌。";
    const praiseEn = passed ? "Red star earned! Brave and careful work." : "Finishing is progress! Your buddy is cheering.";
    const missedHtml = missed.length
      ? missed.map((m) => '<li><strong>#' + m.number + '</strong> ' + bilingual(m.zh, m.en) + '<br><span>' + bilingual("你的答案：", "Your answer: ") + (m.answer || "-") + '</span></li>').join("")
      : '<li>' + bilingual("没有漏掉的题。", "No missed questions.") + '</li>';
    results.innerHTML =
      '<div class="result-top">' +
        '<div class="praise-gif" aria-hidden="true">' + (passed ? "🌟" : "🎈") + '</div>' +
        '<div><p class="eyebrow">' + bilingual(data.titleZh, data.titleEn) + '</p>' +
        '<h1>' + bilingual("挑战完成！", "Challenge Complete!") + '</h1>' +
        '<p>' + bilingual(praiseZh, praiseEn) + '</p></div>' +
      '</div>' +
      '<div class="score-line">' + (passed ? '<span class="red-star">★</span>' : "") + correct + " / " + data.questions.length + '</div>' +
      '<p><strong>' + bilingual("总时间：", "Total time: ") + '</strong>' + fmt(totalSeconds) + '</p>' +
      '<div class="avatar-reward">' + data.icon + " " + bilingual("小伙伴获得：" + data.rewardZh, "Buddy reward: " + data.rewardEn) + '</div>' +
      '<button class="reward-button" type="button" data-unlock-game>' + bilingual("解锁奖励小游戏", "Unlock Mini Reward Game") + '</button>' +
      '<section class="parent-summary"><h2>' + bilingual("家长小结", "Parent Summary") + '</h2>' +
        '<p><strong>' + bilingual("检查内容：", "Concepts checked: ") + '</strong>' + bilingual(data.conceptsZh, data.conceptsEn) + '</p>' +
        '<p><strong>' + bilingual("完成情况：", "Completion: ") + '</strong>' + responses.length + " / " + data.questions.length + '</p>' +
        '<p><strong>' + bilingual("用时：", "Timing: ") + '</strong>' + fmt(totalSeconds) + '</p>' +
        '<h3>' + bilingual("需要回看的题", "Questions to Revisit") + '</h3><ul class="missed-list">' + missedHtml + '</ul>' +
        '<p><strong>' + bilingual("建议：", "Suggestion: ") + '</strong>' + revisitSuggestion(missed) + '</p>' +
      '</section>';
    results.classList.remove("is-hidden");
    results.querySelector("[data-unlock-game]").addEventListener("click", () => {
      gamePanel.classList.remove("is-hidden");
      gamePanel.scrollIntoView({ behavior: "smooth", block: "start" });
      updateGamePlays();
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = data.questions[index];
    const answer = input.value.trim();
    responses.push({
      number: index + 1,
      zh: q.zh,
      en: q.en,
      conceptZh: q.conceptZh,
      conceptEn: q.conceptEn,
      answer,
      correct: checkAnswer(answer, q)
    });
    index += 1;
    if (index >= data.questions.length) finishChallenge();
    else showQuestion();
  });
  startButton.addEventListener("click", startChallenge);

  const gameKey = "grade1-week-" + data.week + "-reward-plays";
  const ctx = canvas.getContext("2d");
  const cols = 10;
  const rows = 16;
  const size = 20;
  const colors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#f78c6b"];
  const shapes = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]]
  ];
  let board, piece, gameTimer, dropTimer, gameEndsAt, gameScore;

  function playsUsed() {
    return Number(localStorage.getItem(gameKey) || "0");
  }
  function updateGamePlays() {
    const left = Math.max(0, 2 - playsUsed());
    if (piece) {
      gameInfo.textContent = text("游戏进行中", "Game in progress");
      gameButton.disabled = true;
      return;
    }
    gameInfo.textContent = text("还可以玩 " + left + " 次", left + " play(s) left");
    gameButton.disabled = left <= 0;
  }
  function newPiece() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)].map((r) => r.slice());
    return { shape, x: 3, y: 0, color: colors[Math.floor(Math.random() * colors.length)] };
  }
  function collide(p, offX, offY, shape) {
    const s = shape || p.shape;
    for (let y = 0; y < s.length; y++) {
      for (let x = 0; x < s[y].length; x++) {
        if (!s[y][x]) continue;
        const nx = p.x + x + offX;
        const ny = p.y + y + offY;
        if (nx < 0 || nx >= cols || ny >= rows || (ny >= 0 && board[ny][nx])) return true;
      }
    }
    return false;
  }
  function merge() {
    piece.shape.forEach((row, y) => row.forEach((cell, x) => {
      if (cell && piece.y + y >= 0) board[piece.y + y][piece.x + x] = piece.color;
    }));
    for (let y = rows - 1; y >= 0; y--) {
      if (board[y].every(Boolean)) {
        board.splice(y, 1);
        board.unshift(Array(cols).fill(null));
        gameScore += 10;
        y += 1;
      }
    }
    piece = newPiece();
    if (collide(piece, 0, 0)) endGame();
  }
  function rotate(shape) {
    return shape[0].map((_, i) => shape.map((row) => row[i]).reverse());
  }
  function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  }
  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => row.forEach((color, x) => { if (color) drawCell(x, y, color); }));
    if (piece) piece.shape.forEach((row, y) => row.forEach((cell, x) => { if (cell) drawCell(piece.x + x, piece.y + y, piece.color); }));
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(text("分数 ", "Score ") + gameScore, 8, 16);
    ctx.fillText(text("时间 ", "Time ") + Math.max(0, Math.ceil((gameEndsAt - Date.now()) / 1000)), 136, 16);
  }
  function step() {
    if (!piece) return;
    if (!collide(piece, 0, 1)) piece.y += 1;
    else merge();
    drawGame();
  }
  function endGame() {
    clearInterval(dropTimer);
    clearInterval(gameTimer);
    piece = null;
    drawGame();
    gameInfo.textContent = text("游戏结束，分数 " + gameScore, "Game over, score " + gameScore);
    gameButton.disabled = playsUsed() >= 2;
  }
  function startGame() {
    if (playsUsed() >= 2) return;
    localStorage.setItem(gameKey, String(playsUsed() + 1));
    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    piece = newPiece();
    gameScore = 0;
    gameEndsAt = Date.now() + 60000;
    clearInterval(dropTimer);
    clearInterval(gameTimer);
    dropTimer = setInterval(step, 650);
    gameTimer = setInterval(() => {
      if (Date.now() >= gameEndsAt) endGame();
      else drawGame();
    }, 250);
    updateGamePlays();
    drawGame();
  }
  document.addEventListener("keydown", (event) => {
    if (!piece || gamePanel.classList.contains("is-hidden")) return;
    if (event.key === "ArrowLeft" && !collide(piece, -1, 0)) piece.x -= 1;
    if (event.key === "ArrowRight" && !collide(piece, 1, 0)) piece.x += 1;
    if (event.key === "ArrowDown") step();
    if (event.key === "ArrowUp") {
      const r = rotate(piece.shape);
      if (!collide(piece, 0, 0, r)) piece.shape = r;
    }
    if (event.key.startsWith("Arrow")) event.preventDefault();
    drawGame();
  });
  gameButton.addEventListener("click", startGame);
  updateGamePlays();
})();`;

function write(file, contents) {
  fs.writeFileSync(path.join(root, file), contents, "utf8");
}

write("index.html", indexHtml());
write("styles.css", styles);
write("print.css", printCss);
write("script.js", script);

for (const week of weeks) {
  write(`week-${pad(week.n)}-print.html`, weekPrintHtml(week));
  write(`week-${pad(week.n)}-challenge.html`, challengeHtml(week));
  for (let day = 1; day <= dayCount; day += 1) {
    write(`week-${pad(week.n)}-day-${pad(day)}.html`, pageHtml(week, day));
  }
}
write("full-program-print.html", fullProgramPrintHtml());

const readme = `# Grade 1 Math Adventure / 一年级数学冒险

Static printable bilingual Grade 1 math program.

- \`index.html\`: parent/teacher note and 12-week map.
- \`week-01-day-01.html\` through \`week-12-day-05.html\`: daily printable pages.
- \`week-01-challenge.html\` through \`week-12-challenge.html\`: online weekly challenge tests with scoring and a short reward game.
- \`week-01-print.html\` through \`week-12-print.html\`: weekly compiled print packets. Each week prints as 10 pages.
- \`full-program-print.html\`: full 12-week compiled print packet.
- \`styles.css\`: shared screen design system.
- \`print.css\`: print stylesheet.
- \`script.js\`: small language toggle.
- \`scripts/generate-site.js\`: reusable structured day-data model plus daily and compiled-print renderers.

Run \`node scripts/generate-site.js\` after editing the generator to rebuild all pages.
`;
write("README.md", readme);

console.log("Generated index, shared assets, 60 daily pages, 12 weekly challenges, 12 weekly print packets, and the full-program print packet.");
