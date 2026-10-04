// Export the rendered visual scenes into a standalone, seekable HyperFrames composition.
const fs=require('node:fs/promises');
const {chromium}=require('/Users/qingyue/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-audio-output']});
 try{
  const page=await browser.newPage({viewport:{width:1600,height:1000}});
  await page.goto('http://127.0.0.1:4173/');
  const data=await page.evaluate(()=>({beats,scenes:[...document.querySelectorAll('.scene')].map(el=>{const clone=el.cloneNode(true);clone.removeAttribute('style');clone.querySelectorAll('[style]').forEach(child=>{const pos=child.style.objectPosition;child.removeAttribute('style');if(pos)child.style.objectPosition=pos;});clone.querySelectorAll('img').forEach(img=>img.setAttribute('src','media/'+img.getAttribute('src').split('/').pop()));clone.setAttribute('data-layout-allow-overlap','true');clone.setAttribute('data-layout-allow-occlusion','true');clone.querySelector('.art').setAttribute('data-layout-allow-overflow','true');return clone.outerHTML;})}));
  const css=await fs.readFile('film/film.css','utf8');
  const script=`const beats=${JSON.stringify(data.beats)};const tl=gsap.timeline({paused:true});beats.forEach((b,i)=>{const s='#scene-'+i;if(i){tl.fromTo(s,{opacity:0},{opacity:1,duration:1.2,ease:'sine.inOut'},b[4]);tl.set('#scene-'+(i-1),{opacity:0},b[4]+1.2);}tl.fromTo(s+' .art',{scale:1.035,x:i%2?-9:9},{scale:1,x:0,duration:b[3],ease:'none'},b[4]);tl.fromTo(s+' .caption',{opacity:0,y:12},{opacity:1,y:0,duration:1,ease:'power2.out'},b[4]+.3);tl.fromTo(s+' .time',{opacity:0,x:-8},{opacity:1,x:0,duration:.8,ease:'power1.out'},b[4]+.2)});window.__timelines=window.__timelines||{};window.__timelines['life-light']=tl;`;
  const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>留一盏灯 · 独立时间线</title><style>${css}\n@font-face{font-family:'Songti SC';src:local('Songti SC')}@font-face{font-family:'STSong';src:local('STSong')}@font-face{font-family:'PingFang SC';src:local('PingFang SC')}body{width:1600px;height:900px;margin:0}#film{width:1600px;height:900px}.caption{font-size:36px}.time{font-size:20px}</style><script src="gsap.min.js"></script></head><body><div id="film" data-composition-id="life-light" data-start="0" data-duration="90" data-width="1600" data-height="900">${data.scenes.join('')}</div><audio id="score" src="score-v1.mp3" data-start="0" data-duration="90" data-track-index="2" data-volume="0.76"></audio><script>${script}</script></body></html>`;
  await fs.mkdir('film/composition/media',{recursive:true});
  for(const file of await fs.readdir('assets/lamp-film'))if(file.endsWith('.jpg'))await fs.copyFile('assets/lamp-film/'+file,'film/composition/media/'+file);
  await fs.copyFile('assets/lamp-film/audio/lamp-score-v1.mp3','film/composition/score-v1.mp3');await fs.copyFile('film/vendor/gsap.min.js','film/composition/gsap.min.js');await fs.writeFile('film/composition/index.html',html);console.log('Exported 10 scenes, timeline and generated score.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
