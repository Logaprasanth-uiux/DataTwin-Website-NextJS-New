"use client";

import { useRecoveryFormatter } from "@/lib/chat/useCurrency";
import type { SalesGstArea, SalesGstAreaId, TopicMockResult } from "@/lib/chat/types";
import { ProjectionTimeline } from "./ProjectionTimeline";

// The executive summary for Sales Register vs GSTR-1. Same look as the standard summary, but built
// on the named areas and projections in `result.salesGst` (see generateSalesGstResult), so the net
// impact, the two pills, the 3/6/12-month projections and the area breakdown all tally.

const AREA_COLOR: Record<SalesGstAreaId, { color: string; opacity: number }> = {
  "gst-overpaid": { color: "var(--accent)", opacity: 1 },
  "gst-underpaid": { color: "var(--loss)", opacity: 1 },
  "itc-claimed": { color: "var(--navy)", opacity: 0.55 },
  "itc-eligible": { color: "var(--navy)", opacity: 0.3 },
  "itc-excess": { color: "var(--crimson)", opacity: 1 },
  "itc-missed": { color: "var(--accent)", opacity: 0.55 },
  "itc-blocked": { color: "var(--crimson)", opacity: 0.5 },
  "itc-missing-2b": { color: "var(--accent)", opacity: 1 },
  "itc-unclaimed": { color: "var(--accent)", opacity: 0.55 },
  "itc-claimed-above-2b": { color: "var(--crimson)", opacity: 1 },
  "itc-to-reverse": { color: "var(--crimson)", opacity: 0.5 },
  "tax-unpaid": { color: "var(--loss)", opacity: 1 },
  "interest-late-fees": { color: "var(--loss)", opacity: 0.55 },
  "demands-outstanding": { color: "var(--crimson)", opacity: 0.8 },
  "drc03-unmatched": { color: "var(--accent)", opacity: 0.55 },
  "refund-pending": { color: "var(--accent)", opacity: 1 },
  interest: { color: "var(--loss)", opacity: 0.55 },
};

const dotColor = (id: SalesGstAreaId) => `color-mix(in srgb, ${AREA_COLOR[id].color} ${AREA_COLOR[id].opacity * 100}%, transparent)`;

// The largest of the areas that move the net (reference totals don't count towards "largest").
function largestMover(areas: SalesGstArea[]): { area: SalesGstArea; share: number } | null {
  const movers = areas.filter((a) => a.kind !== "reference");
  const total = movers.reduce((sum, a) => sum + a.amount, 0);
  const top = [...movers].sort((a, b) => b.amount - a.amount)[0];
  return top && total > 0 ? { area: top, share: top.amount / total } : null;
}

export function SalesGstHeader({ result }: { result: TopicMockResult }) {
  const top = largestMover(result.salesGst?.areas ?? []);
  return (
    <div className="flex flex-col gap-1.5 px-1">
      <p className="dt-eyebrow dt-eyebrow-accent">Executive summary</p>
      <p className="max-w-xl text-[13.5px] leading-relaxed text-navy-body">
        {top ? (
          <>
            <span className="font-medium text-navy">{top.area.label}</span> is the largest area at{" "}
            <span className="font-medium text-navy">{Math.round(top.share * 100)}%</span> of the amounts identified
            — the largest single driver this period.
          </>
        ) : (
          "A concise view of this reconciliation's net impact and where it's concentrated."
        )}
      </p>
    </div>
  );
}

