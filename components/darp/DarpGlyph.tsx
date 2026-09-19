import type { DarpStageKey } from "./darp-data";

// 24×24 line glyphs for the four stages. Structure uses the current stroke colour; the one
// orange accent per glyph marks what that stage surfaces. Every glyph is written in its completed
// state (what reduced-motion users see); the .dg-* classes are hooks for the shared micro-animation
// cycle in globals.css. Each stage's animation is independent, so any one can be refined alone.
export function DarpGlyphPaths({ stage }: { stage: DarpStageKey }) {
  switch (stage) {
    case "discover":
      return (
        <>
          <path className="dg-d-line1" pathLength={1} d="M4 7h9" />
          <path className="dg-d-line2" pathLength={1} d="M4 12h13" />
          <path className="dg-d-line3" pathLength={1} d="M4 17h7" />
          <path className="dg-d-arrow text-accent" d="M16.5 9.5L19.5 12l-3 2.5" />
        </>
      );
    case "assess":
      return (
        <>
          <g className="dg-a-scan">
            <circle cx="11" cy="11" r="5.5" />
            <path d="M15.2 15.2L19.5 19.5" />
            <circle cx="11" cy="11" r="1.7" className="text-accent" fill="currentColor" stroke="none" />
          </g>
          <path className="dg-a-under text-accent" d="M6.5 20.2h6" />
        </>
      );
    case "recover":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path className="dg-r-check text-accent" pathLength={1} d="M8.5 12.2l2.5 2.5 4.5-5" />
        </>
      );
    case "prevent":
      return (
        <>
          <path d="M12 3.5l7 2.8v5.2c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V6.3z" />
          <path className="dg-p-check text-accent" pathLength={1} d="M9 12l2.2 2.2 3.8-4" />
        </>
      );
  }
}

export function DarpGlyph({ stage, className = "" }: { stage: DarpStageKey; className?: string }) {
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
      <DarpGlyphPaths stage={stage} />
    </svg>
  );
}
