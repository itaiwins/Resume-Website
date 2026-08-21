// Screenshots a scroll-driven page at fixed scroll fractions.
//   node scripts/shoot.mjs http://localhost:3000/lab/a A 0,0.25,0.5,1
// Software WebGL needs --use-angle=swiftshader; note that troika/SDF text
// crashes the context there, which is part of why the lab uses <Html>.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2];
const tag = process.argv[3] || 'shot';
const stops = (process.argv[4] || '0,0.2,0.4,0.6,0.8,1').split(',').map(Number);
const W = Number(process.argv[5] || 1440);
const H = Number(process.argv[6] || 900);
const OUT = process.env.SHOT_DIR || '.shots';

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: [
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    `--window-size=${W},${H}`,
  ],
});
mkdirSync(OUT, { recursive: true });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: W < 500, hasTouch: W < 500 });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise((r) => setTimeout(r, 3500));

for (const s of stops) {
  await page.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * frac);
  }, s);
  await new Promise((r) => setTimeout(r, 1600));
  const name = `${OUT}/${tag}-${String(Math.round(s * 100)).padStart(3, '0')}.png`;
  await page.screenshot({ path: name });
  console.log('shot', name);
}

console.log(errors.length ? errors.slice(0, 12).join('\n') : 'no console errors');
await browser.close();
