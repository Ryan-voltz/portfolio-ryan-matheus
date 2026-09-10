import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:3000/pt', { waitUntil: 'networkidle' });

const result = await page.evaluate(() => {
  const btn = document.querySelector('button[aria-label="Alternar tema claro/escuro"]');
  const allBtns = Array.from(document.querySelectorAll('header button')).map(b => ({
    label: b.getAttribute('aria-label'),
    title: b.getAttribute('title'),
    className: b.className,
    innerHTML: b.innerHTML,
    rect: b.getBoundingClientRect()
  }));
  const placeholders = Array.from(document.querySelectorAll('header div.opacity-0')).map(d => ({
    className: d.className,
    rect: d.getBoundingClientRect()
  }));
  return {
    hasButton: !!btn,
    allHeaderButtons: allBtns,
    placeholders
  };
});

console.log('Result:', JSON.stringify(result, null, 2));
await browser.close();

