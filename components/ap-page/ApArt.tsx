import "./ap-page.css";

// Illustrations for the Accounts Payable page: inline SVG in the site's language. Thin strokes in the surface's
// own ink (currentColor), one amber accent for what matters, a restrained red only for a difference or a block.
// Motion lives in ap-page.css and only runs when the visitor has not asked for reduced motion.

const sw = { strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// ---- Hero: three channels in, five checks, one correct entry ----------------------------------------------------
// Symmetric about x = 320: the channels on the left, the entry on the right, the five checks on the axis.

export function InvoiceToEntryArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 190"
      fill="none"
      className={className}
      role="img"
      aria-label="Invoices arrive by email, shared folder and portal, pass five checks, and land as one correct entry."
    >
      <g stroke="currentColor">
        {[59, 99, 139].map((cy, i) => (
          <g key={cy}>
            <rect x="30" y={cy - 15} width="150" height="30" rx="10" strokeOpacity="0.28" fill="currentColor" fillOpacity="0.04" />
            {/* Each icon is drawn about its row's centre line (cy), 20 wide, 16 tall. */}
            <g strokeOpacity="0.75" {...sw}>
              {i === 0 && (
                <>
                  <rect x="45" y={cy - 8} width="20" height="16" rx="3" />
                  <path d={`M45 ${cy - 6}l10 7.5 10-7.5`} />
                </>
              )}
              {i === 1 && <path d={`M45 ${cy - 5}a2 2 0 012-2h5l2 3h9a2 2 0 012 2v8a2 2 0 01-2 2H47a2 2 0 01-2-2z`} transform="translate(0 -0.5)" />}
              {i === 2 && <path d={`M46 ${cy + 2}v4a2 2 0 002 2h14a2 2 0 002-2v-4M55 ${cy + 3}v-11M51 ${cy - 4}l4-4 4 4`} />}
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
      <path d="M478 66h60M478 84h96M478 102h80" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M478 124h36" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="586" cy="124" r="9" fill="var(--accent)" />
      <path d="M581.5 124l3 3 5-6" stroke="var(--canvas)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- One picture per gate ----------------------------------------------------------------------------------------

function Card({ x, y, w, h, accent = false, rows = 2 }: { x: number; y: number; w: number; h: number; accent?: boolean; rows?: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        stroke={accent ? "var(--accent)" : "currentColor"}
        strokeOpacity={accent ? 1 : 0.5}
        strokeWidth="1.5"
        fill={accent ? "var(--accent)" : "currentColor"}
        fillOpacity={accent ? 0.1 : 0.04}
      />
      {Array.from({ length: rows }, (_, i) => (
        <path
          key={i}
          d={`M${x + 12} ${y + 14 + i * 12}h${(w - 24) * (i % 2 ? 0.55 : 0.8)}`}
          stroke="currentColor"
          strokeOpacity="0.32"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

export function GateArt({ gate, className = "" }: { gate: 1 | 2 | 3 | 4 | 5; className?: string }) {
  return (
    <svg viewBox="0 0 560 140" fill="none" className={className} aria-hidden="true">
      {gate === 1 && (
        <>
          {[26, 70, 114].map((y, i) => (
            <g key={y}>
              <rect x="70" y={y - 16} width="48" height="32" rx="9" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
              <g stroke="currentColor" strokeOpacity="0.8" {...sw}>
                {i === 0 && (
                  <>
                    <rect x="84" y={y - 7} width="20" height="14" rx="2.5" />
                    <path d={`M84 ${y - 5}l10 7 10-7`} />
                  </>
                )}
                {i === 1 && <path d={`M85 ${y + 6}v-9a2 2 0 012-2h5l2 3h8a2 2 0 012 2v6a2 2 0 01-2 2H87a2 2 0 01-2-2z`} />}
                {i === 2 && <path d={`M85 ${y + 5}v2a2 2 0 002 2h14a2 2 0 002-2v-2M94 ${y + 4}v-11M90 ${y - 5}l4-4 4 4`} />}
              </g>
              <path className="ap-flow" d={`M126 ${y}C220 ${y} 250 70 372 70`} stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.5" />
            </g>
          ))}
          <rect x="380" y="22" width="110" height="96" rx="16" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.07" />
          {[40, 62, 84].map((y, i) => (
            <path key={y} d={`M398 ${y}h${[60, 74, 46][i]}`} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
          ))}
          <path d="M470 98a8 8 0 100-16 8 8 0 000 16z" fill="var(--accent)" />
        </>
      )}
      {gate === 2 && (
        <>
          <Card x={86} y={16} w={104} h={44} />
          <Card x={86} y={80} w={104} h={44} />
          <Card x={370} y={48} w={104} h={44} accent />
          <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round">
            <path className="ap-flow" d="M192 38C226 38 238 56 259 58" />
            <path className="ap-flow" d="M192 102C226 102 238 84 259 82" />
            <path className="ap-flow" d="M368 70H304" />
          </g>
          {/* An opaque disc first, so the links stop at its edge and never show through the tick. */}
          <circle cx="280" cy="70" r="24" fill="var(--cream-50, #fff)" />
          <circle cx="280" cy="70" r="24" fill="var(--accent)" fillOpacity="0.14" stroke="var(--accent)" strokeWidth="1.75" />
          <path d="M269 70l8 8 14-16" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {gate === 3 && (
        <>
          {[22, 54, 86, 118].map((y, i) => (
            <g key={y}>
              <rect x="90" y={y - 12} width="200" height="24" rx="9" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
              <circle cx="110" cy={y} r="7.5" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.14" />
              <path d={`M106.5 ${y}l2.5 2.5 4.5-5`} stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d={`M128 ${y}h${[110, 76, 126, 92][i]}`} stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}
          <path className="ap-flow" d="M306 70H362" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M355 65l7 5-7 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="372" y="24" width="98" height="92" rx="14" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.08" />
          <path d="M388 50h52M388 70h66" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M388 92h30" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {gate === 4 && (
        <>
          <g stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round">
            {/* serial: one after the other */}
            <path className="ap-flow" d="M85 66C112 54 126 34 150 34" />
            <path className="ap-flow" d="M186 34H236" />
            <path className="ap-flow" d="M272 34C330 34 342 62 384 67" />
            {/* parallel: both at once, then together */}
            <path className="ap-flow" d="M85 74C108 84 124 104 156 104" />
            <path className="ap-flow" d="M156 104C180 104 186 84 198 84" />
            <path className="ap-flow" d="M156 104C180 104 186 124 198 124" />
            <path className="ap-flow" d="M230 84C310 84 346 76 384 72" />
            <path className="ap-flow" d="M230 124C310 124 346 82 384 73" />
          </g>
          <circle cx="76" cy="70" r="9" fill="var(--accent)" />
          {[
            [168, 34, 17],
            [254, 34, 17],
            [214, 84, 15],
            [214, 124, 15],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" fill="var(--cream-50, #fff)" />
              <circle cx={x} cy={y - r * 0.2} r={r * 0.22} stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.25" />
              <path d={`M${x - r * 0.42} ${y + r * 0.52}c${r * 0.06}-${r * 0.3} ${r * 0.24}-${r * 0.42} ${r * 0.42}-${r * 0.42}s${r * 0.36} ${r * 0.12} ${r * 0.42} ${r * 0.42}`} stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.25" strokeLinecap="round" />
            </g>
          ))}
          <circle cx="408" cy="70" r="24" fill="var(--cream-50, #fff)" />
          <circle cx="408" cy="70" r="24" fill="var(--accent)" fillOpacity="0.14" stroke="var(--accent)" strokeWidth="1.75" />
          <path d="M397 70l8 8 14-16" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {gate === 5 && (
        <>
          <Card x={70} y={14} w={160} h={112} rows={0} />
          <Card x={330} y={14} w={160} h={112} rows={0} accent />
          {[34, 56, 78, 100].map((y, i) => {
            const bad = i === 2;
            return (
              <g key={y}>
                <path d={`M88 ${y}h${[70, 50, 62, 40][i]}`} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.75" strokeLinecap="round" />
                <path d={`M348 ${y}h${[70, 50, bad ? 30 : 62, 40][i]}`} stroke={bad ? "var(--loss)" : "currentColor"} strokeOpacity={bad ? 1 : 0.4} strokeWidth="1.75" strokeLinecap="round" />
                {/* the link, in two parts with a clear gap for the mark between them */}
                <path className={bad ? "" : "ap-flow"} d={`M242 ${y}H265M295 ${y}H318`} stroke={bad ? "var(--loss)" : "var(--accent)"} strokeWidth="1.5" strokeLinecap="round" strokeDasharray={bad ? "2 4" : undefined} />
                {bad ? (
                  <path d={`M274.5 ${y - 5.5}l11 11M285.5 ${y - 5.5}l-11 11`} stroke="var(--loss)" strokeWidth="1.75" strokeLinecap="round" />
                ) : (
                  <path d={`M274.5 ${y}l4 4 7-8`} stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}

// ---- Month end ---------------------------------------------------------------------------------------------------

export function MonthArt({ kind, className = "" }: { kind: "amort" | "provision" | "alloc"; className?: string }) {
  return (
    <svg viewBox="0 0 240 110" fill="none" className={className} aria-hidden="true">
      {kind === "amort" && (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <rect
                x={26 + i * 34}
                y="30"
                width="26"
                height="56"
                rx="6"
                stroke={i < 3 ? "var(--accent)" : "currentColor"}
                strokeOpacity={i < 3 ? 1 : 0.45}
                strokeWidth="1.5"
                strokeDasharray={i < 3 ? undefined : "3 3"}
                fill={i < 3 ? "var(--accent)" : "currentColor"}
                fillOpacity={i < 3 ? 0.2 : 0.03}
              />
              <path d={`M${31 + i * 34} 96h16`} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}
          <path d="M26 16h200" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {kind === "provision" && (
        <>
          <rect x="22" y="26" width="50" height="62" rx="10" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.2" />
          <path className="ap-flow" d="M80 57H138" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M131 52l7 5-7 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="146" y="30" width="34" height="46" rx="7" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <path d="M153 44h20M153 54h20M153 64h12" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="190" y="26" width="30" height="62" rx="9" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M214 96H34" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 4" strokeLinecap="round" />
          <path d="M41 91l-7 5 7 5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "alloc" && (
        <>
          <rect x="50" y="12" width="140" height="26" rx="9" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.14" />
          <g stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round">
            <path className="ap-flow" d="M72 38V58M120 38V58M168 38V58" />
          </g>
          {[
            [56, 58, 24],
            [104, 58, 34],
            [152, 58, 18],
          ].map(([x, y, h]) => (
            <rect key={x} x={x} y={y} width="32" height={h + 14} rx="7" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />
          ))}
        </>
      )}
    </svg>
  );
}

// ---- Vendor portal -----------------------------------------------------------------------------------------------

export function PortalArt({ kind, className = "" }: { kind: "onboarding" | "submission" | "status" | "recon"; className?: string }) {
  return (
    <svg viewBox="0 0 240 110" fill="none" className={className} aria-hidden="true">
      {kind === "onboarding" && (
        <>
          <rect x="40" y="8" width="160" height="94" rx="14" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          {[30, 56, 82].map((y, i) => (
            <g key={y}>
              <circle cx="64" cy={y} r="9" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.16" />
              <path d={`M59.5 ${y}l3 3 6-7`} stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d={`M84 ${y}h${[84, 70, 90][i]}`} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.75" strokeLinecap="round" />
            </g>
          ))}
        </>
      )}
      {kind === "submission" && (
        <>
          <rect x="16" y="22" width="66" height="66" rx="12" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <path d="M30 44h38M30 56h38M30 68h24" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
          <path className="ap-flow" d="M90 46H150" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M143 41l7 5-7 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="158" y="22" width="68" height="66" rx="12" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.08" />
          <circle cx="192" cy="55" r="9" fill="var(--accent)" />
          <path d="M150 80H98" stroke="var(--loss)" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
          <path d="M105 75l-7 5 7 5" stroke="var(--loss)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "status" && (
        <>
          <path d="M26 55H214" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 55H128" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          {[26, 74, 122, 170, 214].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="55" r={i === 2 ? 11 : 7} stroke={i <= 2 ? "var(--accent)" : "currentColor"} strokeOpacity={i <= 2 ? 1 : 0.45} strokeWidth="1.5" fill={i < 2 ? "var(--accent)" : "var(--cream-50, #fff)"} fillOpacity={i < 2 ? 1 : 1} />
              {i === 2 && <circle className="ap-pulse" cx={x} cy="55" r="17" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1.5" />}
              {i === 2 && <circle cx={x} cy="55" r="4" fill="var(--accent)" />}
            </g>
          ))}
          <path d="M96 84h50" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M26 26h40" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
      {kind === "recon" && (
        <>
          {[18, 124].map((x, c) => (
            <g key={x}>
              <rect x={x} y="12" width="98" height="86" rx="12" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
              {[30, 50, 70].map((y, i) => (
                <path key={y} d={`M${x + 12} ${y}h${[56, 44, 62][(i + c) % 3]}`} stroke={i === 1 ? "var(--loss)" : "currentColor"} strokeOpacity={i === 1 ? 1 : 0.35} strokeWidth="1.75" strokeLinecap="round" />
              ))}
            </g>
          ))}
          <path d="M120 50H122" stroke="var(--loss)" strokeWidth="1.5" strokeLinecap="round" />
          <path className="ap-flow" d="M118 30H124M118 70H124" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="121" cy="50" r="9" fill="var(--cream-50, #fff)" stroke="var(--loss)" strokeWidth="1.5" />
          <path d="M117.5 50h7" stroke="var(--loss)" strokeWidth="1.75" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// ---- Payment: a discount about to lapse --------------------------------------------------------------------------
// Calendar on the left, clock on the right, a gap between them; symmetric about x = 110.

export function DiscountArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 120" fill="none" className={className} aria-hidden="true">
      <rect x="20" y="20" width="100" height="84" rx="14" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />
      <path d="M20 46h100" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M44 20v-8M96 20v-8" stroke="currentColor" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const cx = 40 + (i % 3) * 20;
        const cy = 64 + Math.floor(i / 3) * 24;
        return i === 4 ? (
          <circle key={i} cx={cx} cy={cy} r="9" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.22" />
        ) : (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="currentColor" fillOpacity="0.3" />
        );
      })}
      <path className="ap-flow" d="M126 82C136 82 138 70 146 64" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="172" cy="62" r="28" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.1" />
      <path d="M172 44v18l12 8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="172" cy="62" r="3" fill="var(--accent)" />
    </svg>
  );
}

// ---- Start here: the two-minute run ------------------------------------------------------------------------------

export function StopwatchArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" className={className} aria-hidden="true">
      <circle cx="120" cy="120" r="104" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="86" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      {Array.from({ length: 60 }, (_, k) => {
        const a = (k * 6 * Math.PI) / 180;
        const long = k % 5 === 0;
        const r1 = long ? 94 : 98;
        return (
          <path
            key={k}
            d={`M${120 + r1 * Math.sin(a)} ${120 - r1 * Math.cos(a)}L${120 + 104 * Math.sin(a)} ${120 - 104 * Math.cos(a)}`}
            stroke="currentColor"
            strokeOpacity={long ? 0.4 : 0.18}
            strokeWidth={long ? 1.75 : 1}
            strokeLinecap="round"
          />
        );
      })}
      {/* the run: a short sweep from 12 o'clock, ending in a dot that keeps circling */}
      <path d="M120 16A104 104 0 0 1 217.1 82.4" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
      <g className="ap-sweep">
        <circle cx="120" cy="16" r="6" fill="var(--accent)" />
        <circle cx="120" cy="16" r="12" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