export function SalesGstBody({ result }: { result: TopicMockResult }) {
  const { formatter, ready } = useRecoveryFormatter();
  const format = (amount: number) => (ready ? formatter.format(amount) : "");
  const breakdown = result.salesGst;
  if (!breakdown) return null;

  const net = result.potentialNow;
  const top = largestMover(breakdown.areas);
  const [p3, p6, p12] = breakdown.projections;
  const fade = `transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`;
  // Only areas that are an issue appear: ITC claimed and ITC eligible are reference totals, not findings.
  const shownAreas = breakdown.areas.filter((a) => a.kind !== "reference");
  const purchase = breakdown.side === "purchase";
  const tax = breakdown.side === "tax";
  const areaTotal = shownAreas.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-navy-hairline bg-white p-7 shadow-soft sm:p-8">
        <h2 className="dt-display text-2xl font-semibold tracking-[-0.01em] text-navy sm:text-[28px]">
          {tax ? "Tax at risk identified" : "Potential recovery identified"}
        </h2>
        <p className={`dt-display mt-3 text-4xl leading-none font-semibold tracking-[-0.02em] text-navy sm:text-5xl ${fade}`}>
          {format(net)}
        </p>
        <p className="mt-2 text-[13px] font-medium tracking-[0.02em] text-navy-muted uppercase">{tax ? "Net tax at risk" : "Net current impact"}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          {(!tax || result.grossPositive > 0) && (
            <div className="flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] px-4 py-2">
              <span className={`text-[13.5px] font-semibold text-accent ${fade}`}>{tax ? "−" : "+"}{format(result.grossPositive)}</span>
              <span className="text-[12px] text-navy-muted">{tax ? "paid or refundable" : purchase ? "recoverable ITC" : "recoverable / overpaid"}</span>
            </div>
          )}
          {result.grossNegative > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-loss/25 bg-loss/[0.06] px-4 py-2">
              <span className={`text-[13.5px] font-semibold text-loss ${fade}`}>{tax ? "+" : "−"}{format(result.grossNegative)}</span>
              <span className="text-[12px] text-navy-muted">{tax ? "owed / at risk" : purchase ? "to reverse / payable" : "short-paid / payable"}</span>
            </div>
          )}
        </div>

        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-navy-body">
          {tax
            ? "Based on the initial reconciliation, we identified tax that is still open, netted against what is already paid or refundable. "
            : purchase
            ? "Based on the initial reconciliation, we identified ITC you can recover, netted against any credit that has to be reversed. "
            : "Based on the initial reconciliation, we identified a material recovery opportunity, netted against what's still short-paid. "}
          This is an illustrative demo figure — final numbers depend on the detailed analysis.
        </p>
      </div>

      {/* Re-keyed on the figures, so it plays again when the result is refreshed. */}
      <ProjectionTimeline key={`${net}-${p12.total}`} net={net} projections={breakdown.projections} format={format} />

      <div className="rounded-2xl border border-accent/25 bg-accent/[0.06] p-6">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">Bottom line</p>
        <p className={`mt-2 text-[14.5px] leading-relaxed text-navy ${fade}`}>
          {tax ? (
            <>
              {format(net)} is the tax at risk for this period
              {result.grossPositive > 0 ? (
                <>
                  , after {format(result.grossPositive)} already paid or refundable against {format(result.grossNegative)} owed
                </>
              ) : null}
            </>
          ) : (
            <>
          {format(net)} is the net current impact for this period
          {result.grossNegative > 0 ? (
            <>
              , after {format(result.grossNegative)} identified as {purchase ? "ITC to reverse or payable" : "still short-paid or payable"}{" "}
              against {format(result.grossPositive)} recoverable
            </>
          ) : (
            <>, all of it recoverable</>
          )}
            </>
          )}
          {top ? (
            <>
              , with <span className="font-medium">{top.area.label}</span> the largest area
            </>
          ) : null}
          . Left unresolved, it could grow to {format(p3.total)} in 3 months, {format(p6.total)} in 6 months and{" "}
          {format(p12.total)} in 12 months.
        </p>
      </div>

      <div className="rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft sm:p-7">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">Recovery areas</p>
        <h3 className="mt-1.5 text-[17px] font-semibold text-navy sm:text-[19px]">
          {shownAreas.length} {shownAreas.length === 1 ? "area" : "areas"} behind the {format(net)} net impact
        </h3>
        <p className="mt-1.5 text-[13px] text-navy-body">
          {breakdown.includesItc
            ? "Includes ITC, since GSTR-3B is part of this result."
            : tax
              ? (() => {
                  const have = new Set(breakdown.areas.map((a) => a.id));
                  const missing = [
                    !have.has("interest-late-fees") && "interest and late fees",
                    !have.has("demands-outstanding") && "demands",
                    !have.has("drc03-unmatched") && "DRC-03 payments",
                    !have.has("refund-pending") && "refunds",
                  ].filter((x): x is string => Boolean(x));
                  return missing.length > 0 ? `Add documents below to include ${missing.join(", ")}.` : "Includes every area, since all the documents are part of this result.";
                })()
              : purchase
              ? "Add GSTR-3B below to include unclaimed ITC and ITC claimed above 2B."
              : "Add GSTR-3B below to include excess, missed and blocked ITC."}
        </p>

        <div className="mt-6 grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-10">
          <div className="flex justify-center">
            <AreaDonut areas={shownAreas} total={areaTotal} centre={format(net)} ready={ready} />
          </div>
          <ul className="flex w-full flex-col gap-4">
            {shownAreas.map((area) => (
              <li key={area.id} className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: dotColor(area.id) }} />
                  <div>
                    <p className="text-[13.5px] font-semibold text-navy">{area.label}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-muted">{area.description}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p
                    className={`text-[13.5px] font-semibold tabular-nums ${
                      area.kind === "payable" ? "text-loss" : area.kind === "recoverable" ? "text-accent" : "text-navy"
                    } ${fade}`}
                  >
                    {area.kind === "reference" ? "" : (area.kind === "payable") !== tax ? "−" : "+"}
                    {format(area.amount)}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-navy-muted">
                    {`${Math.round((area.amount / areaTotal) * 100)}%`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 border-t border-navy-hairline pt-4 text-[12px] text-navy-faint">
          {tax
            ? "Areas that are owed add to the tax at risk, and areas already paid or refundable take from it."
            : "Recoverable areas add to the net impact and payable areas take from it."}
        </p>
      </div>
    </div>
  );
}

