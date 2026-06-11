"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, wa } from "@/lib/site";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-line bg-ink/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-[72px]">
        <Link href="/" aria-label="Form Club Beirut — home" className="shrink-0">
          <Image
            src="/brand/logo.png"
            alt="Form Club Beirut"
            width={152}
            height={56}
            priority
            className="h-9 w-auto object-contain md:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors ${
                pathname === l.href
                  ? "text-violet-hi"
                  : "text-ash hover:text-bone"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={wa("Hi Form Club! I'd like to book a trial session.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hidden !px-4 !py-2.5 text-[0.7rem] sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Book a Trial
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={`h-[2px] w-6 bg-bone transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-bone transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-bone transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`lg:hidden ${open ? "block" : "hidden"} h-[calc(100dvh-64px)] overflow-y-auto bg-ink/95 backdrop-blur-md`}
      >
        <nav className="flex flex-col gap-1 px-5 py-8" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`display border-b border-line py-4 text-3xl ${
                pathname === l.href ? "text-violet-hi" : "text-bone"
              }`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={wa("Hi Form Club! I'd like to book a trial session.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-8"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Message us on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
