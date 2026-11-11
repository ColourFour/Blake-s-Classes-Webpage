/* Human models for reading targets. Passage narration uses the device's connected speech. */
'use strict';
window.LessonRecordings = (() => {
  const items = stories => stories.flatMap(story => story.chapters.flatMap(chapter => chapter.items.map(item => item.text)));
  const english = new Set([...items(CURRICULUM.en.slice(1)), ...alphabet.map(letter => letter.word), 'a','the','is']);
  const compounds = ['你好','妈妈','爸爸','米饭','朋友','我们','读书','山水','大人','看见'];
  const mandarin = new Set([...items(CURRICULUM.zh), ...compounds]);
  const splitChinese = new RegExp(compounds.join('|') + '|.', 'gu');
  let audio, highlighted, ticket = 0;

  function pathFor(text, lang) {
    if (lang === 'zh-CN') {
      if (mandarin.has(text)) return 'assets/word-audio/zh/' + text + '.mp3';
    } else if (lang === 'en-US') {
      if (/^[A-Z]$/.test(text)) return 'assets/star-audio/name-us/' + text.toLowerCase() + '.mp3';
      if (english.has(text.toLowerCase())) return 'assets/word-audio/en/' + text.toLowerCase() + '.mp3';
    }
    return null;
  }

  function stop() {
    ++ticket;
    highlighted?.classList.remove('playing-word');
    highlighted = null;
    if (!audio) return;
    audio.onended = audio.onerror = null;
    audio.pause();
  }

  function play(text, lang, onError, wordButtons = []) {
    const words = Array.isArray(text) ? text : [text];
    const sources = words.map(word => pathFor(word, lang));
    if (!sources.length || sources.some(source => !source)) return false;
    const current = ++ticket;
    audio ??= new Audio();
    let i = 0;
    function failed() {
      if (current === ticket) { stop(); onError(); }
    }
    function next() {
      if (current !== ticket) return;
      if (i === sources.length) { stop(); return; }
      highlighted?.classList.remove('playing-word');
      highlighted = wordButtons[i];
      highlighted?.classList.add('playing-word');
      audio.src = sources[i++];
      audio.onended = next;
      audio.onerror = failed;
      audio.play().catch(failed);
    }
    next();
    return true;
  }

  function makeTappable(p, text, lang) {
    const tokens = lang === 'zh-CN' ? text.match(splitChinese) : text.match(/[A-Za-z]+|[^A-Za-z]+/g);
    const words = [];
    const buttons = [];
    const nodes = tokens.map(token => {
      const key = lang === 'en-US' ? token.toLowerCase() : token;
      if (!pathFor(key, lang)) return token;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'spoken-word';
      b.textContent = token;
      b.onclick = () => { stopAudio(); play(key, lang, recordingUnavailable, [b]); };
      words.push(key);
      buttons.push(b);
      return b;
    });
    p.replaceChildren(...nodes);
    return () => {
      stopAudio();
      play(words, lang, recordingUnavailable, buttons);
    };
  }
  return {play, stop, makeTappable};
})();
