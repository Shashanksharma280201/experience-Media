/**
 * Accessibility + layout audit.
 *
 * Runs axe-core against every route at desktop and mobile, and separately
 * checks for horizontal overflow across the full responsive range the brief
 * requires (320px to 3440px).
 *
 * usage: node scripts/audit.mjs
 */
import { chromium } from "playwright";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve("axe-core");

const port = process.env.PORT ?? "3123";
const ROUTES = ["/", "/work", "/work/motion-graphics", "/work/short-format", "/nope"];
const WIDTHS = [320, 360, 390, 768, 1024, 1440, 1920, 2560, 3440];

const browser = await chromium.launch({ channel: "chrome" });
let violations = 0;

console.log("— axe-core —");
for (const route of ROUTES) {
  for (const vp of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${port}${route}`, { waitUntil: "networkidle" });
    await page.addScriptTag({ path: AXE_PATH });
    const res = await page.evaluate(async () =>
      // @ts-expect-error injected global
      await window.axe.run(document, {
        runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      })
    );
    const bad = res.violations;
    violations += bad.length;
    const label = `${route} @${vp.name}`.padEnd(38);
    if (bad.length === 0) {
      console.log(`  ${label} clean`);
    } else {
      console.log(`  ${label} ${bad.length} violation(s)`);
      for (const v of bad) {
        console.log(`      [${v.impact}] ${v.id}: ${v.help}`);
        for (const n of v.nodes.slice(0, 2)) {
          console.log(`         ${n.target.join(" ")}`);
        }
      }
    }
    await ctx.close();
  }
}

console.log("\n— horizontal overflow —");
let overflow = 0;
for (const route of ROUTES.slice(0, 4)) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${port}${route}`, { waitUntil: "networkidle" });
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (over > 0) {
      overflow++;
      console.log(`  ${route} @${width}px  OVERFLOW +${over}px`);
    }
    await ctx.close();
  }
}
if (overflow === 0) console.log(`  none across ${WIDTHS.join(", ")}px`);

await browser.close();
console.log(`\nviolations: ${violations}  overflow: ${overflow}`);
process.exit(violations + overflow > 0 ? 1 : 0);
