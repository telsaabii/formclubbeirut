/**
 * Abstract kinetic scenes for the "Every form of strength" showcase.
 * No figures — each discipline is told through equipment silhouettes,
 * white technical linework, and electric-purple energy accents
 * (trails, impact rings, data flow), plus hairline diagnostic overlays.
 *
 * Pure SVG markup — all motion is driven by GSAP in StrengthShowcase via
 * the data-* hooks. [data-draw] strokes are scroll-drawn (their dasharray
 * is overwritten by primeDraw, so decorative dashed strokes must NOT carry
 * it). Loop-managed dash elements ([data-kb-trail], [data-strike],
 * [data-rom-arc], [data-ekg]) are styled to read as a complete frozen
 * moment when prefers-reduced-motion disables the loops.
 *
 * Pivot/origin coordinates referenced by svgOrigin in the loops are
 * documented inline — keep them in sync if geometry changes.
 */

const ENERGY = "#5329F2"; // primary energy accent
const ENERGY_DEEP = "#5127ED"; // secondary energy accent

const LINE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const FINE = { ...LINE, strokeWidth: 1.75 };
const HAIR = { ...LINE, strokeWidth: 1 };

const FRAME = {
  viewBox: "0 0 420 320",
  "aria-hidden": true,
  className: "mx-auto w-full max-w-[520px]",
} as const;

/** Soft glow for energy-colored strokes. One filter per scene (unique id). */
function GlowFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

/** Corner registration brackets — frames each scene like a viewport. */
function Brackets() {
  return (
    <path
      data-draw
      d="M34 40 V26 H48 M372 26 H386 V40 M34 286 V300 H48 M372 300 H386 V286"
      {...HAIR}
      className="text-bone/20"
    />
  );
}

/** Technical floor line with survey ticks. */
function Baseline() {
  return (
    <g className="text-bone/15">
      <path data-draw d="M50 286 H370" {...HAIR} strokeWidth={1.5} />
      <path
        data-draw
        d="M90 286 v6 M130 286 v6 M170 286 v6 M210 286 v6 M250 286 v6 M290 286 v6 M330 286 v6"
        {...HAIR}
        className="text-bone/10"
      />
    </g>
  );
}

/** Tiny monospace diagnostic readout. */
function Readout({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="font-mono text-ash"
      fill="currentColor"
      opacity="0.55"
      fontSize="8"
      letterSpacing="1.5"
    >
      {children}
    </text>
  );
}

/** 01 — Fitness: kettlebell ballistic pendulum (pivot 210 92) under a
 *  trajectory arc; [data-kb-trail] is the energy segment that tracks the
 *  bell; [data-plate] is the slowly rotating plate (origin 84 108). */
