import "./darp-page.css";

// Illustrations for the DARP Framework page. All are inline SVG in the site's own language: thin navy/white
// strokes, one amber accent for "the thing that matters". They use currentColor for structure, so each takes
// its ink from the surface it sits on. Motion is layered on in darp-page.css and only under
// prefers-reduced-motion: no-preference, so the static markup here is always a complete picture.

export type DpIconName = "cash" | "tax" | "misstated" | "control" | "read" | "shield" | "apart" | "contract" | "clock";

export function DpIcon({ name, className = "" }: { name: DpIconName; className?: string }) {
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
      {name === "cash" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path className="text-accent" d="M15.2 8.8l-6.4 6.4M9 9.6v5.6h5.6" />
        </>
      )}
      {name === "tax" && (
        <>
          <path d="M6 3.5h9l3.5 3.5v13.5H6z" />
          <circle cx="10" cy="10" r="1.3" />
          <circle className="text-accent" cx="14.5" cy="15.5" r="1.3" />
          <path className="text-accent" d="M14.8 9l-5.2 7" />
        </>
      )}
      {name === "misstated" && (
        <>
          <path d="M12 4v16M7.5 20h9M5 7.5h14" />
          <path d="M5 7.5L2.8 13a2.9 2.9 0 005.4 0zM19 7.5L16.8 13a2.9 2.9 0 005.4 0z" />
          <circle className="text-accent" cx="12" cy="4" r="1.2" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "control" && (
        <>
          <path d="M12 3.5l7 2.8v5.2c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V6.3z" />
          <path className="text-accent" d="M12 8.5v4" />
          <circle className="text-accent" cx="12" cy="15.4" r="0.6" fill="currentColor" />
        </>
      )}
      {name === "read" && (
        <>
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
          <circle className="text-accent" cx="12" cy="12" r="2.6" />
        </>
      )}
      {name === "shield" && (
        <>
          <path d="M12 3.5l7 2.8v5.2c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V6.3z" />
          <path className="text-accent" d="M9 12l2.2 2.2 3.8-4" />
        </>
      )}
      {name === "apart" && (
        <>
          <circle cx="5.5" cy="12" r="2.8" />
          <circle cx="18.5" cy="12" r="2.8" />
          <path className="text-accent" d="M10 12h1.2M12.8 12H14" />
        </>
      )}
      {name === "clock" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path className="text-accent" d="M12 7v5l3.2 2" />
        </>
      )}
      {name === "contract" && (
        <>
          <path d="M6 3.5h9l3.5 3.5v13.5H6z" />
          <path d="M9 11h6M9 14h4" />
          <path className="text-accent" d="M9.5 18l1.6 1.6 3.2-3.4" />
        </>
      )}
    </svg>
  );
}

// ---- One engine, two directions ----------------------------------------------------------------------------

const HISTORY_ROWS = [60, 100, 140, 180, 220] as const;
const FLAGGED = new Set([100, 180]);
const LANES = [110, 170, 230] as const;

export function TwoDirectionsDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 960 330"
      fill="none"
      className={className}
      role="img"
      aria-label="One engine of rules reading back through your transaction history on the left, and testing each new transaction at the point of entry on the right."
    >
      {/* Past: the history stack and the scan that works down it */}
      <g stroke="currentColor">
        {HISTORY_ROWS.map((y, i) => (
          <g key={y}>
            <rect x="60" y={y} width="250" height="28" rx="9" strokeOpacity="0.22" fill="currentColor" fillOpacity="0.04" />
            <path d={`M82 ${y + 14}h${[96, 120, 80, 110, 90][i]}`} strokeOpacity="0.3" strokeLinecap="round" />
            <circle cx="282" cy={y + 14} r="4" strokeWidth="0" fill={FLAGGED.has(y) ? "var(--accent)" : "currentColor"} fillOpacity={FLAGGED.has(y) ? 1 : 0.28} />
          </g>
        ))}
      </g>
      <rect className="dp-scan" x="54" y="55" width="262" height="38" rx="12" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.08" />

      {/* Engine reading backwards */}
      <g stroke="var(--accent)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        {[88, 154, 220].map((y) => (
          <g key={y}>
            <path className="dp-flow" d={`M378 ${y}H334`} />
            <path d={`M342 ${y - 5}l-8 5 8 5`} />
          </g>
        ))}
      </g>

      {/* The one rule set */}
      <rect x="380" y="50" width="200" height="220" rx="30" stroke="var(--accent)" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />
      <g stroke="currentColor" strokeLinecap="round">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle cx="412" cy={96 + i * 42} r="5.5" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.25" />
            <path d={`M432 ${96 + i * 42}h${[104, 84, 112, 72][i]}`} strokeOpacity="0.34" />
          </g>
        ))}
      </g>

      {/* Future: the entry gate and the stream passing it */}
      <g stroke="currentColor" strokeOpacity="0.2" strokeLinecap="round">
        {LANES.map((y) => (
          <path key={y} d={`M590 ${y}H920`} />
        ))}
      </g>
      <path className="dp-gate" d="M740 50v220" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />
      <g>
        {LANES.map((y, i) => (
          <g key={y}>
            <circle className="dp-dot" cx="612" cy={y} r="6" fill="currentColor" fillOpacity="0.8" style={{ "--d": `${i * 1.7}s` } as React.CSSProperties} />
            <circle className="dp-dot" cx="612" cy={y} r="6" fill="var(--accent)" style={{ "--d": `${i * 1.7 + 2.6}s` } as React.CSSProperties} />
          </g>
        ))}
      </g>
      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M912 150l8 20-8 20" strokeOpacity="0" />
        <path d="M600 304H920M906 297l14 7-14 7" />
      </g>
      <g stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M360 304H40M54 297l-14 7 14 7" />
      </g>
    </svg>
  );
}

