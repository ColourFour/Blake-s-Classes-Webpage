/* Picture-first child surface. Curriculum and saved progress remain in reading.js. */
'use strict';
const pictureScenes=['🌷','🧺','🌈'];
const pictureSay=(en,zh)=>say(tr(en,zh),state.ui==='zh'?'zh-CN':'en-US');
function pictureButtons(root){root.querySelectorAll('button').forEach(b=>{const label=b.textContent.trim();if(!label||b.dataset.pictureButton)return;b.dataset.pictureButton='1';b.setAttribute('aria-label',label);b.title=label;let icon='➜';if(/Listen|听一听/.test(label))icon='🔊';else if(/Show me|Help me|帮帮我|帮我拼/.test(label))icon='🤝';else if(/Pinyin|拼音/.test(label))icon='拼';else if(/drawing studio|画画屋/.test(label))icon='🎨';else if(/Save & rest|保存并休息/.test(label))icon='🏠';else if(/garden|花园/.test(label))icon='🌷';else if(/Grown-up|家长参考/.test(label))icon='👨‍👧';else if(/Keep practicing|还想一起练/.test(label))icon='👨‍👧';else if(/Feeling comfortable|读得更熟悉/.test(label))icon='⭐';else if(/Back to chapters|返回章节/.test(label))icon='🗺️';b.textContent=icon;b.classList.add('picture-action');});}
function pictureHome(){stopAudio();['learn','garden','draw','storyView'].forEach(id=>$(id).hidden=true);$('pictureHome').hidden=false;document.body.classList.add('picture-front');$('homeButton').focus();}
const pictureBaseSwitch=switchTab;
switchTab=function(name){$('pictureHome').hidden=true;document.body.classList.remove('picture-front');pictureBaseSwitch(name);};
const pictureBaseDrawStory=drawStory;
drawStory=function(){pictureBaseDrawStory();$('continueStory').setAttribute('aria-label',tr('Continue this story','继续这个故事'));$('continueStory').textContent='▶';$('chapterList').querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-label',tr('Chapter ','第 ')+(i+1)+(state.ui==='zh'?' 章':''));b.innerHTML='<span class="stone-piece">'+(state.chapters[currentStory.id+'-'+i]?'⭐':StoryArcade.catalog[currentStory.id].pieces[i])+'</span><span class="stone-number">'+(i+1)+'</span>';});};
const pictureBaseRender=render;
render=function(){pictureBaseRender();$('lessonList').querySelectorAll('button').forEach((b,i)=>{const story=CURRICULUM[state.track][i];b.setAttribute('aria-label',loc(story.title));b.innerHTML='<span class="story-picture">'+pictureScenes[i]+'</span><span class="story-number">'+(i+1)+'</span><span class="story-dots" aria-hidden="true">'+story.chapters.map((_,j)=>state.chapters[story.id+'-'+j]?'●':'○').join(' ')+'</span><span class="story-go" aria-hidden="true">▶</span>';});};
const pictureBaseShowStep=showStep;
showStep=function(){pictureBaseShowStep();const s=session,st=s.steps[s.step],zh=s.story.id.startsWith('zh');
if(st.type==='welcome'){$('lessonBody').replaceChildren();const art=document.createElement('div');art.className='lesson-friend '+(zh?'friend-panda':'friend-bunny');art.setAttribute('role','img');art.setAttribute('aria-label',zh?'Panda waving beside a picture book':'Bunny waving beside a picture book');$('lessonBody').append(art);$('lessonDirections').onclick=()=>pictureSay("Hi! I'm Bunny. Let's play with letters. Tap the arrow!",'你好，我是熊猫。一起玩汉字吧！点箭头开始。');}
else if(st.type==='oral'&&s.story.id==='en-1'){const pictures={sun:'☀️',apple:'🍎',tap:'🚰',pig:'🐷',in:'📦',net:'🥅',map:'🗺️',dog:'🐶',go:'🚦',on:'📦',cat:'🐱',kit:'🧰',egg:'🥚',up:'⬆️',red:'🔴',hat:'🎩',bat:'🦇',fan:'🪭',leg:'🦵',jet:'✈️',van:'🚐',wet:'💦',yes:'👍',zip:'🤐',fox:'🦊',queen:'👑'};const l=alphabet.find(x=>x.symbol===s.story.chapters[s.index].items[0].text);const p=document.createElement('div');p.className='oral-picture';p.textContent=pictures[l.word]||'🗣️';$('lessonBody').prepend(p);}
pictureButtons($('lessonActions'));$('lessonDirections').textContent='🔊';$('lessonDirections').setAttribute('aria-label',tr('Hear what to do','听操作说明'));$('previousStep').textContent='←';$('previousStep').setAttribute('aria-label',tr('Previous activity','上一个活动'));$('pauseLesson').textContent='🏠';$('pauseLesson').setAttribute('aria-label',tr('Save and go home','保存并回家'));$('lessonDirections').onclick();$('lessonDialog').scrollTop=0;
};
// Newly added Next buttons and checkpoints also use pictures; this is presentation only.
const pictureObserver=new MutationObserver(()=>pictureButtons($('lessonActions')));pictureObserver.observe($('lessonActions'),{childList:true});
const pictureBaseFinish=finish;finish=function(note){pictureBaseFinish(note);pictureButtons($('lessonActions'));pictureSay('You found a piece!','找到一块拼图啦！');};
$('pauseLesson').onclick=()=>{closeLesson();pictureHome();};
$('homeButton').onclick=pictureHome;
function enterPictureWorld(track){state.track=track;state.ui=track;save();render();$('start').onclick();}
$('bunnyStart').onclick=()=>enterPictureWorld('en');$('pandaStart').onclick=()=>enterPictureWorld('zh');
// Keep language-specific sentences on matching voices when a parent replays the welcome.
$('welcomeSound').onclick=()=>pictureSay('Tap the shooting star to play with letters. Tap Bunny for English or Panda for Chinese.','点流星玩英文字母游戏，点兔子学英语，点熊猫学汉字。');
labels.tabLearn=['🗺️','🗺️'];labels.tabGarden=['🌷','🌷'];labels.tabDraw=['🎨','🎨'];labels.parentOpen=['⚙️','⚙️'];labels.backStories=['←','←'];labels.returnLesson=['↩️','↩️'];labels.undo=['↶','↶'];labels.clear=['🧽','🧽'];labels.saveDrawing=['⬇️','⬇️'];
for(const [id,en,zh] of [['tabLearn','Story map','故事地图'],['tabGarden','My garden','我的花园'],['tabDraw','Draw a picture','画一幅画'],['parentOpen','Grown-up settings and curriculum','家长设置和课程']])$(id).setAttribute('aria-label',tr(en,zh));
$('tabLearn').onclick=()=>{switchTab('learn');pictureSay('Pick a picture for your story. Start with number one.','选一幅画，打开故事。从一开始。');};
$('tabGarden').onclick=()=>{switchTab('garden');pictureSay('Choose a treasure. Tap a square to plant it.','选一个宝物，点方格种下去。');};
$('tabDraw').onclick=()=>{switchTab('draw');pictureSay('Draw your own picture. The down arrow saves it.','画自己的画。点向下的箭头保存。');};
$('backStories').onclick=()=>switchTab('learn');
render();pictureHome();
