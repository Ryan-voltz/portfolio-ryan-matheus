import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

await page.goto('http://127.0.0.1:3000/pt', { waitUntil: 'networkidle' });

const btn = await page.$('button[title="Carregar o site real interativo com scroll"]');
console.log('Found button on port 3000:', !!btn);
if (btn) {
  await btn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  console.log('Clicking "Interagir ao vivo"...');
  await btn.click();
  await page.waitForTimeout(3000);

  const iframes = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('iframe'));
    return { count: list.length, srcs: list.map(i => i.src) };
  });
  console.log('Iframes after click on 3000:', iframes);
}

await browser.close();

