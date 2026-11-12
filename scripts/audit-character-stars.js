const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const context=vm.createContext({});
for(const file of ['character-book.js','character-practice.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const {book,game}=vm.runInContext('({book:RabbitBook,game:CharacterPractice})',context);
const now=1000, memory={};
for(const stage of book.stages){
  const r=game.makeRound(stage,memory,now);
  const target=r.queue.shift();r.active=target;
  game.answer(r,stage,memory,false,now);assert.equal(memory[target].streak,0);
  const attempts=memory[target].attempts;game.copied(r,true);
  assert.equal(memory[target].attempts,attempts);assert(r.queue.indexOf(target)>=2);
  let n=0;
  while(r.queue.length){
    assert(++n<100);
    const key=r.active=r.queue.shift(), word=game.label(key);
    const opts=game.choices(key,stage,memory,r);
    assert(opts.includes(word)&&opts.length>=2&&opts.length<=12);
    if(word.length===1&&!key.includes('/'))assert(opts.every(c=>c===word||book.pinyin[c]!==book.pinyin[word]));
    for(const clip of book.pieces[word]||[word])assert(fs.statSync(path.join(root,'assets/word-audio/zh',clip+'.mp3')).size>1000);
    game.answer(r,stage,memory,true,now);
  }
  assert.equal(r.done.length,r.keys.length);assert.equal(new Set(r.done).size,r.done.length);
  game.resume(r,stage,memory,now+31*86400000);
  assert(r.queue.length>0);assert(r.queue.every(k=>!r.done.includes(k)));
}
assert.equal(book.stages.length,12);
console.log('Passed all character pools, recordings, independent checks, unscored corrections, delayed retries and returning reviews.');
