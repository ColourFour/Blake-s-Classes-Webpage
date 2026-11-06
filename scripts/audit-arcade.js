/* Deterministic engine tests: test-only state access is injected into the VM copy. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const nodes=new Map(),storage=new Map();let scheduled=0,canceled=0;
const context=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{})});
function node(){return {classList:{add(){},remove(){}},checked:true,hidden:false,disabled:false,textContent:'',children:[],events:{},setAttribute(){},addEventListener(k,f){this.events[k]=f},closest(){return this},getContext(){return context},showModal(){this.open=true},close(){this.open=false;this.events.close?.()},focus(){},replaceChildren(){this.children=[]},append(n){this.children.push(n)}};}
const document={getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},createElement:node,addEventListener(){}};
const sandbox={window:{addEventListener(){}},document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},performance:{now:()=>0},requestAnimationFrame:()=>++scheduled,cancelAnimationFrame:()=>canceled++};
let code=fs.readFileSync(path.join(__dirname,'../arcade.js'),'utf8').replace('return {catalog,open};','return {catalog,open,start,pause,action,update,flip,stop,get:()=>g};');vm.runInNewContext(code,sandbox);const a=sandbox.window.StoryArcade;
assert.equal(Object.keys(a.catalog).length,6);for(const c of Object.values(a.catalog)){assert.equal(c.pieces.length,10);assert.equal(c.name.length,2);}
for(const count of [0,9])assert.equal(a.open('en-1',()=>count===10,'en'),false);assert.equal(a.open('missing',()=>true,'en'),false);
function begin(id){assert.equal(a.open(id,()=>true,'en'),true);a.start();assert.equal(a.get().mode,'playing');return a.get();}
let g=begin('en-1');a.action();assert.ok(g.vy<0);a.pause();assert.equal(g.mode,'paused');a.pause();assert.equal(g.mode,'playing');g.y=390;a.update(.01);assert.equal(g.mode,'playing');assert.equal(g.lives,4);g.lives=1;g.y=390;a.update(.01);assert.equal(g.mode,'ended');a.start();assert.equal(a.get().mode,'playing');
g=begin('en-1');g.objects=[{x:119,gap:210,passed:false}];a.update(0);assert.equal(g.score,1);
g=begin('en-1');g.score=9;g.objects=[{x:119,gap:210,passed:false}];a.update(0);assert.equal(g.mode,'won');
g=begin('en-2');g.spawn=99;g.objects=Array.from({length:20},()=>({x:g.player,y:350}));a.update(0);assert.equal(g.mode,'won');assert.equal(g.score,20);
g=begin('en-2');g.spawn=99;g.lives=1;g.objects=[{x:0,y:426}];a.update(0);assert.equal(g.mode,'ended');
g=begin('en-3');a.action();assert.ok(g.vy<0);g.vy=0;g.y=307;g.objects=[{x:100,w:40,h:40,passed:false}];a.update(0);assert.equal(g.mode,'ended');
g=begin('en-3');g.spawn=99;g.score=19;g.objects=[{x:0,w:40,h:40,passed:false}];a.update(0);assert.equal(g.mode,'won');
g=begin('zh-2');for(let n=0;n<10;n++){g.moving.x=g.blocks.at(-1).x;a.action();}assert.equal(g.mode,'won');assert.equal(g.blocks.length,11);
g=begin('zh-2');g.moving.x=590;a.action();assert.equal(g.mode,'ended');
g=begin('zh-3');assert.equal(g.bricks.length,28);g.bricks.forEach(b=>b.hit=true);const brick=g.bricks[0];brick.hit=false;g.score=27;g.ball.x=brick.x+10;g.ball.y=brick.y+10;a.update(0);assert.equal(g.mode,'won');
g=begin('zh-3');g.lives=1;g.ball.y=440;a.update(0);assert.equal(g.mode,'ended');
g=begin('zh-1');const different=g.cards.findIndex(c=>c.face!==g.cards[0].face);a.flip(0);a.flip(different);assert.ok(g.wait>0);a.flip(3);assert.equal(g.turned.length,2);a.update(2);assert.equal(g.turned.length,0);for(const face of new Set(g.cards.map(c=>c.face))){g.cards.forEach((c,i)=>{if(c.face===face)a.flip(i)});}assert.equal(g.mode,'won');assert.equal(g.score,6);
let permission=true;a.open('en-1',()=>permission,'zh');permission=false;a.start();assert.equal(a.get().mode,'closed');begin('en-2');nodes.get('arcadeDialog').close();assert.equal(a.get().mode,'closed');assert.ok(canceled>0);assert.ok(storage.has('reading-garden-arcade-v1'));
console.log('PASS: six game catalogs, unlock guards, flight/catch/run/stack/bounce/memory outcomes, pause/restart/close, and local scores.');
