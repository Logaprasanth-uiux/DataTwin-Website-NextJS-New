import "./security-page.css";
import type { ControlKind } from "./security-page-data";

// Illustrations for the Security page: inline SVG in the site's language (thin strokes in the surface's own
// ink, one amber accent for what matters, a restrained red only for what is blocked). Structure uses
// currentColor, so each takes its ink from the section it sits on. Motion lives in security-page.css.

export type SecIconName = "iso" | "soc" | "cloud" | "roles" | "lock" | "chain" | "cycle";

export function SecIcon({ name, className = "" }: { name: SecIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {name === "iso" && (
        <>
          <circle cx="12" cy="10" r="6" />
          <path d="M9 15.5L7.8 21l4.2-2.2 4.2 2.2L15 15.5" />
          <path className="text-accent" d="M9.4 10l1.9 1.9 3.3-3.6" />
        </>
      )}
      {name === "soc" && (
        <>
          <path d="M12 3.5l7 2.8v5.2c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V6.3z" />
          <path d="M9 10.2h6M9 13.2h4" />
          <path className="text-accent" d="M9.6 16.2l1.5 1.5 3-3.2" />
        </>
      )}
      {name === "cloud" && (
        <>
          <path d="M7 18.5h10a4 4 0 00.6-7.95A5.5 5.5 0 007 9.3 4.6 4.6 0 007 18.5z" />
          <circle className="text-accent" cx="9.5" cy="14" r="0.9" fill="currentColor" stroke="none" />
          <circle className="text-accent" cx="14.5" cy="14" r="0.9" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "roles" && (
        <>
          <circle cx="9" cy="8.5" r="3" />
          <path d="M3.5 19c.4-3.2 2.7-5 5.5-5s5.1 1.8 5.5 5" />
          <circle className="text-accent" cx="17.5" cy="11" r="2.2" />
          <path className="text-accent" d="M17.5 13.2v3.3M17.5 15h1.6" />
        </>
      )}
      {name === "lock" && (
        <>
          <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
          <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" />
          <circle className="text-accent" cx="12" cy="15.2" r="1.3" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "chain" && (
        <>
          <rect x="3" y="8.5" width="7" height="7" rx="2" />
          <rect className="text-accent" x="14" y="8.5" width="7" height="7" rx="2" />
          <path d="M10 12h4" />
        </>
      )}
      {name === "cycle" && (
        <>
          <path d="M19.5 12a7.5 7.5 0 01-13 5M4.5 12a7.5 7.5 0 0113-5" />
          <path d="M17.5 3.5V7h-3.5M6.5 20.5V17H10" />
          <circle className="text-accent" cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}

const SHIELD = "M360 26l56 22v44c0 38-24 64-56 78-32-14-56-40-56-78V48z";

// ---- Hero: a one-way stream into the shield; the pen is struck out ------------------------------------------

export function ReadOnlyHeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 190"
      fill="none"
      className={className}
      role="img"
      aria-label="Data flows one way, from your systems into DataTwin. The ability to write back is crossed out."
    >
      <g stroke="currentColor" transform="translate(-10 0)">
        {[44, 84, 124].map((y, i) => (
          <g key={y}>
            <rect x="30" y={y} width="150" height="30" rx="10" strokeOpacity="0.25" fill="currentColor" fillOpacity="0.04" />
            <path d={`M50 ${y + 15}h${[70, 90, 56][i]}`} strokeOpacity="0.32" strokeLinecap="round" />
            <circle cx="160" cy={y + 15} r="4" strokeWidth="0" fill="currentColor" fillOpacity="0.3" />
          </g>
        ))}
      </g>
      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {[59, 99, 139].map((y) => (
          <g key={y}>
            <path className="sp-flow" d={`M186 ${y}H246`} />
            <path d={`M240 ${y - 5}l7 5-7 5`} />
          </g>
        ))}
      </g>
      {/* The shield sits on the page's centre line (x = 320); the two sides mirror each other. */}
      <g transform="translate(-40 0)">
        <path d={SHIELD} stroke="var(--accent)" strokeWidth="2" fill="currentColor" fillOpacity="0.05" strokeLinejoin="round" />
        <path d="M334 94C344 78 376 78 386 94 376 110 344 110 334 94z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <circle cx="360" cy="94" r="5.5" fill="var(--accent)" />
      </g>

      {/* Reading: the eye over your systems. */}
      <g transform="translate(-10 0)">
        <path d="M85 26C92 14 118 14 125 26 118 38 92 38 85 26z" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="105" cy="26" r="3.5" fill="var(--accent)" />
      </g>

      {/* Writing back: the same systems on the other side, locked, with the way in struck out. */}
      <g stroke="currentColor" transform="translate(440 0)">
        {[44, 84, 124].map((y, i) => (
          <g key={y}>
            <rect x="30" y={y} width="150" height="30" rx="10" strokeOpacity="0.2" fill="currentColor" fillOpacity="0.03" />
            <path d={`M50 ${y + 15}h${[70, 90, 56][i]}`} strokeOpacity="0.22" strokeLinecap="round" />
            <circle cx="160" cy={y + 15} r="4" strokeWidth="0" fill="currentColor" fillOpacity="0.22" />
          </g>
        ))}
      </g>
      <g stroke="var(--loss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="533" y="20" width="24" height="18" rx="5" />
        <path d="M539 20v-4a6 6 0 0112 0v4" />
        <circle cx="545" cy="29" r="1.6" fill="var(--loss)" stroke="none" />
      </g>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M394 99H414M438 99H452" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 5" />
        <path d="M446 94l7 5-7 5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="426" cy="99" r="10" stroke="var(--loss)" strokeWidth="1.75" />
        <path d="M421.5 94.5l9 9M430.5 94.5l-9 9" stroke="var(--loss)" strokeWidth="1.75" />
      </g>
    </svg>
  );
}

// ---- Posture: the two lanes -----------------------------------------------------------------------------------

function LaneFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 560 110" fill="none" className="h-auto w-full text-navy" aria-hidden="true">
      <g stroke="currentColor">
        <rect x="20" y="16" width="120" height="78" rx="16" strokeOpacity="0.28" fill="currentColor" fillOpacity="0.04" />
        {[34, 54, 74].map((y, i) => (
          <path key={y} d={`M40 ${y}h${[58, 72, 44][i]}`} strokeOpacity="0.3" strokeLinecap="round" />
        ))}
      </g>
      <rect x="420" y="16" width="120" height="78" rx="16" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.07" />
      <circle cx="480" cy="55" r="9" fill="var(--accent)" />
      <circle cx="480" cy="55" r="17" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5" />
      {/* Reading: always flows from your systems into DataTwin. */}
      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="sp-flow" d="M152 40H402" />
        <path d="M395 35l7 5-7 5" />
      </g>
      {children}
    </svg>
  );
}

export function ReadOnlyLane() {
  return (
    <LaneFrame>
      {/* The way back is closed: nothing can be written to your books. */}
      <path d="M408 72H152" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" />
      <path d="M159 67l-7 5 7 5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="280" cy="72" r="11" fill="var(--cream-50)" stroke="var(--loss)" strokeWidth="2" />
      <path d="M275 67l10 10M285 67l-10 10" stroke="var(--loss)" strokeWidth="2" strokeLinecap="round" />
    </LaneFrame>
  );
}

export function WriteBackLane() {
  return (
    <LaneFrame>
      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="sp-flow" d="M408 72H152" />
        <path d="M159 67l-7 5 7 5" />
      </g>
      {/* Gate: only data that has passed your rules. */}
      <rect x="318" y="52" width="26" height="40" rx="8" fill="var(--cream-50)" stroke="var(--accent)" strokeWidth="1.75" />
      <path d="M325 72l4 4 8-9" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Switch: enabled per process, by you. */}
      <rect x="208" y="60" width="50" height="24" rx="12" fill="var(--cream-50)" stroke="var(--accent)" strokeWidth="1.75" />
      <circle cx="246" cy="72" r="8" fill="var(--accent)" />
    </LaneFrame>
  );
}

