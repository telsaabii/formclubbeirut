import Link from "next/link";
import Image from "next/image";
import { MAPS_URL, NAV_LINKS, WHATSAPP_DISPLAY, wa } from "@/lib/site";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-raised">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/brand/logo.png"
            alt="Form Club Beirut"
            width={190}
            height={70}
            className="h-14 w-auto object-contain"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">
            Fitness, combat, coaching, and rehabilitation under one roof in the
            heart of Verdun, Beirut.
          </p>
          <p className="kicker mt-6">Strength in Every Form</p>
        </div>

        <nav aria-label="Footer">
          <p className="kicker mb-5">Explore</p>
          <ul className="space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ash transition-colors hover:text-violet-hi"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="kicker mb-5">Reach us</p>
          <ul className="space-y-3 text-sm text-ash">
            <li>
              <a
                href={wa("Hi Form Club! I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-violet-hi"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-violet-hi"
              >
                Verdun, Beirut — open in Google Maps ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ash/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Form Club Beirut</span>
          <span>Website proposal concept — sample content where marked</span>
        </div>
      </div>
    </footer>
  );
}
