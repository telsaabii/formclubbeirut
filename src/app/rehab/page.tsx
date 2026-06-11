import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { wa } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rehabilitation Programs",
  description:
    "Recovery-focused training, mobility work, and strength rebuilding at Form Club Beirut — coached with injuries in mind, after personal assessment.",
};

const PILLARS = [
  {
    n: "01",
    title: "Recovery-Focused Training",
    desc: "Structured sessions that respect where your body is today — load managed, progress measured, setbacks anticipated.",
  },
  {
    n: "02",
    title: "Mobility",
    desc: "Restore range before chasing intensity. Joint-by-joint mobility work that translates into pain-free movement.",
  },
  {
    n: "03",
    title: "Strength Rebuilding",
    desc: "From baseline back to performance. Progressive loading that rebuilds confidence along with capacity.",
  },
  {
    n: "04",
    title: "Injury-Conscious Coaching",
    desc: "Coaches who train around your limitation, not through it — in communication with your healthcare provider when needed.",
  },
] as const;

const STEPS = [
  {
    step: "Step 1",
    title: "Personal Assessment",
    desc: "Movement screening, history, and goals. We map where you are before planning where you're going.",
  },
  {
    step: "Step 2",
    title: "Tailored Program",
    desc: "A plan built around your assessment — session frequency, load progression, and clear milestones.",
  },
  {
    step: "Step 3",
    title: "Rebuild & Return",
    desc: "Coached sessions, reassessments, and a defined path back to full training — at your pace.",
  },
] as const;

/* ---------- step visuals — CSS-only loops, disabled under reduced motion ---------- */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Clipboard with a scanning line sweeping down — movement screening. */
function AssessmentVisual() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
      <rect x="10" y="7" width="28" height="35" rx="2" {...STROKE} />
      <path d="M19 7 h10 v4 h-10 z" {...STROKE} />
      <line x1="16" y1="18" x2="32" y2="18" {...STROKE} opacity={0.25} />
      <line x1="16" y1="25" x2="32" y2="25" {...STROKE} opacity={0.25} />
      <line x1="16" y1="32" x2="28" y2="32" {...STROKE} opacity={0.25} />
      <line className="rehab-scan" x1="14" y1="14" x2="34" y2="14" {...STROKE} />
    </svg>
  );
}

/** Checklist items ticking in one after another — the plan taking shape. */
function ProgramVisual() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
      {[0, 1, 2].map((row) => (
        <g
          key={row}
          className="rehab-tick"
          style={{ animationDelay: `${row * 0.55}s` }}
        >
          <path
            d={`M9 ${13 + row * 11} l3 3 l5 -6`}
            {...STROKE}
          />
          <line
            x1="23"
            y1={`${14 + row * 11}`}
            x2="40"
            y2={`${14 + row * 11}`}
            {...STROKE}
          />
        </g>
      ))}
    </svg>
  );
}

/** Bars climbing back up — strength returning over time. */
function RebuildVisual() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
      <line x1="8" y1="41" x2="40" y2="41" {...STROKE} opacity={0.4} />
      {[
        { x: 11, y: 29, h: 12, delay: 0 },
        { x: 20, y: 22, h: 19, delay: 0.25 },
        { x: 29, y: 14, h: 27, delay: 0.5 },
      ].map((bar) => (
        <rect
          key={bar.x}
          className="rehab-rise"
          style={{ animationDelay: `${bar.delay}s` }}
          x={bar.x}
          y={bar.y}
          width="6"
          height={bar.h}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

const STEP_VISUALS = [AssessmentVisual, ProgramVisual, RebuildVisual] as const;

export default function RehabPage() {
  return (
    <>
      <header className="hero-glow grain relative overflow-hidden px-5 pb-16 pt-36 text-center md:pb-24 md:pt-44">
        <div className="relative mx-auto max-w-3xl">
          <p className="kicker fade-rise">Rehabilitation programs</p>
          <h1
            className="display fade-rise mt-4 text-5xl text-bone sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.15s" }}
          >
            Come back <span className="text-violet-hi">stronger</span>
          </h1>
          <p
            className="fade-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-ash"
            style={{ animationDelay: "0.3s" }}
          >
            Injury shouldn&apos;t end your training — it should change how you
            train. Recovery-focused coaching that rebuilds movement, mobility,
            and strength, one assessment at a time.
          </p>
          <div className="fade-rise mt-9" style={{ animationDelay: "0.45s" }}>
            <a
              href={wa("Hi Form Club! I'd like to book a rehab assessment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Book a Personal Assessment
            </a>
          </div>
        </div>
      </header>

      {/* ---------- PILLARS ---------- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal selector="[data-reveal]">
            <SectionHeading
              kicker="The approach"
              title="Train around it, then through it"
              lead="Four principles guide every rehab program at Form Club."
            />
          </Reveal>

          <Reveal selector="[data-reveal]" className="mt-12 grid gap-5 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.n} data-reveal className="card p-8">
                <span className="font-mono text-xs tracking-[0.25em] text-violet-hi">
                  {p.n}
                </span>
                <h3 className="display mt-6 text-2xl text-bone md:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ash">{p.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="border-y border-line bg-raised py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal selector="[data-reveal]">
            <SectionHeading kicker="How it works" title="Assessment first, always" />
          </Reveal>

          <Reveal selector="[data-reveal]" className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const Visual = STEP_VISUALS[i];
              return (
              <div key={s.step} data-reveal className="relative">
                <div className="card h-full p-8">
                  <div className="flex items-start justify-between">
                    <span className="kicker">{s.step}</span>
                    <div className="text-violet-hi/80">
                      <Visual />
                    </div>
                  </div>
                  <h3 className="display mt-4 text-2xl text-bone">{s.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ash">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-violet-hi md:block"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </div>
              );
            })}
          </Reveal>

          <Reveal className="mt-14 text-center">
            <a
              href={wa("Hi Form Club! I'd like to book a rehab assessment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Start With an Assessment
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------- DISCLAIMER ---------- */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <p className="border-l-2 border-violet pl-5 text-sm leading-relaxed text-ash">
              Programs are tailored after assessment and do not replace medical
              advice. If you are recovering from surgery or a recent injury,
              consult your physician before beginning any training program.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
