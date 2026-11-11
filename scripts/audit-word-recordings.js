const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
let player;
class TestAudio {
  constructor() { player = this; }
  play() { assert(fs.statSync(path.join(root, this.src)).size > 1000, this.src); return Promise.resolve(); }
  pause() {}
}
const env = {window:{}, Audio:TestAudio, document:{createElement:() => ({})}};
vm.createContext(env);
vm.runInContext(source('curriculum.js') + '\n' + source('reading.js').split('\n').find(line => line.startsWith('const alphabet=')) +
  '\n' + source('lesson-recordings.js') + '\nthis.curriculum=CURRICULUM;this.examples=alphabet;', env);
const recordings = env.window.LessonRecordings;
const fail = () => assert.fail('audio playback failed');
const play = (word, lang) => assert(recordings.play(word, lang, fail), word);

for (const track of ['en','zh']) {
  const lang = track === 'en' ? 'en-US' : 'zh-CN';
  for (const story of env.curriculum[track]) for (const chapter of story.chapters) {
    for (const item of chapter.items) play(story.id === 'en-1' ? item.text.toUpperCase() : item.text, lang);
    if (story.id === 'en-1') continue;
    const passage = {replaceChildren(...parts) { this.parts = parts; }};
    recordings.makeTappable(passage, chapter.text, lang);
    assert.equal(passage.parts.map(part => part.textContent || part).join(''), chapter.text);
    for (const part of passage.parts) {
      if (typeof part === 'string') assert(!/[a-z\u4e00-\u9fff]/i.test(part), 'Missing recording: '+part);
      else play(track === 'en' ? part.textContent.toLowerCase() : part.textContent, lang);
    }
  }
}
for (const letter of env.examples) play(letter.word, 'en-US');
play('A','en-US'); assert.equal(player.src,'assets/star-audio/name-us/a.mp3');
play('a','en-US'); assert.equal(player.src,'assets/word-audio/en/a.mp3');
play(['cat','sat'],'en-US');
const stale = player.onended;
play('米饭','zh-CN'); stale();
assert.equal(player.src,'assets/word-audio/zh/米饭.mp3');
recordings.stop(); assert.equal(player.onended,null);
console.log('Passed all curriculum word, character, alphabet and decodable passage recordings, including interrupted playback.');
