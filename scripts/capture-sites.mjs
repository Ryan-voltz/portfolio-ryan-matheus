// Captures a desktop viewport screenshot of every live project the portfolio links to.
// Output: public/shots/<slug>.webp  (1600px wide, WebP q78)
//
// Usage: node scripts/capture-sites.mjs [slug ...]

import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

const SITES = [
  { slug: 'volare', url: 'https://volarecompany.com.br/' },
  { slug: 'voltz-hub', url: 'https://voltzhub.com.br/' },
  { slug: 'blumenns', url: 'https://blumenns.com/' },
  { slug: 'seu-puto-store', url: 'https://seuputostore.com.br/' },
  { slug: 'overall-cla', url: 'https://overalclasuplementos.com.br/' },
  { slug: 'fipec', url: 'https://fipec.com.br/' },
  { slug: 'g7-comercio', url: 'https://g7comercio.com.br/' },
  { slug: 'grupo-educare', url: 'https://editoraeducare.com.br/' },
];

const OUT_DIR = path.join(process.cwd(), 'public', 'shots');
const TMP = path.join(process.cwd(), '.next', 'cache', 'shots-tmp');

const only = process.argv.slice(2);
const targets = only.length ? SITES.filter((s) => only.includes(s.slug)) : SITES;

await mkdir(OUT_DIR, { recursive: true });
await mkdir(TMP, { recursive: true });

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));

const browser = await chromium.launch({ executablePath, headless: true });

const results = [];

for (const site of targets) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: 'pt-BR',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  try {
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await page.waitForLoadState('networkidle', { timeout: 25_000 }).catch(() => {});
    // Let entrance animations settle and lazy images decode.
    await page.waitForTimeout(3500);
    await page.evaluate(() => {
      // Nudge lazy loaders, then return to the top so the capture is the hero.
      window.scrollTo(0, 600);
    });
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);

    const raw = path.join(TMP, `${site.slug}.png`);
    await page.screenshot({ path: raw, fullPage: false });

    const out = path.join(OUT_DIR, `${site.slug}.webp`);
    const info = await sharp(raw).resize({ width: 1600 }).webp({ quality: 78 }).toFile(out);
    await unlink(raw).catch(() => {});
    results.push({ slug: site.slug, ok: true, bytes: info.size, w: info.width, h: info.height });
    console.log(`OK   ${site.slug.padEnd(16)} ${(info.size / 1024).toFixed(0)}kB ${info.width}x${info.height}`);
  } catch (err) {
    results.push({ slug: site.slug, ok: false, error: String(err).slice(0, 200) });
    console.log(`FAIL ${site.slug.padEnd(16)} ${String(err).slice(0, 160)}`);
  } finally {
    await context.close();
  }
}

await browser.close();

// Provenance: these rasters are sourced captures, not generated art.
await writeFile(
  path.join(OUT_DIR, 'PROVENANCE.txt'),
  [
    'Origin of every raster in this directory:',
    '',
    'Automated Chromium screenshots of the live production sites listed below,',
    'captured at 1440x900 @2x and downscaled to 1600px wide WebP.',
    'They are photographs of real, publicly reachable pages built by Ryan Matheus.',
    'No image here is AI-generated, stock, or composited.',
    '',
    'Capture script: scripts/capture-sites.mjs',
    `Captured: ${new Date().toISOString().slice(0, 10)}`,
    '',
    ...SITES.map((s) => `${s.slug}.webp  <-  ${s.url}`),
  ].join('\n'),
  'utf8',
);

console.log('\n' + JSON.stringify(results, null, 1));
