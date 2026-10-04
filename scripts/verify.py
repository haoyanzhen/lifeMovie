"""Acceptance checks for the second, image-led life album. Server must be running."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:4173'
OUT = Path(__file__).resolve().parents[1] / 'output' / 'qa-v2'
OUT.mkdir(parents=True, exist_ok=True)
checks, errors = [], []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width':1440, 'height':900})
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: errors.append(f'{r.status} {r.url}') if r.status >= 400 else None)
    page.goto(BASE)
    page.wait_for_load_state('networkidle')
    expect(page.locator('#cover-title')).to_be_visible()
    expect(page.locator('#previous')).to_be_disabled()
    expect(page.locator('#sound')).to_have_attribute('aria-pressed','false')
    assert page.locator('.chapter-button').count() == 13
    page.screenshot(path=str(OUT/'desktop-cover.png'),full_page=True,animations='disabled')
    for index in range(13):
        page.locator('.chapter-button').nth(index).click()
        expect(page.locator('#page-number')).to_have_text(f'{index+1:02} / 13')
        assert page.locator('#scene-image').evaluate('(img) => img.complete && img.naturalWidth > 0')
        assert len(page.locator('#story-text').inner_text()) <= 40
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        if index in [1,3,4,5,6,7,8,10,11,12]:
            page.screenshot(path=str(OUT/f'desktop-{index+1:02}.png'),full_page=True,animations='disabled')
    checks.append('All 13 scenes decode, timeline spans childhood to old age, captions at most 40 characters, no horizontal overflow')
    visible = page.locator('body').inner_text()
    for removed in ['慢慢读','不必急着','多停一会儿','把平常的日子','A LIFE IN PAGES']:
        assert removed not in visible
    checks.append('Reading instructions, duplicate captions and decorative copy removed')

    page.locator('.chapter-button').nth(10).click()
    expect(page.locator('#time-label')).to_have_text('纸上')
    page.locator('#scene-action').click()
    expect(page.locator('#memory-layer')).to_be_visible()
    expect(page.locator('#story-text')).to_contain_text('活了一次')
    page.screenshot(path=str(OUT/'desktop-memories.png'),full_page=True,animations='disabled')
    page.locator('#scene-action').click()
    expect(page.locator('#memory-layer')).to_be_hidden()
    page.locator('#next').click()
    expect(page.locator('#time-label')).to_have_text('八十岁')
    assert 'muted' in page.locator('#scene-image').get_attribute('class')
    page.locator('#scene-action').click()
    assert 'muted' not in page.locator('#scene-image').get_attribute('class')
    page.screenshot(path=str(OUT/'desktop-painting.png'),full_page=True,animations='disabled')
    page.locator('#next').click()
    expect(page.locator('#time-label')).to_have_text('后来')
    page.locator('#scene-action').click()
    expect(page.locator('#echo-layer')).to_be_visible()
    page.locator('#scene-action').click()
    expect(page.locator('#echo-layer')).to_be_hidden()
    expect(page.locator('#next')).to_have_attribute('aria-label','重新开始')
    page.locator('#next').click()
    expect(page.locator('#cover-title')).to_be_visible()
    page.locator('.chapter-button').nth(11).click()
    expect(page.locator('#scene-action')).to_have_attribute('aria-pressed','false')
    checks.append('Memory montage, color interaction, childhood echo and restart state reset')

    page.locator('#about').click()
    expect(page.locator('#source-dialog')).to_be_visible()
    assert page.locator('.source-links a').count() == 3
    page.keyboard.press('ArrowRight')
    expect(page.locator('#time-label')).to_have_text('八十岁')
    page.keyboard.press('Escape')
    expect(page.locator('#source-dialog')).to_be_hidden()
    assert page.locator('#about').evaluate('(e) => e === document.activeElement')
    page.locator('#sound').click()
    expect(page.locator('#sound')).to_have_attribute('aria-pressed','true')
    page.locator('#sound').click()
    expect(page.locator('#sound')).to_have_attribute('aria-pressed','false')
    checks.append('Sources, modal keyboard isolation, Escape/focus return, sound toggle')

    page.goto(BASE+'/#page-2')
    page.wait_for_load_state('networkidle')
    page.keyboard.press('ArrowRight')
    expect(page.locator('#time-label')).to_have_text('年轻时')
    page.keyboard.press('ArrowLeft')
    expect(page.locator('#time-label')).to_have_text('小时候')
    for _ in range(7): page.keyboard.press('ArrowRight')
    expect(page.locator('#time-label')).to_have_text('一个多月')
    assert page.locator('#scene-image').get_attribute('src').endswith('/assets/desk.webp')
    checks.append('Direct URL, keyboard, rapid navigation keeps final image and caption consistent')

    mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    phone=mobile.new_page()
    phone.on('pageerror',lambda e: errors.append(str(e)))
    phone.goto(BASE)
    phone.wait_for_load_state('networkidle')
    phone.screenshot(path=str(OUT/'mobile-cover.png'),full_page=True,animations='disabled')
    for i in range(13):
        phone.locator('.chapter-button').nth(i).click()
        expect(phone.locator('#page-number')).to_have_text(f'{i+1:02} / 13')
        assert phone.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert phone.locator('#next').bounding_box()['y'] < 844
        if i in [1,4,7,11,12]:
            phone.screenshot(path=str(OUT/f'mobile-{i+1:02}.png'),full_page=True,animations='disabled')
    phone.locator('.chapter-button').nth(0).click()
    expect(phone.locator('#page-number')).to_have_text('01 / 13')
    box=phone.locator('#stage').bounding_box()
    cdp=mobile.new_cdp_session(phone)
    x,y=box['x']+box['width']*.8,box['y']+box['height']*.5
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
    cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-140,'y':y+2}]})
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    expect(phone.locator('#time-label')).to_have_text('小时候')
    phone.set_viewport_size({'width':320,'height':740})
    phone.locator('.chapter-button').nth(11).click()
    expect(phone.locator('#time-label')).to_have_text('八十岁')
    assert phone.evaluate('document.documentElement.scrollWidth <= innerWidth')
    phone.screenshot(path=str(OUT/'narrow-painting.png'),full_page=True,animations='disabled')
    phone.locator('#about').click()
    phone.screenshot(path=str(OUT/'mobile-sources.png'),full_page=True,animations='disabled')
    expect(phone.locator('#close-dialog')).to_be_visible()
    checks.append('390px all scenes: image and navigation in first viewport; real touch event swipe; 320px layout and modal')

    page.emulate_media(reduced_motion='reduce')
    assert page.locator('#scene-image').evaluate('(e) => getComputedStyle(e).animationName') == 'none'
    page.set_viewport_size({'width':720,'height':500})
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    checks.append('Reduced motion and 720px reflow')
    assert not errors, errors
    checks.append('No failed local requests or JavaScript errors')
    browser.close()

(OUT/'results.json').write_text(json.dumps({'passed':checks,'errors':errors},ensure_ascii=False,indent=2))
print(json.dumps({'passed':checks,'errors':errors},ensure_ascii=False,indent=2))
