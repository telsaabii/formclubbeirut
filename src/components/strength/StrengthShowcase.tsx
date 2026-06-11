"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/components/SectionHeading";
import { SERVICES } from "@/lib/site";
import {
  CombatScene,
  FitnessScene,
  RehabScene,
  TrainingScene,
} from "./scenes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SCENES = [FitnessScene, TrainingScene, CombatScene, RehabScene] as const;

/** Prime [data-draw] strokes so they can be drawn in (dashoffset → 0). */
function primeDraw(scope: Element) {
  const paths = gsap.utils.toArray<SVGGeometryElement>("[data-draw]", scope);
  paths.forEach((p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });
  return paths;
}

/** Perpetual motion loops — one kinetic system per scene. Returns the
 *  tweens/timelines so playback can be gated on section visibility. */
function buildLoops(root: HTMLElement) {
  const q = (sel: string) => root.querySelector<SVGElement>(sel);
  const geo = (sel: string) => root.querySelector<SVGGeometryElement>(sel);
  const loops: (gsap.core.Tween | gsap.core.Timeline)[] = [];

  // 01 — kettlebell ballistic pendulum (pivot 210 92); the purple energy
  // segment tracks the bell along the trajectory arc via a dash window
  // driven by the same duration/ease, so the two stay phase-locked.
  // positive rotation swings a below-pivot bell LEFT, so +34 = arc start
  loops.push(
    gsap.fromTo(
      q("[data-kb-swing]"),
      { rotation: 34, svgOrigin: "210 92" },
      {
        rotation: -34,
        duration: 1.1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      }
    )
  );
  const trail = geo("[data-kb-trail]");
  if (trail) {
    const len = trail.getTotalLength();
    const seg = len * 0.22;
    gsap.set(trail, { strokeDasharray: `${seg} ${len}` });
    // offset = seg/2 − arcPosition(θ); arc spans −40°..40°, bell ±34°
    loops.push(
      gsap.fromTo(
        trail,
        { strokeDashoffset: seg / 2 - 0.075 * len },
        {
          strokeDashoffset: seg / 2 - 0.925 * len,
          duration: 1.1,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        }
      )
    );
  }
  loops.push(
    gsap.to(q("[data-plate]"), {
      rotation: 360,
      svgOrigin: "84 108",
      duration: 10,
      ease: "none",
      repeat: -1,
    })
  );

  // 02 — data flows coach → athlete: link dash drift, a traveling pulse
  // dot, expanding sonar rings on both nodes, graph points breathing.
  loops.push(
    gsap.to(q("[data-link]"), {
      strokeDashoffset: -96, // 6 full dash periods (7+9) → seamless wrap
      duration: 3,
      ease: "none",
      repeat: -1,
    })
  );
  const dot = q("[data-link-dot]");
  if (dot) {
    const pulse = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    pulse
      .fromTo(dot, { attr: { cx: 118 }, opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .to(dot, { attr: { cx: 302 }, duration: 1.5, ease: "power1.inOut" }, 0)
      .to(dot, { opacity: 0, duration: 0.2 }, 1.3);
    loops.push(pulse);
  }
  gsap.utils.toArray<SVGElement>("[data-sonar]", root).forEach((ring, i) => {
    loops.push(
      gsap.fromTo(
        ring,
        { scale: 0.5, opacity: 0.7, transformOrigin: "50% 50%" },
        {
          scale: 2,
          opacity: 0,
          duration: 2,
          ease: "power1.out",
          repeat: -1,
          delay: i,
        }
      )
    );
  });
  loops.push(
    gsap.to(gsap.utils.toArray("[data-gdot]", root), {
      attr: { r: 5 },
      duration: 0.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.18,
    })
  );

  // 03 — strike lands: streak draws in fast, impact rings burst at the
  // contact point (264 152), the bag recoils at its mount (292 34) and
  // settles elastically; the streak erases tail-first.
  const strikes = gsap.utils.toArray<SVGGeometryElement>("[data-strike]", root);
  if (strikes.length) {
    const sLen = strikes[0].getTotalLength();
    const hit = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
    hit
      .set(strikes, { strokeDasharray: sLen, strokeDashoffset: sLen })
      .to(strikes, { strokeDashoffset: 0, duration: 0.16, ease: "power3.in" })
      .fromTo(
        q("[data-speed]"),
        { opacity: 0, x: -14 },
        { opacity: 0.7, x: 0, duration: 0.16, ease: "power2.out" },
        "<"
      )
      .to(
        q("[data-bag]"),
        // negative = bag bottom kicks away from the strike (rightward)
        { rotation: -7, svgOrigin: "292 34", duration: 0.18, ease: "power2.out" },
        "-=0.05"
      )
      .fromTo(
        q("[data-ring]"),
        { scale: 0.2, opacity: 0.9, transformOrigin: "50% 50%" },
        { scale: 1.6, opacity: 0, duration: 0.6, ease: "power2.out" },
        "-=0.12"
      )
      .fromTo(
        q("[data-ring2]"),
        { scale: 0.2, opacity: 0.7, transformOrigin: "50% 50%" },
        { scale: 1.1, opacity: 0, duration: 0.5, ease: "power2.out" },
        "-=0.52"
      )
      .to(strikes, { strokeDashoffset: -sLen, duration: 0.3, ease: "power2.out" }, "-=0.5")
      .to(q("[data-speed]"), { opacity: 0, duration: 0.3 }, "<")
      .to(
        q("[data-bag]"),
        { rotation: 0, duration: 1.4, ease: "elastic.out(1, 0.32)" },
        "-=0.3"
      );
    loops.push(hit);
  }

  // 04 — range of motion: lever sweeps 150° while the protractor arc draws
  // in sync; the posture segment snaps into alignment, drifts, snaps again.
  const arc = geo("[data-rom-arc]");
  if (arc) {
    const len = arc.getTotalLength();
    gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
    const rom = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.5 });
    rom
      .fromTo(
        q("[data-rom-lever]"),
        { rotation: 0, svgOrigin: "170 170" },
        { rotation: -150, duration: 1.9, ease: "power1.inOut" }
      )
      .to(arc, { strokeDashoffset: 0, duration: 1.9, ease: "power1.inOut" }, 0);
    loops.push(rom);
  }
  const align = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
  align
    .fromTo(
      q("[data-align]"),
      { rotation: 8, svgOrigin: "344 167" },
      { rotation: 0, duration: 0.9, ease: "back.out(2.5)" }
    )
    .fromTo(
      q("[data-align-ticks]"),
      { opacity: 0.15 },
      { opacity: 0.8, duration: 0.4, ease: "power1.out" },
      "-=0.4"
    )
    .to(q("[data-align-ticks]"), { opacity: 0.35, duration: 0.6 }, "+=0.8")
    .to(q("[data-align]"), { rotation: 8, duration: 0.7, ease: "sine.inOut" }, "+=0.2");
  loops.push(align);
  const ekg = geo("[data-ekg]");
  if (ekg) {
    const len = ekg.getTotalLength();
    const seg = len * 0.35;
    gsap.set(ekg, { strokeDasharray: `${seg} ${len}` });
    loops.push(
      gsap.fromTo(ekg, { strokeDashoffset: seg }, {
        strokeDashoffset: -len,
        duration: 2.4,
        ease: "none",
        repeat: -1,
      })
    );
  }

  // shared: soft breathing on every [data-pulse] energy marker
  loops.push(
    gsap.fromTo(
      gsap.utils.toArray("[data-pulse]", root),
      { opacity: 0.3 },
      {
        opacity: 0.95,
        duration: 1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
      }
    )
  );

  return loops;
}

