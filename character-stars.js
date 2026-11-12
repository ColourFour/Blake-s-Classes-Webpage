'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const game=CharacterPractice, book=RabbitBook;
  const storage='garden-character-library-v1';
  let library;
  try {library=JSON.parse(localStorage.getItem(storage));} catch {}
  library ||= {};
  const memory=library.memory ||= {};
  const books=library.books ||= {};
  const progress=books[book.id] ||= {unlocked:0,reading:0,rounds:{}};
  function save(){try {localStorage.setItem(storage,JSON.stringify(library));} catch {$('status').textContent='此浏览器无法保存进度。';}}
  let index, stage, round, timer, token=0, audio=new Audio(), returnTo='';
  const label=game.label;
  function stop(){token++;audio.onended=audio.onerror=null;audio.pause();clearTimeout(timer);}
  function play(key,ready){
    const sequence=book.pieces[key]||[key], ticket=++token;
    let i=0;
    function failed(){if(ticket===token){$('listen').classList.add('needs-tap');$('status').textContent='请点喇叭再听一次。';}}
    function next(){
      if(ticket!==token)return;
      if(i===sequence.length){if(ready)ready();return;}
      audio.src='assets/word-audio/zh/'+sequence[i++]+'.mp3';
      audio.onended=next;audio.onerror=failed;
      audio.play().then(()=>{if(ticket===token)$('listen').classList.remove('needs-tap');}).catch(failed);
    }
    next();
  }
  function button(text,name,fn,cls=''){
    const b=document.createElement('button');b.textContent=text;b.className=cls;b.setAttribute('aria-label',name);b.onclick=fn;return b;
  }
  function go(route,replace=false){history[replace?'replaceState':'pushState']({},'',route?'#'+route:location.pathname);render();}
  function show(id){
    for(const k of ['map','round','won','book','guide']) $(k).hidden=k!==id;
    $('meter').hidden=id!=='round';
    $('parents').hidden=id==='guide';
    $('back').href=id==='map'?'index.html':'#';
    $('back').textContent=id==='map'?'🏠':'←';
    $('back').setAttribute('aria-label',id==='map'?'回花园':'返回');
    $('back').onclick=id==='map'?null:e=>{e.preventDefault();go(id==='guide'?returnTo:'');};
  }
  function map(){
    show('map');const path=$('path');path.replaceChildren();
    function node(i,glyph,title){
      const b=button(glyph,title,()=>go(i===12?'book':'level/'+(i+1)),'waypoint');
      b.disabled=i>progress.unlocked;
      if(i<progress.unlocked||i===12&&progress.reading===3)b.classList.add('past');
      else if(i===progress.unlocked){b.classList.add('next');b.setAttribute('aria-current','step');}
      return b;
    }
    for(let chapter=0;chapter<3;chapter++){
      const row=document.createElement('div');row.className='trail';row.dataset.icon=['🌱','🌳','🌙'][chapter];
      for(let j=0;j<4;j++){
        const num=chapter*3+j+1;
        row.append(node(chapter*4+j,j===3?'♛':String(num),j===3?'第'+(chapter+1)+'章综合挑战':'第'+num+'关'));
      }
      path.append(row);
    }
    const final=node(12,'📖','一起读纸质书');final.id='bookNode';path.append(final);
    $('go').onclick=()=>go(progress.unlocked===12?'book':'level/'+(progress.unlocked+1));
  }
  function ask(){
    if(!round.active)round.active=round.queue.shift();
    if(!round.active){
      progress.unlocked=Math.max(progress.unlocked,index+1);
      delete progress.rounds[index];save();go('star/'+(index+1),true);return;
    }
    save();const key=round.active, target=label(key), picture=key.startsWith('pic/');
    const demo=!round.seen[key] && (stage.fresh?.includes(key)&&!memory[key]?.correct || (picture||key.startsWith('word/'))&&!Object.keys(round.seen).some(k=>k.split('/')[0]===key.split('/')[0]));
    const guided=round.copy||demo;
    const choices=$('choices'), cue=$('cue'), meter=$('meter').querySelector('progress');
    meter.max=round.keys.length;meter.value=round.done.length;
    cue.replaceChildren();choices.replaceChildren();
    const sample=document.createElement('span');
    sample.textContent=guided||picture?target:'🔊';if(guided||picture)sample.className='sample';cue.append(sample);
    if(guided&&book.pinyin[target]){const p=document.createElement('small');p.textContent=book.pinyin[target];cue.append(p);}
    const options=game.choices(key,stage,memory,round);
    choices.classList.toggle('words',key.startsWith('word/'));
    choices.style.setProperty('--columns',Math.min(options.length,4));
    let locked=false,heard=picture&&!guided;
    const listen=()=>{
      if(picture&&!guided)return;
      play(target,()=>{heard=true;});
    };
    $('listen').hidden=picture&&!guided;$('listen').onclick=listen;
    for(const item of options){
      const correct=item===target;
      const b=button('',picture?({兔:'兔子',爱:'爱心',手:'手掌',树:'树',山:'山',月:'月亮',上:'向上',下:'向下'})[item]:item,()=>{
        if(locked)return;
        if(!heard){$('listen').classList.add('needs-tap');return;}
        if(guided&&!correct)return;
        locked=true;stop();const correction=round.copy;
        if(guided){game.copied(round,correction);b.classList.remove('hint');}
        else game.answer(round,stage,memory,correct,Date.now());
        if(correct)round.seen[key]=true;
        save();b.classList.add(correct?'shoot':'miss');
        if(!correct){const answer=[...choices.children].find(el=>el.dataset.value===target);answer.classList.add('hint');}
        $('status').textContent=correct?'找到了！':'再看一看发光的星星。';
        timer=setTimeout(ask,correct?610:650);
      },'letter-star'+(key.startsWith('word/')?' word-star':'')+(guided&&correct?' hint':''));
      b.dataset.value=item;const span=document.createElement('span');span.textContent=picture?book.pictures[item]:item;b.append(span);choices.append(b);
    }
    if(!picture||guided)listen();
  }
  function reading(){
    show('book');const n=progress.reading;
    $('bookSteps').textContent='★'.repeat(n)+'☆'.repeat(3-n);
    $('readTogether').open=false;
    const tasks=['Read the opening together. Stop after the rabbits stretch their arms.','Read the middle together, through their jumps and the faraway hills.','Read the bedtime ending together, all the way to the moon and back.'];
    $('readingTask').textContent=tasks[n]||'You finished the book together. You can open it and read it again anytime.';
    $('confirm').hidden=n===3;$('confirm').textContent='✓ We read this part together';
    $('confirm').onclick=()=>{if(!$('readTogether').open||n!==progress.reading||n>=3)return;progress.reading++;save();reading();};
    const help=$('bookHelp');help.replaceChildren();
    for(const w of [['兔子','手','我爱你'],['跳高','山','有多高'],['月亮','那里','回来']][Math.min(n,2)])help.append(button('🔊 '+w,'听'+w,()=>play(w)));
  }
  function render(){
    stop();$('listen').classList.remove('needs-tap');
    const route=location.hash.slice(1);
    if(route==='guide'){show('guide');return;}
    if(route==='book'&&progress.unlocked===12){reading();return;}
    const match=/^(level|star)\/(\d+)$/.exec(route);
    if(!match){map();return;}
    index=Number(match[2])-1;stage=book.stages[index];
    if(!stage||index>progress.unlocked){map();return;}
    if(match[1]==='star'){
      if(index>=progress.unlocked){map();return;}
      show('won');$('earned').textContent=['🌱','🌳','🌙'][stage.chapter]+(stage.master?' 👑':' ⭐');
      $('advance').onclick=()=>go(index===11?'book':'level/'+(index+2),true);return;
    }
    show('round');round=progress.rounds[index] ||= game.makeRound(stage,memory,Date.now());
    game.resume(round,stage,memory,Date.now());ask();
  }
  $('parents').onclick=()=>{returnTo=location.hash.slice(1);go('guide');};
  window.addEventListener('popstate',render);window.addEventListener('pagehide',stop);
  window.addEventListener('pageshow',e=>{if(e.persisted)render();});
  render();
})();
