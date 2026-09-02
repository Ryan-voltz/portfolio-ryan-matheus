// Performance baseline / regression measurement on the built site.
// Usage: node scripts/perf.mjs [baseUrl]
//
// Emulates a mid-range phone on a throttled connection, which is the real
// scene for this site: a buyer opening it on a phone between meetings.

import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3210';
const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));

const kb = (n) => `${(n / 1024).toFixed(1)}kB`;

async function measure(label, url, { mobile }) {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: mobile ? 3 : 2,
    isMobile: mobile,
    hasTouch: mobile,
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  });
  const page = await context.newPage();

  const byType = {};
  let total = 0;
  page.on('response', async (r) => {
    try {
      const h = r.headers();
      const len = Number(h['content-length'] ?? 0);
      const type = (h['content-type'] ?? 'other').split(';')[0];
      const size = len || (await r.body().catch(() => Buffer.alloc(0))).length;
      byType[type] = (byType[type] ?? { n: 0, bytes: 0 });
      byType[type].n++;
      byType[type].bytes += size;
      total += size;
    } catch {
      /* response body gone */
    }
  });

  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  if (mobile) {
    // Slow 4G-ish, and a 4x CPU slowdown for a mid-range Android.
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'load', timeout: 90_000 });

  // Collect Core Web Vitals from the page itself.
  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = { lcp: 0, cls: 0, fcp: 0, ttfb: 0 };
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav) out.ttfb = Math.round(nav.responseStart);
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcp) out.fcp = Math.round(fcp.startTime);
        try {
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) out.lcp = Math.round(e.startTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value;
          }).observe({ type: 'layout-shift', buffered: true });
        } catch {
          /* unsupported */
        }
        setTimeout(() => resolve(out), 3500);
      }),
  );

  const dom = await page.evaluate(() => ({
    nodes: document.getElementsByTagName('*').length,
    depth: (function d(el, n = 0) {
      let max = n;
      for (const c of el.children) max = Math.max(max, d(c, n + 1));
      return max;
    })(document.body),
    images: document.images.length,
    observers: 0,
  }));

  const loadMs = Date.now() - t0;
  console.log(`\n── ${label} ${mobile ? '(mobile, 4x CPU, ~1.6Mbps)' : '(desktop)'} ──`);
  console.log(`  TTFB ${vitals.ttfb}ms   FCP ${vitals.fcp}ms   LCP ${vitals.lcp}ms   CLS ${vitals.cls.toFixed(4)}`);
  console.log(`  load ${loadMs}ms   transferred ${kb(total)}   DOM ${dom.nodes} nodes, depth ${dom.depth}, ${dom.images} imgs`);
  const rows = Object.entries(byType).sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 7);
  for (const [type, v] of rows) console.log(`    ${type.padEnd(28)} ${String(v.n).padStart(3)} req  ${kb(v.bytes)}`);

  await browser.close();
  return { vitals, total, loadMs, dom };
}

await measure('HOME', BASE + '/', { mobile: true });
await measure('HOME', BASE + '/', { mobile: false });
await measure('CASE /work/volare', BASE + '/work/volare', { mobile: true });
