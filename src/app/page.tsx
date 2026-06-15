import Image from "next/image";
import Link from "next/link";
import AnimatedLogo from "@/components/AnimatedLogo";
import HeroGradient from "@/components/HeroGradient";
import Marquee from "@/components/Marquee";
import MapCard from "@/components/MapCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import StrengthShowcase from "@/components/strength/StrengthShowcase";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, wa } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="grain relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink pt-16">
        <HeroGradient className="pointer-events-none absolute inset-0 h-full w-full" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-10 text-center">
          <p className="kicker fade-rise" style={{ animationDelay: "0.1s" }}>
            Verdun · بيروت — Opening Soon
          </p>

          <AnimatedLogo className="fade-rise mx-auto -my-[4%] w-full max-w-3xl" />

          <h1
            className="display fade-rise mx-auto max-w-3xl text-4xl text-bone sm:text-5xl md:text-6xl"
            style={{ animationDelay: "0.25s" }}
          >
            Strength in <span className="accent-anim text-violet-hi">Every Form</span>
          </h1>

          <p
            className="fade-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-ash md:text-lg"
            style={{ animationDelay: "0.4s" }}
          >
            Fitness, combat, coaching, and rehabilitation under one roof —
            built for every body, every level, every form of strength.
          </p>

          <div
            className="fade-rise mt-9 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "0.55s" }}
          >
            <a
              href={wa("Hi Form Club! I'd like to book a trial session.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Book a Trial Session
            </a>
            <Link href="/memberships#schedule" className="btn btn-ghost">
              View Classes
            </Link>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ash/60"
          aria-hidden="true"
        >
          Scroll ↓
        </div>
      </section>

      <Marquee />

      {/* ================= SERVICES — scroll-driven showcase ================= */}
      <StrengthShowcase />

      {/* ================= THE CLUB × MUAY THAI ================= */}
      <section className="relative overflow-hidden border-y border-line bg-raised py-24 md:py-32">
        <div
          className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none text-[24vw] font-bold leading-none text-violet/10"
          aria-hidden="true"
        >
          مواي تاي
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_1fr]">
          <Reveal selector="[data-reveal]">
            <SectionHeading
              kicker="The club"
              title="Train with people who show up"
              lead="A community of fighters, lifters, and beginners who take their training seriously — and each other further."
            />

            <p className="kicker mt-10" data-reveal>
              Featured program — Group Muay Thai
            </p>
            <p
              className="mt-4 text-base leading-relaxed text-ash"
              data-reveal
            >
              FORM CLUB BEIRUT is proud to announce its collaboration with{" "}
              <strong className="text-bone">Agile Gym</strong> and{" "}
              <strong className="text-bone">Master Kassem El Khatib</strong> for
              a dedicated Group Muay Thai Class — the art of eight limbs,
              coached with technique first and conditioning always.
            </p>

            <p
              className="mt-7 inline-block border border-line-strong px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ash"
              data-reveal
            >
              All levels welcome
            </p>

            <div className="mt-9 flex flex-wrap gap-4" data-reveal>
              <a
                href={wa("Hi Form Club! I'm interested in the Group Muay Thai class.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Ask About Muay Thai
              </a>
              <Link href="/memberships#schedule" className="btn btn-ghost">
                See the Schedule
              </Link>
            </div>
          </Reveal>

          <Reveal>
            <figure className="card overflow-hidden !bg-panel">
              <div className="relative">
                <Image
                  src="/brand/team.jpg"
                  alt="The Form Club Beirut team in the gym's boxing ring"
                  width={1600}
                  height={1532}
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="block w-full"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-4 p-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">
                <span>The Form Club family — Verdun, Beirut</span>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-hi transition-colors hover:text-bone"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ================= LOCATION ================= */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.2fr]">
          <Reveal selector="[data-reveal]">
            <SectionHeading
              kicker="Find us"
              title="In the heart of Verdun"
              lead="Train with purpose in one of Beirut's most connected neighborhoods — minutes from Hamra and the corniche."
            />
            <p
              data-reveal
              className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash"
            >
              Exact address & floor — to be added
            </p>
          </Reveal>

          <Reveal>
            <MapCard />
          </Reveal>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="hero-glow grain relative overflow-hidden border-t border-line py-28 text-center md:py-36">
        <div className="relative mx-auto max-w-3xl px-5">
          <Reveal selector="[data-reveal]">
            <h2
              className="display text-5xl text-bone sm:text-6xl md:text-7xl"
              data-reveal
            >
              Ready to find <span className="text-violet-hi">your form?</span>
            </h2>
            <p
              className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ash"
              data-reveal
            >
              First session&apos;s on us. Message the club and we&apos;ll take it
              from there.
            </p>
            <div
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
              data-reveal
            >
              <a
                href={wa("Hi Form Club! I'd like to book a trial session.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Message Form Club on WhatsApp
              </a>
              <Link href="/contact" className="btn btn-ghost">
                Contact Page
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
