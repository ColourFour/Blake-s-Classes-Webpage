'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const board = $('board');
  const player = new Audio();
  const order = 'satpinmdgockeurhbfljvwyzxq';
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const buttons = new Map();
  const progress = document.querySelector('.sky-progress');
  let settings = {letterCase: 'lower', kind: 'name', size: '6'};
  try {
    const saved = JSON.parse(localStorage.getItem('alphabet-stars-settings'));
    for (const key of Object.keys(settings)) {
      if ([...document.getElementsByName(key)].some(input => input.value === saved?.[key])) settings[key] = saved[key];
    }
  } catch {}
  let active = new Set();
  let cleared = [];
  let target, clip, phase = 'ready', heard = false, timer, playback = 0;

  function updateProgress() {
    progress.setAttribute('aria-valuemax', settings.size);
    progress.setAttribute('aria-valuenow', cleared.length);
    const meter = progress.querySelector('progress');
    meter.max = Number(settings.size);
    meter.value = cleared.length;
  }

  function stop() {
    clearTimeout(timer);
    ++playback;
    player.onended = null;
    player.onerror = null;
    player.pause();
    heard = false;
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
    player.onended = () => {
      if (id !== playback) return;
      heard = true;
      if (phase === 'model') {
        phase = 'copy';
        $('sky-status').textContent = 'Your turn. Tap the glowing star.';
      }
    };
    player.onerror = failed;
    if (player.getAttribute('src') !== clip || player.error) player.src = clip;
    else player.currentTime = 0;
    player.play().catch(failed);
  }

  function prompt(nextPhase, exclude) {
    stop();
    for (const b of buttons.values()) b.classList.remove('hint', 'miss');
    const choices = [...active].filter(letter => letter !== exclude);
    target = pick(choices.length ? choices : [...active]);
    phase = nextPhase;
    const variants = settings.kind === 'sound' ? ['sound-us','sound-au'] :
      target === 'z' ? ['name-us'] : ['name-us','name-gb'];
    clip = 'assets/star-audio/' + pick(variants) + '/' + target + '.mp3';
    if (phase === 'model') buttons.get(target).classList.add('hint');
    $('sky-status').textContent = phase === 'model' ? 'Watch the hand touch a star.' : 'Listen and find the matching star.';
    playPrompt();
  }

  function start() {
    stop();
    active = new Set(order.slice(0, Number(settings.size)));
    cleared = [];
    buttons.clear();
    board.replaceChildren();
    board.dataset.size = settings.size;
    const letters = [...active];
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    for (const letter of letters) {
      const button = document.createElement('button');
      button.className = 'letter-star';
      button.dataset.letter = letter;
      const text = document.createElement('span');
      text.textContent = settings.letterCase === 'upper' ? letter.toUpperCase() : letter;
      button.append(text);
      button.onclick = () => answer(letter);
      buttons.set(letter, button);
      board.append(button);
    }
    $('launch').hidden = $('finish').hidden = true;
    $('replay').hidden = false;
    updateProgress();
    prompt('model');
  }

  function guideRetry() {
    phase = 'repair';
    buttons.get(target).classList.add('hint');
    $('sky-status').textContent = 'Listen again. Touch the glowing star.';
    playPrompt();
  }

  function showMiss(button, restoreStar) {
    phase = 'burst';
    heard = false;
    buttons.get(target).classList.remove('hint');
    button.classList.add('miss');
    $('sky-status').textContent = 'That was a different star.';
    if (restoreStar && cleared.length) {
      const restored = cleared.splice(Math.floor(Math.random() * cleared.length), 1)[0];
      active.add(restored);
      buttons.get(restored).classList.remove('collected');
      buttons.get(restored).disabled = false;
      updateProgress();
    }
    timer = setTimeout(guideRetry, 620);
  }

  function answer(letter) {
    if (!heard || !active.has(letter)) return;
    const button = buttons.get(letter);
    if (phase === 'copy' || phase === 'repair') {
      if (letter !== target) {
        if (phase === 'copy') showMiss(button, false);
        return;
      }
      button.classList.remove('hint');
      phase = 'transition';
      timer = setTimeout(() => prompt('find', target), 380);
      return;
    }
    if (phase !== 'find') return;
    // Hard c and k represent the same isolated sound. Either is a correct choice.
    const sharedSound = settings.kind === 'sound' && 'ck'.includes(target) && 'ck'.includes(letter);
    if (letter !== target && !sharedSound) {
      showMiss(button, true);
      return;
    }
    phase = 'transition';
    active.delete(letter);
    cleared.push(letter);
    button.classList.add('shoot');
    button.disabled = true;
    updateProgress();
    $('sky-status').textContent = 'You found it!';
    timer = setTimeout(() => {
      button.classList.remove('shoot');
      button.classList.add('collected');
      if (active.size) prompt('find');
      else {
        phase = 'won';
        $('replay').hidden = true;
        $('finish').hidden = false;
        $('again').focus();
        $('sky-status').textContent = 'You cleared the sky!';
      }
    }, 680);
  }

  function toggleSettings(open) {
    stop();
    $('settings').hidden = !open;
    $('field').hidden = open;
    $('options').setAttribute('aria-expanded', String(open));
    $('replay').hidden = open || phase === 'ready' || phase === 'won';
    if (open) {
      for (const [key,value] of Object.entries(settings)) {
        [...document.getElementsByName(key)].find(input => input.value === value).checked = true;
      }
      $('settings').querySelector('input:checked').focus();
    } else if (phase !== 'ready' && phase !== 'won') {
      // Finish a pending shooting animation before resuming its board.
      for (const letter of cleared) {
        buttons.get(letter).classList.remove('shoot');
        buttons.get(letter).classList.add('collected');
      }
      if (active.size && phase === 'transition') prompt('find');
      else if (phase === 'burst') guideRetry();
      else if (active.size) playPrompt();
      else {
        phase = 'won';
        $('finish').hidden = false;
        $('replay').hidden = true;
      }
    }
  }

  $('play').onclick = $('again').onclick = start;
  $('replay').onclick = () => { if (['model','copy','find','repair'].includes(phase)) playPrompt(); };
  $('options').onclick = () => toggleSettings($('settings').hidden);
  $('apply').onclick = () => {
    for (const key of Object.keys(settings)) settings[key] = document.querySelector('input[name="'+key+'"]:checked').value;
    try { localStorage.setItem('alphabet-stars-settings', JSON.stringify(settings)); } catch {}
    phase = 'ready';
    toggleSettings(false);
    start();
  };
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', event => {
    if (event.persisted && $('settings').hidden && !['ready','won'].includes(phase)) toggleSettings(false);
  });
  updateProgress();
})();
