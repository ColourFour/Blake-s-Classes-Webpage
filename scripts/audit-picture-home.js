// Reuse the curriculum test DOM to exercise the picture entry points and speech dispatch.
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');let harness=fs.readFileSync(path.join(__dirname,'audit-child-flow.js'),'utf8');harness=harness.slice(0,harness.indexOf('let checked=0;'));
harness=harness.replace("const sandbox={document,window:{}","document.body=new Element();const sandbox={MutationObserver:class{observe(){}},document,window:{}");
harness+='\nthis.test={sandbox,nodes,a};';const outer={require,__dirname,console};vm.createContext(outer);vm.runInContext(harness,outer);const {sandbox,nodes,a}=outer.test;
vm.runInContext(fs.readFileSync(path.join(root,'picture-home.js'),'utf8'),sandbox);
assert.equal(nodes.get('pictureHome').hidden,false);assert.equal(nodes.get('learn').hidden,true);
nodes.get('bunnyStart').onclick();assert.equal(a.get().story.id,'en-1');assert.equal(a.state.ui,'en');assert.equal(nodes.get('pictureHome').hidden,true);assert(nodes.get('lessonBody').children.some(x=>x.className==='lesson-friend friend-bunny'));assert(nodes.get('lessonActions').children.some(x=>x.textContent==='➜'));assert(!nodes.get('lessonBody').children.some(x=>/Read together/.test(x.textContent)));
nodes.get('pauseLesson').onclick();assert.equal(nodes.get('pictureHome').hidden,false);
assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'), /href="character-stars.html" id="pandaStart"/);sandbox.enterPictureWorld('zh');assert.equal(a.get().story.id,'zh-1');assert.equal(a.state.ui,'zh');assert(nodes.get('lessonBody').children.some(x=>x.className==='lesson-friend friend-panda'));
console.log('PASS: both picture entrances open the correct language, picture welcome, icon actions, and save-to-home.');
