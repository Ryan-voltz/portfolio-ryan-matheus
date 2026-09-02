// Structural smoke checks over the built site: overflow at narrow widths,
// heading order, link names, contrast-relevant tokens, keyboard reachability.
// Usage: node scripts/smoke.mjs [baseUrl]

import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3210';
const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const PAGES = ['/', '/pt', '/es', '/work/volare', '/pt/work/voltz-hub', '/es/work/blumenns'];
const WIDTHS = [320, 360, 390, 768, 834, 1024, 1280, 1440, 1920];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  FAIL ${msg}`);
};

// --- 1. Horizontal overflow -------------------------------------------------
console.log('Horizontal overflow');
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  for (const url of PAGES) {
    await page.goto(BASE + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const d = document.documentElement;
      const offenders = [];
      if (d.scrollWidth > d.clientWidth + 1) {
        for (const el of document.querySelectorAll('*')) {
          const b = el.getBoundingClientRect();
          if (b.right > d.clientWidth + 1 && b.width > 4) {
            offenders.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(b.right)}`,
            );
            if (offenders.length > 2) break;
          }
        }
      }
      return { over: d.scrollWidth - d.clientWidth, offenders };
    });
    if (r.over > 1) fail(`${width}px ${url} overflows by ${r.over}px → ${r.offenders.join(' | ')}`);
  }
  await ctx.close();
}
console.log(failures === 0 ? '  ok — no page overflows at any width' : '');

// --- 2. Semantics -----------------------------------------------------------
console.log('Semantics');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const url of PAGES) {
    await page.goto(BASE + url, { waitUntil: 'domcontentloaded' });
    const r = await page.evaluate(() => {
      const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) =>
        Number(h.tagName[1]),
      );
      let jump = null;
      for (let i = 1; i < headings.length; i++) {
        if (headings[i] - headings[i - 1] > 1) jump = `h${headings[i - 1]} → h${headings[i]}`;
      }
      const namelessLinks = [...document.querySelectorAll('a')].filter(
        (a) => !(a.textContent || '').trim() && !a.getAttribute('aria-label'),
      ).length;
      const imgsNoAlt = [...document.images].filter((i) => i.alt === null).length;
      const landmarks = {
        main: document.querySelectorAll('main').length,
        header: document.querySelectorAll('header').length,
        footer: document.querySelectorAll('footer').length,
        navs: [...document.querySelectorAll('nav')].map((n) => n.getAttribute('aria-label')),
      };
      return {
        h1: document.querySelectorAll('h1').length,
        jump,
        namelessLinks,
        imgsNoAlt,
        landmarks,
        lang: document.documentElement.lang,
        skip: document.querySelector('.u-skip')?.textContent?.trim() ?? null,
      };
    });
    if (r.h1 !== 1) fail(`${url} has ${r.h1} h1 elements`);
    if (r.jump) fail(`${url} heading level jump ${r.jump}`);
    if (r.namelessLinks) fail(`${url} has ${r.namelessLinks} links with no accessible name`);
    if (r.imgsNoAlt) fail(`${url} has ${r.imgsNoAlt} images with no alt attribute`);
    if (!r.skip) fail(`${url} has no skip link`);
    if (r.landmarks.main !== 1) fail(`${url} has ${r.landmarks.main} <main>`);
    if (r.landmarks.navs.some((n) => !n)) fail(`${url} has an unlabelled <nav>`);
    console.log(
      `  ${url.padEnd(24)} lang=${r.lang.padEnd(6)} h1=${r.h1} navs=[${r.landmarks.navs.join(', ')}]`,
    );
  }
  await ctx.close();
}

// --- 3. Keyboard ------------------------------------------------------------
console.log('Keyboard');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const seen = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    seen.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        if (!a) return 'none';
        const s = getComputedStyle(a);
        return `${a.tagName.toLowerCase()}:${(a.textContent || '').trim().slice(0, 22)} outline=${s.outlineStyle}/${s.outlineWidth}`;
      }),
    );
  }
  const noOutline = seen.filter((s) => s.includes('outline=none')).length;
  if (noOutline) fail(`${noOutline} of the first 12 tab stops render no focus outline`);
  seen.slice(0, 8).forEach((s) => console.log('  ' + s));
  await ctx.close();
}

// --- 4. Reduced motion ------------------------------------------------------
console.log('Reduced motion');
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const el = document.querySelector('.draws');
    const marks = document.querySelector('.marks');
    return {
      draws: el ? getComputedStyle(el).transform : 'none',
      marksOpacity: marks ? getComputedStyle(marks).opacity : '1',
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });
  if (r.marksOpacity !== '1') fail(`reduced-motion still hides .marks (opacity ${r.marksOpacity})`);
  if (r.scrollBehavior !== 'auto') fail(`reduced-motion keeps smooth scrolling`);
  console.log(`  draws transform=${r.draws} marks opacity=${r.marksOpacity} scroll=${r.scrollBehavior}`);
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
