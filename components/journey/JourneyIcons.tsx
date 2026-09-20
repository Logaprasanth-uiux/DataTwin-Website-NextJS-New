import type { CSSProperties, ReactNode } from "react";

// One small line illustration per stage, in the same language as the Recovery and Solutions icons:
// light structure (currentColor, set by the dark ring), orange for the signal and the confirmation,
// 1.33px strokes. Discs that must hide the lines behind them are filled with the ring's navy. Each is written in
// its complete state, so it reads correctly with no animation. Motion lives in journey.css: the
// stage class (jn-s1..jn-s4) says when the signal reaches this stage, and `d()` staggers a part
// within that arrival.

const d = (ms: number, extra: Record<string, string> = {}) =>
  ({ "--jn-d": `${ms}ms`, ...extra }) as CSSProperties;

function Frame({ stage, children }: { stage: 1 | 2 | 3 | 4; children: ReactNode }) {
  return (
    <span className={`jn-s${stage} inline-flex h-12 w-12`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {children}
      </svg>
    </span>
  );
}

const Draw = ({ delay, ...props }: { delay: number } & React.SVGProps<SVGPathElement>) => (
  <path className="jn-draw" pathLength={1} style={d(delay)} {...props} />
);

// 01 - Describe -> the problem is identified. An input line, and a signal that lands on a marker.
function DescribeIcon() {
  return (
    <Frame stage={1}>
      <rect x="3" y="17" width="31" height="14" rx="7" />
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M9 24H18" />
        <Draw delay={150} d="M21 24H27" />
      </g>
      <path d="M34 24H37" strokeOpacity="0.3" />
      <g className="text-accent">
        <circle className="jn-run" style={d(350, { "--rx": "8px" })} cx="34" cy="24" r="1.9" fill="var(--navy)" stroke="currentColor" />
      </g>
      <circle className="jn-draw" pathLength={1} style={d(600)} cx="42" cy="24" r="5" />
      <g className="text-accent">
        <circle className="jn-fade" style={d(900)} cx="42" cy="24" r="2.2" fill="currentColor" stroke="none" />
      </g>
    </Frame>
  );
}

// 02 - Data points resolve into a verified identity.
function IdentityIcon() {
  return (
    <Frame stage={2}>
      <circle cx="15" cy="14" r="5.5" />
      <path d="M4 34C4 27.5 9 24 15 24S26 27.5 26 34" />
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M31 12H43" />
        <Draw delay={140} d="M31 19H43" />
        <Draw delay={280} d="M31 26H38" />
      </g>
      <g className="text-accent">
        <g className="jn-fade" style={d(700)}>
          <circle cx="31" cy="36" r="6.5" fill="var(--navy)" stroke="currentColor" />
        </g>
        <Draw delay={900} d="M27.8 36.3L30 38.5L34.4 33.6" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// 03 - Read-only access -> Discover -> Assess -> a number. A scan passes over the source without
// touching it: everything flows outward from the record, nothing flows back.
function ReadOnlyIcon() {
  return (
    <Frame stage={3}>
      <rect x="2" y="9" width="16" height="30" rx="2" />
      <g strokeOpacity="0.5">
        <path d="M6 16H14M6 22H14M6 28H11" />
      </g>
      <g className="text-accent">
        <path className="jn-run" style={d(0, { "--ry": "20px" })} d="M4 14H16" stroke="currentColor" />
      </g>
      <path d="M18 24H21M33 24H36" strokeOpacity="0.3" />
      <Draw delay={500} d="M21 24C24 19.5 30 19.5 33 24C30 28.5 24 28.5 21 24Z" />
      <g className="text-accent">
        <circle className="jn-fade" style={d(700)} cx="27" cy="24" r="2.1" fill="currentColor" stroke="none" />
      </g>
      <rect className="jn-draw" pathLength={1} style={d(950)} x="37" y="16" width="10" height="16" rx="2" />
      <g className="text-accent">
        <Draw delay={1150} d="M39.5 21H44.5L41.5 28" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// 04 - Findings -> a booked conversation -> confirmed. The completion of the journey.
function MeetingIcon() {
  return (
    <Frame stage={4}>
      <rect x="4" y="10" width="34" height="32" rx="3" />
      <path d="M4 19H38" strokeOpacity="0.5" />
      <path d="M13 7V13M29 7V13" />
      <g className="jn-fade" style={d(0)} fill="currentColor" stroke="none" fillOpacity="0.5">
        <circle cx="12" cy="26" r="1" />
        <circle cx="21" cy="26" r="1" />
        <circle cx="30" cy="26" r="1" />
        <circle cx="12" cy="34" r="1" />
        <circle cx="21" cy="34" r="1" />
      </g>
      <g className="text-accent">
        <rect className="jn-draw" pathLength={1} style={d(450)} x="25" y="30" width="10" height="8" rx="2" stroke="currentColor" />
        <g className="jn-fade" style={d(800)}>
          <circle cx="38" cy="38" r="7" fill="var(--navy)" stroke="currentColor" />
        </g>
        <Draw delay={1000} d="M34.6 38.4L37 40.8L41.6 35.4" stroke="currentColor" />
      </g>
    </Frame>
  );
}

export const JOURNEY_ICONS = [DescribeIcon, IdentityIcon, ReadOnlyIcon, MeetingIcon] as const;
