"use client";

import { useState } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { wa } from "@/lib/site";

const INTERESTS = [
  "Trial Session",
  "Membership",
  "Personal Training",
  "Muay Thai",
  "Rehabilitation",
  "Other",
] as const;

/**
 * No backend by design: the form composes a pre-filled WhatsApp message,
 * which is how local customers actually reach the club.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState<(typeof INTERESTS)[number]>("Trial Session");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Hi Form Club! I'm ${name.trim() || "interested"}.`,
      `Interest: ${interest}`,
      message.trim() && `Message: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(wa(text), "_blank", "noopener,noreferrer");
  };

  const field =
    "w-full border border-line-strong bg-raised px-4 py-3 text-sm text-bone placeholder:text-ash/50 outline-none transition-colors focus:border-violet-hi";

  return (
    <form onSubmit={submit} className="card flex h-full flex-col p-8 md:p-10">
      <h2 className="display text-2xl text-bone">Send an inquiry</h2>
      <p className="mt-2 text-sm text-ash">
        Fill this in and we&apos;ll open WhatsApp with your message ready to send.
      </p>

      <label className="kicker mt-8 block" htmlFor="cf-name">
        Your name
      </label>
      <input
        id="cf-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Rana K."
        className={`${field} mt-2`}
        autoComplete="name"
      />

      <span className="kicker mt-6 block">I&apos;m interested in</span>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Interest">
        {INTERESTS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setInterest(opt)}
            aria-pressed={interest === opt}
            className={`px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors ${
              interest === opt
                ? "bg-violet text-white"
                : "border border-line-strong text-ash hover:border-violet-hi hover:text-bone"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <label className="kicker mt-6 block" htmlFor="cf-message">
        Message (optional)
      </label>
      <textarea
        id="cf-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us about your goals, schedule, or any questions…"
        rows={4}
        className={`${field} mt-2 flex-1 resize-none`}
      />

      <button type="submit" className="btn btn-primary mt-8 w-full">
        <WhatsAppIcon className="h-4 w-4" />
        Continue on WhatsApp
      </button>
      <p className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash/60">
        Opens WhatsApp — nothing is stored on this site
      </p>
    </form>
  );
}
