import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

const logs = [];
const errors = [];
page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', err => errors.push(err.toString()));

await page.goto('http://127.0.0.1:3000/pt', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

console.log('Page errors:', errors);
console.log('Console logs:', logs);

await browser.close();