// ---- Controls: one picture per group --------------------------------------------------------------------------

export function ControlsArt({ kind, className = "" }: { kind: ControlKind; className?: string }) {
  return (
    <svg viewBox="0 0 600 170" fill="none" className={className} aria-hidden="true">
      {kind === "rbac" && <Rbac />}
      {kind === "encryption" && <Encryption />}
      {kind === "audit" && <Audit />}
      {kind === "operations" && <Operations />}
    </svg>
  );
}

function Rbac() {
  const tags = [22, 62, 102, 142];
  return (
    <>
      <circle cx="70" cy="70" r="20" stroke="currentColor" strokeWidth="1.75" />
      <path d="M32 132c3-22 17-34 38-34s35 12 38 34" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path className="sp-flow" d="M118 85H196" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M190 80l6 5-6 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M262 50l30 17v36l-30 17-30-17V67z" stroke="var(--accent)" strokeWidth="2" fill="var(--accent)" fillOpacity="0.1" strokeLinejoin="round" />
      <circle cx="262" cy="85" r="8" fill="var(--accent)" />
      {tags.map((y, i) => (
        <g key={y}>
          <path className="sp-flow" d={`M292 85C340 85 360 ${y + 13} 424 ${y + 13}`} stroke="var(--accent)" strokeOpacity={i === 3 ? 0.25 : 0.7} strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" />
          <rect x="424" y={y} width="140" height="26" rx="13" stroke="currentColor" strokeOpacity={i === 3 ? 0.25 : 0.55} strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <circle cx="442" cy={y + 13} r="4.5" fill={i === 3 ? "currentColor" : "var(--accent)"} fillOpacity={i === 3 ? 0.25 : 1} />
          <path d={`M456 ${y + 13}h${[70, 52, 62, 40][i]}`} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
    </>
  );
}

function Encryption() {
  return (
    <>
      {[40, 450].map((x) => (
        <g key={x}>
          <rect x={x} y="40" width="110" height="80" rx="14" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          {[60, 80, 100].map((y, i) => (
            <path key={y} d={`M${x + 18} ${y}h${[56, 70, 40][i]}`} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
          ))}
          <rect x={x + 82} y="26" width="28" height="24" rx="7" fill="var(--accent)" />
          <path d={`M${x + 88} 26v-5a8 8 0 0116 0v5`} stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <path className="sp-flow" d="M164 80H436" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M429 75l7 5-7 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* TLS in transit */}
      <g className="sp-pulse">
      <rect x="276" y="58" width="48" height="44" rx="12" fill="var(--cream-50, #fff)" stroke="var(--accent)" strokeWidth="2" />
      <path d="M288 58v-6a12 12 0 0124 0v6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" transform="translate(0 0)" />
      <circle cx="300" cy="80" r="4.5" fill="var(--accent)" />
      </g>
      {/* The key is kept apart from the data it protects */}
      <path d="M300 106v22" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
      <rect x="262" y="132" width="76" height="30" rx="15" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />
      <circle cx="282" cy="147" r="6" stroke="var(--accent)" strokeWidth="1.75" />
      <path d="M288 147h24M304 147v6M311 147v4" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" />
    </>
  );
}

function Audit() {
  const xs = [30, 142, 254, 366, 478];
  return (
    <>
      {xs.map((x, i) => (
        <g key={x}>
          {i < xs.length - 1 && <path d={`M${x + 92} 85h20`} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />}
          <rect
            x={x}
            y="48"
            width="92"
            height="74"
            rx="14"
            stroke={i === xs.length - 1 ? "var(--accent)" : "currentColor"}
            strokeOpacity={i === xs.length - 1 ? 1 : 0.5}
            strokeWidth={i === xs.length - 1 ? 2 : 1.5}
            fill={i === xs.length - 1 ? "var(--accent)" : "currentColor"}
            fillOpacity={i === xs.length - 1 ? 0.1 : 0.04}
          />
          <circle cx={x + 18} cy="68" r="4.5" fill="var(--accent)" />
          <path d={`M${x + 30} 68h${[34, 40, 28, 38, 32][i]}`} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M${x + 18} 90h56M${x + 18} 104h${[36, 44, 30, 40, 46][i]}`} stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
      <path d="M30 142H570" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" />
      {xs.map((x) => (
        <circle key={x} cx={x + 46} cy="142" r="3.5" fill="currentColor" fillOpacity="0.4" />
      ))}
      <circle cx="524" cy="142" r="5" fill="var(--accent)" />
      <circle className="sp-travel" cx="76" cy="142" r="7" fill="var(--accent)" fillOpacity="0.35" />
    </>
  );
}

function Operations() {
  const nodes = Array.from({ length: 5 }, (_, k) => {
    const a = ((-90 + k * 72) * Math.PI) / 180;
    return [300 + 62 * Math.cos(a), 85 + 62 * Math.sin(a)] as const;
  });
  return (
    <>
      <path d="M40 85h140M420 85h140" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
      <circle cx="40" cy="85" r="4" fill="currentColor" fillOpacity="0.3" />
      <circle cx="560" cy="85" r="4" fill="currentColor" fillOpacity="0.3" />
      <circle cx="300" cy="85" r="62" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
      <circle className="sp-orbit" cx="300" cy="85" r="62" stroke="var(--accent)" strokeWidth="2" strokeDasharray="60 330" strokeLinecap="round" />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="11" fill="var(--cream-50, #fff)" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="3.5" fill="var(--accent)" />
      ))}
      <path d="M300 62l20 8v14c0 12-8 20-20 25-12-5-20-13-20-25V70z" stroke="var(--accent)" strokeWidth="1.75" strokeLinejoin="round" fill="var(--accent)" fillOpacity="0.1" />
      <path d="M291 85l6 6 11-12" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// ---- RBAC: the two roles the note is about ---------------------------------------------------------------------

// External auditor: a scoped window onto the evidence, with no pen.
export function AuditorArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="6" width="108" height="84" rx="16" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 5" />
      <rect x="30" y="20" width="50" height="58" rx="8" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.05" />
      <path d="M40 36h30M40 46h30M40 56h18" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="88" cy="64" r="16" fill="var(--accent)" />
      <path d="M77 64C81 57 95 57 99 64 95 71 81 71 77 64z" stroke="var(--canvas)" strokeWidth="1.75" strokeLinejoin="round" />
      <circle cx="88" cy="64" r="2.8" fill="var(--canvas)" />
    </svg>
  );
}

// Administrator: configures the rules, but a wall stands between that and approving anything.
export function AdminArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" fill="none" className={className} aria-hidden="true">
      <circle cx="30" cy="48" r="12" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="30" cy="48" r="4" fill="var(--accent)" />
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k * 45 * Math.PI) / 180;
        return (
          <path
            key={k}
            d={`M${30 + 15 * Math.cos(a)} ${48 + 15 * Math.sin(a)}L${30 + 21 * Math.cos(a)} ${48 + 21 * Math.sin(a)}`}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
      <path d="M62 14v68" stroke="var(--loss)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="94" cy="48" r="16" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" strokeDasharray="3 4" />
      <path d="M86 48l6 6 11-12" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Where the data sits ---------------------------------------------------------------------------------------

export function StageArt({ kind, className = "" }: { kind: "cloud" | "estate"; className?: string }) {
  return (
    <svg viewBox="0 0 480 150" fill="none" className={className} aria-hidden="true">
      {kind === "cloud" ? (
        <>
          <rect x="20" y="40" width="120" height="76" rx="16" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          {[60, 78, 96].map((y, i) => (
            <path key={y} d={`M40 ${y}h${[56, 70, 42][i]}`} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
          ))}
          {/* Extract goes out, findings come back */}
          <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path className="sp-flow" d="M156 62H318" />
            <path d="M311 57l7 5-7 5" />
            <path className="sp-flow" d="M318 98H156" />
            <path d="M163 93l-7 5 7 5" />
          </g>
          <path
            d="M352 112h84a26 26 0 004-51.7 38 38 0 00-72-9A30 30 0 00352 112z"
            stroke="var(--accent)"
            strokeWidth="2"
            fill="var(--accent)"
            fillOpacity="0.08"
            strokeLinejoin="round"
          />
          <circle cx="394" cy="84" r="7" fill="var(--accent)" />
        </>
      ) : (
        <>
          <rect x="16" y="12" width="448" height="126" rx="26" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 6" />
          <rect x="52" y="40" width="140" height="70" rx="16" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          {[60, 76, 92].map((y, i) => (
            <path key={y} d={`M72 ${y}h${[60, 78, 46][i]}`} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
          ))}
          <rect x="288" y="40" width="140" height="70" rx="16" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.08" />
          <circle cx="358" cy="75" r="9" fill="var(--accent)" />
          <circle cx="358" cy="75" r="17" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5" />
          <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path className="sp-flow sp-flow-slow" d="M204 75H276" />
            <path d="M269 70l7 5-7 5" />
            <path d="M211 70l-7 5 7 5" />
          </g>
        </>
      )}
    </svg>
  );
}
