import type { CSSProperties } from "react";
import { DarpGlyph } from "./DarpGlyph";
import { DARP_STAGES, type DarpStageKey } from "./darp-data";

// Mobile recomposition: the same engine turned vertical. One spine runs through the four stages.
// Row-local segments keep everything aligned however the copy wraps.

const seg = (delay: number) => ({ "--dp-d": `${delay}s` }) as CSSProperties;

function Segment({ delay = 0 }: { delay?: number }) {
  return (
    <span
      aria-hidden="true"
      className="dp-seg relative min-h-6 w-px flex-1 overflow-hidden bg-white/15"
      style={seg(delay)}
    />
  );
}

function Node({ stage }: { stage: DarpStageKey }) {
  return (
    <span className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/40 bg-navy text-white">
      <DarpGlyph stage={stage} className="h-6 w-6" />
    </span>
  );
}

export function DarpEngineStack({ className = "" }: { className?: string }) {
  const last = DARP_STAGES.length - 1;

  return (
    <ol className={`dp-engine flex flex-col ${className}`.trim()}>
      {DARP_STAGES.map((stage, index) => (
        <li key={stage.key} className="grid grid-cols-[3rem_1fr] gap-x-5">
          <div className="flex flex-col items-center">
            {index === 0 ? <span className="flex-1" /> : <Segment delay={index * 1.4} />}
            <Node stage={stage.key} />
            {index === last ? <span className="flex-1" /> : <Segment delay={index * 1.4 + 0.7} />}
          </div>
          <div className="py-7">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="dt-display mt-1.5 text-[1.75rem] leading-tight font-semibold tracking-[-0.01em] text-white">
              {stage.label}
            </h3>
            <p className="mt-2 text-[15px] leading-snug text-white/70">{stage.copy}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
