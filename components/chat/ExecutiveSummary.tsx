"use client";

import { useRecoveryFormatter } from "@/lib/chat/useCurrency";
import type { RecoveryBucket, RecoveryPreviewRow, TopicMockResult } from "@/lib/chat/types";

// Human-friendly category labels, one-line descriptions and design-system colors — never the raw
// bucket key, and never a color outside navy/accent/crimson. Shared by the metric card, the donut
// legend and every generated sentence below, so the story stays consistent everywhere it appears.
const BUCKET_LABELS: Record<RecoveryBucket, string> = {
  recovery: "Potential recovery",
  correction: "Needs correction",
  followup: "Pending follow-up",
  neutral: "Under review",
};

const BUCKET_DESCRIPTIONS: Record<RecoveryBucket, string> = {
  recovery: "Amounts identified as directly recoverable this period",
  correction: "Requires correcting entries before the position is accurate",
  followup: "Pending resolution with counterparties or downstream teams",
  neutral: "Flagged for review to confirm root cause",
};

const BUCKET_HEX: Record<RecoveryBucket, string> = {
  recovery: "var(--accent)",
  correction: "var(--crimson)",
  followup: "var(--navy)",
  neutral: "var(--navy)",
};

const BUCKET_STROKE_OPACITY: Record<RecoveryBucket, number> = {
  recovery: 1,
  correction: 1,
  followup: 0.45,
  neutral: 0.18,
};

const BUCKET_DOT_CLASS: Record<RecoveryBucket, string> = {
  recovery: "bg-accent",
  correction: "bg-crimson",
  followup: "bg-navy/45",
  neutral: "bg-navy/20",
};

// Most-actionable-first — the order every list/chart below reads in, regardless of the order rows
// happen to appear in the underlying data.
const BUCKET_ORDER: RecoveryBucket[] = ["recovery", "correction", "followup", "neutral"];

function aggregateByBucket(previewRows: readonly RecoveryPreviewRow[]) {
  const totals = new Map<RecoveryBucket, number>();
  let grandTotal = 0;
  for (const row of previewRows) {
    totals.set(row.bucket, (totals.get(row.bucket) ?? 0) + row.amount);
    grandTotal += row.amount;
  }
  const segments = BUCKET_ORDER.filter((bucket) => totals.has(bucket)).map((bucket) => {
    const amount = totals.get(bucket)!;
    return { bucket, amount, share: grandTotal > 0 ? amount / grandTotal : 0 };
  }).sort((a, b) => b.share - a.share);
  return { segments, grandTotal };
}

// Split from the body below (see ExecutiveSummaryBody) specifically so ResultStep can show this
// intro un-blurred and un-gated even before the OTP verification completes: it's scene-setting
// prose, not a recoverable figure, and — just as importantly — it lets the gated body below start
// exactly at `data-scroll-target="result"`, so the "land on this phase" scroll and the gate
// overlay's own top edge always line up, whatever height the body itself happens to be.
export function ExecutiveSummaryHeader({ result }: { result: TopicMockResult }) {
  const { top, topSharePct } = summaryHighlights(result);
  return (
    <div className="flex flex-col gap-1.5 px-1">
      <p className="dt-eyebrow dt-eyebrow-accent">Executive summary</p>
      <p className="max-w-xl text-[13.5px] leading-relaxed text-navy-body">
        {top ? (
          <>
            <span className="font-medium text-navy">{BUCKET_LABELS[top.bucket]}</span> accounts for{" "}
            <span className="font-medium text-navy">{topSharePct}%</span> of the identified position — the
            largest single driver this period.
          </>
        ) : (
          "A concise view of this reconciliation's recoverable position and where it's concentrated."
        )}
      </p>
    </div>
  );
}

function summaryHighlights(result: TopicMockResult) {
  const { segments } = aggregateByBucket(result.previewRows);
  const top = segments[0];
  const second = segments[1];
  const topSharePct = Math.round((top?.share ?? 0) * 100);
  return { segments, top, second, topSharePct };
}

// The Executive Summary: a strong heading, a data-anchored insight subtitle, three metric cards
// each telling a different part of the story (how much, how fast it's growing, where it's
// concentrated), a synthesized "bottom line", and a donut breakdown of where that position comes
// from — all generated from the topic's own mock numbers, never fixed strings, so the narrative
// stays accurate if that data changes. `ExecutiveSummaryHeader` + `ExecutiveSummaryBody` together;
// used as one component once verified (see ExecutiveSummaryBody for the gated case).
export function ExecutiveSummary({ result }: { result: TopicMockResult }) {
  return (
    <div className="flex flex-col gap-6">
      <ExecutiveSummaryHeader result={result} />
      <ExecutiveSummaryBody result={result} />
    </div>
  );
}

