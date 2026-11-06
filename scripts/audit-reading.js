const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'reading.js'),'utf8'),curriculum=fs.readFileSync(path.join(root,'curriculum.js'),'utf8');
const C=vm.runInNewContext(curriculum+';CURRICULUM');
for(const [lang,stories] of Object.entries(C)){
 let known=new Set();assert.equal(stories.length,3);
 for(const s of stories){assert.equal(s.chapters.length,10);const targets=s.chapters.slice(0,9).flatMap(c=>c.items.map(x=>x.text));assert.equal(new Set(targets).size,targets.length);
 if(s.id==='en-1')assert.equal([...targets].sort().join(''),'abcdefghijklmnopqrstuvwxyz');
 else if(lang==='en'){assert.equal(targets.length,54);assert(targets.every(w=>s.id==='en-2'?w.length>=2&&w.length<=3:w.length>=4&&w.length<=5));}else assert.equal(targets.length,27);
 s.helpers.forEach(x=>known.add(x));s.chapters.forEach((c,i)=>{c.items.forEach(x=>known.add(x.text));if(s.id==='en-1')return;const words=lang==='en'?c.text.toLowerCase().match(/[a-z]+/g):c.text.match(/[\u4e00-\u9fff]/g);const missing=[...new Set(words)].filter(x=>!known.has(x));assert.equal(missing.length,0,s.id+' chapter '+(i+1)+' untaught text: '+missing.join(','));assert(c.question[0]&&c.answer[0]&&c.draw[0]);});
 if(s.id==='en-1')known=new Set();console.log(s.id+': '+targets.length+' targets; all chapter passages checked');}}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g))if(!/^(https?:|#)/.test(m[1]))assert(fs.existsSync(path.join(root,m[1])),m[1]);
for(const t of [html,source]){assert(!/\bminutes?\b|\bhours?\b|\bweeks?\b|分钟|小时/i.test(t));assert(!/\bcolour\b|\bpractise\b|\brecognise\b/i.test(t));}
const old={ui:'zh',track:'en',done:['en-0','zh-2'],board:Array(24).fill('🌷'),visits:{'en-0':{count:3,help:['s']}}};
const stateSource=source.slice(0,source.indexOf('const tr='));
const migrated=vm.runInNewContext(stateSource+';state',{localStorage:{getItem:()=>JSON.stringify(old)}});
assert.deepEqual(JSON.parse(JSON.stringify(migrated.done)),old.done);assert.deepEqual(JSON.parse(JSON.stringify(migrated.board)),old.board);assert.equal(Object.keys(migrated.chapters).length,0);
const unavailable=vm.runInNewContext(stateSource+';persistent',{localStorage:{getItem:()=>{throw Error('Unavailable');}}});assert.equal(unavailable,false);
const stepHelpers=source.slice(source.indexOf('function priorItems('),source.indexOf('const stageNames='));
const result=vm.runInNewContext(curriculum+'\n'+stepHelpers+';Object.values(CURRICULUM).flat().map(s=>s.chapters.map((c,i)=>stepsFor(s,i)))');
for(const storySteps of result)for(const steps of storySteps){assert(steps.length>=18);for(const stage of [0,1,3,4,5,6,7])assert(steps.some(s=>s.stage===stage));assert.equal(steps.at(-1).type,'finish');}
console.log('Passed: content, assets, copy, old progress, unavailable storage, and all 60 activity sequences.');
