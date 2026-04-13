(() => {
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
      .replace(/\s+/g, "")
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
})();