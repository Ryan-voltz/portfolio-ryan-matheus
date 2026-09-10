import { chromium } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';

const artifactDir = 'C:\\Users\\Pedro Henrique\\.gemini\\antigravity\\brain\\7f260f82-2a52-4de2-9b80-b96ee811421b';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warn') {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  console.log('Navigating to http://127.0.0.1:3000/pt ...');
  await page.goto('http://127.0.0.1:3000/pt', { waitUntil: 'networkidle' });

  // 1. Ensure dark theme is active
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(1000);

  // Capture Hero Desktop Dark
  await page.screenshot({
    path: path.join(artifactDir, 'verif-senior-hero-dark.png'),
    clip: { x: 0, y: 0, width: 1440, height: 860 },
  });
  console.log('✔ Captured verif-senior-hero-dark.png');

  // Test 3D interaction: drag on the 3D canvas
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 50, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    console.log('✔ Successfully interacted with 3D Three.js canvas (mouse drag)');
  }

  // Scroll to About section and capture Profile Showcase
  const aboutSec = page.locator('#about');
  await aboutSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(artifactDir, 'verif-senior-about-profile-dark.png'),
    clip: { x: 0, y: 850, width: 1440, height: 950 },
  });
  console.log('✔ Captured verif-senior-about-profile-dark.png');

  // Scroll to Footer
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(artifactDir, 'verif-senior-footer-dark.png'),
    clip: { x: 0, y: (await footer.boundingBox())?.y || 3000, width: 1440, height: 400 },
  });
  console.log('✔ Captured verif-senior-footer-dark.png');

  // Switch to Light Mode and capture Hero & About
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.waitForTimeout(600);

  const hero = page.locator('#top');
  await hero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(artifactDir, 'verif-senior-hero-light.png'),
    clip: { x: 0, y: 0, width: 1440, height: 860 },
  });
  console.log('✔ Captured verif-senior-hero-light.png');

  // Mobile Viewport (iPhone 14 / 390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:3000/pt', { waitUntil: 'networkidle' });
  await mobilePage.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await mobilePage.waitForTimeout(800);

  await mobilePage.screenshot({
    path: path.join(artifactDir, 'verif-senior-mobile-hero-dark.png'),
    clip: { x: 0, y: 0, width: 390, height: 844 },
  });
  console.log('✔ Captured verif-senior-mobile-hero-dark.png');

  const mobileAbout = mobilePage.locator('#about');
  await mobileAbout.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);

  await mobilePage.screenshot({
    path: path.join(artifactDir, 'verif-senior-mobile-about-dark.png'),
    clip: { x: 0, y: (await mobileAbout.boundingBox())?.y || 1600, width: 390, height: 900 },
  });
  console.log('✔ Captured verif-senior-mobile-about-dark.png');

  await browser.close();

  if (consoleLogs.length > 0) {
    console.log('Console issues:', consoleLogs);
  } else {
    console.log('✔ 0 console warnings or errors detected!');
  }
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});

