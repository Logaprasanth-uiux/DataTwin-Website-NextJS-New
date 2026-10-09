import "./ai-page.css";

// Illustrations for the How AI is used page: inline SVG in the site's language. Thin strokes in the surface's
// own ink (currentColor), one amber accent for the thing that matters, a restrained red only for what is
// blocked. Motion lives in ai-page.css and only runs when the visitor has not asked for reduced motion.

export type AiIconName =
  | "orchestration" | "ingest" | "hygiene" | "registry" | "governance" | "risk" | "wf" | "recon"
  | "investigation" | "accounting" | "remediation" | "kpi"
  | "multi" | "cognitive" | "human" | "elastic" | "learning"
  | "inputs" | "correct" | "guidance" | "arbitrate" | "escalate" | "calibrate";

export function AiIcon({ name, className = "" }: { name: AiIconName; className?: string }) {
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
      {(name === "orchestration" || name === "multi") && (
        <>
          <circle className="text-accent" cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
          <circle cx="5" cy="5" r="1.8" />
          <circle cx="19" cy="5" r="1.8" />
          <circle cx="5" cy="19" r="1.8" />
          <circle cx="19" cy="19" r="1.8" />
          <path d="M6.3 6.3l3.6 3.6M17.7 6.3l-3.6 3.6M6.3 17.7l3.6-3.6M17.7 17.7l-3.6-3.6" />
        </>
      )}
      {name === "ingest" && (
        <>
          <path d="M4 14l2-7.5h12L20 14v5H4z" />
          <path d="M4 14h5l1 2h4l1-2h5" />
          <path className="text-accent" d="M12 2.5v6M9.6 6.2L12 8.6l2.4-2.4" />
        </>
      )}
      {name === "hygiene" && (
        <>
          <path d="M7 3.5h7l4 4V20H7z" />
          <path d="M14 3.5V8h4" />
          <path className="text-accent" d="M10 14.2l2 2 3.6-4" />
        </>
      )}
      {name === "registry" && (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2.5" />
          <circle cx="8.5" cy="11.2" r="2" />
          <path d="M5.8 15.6c.5-1.4 1.5-2 2.7-2s2.2.6 2.7 2" />
          <path className="text-accent" d="M13.5 10.5H18M13.5 13.5H17" />
        </>
      )}
      {name === "governance" && (
        <>
          <path d="M12 4v16M7.5 20h9M5 7.5h14" />
          <path d="M5 7.5L2.8 13a2.9 2.9 0 005.4 0zM19 7.5L16.8 13a2.9 2.9 0 005.4 0z" />
          <circle className="text-accent" cx="12" cy="4" r="1.2" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "risk" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.2" />
          <path className="text-accent" d="M12 12l5.2-5.2" />
          <circle className="text-accent" cx="16.2" cy="14.6" r="1.1" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "wf" && (
        <>
          <path d="M6 3.5h9l3.5 3.5v13.5H6z" />
          <circle cx="10" cy="10" r="1.3" />
          <circle className="text-accent" cx="14.5" cy="15.5" r="1.3" />
          <path className="text-accent" d="M14.8 9l-5.2 7" />
        </>
      )}
      {name === "recon" && (
        <>
          <path d="M3.5 5.5H8c3.2 0 3.2 6.5 6.5 6.5M3.5 18.5H8c3.2 0 3.2-6.5 6.5-6.5M3.5 12h11" />
          <path className="text-accent" d="M14.5 12H20M17.6 9.4L20 12l-2.4 2.6" />
        </>
      )}
      {name === "investigation" && (
        <>
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15 15l5.5 5.5" />
          <circle className="text-accent" cx="10.5" cy="10.5" r="1.6" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "accounting" && (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2.2" />
          <path d="M9 8h6" className="text-accent" />
          <path d="M9 12h6M9 15.5h4" />
        </>
      )}
      {name === "remediation" && (
        <>
          <path d="M14.5 4.2a4.2 4.2 0 00-3.9 5.7L4.4 16a1.9 1.9 0 002.7 2.7l6.2-6.2a4.2 4.2 0 005.7-3.9l-2.6 2.6-2.5-.6-.6-2.5z" />
          <circle className="text-accent" cx="6.2" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "kpi" && (
        <>
          <path d="M5 20v-7M10 20V9M15 20v-5" />
          <path className="text-accent" d="M20 20V5" />
        </>
      )}
      {name === "cognitive" && (
        <>
          <path d="M12 3.5l2 5.2 5.2 2-5.2 2-2 5.3-2-5.3-5.2-2 5.2-2z" />
          <circle className="text-accent" cx="12" cy="11" r="1.4" fill="currentColor" stroke="none" />
          <path d="M18.5 16.5v3M17 18h3" />
        </>
      )}
      {name === "human" && (
        <>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M5 20c.7-3.7 3.5-5.7 7-5.7s6.3 2 7 5.7" />
          <path className="text-accent" d="M9.6 8.2l1.7 1.7 3.1-3.4" />
        </>
      )}
      {name === "elastic" && (
        <>
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          <rect className="text-accent" x="9" y="9" width="6" height="6" rx="1.4" />
        </>
      )}
      {name === "learning" && (
        <>
          <path d="M19.5 12a7.5 7.5 0 01-13 5M4.5 12a7.5 7.5 0 0113-5" />
          <path d="M17.5 3.5V7h-3.5M6.5 20.5V17H10" />
          <circle className="text-accent" cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "inputs" && (
        <>
          <path d="M6 3.5h8l4 4V20H6z" />
          <path d="M14 3.5V8h4" />
          <path className="text-accent" d="M12 11.5v5M9.5 14h5" />
        </>
      )}
      {name === "correct" && (
        <>
          <path d="M5 18.5l.7-3.6L15.8 4.8a1.8 1.8 0 012.6 0l.8.8a1.8 1.8 0 010 2.6L9.1 18.3z" />
          <path className="text-accent" d="M4 21h16" />
        </>
      )}
      {name === "guidance" && (
        <>
          <path d="M12 3v18" />
          <path d="M6 5.5h9l2.5 2.5-2.5 2.5H6z" />
          <path className="text-accent" d="M18 13.5H9L6.5 16 9 18.5h9z" />
        </>
      )}
      {name === "arbitrate" && (
        <>
          <path d="M4 8h11M12 5l3 3-3 3" />
          <path className="text-accent" d="M20 16H9M12 13l-3 3 3 3" />
        </>
      )}
      {name === "escalate" && (
        <>
          <path d="M3.5 19.5h4v-4h4v-4h4v-4h5" />
          <path className="text-accent" d="M15 4.5h5.5V10M20.5 4.5L14 11" />
        </>
      )}
      {name === "calibrate" && (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle className="text-accent" cx="9" cy="7" r="2" fill="var(--cream-50, #fff)" />
          <circle className="text-accent" cx="15" cy="12" r="2" fill="var(--cream-50, #fff)" />
          <circle className="text-accent" cx="8" cy="17" r="2" fill="var(--cream-50, #fff)" />
        </>
      )}
    </svg>
  );
}

// ---- Hero: agents work, rules post ------------------------------------------------------------------------------
// Symmetric about x = 320: the agents on the left, the ledger on the right, the rule gate on the axis.

export function AgentsToLedgerArt({ className = "" }: { className?: string }) {
  const sats = Array.from({ length: 6 }, (_, k) => {
    const a = ((k * 60 - 90) * Math.PI) / 180;
    return [110 + 48 * Math.cos(a), 95 + 48 * Math.sin(a)] as const;
  });
  return (
    <svg
      viewBox="0 0 640 190"
      fill="none"
      className={className}
      role="img"
      aria-label="A team of agents does the work. A rule gate decides what posts to the ledger."
    >
      <circle cx="110" cy="95" r="48" stroke="currentColor" strokeOpacity="0.14" />
      <g stroke="var(--accent)" strokeOpacity="0.55" strokeWidth="1.25">
        {sats.map(([x, y], i) => (
          <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)}L110 95`} />
        ))}
      </g>
      {sats.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
      ))}
      <circle cx="110" cy="95" r="13" fill="var(--accent)" />
      <circle cx="110" cy="95" r="20" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5" />

      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="ai-flow" d="M178 95H296" />
        <path d="M289 90l7 5-7 5" />
        <path className="ai-flow" d="M344 95H462" />
        <path d="M455 90l7 5-7 5" />
      </g>

      <rect className="ai-pulse" x="304" y="52" width="32" height="86" rx="11" stroke="var(--accent)" strokeWidth="2" fill="var(--accent)" fillOpacity="0.1" />
      <path d="M312 96l6 6 11-12" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      <g stroke="currentColor">
        {[56, 94, 132].map((y, i) => (
          <g key={y}>
            <rect
              x="470"
              y={y}
              width="120"
              height="30"
              rx="10"
              strokeOpacity={i === 2 ? 1 : 0.28}
              stroke={i === 2 ? "var(--accent)" : "currentColor"}
              strokeWidth={i === 2 ? 1.75 : 1}
              fill={i === 2 ? "var(--accent)" : "currentColor"}
              fillOpacity={i === 2 ? 0.1 : 0.04}
            />
            <path d={`M490 ${y + 15}h${[50, 66, 44][i]}`} strokeOpacity="0.32" strokeLinecap="round" />
            <circle cx="572" cy={y + 15} r="4" strokeWidth="0" fill={i === 2 ? "var(--accent)" : "currentColor"} fillOpacity={i === 2 ? 1 : 0.3} />
          </g>
        ))}
      </g>
    </svg>
  );
}

// ---- Architecture: the orchestrator reaches the three groups ----------------------------------------------------

export function OrchestratorConnector({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 960 72" fill="none" className={className} preserveAspectRatio="none" aria-hidden="true">
      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="ai-flow" d="M480 0V30" />
        <path d="M160 30H800" strokeOpacity="0.5" />
        {[160, 480, 800].map((x) => (
          <g key={x}>
            <path className="ai-flow" d={`M${x} 30V64`} />
            <path d={`M${x - 6} 58l6 8 6-8`} />
          </g>
        ))}
      </g>
      <circle cx="480" cy="30" r="4" fill="var(--accent)" />
    </svg>
  );
}

// ---- Engines: one small picture each -----------------------------------------------------------------------------

export function EngineArt({ kind, className = "" }: { kind: "ocr" | "rag" | "audere"; className?: string }) {
  return (
    <svg viewBox="0 0 280 120" fill="none" className={className} aria-hidden="true">
      {kind === "ocr" && (
        <>
          <rect x="84" y="8" width="112" height="104" rx="12" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          {[26, 42, 58, 74, 90].map((y, i) => (
            <path key={y} d={`M100 ${y}h${[70, 52, 78, 40, 62][i]}`} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.75" strokeLinecap="round" />
          ))}
          {[42, 74].map((y) => (
            <rect key={y} x="95" y={y - 7} width="90" height="14" rx="5" stroke="var(--accent)" strokeWidth="1.25" fill="var(--accent)" fillOpacity="0.14" />
          ))}
          <rect className="ai-scan" x="80" y="12" width="120" height="5" rx="2.5" fill="var(--accent)" fillOpacity="0.55" />
          <path d="M26 40c6-8 10 8 16 0s10 8 16 0" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="222" y="30" width="38" height="26" rx="5" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
          <circle cx="231" cy="38" r="2" fill="currentColor" fillOpacity="0.4" />
          <path d="M224 54l9-9 7 6 6-5 8 8" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />
        </>
      )}
      {kind === "rag" && (
        <>
          {[14, 48, 82].map((y) => (
            <g key={y}>
              <rect x="14" y={y} width="64" height="26" rx="7" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
              <path d={`M26 ${y + 13}h36`} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
              <path className="ai-flow" d={`M80 ${y + 13}C104 ${y + 13} 104 60 126 60`} stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.5" />
            </g>
          ))}
          <circle cx="140" cy="60" r="14" fill="var(--accent)" />
          <circle cx="140" cy="60" r="21" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5" />
          <path className="ai-flow" d="M162 60H196" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="198" y="16" width="70" height="88" rx="10" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <path d="M210 34h42M210 46h30M210 74h40M210 88h26" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
          <rect x="205" y="53" width="56" height="14" rx="5" stroke="var(--accent)" strokeWidth="1.25" fill="var(--accent)" fillOpacity="0.2" />
        </>
      )}
      {kind === "audere" && (
        <>
          {[
            [14, 16, 40, 16],
            [48, 36, 28, 14],
            [16, 52, 32, 14],
            [52, 66, 26, 16],
            [20, 88, 44, 14],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="5" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.25" strokeDasharray="3 3" />
          ))}
          <path className="ai-flow" d="M88 60H112" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="140" cy="60" r="22" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.08" />
          <circle cx="140" cy="60" r="7" fill="var(--accent)" />
          {Array.from({ length: 8 }, (_, k) => {
            const a = (k * 45 * Math.PI) / 180;
            return (
              <path key={k} d={`M${140 + 25 * Math.cos(a)} ${60 + 25 * Math.sin(a)}L${140 + 31 * Math.cos(a)} ${60 + 31 * Math.sin(a)}`} stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            );
          })}
          <path className="ai-flow" d="M174 60H196" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="198" y="20" width="70" height="80" rx="10" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <rect x="198" y="20" width="70" height="20" rx="10" fill="var(--accent)" fillOpacity="0.3" />
          <path d="M198 58h70M198 78h70M222 40v60" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.25" />
        </>
      )}
    </svg>
  );
}

// ---- In practice -------------------------------------------------------------------------------------------------

export function PracticeArt({ kind, className = "" }: { kind: "source" | "schema" | "reason" | "terms"; className?: string }) {
  return (
    <svg viewBox="0 0 240 110" fill="none" className={className} aria-hidden="true">
      {kind === "source" && (
        <>
          <rect x="14" y="14" width="92" height="82" rx="12" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 4" />
          {[34, 56, 78].map((y, i) => (
            <g key={y}>
              <path d={`M28 ${y}h${[40, 54, 34][i]}`} stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="90" cy={y} r="4" fill="var(--accent)" />
            </g>
          ))}
          <path className="ai-flow" d="M116 55H150" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M144 50l7 5-7 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="160" y="24" width="66" height="62" rx="10" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.07" />
          <path d="M160 45h66M160 66h66M193 24v62" stroke="var(--accent)" strokeOpacity="0.6" strokeWidth="1.25" />
        </>
      )}
      {kind === "schema" && (
        <>
          <path d="M18 18h82a8 8 0 018 8v34a8 8 0 01-8 8H46l-14 12V68H18a8 8 0 01-8-8V26a8 8 0 018-8z" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <path d="M24 34h60M24 46h44M24 58h52" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
          <path className="ai-flow" d="M120 50H152" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M146 45l7 5-7 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="160" y="18" width="66" height="76" rx="10" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <rect x="160" y="18" width="66" height="18" rx="9" fill="var(--accent)" fillOpacity="0.35" />
          <path d="M160 54h66M160 72h66M184 36v58M206 36v58" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.25" />
        </>
      )}
      {kind === "reason" && (
        <>
          {[18, 46, 74].map((y, i) => (
            <g key={y}>
              <rect x="14" y={y} width="74" height="24" rx="8" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
              <path d={`M26 ${y + 12}h${[26, 34, 22][i]}`} stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="76" cy={y + 12} r="4.5" fill={i === 1 ? "var(--loss)" : "currentColor"} fillOpacity={i === 1 ? 1 : 0.4} />
              <path className="ai-flow" d={`M92 ${y + 12}C118 ${y + 12} 118 55 144 55`} stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.5" />
            </g>
          ))}
          <rect x="146" y="32" width="80" height="46" rx="12" stroke="var(--accent)" strokeWidth="1.75" fill="var(--accent)" fillOpacity="0.08" />
          <path d="M174 56l8 8 16-17" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "terms" && (
        <>
          <rect x="14" y="10" width="86" height="92" rx="10" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <path d="M26 26h50M26 38h38M26 72h54M26 84h34" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
          <rect x="22" y="48" width="70" height="16" rx="5" stroke="var(--accent)" strokeWidth="1.25" fill="var(--accent)" fillOpacity="0.2" />
          <path className="ai-flow" d="M96 56C124 56 124 78 150 78" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="152" y="62" width="76" height="32" rx="9" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" />
          <path d="M164 78h32" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="212" cy="78" r="6" fill="var(--accent)" />
          <circle cx="188" cy="34" r="12" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.1" />
          <path d="M183 36c0-3 1.5-5 4-5M191 36c0-3 1.5-5 4-5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M188 46v10" stroke="var(--accent)" strokeWidth="1.25" strokeDasharray="2 3" />
        </>
      )}
    </svg>
  );
}

// ---- Closed loop: prevent feeds correct feeds prevent ------------------------------------------------------------

export function LoopArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 240" fill="none" className={className} aria-hidden="true">
      <path className="ai-flow" d="M14 106C14 36 106 36 106 106" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M99 98l7 9 7-9" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path className="ai-flow" d="M106 134C106 204 14 204 14 134" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M7 142l7-9 7 9" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="120" r="9" fill="var(--accent)" />
      <circle cx="60" cy="120" r="16" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5" />
    </svg>
  );
}

// ---- Human-in-the-loop: the pipeline with people at the gates ----------------------------------------------------

export function GatesArt({ className = "" }: { className?: string }) {
  const gates = [300, 560, 820];
  const nodes = [70, 150, 230, 370, 450, 510, 630, 710, 770, 880];
  return (
    <svg viewBox="0 0 960 120" fill="none" className={className} aria-hidden="true">
      <path className="ai-flow" d="M20 80H940" stroke="var(--accent)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
      {nodes.map((x) => (
        <circle key={x} cx={x} cy="80" r="7" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" fill="var(--cream-50, #fff)" />
      ))}
      {gates.map((x) => (
        <g key={x}>
          <rect className="ai-pulse" x={x - 12} y="52" width="24" height="56" rx="9" stroke="var(--accent)" strokeWidth="2" fill="var(--cream-50, #fff)" />
          <path d={`M${x} 52V40`} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="2 3" />
          <circle cx={x} cy="14" r="6" stroke="currentColor" strokeWidth="1.75" />
          <path d={`M${x - 12} 38c1-7 5-10 12-10s11 3 12 10`} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

// ---- The line we do not cross ------------------------------------------------------------------------------------
// Four small pictures, laid out by the page as two plain rows: reasoning -> evidence, rules -> books.

export function BoundaryIcon({ kind, className = "" }: { kind: "reasoning" | "evidence" | "rules" | "books"; className?: string }) {
  return (
    <svg viewBox="0 0 80 48" fill="none" className={className} aria-hidden="true">
      {kind === "reasoning" && (
        <>
          <path d="M40 10L18 38H62z" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.25" strokeLinejoin="round" />
          {[
            [40, 10],
            [18, 38],
            [62, 38],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="6.5" stroke="currentColor" strokeWidth="1.5" fill="var(--canvas)" />
          ))}
        </>
      )}
      {kind === "evidence" && (
        <>
          <rect x="22" y="6" width="36" height="38" rx="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />
          <path d="M30 18h20M30 26h20M30 34h12" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M54 2v14a4 4 0 01-8 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {kind === "rules" && (
        <>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={6 + i * 24}
              y="10"
              width="20"
              height="28"
              rx="6"
              stroke="var(--accent)"
              strokeOpacity={0.4 + i * 0.3}
              strokeWidth="1.5"
              fill="var(--accent)"
              fillOpacity={0.04 + i * 0.05}
            />
          ))}
        </>
      )}
      {kind === "books" && (
        <>
          {[4, 18, 32].map((y, i) => (
            <g key={y}>
              <rect
                x="12"
                y={y}
                width="56"
                height="12"
                rx="4.5"
                stroke={i === 2 ? "var(--accent)" : "currentColor"}
                strokeOpacity={i === 2 ? 1 : 0.4}
                strokeWidth="1.5"
                fill={i === 2 ? "var(--accent)" : "currentColor"}
                fillOpacity={i === 2 ? 0.14 : 0.05}
              />
              <circle cx="60" cy={y + 6} r="2.2" fill={i === 2 ? "var(--accent)" : "currentColor"} fillOpacity={i === 2 ? 1 : 0.4} />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
