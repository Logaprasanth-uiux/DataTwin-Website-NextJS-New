import { DarpGlyphPaths } from "./DarpGlyph";
import { DARP_STAGES } from "./darp-data";

// One connected engine drawn as a single housing with a flow band running through all four
// stages. Coordinates are in a 1000×220 space; nodes sit at 12.5% / 37.5% / 62.5% / 87.5% so
// they line up with the four text columns below. Motion is CSS (see .dp-* in globals.css) and
// only runs when reduced motion is not requested; the base markup is the static system.

const NODE_X = [125, 375, 625, 875];
const BAND_Y = 110;
const PERIOD_S = 16;
const TRAVEL_START = 40;
const TRAVEL = 920;

// Transaction signals: [x position in the static picture, is an exception]. Each one also gets a
// negative animation delay so the moving version starts from the same picture.
const SIGNALS: readonly [number, boolean][] = [
  [60, false],
  [150, false],
  [250, true],
  [330, false],
  [470, true],
  [540, false],
  [700, false],
  [790, false],
  [905, false],
];

const signalStyle = (x: number) => ({
  transform: `translateX(${x - TRAVEL_START}px)`,
  animationDelay: `${(-((x - TRAVEL_START) / TRAVEL) * PERIOD_S).toFixed(3)}s`,
});

export function DarpEngineWide({ className = "" }: { className?: string }) {
  return (
    <div className={`dp-engine ${className}`.trim()}>
      <div>
        <svg
          viewBox="0 0 1000 220"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="block w-full text-white"
          aria-hidden="true"
        >
          {/* The engine: one housing, one flow band through every stage */}
          <rect x="16" y="24" width="968" height="172" rx="86" strokeOpacity="0.12" />
          <line x1="56" y1={BAND_Y} x2="944" y2={BAND_Y} strokeOpacity="0.2" />

          {/* Transaction signals flowing through (behind the stage nodes) */}
          {SIGNALS.map(([x, isException]) => (
            <rect
              key={x}
              className={isException ? "dp-x" : "dp-p"}
              x={TRAVEL_START}
              y={BAND_Y - 4.5}
              width="9"
              height="9"
              rx="2"
              fill={isException && x > 405 && x < 595 ? "var(--accent)" : "currentColor"}
              fillOpacity={isException && x > 405 && x < 595 ? 1 : 0.65}
              stroke="none"
              style={signalStyle(x)}
            />
          ))}

          {/* Stage nodes */}
          {DARP_STAGES.map((stage, index) => (
            <g key={stage.key}>
              <circle cx={NODE_X[index]} cy={BAND_Y} r="36" className="fill-navy" strokeOpacity="0.5" />
              <g transform={`translate(${NODE_X[index] - 15.6} ${BAND_Y - 15.6}) scale(1.3)`}>
                <DarpGlyphPaths stage={stage.key} />
              </g>
            </g>
          ))}
        </svg>
      </div>

      <ol className="mt-6 grid grid-cols-4 lg:mt-8">
        {DARP_STAGES.map((stage, index) => (
          <li key={stage.key} className="px-2 text-center lg:px-4">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="dt-display mt-2 text-[1.35rem] leading-tight font-semibold tracking-[-0.01em] text-white lg:text-[1.75rem]">
              {stage.label}
            </h3>
            <p className="mx-auto mt-2 max-w-[13rem] text-[13px] leading-snug text-white/70 lg:text-[15px]">
              {stage.copy}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
