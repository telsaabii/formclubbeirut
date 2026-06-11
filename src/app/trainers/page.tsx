import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { wa } from "@/lib/site";

export const metadata: Metadata = {
  title: "Personal Trainers",
  description:
    "Meet the Form Club Beirut coaching team — strength, Muay Thai, mobility, and rehab specialists in Verdun.",
};

/* ---------- TEMPLATE DATA — replace each entry with a real trainer ---------- */

type Trainer = {
  initials: string;
  name: string;
  role: string;
  specialties: string[];
  bio: string;
};

const TRAINERS: Trainer[] = [
  {
    initials: "TN",
    name: "Trainer Name",
    role: "Head Coach — Strength & Conditioning",
    specialties: ["Strength", "Olympic Lifts", "Programming"],
    bio: "Certification, years of experience, and coaching philosophy go here. Two sentences max — sharp and personal.",
  },
  {
    initials: "TN",
    name: "Trainer Name",
    role: "Muay Thai Coach",
    specialties: ["Muay Thai", "Pad Work", "Fight Prep"],
    bio: "Fight record, lineage, or gym background goes here. What a first-timer can expect from their class.",
  },
  {
    initials: "TN",
    name: "Trainer Name",
    role: "Personal Trainer",
    specialties: ["Fat Loss", "Muscle Building", "Nutrition"],
    bio: "Client results and approach go here. Who they work best with and how they structure a program.",
  },
  {
    initials: "TN",
    name: "Trainer Name",
    role: "Rehab & Mobility Specialist",
    specialties: ["Rehab", "Mobility", "Return-to-Sport"],
    bio: "Credentials in rehabilitation or physiotherapy-adjacent training go here, plus assessment approach.",
  },
];

function TrainerCard({ t }: { t: Trainer }) {
  return (
    <div data-reveal className="card group overflow-hidden">
      {/* photo slot — replace with a real portrait */}
      <div className="relative flex aspect-[4/3] items-center justify-center border-b border-dashed border-line-strong bg-gradient-to-br from-violet/25 via-panel to-raised">
        <span
          className="display text-7xl text-bone/15 transition-colors duration-300 group-hover:text-violet-hi/25"
          aria-hidden="true"
        >
          {t.initials}
        </span>
        <span className="absolute bottom-3 right-3 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-ash/60">
          Photo slot — replace
        </span>
      </div>

      <div className="p-7">
        <h3 className="display text-2xl text-bone">{t.name}</h3>
        <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-violet-hi">
          {t.role}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ash">{t.bio}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {t.specialties.map((s) => (
            <li
              key={s}
              className="border border-line-strong px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash"
            >
              {s}
            </li>
          ))}
        </ul>
        <a
          href={wa(`Hi Form Club! I'd like a consultation with your ${t.role.toLowerCase()}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-bone transition-colors hover:text-violet-hi"
        >
          Book a consultation <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

export default function TrainersPage() {
  return (
    <>
      <header className="hero-glow grain relative overflow-hidden px-5 pb-16 pt-36 text-center md:pb-24 md:pt-44">
        <div className="relative mx-auto max-w-3xl">
          <p className="kicker fade-rise">The coaching team</p>
          <h1
            className="display fade-rise mt-4 text-5xl text-bone sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.15s" }}
          >
            Coaches, not <span className="text-violet-hi">cheerleaders</span>
          </h1>
          <p
            className="fade-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-ash"
            style={{ animationDelay: "0.3s" }}
          >
            Every program starts with an assessment and a coach who owns your
            progress. Trainer profiles below are template placeholders — ready
            for the real team&apos;s photos, names, and credentials.
          </p>
        </div>
      </header>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal selector="[data-reveal]" className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading kicker="Meet the team" title="Your corner, covered" />
            <span
              data-reveal
              className="inline-flex items-center gap-2 border border-dashed border-violet-hi/50 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-violet-hi"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-hi" aria-hidden="true" />
              Template — replace with real trainer data
            </span>
          </Reveal>

          <Reveal
            selector="[data-reveal]"
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
          >
            {TRAINERS.map((t, i) => (
              <TrainerCard key={`${t.role}-${i}`} t={t} />
            ))}
          </Reveal>

          <Reveal className="mt-16 text-center">
            <p className="mx-auto max-w-md text-sm leading-relaxed text-ash">
              Not sure who fits your goal? Tell us what you&apos;re working
              toward and we&apos;ll match you with the right coach.
            </p>
            <a
              href={wa("Hi Form Club! I'd like to book a consultation with a personal trainer.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-7"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Book a Consultation
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
