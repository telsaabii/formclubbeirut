"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * The real logo, split into two pixel-perfect layers (see /brand/kettlebell-meta.json):
 *  - logo-base.png   — the original PNG with the kettlebell blacked out
 *  - kettlebell.png  — only the kettlebell pixels, background keyed to transparent
 * At rest the layers recompose the original logo with a 0px diff. GSAP swings the
 * kettlebell from the top of its handle like a real pendulum.
 */
const IMG = { w: 1502, h: 1142 };
const OV = { x: 413, y: 351, w: 330, h: 373 };
const PIVOT = { x: 580, y: 355 };

// landing bloom — a square sized off the kettlebell, centered on its body
// (not the handle), drawn in front with mix-blend screen so the logo PNG's
// dark anti-aliased edges brighten instead of reading as an outline
const BLOOM = {
  size: OV.w * 2.6,
  cx: OV.x + OV.w / 2,
  cy: OV.y + OV.h * 0.62,
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function AnimatedLogo({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const kb = useRef<HTMLDivElement>(null);
  const bloom = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();
        // the kettlebell drops into the wordmark, lands with weight…
        tl.from(kb.current, {
          yPercent: -56,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        }, 0.55)
          .to(kb.current, {
            keyframes: [
              { yPercent: -7, duration: 0.16, ease: "power1.out" },
              { yPercent: 0, duration: 0.14, ease: "power2.in" },
              { yPercent: -2.5, duration: 0.12, ease: "power1.out" },
              { yPercent: 0, duration: 0.12, ease: "power2.in" },
            ],
          })
          // …then hangs and swings forever
          .to(kb.current, { rotation: -3.6, duration: 0.9, ease: "sine.out" })
          .to(kb.current, {
            rotation: 3.6,
            duration: 2.1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          })
          // violet bloom flashes the instant the bell lands (drop ends at 0.73)
          .fromTo(
            bloom.current,
            { opacity: 0, scale: 0.55 },
            { opacity: 1, scale: 1, duration: 0.12, ease: "power3.out" },
            0.73
          )
          .to(
            bloom.current,
            { opacity: 0, scale: 1.5, duration: 0.75, ease: "power2.out" },
            0.85
          );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      role="img"
      aria-label="Form Club Beirut — the FORM wordmark with a kettlebell as the letter O"
      className={`relative ${className ?? ""}`}
      style={{ aspectRatio: `${IMG.w} / ${IMG.h}` }}
    >
      <Image
        src="/brand/logo-base.png"
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 100vw, 880px"
        className="object-contain"
      />
      <div
        ref={kb}
        className="absolute will-change-transform"
        style={{
          left: pct(OV.x, IMG.w),
          top: pct(OV.y, IMG.h),
          width: pct(OV.w, IMG.w),
          height: pct(OV.h, IMG.h),
          transformOrigin: `${((PIVOT.x - OV.x) / OV.w) * 100}% ${((PIVOT.y - OV.y) / OV.h) * 100}%`,
        }}
      >
        <Image
          src="/brand/kettlebell.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 22vw, 200px"
          className="object-contain"
        />
      </div>
      <div
        ref={bloom}
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0 mix-blend-screen will-change-transform"
        style={{
          left: pct(BLOOM.cx - BLOOM.size / 2, IMG.w),
          top: pct(BLOOM.cy - BLOOM.size / 2, IMG.h),
          width: pct(BLOOM.size, IMG.w),
          height: pct(BLOOM.size, IMG.h),
          background:
            "radial-gradient(circle, rgba(154, 99, 239, 0.8) 0%, rgba(124, 63, 217, 0.34) 32%, rgba(92, 40, 173, 0.1) 55%, transparent 72%)",
        }}
      />
    </div>
  );
}
