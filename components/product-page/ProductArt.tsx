import "@/components/ap-page/ap-page.css";
import { GateArt } from "@/components/ap-page/ApArt";
import type { GlyphName, HeroOut, MotifKey } from "./product-types";

// Illustrations for the product pages: inline SVG in the site's language (thin strokes in the surface's own
// ink, one amber accent, a restrained red only for a difference or a block). Every picture is laid out
// symmetrically about the centre line of its box so it sits centred in whatever card holds it. Motion comes
// from ap-page.css and only runs when the visitor has not asked for reduced motion.

const sw = { strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// ---- Small glyphs, drawn about (0, 0), about 20 wide and 16 tall --------------------------------------------------

function Glyph({ name }: { name: GlyphName }) {
  switch (name) {
    case "mail":
      return (
        <>
          <rect x="-10" y="-8" width="20" height="16" rx="3" />
          <path d="M-10 -6l10 7.5 10-7.5" />
        </>
      );
    case "folder":
      return <path d="M-10 -5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v8a2 2 0 01-2 2h-16a2 2 0 01-2-2z" transform="translate(0 -0.5)" />;
    case "upload":
      return <path d="M-9 2v4a2 2 0 002 2h14a2 2 0 002-2v-4M0 3v-11M-4 -4l4-4 4 4" />;
    case "bank":
      return (
        <>
          <path d="M-10 -2L0 -8l10 6z" />
          <path d="M-7 0v6M0 0v6M7 0v6M-10 8h20" />
        </>
      );
    case "card":
      return (
        <>
          <rect x="-10" y="-7" width="20" height="14" rx="3" />
          <path d="M-10 -2h20M-7 3h5" />
        </>
      );
    case "doc":
      return (
        <>
          <path d="M-6 -8h8l5 5v11h-13z" />
          <path d="M2 -8v5h5M-3 1h7M-3 4h5" />
        </>
      );
    case "coin":
      return (
        <>
          <circle r="8" />
          <circle r="3.5" />
        </>
      );
    case "chart":
      return <path d="M-8 8v-6M-2 8v-12M4 8v-8M10 8v-14" />;
    case "calendar":
      return (
        <>
          <rect x="-9" y="-6" width="18" height="15" rx="3" />
          <path d="M-9 -1h18M-4 -9v4M4 -9v4" />
        </>
      );
    case "receipt":
      return (
        <>
          <path d="M-6 -8h12v16l-3-2-3 2-3-2-3 2z" />
          <path d="M-3 -3h6M-3 1h4" />
        </>
      );
  }
}

// ---- Hero: three sources in, five checks, one result out ---------------------------------------------------------
// Symmetric about x = 320: the sources on the left, the result on the right, the five checks on the axis.

export function ProductHeroArt({
  glyphs,
  out,
  className = "",
}: {
  glyphs: readonly [GlyphName, GlyphName, GlyphName];
  out: HeroOut;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 640 190" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor">
        {[59, 99, 139].map((cy, i) => (
          <g key={cy}>
            <rect x="30" y={cy - 15} width="150" height="30" rx="10" strokeOpacity="0.28" fill="currentColor" fillOpacity="0.04" />
            <g transform={`translate(55 ${cy})`} strokeOpacity="0.75" {...sw}>
              <Glyph name={glyphs[i]} />
            </g>
            <path d={`M76 ${cy}h${[70, 84, 56][i]}`} strokeOpacity="0.3" strokeLinecap="round" />
          </g>
        ))}
      </g>

      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="ap-flow" d="M196 95H260" />
        <path d="M253 90l7 5-7 5" />
        <path className="ap-flow" d="M380 95H444" />
        <path d="M437 90l7 5-7 5" />
      </g>

      <rect x="272" y="30" width="96" height="130" rx="22" stroke="var(--accent)" strokeWidth="2" fill="var(--accent)" fillOpacity="0.07" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} className="ap-pulse" style={{ animationDelay: `${i * 0.25}s` }}>
          <circle cx="296" cy={52 + i * 22} r="7" stroke="var(--accent)" strokeWidth="1.5" />
          <path d={`M292.5 ${52 + i * 22}l2.5 2.5 4.5-5`} stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M312 ${52 + i * 22}h34`} stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}

      <rect x="460" y="44" width="150" height="102" rx="14" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.08" />
      {out === "entry" && (
        <>
          <path d="M478 66h60M478 84h96M478 102h80" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M478 124h36" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="586" cy="124" r="9" fill="var(--accent)" />
          <path d="M581.5 124l3 3 5-6" stroke="var(--canvas)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {out === "register" && (
        <>
          {[70, 92, 114].map((y, i) => (
            <g key={y}>
              <path d={`M478 ${y}h${[40, 52, 34][i]}`} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
              <rect x="546" y={y - 7} width="48" height="14" rx="7" stroke={i === 1 ? "var(--loss)" : "var(--accent)"} strokeWidth="1.5" fill={i === 1 ? "var(--loss)" : "var(--accent)"} fillOpacity="0.16" />
            </g>
          ))}
        </>
      )}
      {out === "chart" && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={482 + i * 30}
              y={128 - [28, 42, 36, 58][i]}
              width="18"
              height={[28, 42, 36, 58][i]}
              rx="5"
              stroke={i === 3 ? "var(--accent)" : "currentColor"}
              strokeOpacity={i === 3 ? 1 : 0.5}
              strokeWidth="1.5"
              fill={i === 3 ? "var(--accent)" : "currentColor"}
              fillOpacity={i === 3 ? 0.25 : 0.05}
            />
          ))}
          <path d="M478 70H592" stroke="var(--accent)" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// ---- Lane pictures ------------------------------------------------------------------------------------------------

const GATE_NUMBER: Partial<Record<MotifKey, 1 | 2 | 3 | 4 | 5>> = { converge: 1, match: 2, checklist: 3, paths: 4, compare: 5 };

export function Motif({ kind, className = "" }: { kind: MotifKey; className?: string }) {
  const gate = GATE_NUMBER[kind];
  if (gate) return <GateArt gate={gate} className={className} />;
  return (
    <svg viewBox="0 0 560 140" fill="none" className={className} aria-hidden="true">
      {kind === "split" && <Split />}
      {kind === "timeline" && <Timeline />}
      {kind === "bars" && <Bars />}
      {kind === "ranking" && <Ranking />}
      {kind === "register" && <Register />}
      {kind === "flow" && <Flow />}
      {kind === "ledger" && <Ledger />}
      {kind === "hub" && <Hub />}
      {kind === "calc" && <Calc />}
      {kind === "tiers" && <Tiers />}
      {kind === "doc" && <Doc />}
      {kind === "calendar" && <Calendar />}
    </svg>
  );
}

const N = "currentColor";

// One payment clears the lines it settles; only the real residue stays open.
function Split() {
  return (
    <>
      <rect x="70" y="34" width="120" height="72" rx="14" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.1" />
      <path d="M88 58h56M88 76h80" stroke={N} strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M88 92h30" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85">
        <path className="ap-flow" d="M192 70C262 70 268 36 328 36" />
        <path className="ap-flow" d="M192 70H328" />
        <path className="ap-flow" d="M192 70C262 70 268 104 328 104" />
      </g>
      {[22, 56, 90].map((y, i) => (
        <g key={y}>
          <rect x="330" y={y} width="160" height="28" rx="10" stroke={i === 2 ? N : "var(--accent)"} strokeOpacity={i === 2 ? 0.5 : 1} strokeWidth="1.5" strokeDasharray={i === 2 ? "4 4" : undefined} fill={i === 2 ? N : "var(--accent)"} fillOpacity={i === 2 ? 0.03 : 0.14} />
          {i === 2 ? (
            <>
              <path d="M338 104h72" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="470" cy="104" r="4" fill={N} fillOpacity="0.35" />
            </>
          ) : (
            <>
              <path d={`M346 ${y + 14}h${i === 0 ? 90 : 70}`} stroke={N} strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="470" cy={y + 14} r="7" fill="var(--accent)" />
              <path d={`M466.5 ${y + 14}l2.5 2.5 4.5-5`} stroke="var(--canvas, #041e3c)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
        </g>
      ))}
    </>
  );
}

// A period earned: an amount spread across the periods it covers.
function Timeline() {
  return (
    <>
      <rect x="72" y="16" width="416" height="14" rx="7" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.2" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect
            x={72 + i * 72}
            y="48"
            width="56"
            height="64"
            rx="12"
            stroke={i < 3 ? "var(--accent)" : N}
            strokeOpacity={i < 3 ? 1 : 0.45}
            strokeWidth="1.5"
            strokeDasharray={i < 3 ? undefined : "4 4"}
            fill={i < 3 ? "var(--accent)" : N}
            fillOpacity={i < 3 ? 0.18 : 0.03}
          />
          <path d={`M${88 + i * 72} 80h24`} stroke={N} strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx={100 + i * 72} cy="126" r="3.5" fill={i < 3 ? "var(--accent)" : N} fillOpacity={i < 3 ? 1 : 0.3} />
        </g>
      ))}
    </>
  );
}

// Two series side by side; where they should agree and do not, the gap is marked.
function Bars() {
  const left = [56, 72, 48, 84, 64];
  const right = [56, 72, 48, 62, 64];
  return (
    <>
      <path d="M60 118H500" stroke={N} strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
      {left.map((h, i) => {
        const c = 100 + i * 90;
        return (
          <g key={i}>
            <rect x={c - 22} y={118 - h} width="18" height={h} rx="5" stroke={N} strokeOpacity="0.55" strokeWidth="1.5" fill={N} fillOpacity="0.05" />
            <rect x={c + 4} y={118 - right[i]} width="18" height={right[i]} rx="5" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.22" />
            {i === 3 && (
              <>
                <path d={`M${c + 13} ${118 - h}V${118 - right[i] - 4}`} stroke="var(--loss)" strokeWidth="1.5" strokeDasharray="2 3" strokeLinecap="round" />
                <circle cx={c + 13} cy={118 - h - 8} r="7" fill="var(--loss)" />
                <path d={`M${c + 10} ${118 - h - 8}h6`} stroke="var(--canvas, #041e3c)" strokeWidth="1.6" strokeLinecap="round" />
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

// Items ranked by how long is left; the most urgent first.
function Ranking() {
  const lens = [300, 240, 180, 120, 70];
  return (
    <>
      {lens.map((len, i) => {
        const y = 14 + i * 24;
        return (
          <g key={i}>
            <circle cx="121" cy={y + 8} r="8" stroke={i === 0 ? "var(--accent)" : N} strokeOpacity={i === 0 ? 1 : 0.5} strokeWidth="1.5" fill={i === 0 ? "var(--accent)" : "none"} fillOpacity="0.2" />
            <rect x="147" y={y} width={len} height="16" rx="8" stroke={i === 0 ? "var(--accent)" : N} strokeOpacity={i === 0 ? 1 : 0.45} strokeWidth="1.5" fill={i === 0 ? "var(--accent)" : N} fillOpacity={i === 0 ? 0.28 : 0.05} />
          </g>
        );
      })}
    </>
  );
}

// A register: rows with a status each.
function Register() {
  return (
    <>
      <rect x="70" y="12" width="420" height="116" rx="14" stroke={N} strokeOpacity="0.55" strokeWidth="1.5" fill={N} fillOpacity="0.04" />
      <path d="M70 38H490" stroke={N} strokeOpacity="0.3" strokeWidth="1.5" />
      <path d="M90 25h40M194 25h50M300 25h40" stroke={N} strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      {[58, 80, 102].map((y, i) => (
        <g key={y}>
          <path d={`M90 ${y}h${[50, 40, 56][i]}M194 ${y}h${[58, 70, 44][i]}M300 ${y}h${[44, 36, 52][i]}`} stroke={N} strokeOpacity="0.3" strokeWidth="1.75" strokeLinecap="round" />
          <rect x="394" y={y - 8} width="80" height="16" rx="8" stroke={i === 1 ? "var(--loss)" : "var(--accent)"} strokeWidth="1.5" strokeDasharray={i === 2 ? "3 3" : undefined} fill={i === 1 ? "var(--loss)" : "var(--accent)"} fillOpacity="0.16" />
        </g>
      ))}
    </>
  );
}

// A chain of steps.
function Flow() {
  return (
    <>
      {[80, 180, 280, 380, 480].map((x, i) => (
        <g key={x}>
          {i < 4 && <path className="ap-flow" d={`M${x + 20} 70H${x + 80}`} stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />}
          <circle cx={x} cy="70" r="18" fill="var(--cream-50, #fff)" />
          <circle cx={x} cy="70" r="18" stroke={i === 4 ? "var(--accent)" : N} strokeOpacity={i === 4 ? 1 : 0.6} strokeWidth="1.75" fill={i === 4 ? "var(--accent)" : N} fillOpacity={i === 4 ? 0.18 : 0.04} />
          {i === 4 ? (
            <path d={`M${x - 7} 70l5 5 9-10`} stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <circle cx={x} cy="70" r="4" fill={N} fillOpacity="0.4" />
          )}
        </g>
      ))}
    </>
  );
}

// Entries add up to a total.
function Ledger() {
  return (
    <>
      {[22, 52, 82].map((y, i) => (
        <g key={y}>
          <rect x="70" y={y} width="220" height="26" rx="9" stroke={N} strokeOpacity="0.45" strokeWidth="1.5" fill={N} fillOpacity="0.04" />
          <path d={`M88 ${y + 13}h${[90, 120, 70][i]}`} stroke={N} strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="270" cy={y + 13} r="4" fill={N} fillOpacity="0.4" />
        </g>
      ))}
      <path className="ap-flow" d="M298 70H342" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M335 65l7 5-7 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="350" y="34" width="140" height="72" rx="14" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.1" />
      <path d="M370 58h60" stroke={N} strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M370 80h36" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="466" cy="80" r="9" fill="var(--accent)" />
      <path d="M461.5 80l3 3 5-6" stroke="var(--canvas, #041e3c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// Many parties reconciled at once.
function Hub() {
  const nodes = [0, 60, 120, 180, 240, 300].map((a) => {
    const r = (a * Math.PI) / 180;
    return [280 + 170 * Math.cos(r), 70 + 46 * Math.sin(r)] as const;
  });
  return (
    <>
      <g stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round">
        {nodes.map(([x, y], i) => (
          <path key={i} className="ap-flow" d={`M${x.toFixed(1)} ${y.toFixed(1)}L280 70`} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="12" fill="var(--cream-50, #fff)" />
          <circle cx={x} cy={y} r="12" stroke={N} strokeOpacity="0.6" strokeWidth="1.5" fill={N} fillOpacity="0.05" />
        </g>
      ))}
      <circle cx="280" cy="70" r="24" fill="var(--cream-50, #fff)" />
      <circle cx="280" cy="70" r="24" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.16" />
      <path d="M270 70l7 7 13-14" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// Inputs go through a calculation to one figure.
function Calc() {
  return (
    <>
      {[20, 56, 92].map((y, i) => (
        <g key={y}>
          <rect x="70" y={y} width="100" height="28" rx="9" stroke={N} strokeOpacity="0.5" strokeWidth="1.5" fill={N} fillOpacity="0.04" />
          <path d={`M84 ${y + 14}h${[44, 58, 36][i]}`} stroke={N} strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
          <path className="ap-flow" d={`M172 ${y + 14}C204 ${y + 14} 206 70 228 70`} stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
      <rect x="230" y="30" width="100" height="80" rx="20" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.1" />
      <path d="M300 52H262L282 70 262 88H300" stroke="var(--accent)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <path className="ap-flow" d="M332 70H384" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M377 65l7 5-7 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="390" y="40" width="100" height="60" rx="14" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.08" />
      <path d="M406 62h44" stroke={N} strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="466" cy="78" r="8" fill="var(--accent)" />
      <path d="M462.5 78l2.5 2.5 4.5-5" stroke="var(--canvas, #041e3c)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

// Tiers: the threshold reached decides the rate.
function Tiers() {
  const hs = [28, 44, 62, 82, 102];
  return (
    <>
      <path d="M70 124H490" stroke={N} strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
      {hs.map((h, i) => {
        const c = 100 + i * 90;
        const hit = i === 2;
        return (
          <rect
            key={i}
            x={c - 26}
            y={124 - h}
            width="52"
            height={h}
            rx="8"
            stroke={hit ? "var(--accent)" : N}
            strokeOpacity={hit ? 1 : 0.5}
            strokeWidth="1.5"
            strokeDasharray={i > 2 ? "4 4" : undefined}
            fill={hit ? "var(--accent)" : N}
            fillOpacity={hit ? 0.24 : 0.04}
          />
        );
      })}
      <path className="ap-flow" d="M70 62H490" stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="280" cy="62" r="6" fill="var(--accent)" />
    </>
  );
}

// A term in a document, cited against a transaction.
function Doc() {
  return (
    <>
      <rect x="70" y="14" width="130" height="112" rx="12" stroke={N} strokeOpacity="0.55" strokeWidth="1.5" fill={N} fillOpacity="0.04" />
      <path d="M88 34h70M88 46h50M88 94h74M88 106h44" stroke={N} strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
      <rect x="80" y="58" width="110" height="22" rx="7" stroke="var(--accent)" strokeWidth="1.25" fill="var(--accent)" fillOpacity="0.22" />
      <path className="ap-flow" d="M192 69C262 69 262 82 328 82" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="330" y="56" width="160" height="52" rx="12" stroke={N} strokeOpacity="0.55" strokeWidth="1.5" fill={N} fillOpacity="0.04" />
      <path d="M348 82h70" stroke={N} strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="466" cy="82" r="7" fill="var(--accent)" />
      <circle cx="410" cy="30" r="12" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.12" />
      <path d="M404 32c0-3 1.5-5 4-5M412 32c0-3 1.5-5 4-5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M410 42v14" stroke="var(--accent)" strokeWidth="1.25" strokeDasharray="2 3" strokeLinecap="round" />
    </>
  );
}

// Dates, the nearest running out.
function Calendar() {
  const lens = [8, 20, 32, 44, 52, 56];
  return (
    <>
      {lens.map((len, i) => {
        const x = 72 + i * 72;
        const bad = i === 0;
        const col = bad ? "var(--loss)" : i === 1 ? "var(--accent)" : N;
        return (
          <g key={i}>
            <rect x={x} y="30" width="56" height="64" rx="12" stroke={col} strokeOpacity={bad || i === 1 ? 1 : 0.45} strokeWidth="1.5" fill={col} fillOpacity={bad ? 0.14 : i === 1 ? 0.12 : 0.03} />
            <path d={`M${x} 50h56`} stroke={col} strokeOpacity={bad || i === 1 ? 0.8 : 0.3} strokeWidth="1.5" />
            <path d={`M${x + 16} 72h24`} stroke={N} strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
            <rect x={x} y="108" width="56" height="6" rx="3" fill={N} fillOpacity="0.08" />
            <rect x={x} y="108" width={len} height="6" rx="3" fill={col} fillOpacity={bad || i === 1 ? 1 : 0.4} />
          </g>
        );
      })}
    </>
  );
}
