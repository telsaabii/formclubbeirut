# Agent instructions — Form Club Beirut proposal site

Premium animated proposal website for a gym in Verdun, Beirut.
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP.

## Initialize and run (from a fresh clone)

```bash
git clone https://github.com/telsaabii/formclubbeirut.git
cd formclubbeirut
npm install          # Node 20+ required (Node 24 known good)
npm run dev          # → http://localhost:3000
```

Production:

```bash
npm run build        # must pass with zero errors
npm start            # serve the production build on :3000
```

If port 3000 is taken: `lsof -ti :3000 | xargs kill -9` — a stale `next start`
serving an old build causes confusing 404/500s on assets.

## Checks to run before claiming work is done

```bash
npm run lint         # ESLint, zero errors expected
npx tsc --noEmit     # typecheck, zero errors expected
npm run build        # all routes must prerender statically
```

Visual verification (optional, used during development):

```bash
npx playwright install chromium   # one-time browser download
npm start &
node verify-shots.mjs             # screenshots every page → /tmp/formclub-shots
```

## Architecture

- `src/app/` — pages: `/` (landing), `/memberships`, `/trainers`, `/rehab`, `/contact`
- `src/components/` — `AnimatedLogo` (hero kettlebell), `Reveal` (GSAP scroll
  reveals), `Navbar`, `Footer`, `MapCard` (custom SVG map, no maps API),
  `Marquee`, `SectionHeading`, `WhatsAppIcon`
- `src/lib/site.ts` — **all client-replaceable constants**: WhatsApp number,
  Google Maps link, nav links, service copy
- Design tokens live in `src/app/globals.css` under `@theme` (Tailwind v4 —
  there is no `tailwind.config`)

## Critical invariants — do not break

1. **The hero logo is two pixel-locked layers.** `public/brand/logo-base.png`
   (logo minus kettlebell) + `public/brand/kettlebell.png` (kettlebell only)
   recompose the original logo exactly. The percentages and the
   `transform-origin` in `src/components/AnimatedLogo.tsx` are derived from
   `public/brand/kettlebell-meta.json`. Never reposition, recrop, or re-export
   these images by hand — regenerate them with
   `node scripts/extract-kettlebell.js` (see the header of that file for its
   one-off deps).
2. **All animations must respect `prefers-reduced-motion`.** GSAP work goes
   through `gsap.matchMedia()` (see `AnimatedLogo.tsx`, `Reveal.tsx`); CSS
   animations are disabled in the media query at the bottom of `globals.css`.
3. **No backend.** The contact form intentionally composes a `wa.me` message —
   WhatsApp is the primary contact channel. Don't add fake form endpoints.
4. **After replacing any file in `public/brand/`**, delete
   `.next/cache/images` before judging the result — the image optimizer cache
   survives rebuilds and will serve stale variants per srcset width.

## Placeholder content (client data pending)

Sample data is flagged on-site with dashed "Sample / Placeholder" badges.
Replace when real data arrives:

| What | Where |
| --- | --- |
| WhatsApp number `+961 3 855 084` | `src/lib/site.ts` |
| Membership pricing tiers | `src/app/memberships/page.tsx` → `TIERS` |
| Class schedule grid | `src/app/memberships/page.tsx` → `SCHEDULE` |
| Trainer profiles + photos | `src/app/trainers/page.tsx` → `TRAINERS` |
| Exact street address | landing + contact location sections |
| Instagram handle `@formclubbeirut` | landing page team section |