export function FitnessScene() {
  return (
    <svg {...FRAME}>
      <defs>
        <GlowFilter id="fc-glow-1" />
      </defs>
      <Brackets />
      <Baseline />
      <Readout x={40} y={58}>
        SWING ARC / 80°
      </Readout>

      {/* pivot crosshair — swing origin */}
      <g className="text-bone/40">
        <circle data-draw cx="210" cy="92" r="5" {...HAIR} />
        <path
          data-draw
          d="M210 81 V73 M210 103 V111 M199 92 H191 M221 92 H229"
          {...HAIR}
        />
      </g>

      {/* trajectory guide (decorative dash — no data-draw) + range ticks */}
      <path
        d="M113.6 207 A150 150 0 0 0 306.4 207"
        {...HAIR}
        strokeDasharray="2 7"
        className="text-bone/25"
      />
      <path
        data-draw
        d="M109.7 211.5 L104.6 217.6 M156.6 238.6 L153.9 246.2 M210 248 V256 M263.4 238.6 L266.1 246.2 M310.3 211.5 L315.4 217.6"
        {...HAIR}
        className="text-bone/25"
      />

      {/* energy trail along the trajectory (loop-managed dash) */}
      <path
        data-kb-trail
        d="M113.6 207 A150 150 0 0 0 306.4 207"
        {...FINE}
        strokeWidth={3}
        stroke={ENERGY}
        filter="url(#fc-glow-1)"
        opacity="0.9"
      />

      {/* rotating plate — origin (84 108) */}
      <g data-plate>
        <circle data-draw cx="84" cy="108" r="34" {...FINE} className="text-bone/80" />
        <circle data-draw cx="84" cy="108" r="26" {...HAIR} className="text-bone/30" />
        <circle data-draw cx="84" cy="108" r="11" {...FINE} stroke={ENERGY_DEEP} />
        <path
          data-draw
          d="M110 108 H117 M97 130.5 L100.5 136.6 M71 130.5 L67.5 136.6 M58 108 H51 M71 85.5 L67.5 79.4 M97 85.5 L100.5 79.4"
          {...HAIR}
          className="text-bone/60"
        />
      </g>
      <Readout x={84} y={162} anchor="middle">
        20KG
      </Readout>

      {/* kettlebell — group pivots at (210 92) */}
      <g data-kb-swing>
        <path d="M210 100 V222" {...HAIR} className="text-bone/20" />
        <g className="text-bone/90">
          <path data-draw d="M194 236 C194 212 226 212 226 236" {...LINE} />
          <circle data-draw cx="210" cy="252" r="23" {...LINE} />
        </g>
        <circle
          data-pulse
          cx="210"
          cy="252"
          r="30"
          {...HAIR}
          stroke={ENERGY}
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

/** 02 — Personal Training: coach node (96 150) ↔ athlete node (324 150)
 *  joined by a flowing link; program card above, progress graph below.
 *  [data-link-dot] travels cx 118 → 302; [data-sonar] rings expand. */
export function TrainingScene() {
  return (
    <svg {...FRAME}>
      <defs>
        <GlowFilter id="fc-glow-2" />
      </defs>
      <Brackets />
      <Baseline />

      {/* leaders from the link out to the modules */}
      <path
        data-draw
        d="M108 139 L152 116 M312 162 L280 200"
        {...HAIR}
        className="text-bone/25"
      />

      {/* program card */}
      <g className="text-bone/80">
        <rect data-draw x="150" y="58" width="84" height="58" rx="5" {...FINE} />
        <path data-draw d="M158 70 H210" {...HAIR} strokeWidth={2} stroke={ENERGY_DEEP} />
        <path
          data-draw
          d="M158 82 H226 M158 92 H218 M158 102 H226"
          {...HAIR}
          className="text-bone/35"
        />
      </g>
      <Readout x={192} y={50} anchor="middle">
        PROGRAM
      </Readout>

      {/* coach node */}
      <g className="text-bone/90">
        <circle data-draw cx="96" cy="150" r="16" {...FINE} />
        <circle cx="96" cy="150" r="5" fill={ENERGY} stroke="none" />
      </g>
      <circle
        data-sonar
        cx="96"
        cy="150"
        r="16"
        {...HAIR}
        stroke={ENERGY}
        opacity="0.3"
      />
      <Readout x={96} y={184} anchor="middle">
        COACH
      </Readout>

      {/* athlete node */}
      <g className="text-bone/90">
        <circle data-draw cx="324" cy="150" r="16" {...FINE} />
        <circle cx="324" cy="150" r="5" fill={ENERGY} stroke="none" />
      </g>
      <circle
        data-sonar
        cx="324"
        cy="150"
        r="16"
        {...HAIR}
        stroke={ENERGY}
        opacity="0.3"
      />
      <Readout x={324} y={184} anchor="middle">
        ATHLETE
      </Readout>

      {/* connection line (decorative dash, loop-flowed — no data-draw) */}
      <line
        data-link
        x1="118"
        y1="150"
        x2="302"
        y2="150"
        stroke={ENERGY}
        strokeWidth="2"
        strokeDasharray="7 9"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle
        data-link-dot
        cx="210"
        cy="150"
        r="4"
        fill={ENERGY}
        stroke="none"
        filter="url(#fc-glow-2)"
      />

      {/* progress graph */}
      <path data-draw d="M168 188 V252 H280" {...HAIR} className="text-bone/35" />
      <polyline
        data-draw
        points="172,246 198,232 220,238 246,210 274,194"
        fill="none"
        stroke={ENERGY}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#fc-glow-2)"
      />
      <g className="text-bone">
        <circle data-gdot cx="172" cy="246" r="3" fill="currentColor" stroke="none" />
        <circle data-gdot cx="198" cy="232" r="3" fill="currentColor" stroke="none" />
        <circle data-gdot cx="220" cy="238" r="3" fill="currentColor" stroke="none" />
        <circle data-gdot cx="246" cy="210" r="3" fill="currentColor" stroke="none" />
        <circle data-gdot cx="274" cy="194" r="3" fill="currentColor" stroke="none" />
      </g>
      <Readout x={224} y={268} anchor="middle">
        PROGRESS
      </Readout>
    </svg>
  );
}

/** 03 — Martial Arts: heavy bag (group pivots at mount 292 34) taking a
 *  strike. [data-strike] streak draws in fast, [data-ring]/[data-ring2]
 *  expand from the impact point (264 152), bag recoils and settles. */
export function CombatScene() {
  return (
    <svg {...FRAME}>
      <defs>
        <GlowFilter id="fc-glow-3" />
      </defs>
      <Brackets />
      <Baseline />
      <Readout x={236} y={128} anchor="end">
        IMPACT +860N
      </Readout>

      {/* mount */}
      <path data-draw d="M248 34 H336" {...FINE} className="text-bone/40" />

      {/* strike origin node + range dimension line (static balance for
          the idle moments between strikes) */}
      <g className="text-bone/40">
        <circle data-draw cx="100" cy="162" r="6" {...HAIR} />
        <circle cx="100" cy="162" r="2" fill="currentColor" stroke="none" />
        <path
          data-draw
          d="M100 228 V236 M100 232 H244 M244 228 V236"
          {...HAIR}
          className="text-bone/25"
        />
      </g>
      <Readout x={172} y={250} anchor="middle">
        RANGE 1.2M
      </Readout>

      {/* heavy bag — pivots at (292 34) */}
      <g data-bag>
        <path
          data-draw
          d="M286 36 L282 64 M298 36 L302 64"
          {...HAIR}
          className="text-bone/50"
        />
        <rect
          data-draw
          x="264"
          y="62"
          width="56"
          height="150"
          rx="26"
          {...LINE}
          className="text-bone/90"
        />
        <path data-draw d="M266 108 H318" {...FINE} strokeWidth={2.5} stroke={ENERGY_DEEP} />
        <path data-draw d="M270 196 H314" {...HAIR} className="text-bone/25" />
      </g>

      {/* impact crosshair */}
      <g className="text-bone/40">
        <circle data-draw cx="264" cy="152" r="7" {...HAIR} />
        <path
          data-draw
          d="M254 152 H244 M264 142 V132 M264 162 V172"
          {...HAIR}
        />
      </g>

      {/* impact rings (loop-managed; static = frozen impact frame) */}
      <circle
        data-ring
        cx="264"
        cy="152"
        r="20"
        {...FINE}
        stroke={ENERGY}
        filter="url(#fc-glow-3)"
        opacity="0.35"
      />
      <circle
        data-ring2
        cx="264"
        cy="152"
        r="12"
        {...HAIR}
        stroke={ENERGY_DEEP}
        opacity="0.25"
      />

      {/* strike streak — purple glow under a white core (both loop-drawn) */}
      <path
        data-strike
        d="M100 162 L256 153"
        fill="none"
        stroke={ENERGY}
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#fc-glow-3)"
        opacity="0.8"
      />
      <path
        data-strike
        d="M100 162 L256 153"
        {...FINE}
        strokeWidth={2.5}
        className="text-bone"
      />

      {/* speed ticks behind the strike */}
      <g data-speed className="text-bone/60" opacity="0.25">
        <path d="M58 148 H86" {...HAIR} />
        <path d="M48 160 H82" {...HAIR} />
        <path d="M58 172 H86" {...HAIR} />
      </g>
    </svg>
  );
}

/** 04 — Rehabilitation: range-of-motion lever (pivots at joint 170 170)
 *  sweeping a clinical protractor; [data-rom-arc] draws in sync with the
 *  sweep; [data-align] (origin 344 167) snaps into the posture reference. */
export function RehabScene() {
  return (
    <svg {...FRAME}>
      <defs>
        <GlowFilter id="fc-glow-4" />
      </defs>
      <Brackets />
      <Baseline />
      <Readout x={40} y={58}>
        ROM 150°
      </Readout>

      {/* vitals trace (loop-managed dash flow) */}
      <path
        data-ekg
        d="M52 112 H80 L88 96 L96 124 L102 112 H132"
        fill="none"
        stroke={ENERGY}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* joint crosshair — lever pivot */}
      <g className="text-bone/50">
        <circle data-draw cx="170" cy="170" r="7" {...FINE} />
        <path
          data-draw
          d="M170 156 V148 M170 184 V192 M156 170 H148 M184 170 H192"
          {...HAIR}
        />
      </g>

      {/* protractor ticks every 30° */}
      <path
        data-draw
        d="M170 282 V290 M226 267 L230 273.9 M267 226 L273.9 230 M282 170 H290 M267 114 L273.9 110 M226 73 L230 66.1"
        {...HAIR}
        className="text-bone/30"
      />

      {/* range-of-motion arc — drawn in sync with the lever sweep */}
      <path
        data-rom-arc
        d="M170 280 A110 110 0 0 0 225 74.7"
        {...FINE}
        stroke={ENERGY}
        filter="url(#fc-glow-4)"
        opacity="0.75"
      />

      {/* lever — pivots at (170 170) */}
      <g data-rom-lever>
        <path d="M170 170 L170 262" {...LINE} className="text-bone/90" />
        <circle
          data-pulse
          cx="170"
          cy="262"
          r="5.5"
          fill={ENERGY}
          stroke="none"
          filter="url(#fc-glow-4)"
        />
      </g>

      {/* posture alignment module — reference line + correcting segment */}
      <path
        d="M344 84 V250"
        {...HAIR}
        strokeDasharray="3 6"
        className="text-bone/25"
      />
      <line
        data-align
        x1="344"
        y1="100"
        x2="344"
        y2="234"
        stroke={ENERGY_DEEP}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g data-align-ticks className="text-bone/40">
        <path d="M332 118 H356 M332 167 H356 M332 216 H356" {...HAIR} />
      </g>
      <Readout x={344} y={266} anchor="middle">
        ALIGN
      </Readout>
    </svg>
  );
}
