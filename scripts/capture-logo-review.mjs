import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';
import path from 'node:path';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const outDir = path.resolve('public/shots');

async function capture() {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });

  // 1. Desktop Light Mode
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: 'light',
    });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/pt', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    });
    await page.waitForTimeout(500);

    // Screenshot Header
    const header = await page.locator('header');
    await header.screenshot({ path: path.join(outDir, 'review-header-light.png') });

    // Screenshot Profile Card in About section
    const profileCard = await page.locator('#about .marks .rounded-2xl').first();
    await profileCard.screenshot({ path: path.join(outDir, 'review-profile-light.png') });

    // Screenshot Footer
    const footer = await page.locator('footer');
    await footer.screenshot({ path: path.join(outDir, 'review-footer-light.png') });

    await ctx.close();
  }

  // 2. Desktop Dark Mode
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: 'dark',
    });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/pt', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(500);

    // Screenshot Header
    const header = await page.locator('header');
    await header.screenshot({ path: path.join(outDir, 'review-header-dark.png') });

    // Screenshot Profile Card in About section
    const profileCard = await page.locator('#about .marks .rounded-2xl').first();
    await profileCard.screenshot({ path: path.join(outDir, 'review-profile-dark.png') });

    // Screenshot Footer
    const footer = await page.locator('footer');
    await footer.screenshot({ path: path.join(outDir, 'review-footer-dark.png') });

    await ctx.close();
  }

  // 3. Mobile Header (Light & Dark)
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      colorScheme: 'light',
    });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/pt', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    });
    await page.waitForTimeout(500);

    const header = await page.locator('header');
    await header.screenshot({ path: path.join(outDir, 'review-header-mobile-light.png') });

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(500);
    await header.screenshot({ path: path.join(outDir, 'review-header-mobile-dark.png') });

    await ctx.close();
  }

  await browser.close();
  console.log('Finished capturing review screenshots in public/shots/');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});

