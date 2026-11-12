/* Each row introduces four characters found in the Simplified Chinese reading guide.
   The extra picture and phrase tasks follow the character checks in each chapter. */
'use strict';
const RabbitBook = (() => {
  const groups = ['我你爱猜','兔大小子','有多这手','开上下来','高跳长到','山树想天','月亮那里','回在他再','一的说不'];
  const pinyin = Object.fromEntries(groups.join('').split('').map((c, i) => [c,
    'wǒ nǐ ài cāi tù dà xiǎo zǐ yǒu duō zhè shǒu kāi shàng xià lái gāo tiào cháng dào shān shù xiǎng tiān yuè liàng nà lǐ huí zài tā zài yī de shuō bù'.split(' ')[i]]));
  const pictures = {爱:'❤️',兔:'🐇',手:'🖐️',上:'⬆️',下:'⬇️',树:'🌳',山:'⛰️',月:'🌙'};
  const words = [
    ['兔子','大小','小兔子','大兔子','我爱你'],
    ['跳高','天上','下来','上来','有多高'],
    ['月亮','回来','那里','这里','到月亮那里']
  ];
  const pieces = {'小兔子':['小','兔子'],'大兔子':['大','兔子'],'我爱你':['我','爱','你'],'有多高':['有','多','高'],'到月亮那里':['到','月亮','那里']};
  const stages = [];
  for (let i = 0; i < groups.length; i++) {
    const chapter = Math.floor(i / 3);
    const pool = groups.slice(0,i+1).join('');
    stages.push({chapter, pool, fresh:groups[i], core:[...groups[i]]});
    if (i % 3 === 2) {
      const chapterChars = groups.slice(i-2,i+1).join('');
      const images = [...chapterChars].filter(c => pictures[c]).map(c => 'pic/'+c);
      stages.push({chapter, pool, master:true, core:[...chapterChars, ...images, ...words[chapter].map(w => 'word/'+w)]});
    }
  }
  return {id:'guess-how-much-i-love-you', stages, pinyin, pictures, words, pieces};
})();
