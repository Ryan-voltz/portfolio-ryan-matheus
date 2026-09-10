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
    deviceScaleFactor: 2,
    colorScheme: theme,
    locale: 'pt-BR',
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/pt`, { waitUntil: 'networkidle' });

  // Scroll to trigger all reveals
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    document.querySelectorAll('[data-drawn]').forEach((el) => el.setAttribute('data-drawn', 'true'));
  });

  await page.waitForTimeout(1000);

  // 1. Header
  const header = await page.$('header');
  if (header) {
    await header.screenshot({ path: path.join(OUT, `verif-header-${theme}.png`) });
  }

  // 2. Profile Card in About
  const about = await page.$('#about');
  if (about) {
    await about.screenshot({ path: path.join(OUT, `verif-about-profile-${theme}.png`) });
  }

  // 3. Credentials Section
  const credentials = await page.$('#credentials');
  if (credentials) {
    await credentials.screenshot({ path: path.join(OUT, `verif-credentials-${theme}.png`) });
  }

  // 4. Contact Block & Footer TitleBlock
  const contact = await page.$('#contact');
  if (contact) {
    await contact.screenshot({ path: path.join(OUT, `verif-contact-${theme}.png`) });
  }
  const footer = await page.$('footer');
  if (footer) {
    await footer.screenshot({ path: path.join(OUT, `verif-footer-${theme}.png`) });
  }

  await context.close();
}

// Also capture mobile view for credentials and about
const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
  locale: 'pt-BR',
});
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(`${BASE}/pt`, { waitUntil: 'networkidle' });
await mobilePage.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
  document.querySelectorAll('[data-drawn]').forEach((el) => el.setAttribute('data-drawn', 'true'));
});
await mobilePage.waitForTimeout(1000);

const mobileCredentials = await mobilePage.$('#credentials');
if (mobileCredentials) {
  await mobileCredentials.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobileCredentials.screenshot({ path: path.join(OUT, `verif-credentials-mobile-dark.png`) });
}

const mobileAbout = await mobilePage.$('#about');
if (mobileAbout) {
  await mobileAbout.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobileAbout.screenshot({ path: path.join(OUT, `verif-about-mobile-dark.png`) });
}

await mobileContext.close();
await browser.close();
console.log('Capture completed successfully!');
