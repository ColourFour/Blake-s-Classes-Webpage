'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const board = $('board');
  const progress = document.querySelector('.sky-progress');
  const player = new Audio();
  const order = 'satpinmdgockeurhbfljvwyzxq';
  const pick = list => list[Math.floor(Math.random() * list.length)];
  function shuffled(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  const settings = {letterCase: 'lower', kind: 'name', size: '6'};
  const trophyKey = 'alphabet-stars-trophy';
  try {
    $('earned-trophy').hidden = localStorage.getItem(trophyKey) !== 'earned';
    const saved = JSON.parse(localStorage.getItem('alphabet-stars-settings'));
    for (const key of Object.keys(settings)) {
      if ([...document.getElementsByName(key)].some(input => input.value === saved?.[key])) settings[key] = saved[key];
    }
  } catch {}

  let pool = [], queue = [], capitals = new Set();
  const cleared = new Map();
  const lastSlot = new Map();
  const lastFiveSlot = new Map();
  let target, restored, clip, phase = 'ready', heard = false;
  let playback = 0, timer, pending;

  function updateProgress() {
    progress.setAttribute('aria-valuemax', settings.size);
    progress.setAttribute('aria-valuenow', cleared.size);
    const meter = progress.querySelector('progress');
    meter.max = Number(settings.size);
    meter.value = cleared.size;
  }

  function saveSettings() {
    try { localStorage.setItem('alphabet-stars-settings', JSON.stringify(settings)); } catch {}
  }

  function pause() {
    clearTimeout(timer);
    ++playback;
    player.onended = player.onerror = null;
    player.pause();
    heard = false;
  }

  function afterFeedback(action, delay) {
    phase = 'feedback';
    heard = false;
    pending = () => {
      pending = null;
      action();
    };
    timer = setTimeout(pending, delay);
  }

  function playPrompt() {
    const id = ++playback;
    heard = false;
    $('replay').classList.remove('needs-tap');
    const failed = () => {
      if (id !== playback) return;
      heard = false;
      $('replay').classList.add('needs-tap');
      $('sky-status').textContent = 'Tap the speaker to play the recording.';
    };
    player.onended = () => { if (id === playback) heard = true; };
    player.onerror = failed;
    if (player.getAttribute('src') !== clip || player.error) player.src = clip;
    else player.currentTime = 0;
    player.play().catch(failed);
  }

  function glyph(letter) {
    return capitals.has(letter) ? letter.toUpperCase() : letter;
  }

  function deal(count) {
    // The two hard-c/k sound recordings cannot distinguish those answers.
    const alternatives = shuffled(pool.filter(letter => letter !== target &&
      letter !== restored?.letter &&
      !(settings.kind === 'sound' && 'ck'.includes(target) && 'ck'.includes(letter))));
    const others = alternatives.slice(0, count - 1);
    if (settings.letterCase === 'mixed' && others.every(letter => capitals.has(letter) === capitals.has(target))) {
      const opposite = alternatives.find(letter => capitals.has(letter) !== capitals.has(target));
      if (opposite) others[0] = opposite;
    }

    const slots = shuffled(Array.from({length: count}, (_, i) => i));
    const targetSlot = slots.find(i => i !== lastSlot.get(target) &&
      (count !== 5 || i !== lastFiveSlot.get(target)) &&
      !(target === restored?.letter && i === restored.slot));
    const result = Array(count);
    result[targetSlot] = target;
    for (const letter of others) {
      const vacant = slots.filter(i => result[i] === undefined);
      const slot = vacant.find(i => i !== lastSlot.get(letter)) ?? vacant[0];
      result[slot] = letter;
    }
    result.forEach((letter, i) => {
      lastSlot.set(letter, i);
      if (count === 5) lastFiveSlot.set(letter, i);
    });
    return result;
  }

  function prompt(nextPhase) {
    pause();
    phase = nextPhase;
    const guided = phase !== 'find';
    const variants = settings.kind === 'sound' ? ['sound-us','sound-au'] :
      target === 'z' ? ['name-us'] : ['name-us','name-gb'];
    clip = 'assets/star-audio/' + pick(variants) + '/' + target + '.mp3';
    $('reminder').hidden = !guided;
    $('reminder').textContent = guided ? glyph(target) : '';
    const refocus = board.contains(document.activeElement);
    board.replaceChildren();
    for (const letter of deal(guided ? 3 : 5)) {
      const button = document.createElement('button');
      button.className = 'letter-star';
      button.dataset.letter = letter;
      const face = document.createElement('span');
      face.textContent = glyph(letter);
      button.append(face);
      if (guided && letter === target) button.classList.add('hint');
      button.onclick = () => answer(letter, button);
      board.append(button);
    }
    if (refocus) board.focus({preventScroll:true});
    $('sky-status').textContent = guided ? 'Listen, then touch the matching glowing star.' : 'Listen and find the matching star.';
    playPrompt();
  }

  function start() {
    pause();
    pending = null;
    restored = null;
    cleared.clear();
    lastSlot.clear();
    lastFiveSlot.clear();
    pool = [...order.slice(0, Number(settings.size))];
    queue = shuffled(pool);
    capitals = new Set(settings.letterCase === 'mixed' ? shuffled(pool).slice(0, pool.length / 2) :
      settings.letterCase === 'upper' ? pool : []);
    target = queue[queue.length - 1];
    $('settings').hidden = $('launch').hidden = $('finish').hidden = true;
    $('field').hidden = $('replay').hidden = false;
    $('options').setAttribute('aria-expanded', 'false');
    updateProgress();
    prompt('model');
    board.focus({preventScroll:true});
  }

  function finish() {
    phase = 'won';
    board.replaceChildren();
    $('replay').hidden = true;
    $('finish').hidden = false;
    $('next-champion').hidden = settings.letterCase === 'mixed';
    $('again').focus();
    $('sky-status').textContent = 'You cleared the sky! You earned the Alphabet Stars trophy.';
  }

  function answer(letter, button) {
    if (!heard || phase === 'feedback') return;
    const guided = phase !== 'find';
    if (letter !== target) {
      button.classList.add('miss');
      $('sky-status').textContent = 'Listen again. Let’s find it together.';
      // Bring one collected star back for review, without stacking penalties during practice.
      if (!guided && !restored && cleared.size) {
        const review = pick([...cleared.keys()]);
        restored = {letter: review, slot: cleared.get(review)};
        cleared.delete(review);
        queue.unshift(review);
        updateProgress();
      }
      const retry = phase === 'model' ? 'model' : 'repair';
      afterFeedback(() => prompt(retry), 560);
      return;
    }

    button.classList.remove('hint');
    button.classList.add('shoot');
    if (guided) {
      const next = phase === 'model' ? queue.shift() : target;
      afterFeedback(() => {
        target = next;
        prompt('find');
      }, 480);
      return;
    }

    cleared.set(letter, lastSlot.get(letter));
    if (letter === restored?.letter) restored = null;
    updateProgress();
    $('sky-status').textContent = 'You found it!';
    if (!queue.length) {
      $('earned-trophy').hidden = false;
      try { localStorage.setItem(trophyKey, 'earned'); } catch {}
      afterFeedback(finish, 680);
    } else {
      afterFeedback(() => {
        target = queue.shift();
        prompt('find');
      }, 680);
    }
  }

  function resume() {
    if (pending) pending();
    else if (phase !== 'ready' && phase !== 'won') playPrompt();
  }

  function toggleSettings(open) {
    pause();
    $('settings').hidden = !open;
    $('field').hidden = open;
    $('options').setAttribute('aria-expanded', String(open));
    $('replay').hidden = open || phase === 'ready' || phase === 'won';
    if (open) {
      for (const [key,value] of Object.entries(settings)) {
        [...document.getElementsByName(key)].find(input => input.value === value).checked = true;
      }
      $('settings').querySelector('input:checked').focus();
    } else {
      $('options').focus();
      resume();
    }
  }

  $('launch-sample').textContent = {lower:'a', upper:'A', mixed:'Aa'}[settings.letterCase];
  $('play').onclick = $('again').onclick = start;
  $('champion').onclick = $('next-champion').onclick = () => {
    settings.letterCase = 'mixed';
    saveSettings();
    start();
  };
  $('replay').onclick = () => { if (phase !== 'feedback') playPrompt(); };
  $('options').onclick = () => toggleSettings($('settings').hidden);
  $('apply').onclick = () => {
    for (const key of Object.keys(settings)) settings[key] = document.querySelector('input[name="'+key+'"]:checked').value;
    saveSettings();
    start();
  };
  window.addEventListener('pagehide', pause);
  window.addEventListener('pageshow', event => {
    if (event.persisted && $('settings').hidden) resume();
  });
  updateProgress();
})();
