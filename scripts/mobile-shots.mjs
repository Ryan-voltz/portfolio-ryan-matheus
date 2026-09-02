// Captures the mobile experience in its real states: at rest, mid-scroll with
// the dimension strip filling and the issue bar docked, and with a detail open.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3210';
const OUT = path.join(process.cwd(), '.impeccable', 'review', 'mobile');
const CHROME = [
  'C:\Program Files\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
].find((p) => existsSync(p));

await mkdir(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: CHROME, headless: true });

const JOBS = [
  { file: 'hero', url: '/', scheme: 'light', at: 0 },
  { file: 'hero-dark', url: '/', scheme: 'dark', at: 0 },
  { file: 'about-scrolled', url: '/', scheme: 'light', at: 1100 },
  { file: 'work-scrolled', url: '/', scheme: 'dark', at: 2400 },
  { file: 'work-scrolled-2', url: '/', scheme: 'light', at: 3300 },
  { file: 'projects-scrolled', url: '/', scheme: 'dark', at: 5200 },
  { file: 'contact-scrolled', url: '/', scheme: 'light', at: 99999 },
  { file: 'case-hero', url: '/work/volare', scheme: 'light', at: 0 },
  { file: 'case-scrolled', url: '/work/voltz-hub', scheme: 'dark', at: 2600 },
  { file: 'viewer-open', url: '/', scheme: 'light', at: 2400, openViewer: true },
  { file: 'narrow-320', url: '/', scheme: 'light', at: 0, width: 320 },
];

for (const job of JOBS) {
  const c = await b.newContext({
    viewport: { width: job.width ?? 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: job.scheme,
    locale: 'pt-BR',
    extraHTTPHeaders: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
  });
  const p = await c.newPage();
  await p.goto(BASE + job.url, { waitUntil: 'networkidle', timeout: 60_000 });
  await p.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => (i.loading = 'eager'));
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    document.querySelectorAll('[data-drawn="false"]').forEach((el) => el.setAttribute('data-drawn', 'true'));
  });
  await p.waitForFunction(
    () => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
    null, { timeout: 30_000 },
  ).catch(() => {});
  await p.evaluate((y) => window.scrollTo(0, y), job.at);
  await p.waitForTimeout(1100);

  if (job.openViewer) {
    const btn = p.locator('button.mount').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await p.waitForTimeout(900);
  }

  const box = await p.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  await p.screenshot({ path: path.join(OUT, `${job.file}.png`) });
  console.log(
    `${job.file.padEnd(20)} ${job.width ?? 390}px ${job.scheme}` +
      (box.w > box.cw + 1 ? `  ⚠ H-OVERFLOW ${box.w}>${box.cw}` : ''),
  );
  await c.close();
}

await b.close();
console.log('\nWrote to .impeccable/review/mobile/');