/**
 * "Every form of strength" — scroll-driven discipline showcase.
 * Desktop (motion-safe): the section pins and scrolling scrubs through the
 * four disciplines, each with an animated line-art scene. Mobile and
 * prefers-reduced-motion: panels stack as a normal column.
 */
export default function StrengthShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", el);
      const rail = gsap.utils.toArray<HTMLElement>("[data-rail-item]", el);
      const mm = gsap.matchMedia();

      // Motion loops run wherever motion is allowed, at any width — but
      // only tick while the section is actually on screen. Visibility is
      // tracked with IntersectionObserver, not ScrollTrigger: the desktop
      // pin keeps the section on screen long past its layout position, so
      // position-based start/end math would pause the loops mid-pin.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loops = buildLoops(el);
        loops.forEach((l) => l.pause(0));
        const io = new IntersectionObserver(([entry]) => {
          loops.forEach((l) => (entry.isIntersecting ? l.play() : l.pause()));
        });
        io.observe(el);
        return () => io.disconnect();
      });

      // Mobile: stacked panels, each scene draws itself in on first view.
      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 1023px)",
        () => {
          panels.forEach((panel) => {
            const paths = primeDraw(panel);
            gsap.to(paths, {
              strokeDashoffset: 0,
              duration: 1.1,
              stagger: 0.05,
              ease: "power2.out",
              scrollTrigger: { trigger: panel, start: "top 85%", once: true },
            });
          });
        }
      );

      // Desktop: pin the section and scrub through the disciplines.
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        () => {
          gsap.set(panels.slice(1), { autoAlpha: 0 });
          gsap.set(rail.slice(1), { opacity: 0.3 });

          // first scene draws as the section arrives
          const first = primeDraw(panels[0]);
          gsap.to(first, {
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 70%", once: true },
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=350%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          tl.to({}, { duration: 0.7 }); // hold on Fitness
          for (let k = 1; k < panels.length; k++) {
            const paths = primeDraw(panels[k]);
            tl.to(panels[k - 1], {
              autoAlpha: 0,
              y: -50,
              duration: 0.4,
              ease: "power1.in",
            })
              .fromTo(
                panels[k],
                { autoAlpha: 0, y: 60 },
                { autoAlpha: 1, y: 0, duration: 0.45, ease: "power1.out" },
                "<0.2"
              )
              .to(
                paths,
                { strokeDashoffset: 0, duration: 0.55, stagger: 0.03, ease: "none" },
                "<"
              )
              .to(rail[k - 1], { opacity: 0.3, duration: 0.2 }, "<")
              .to(rail[k], { opacity: 1, duration: 0.2 }, "<")
              .to({}, { duration: 0.7 }); // hold
          }
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative py-24 md:py-32 motion-safe:lg:flex motion-safe:lg:h-svh motion-safe:lg:flex-col motion-safe:lg:justify-center motion-safe:lg:py-0 motion-safe:lg:pt-16"
    >
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHeading
          kicker="What we do"
          title="Every form of strength"
          lead="Four disciplines, one standard. Pick your lane — or train across all of them."
        />

        <div className="relative mt-14 motion-safe:lg:mt-10 motion-safe:lg:h-[58vh]">
          {/* progress rail (pinned mode only) */}
          <ol
            aria-hidden="true"
            className="absolute -left-2 top-1/2 hidden -translate-y-1/2 flex-col gap-5 font-mono text-[0.65rem] tracking-[0.2em] text-violet-hi motion-safe:lg:flex"
          >
            {SERVICES.map((s) => (
              <li key={s.n} data-rail-item>
                {s.n}
              </li>
            ))}
          </ol>

          <div className="space-y-20 motion-safe:lg:h-full motion-safe:lg:space-y-0">
            {SERVICES.map((s, i) => {
              const Scene = SCENES[i];
              return (
                <article
                  key={s.n}
                  data-panel
                  className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:pl-12"
                >
                  <div>
                    <p className="font-mono text-xs tracking-[0.25em] text-violet-hi">
                      {s.n} / 04
                    </p>
                    <h3 className="display mt-5 text-4xl text-bone md:text-5xl">
                      {s.title}
                    </h3>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-ash md:text-base">
                      {s.blurb}
                    </p>
                    <Link href={s.href} className="btn btn-ghost mt-8">
                      Explore {s.title} →
                    </Link>
                  </div>
                  <div data-scene>
                    <Scene />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
