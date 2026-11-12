'use strict';
const CharacterPractice = (() => {
  const day = 86400000;
  const shuffled = values => {
    const result = [...values];
    for (let i=result.length-1; i>0; i--) {
      const j=Math.floor(Math.random()*(i+1));
      [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
  };
  const label = key => key.split('/').pop();
  function reviews(pool, memory, now) {
    return shuffled(pool).sort((a,b) => (memory[a]?.due || 0) - (memory[b]?.due || 0));
  }
  function makeRound(stage, memory, now) {
    const extras = reviews([...stage.pool].filter(c => !stage.core.includes(c)),memory,now)
      .slice(0,stage.master ? 3 : 6);
    const chars = stage.core.filter(k=>!k.includes('/'));
    const checks = shuffled([...chars,...extras]);
    // A chapter finishes with pictures, words and finally a short phrase.
    const keys = [...checks,...stage.core.filter(k=>k.includes('/'))];
    return {queue:keys.slice(), keys, done:[], seen:{}, hits:{}, active:null, copy:false, tick:0, lastReview:now};
  }
  function resume(round, stage, memory, now) {
    if (now-round.lastReview < day/2) return;
    const due=reviews(stage.pool,memory,now).filter(k=>memory[k]?.due<=now && !round.queue.includes(k) && k!==round.active).slice(0,4);
    for (const k of due) {
      if (!round.keys.includes(k)) round.keys.push(k);
      round.done=round.done.filter(c=>c!==k);
      round.hits[k]=0;
    }
    round.queue.unshift(...due);
    round.lastReview=now;
  }
  function schedule(round, key, gap) {
    // Keep the word-reading finale behind character practice.
    let end=round.queue.length;
    if (!key.includes('/')) {
      const firstOther=round.queue.findIndex(k=>k.includes('/'));
      if (firstOther>=0) end=firstOther;
    }
    round.queue.splice(Math.min(gap,end),0,key);
  }
  function record(memory, key, right, now) {
    const m=memory[key] ||= {attempts:0, correct:0, streak:0, due:0};
    m.attempts++;
    m.correct+=Number(right);
    m.streak=right?m.streak+1:0;
    const gaps=[0,1,2,4,7,14,30];
    m.due=now+(right?gaps[Math.min(m.streak,6)]*day:0);
  }
  function answer(round, stage, memory, right, now) {
    const key=round.active;
    if (key.startsWith('review/')) {
      record(memory,label(key),right,now);
      if (right) round.active=null;
      else round.copy=true;
      return;
    }
    record(memory,key,right,now);
    round.tick++;
    if (!right) {
      round.hits[key]=0;
      const restored=round.done.pop();
      if (restored) {round.hits[restored]=0;schedule(round,restored,1);}
      round.copy=true;
      return;
    }
    round.hits[key]=(round.hits[key]||0)+1;
    const required=stage.fresh?.includes(key) ? 2 : 1;
    if (round.hits[key]>=required) round.done.push(key);
    else schedule(round,key,Math.min(6,2+memory[key].streak));
    round.active=null;
  }
  function copied(round, correction) {
    const key=round.active;
    round.seen[key]=true;
    round.copy=false;
    if (!key.startsWith('review/')) {
      schedule(round,key,correction?3:2);
      if (correction) {
        const before=round.queue.indexOf(key);
        const familiar=shuffled(Object.keys(round.seen).filter(c=>c.length===1 && c!==label(key) && !round.queue.slice(0,before).includes(c)));
        round.queue.splice(before,0,...familiar.slice(0,Math.max(0,2-before)).map(c=>'review/'+c));
      }
    }
    round.active=null;
  }
  function choices(key, stage, memory, round) {
    const target=label(key);
    let pool;
    if (key.startsWith('pic/')) pool=Object.keys(RabbitBook.pictures).filter(c=>stage.pool.includes(c));
    else if (key.startsWith('word/')) pool=RabbitBook.words.slice(0,stage.chapter+1).flat();
    else pool=[...stage.pool].filter(c=>RabbitBook.pinyin[c]!==RabbitBook.pinyin[target]);
    const record=memory[key];
    const struggling=record && (record.streak===0 || record.correct/record.attempts<0.65);
    const count=key.includes('/') ? 3 : struggling ? 3 : stage.master ? 12 : 8;
    // Favor stars still to be collected. Keep alternatives even for the very last star.
    const other=shuffled(pool.filter(c=>c!==target));
    other.sort((a,b)=>Number(round.done.includes(a))-Number(round.done.includes(b)));
    const available=other.filter(c=>!round.done.includes(c)).length;
    const alternatives=key.includes('/')?count-1:Math.min(count-1,Math.max(2,available));
    return shuffled([target,...other.slice(0,alternatives)]);
  }
  return {makeRound,resume,record,answer,copied,choices,label};
})();
