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
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
  locale: 'pt-BR',
});

const page = await context.newPage();
await page.goto(`${BASE}/pt`, { waitUntil: 'networkidle' });

// 1. Capture Hero with new Landing Pages / Portfolios copy
const hero = await page.$('#top');
if (hero) {
  await hero.screenshot({ path: path.join(OUT, 'verif-live-hero-landing-pages.png') });
}

// 2. Scroll down to Case 01 (Volare)
const case01 = await page.$('#work article:first-of-type');
if (case01) {
  await case01.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await case01.screenshot({ path: path.join(OUT, 'verif-live-case01-static.png') });

  // 3. Click the "Interagir ao vivo" button
  const liveBtn = await case01.$('button:has-text("Interagir ao vivo"), button:has-text("Ao vivo")');
  if (liveBtn) {
    console.log('Clicking "Interagir ao vivo"...');
    await liveBtn.click();

    // Wait for iframe to appear and load
    const iframeElement = await case01.waitForSelector('iframe', { timeout: 15000 });
    await page.waitForTimeout(3000); // give live site time to render

    // Scroll inside the iframe
    try {
      const frame = await iframeElement.contentFrame();
      if (frame) {
        await frame.evaluate(() => window.scrollBy(0, 450));
        console.log('Scrolled inside the live iframe successfully!');
      }
    } catch (err) {
      console.log('Note on cross-origin iframe scroll:', err.message);
    }

    await page.waitForTimeout(1000);
    await case01.screenshot({ path: path.join(OUT, 'verif-live-case01-interactive.png') });
    console.log('Captured interactive iframe screenshot!');
  }

  // 4. Click "Modo tela cheia" / "Ampliar"
  const expandBtn = await case01.$('button:has-text("Modo tela cheia"), button:has-text("Ampliar")');
  if (expandBtn) {
    console.log('Opening modal...');
    await expandBtn.click();
    await page.waitForTimeout(2500);

    const dialog = await page.$('dialog.viewer[open]');
    if (dialog) {
      await dialog.screenshot({ path: path.join(OUT, 'verif-live-modal-desktop.png') });

      // Click Mobile device mode button
      const mobileBtn = await dialog.$('button[title="Visão Mobile"], button:has-text("Mobile")');
      if (mobileBtn) {
        console.log('Switching to mobile device simulator...');
        await mobileBtn.click();
        await page.waitForTimeout(2000);
        await dialog.screenshot({ path: path.join(OUT, 'verif-live-modal-mobile.png') });
      }
    }
  }
}

await context.close();
await browser.close();
console.log('Interactive verification finished successfully!');

