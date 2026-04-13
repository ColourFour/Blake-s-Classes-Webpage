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

function pageHtml(week, day) {
  const file = `week-${pad(week.n)}-day-${pad(day)}.html`;
  const prev = day > 1 ? `week-${pad(week.n)}-day-${pad(day - 1)}.html` : week.n > 1 ? `week-${pad(week.n - 1)}-day-05.html` : "index.html";
  const next = day < 5 ? `week-${pad(week.n)}-day-${pad(day + 1)}.html` : week.n < 12 ? `week-${pad(week.n + 1)}-day-01.html` : "index.html";
  const tasks = [...warmups(week, day), ...coreProblems(week, day), ...mixedProblems(week, day)];
  const guide = adultGuide(week, day);
  const dayMeta = dayInfo[day - 1];
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
      ${problemInner(bonus(week, day), false)}
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
  const weekLinks = weeks.map(w => `<a class="week-tile" href="week-${pad(w.n)}-day-01.html" style="--week-color:${w.color};--week-accent:${w.accent}">
    <span class="week-icon">${w.icon}</span>
    <strong>${t(`第 ${w.n} 周`, `Week ${w.n}`)}</strong>
    <span>${t(w.zh, w.en)}</span>
    <small>${t(w.themeZh, w.themeEn)}</small>
  </a>`).join("\n      ");
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
@media (max-width: 820px) {
  .home-hero, .adventure-hero, .week-grid, .task-grid, .support-grid { grid-template-columns: 1fr; }
  h1 { font-size: 36px; }
  h2 { font-size: 26px; }
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
@media print { body[data-lang="zh"] .lang.en, body[data-lang="en"] .lang.zh { display: none !important; } }`;

const script = `(() => {
  const key = "grade1-math-adventure-lang";
  const body = document.body;
  const saved = localStorage.getItem(key);
  if (saved === "zh" || saved === "en") {
    body.dataset.lang = saved;
    document.documentElement.lang = saved === "zh" ? "zh-CN" : "en";
  }
  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = body.dataset.lang === "zh" ? "en" : "zh";
      body.dataset.lang = next;
      document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
      localStorage.setItem(key, next);
    });
  });
})();`;

function write(file, contents) {
  fs.writeFileSync(path.join(root, file), contents, "utf8");
}

write("index.html", indexHtml());
write("styles.css", styles);
write("print.css", printCss);
write("script.js", script);

for (const week of weeks) {
  for (let day = 1; day <= dayCount; day += 1) {
    write(`week-${pad(week.n)}-day-${pad(day)}.html`, pageHtml(week, day));
  }
}

const readme = `# Grade 1 Math Adventure / 一年级数学冒险

Static printable bilingual Grade 1 math program.

- \`index.html\`: parent/teacher note and 12-week map.
- \`week-01-day-01.html\` through \`week-12-day-05.html\`: daily printable pages.
- \`styles.css\`: shared screen design system.
- \`print.css\`: print stylesheet.
- \`script.js\`: small language toggle.
- \`scripts/generate-site.js\`: reusable content and template generator.

Run \`node scripts/generate-site.js\` after editing the generator to rebuild all pages.
`;
write("README.md", readme);

console.log("Generated index, shared assets, and 60 daily pages.");
