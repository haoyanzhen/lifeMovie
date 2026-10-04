const beats=[
['相遇','那年春天','她的表停了。他说，明天来取。',8],
['成家','两年以后','后来，她把缝纫机搬进了他的屋。',8],
['小床','日子正长','灯下多了一张小床。',8],
['沉默','也有这样的夜晚','谁都不肯，先开口。',8],
['远行','孩子长大了','孩子去了很远的地方。灯还亮着。',9],
['白发','不知不觉','表针越来越小。她把灯，又挪近了一点。',10],
['病中','那年冬天','她睡得越来越早。他把灯调暗了一点。',10],
['空椅','又到春天','这一年，他还是摆了两只碗。',11],
['归来','一个傍晚','门外，有人喊了一声：外公。',10],
['灯火','天快亮了','他把灯，留到了天亮。',8]
];
const $=id=>document.getElementById(id);let pos=0;beats.forEach(b=>{b.push(pos);pos+=b[3]});
const shots = [
 ['01-meeting','年轻修表匠抬起头，看着来修表的姑娘','50% 48%'],
 ['02-home','新婚夫妻一起将缝纫机搬进小屋','50% 50%'],
 ['03-child','深夜灯下，年轻父亲照料女儿，妻子在旁歇息','50% 45%'],
 ['04-silence','两人安静坐着，桌上留着一杯热水','50% 50%'],
 ['05-departure','父母在家门口送别带着行李的女儿','50% 50%'],
 ['06-aging','白发夫妻在修表桌前相伴','50% 45%'],
 ['07-care','老人俯身替病中的妻子掖好被角','50% 48%'],
 ['08-empty','老人面前是两只碗，对面是一把空椅','50% 50%'],
 ['09-return','小外孙女扑向外公，女儿跟在身后','50% 45%'],
 ['10-dawn','天色将亮，小屋里祖孙相依，灯还亮着','50% 50%']
];
function art(i){const [name,alt,position]=shots[i];return `<img class="art" src="assets/lamp-film/${name}.jpg" alt="AI 创作画面：${alt}" style="object-position:${position}" ${i===0?'fetchpriority="high"':'loading="eager"'} decoding="async">`}
const score = $('score');
let soundOn=true, audioFailed=false;
function updateSoundUI(){
  const active=soundOn&&playing&&!score.paused&&score.readyState>=3&&!audioFailed;
  $('sound').textContent=!soundOn?'音乐 关':audioFailed?'音乐 重试':active?'音乐 播放中':playing?'音乐 加载中':'音乐 开';
  $('sound').setAttribute('aria-pressed',String(soundOn));
  $('sound').title=audioFailed?'重新加载并播放音乐':soundOn?'关闭音乐':'开启音乐';
}
function syncAudio(force=false){
  const shouldPlay=playing&&soundOn&&!document.hidden&&tl.time()<90;
  if(!shouldPlay){score.pause();updateSoundUI();return;}
  if((force||Math.abs(score.currentTime-tl.time())>.45)&&!score.seeking&&Math.abs(score.currentTime-tl.time())>.04){if(score.readyState>=1)score.currentTime=Math.min(tl.time(),score.duration||90);}
  if(score.paused){score.play().then(()=>{if(!playing||!soundOn)score.pause();else{audioFailed=false;$('status').textContent='';}updateSoundUI();}).catch(e=>{if(e.name!=='AbortError'){audioFailed=true;updateSoundUI();$('status').textContent='音乐未能播放，点击“音乐 重试”重新开启。';}});}
}
beats.forEach((b,i)=>{let scene=document.createElement('section');scene.className='scene';scene.id=`scene-${i}`;scene.innerHTML=art(i)+`<div class="scene-content"><p class="time">${b[1]}</p><p class="caption">${b[2]}</p></div>`;$('film').append(scene);let btn=document.createElement('button');btn.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span>${b[0]}`;btn.onclick=()=>seek(b[4]+1.4);$('chapters').append(btn)});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const tl=gsap.timeline({paused:true,onUpdate:update,onComplete:()=>{playing=false;score.pause();sync();}});window.__timelines={'life-light':tl};
beats.forEach((b,i)=>{let s=`#scene-${i}`;if(i)tl.fromTo(s,{opacity:0},{opacity:1,duration:reduced?.01:1.2,ease:'sine.inOut'},b[4]);tl.fromTo(s+' .art',{scale:reduced?1:1.035,x:reduced?0:i%2?-9:9},{scale:1,x:0,duration:b[3],ease:'none'},b[4]);tl.fromTo(s+' .caption',{opacity:0,y:reduced?0:12},{opacity:1,y:0,duration:1,ease:'power2.out'},b[4]+.3);tl.fromTo(s+' .time',{opacity:0,x:reduced?0:-8},{opacity:1,x:0,duration:.8,ease:'power1.out'},b[4]+.2);});
let playing=false;function sync(){$('play').textContent=playing?'Ⅱ':tl.time()>=89.9?'↶':'▶';$('play').setAttribute('aria-label',playing?'暂停':tl.time()>=89.9?'重播':'播放');$('start').hidden=playing||tl.time()>.1;updateSoundUI();}
function update(){const t=tl.time();$('seek').value=t;$('elapsed').textContent=`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;const n=beats.findLastIndex(b=>t>=b[4]);$('count').textContent=`${String(n+1).padStart(2,'0')} / ${beats[n][0]}`;[...$('chapters').children].forEach((el,i)=>el.setAttribute('aria-current',String(i===n)));score.volume=.76*Math.min(1,t/1.8,Math.max(0,(90-t)/4));}
function toggle(){if(tl.time()>=89.9)tl.seek(0);playing=!playing;playing?tl.play():tl.pause();sync();update();syncAudio(true)}
function seek(t){tl.seek(Math.min(90,Math.max(0,t)));sync();update();syncAudio(true)}
$('play').onclick=toggle;$('start').onclick=()=>{tl.seek(0);toggle()};$('seek').oninput=e=>seek(+e.target.value);
function step(d){const n=beats.findLastIndex(b=>tl.time()>=b[4]);seek(beats[Math.max(0,Math.min(9,n+d))][4]+1.4)}
$('previous').onclick=()=>step(-1);$('next').onclick=()=>step(1);$('about').onclick=()=>{if(playing)toggle();$('info').showModal()};$('close').onclick=()=>$('info').close();$('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('player').requestFullscreen()}catch{$('full').title='当前浏览器不支持全屏'}};
document.addEventListener('keydown',e=>{if($('info').open||e.target.matches('input,button,a'))return;if(e.code==='Space'){e.preventDefault();toggle()}if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)toggle()});
$('sound').onclick=()=>{
  if(audioFailed||score.error){audioFailed=false;soundOn=true;score.load();}
  else soundOn=!soundOn;
  $('status').textContent='';updateSoundUI();syncAudio(true);
};
score.addEventListener('loadedmetadata',()=>{if(playing&&soundOn)syncAudio(true)});
score.addEventListener('error',()=>{audioFailed=true;updateSoundUI();$('status').textContent='音乐加载失败，点击“音乐 重试”重新加载。'});
for(const event of ['playing','pause','waiting','canplay','ended'])score.addEventListener(event,updateSoundUI);
score.addEventListener('canplay',()=>{if(playing&&soundOn)syncAudio(false)});
score.addEventListener('timeupdate',()=>{if(playing&&soundOn&&score.readyState>=3&&Math.abs(score.currentTime-tl.time())>.6&&!score.seeking)score.currentTime=tl.time()});
tl.seek(1.5);update();$('start').hidden=false;
