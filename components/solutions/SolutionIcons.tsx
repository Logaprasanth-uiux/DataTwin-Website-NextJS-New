import type { CSSProperties, ReactNode } from "react";
import type { SolutionKey } from "./solutions-data";

// Small line illustrations, one per process: navy structure, orange for the value that moves and
// the confirmation. Each is written in its final state, so it reads correctly with no animation.
// Motion lives in solutions.css (.sv-*): each icon loops on a short 6s cycle, and neighbouring icons
// start half a cycle apart (a checkerboard across the two columns), so about half are building at
// any moment. `slot` is the icon's position (0-5, which sets that offset) and `d()` staggers an
// element within its cycle.
// The stroke is 1.33 so it draws at the same on-screen weight as the "What can be recovered?" icons
// (those are 1.5 in this same 72x44 box, shown at 64x40; these are shown at 72x44).

const d = (ms: number, extra: Record<string, string> = {}) =>
  ({ "--sv-d": `${ms}ms`, ...extra }) as CSSProperties;

function Frame({ slot, children }: { slot: number; children: ReactNode }) {
  return (
    <span
      className="inline-flex h-11 w-[72px] flex-shrink-0 text-navy"
      style={{ "--sv-off": `${(slot % 2) * 3}s` } as CSSProperties}
    >
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

// Draws a path stroke-by-stroke (pathLength keeps the dash maths unit-free).
const Draw = ({ delay, ...props }: { delay: number } & React.SVGProps<SVGPathElement>) => (
  <path className="sv-draw" pathLength={1} style={d(delay)} {...props} />
);

// Invoice -> matched -> validated
function PayableIcon({ slot }: { slot: number }) {
  return (
    <Frame slot={slot}>
      <rect x="6" y="5" width="24" height="34" rx="2" />
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M11 14H25" />
        <Draw delay={140} d="M11 20H25" />
        <Draw delay={280} d="M11 26H19" />
      </g>
      <path d="M30 22H47" strokeOpacity="0.3" />
      <g className="text-accent">
        <circle className="sv-run" style={d(450, { "--rx": "16px" })} cx="31" cy="22" r="2.6" fill="white" stroke="currentColor" />
      </g>
      <circle className="sv-draw" pathLength={1} style={d(1000)} cx="57" cy="22" r="9" />
      <Draw delay={1250} className="sv-draw text-accent" d="M52.5 22.3L55.7 25.5L61.5 18.5" stroke="currentColor" />
    </Frame>
  );
}

// Invoice -> cash received -> confirmed
function ReceivableIcon({ slot }: { slot: number }) {
  return (
    <Frame slot={slot}>
      <rect x="4" y="6" width="22" height="32" rx="2" />
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M9 15H21" />
        <Draw delay={140} d="M9 21H21" />
        <Draw delay={280} d="M9 27H16" />
      </g>
      <rect x="42" y="17" width="26" height="19" rx="3" />
      <path d="M42 23H68" strokeOpacity="0.5" />
      <g className="text-accent">
        <circle className="sv-run" style={d(400, { "--rx": "17px" })} cx="28" cy="27" r="3.2" fill="white" stroke="currentColor" />
        <g className="sv-fade" style={d(1050)}>
          <circle cx="62" cy="11" r="7" fill="white" stroke="currentColor" />
        </g>
        <Draw delay={1250} d="M58.6 11.4L61 13.8L65.6 8.4" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// Two records -> reconciled -> confirmed
function TaxIcon({ slot }: { slot: number }) {
  return (
    <Frame slot={slot}>
      <rect x="4" y="4" width="22" height="30" rx="2" />
      <rect x="46" y="4" width="22" height="30" rx="2" />
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M9 12H21" />
        <Draw delay={120} d="M9 18H21" />
        <Draw delay={240} d="M9 24H16" />
        <Draw delay={0} d="M51 12H63" />
        <Draw delay={120} d="M51 18H63" />
        <Draw delay={240} d="M51 24H58" />
      </g>
      <Draw delay={650} d="M30 15H42" />
      <Draw delay={800} d="M30 21H42" />
      <g className="text-accent">
        <g className="sv-fade" style={d(1100)}>
          <circle cx="36" cy="35" r="7" fill="white" stroke="currentColor" />
        </g>
        <Draw delay={1300} d="M32.6 35.4L35 37.8L39.6 32.4" stroke="currentColor" />
      </g>
    </Frame>
  );
}

// Distributor claim -> checked against the contract -> validated payout
function RebatesIcon({ slot }: { slot: number }) {
  return (
    <Frame slot={slot}>
      <rect x="3" y="11" width="16" height="24" rx="2" />
      <g strokeOpacity="0.5">
        <Draw delay={0} d="M7 19H15" />
        <Draw delay={140} d="M7 25H15" />
      </g>
      <path d="M19 23H27M47 22H51" strokeOpacity="0.3" />
      <rect x="27" y="5" width="20" height="34" rx="2" />
      <g strokeOpacity="0.5">
        <Draw delay={250} d="M32 13H42" />
        <Draw delay={390} d="M32 19H42" />
      </g>
      <g className="text-accent">
        <Draw delay={800} d="M32 32C34 27 36 34 38 30S41 31 42 29" stroke="currentColor" />
        <circle className="sv-run" style={d(350, { "--rx": "32px" })} cx="20" cy="22.5" r="2.4" fill="white" stroke="currentColor" />
      </g>
      <circle className="sv-draw" pathLength={1} style={d(1400)} cx="60" cy="22" r="9" />
      <Draw delay={1650} className="sv-draw text-accent" d="M55.5 22.3L58.7 25.5L64.5 18.5" stroke="currentColor" />
    </Frame>
  );
}

// Partner activity -> calculated -> paid out
function PayoutsIcon({ slot }: { slot: number }) {
  return (
    <Frame slot={slot}>
      <path d="M4 39H28" strokeOpacity="0.5" />
      <Draw delay={0} d="M8 36V26" />
      <Draw delay={120} d="M16 36V17" />
      <Draw delay={240} d="M24 36V22" />
      <path d="M28 22H33M51 22H55" strokeOpacity="0.3" />
      <rect x="33" y="12" width="18" height="20" rx="3" />
      <path d="M37 17H47" strokeOpacity="0.5" />
      <g className="sv-fade" style={d(550)} fill="currentColor" stroke="none">
        <circle cx="38" cy="23" r="1.1" />
        <circle cx="46" cy="23" r="1.1" />
        <circle cx="38" cy="28" r="1.1" />
        <circle cx="46" cy="28" r="1.1" />
      </g>
      <circle cx="62" cy="22" r="7" />
      <g className="text-accent">
        <circle className="sv-run" style={d(700, { "--rx": "27px" })} cx="28" cy="22" r="2.4" fill="white" stroke="currentColor" />
        <circle className="sv-fade" style={d(1500)} cx="62" cy="22" r="3" fill="currentColor" stroke="none" />
      </g>
    </Frame>
  );
}

// Revenue -> calculated -> incentive paid
function CommissionsIcon({ slot }: { slot: number }) {
  return (
    <Frame slot={slot}>
      <path d="M4 39H36" strokeOpacity="0.5" />
      <Draw delay={0} d="M4 33L14 25L22 28L34 14" />
      <Draw delay={500} d="M28.5 14H34V19.5" />
      <g className="sv-fade" style={d(700)}>
        <circle cx="43.5" cy="17" r="2.6" />
        <circle cx="52.5" cy="29" r="2.6" />
        <path d="M53 13L43 33" />
      </g>
      <g className="text-accent">
        <circle className="sv-draw" pathLength={1} style={d(1150)} cx="62" cy="22" r="7" />
        <Draw delay={1400} d="M58.6 22.4L61 24.8L65.6 19.4" stroke="currentColor" />
      </g>
    </Frame>
  );
}

const ICONS: Record<SolutionKey, (props: { slot: number }) => React.ReactElement> = {
  ap: PayableIcon,
  ar: ReceivableIcon,
  tax: TaxIcon,
  rebates: RebatesIcon,
  payouts: PayoutsIcon,
  commissions: CommissionsIcon,
};

export function SolutionIcon({ name, slot }: { name: SolutionKey; slot: number }) {
  const Icon = ICONS[name];
  return <Icon slot={slot} />;
}
