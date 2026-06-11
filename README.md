# Form Club Beirut — Proposal Website

Premium animated proposal site for Form Club Beirut (Verdun). Next.js 16 +
TypeScript + Tailwind v4 + GSAP.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve production build
```

## The hero kettlebell

The logo's letter **O is a kettlebell**. The hero animates the *real* logo
pixels, not a recreation:

- `public/brand/logo-base.png` — the original logo PNG with the kettlebell
  removed and the black background keyed to transparent.
- `public/brand/kettlebell.png` — only the kettlebell pixels (extracted via
  flood fill, so no letter fragments), transparent background.
- `public/brand/kettlebell-meta.json` — bounding box + pendulum pivot
  coordinates used by `src/components/AnimatedLogo.tsx`.

At rest the two layers recompose the original logo with a **0-pixel diff**
(verified with pixelmatch). GSAP swings the kettlebell layer from the top of
its handle. The extraction script lives at `scripts/extract-kettlebell.js`
(see its header comment for the one-off deps it needs).

If the client ever supplies a new logo, re-run the extraction and replace the
three files above.

## Placeholder content to replace before launch

| What | Where |
| --- | --- |
| WhatsApp number (`+961 3 855 084`) | `src/lib/site.ts` |
| Membership pricing (sample tiers) | `src/app/memberships/page.tsx` → `TIERS` |
| Class schedule (placeholder grid) | `src/app/memberships/page.tsx` → `SCHEDULE` |
| Trainer profiles + photos | `src/app/trainers/page.tsx` → `TRAINERS` |
| Exact street address | landing + contact location sections |
| Instagram handle (`@formclubbeirut`) | landing page team section |
| Opening hours | not yet shown — add when known |

Sample data is visually marked on-site with dashed “Sample / Placeholder”
badges so the client can spot it instantly.

## Visual verification

`verify-shots.mjs` screenshots every page (desktop + mobile + reduced-motion
hero alignment) against a running server:

```bash
npm start &
node verify-shots.mjs   # writes to /tmp/formclub-shots
```
