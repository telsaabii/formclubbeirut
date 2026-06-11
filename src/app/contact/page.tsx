import type { Metadata } from "next";
import MapCard from "@/components/MapCard";
import Reveal from "@/components/Reveal";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { WHATSAPP_DISPLAY, wa } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Message Form Club Beirut on WhatsApp — book a trial session, ask about memberships, or find us in Verdun, Beirut.",
};

export default function ContactPage() {
  return (
    <>
      <header className="hero-glow grain relative overflow-hidden px-5 pb-16 pt-36 text-center md:pb-20 md:pt-44">
        <div className="relative mx-auto max-w-3xl">
          <p className="kicker fade-rise">Contact</p>
          <h1
            className="display fade-rise mt-4 text-5xl text-bone sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.15s" }}
          >
            Talk to the <span className="text-violet-hi">club</span>
          </h1>
          <p
            className="fade-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-ash"
            style={{ animationDelay: "0.3s" }}
          >
            WhatsApp is the fastest way to reach us — for trials, memberships,
            or anything else.
          </p>
        </div>
      </header>

      <section className="pb-24 pt-4 md:pb-32">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.1fr_1fr]">
          {/* primary: WhatsApp */}
          <Reveal selector="[data-reveal]" className="flex flex-col gap-5">
            <div data-reveal className="card !border-violet/60 p-8 md:p-10">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center bg-violet text-white">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="display text-2xl text-bone">WhatsApp</h2>
                  <p className="font-mono text-xs tracking-[0.15em] text-ash">
                    {WHATSAPP_DISPLAY}
                    <span className="ml-2 text-violet-hi/80">(placeholder)</span>
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-ash">
                Fastest response — usually within the hour during opening times.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={wa("Hi Form Club! I'd like to book a trial session.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Book a Trial Session
                </a>
                <a
                  href={wa("Hi Form Club! I'd like to ask about memberships.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost w-full"
                >
                  Ask About Memberships
                </a>
              </div>
            </div>

            <div data-reveal>
              <MapCard />
            </div>
          </Reveal>

          {/* secondary: inquiry form -> composes a WhatsApp message */}
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
