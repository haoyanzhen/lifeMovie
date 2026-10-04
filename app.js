const pages = [
  {time:'姜淑梅的人生',text:'从童年，到八十岁。',image:'desk',cover:true,mobile:'67% 50%',alt:'银发老人在窗边写字'},
  {time:'小时候',text:'她没能继续上学。',image:'childhood',mobile:'50% 50%',alt:'穿红褂的小女孩站在门槛旁，望向院外'},
  {time:'年轻时',text:'后来，她也有了孩子。',image:'mother',mobile:'52% 50%',alt:'年轻的母亲抱着孩子，握住他的小手'},
  {time:'饥饿的年月',text:'嫂子把留给婴儿的白面，<br>煮成汤，给她和孩子吃。',image:'soup',mobile:'52% 50%',alt:'一双手把一碗热汤递给带着孩子的年轻母亲'},
  {time:'初到黑龙江',text:'三个女人去雪地割芦苇。<br>走着走着，她们唱起了歌。',image:'snow',mobile:'50% 50%',alt:'三个女人在雪地里背着芦苇同行，脚印一直延伸到远处'},
  {time:'1985 年',text:'女儿考上大学。<br>她有了人生第一张照片。',image:'family',mobile:'51% 48%',alt:'母女在院子里并肩站着，准备留下一张照片'},
  {time:'1996 年',text:'孩子们都已成家。<br>丈夫却突然去世了。',image:'empty',mobile:'60% 50%',alt:'旧桌旁留下两把空椅子，衣服仍搭在椅背上'},
  {time:'六十岁',text:'这回，女儿教她认字。',image:'teaching',mobile:'52% 50%',alt:'长大的女儿坐在母亲身旁，陪她握笔认字'},
  {time:'一个多月',text:'她一字一字地问，<br>写完了寄给女儿的第一封信。',image:'desk',style:'letter',alt:'苍老的手拿着笔，一点点写满纸页'},
  {time:'十五年后',text:'她开始写自己的一生。',image:'desk',position:'50% 55%',mobile:'70% 50%',alt:'老人独自坐在桌边，开始写下自己的经历'},
  {time:'纸上',text:'她写父母，写挨饿，写离别。',image:'desk',action:'memory',alt:'老人写字的桌边，那碗汤与那场雪重新成为记忆中的画面',revealText:'那些人，又在她的文字里活了一次。'},
  {time:'八十岁',text:'她开始画画。<br>也画小时候，穿红褂的自己。',image:'return',action:'color',position:'50% 60%',mobile:'50% 55%',alt:'老人的手在纸上画出穿红褂、梳小辫子的女孩'},
  {time:'后来',text:'「等我老了……」<br>她还是这样说。',image:'return',action:'echo',position:'50% 60%',mobile:'50% 55%',alt:'画纸上是童年的自己，握笔的是八十岁老人的手'}
];
const $ = id => document.getElementById(id);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const dialog = $('source-dialog');
const opened = new Set();
let current = 0, renderVersion = 0;

pages.forEach((page,index)=>{
  const button=document.createElement('button');
  button.className='chapter-button';
  button.setAttribute('aria-label',`第 ${index+1} 页：${page.time}`);
  button.title=page.time;
  button.addEventListener('click',()=>go(index));
  $('chapters').append(button);
});

function renderAction(){
  const page=pages[current];
  const active=opened.has(current);
  $('memory-layer').hidden=!(page.action==='memory'&&active);
  $('echo-layer').hidden=!(page.action==='echo'&&active);
  $('scene-image').classList.toggle('muted',page.action==='color'&&!active);
  const button=$('scene-action');
  button.hidden=!page.action;
  button.setAttribute('aria-pressed',String(active));
  button.textContent=page.action==='memory'?(active?'合上':'翻开'):page.action==='color'?(active?'收笔':'落笔'):(active?'此刻':'从前');
  button.setAttribute('aria-label',page.action==='memory'?(active?'合上回忆':'翻开回忆'):page.action==='color'?(active?'收笔，淡去颜色':'落笔，让画面显色'):(active?'回到晚年画面':'看看童年的她'));
  $('story-text').innerHTML=page.action==='memory'&&active?page.revealText:page.text;
}

