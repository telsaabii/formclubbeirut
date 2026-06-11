/** Central place for client-replaceable data. */

/** PLACEHOLDER — replace with the gym's real WhatsApp number before launch. */
export const WHATSAPP_DISPLAY = "+961 3 855 084";
export const WHATSAPP_DIGITS = "9613855084";

export const wa = (text: string) =>
  `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(text)}`;

export const MAPS_URL = "https://maps.app.goo.gl/bGYafURoCx7Rejun9?g_st=ipc";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/memberships", label: "Memberships & Classes" },
  { href: "/trainers", label: "Personal Trainers" },
  { href: "/rehab", label: "Rehabilitation" },
  { href: "/contact", label: "Contact" },
] as const;

export const SERVICES = [
  {
    n: "01",
    title: "Fitness",
    blurb:
      "Open floor, serious equipment, zero ego. Train on your own terms with programming support when you want it.",
    href: "/memberships",
  },
  {
    n: "02",
    title: "Personal Training",
    blurb:
      "One coach, one plan, one goal — yours. Assessment-led coaching that meets you at your level and moves you past it.",
    href: "/trainers",
  },
  {
    n: "03",
    title: "Martial Arts",
    blurb:
      "Group Muay Thai in collaboration with Agile Gym and Master Kassem El Khatib. Technique first, conditioning always.",
    href: "/memberships#schedule",
  },
  {
    n: "04",
    title: "Rehabilitation",
    blurb:
      "Recovery-focused training, mobility work, and strength rebuilding — coached with injuries in mind, after assessment.",
    href: "/rehab",
  },
] as const;
