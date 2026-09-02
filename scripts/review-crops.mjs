// Section crops at legible scale — a full-page thumbnail hides exactly the
// failures that matter. Usage: node scripts/review-crops.mjs [baseUrl]

import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3210';
const OUT = path.join(process.cwd(), '.impeccable', 'review', 'crops');

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const JOBS = [
  { file: 'about-desktop', url: '/', sel: '#about', width: 1440, scheme: 'light' },
  { file: 'work-desktop', url: '/', sel: '#work', width: 1440, scheme: 'light' },
  { file: 'projects-desktop', url: '/', sel: '#projects', width: 1440, scheme: 'dark' },
  { file: 'contact-desktop', url: '/', sel: '#contact', width: 1440, scheme: 'light' },
  { file: 'footer-desktop', url: '/', sel: 'footer', width: 1440, scheme: 'dark' },
  { file: 'about-mobile', url: '/', sel: '#about', width: 390, scheme: 'light' },
  { file: 'work-mobile', url: '/', sel: '#work', width: 390, scheme: 'dark' },
  { file: 'projects-mobile', url: '/', sel: '#projects', width: 390, scheme: 'light' },
  { file: 'contact-mobile', url: '/', sel: '#contact', width: 390, scheme: 'dark' },
  { file: 'case-result-desktop', url: '/work/voltz-hub', sel: '#result', width: 1440, scheme: 'light' },
  { file: 'case-stack-desktop', url: '/work/volare', sel: '#stack', width: 1440, scheme: 'dark' },
  { file: 'case-hero-mobile', url: '/work/blumenns', sel: '#top', width: 390, scheme: 'light' },
  { file: 'case-nav-desktop', url: '/work/volare', sel: 'main > nav', width: 1440, scheme: 'light' },
  { file: 'case-delivered-desktop', url: '/work/volare', sel: '#delivered', width: 1440, scheme: 'light' },
  { file: 'case-delivered-mobile', url: '/work/blumenns', sel: '#delivered', width: 390, scheme: 'dark' },
  { file: 'about-portrait-desktop', url: '/', sel: '#about', width: 1440, scheme: 'light' },
  { file: 'about-pt-desktop', url: '/pt', sel: '#about', width: 1440, scheme: 'dark' },
  { file: 'work-es-tablet', url: '/es', sel: '#work', width: 834, scheme: 'light' },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const job of JOBS) {
  const context = await browser.newContext({
    viewport: { width: job.width, height: 1000 },
    deviceScaleFactor: 2,
    colorScheme: job.scheme,
    locale: job.url.startsWith('/pt') ? 'pt-BR' : job.url.startsWith('/es') ? 'es-ES' : 'en-US',
    extraHTTPHeaders: {
      'Accept-Language': job.url.startsWith('/pt')
        ? 'pt-BR,pt;q=0.9'
        : job.url.startsWith('/es')
          ? 'es-ES,es;q=0.9'
          : 'en-US,en;q=0.9',
    },
  });
  const page = await context.newPage();
  await page.goto(BASE + job.url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => (img.loading = 'eager'));
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    document.querySelectorAll('[data-drawn="false"]').forEach((el) => {
      el.setAttribute('data-drawn', 'true');
    });
  });
  await page
    .waitForFunction(
      () => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
      null,
      { timeout: 45_000 },
    )
    .catch(() => console.log('  ! images did not all settle'));
  await page.waitForTimeout(1200);

  const el = page.locator(job.sel).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await el.screenshot({ path: path.join(OUT, `${job.file}.png`) });
  console.log(`${job.file.padEnd(24)} ${job.width}px ${job.scheme}`);
  await context.close();
}

await browser.close();
console.log('\nWrote to .impeccable/review/crops/');
