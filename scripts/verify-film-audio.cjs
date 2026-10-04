const {chromium}=require('/Users/qingyue/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--disable-audio-output'],executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1050}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
await page.goto('http://127.0.0.1:4173');await page.waitForFunction(()=>document.querySelector('#score').readyState>=3);
assert(Math.abs(await page.locator('#score').evaluate(e=>e.duration)-90)<.1);
await page.waitForFunction(()=>[...document.querySelectorAll('.scene img')].length===10&&[...document.querySelectorAll('.scene img')].every(e=>e.complete&&e.naturalWidth>1000));
require('fs').mkdirSync('output/qa-photo',{recursive:true});
await page.screenshot({path:'output/qa-photo/desktop-cover.png',fullPage:true});
for(let i=0;i<10;i++){await page.locator('#chapters button').nth(i).click();assert.equal(await page.locator('#chapters button').nth(i).getAttribute('aria-current'),'true');}
await page.evaluate(()=>{tl.seek(1.5);update();$('start').hidden=false;});

await page.locator('#start').click();await page.waitForTimeout(1200);
let state=await page.evaluate(()=>({audio:score.currentTime,video:tl.time(),paused:score.paused}));assert(!state.paused);assert(Math.abs(state.audio-state.video)<.5);
await page.locator('#chapters button').nth(7).click();await page.waitForTimeout(600);state=await page.evaluate(()=>({audio:score.currentTime,video:tl.time(),paused:score.paused}));assert(!state.paused);assert(state.audio>62);assert(Math.abs(state.audio-state.video)<.5);
await page.locator('#play').click();assert(await page.locator('#score').evaluate(e=>e.paused));const t=await page.locator('#score').evaluate(e=>e.currentTime);await page.waitForTimeout(500);assert.equal(await page.locator('#score').evaluate(e=>e.currentTime),t);
await page.locator('#sound').click();await page.locator('#play').click();assert(await page.locator('#score').evaluate(e=>e.paused));await page.locator('#sound').click();await page.waitForTimeout(300);assert(!await page.locator('#score').evaluate(e=>e.paused));
await page.evaluate(()=>seek(89.5));await page.waitForTimeout(800);assert(await page.locator('#score').evaluate(e=>e.paused));assert.equal(await page.locator('#play').getAttribute('aria-label'),'重播');
await page.locator('#play').click();await page.waitForTimeout(500);assert(await page.locator('#score').evaluate(e=>e.currentTime<2));await page.locator('#play').click();
await page.setViewportSize({width:390,height:844});
for(const i of [0,2,7,9]){await page.locator('#chapters button').nth(i).click();await page.screenshot({path:`output/qa-photo/mobile-${i+1}.png`,fullPage:true});}
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
const range=await page.request.get('http://127.0.0.1:4173/assets/lamp-film/audio/lamp-score-v1.mp3',{headers:{Range:'bytes=0-1023'}});assert.equal(range.status(),206);assert.equal((await range.body()).length,1024);
console.log('PASS: 90s decoded music, user-start, pause, chapter/seek sync, mute/unmute, end/replay, range requests, mobile layout, no browser errors');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
