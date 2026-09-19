import type { CSSProperties } from "react";
import { SolutionIcon } from "./SolutionIcons";
import { SOLUTION_CATEGORIES, type SolutionCategory } from "./solutions-data";
import { ViewGate } from "./ViewGate";

// One engine -> six processes.
//
// Desktop: a horizontal network. The two categories sit either side of the engine; everything in
// the middle column (engine, connectors, category brackets) is ONE fixed-size SVG so its lines stay
// attached to the text rows beside it. Rows are a fixed 224px tall, and each connector meets its row
// at the icon's centre (32px down). Tablet/mobile: a vertical system: engine, trunk, the categories.
// Coordinates below are the middle column's own 400 x 672 space.

const COL_W = 400;
const ROW_H = 224;
const ROWS = 3;
const NODE_Y = [32, 32 + ROW_H, 32 + ROW_H * 2] as const;
const CX = COL_W / 2;
const CY = NODE_Y[1]; // the engine sits level with the middle process
const LEFT_X = 6;
const RIGHT_X = COL_W - 6;
const ENGINE_R = 92;

const slotOf = (side: 0 | 1, row: number) => side * 3 + row;
const slotStyle = (slot: number) => ({ "--sv-off": `${slot * 3}s` }) as CSSProperties;
const dStyle = (ms: number) => ({ "--sv-d": `${ms}ms` }) as CSSProperties;

// A connector from a process node, easing into the engine centre (hidden behind the engine disc).
function connectorPath(x: number, y: number) {
  const towards = x < CX ? 1 : -1;
  const c1 = x + towards * 104;
  const c2 = CX - towards * 96;
  return `M${x} ${y}C${c1} ${y} ${c2} ${CY} ${CX} ${CY}`;
}

// The engine mark, drawn around (0, 0). A single housing; four small marks for D-A-R-P; the DataTwin
// hexagon with its orange core.
function EngineGlyph() {
  const marks = [
    [-51, -51],
    [51, -51],
    [51, 51],
    [-51, 51],
  ] as const;
  return (
    <g>
      <circle r={ENGINE_R} fill="white" stroke="currentColor" strokeWidth="1.5" />
      <circle r="72" stroke="currentColor" strokeOpacity="0.14" />
      {marks.map(([x, y], index) => (
        <circle
          key={index}
          className="sv-dp"
          style={dStyle(index * 750)}
          cx={x}
          cy={y}
          r="4"
          fill="white"
          stroke="currentColor"
          strokeOpacity="0.55"
        />
      ))}
      <polygon
        points="26,0 13,22.5 -13,22.5 -26,0 -13,-22.5 13,-22.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        className="sv-core fill-accent"
        points="11,0 5.5,9.5 -5.5,9.5 -11,0 -5.5,-9.5 5.5,-9.5"
        stroke="none"
      />
      <text
        y="50"
        textAnchor="middle"
        className="fill-navy-muted"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="1.7"
        stroke="none"
      >
        ONE ENGINE
      </text>
    </g>
  );
}

function DesktopNetwork() {
  const height = ROW_H * ROWS;
  const sides = [
    { x: LEFT_X, side: 0 as const },
    { x: RIGHT_X, side: 1 as const },
  ];

  return (
    <svg
      viewBox={`0 0 ${COL_W} ${height}`}
      width={COL_W}
      height={height}
      fill="none"
      strokeLinecap="round"
      className="hidden overflow-visible text-navy lg:block"
      aria-hidden="true"
    >
      {/* The engine's axis, running on beyond it: the same engine is behind everything below too */}
      <line x1={CX} y1={CY + ENGINE_R} x2={CX} y2={height} stroke="currentColor" strokeOpacity="0.12" />

      {sides.map(({ x, side }) => (
        <g key={side}>
          {/* Category bracket */}
          <line x1={x} y1={NODE_Y[0]} x2={x} y2={NODE_Y[2]} stroke="currentColor" strokeOpacity="0.16" />

          {NODE_Y.map((y, row) => {
            const slot = slotOf(side, row);
            const path = connectorPath(x, y);
            return (
              <g key={row}>
                <path d={path} stroke="currentColor" strokeOpacity="0.2" />
                {/* signal in (navy), pulse out (orange); both one at a time, on this process's turn */}
                <path
                  className="sv-in"
                  pathLength={1}
                  style={slotStyle(slot)}
                  d={path}
                  stroke="currentColor"
                  strokeOpacity="0.55"
                  strokeWidth="2"
                />
                <path
                  className="sv-out"
                  pathLength={1}
                  style={slotStyle(slot)}
                  d={path}
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                />
                <circle cx={x} cy={y} r="4" fill="white" stroke="currentColor" strokeOpacity="0.55" />
                <circle
                  className="sv-node"
                  style={slotStyle(slot)}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="var(--accent)"
                  stroke="var(--accent)"
                />
              </g>
            );
          })}
        </g>
      ))}

      <g transform={`translate(${CX} ${CY})`}>
        <EngineGlyph />
      </g>
    </svg>
  );
}