async function render(animate=true){
  const version=++renderVersion;
  const page=pages[current];
  const nextImage=new Image();
  nextImage.src=`assets/${page.image}.webp`;
  let imageFailed=false;
  try{await nextImage.decode();}catch{imageFailed=true;}
  if(version!==renderVersion)return;
  const incoming=$('scene-image'),outgoing=$('outgoing-image');
  outgoing.hidden=true;outgoing.classList.remove('fading');
  if(animate&&!motion.matches&&incoming.complete&&incoming.naturalWidth&&incoming.src!==nextImage.src){
    outgoing.src=incoming.src;
    outgoing.style.objectPosition=getComputedStyle(incoming).objectPosition;
    outgoing.style.filter=getComputedStyle(incoming).filter;
    outgoing.hidden=false;
    void outgoing.offsetWidth;
    outgoing.classList.add('fading');
  }
  incoming.src=nextImage.src;
  incoming.alt=`艺术重构：${page.alt}`;
  incoming.className=`scene-image ${page.style||''}`;
  incoming.style.animation='none';void incoming.offsetWidth;incoming.style.animation='';
  $('stage').style.setProperty('--position',page.position||'50% 50%');
  $('stage').style.setProperty('--mobile-position',page.mobile||page.position||'50% 50%');
  $('stage').classList.toggle('is-cover',Boolean(page.cover));
  $('cover-title').hidden=!page.cover;
  $('time-label').textContent=page.time;
  $('image-fallback').hidden=!imageFailed;
  $('page-number').textContent=`${String(current+1).padStart(2,'0')} / ${pages.length}`;
  $('previous').disabled=current===0;
  $('next').textContent=current===pages.length-1?'↶':'→';
  $('next').setAttribute('aria-label',current===pages.length-1?'重新开始':'下一页');
  document.querySelectorAll('.chapter-button').forEach((button,index)=>{
    if(index===current)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
  });
  renderAction();
  const narrative=document.querySelector('.narrative');
  narrative.classList.remove('reveal');
  if(animate&&!motion.matches){void narrative.offsetWidth;narrative.classList.add('reveal');}
  document.title=`${page.cover?'一生，又一生':page.time+' · 一生，又一生'} · 人生相片集`;
  // Prefetch only adjacent scenes, so the opening does not download the entire album.
  [current-1,current+1].filter(i=>i>=0&&i<pages.length).forEach(i=>{const img=new Image();img.src=`assets/${pages[i].image}.webp`;});
}
function go(index,updateHistory=true){
  if(index<0||index>=pages.length)return;
  current=index;
  if(updateHistory)history.replaceState(null,'',`#page-${index+1}`);
  render();
}
function next(){if(current===pages.length-1){opened.clear();go(0);}else go(current+1);}
$('scene-action').addEventListener('click',()=>{if(opened.has(current))opened.delete(current);else opened.add(current);renderAction();});
$('previous').addEventListener('click',()=>go(current-1));
$('next').addEventListener('click',next);
$('outgoing-image').addEventListener('animationend',()=>{$('outgoing-image').hidden=true;});
$('retry-image').addEventListener('click',()=>render(false));
$('about').addEventListener('click',()=>dialog.showModal());
$('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();});
document.addEventListener('keydown',event=>{
  if(dialog.open||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
  if(event.key==='ArrowRight'){event.preventDefault();if(current<pages.length-1)go(current+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();go(current-1);}
});
let touchStart=null;
$('stage').addEventListener('touchstart',event=>{if(event.touches.length===1&&!event.target.closest('button'))touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
$('stage').addEventListener('touchend',event=>{if(!touchStart)return;const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)go(current+(dx<0?1:-1));touchStart=null;},{passive:true});
$('stage').addEventListener('touchcancel',()=>{touchStart=null;});
function readHash(){const m=location.hash.match(/^#page-(\d+)$/);const index=m?Number(m[1])-1:0;go(index>=0&&index<pages.length?index:0,false);}
window.addEventListener('hashchange',readHash);
readHash();
// Quiet, locally synthesized ambience. It starts only after an explicit click.
let audioContext, master, soundOn=false;
async function toggleSound(){
  try {
    if(!audioContext){
      const Audio=window.AudioContext||window.webkitAudioContext;
      if(!Audio) throw new Error('Audio unavailable');
      audioContext=new Audio();
      master=audioContext.createGain();master.gain.value=0;master.connect(audioContext.destination);
      const buffer=audioContext.createBuffer(1,audioContext.sampleRate*5,audioContext.sampleRate);
      const data=buffer.getChannelData(0);let last=0;
      for(let i=0;i<data.length;i++){last=(last+Math.random()*.04-.02)/1.02;data[i]=last*2;}
      const breeze=audioContext.createBufferSource();breeze.buffer=buffer;breeze.loop=true;
      const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;
      const noiseGain=audioContext.createGain();noiseGain.gain.value=.35;
      breeze.connect(filter);filter.connect(noiseGain);noiseGain.connect(master);breeze.start();
      [130.81,196,261.63].forEach((frequency,index)=>{const tone=audioContext.createOscillator();tone.type='sine';tone.frequency.value=frequency;const gain=audioContext.createGain();gain.gain.value=.012/(index+1);tone.connect(gain);gain.connect(master);tone.start();});
    }
    const requested=!soundOn;
    await audioContext.resume();
    soundOn=requested;
    master.gain.setTargetAtTime(soundOn?.6:0,audioContext.currentTime,.25);
    $('sound').setAttribute('aria-pressed',String(soundOn));
    $('sound').setAttribute('aria-label',soundOn?'关闭声音':'开启声音');
    $('sound').title=soundOn?'关闭声音':'开启声音';
  }catch{$('sound').title='声音不可用';$('sound').setAttribute('aria-label','当前浏览器无法播放声音');}
}
$('sound').addEventListener('click',toggleSound);
document.addEventListener('visibilitychange',()=>{if(audioContext&&master)master.gain.setTargetAtTime(!document.hidden&&soundOn?.6:0,audioContext.currentTime,.15);});