// ---- Sampled vs full population ----------------------------------------------------------------------------

const COLS = 14;
const ROWS = 6;
const SAMPLED = new Set([3, 12, 17, 26, 33, 41, 50, 58, 69, 77]);

export function PopulationGrid({ mode, className = "" }: { mode: "sample" | "full"; className?: string }) {
  const full = mode === "full";
  return (
    <svg
      viewBox="0 0 336 150"
      fill="none"
      className={className}
      role="img"
      aria-label={
        full
          ? "Every transaction in the population is tested."
          : "A handful of transactions are sampled; most of the population is never looked at."
      }
    >
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const cx = 12 + (i % COLS) * 24;
        const cy = 14 + Math.floor(i / COLS) * 24;
        const lit = full || SAMPLED.has(i);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={lit ? 6 : 4.5}
            fill={full ? "var(--accent)" : lit ? "currentColor" : "currentColor"}
            fillOpacity={full ? 0.9 : lit ? 0.9 : 0.16}
          />
        );
      })}
      {full && <rect className="dp-sweep" x="-4" y="0" width="22" height="150" rx="11" fill="currentColor" fillOpacity="0.14" />}
      {!full && (
        <path d="M0 99h336" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 5" />
      )}
    </svg>
  );
}

// ---- Funded by: coins running down the connector -----------------------------------------------------------

export function FundsConnector({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 110" fill="none" className={className} aria-hidden="true">
      <path d="M20 2v82" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
      <path d="M12 86l8 12 8-12" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* The coins ride the line between its top and the arrowhead, never past either end. */}
      {[0, 1, 2].map((i) => (
        <circle key={i} className="dp-coin" cx="20" cy="8" r="3" fill="var(--accent)" style={{ "--d": `${i * 0.9}s`, "--y": `${i * 30}px` } as React.CSSProperties} />
      ))}
    </svg>
  );
}

// ---- Two-way vs N-way --------------------------------------------------------------------------------------

export function TwoWayArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 44" fill="none" className={className} aria-hidden="true">
      <path d="M29 22h19M72 22h19" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M54.5 22.5l4 4L66 18" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="22" r="11" stroke="currentColor" strokeWidth="1.5" fill="var(--canvas)" />
      <circle cx="102" cy="22" r="11" stroke="currentColor" strokeWidth="1.5" fill="var(--canvas)" />
    </svg>
  );
}

// Five sources feeding one reconciliation: a clean hub and spokes, not a mesh.
export function NWayArt({ className = "" }: { className?: string }) {
  const nodes = Array.from({ length: 5 }, (_, k) => {
    const a = ((-90 + k * 72) * Math.PI) / 180;
    return [60 + 44 * Math.cos(a), 60 + 44 * Math.sin(a)] as const;
  });
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="44" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round">
        {nodes.map(([x, y], i) => (
          <path key={i} className="dp-spoke" d={`M${x.toFixed(1)} ${y.toFixed(1)}L60 60`} style={{ "--d": `${i * 0.3}s` } as React.CSSProperties} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" stroke="currentColor" strokeWidth="1.5" fill="var(--canvas)" />
      ))}
      <circle cx="60" cy="60" r="11" fill="var(--accent)" />
    </svg>
  );
}
