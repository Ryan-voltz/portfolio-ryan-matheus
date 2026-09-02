// Captures the built site for the finish review.
// Usage: node scripts/review-shots.mjs [baseUrl]

import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3210';
const OUT = path.join(process.cwd(), '.impeccable', 'review');

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const TARGETS = [
  { file: 'desktop', url: '/', width: 1440, height: 900, scheme: 'light' },
  { file: 'mobile', url: '/', width: 390, height: 844, scheme: 'light' },
  { file: 'desktop-dark', url: '/', width: 1440, height: 900, scheme: 'dark' },
  { file: 'mobile-dark', url: '/', width: 390, height: 844, scheme: 'dark' },
  { file: 'desktop-case', url: '/work/volare', width: 1440, height: 900, scheme: 'light' },
  { file: 'mobile-case', url: '/work/volare', width: 390, height: 844, scheme: 'dark' },
  { file: 'desktop-pt', url: '/pt', width: 1440, height: 900, scheme: 'light' },
  { file: 'desktop-es', url: '/es', width: 1280, height: 800, scheme: 'dark' },
  { file: 'tablet', url: '/', width: 834, height: 1112, scheme: 'light' },
  { file: 'hero-desktop', url: '/', width: 1440, height: 900, scheme: 'light', viewportOnly: true },
  { file: 'hero-mobile', url: '/', width: 390, height: 844, scheme: 'dark', viewportOnly: true },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const target of TARGETS) {
  const context = await browser.newContext({
    viewport: { width: target.width, height: target.height },
    deviceScaleFactor: 2,
    colorScheme: target.scheme,
    // The middleware detects locale from Accept-Language; pin it so a target
    // that asks for '/' is actually captured in English.
    locale: target.url.startsWith('/pt') ? 'pt-BR' : target.url.startsWith('/es') ? 'es-ES' : 'en-US',
    extraHTTPHeaders: {
      'Accept-Language': target.url.startsWith('/pt')
        ? 'pt-BR,pt;q=0.9'
        : target.url.startsWith('/es')
          ? 'es-ES,es;q=0.9'
          : 'en-US,en;q=0.9',
    },
  });
  const page = await context.newPage();
  await page.goto(BASE + target.url, { waitUntil: 'networkidle', timeout: 60_000 });

  // Trigger every reveal, then settle: an element still mid-animation reads
  // as a missing element in the capture.
  await page.evaluate(async () => {
    // Force every lazy image to fetch now; a capture must never show a mount
    // that a real visitor would see filled.
    document.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      if (img.dataset.nimg !== undefined) img.decoding = 'sync';
    });
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo(0, 0);
    document.querySelectorAll('[data-drawn="false"]').forEach((el) => {
      el.setAttribute('data-drawn', 'true');
    });
  });
  // Every image decoded before the shutter: a half-loaded mount reads as a
  // missing detail and gets "fixed" into a regression.
  await page
    .waitForFunction(
      () =>
        Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
      null,
      { timeout: 45_000 },
    )
    .catch(() => console.log('  ! images did not all settle'));
  await page.waitForTimeout(1400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const file = path.join(OUT, `${target.file}.png`);
  await page.screenshot({ path: file, fullPage: !target.viewportOnly });
  const box = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
    cw: document.documentElement.clientWidth,
  }));
  const overflow = box.w > box.cw + 1 ? `  ⚠ H-OVERFLOW ${box.w} > ${box.cw}` : '';
  console.log(`${target.file.padEnd(16)} ${target.width}x${target.height} ${target.scheme}${overflow}`);
  await context.close();
}

await browser.close();
console.log('\nWrote to .impeccable/review/');
