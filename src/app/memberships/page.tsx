import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { wa } from "@/lib/site";

export const metadata: Metadata = {
  title: "Memberships & Classes",
  description:
    "Membership plans, class schedule, and featured classes at Form Club Beirut — Verdun.",
};

/* ---------- SAMPLE DATA — replace with the club's real pricing & schedule ---------- */

const TIERS = [
  {
    name: "Essential",
    price: "$45",
    period: "/ month",
    blurb: "Full gym access during staffed hours.",
    features: [
      "Open gym floor access",
      "Locker room & showers",
      "Intro orientation session",
      "Member WhatsApp community",
    ],
    featured: false,
  },
  {
    name: "Unlimited",
    price: "$75",
    period: "/ month",
    blurb: "Everything, including all group classes.",
    features: [
      "Everything in Essential",
      "Unlimited group classes",
      "Group Muay Thai included",
      "Monthly progress check-in",
      "Guest pass — 1 / month",
    ],
    featured: true,
  },
  {
    name: "Elite 1-on-1",
    price: "$190",
    period: "/ month",
    blurb: "Unlimited membership plus personal coaching.",
    features: [
      "Everything in Unlimited",
      "8 personal training sessions",
      "Personalized program & nutrition guidance",
      "Priority booking",
    ],
    featured: false,
  },
] as const;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type Slot = { time: string; classes: (string | null)[] };

const SCHEDULE: Slot[] = [
  {
    time: "07:00",
    classes: ["Strength", null, "Strength", null, "Strength", "Open Gym"],
  },
  {
    time: "12:30",
    classes: [null, "Rehab", null, "Rehab", null, "Mobility"],
  },
  {
    time: "18:00",
    classes: ["Muay Thai", "Strength", "Muay Thai", "Strength", "Muay Thai", null],
  },
  {
    time: "19:30",
    classes: ["Strength", "Muay Thai", "Strength", "Muay Thai", "Open Mat", null],
  },
];

const TAG_STYLE: Record<string, string> = {
  "Muay Thai": "bg-violet text-white",
  Strength: "bg-violet/25 text-violet-hi",
  Rehab: "bg-bone/10 text-bone",
  Mobility: "bg-bone/10 text-bone",
  "Open Gym": "border border-line-strong text-ash",
  "Open Mat": "border border-line-strong text-ash",
};

function SampleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-dashed border-violet-hi/50 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-violet-hi">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-hi" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function MembershipsPage() {
  return (
    <>
      <header className="hero-glow grain relative overflow-hidden px-5 pb-16 pt-36 text-center md:pb-24 md:pt-44">
        <div className="relative mx-auto max-w-3xl">
          <p className="kicker fade-rise">Memberships · Classes · Schedule</p>
          <h1
            className="display fade-rise mt-4 text-5xl text-bone sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.15s" }}
          >
            Pick your <span className="text-violet-hi">form</span>
          </h1>
          <p
            className="fade-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-ash"
            style={{ animationDelay: "0.3s" }}
          >
            Simple plans, serious training. Final pricing and timetable will be
            confirmed with the club — the numbers below are sample proposal
            content.
          </p>
        </div>
      </header>

      {/* ---------- PRICING ---------- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal selector="[data-reveal]" className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading kicker="Memberships" title="Sample proposal pricing" />
            <div data-reveal>
              <SampleBadge label="Sample pricing — to be confirmed" />
            </div>
          </Reveal>

          <Reveal
            selector="[data-reveal]"
            y={0}
            className="mt-12 grid items-start gap-5 lg:grid-cols-3"
          >
            {TIERS.map((t) => (
              <div
                key={t.name}
                data-reveal
                className={`card flex flex-col p-8 ${
                  t.featured ? "outline outline-2 -outline-offset-1 outline-violet" : ""
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-8 bg-violet px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white">
                    Most popular
                  </span>
                )}
                <h3 className="display text-2xl text-bone">{t.name}</h3>
                <p className="mt-2 text-sm text-ash">{t.blurb}</p>
                <p className="mt-6">
                  <span className="display text-5xl text-bone">{t.price}</span>
                  <span className="ml-2 font-mono text-xs uppercase tracking-[0.15em] text-ash">
                    {t.period}
                  </span>
                </p>
                <ul className="mt-7 flex-1 space-y-3 text-sm text-ash">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-violet-hi" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={wa(`Hi Form Club! I'm interested in the ${t.name} membership.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn mt-8 w-full ${t.featured ? "btn-primary" : "btn-ghost"}`}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Ask About {t.name}
                </a>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-8">
            <p className="text-center font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ash">
              Day passes & student rates available — ask on WhatsApp
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- SCHEDULE ---------- */}
      <section id="schedule" className="border-y border-line bg-raised py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal selector="[data-reveal]" className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading kicker="Weekly schedule" title="When we train" />
            <div data-reveal>
              <SampleBadge label="Placeholder schedule" />
            </div>
          </Reveal>

          <Reveal className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="border-b border-line p-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">
                    Time
                  </th>
                  {DAYS.map((d) => (
                    <th
                      key={d}
                      className="border-b border-line p-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-violet-hi"
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((slot) => (
                  <tr key={slot.time}>
                    <td className="border-b border-line p-3 font-mono text-xs text-bone">
                      {slot.time}
                    </td>
                    {slot.classes.map((c, i) => (
                      <td key={`${slot.time}-${DAYS[i]}`} className="border-b border-line p-3">
                        {c === "Rehab" ? (
                          <Link
                            href="/rehab"
                            className={`inline-block px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors hover:bg-violet hover:text-white ${TAG_STYLE[c]}`}
                          >
                            {c}
                          </Link>
                        ) : c ? (
                          <span
                            className={`inline-block px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] ${TAG_STYLE[c] ?? "bg-bone/10 text-bone"}`}
                          >
                            {c}
                          </span>
                        ) : (
                          <span className="text-ash/30" aria-hidden="true">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal className="mt-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ash">
              Sunday — rest day. Open gym hours outside class times.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="text-center">
            <a
              href={wa("Hi Form Club! I'd like to ask about memberships and classes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Ask About Memberships
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