const DONUT_SIZE = 280;
const DONUT_STROKE = 40;

function AreaDonut({
  areas,
  total,
  centre,
  ready,
}: {
  areas: SalesGstArea[];
  total: number;
  centre: string;
  ready: boolean;
}) {
  const radius = (DONUT_SIZE - DONUT_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  // Each arc starts where the previous ones end — computed per arc from the earlier amounts so the
  // render stays pure.
  const arcs = areas.map((area, index) => {
    const prior = areas.slice(0, index).reduce((sum, a) => sum + a.amount, 0);
    const share = total > 0 ? area.amount / total : 0;
    return { area, length: Math.max(share * circumference, share > 0 ? 1 : 0), offset: -(total > 0 ? prior / total : 0) * circumference };
  });

  return (
    <div className="relative flex-shrink-0" style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
      <svg width={DONUT_SIZE} height={DONUT_SIZE} viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`} role="img" aria-label="Recovery areas">
        <circle cx={DONUT_SIZE / 2} cy={DONUT_SIZE / 2} r={radius} fill="none" stroke="var(--navy-hairline)" strokeWidth={DONUT_STROKE} />
        {arcs.map(({ area, length, offset }) => (
          <circle
            key={area.id}
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={radius}
            fill="none"
            stroke={AREA_COLOR[area.id].color}
            strokeOpacity={AREA_COLOR[area.id].opacity}
            strokeWidth={DONUT_STROKE}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-10 text-center">
        <span
          className={`dt-display text-[24px] leading-tight font-semibold text-navy transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          {centre}
        </span>
        <span className="text-[11.5px] tracking-[0.04em] text-navy-muted uppercase">Net impact</span>
      </div>
    </div>
  );
}
