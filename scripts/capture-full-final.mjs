import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';
import path from 'node:path';

const BASE = 'http://127.0.0.1:3000';
const OUT = 'C:\\Users\\Pedro Henrique\\.gemini\\antigravity\\brain\\7f260f82-2a52-4de2-9b80-b96ee811421b';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const theme of ['light', 'dark']) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    colorScheme: theme,
    locale: 'pt-BR',
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/pt`, { waitUntil: 'networkidle' });

  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      if (img.dataset.nimg !== undefined) img.decoding = 'sync';
    });
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    document.querySelectorAll('[data-drawn]').forEach((el) => el.setAttribute('data-drawn', 'true'));
  });

  await page.waitForFunction(
    () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
    null,
    { timeout: 20_000 },
  ).catch(() => {});

  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(OUT, `final-full-${theme}.png`), fullPage: true });
  await context.close();
}

await browser.close();
console.log('Full page screenshots saved with decoded images!');

