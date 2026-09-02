/**
 * Screenshot the running site at desktop and mobile.
 *
 * Captures the RESTING state by emulating `prefers-reduced-motion: reduce`,
 * so scroll-triggered reveals resolve to their end state instead of showing
 * the pre-trigger frame. Design review needs the resting composition; motion
 * is reviewed live in a browser.
 *
 * usage: node scripts/shoot.mjs <path> <label> [--motion]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [, , path = "/", label = "shot", ...flags] = process.argv;
const motion = flags.includes("--motion");
const port = process.env.PORT ?? "3123";
const out = process.env.SHOT_DIR ?? "/tmp/shots";
mkdirSync(out, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

// Use the system Chrome rather than pulling Playwright's own build.
const browser = await chromium.launch({ channel: "chrome" });

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    reducedMotion: motion ? "no-preference" : "reduce",
  });
  const page = await context.newPage();
  await page.goto(`http://localhost:${port}${path}`, { waitUntil: "networkidle" });

  // Clear the load sequence, then let lazy images settle.
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(motion ? 3000 : 900);
  await page.evaluate(async () => {
    // Walk the page so lazy-loaded images and any scroll reveals resolve.
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });

  const file = `${out}/${label}-${vp.name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(file);
  await context.close();
}

await browser.close();
