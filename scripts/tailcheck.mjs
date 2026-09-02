// Verifies the true bottom of the page at a given width, without fullPage
// stitching — the authority when a fullPage capture looks duplicated.
import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), '.impeccable', 'review', 'tail');
const CHROME = [
  'C:\Program Files\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
].find((p) => existsSync(p));

const { mkdir } = await import('node:fs/promises');
await mkdir(OUT, { recursive: true });

const b = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [name, w, h] of [
  ['tablet', 834, 1112],
  ['mobile', 390, 844],
  ['desktop', 1440, 900],
]) {
  const c = await b.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    colorScheme: 'light',
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:3210/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => (i.loading = 'eager'));
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 130));
    }
    document.querySelectorAll('[data-drawn="false"]').forEach((el) => el.setAttribute('data-drawn', 'true'));
  });
  await p.waitForTimeout(1500);
  const m = await p.evaluate(() => {
    const hero = document.getElementById('top');
    const footers = document.querySelectorAll('footer').length;
    const headers = document.querySelectorAll('header').length;
    const h1s = document.querySelectorAll('h1').length;
    return {
      pageH: document.documentElement.scrollHeight,
      heroH: Math.round(hero?.getBoundingClientRect().height ?? 0),
      headers,
      footers,
      h1s,
    };
  });
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(900);
  await p.screenshot({ path: path.join(OUT, `${name}-bottom.png`) });
  console.log(name.padEnd(9), JSON.stringify(m));
  await c.close();
}
await b.close();
