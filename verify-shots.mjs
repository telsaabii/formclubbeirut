// Visual verification: screenshots of every page, desktop + mobile,
// plus hero alignment (reduced motion = layers at rest) and mid-swing states.
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "/tmp/formclub-shots";
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  ["home", "/"],
  ["memberships", "/memberships"],
  ["trainers", "/trainers"],
  ["rehab", "/rehab"],
  ["contact", "/contact"],
];

const browser = await chromium.launch();

// --- 1. hero at rest (reduced motion): layer alignment must recompose the logo ---
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/hero-at-rest.png` });
  await ctx.close();
}

// --- 2. hero animated (mid-swing) ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(2600); // entrance done, swing in progress
  await p.screenshot({ path: `${OUT}/hero-swinging.png` });
  await ctx.close();
}

// --- 3. all pages, desktop full-page + mobile full-page ---
for (const [name, path] of pages) {
  for (const [label, vp] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const ctx = await browser.newContext({ viewport: vp, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    const errors = [];
    p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    p.on("pageerror", (e) => errors.push(String(e)));
    await p.goto(BASE + path, { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/${name}-${label}.png`, fullPage: true });
    if (errors.length) console.log(`[${name}-${label}] console errors:`, errors);
    await ctx.close();
  }
}

// --- 4. mobile nav open ---
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.click('button[aria-label="Open menu"]');
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/mobile-nav-open.png` });
  await ctx.close();
}

await browser.close();
console.log("shots written to", OUT);
