(() => {
  const langKey = "grade1-math-adventure-lang";
  const body = document.body;
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); }
      catch (_) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); }
      catch (_) {}
    }
  };
  const saved = storage.get(langKey);
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
      storage.set(langKey, next);
    });
  });

  const completeButtons = document.querySelectorAll("[data-complete-day]");
  const stampBoxes = document.querySelectorAll("[data-stamp-box]");
  function updateCompleteState(isComplete) {
    if (!isComplete) return;
    completeButtons.forEach((completeButton) => {
      completeButton.innerHTML = bilingual("完成章已盖！", "Marked complete!");
    });
    stampBoxes.forEach((stampBox) => {
      stampBox.innerHTML = bilingual("今日印章到手！", "Today's stamp earned!");
    });
  }
  if (body.dataset.week && body.dataset.day) {
    updateCompleteState(storage.get("grade1-week-" + body.dataset.week + "-day-" + body.dataset.day + "-complete") === "1");
  }
  completeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const week = body.dataset.week;
      const day = body.dataset.day;
      if (!week || !day) return;
      storage.set("grade1-week-" + week + "-day-" + day + "-complete", "1");
      updateCompleteState(true);
    });
  });

  document.querySelectorAll("[data-week-progress]").forEach((node) => {
    const week = node.dataset.weekProgress;
    let days = 0;
    for (let d = 1; d <= 5; d++) {
      if (storage.get("grade1-week-" + week + "-day-" + d + "-complete") === "1") days += 1;
    }
    const challenge = storage.get("grade1-week-" + week + "-challenge-complete") === "1";
    node.innerHTML = bilingual("进度：" + days + "/5 天" + (challenge ? " · 挑战完成" : ""), "Progress: " + days + "/5 days" + (challenge ? " · challenge done" : ""));
  });

  document.querySelectorAll("[data-buddy-status]").forEach((node) => {
    let completedDays = 0;
    let completedChallenges = 0;
    for (let w = 1; w <= 12; w++) {
      for (let d = 1; d <= 5; d++) {
        if (storage.get("grade1-week-" + w + "-day-" + d + "-complete") === "1") completedDays += 1;
      }
      if (storage.get("grade1-week-" + w + "-challenge-complete") === "1") completedChallenges += 1;
    }
    node.innerHTML = bilingual("已收集：" + completedDays + "枚日印章 · " + completedChallenges + "个挑战游戏", "Collected: " + completedDays + " day stamps · " + completedChallenges + " challenge games");
  });

  document.querySelectorAll("[data-game-link]").forEach((link) => {
    const week = link.dataset.gameLink;
    const unlocked = storage.get("grade1-week-" + week + "-challenge-complete") === "1";
    const nameZh = link.dataset.gameNameZh || "奖励游戏";
    const nameEn = link.dataset.gameNameEn || "Reward Game";
    if (unlocked) {
      link.innerHTML = bilingual("🎮 " + nameZh, "🎮 " + nameEn);
    } else {
      link.innerHTML = bilingual("🔒 " + nameZh, "🔒 " + nameEn);
    }
  });

  function initRewardGame(game) {
    const locked = document.querySelector("[data-game-locked]");
    const ready = document.querySelector("[data-game-ready]");
    const play = document.querySelector("[data-reward-play]");
    const results = document.querySelector("[data-reward-results]");
    const start = document.querySelector("[data-reward-start]");
    const progress = document.querySelector("[data-reward-progress]");
    const scoreNode = document.querySelector("[data-reward-score]");
    const promptNode = document.querySelector("[data-reward-prompt]");
    const visualNode = document.querySelector("[data-reward-visual]");
    const choicesNode = document.querySelector("[data-reward-choices]");
    const feedback = document.querySelector("[data-reward-feedback]");
    if (!ready || !start) return;
    const unlocked = storage.get("grade1-week-" + game.week + "-challenge-complete") === "1";
    if (unlocked) {
      locked.classList.add("is-hidden");
      ready.classList.remove("is-hidden");
    }
    let index = 0;
    let score = 0;
    function renderRound() {
      const round = game.rounds[index];
      progress.innerHTML = bilingual("第 " + (index + 1) + " / " + game.rounds.length + " 轮", "Round " + (index + 1) + " of " + game.rounds.length);
      scoreNode.innerHTML = bilingual("星星 " + score, "Stars " + score);
      promptNode.innerHTML = bilingual(round.promptZh, round.promptEn);
      visualNode.innerHTML = round.visual;
      feedback.innerHTML = bilingual("选一个答案。", "Choose one answer.");
      choicesNode.innerHTML = round.choices.map((choice) => '<button type="button" data-choice="' + choice.value + '">' + bilingual(choice.zh, choice.en) + '</button>').join("");
      choicesNode.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          const correct = normalize(button.dataset.choice) === normalize(round.answer);
          if (correct) {
            score += 1;
            feedback.innerHTML = bilingual("答对啦！", "Nice match!");
            choicesNode.querySelectorAll("button").forEach((b) => b.disabled = true);
            setTimeout(() => {
              index += 1;
              if (index >= game.rounds.length) finishGame();
              else renderRound();
            }, 650);
          } else {
            feedback.innerHTML = bilingual("差一点，换一个试试。", "Almost. Try another one.");
            button.disabled = true;
          }
        });
      });
    }
    function finishGame() {
      play.classList.add("is-hidden");
      results.innerHTML = '<div class="result-top"><div class="praise-gif">' + game.icon + '</div><div><p class="eyebrow">' + bilingual(game.themeZh, game.themeEn) + '</p><h1>' + bilingual("游戏完成！", "Game Complete!") + '</h1><p>' + bilingual("你收集了 " + score + " 颗星星。", "You collected " + score + " stars.") + '</p></div></div><button class="reward-button" type="button" data-replay-game>' + bilingual("再玩一次", "Play Again") + '</button>';
      results.classList.remove("is-hidden");
      results.querySelector("[data-replay-game]").addEventListener("click", () => {
        results.classList.add("is-hidden");
        index = 0;
        score = 0;
        play.classList.remove("is-hidden");
        renderRound();
      });
    }
    start.addEventListener("click", () => {
      ready.classList.add("is-hidden");
      play.classList.remove("is-hidden");
      index = 0;
      score = 0;
      renderRound();
    });
  }

  const dataNode = document.getElementById("challengeData");
  const gameDataNode = document.getElementById("rewardGameData");
  if (!dataNode && !gameDataNode) return;
  if (gameDataNode) {
    initRewardGame(JSON.parse(gameDataNode.textContent));
    if (!dataNode) return;
  }
  const data = JSON.parse(dataNode.textContent);
  const app = document.getElementById("challengeApp");
  const startPanel = app.querySelector("[data-challenge-start]");
  const card = app.querySelector("[data-challenge-card]");
  const results = app.querySelector("[data-results]");
  const progress = app.querySelector("[data-progress]");
  const timer = app.querySelector("[data-timer]");
  const meter = app.querySelector("[data-meter]");
  const kind = app.querySelector("[data-kind]");
  const prompt = app.querySelector("[data-prompt]");
  const visual = app.querySelector("[data-visual]");
  const form = app.querySelector("[data-answer-form]");
  const input = app.querySelector("[data-answer-input]");
  const startButton = app.querySelector("[data-start-challenge]");

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
    const zhConcepts = [...new Set(missed.map((m) => m.conceptZh))].slice(0, 3).join("、");
    const enConcepts = [...new Set(missed.map((m) => m.conceptEn))].slice(0, 3).join(", ");
    return bilingual("建议回看：" + zhConcepts + "。用小物品摆一摆会更稳。", "Revisit: " + enConcepts + ". Building with small objects will help.");
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
    storage.set("grade1-week-" + data.week + "-challenge-complete", "1");
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
      '<a class="reward-button" href="week-' + String(data.week).padStart(2, "0") + '-game.html">' + bilingual("解锁奖励小游戏", "Unlock Mini Reward Game") + '</a>' +
      '<section class="parent-summary"><h2>' + bilingual("家长小结", "Parent Summary") + '</h2>' +
        '<p><strong>' + bilingual("检查内容：", "Concepts checked: ") + '</strong>' + bilingual(data.conceptsZh, data.conceptsEn) + '</p>' +
        '<p><strong>' + bilingual("完成情况：", "Completion: ") + '</strong>' + responses.length + " / " + data.questions.length + '</p>' +
        '<p><strong>' + bilingual("用时：", "Timing: ") + '</strong>' + fmt(totalSeconds) + '</p>' +
        '<h3>' + bilingual("需要回看的题", "Questions to Revisit") + '</h3><ul class="missed-list">' + missedHtml + '</ul>' +
        '<p><strong>' + bilingual("建议：", "Suggestion: ") + '</strong>' + revisitSuggestion(missed) + '</p>' +
      '</section>';
    results.classList.remove("is-hidden");
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
})();