function CompactEngine() {
  return (
    <svg
      viewBox="-100 -100 200 200"
      width="200"
      height="200"
      fill="none"
      strokeLinecap="round"
      className="text-navy lg:hidden"
      aria-hidden="true"
    >
      <EngineGlyph />
    </svg>
  );
}

// A short vertical connector between blocks on tablet/mobile, with one small dot that drifts down it.
function Trunk({ className = "", height = 48, delay = 0 }: { className?: string; height?: number; delay?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`relative mx-auto w-px bg-navy-hairline ${className}`.trim()}
      style={{ height }}
    >
      <span
        className="sv-trunk-dot absolute -left-[1.5px] top-0 h-1 w-1 rounded-full bg-accent"
        style={{ "--th": `${height - 4}px`, "--sv-d": `${delay}ms` } as CSSProperties}
      />
    </div>
  );
}

function CategoryBlock({
  category,
  side,
}: {
  category: SolutionCategory;
  side: 0 | 1;
}) {
  const mirrored = side === 0;
  const rule = <span aria-hidden="true" className="hidden h-px w-7 bg-accent lg:block" />;

  return (
    <div className={side === 0 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3 lg:row-start-1"}>
      <div
        className={`flex flex-col items-center lg:h-14 lg:flex-row lg:items-center lg:gap-3 ${
          mirrored ? "lg:justify-end lg:pr-6" : "lg:pl-6"
        }`}
      >
        <span
          aria-hidden="true"
          className="mb-4 block h-2 w-2 rounded-full border border-navy-faint bg-white lg:hidden"
        />
        {!mirrored && rule}
        <p className="dt-eyebrow text-center">{category.label}</p>
        {mirrored && rule}
      </div>

      <ul className="mt-6 divide-y divide-navy-divider lg:mt-0 lg:divide-y-0">
        {category.items.map((item, row) => {
          const slot = slotOf(side, row);
          return (
            <li
              key={item.key}
              className={`py-8 first:pt-2 lg:h-56 lg:py-0 lg:pt-[10px] lg:first:pt-[10px] ${
                mirrored ? "lg:pr-6 lg:text-right" : "lg:pl-6"
              }`}
            >
              <div className={`flex items-start gap-4 ${mirrored ? "lg:flex-row-reverse" : ""}`}>
                <SolutionIcon name={item.key} slot={slot} />
                <h3 className="dt-display pt-2 text-[1.625rem] leading-[1.1] font-semibold tracking-[-0.01em] text-navy sm:text-[1.75rem]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 max-w-md text-[15.5px] leading-[1.6] text-navy-body lg:max-w-none">
                {item.description}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SolutionsNetwork() {
  const [core, rebates] = SOLUTION_CATEGORIES;

  return (
    <ViewGate className="lg:grid lg:grid-cols-[1fr_400px_1fr]">
      {/* The engine */}
      <div className="lg:col-start-2 lg:row-start-1 lg:pt-14">
        <div className="flex justify-center lg:hidden">
          <CompactEngine />
        </div>
        <Trunk className="lg:hidden" height={48} />
        <DesktopNetwork />
      </div>

      {/* Tablet/mobile: engine -> trunk -> categories. Desktop: the wrapper disappears and the two
          categories become the grid's left and right columns. */}
      <div className="relative md:grid md:grid-cols-2 md:gap-x-12 md:pt-8 lg:contents">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden md:block lg:hidden">
          <span className="absolute top-0 right-[calc((100%-3rem)/4)] left-[calc((100%-3rem)/4)] h-px bg-navy-hairline" />
          <span className="absolute top-0 left-[calc((100%-3rem)/4)] h-8 w-px bg-navy-hairline" />
          <span className="absolute top-0 right-[calc((100%-3rem)/4)] h-8 w-px bg-navy-hairline" />
        </div>

        <CategoryBlock category={core} side={0} />
        <Trunk className="md:hidden" height={48} delay={1500} />
        <CategoryBlock category={rebates} side={1} />
      </div>
    </ViewGate>
  );
}
