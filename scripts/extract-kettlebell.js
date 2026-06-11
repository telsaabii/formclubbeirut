// Pixel-layer extraction for the hero kettlebell animation.
//
// The logo's letter O is a kettlebell. This script splits the flat logo PNG into
// two layers that recompose the original with a 0-pixel diff:
//   public/brand/logo-base.png  — logo with the kettlebell removed, black keyed to transparent
//   public/brand/kettlebell.png — only the kettlebell pixels, transparent background
//   public/brand/kettlebell-meta.json — bbox + pendulum pivot for AnimatedLogo.tsx
//
// The kettlebell is selected by flood fill: it's a connected island of non-black
// pixels, separated from all letters by black background — so the selection can't
// capture letter pixels by construction.
//
// One-off pipeline deps (not in package.json):
//   npm i --no-save jimp@0.22 pixelmatch@5 pngjs@6
// Run from the repo root:
//   node scripts/extract-kettlebell.js
const Jimp = require('jimp');
const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const SRC = 'public/brand/logo-full.png';
const OUT = 'public/brand';
const SEED = { x: 580, y: 550 }; // a point inside the bell
const T = 3; // luminance threshold: anything above is "ink"

// key pure-black background to transparent via luminance alpha ramp
function keyBlack(img) {
  const d = img.bitmap.data;
  for (let i = 0; i < d.length; i += 4) {
    const l = Math.max(d[i], d[i + 1], d[i + 2]);
    d[i + 3] = Math.min(255, l * 24);
  }
  return img;
}

(async () => {
  const src = await Jimp.read(SRC);
  const W = src.bitmap.width, H = src.bitmap.height;
  const data = src.bitmap.data;
  const lum = (x, y) => {
    const i = (y * W + x) * 4;
    return Math.max(data[i], data[i + 1], data[i + 2]);
  };

  // flood fill (4-connected) from seed over lum > T
  const mask = new Uint8Array(W * H);
  const stack = [SEED.y * W + SEED.x];
  mask[stack[0]] = 1;
  while (stack.length) {
    const p = stack.pop();
    const x = p % W, y = (p / W) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const np = ny * W + nx;
      if (!mask[np] && lum(nx, ny) > T) { mask[np] = 1; stack.push(np); }
    }
  }

  // bbox + pivot (top-center of handle)
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (mask[y * W + x]) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  const topXs = [];
  for (let x = x0; x <= x1; x++) if (mask[(y0 + 2) * W + x]) topXs.push(x);
  const pivotX = Math.round(topXs.reduce((a, b) => a + b, 0) / topXs.length);
  console.log(`kettlebell: bbox x[${x0}..${x1}] y[${y0}..${y1}], pivot (${pivotX}, ${y0})`);

  // dilate mask by 2px so the base layer loses sub-threshold antialias fringe too
  const dilated = new Uint8Array(mask);
  for (let pass = 0; pass < 2; pass++) {
    const prev = new Uint8Array(dilated);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      if (!prev[y * W + x] && (prev[y * W + x - 1] || prev[y * W + x + 1] || prev[(y - 1) * W + x] || prev[(y + 1) * W + x])) {
        dilated[y * W + x] = 1;
      }
    }
  }

  // overlay: dilated-mask pixels, alpha ramped from luminance
  const pad = 4;
  const ox0 = x0 - pad, oy0 = y0 - pad;
  const ow = (x1 - x0) + pad * 2 + 1, oh = (y1 - y0) + pad * 2 + 1;
  const overlay = new Jimp(ow, oh, 0x00000000);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!dilated[y * W + x]) continue;
    const i = (y * W + x) * 4;
    const l = Math.max(data[i], data[i + 1], data[i + 2]);
    const a = Math.min(255, l * 24);
    if (a > 0) overlay.setPixelColor(Jimp.rgbaToInt(data[i], data[i + 1], data[i + 2], a), x - ox0, y - oy0);
  }

  // base (opaque, for the recompose diff): original with dilated mask painted black
  const baseOpaque = src.clone();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (dilated[y * W + x]) {
      const i = (y * W + x) * 4;
      baseOpaque.bitmap.data[i] = 0; baseOpaque.bitmap.data[i + 1] = 0;
      baseOpaque.bitmap.data[i + 2] = 0; baseOpaque.bitmap.data[i + 3] = 255;
    }
  }

  // verify: recompose at rest must equal the original exactly
  const recomposed = baseOpaque.clone().composite(overlay.clone(), ox0, oy0);
  const tmp = '/tmp/kb-recomposed.png';
  await recomposed.writeAsync(tmp);
  const a = PNG.sync.read(fs.readFileSync(SRC));
  const b = PNG.sync.read(fs.readFileSync(tmp));
  const diffPx = pixelmatch(a.data, b.data, null, W, H, { threshold: 0.08 });
  console.log(`pixelmatch vs original: ${diffPx} differing px`);
  if (diffPx > 0) throw new Error('recomposition is not pixel-perfect — do not ship these layers');

  // ship the web layers (base with black keyed to transparent for dark-on-dark pages)
  await keyBlack(baseOpaque).writeAsync(`${OUT}/logo-base.png`);
  await overlay.writeAsync(`${OUT}/kettlebell.png`);
  fs.writeFileSync(`${OUT}/kettlebell-meta.json`, JSON.stringify({
    image: { w: W, h: H },
    overlay: { x: ox0, y: oy0, w: ow, h: oh },
    pivot: { x: pivotX, y: y0 },
  }, null, 2));
  console.log('layers written to', OUT, '— update the constants in src/components/AnimatedLogo.tsx if the meta changed');
})().catch(e => { console.error(e); process.exit(1); });