// Everything except the intro above — the part that's actually blurred and gated behind
// SummaryAccessGate until verified (see ResultStep). The "land on this phase" scroll target lives
// on ResultStep's own outer wrapper instead of anywhere in here, specifically so it includes the
// header above this body too — landing on this body alone would leave that header (and its own
// "do not hide this" requirement) scrolled just out of view above it.
export function ExecutiveSummaryBody({ result }: { result: TopicMockResult }) {
  const { formatter, ready } = useRecoveryFormatter();
  const format = (amount: number) => (ready ? formatter.format(amount) : "");

  const { segments, top, second, topSharePct } = summaryHighlights(result);
  const growthPct = Math.round(((result.exposureYear - result.potentialNow) / result.potentialNow) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-navy-hairline bg-white p-7 shadow-soft sm:p-8">
        <h2 className="dt-display text-2xl font-semibold tracking-[-0.01em] text-navy sm:text-[28px]">
          Potential recovery identified
        </h2>
        <p
          className={`dt-display mt-3 text-4xl leading-none font-semibold tracking-[-0.02em] text-navy transition-opacity duration-300 sm:text-5xl ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {format(result.potentialNow)}
        </p>
        <p className="mt-2 text-[13px] font-medium tracking-[0.02em] text-navy-muted uppercase">
          Potentially recoverable
        </p>
        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-navy-body">
          Based on the initial reconciliation, we identified a material recovery opportunity. This is an
          illustrative demo figure — final numbers depend on the detailed analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          tone="crimson"
          value={`+${growthPct}%`}
          label="Exposure growth if unresolved"
          detail={`From ${format(result.potentialNow)} now to ${format(result.exposureYear)} within the year`}
          ready={ready}
        />
        <MetricCard
          tone="accent"
          value={format(result.potentialNow)}
          label="Recoverable this period"
          detail="Identified from the current reconciliation, before further corrections"
          ready={ready}
        />
        {top && (
          <MetricCard
            tone="navy"
            value={`${topSharePct}%`}
            label={BUCKET_LABELS[top.bucket]}
            detail={`${format(top.amount)} concentrated here — the largest contributing area`}
            ready={ready}
          />
        )}
      </div>

      <div className="rounded-2xl border border-accent/25 bg-accent/[0.06] p-6">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">Bottom line</p>
        <p
          className={`mt-2 text-[14.5px] leading-relaxed text-navy transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {format(result.potentialNow)} is recoverable for this period
          {top ? (
            <>
              , with <span className="font-medium">{topSharePct}%</span> concentrated in{" "}
              <span className="font-medium">{BUCKET_LABELS[top.bucket].toLowerCase()}</span>
            </>
          ) : null}
          . Left unresolved, this exposure could grow to {format(result.exposureYear)} over the coming year.
        </p>
      </div>

      <VarianceBreakdown
        segments={segments}
        displayTotal={result.potentialNow}
        top={top}
        second={second}
        rowCount={result.previewRows.length}
        format={format}
        ready={ready}
      />
    </div>
  );
}

function MetricCard({
  tone,
  value,
  label,
  detail,
  ready,
}: {
  tone: "crimson" | "accent" | "navy";
  value: string;
  label: string;
  detail: string;
  ready: boolean;
}) {
  const toneClass =
    tone === "crimson"
      ? { card: "border-crimson/20 bg-crimson/[0.04]", value: "text-crimson" }
      : tone === "accent"
        ? { card: "border-accent/30 bg-accent/[0.05]", value: "text-accent" }
        : { card: "border-navy-hairline bg-navy/[0.03]", value: "text-navy" };

  return (
    <div className={`flex flex-col gap-2 rounded-2xl border p-5 shadow-soft ${toneClass.card}`}>
      <span
        className={`dt-display text-3xl font-semibold tracking-[-0.01em] transition-opacity duration-300 ${toneClass.value} ${ready ? "opacity-100" : "opacity-0"}`}
      >
        {value}
      </span>
      <span className="text-[13.5px] font-semibold text-navy">{label}</span>
      <span className="text-[12.5px] leading-relaxed text-navy-muted">{detail}</span>
    </div>
  );
}

// The "clear story from total variance to contributing areas" — a donut (total in the center,
// proportion in the ring) plus a supporting legend that names, describes and quantifies each
// category, aggregated from the same mock findings the detailed section (further below, still
// gated) is built from. Category-level totals only: the individual line items themselves stay
// blurred until that separate, existing unlock step.
function VarianceBreakdown({
  segments,
  displayTotal,
  top,
  second,
  rowCount,
  format,
  ready,
}: {
  segments: { bucket: RecoveryBucket; amount: number; share: number }[];
  /** The headline `potentialNow` figure — used for every number shown to the user here, so it
   * always matches the same figure quoted elsewhere on the page. Row amounts are independently
   * rounded to the nearest 10k (see mockResult.ts), so their raw sum can drift a little from this
   * by a few thousand — fine for computing each segment's *share*, but never shown as "the total". */
  displayTotal: number;
  top: { bucket: RecoveryBucket; amount: number; share: number } | undefined;
  second: { bucket: RecoveryBucket; amount: number; share: number } | undefined;
  rowCount: number;
  format: (amount: number) => string;
  ready: boolean;
}) {
  return (
    <div className="rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft sm:p-7">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">Recovery areas</p>
      <h3 className="mt-1.5 text-[17px] font-semibold text-navy sm:text-[19px]">
        Where the {format(displayTotal)} position is concentrated
      </h3>
      <p className="mt-1.5 text-[13px] text-navy-body">
        {top && second
          ? `${BUCKET_LABELS[top.bucket]} leads, followed by ${BUCKET_LABELS[second.bucket].toLowerCase()}.`
          : top
            ? `Entirely concentrated in ${BUCKET_LABELS[top.bucket].toLowerCase()}.`
            : "No findings identified yet."}
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <DonutChart segments={segments} total={format(displayTotal)} ready={ready} />

        <ul className="flex w-full flex-1 flex-col gap-4">
          {segments.map(({ bucket, amount, share }) => (
            <li key={bucket} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <span aria-hidden="true" className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${BUCKET_DOT_CLASS[bucket]}`} />
                <div>
                  <p className="text-[13.5px] font-semibold text-navy">{BUCKET_LABELS[bucket]}</p>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-muted">{BUCKET_DESCRIPTIONS[bucket]}</p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className={`text-[13.5px] font-semibold text-navy tabular-nums transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}>
                  {format(amount)}
                </p>
                <p className="mt-0.5 text-[12.5px] text-navy-muted">{Math.round(share * 100)}%</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 border-t border-navy-hairline pt-4 text-[12px] text-navy-faint">
        All {rowCount} identified findings are reflected in the categories above — nothing here is unclassified.
      </p>
    </div>
  );
}

const DONUT_SIZE = 168;
const DONUT_STROKE = 24;

function DonutChart({
  segments,
  total,
  ready,
}: {
  segments: { bucket: RecoveryBucket; amount: number; share: number }[];
  total: string;
  ready: boolean;
}) {
  const radius = (DONUT_SIZE - DONUT_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  // Each arc's starting offset is the sum of every prior segment's share — computed fresh per
  // segment (the list is at most 4 items) rather than accumulated in a mutable variable across the
  // render, which trips the "render must stay pure" lint rule.
  const arcs = segments.map(({ bucket, share }, index) => {
    const priorShare = segments.slice(0, index).reduce((sum, s) => sum + s.share, 0);
    const length = Math.max(share * circumference, share > 0 ? 1 : 0);
    return { bucket, length, offset: -priorShare * circumference };
  });

  return (
    <div className="relative flex-shrink-0" style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
      <svg
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        role="img"
        aria-label="Recovery breakdown by category"
      >
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={radius}
          fill="none"
          stroke="var(--navy-hairline)"
          strokeWidth={DONUT_STROKE}
        />
        {arcs.map(({ bucket, length, offset }) => (
          <circle
            key={bucket}
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={radius}
            fill="none"
            stroke={BUCKET_HEX[bucket]}
            strokeOpacity={BUCKET_STROKE_OPACITY[bucket]}
            strokeWidth={DONUT_STROKE}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-6 text-center">
        <span
          className={`dt-display text-[15px] leading-tight font-semibold text-navy transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          {total}
        </span>
        <span className="text-[10.5px] tracking-[0.04em] text-navy-muted uppercase">Total identified</span>
      </div>
    </div>
  );
}
