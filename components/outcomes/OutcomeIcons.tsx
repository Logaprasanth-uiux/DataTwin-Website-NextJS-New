import type { CSSProperties, ReactNode } from "react";
import type { OutcomeKey } from "./outcomes-data";

// One small line illustration per outcome, in the same language as the Recovery, Solutions and journey
// icons: navy structure (currentColor), orange for the value that moves and the confirmation. Strokes
// are 1.33: the on-screen weight of the "What can be recovered?" icons (1.5 in this 72x44 box, shown
// there at 64x40; these are shown at 72x44). Each is written in its complete state, so it reads
// correctly with no animation. Motion lives in outcomes.css: the stage class (oc-s1..oc-s6) on the
// parent says when this outcome's turn is, and each animated part's stagger within that turn is `d()`.
// The stagger is also written as a class (oc-dNNN) because the stylesheet bakes each part's timing into
// its own keyframes, so every part of an icon dissolves together yet rebuilds one after another.

const d = (ms: number, extra: Record<string, string> = {}) =>
  ({ "--oc-d": `${ms}ms`, ...extra }) as CSSProperties;

function Frame({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-11 w-[72px] flex-shrink-0 text-navy">
      <svg
        viewBox="0 0 72 44"
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
  <path className={`oc-draw oc-d${delay}`} pathLength={1} style={d(delay)} {...props} />
);

// 01 - Value -> bank -> confirmed
function CashIcon() {
  return (
    <Frame>
      <circle className="oc-draw oc-d0" pathLength={1} style={d(0)} cx="13" cy="22" r="8" />
      <Draw delay={150} d="M10 22H16" strokeOpacity="0.5" />
      <path d="M22 22H36" strokeOpacity="0.3" />
      <g className="text-accent">
        <circle className="oc-run oc-d350" style={d(350, { "--rx": "16px" })} cx="23" cy="22" r="2.4" fill="white" stroke="currentColor" />
      </g>
      <Draw delay={700} d="M40 18L54 9L68 18Z" />
      <Draw delay={850} d="M45 21V30M54 21V30M63 21V30" />
      <Draw delay={1000} d="M40 34H68" />
      <g className="text-accent">
        <g className="oc-fade oc-d1200" style={d(1200)}>
          <circle cx="67" cy="9" r="6" fill="white" stroke="currentColor" />
        </g>
        <Draw delay={1400} d="M64 9.3L66.2 11.5L70 6.8" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// 02 - Tax document -> deadline (the open window) -> confirmed
function TaxIcon() {
  return (
    <Frame>
      <rect x="4" y="5" width="22" height="34" rx="2" />
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M9 14H21" />
        <Draw delay={140} d="M9 20H21" />
        <Draw delay={280} d="M9 26H16" />
      </g>
      <path d="M26 22H37" strokeOpacity="0.3" />
      <circle className="oc-draw oc-d500" pathLength={1} style={d(500)} cx="48" cy="21" r="10" />
      <Draw delay={800} d="M48 21V15" />
      <Draw delay={900} d="M48 21L52 24" />
      <g className="text-accent">
        <Draw delay={1000} d="M48 11A10 10 0 0 1 58 21" stroke="currentColor" />
        <g className="oc-fade oc-d1200" style={d(1200)}>
          <circle cx="62" cy="35" r="6.5" fill="white" stroke="currentColor" />
        </g>
        <Draw delay={1400} d="M59 35.3L61.2 37.5L65.4 32.6" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// 03 - Financial document -> evidence attached -> defensible (verified)
function AuditorIcon() {
  return (
    <Frame>
      <Draw delay={0} d="M11 4H31V33" strokeOpacity="0.5" />
      <rect x="6" y="8" width="22" height="31" rx="2" />
      <g strokeOpacity="0.5">
        <Draw delay={200} d="M11 18H23" />
        <Draw delay={340} d="M11 24H23" />
        <Draw delay={480} d="M11 30H17" />
      </g>
      <path d="M33 22H41" strokeOpacity="0.3" />
      <Draw delay={700} d="M56 8L68 12V22C68 30 62 35 56 38C50 35 44 30 44 22V12Z" />
      <g className="text-accent">
        <Draw delay={1000} d="M51 22.5L54.5 26L61 18.5" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// 04 - Rule -> transaction -> gate: a cleared transaction. The same rule, running at entry.
function LeakIcon() {
  return (
    <Frame>
      <rect x="3" y="14" width="20" height="16" rx="3" />
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M8 20H18" />
        <Draw delay={140} d="M8 25H14" />
      </g>
      <path d="M23 22H36" strokeOpacity="0.3" />
      <g className="text-accent">
        <circle className="oc-run oc-d350" style={d(350, { "--rx": "13px" })} cx="24" cy="22" r="2.4" fill="white" stroke="currentColor" />
      </g>
      <Draw delay={700} d="M40 8V36" />
      <Draw delay={800} d="M37 8H43M37 36H43" />
      <rect className="oc-fade oc-d1000" style={d(1000)} x="52" y="17" width="14" height="10" rx="2" />
      <g className="text-accent">
        <Draw delay={1250} d="M55 22.3L57.7 25L62.5 19.5" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// 05 - Several manual tasks -> one engine -> one simple flow
function HeadcountIcon() {
  return (
    <Frame>
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M4 11H16" />
        <Draw delay={120} d="M4 22H16" />
        <Draw delay={240} d="M4 33H16" />
      </g>
      <Draw delay={400} d="M16 11L27 19" />
      <Draw delay={480} d="M16 22H27" />
      <Draw delay={560} d="M16 33L27 25" />
      <polygon points="49,22 43.5,31.5 32.5,31.5 27,22 32.5,12.5 43.5,12.5" />
      <g className="text-accent">
        <polygon className="oc-fade oc-d900" style={d(900)} points="42.5,22 40.25,25.9 35.75,25.9 33.5,22 35.75,18.1 40.25,18.1" fill="currentColor" stroke="none" />
        <Draw delay={1100} d="M49 22H66" stroke="currentColor" />
        <Draw delay={1300} d="M62 18L66 22L62 26" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// 06 - Uneven balances -> reconciled -> one aligned state
function CloseIcon() {
  return (
    <Frame>
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M4 11H22" />
        <Draw delay={120} d="M4 22H15" />
        <Draw delay={240} d="M4 33H26" />
      </g>
      <Draw delay={500} d="M29 22H40" />
      <Draw delay={600} d="M36 18L40 22L36 26" />
      <Draw delay={800} d="M46 11H60" />
      <Draw delay={920} d="M46 22H60" />
      <Draw delay={1040} d="M46 33H60" />
      <g className="text-accent">
        <g className="oc-fade oc-d1200" style={d(1200)}>
          <circle cx="66" cy="22" r="5.5" fill="white" stroke="currentColor" />
        </g>
        <Draw delay={1350} d="M63.4 22.3L65.4 24.3L69 19.8" stroke="currentColor" />
      </g>
    </Frame>
  );
}

const ICONS: Record<OutcomeKey, () => React.ReactElement> = {
  cash: CashIcon,
  tax: TaxIcon,
  auditor: AuditorIcon,
  leak: LeakIcon,
  headcount: HeadcountIcon,
  close: CloseIcon,
};

export function OutcomeIcon({ name }: { name: OutcomeKey }) {
  const Icon = ICONS[name];
  return <Icon />;
}
