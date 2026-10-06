"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SalesGstProjection } from "@/lib/chat/types";

// "If it stays unresolved": one rising line through the 3, 6 and 12-month figures. The line draws
// itself left to right when the section scrolls into view, and each number appears the moment the
// line reaches its point. It plays once per result (the parent re-keys it when the figures change)
// and shows its final state straight away for anyone who prefers reduced motion.

const LINE_MS = 2400;
const REVEAL_MS = 650;

// Where each point sits across the chart, as a percentage of its width — the same margin on both sides.
const X_AT = [16, 50, 84];
// Chart height split: the plot, then a row for the month labels.
const PLOT_H = 210;
const TOTAL_H = 252;

const TONE = ["var(--accent)", "var(--loss)", "var(--crimson)"] as const;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useInViewOnce() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, seen };
}

/** Milliseconds elapsed since `active` turned true, capped at `total`. Jumps to `total` when the
 * user prefers reduced motion. */
function useElapsed(active: boolean, total: number) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const value = reduce ? total : Math.min(now - start, total);
      setElapsed(value);
      if (value < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, total]);
  return elapsed;
}

export function ProjectionTimeline({
  net,
  projections,
  format,
}: {
  net: number;
  projections: SalesGstProjection[];
  format: (amount: number) => string;
}) {
  const { ref, seen } = useInViewOnce();
  const clipId = `tl-${useId().replace(/:/g, "")}`;
  const elapsed = useElapsed(seen, LINE_MS + REVEAL_MS);

  const totals = projections.map((p) => p.total);
  const min = Math.min(...totals);
  const max = Math.max(...totals);
  const span = Math.max(max - min, 1);
  // Rising path: the lowest figure sits lower in the plot, the highest near the top.
  const ys = totals.map((total) => 74 - ((total - min) / span) * 52);
  const coords = X_AT.map((x, i) => ({ x, y: ys[i] ?? 50 }));

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} 100 L ${coords[0].x} 100 Z`;

  // The line travels from the first point to the last; a point's number appears when it gets there.
  const first = X_AT[0];
  const last = X_AT[X_AT.length - 1];
  const lineProgress = clamp01(elapsed / LINE_MS);
  const revealX = first + (last - first) * lineProgress;
  const hitMs = (i: number) => ((X_AT[i] - first) / (last - first)) * LINE_MS;
  const appear = (i: number) => easeOut(clamp01((elapsed - hitMs(i)) / REVEAL_MS));
  const shownValue = (i: number) => {
    const from = i === 0 ? net : totals[i - 1];
    return from + (totals[i] - from) * appear(i);
  };

  return (
    <div ref={ref} className="rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft sm:p-7">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">If it stays unresolved</p>
      <h3 className="mt-1.5 text-[17px] font-semibold text-navy sm:text-[19px]">How the net impact grows</h3>
      <p className="mt-1.5 text-[13px] text-navy-body">
        From {format(net)} today, if nothing changes over the next 12 months.
      </p>

      <div className="relative mt-4 w-full" style={{ height: TOTAL_H }}>
        <div className="absolute inset-x-0 top-0" style={{ height: PLOT_H }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              {/* The line is revealed left to right by widening this clip, so it draws as one smooth stroke. */}
              <clipPath id={clipId}>
                <rect x="0" y="-20" width={revealX} height="140" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              <path d={areaPath} fill="var(--accent)" fillOpacity={0.1} />
              <path
                d={linePath}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>

          {coords.map((c, i) => {
            const t = appear(i);
            return (
              <div key={projections[i].months}>
                <span
                  aria-hidden="true"
                  className="absolute border-l border-dashed border-navy-hairline"
                  style={{ left: `${c.x}%`, top: `${c.y}%`, bottom: 0, opacity: t }}
                />
                <span
                  aria-hidden="true"
                  className="absolute h-4 w-4 rounded-full ring-4 ring-white"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    background: TONE[i] ?? TONE[2],
                    transform: `translate(-50%, -50%) scale(${t})`,
                    opacity: t > 0 ? 1 : 0,
                  }}
                />
                <span
                  className="dt-display absolute text-[19px] font-semibold tracking-[-0.01em] whitespace-nowrap sm:text-[24px]"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    color: TONE[i] ?? TONE[2],
                    transform: `translate(-50%, calc(-100% - ${14 + (1 - t) * 10}px))`,
                    opacity: t,
                  }}
                >
                  {format(shownValue(i))}
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-x-0 border-t border-navy-hairline" style={{ top: PLOT_H }} aria-hidden="true" />
        {projections.map((p, i) => (
          <span
            key={p.months}
            className="absolute text-[12px] font-semibold tracking-[0.08em] whitespace-nowrap text-navy-muted uppercase"
            style={{ left: `${X_AT[i]}%`, top: PLOT_H + 12, transform: "translateX(-50%)" }}
          >
            {p.months} months
          </span>
        ))}
      </div>
    </div>
  );
}
