import { MAPS_URL } from "@/lib/site";

/**
 * Stylized map of the Verdun district — a custom visual, not a maps API.
 * Streets are abstracted; the pulsing marker sits on Rue de Verdun.
 */
export default function MapCard({ className }: { className?: string }) {
  return (
    <div className={`card overflow-hidden ${className ?? ""}`}>
      <div className="relative">
        <svg
          viewBox="0 0 640 440"
          className="block w-full"
          role="img"
          aria-label="Stylized map showing Form Club's location in Verdun, Beirut"
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="46%" r="60%">
              <stop offset="0%" stopColor="#1b1130" />
              <stop offset="100%" stopColor="#0e0c15" />
            </radialGradient>
          </defs>

          <rect width="640" height="440" fill="url(#mapGlow)" />

          {/* city blocks */}
          <g fill="rgba(244,242,250,0.025)" stroke="rgba(244,242,250,0.06)">
            <rect x="60" y="48" width="130" height="86" rx="3" />
            <rect x="222" y="36" width="150" height="98" rx="3" />
            <rect x="404" y="60" width="170" height="84" rx="3" />
            <rect x="40" y="170" width="150" height="100" rx="3" />
            <rect x="222" y="168" width="64" height="102" rx="3" />
            <rect x="402" y="178" width="180" height="92" rx="3" />
            <rect x="80" y="306" width="140" height="90" rx="3" />
            <rect x="254" y="306" width="130" height="98" rx="3" />
            <rect x="418" y="304" width="150" height="100" rx="3" />
          </g>

          {/* minor streets */}
          <g stroke="rgba(244,242,250,0.10)" strokeWidth="2">
            <line x1="0" y1="150" x2="640" y2="142" />
            <line x1="0" y1="288" x2="640" y2="292" />
            <line x1="205" y1="0" x2="198" y2="440" />
            <line x1="392" y1="0" x2="400" y2="440" />
          </g>

          {/* Rue de Verdun — the artery */}
          <path
            d="M-10 236 C 140 220, 320 246, 650 218"
            fill="none"
            stroke="rgba(154,99,239,0.45)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M-10 236 C 140 220, 320 246, 650 218"
            fill="none"
            stroke="rgba(154,99,239,0.9)"
            strokeWidth="1.5"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />

          {/* street labels */}
          <g
            fill="rgba(157,152,172,0.75)"
            fontFamily="var(--font-plex), monospace"
            fontSize="10"
            letterSpacing="2.5"
          >
            <text x="36" y="226" transform="rotate(-3 36 226)">RUE DE VERDUN</text>
            <text x="470" y="135">HAMRA →</text>
            <text x="60" y="426">← RAMLET AL-BAYDA</text>
          </g>
          <text
            x="556"
            y="40"
            fill="rgba(154,99,239,0.65)"
            fontFamily="var(--font-plex), monospace"
            fontSize="11"
            letterSpacing="3"
          >
            بيروت
          </text>

          {/* compass */}
          <g transform="translate(596 396)" stroke="rgba(244,242,250,0.4)" fill="none">
            <circle r="14" />
            <path d="M0 8 L0 -8 M0 -8 L-4 -2 M0 -8 L4 -2" strokeLinecap="round" />
          </g>

          {/* pulsing marker on Rue de Verdun */}
          <g transform="translate(320 234)">
            <circle r="34" fill="none" stroke="#9a63ef" strokeWidth="1.5" className="ping-ring" />
            <circle
              r="34"
              fill="none"
              stroke="#9a63ef"
              strokeWidth="1.5"
              className="ping-ring"
              style={{ animationDelay: "1.2s" }}
            />
            <g className="marker-bob">
              <path
                d="M0 10 C -11 -2, -13 -6, -13 -13 a13 13 0 1 1 26 0 c 0 7, -2 11, -13 23z"
                fill="#5c28ad"
                stroke="#9a63ef"
                strokeWidth="1.5"
                transform="translate(0 -10)"
              />
              <circle cy="-23" r="4.5" fill="#f4f2fa" />
            </g>
          </g>
        </svg>

        <div className="pointer-events-none absolute left-4 top-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-ash">
          33.887° N / 35.484° E
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-line p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="display text-xl text-bone">Verdun, Beirut</p>
          <p className="mt-1 text-sm text-ash">In the heart of the district.</p>
        </div>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost shrink-0"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
