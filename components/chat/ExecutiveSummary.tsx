"use client";

import { useRecoveryFormatter } from "@/lib/chat/useCurrency";
import { SalesGstBody, SalesGstHeader } from "./SalesGstSummary";
import type {
  RecoveryBucket,
  RecoveryPreviewRow,
  RecoverySign,
  SummaryFraming,
  TopicMockResult,
} from "@/lib/chat/types";

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

// Aggregated by bucket within ONE sign only — a positive (recoverable) row and a negative
// (liability) row in the same bucket aren't the same kind of amount, so they're never summed
// together into one figure (see VarianceBreakdown, which calls this once per sign).
function aggregateByBucket(previewRows: readonly RecoveryPreviewRow[], sign: RecoverySign | "all") {
  const totals = new Map<RecoveryBucket, number>();
  let grandTotal = 0;
  for (const row of previewRows) {
    if (sign !== "all" && row.sign !== sign) continue;
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
function StandardSummaryHeader({ result }: { result: TopicMockResult }) {
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

// Which findings the summary leads with: recoverable amounts, the owed/unpaid side, or all of them.
function leadSign(framing: SummaryFraming): RecoverySign | "all" {
  return framing === "exposure" ? "negative" : framing === "mismatch" ? "all" : "positive";
}

// Sales Register vs GSTR-1 has its own summary (see SalesGstSummary) — everything else keeps the
// standard one below.
export function ExecutiveSummaryHeader({ result }: { result: TopicMockResult }) {
  return result.salesGst ? <SalesGstHeader result={result} /> : <StandardSummaryHeader result={result} />;
}

export function ExecutiveSummaryBody({ result }: { result: TopicMockResult }) {
  return result.salesGst ? <SalesGstBody result={result} /> : <StandardSummaryBody result={result} />;
}

function summaryHighlights(result: TopicMockResult) {
  const { segments } = aggregateByBucket(result.previewRows, leadSign(result.framing ?? "recovery"));
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
function StandardSummaryBody({ result }: { result: TopicMockResult }) {
  const { formatter, ready } = useRecoveryFormatter();
  const format = (amount: number) => (ready ? formatter.format(amount) : "");

  const framing = result.framing ?? "recovery";
  const { segments, top, second, topSharePct } = summaryHighlights(result);
  const { segments: negativeSegments } = aggregateByBucket(result.previewRows, "negative");
  const { segments: positiveSegments } = aggregateByBucket(result.previewRows, "positive");
  const hasLiability = result.grossNegative > 0;
  const hasPositive = result.grossPositive > 0;
  const totalAffected = result.grossPositive + result.grossNegative;
  const rowCount = result.previewRows.length;
  // Exposure is projected off the side the story leads with (see mockResult.ts) — this compares
  // like with like, and stays meaningful even when the net itself is small.
  const growthBase = framing === "exposure" ? result.grossNegative : result.grossPositive;
  const growthPct = Math.round(((result.exposureYear - growthBase) / growthBase) * 100);

  // Everything below is read off the same generated findings (`result`) — the wording only changes
  // how those figures are framed, never what they are.
  const headline =
    framing === "exposure" ? "GST exposure identified" : framing === "mismatch" ? "Differences identified" : "Potential recovery identified";
  const headlineValue = framing === "mismatch" ? totalAffected : result.potentialNow;
  const headlineLabel =
    framing === "exposure" ? "Net tax exposure" : framing === "mismatch" ? "Total value affected" : "Net recoverable position";
  const intro =
    framing === "exposure"
      ? "Based on the initial reconciliation, we identified tax that appears unpaid or under-reported, partly offset by amounts paid in excess. This is an illustrative demo figure — final numbers depend on the detailed analysis."
      : framing === "mismatch"
        ? "Based on the initial reconciliation, we found differences between your books and the return. These are mismatches to correct, not an amount owed or recoverable yet. This is an illustrative demo figure — final numbers depend on the detailed analysis."
        : "Based on the initial reconciliation, we identified a material recovery opportunity, netted against what's still short-paid. This is an illustrative demo figure — final numbers depend on the detailed analysis.";

  const positivePill = (
    <AmountPill
      key="positive"
      tone="accent"
      amount={result.grossPositive}
      prefix={framing === "mismatch" ? "" : "+"}
      label={framing === "exposure" ? "paid in excess" : framing === "mismatch" ? "higher in your books" : "recoverable / overpaid"}
      format={format}
      ready={ready}
    />
  );
  const negativePill = (
    <AmountPill
      key="negative"
      tone="loss"
      amount={result.grossNegative}
      prefix={framing === "mismatch" ? "" : "−"}
      label={framing === "exposure" ? "unpaid / under-reported" : framing === "mismatch" ? "higher in the return" : "short-paid / payable"}
      format={format}
      ready={ready}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-navy-hairline bg-white p-7 shadow-soft sm:p-8">
        <h2 className="dt-display text-2xl font-semibold tracking-[-0.01em] text-navy sm:text-[28px]">{headline}</h2>
        <p
          className={`dt-display mt-3 text-4xl leading-none font-semibold tracking-[-0.02em] text-navy transition-opacity duration-300 sm:text-5xl ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {format(headlineValue)}
        </p>
        <p className="mt-2 text-[13px] font-medium tracking-[0.02em] text-navy-muted uppercase">{headlineLabel}</p>

        {/* The headline is what's left once the two real, gross figures below are set against each
            other (or, for a mismatch, added together) — both shown explicitly rather than only ever
            implied by it (see mockResult.ts's own doc comment on `potentialNow`). */}
        <div className="mt-5 flex flex-wrap gap-3">
          {framing === "exposure" ? [negativePill, positivePill] : [positivePill, negativePill]}
        </div>

        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-navy-body">{intro}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {framing === "mismatch" ? (
          <>
            <MetricCard
              tone="navy"
              value={String(rowCount)}
              label="Differences to review"
              detail="Each one is a record or total that doesn't agree"
              ready={ready}
            />
            <MetricCard
              tone="accent"
              value={format(totalAffected)}
              label="Value affected"
              detail={`${format(result.grossPositive)} higher in your books, ${format(result.grossNegative)} higher in the return`}
              ready={ready}
            />
          </>
        ) : (
          <>
            <MetricCard
              tone="crimson"
              value={`+${growthPct}%`}
              label="Exposure growth if unresolved"
              detail={`From ${format(growthBase)} now to ${format(result.exposureYear)} within the year`}
              ready={ready}
            />
            <MetricCard
              tone="accent"
              value={format(result.potentialNow)}
              label={framing === "exposure" ? "Net tax exposure this period" : "Net recoverable this period"}
              detail={
                framing === "exposure"
                  ? `${format(result.grossNegative)} unpaid, less ${format(result.grossPositive)} paid in excess`
                  : `${format(result.grossPositive)} recoverable, less ${format(result.grossNegative)} short-paid`
              }
              ready={ready}
            />
          </>
        )}
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
          {framing === "exposure" ? (
            <>
              {format(result.potentialNow)} of tax appears unpaid or under-reported for this period
              {hasPositive ? <>, net of {format(result.grossPositive)} paid in excess</> : null}
              {top ? (
                <>
                  , with <span className="font-medium">{topSharePct}%</span> of the exposure concentrated in{" "}
                  <span className="font-medium">{BUCKET_LABELS[top.bucket].toLowerCase()}</span>
                </>
              ) : null}
              . Left unresolved, the exposure could grow to {format(result.exposureYear)} over the coming year, and
              interest would add to that.
            </>
          ) : framing === "mismatch" ? (
            <>
              {rowCount} differences affecting {format(totalAffected)} were found
              {top ? (
                <>
                  , with <span className="font-medium">{topSharePct}%</span> of the value in{" "}
                  <span className="font-medium">{BUCKET_LABELS[top.bucket].toLowerCase()}</span>
                </>
              ) : null}
              . Resolving them before the next filing avoids notices, rework and a return that doesn&apos;t match your books.
            </>
          ) : (
            <>
              {format(result.potentialNow)} is recoverable for this period
              {hasLiability ? <>, net of {format(result.grossNegative)} identified as still short-paid</> : null}
              {top ? (
                <>
                  , with <span className="font-medium">{topSharePct}%</span> of the recoverable side concentrated in{" "}
                  <span className="font-medium">{BUCKET_LABELS[top.bucket].toLowerCase()}</span>
                </>
              ) : null}
              . Left unresolved, the recoverable opportunity could grow to {format(result.exposureYear)} over the
              coming year.
            </>
          )}
        </p>
      </div>

      <VarianceBreakdown
        segments={segments}
        displayTotal={framing === "exposure" ? result.grossNegative : framing === "mismatch" ? totalAffected : result.grossPositive}
        eyebrow={framing === "exposure" ? "Exposure areas" : framing === "mismatch" ? "Difference areas" : "Recovery areas"}
        heading={(total) =>
          framing === "exposure"
            ? `Where the ${total} of exposure is concentrated`
            : framing === "mismatch"
              ? `Where the ${total} of differences is concentrated`
              : `Where the ${total} recoverable position is concentrated`
        }
        top={top}
        second={second}
        rowCount={
          framing === "mismatch"
            ? rowCount
            : result.previewRows.filter((r) => r.sign === (framing === "exposure" ? "negative" : "positive")).length
        }
        format={format}
        ready={ready}
      />

      {framing === "recovery" && hasLiability && (
        <SideBreakdown
          tone="loss"
          prefix="−"
          eyebrow="Short-paid / payable"
          heading={`Where the ${format(result.grossNegative)} owed comes from`}
          note="Netted against the recoverable side above to arrive at the net position quoted up top."
          segments={negativeSegments}
          format={format}
          ready={ready}
        />
      )}
      {framing === "exposure" && hasPositive && (
        <SideBreakdown
          tone="accent"
          prefix="+"
          eyebrow="Paid in excess"
          heading={`Where the ${format(result.grossPositive)} paid in excess comes from`}
          note="Set against the exposure above to arrive at the net position quoted up top."
          segments={positiveSegments}
          format={format}
          ready={ready}
        />
      )}
    </div>
  );
}

function AmountPill({
  tone,
  amount,
  prefix,
  label,
  format,
  ready,
}: {
  tone: "accent" | "loss";
  amount: number;
  prefix: string;
  label: string;
  format: (amount: number) => string;
  ready: boolean;
}) {
  const toneClass =
    tone === "accent"
      ? "border-accent/25 bg-accent/[0.06] text-accent"
      : "border-loss/25 bg-loss/[0.06] text-loss";
  return (
    <div className={`flex items-center gap-2 rounded-full border px-4 py-2 ${toneClass.split(" ").slice(0, 2).join(" ")}`}>
      <span
        className={`text-[13.5px] font-semibold transition-opacity duration-300 ${toneClass.split(" ")[2]} ${ready ? "opacity-100" : "opacity-0"}`}
      >
        {prefix}
        {format(amount)}
      </span>
      <span className="text-[12px] text-navy-muted">{label}</span>
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
  eyebrow,
  heading,
  top,
  second,
  rowCount,
  format,
  ready,
}: {
  segments: { bucket: RecoveryBucket; amount: number; share: number }[];
  /** The gross recoverable figure (`grossPositive`) — used for every number shown here, so it
   * always matches the same figure quoted elsewhere on the page. Row amounts are independently
   * rounded to the nearest 10k (see mockResult.ts), so their raw sum can drift a little from this
   * by a few thousand — fine for computing each segment's *share*, but never shown as "the total". */
  displayTotal: number;
  eyebrow: string;
  heading: (formattedTotal: string) => string;
  top: { bucket: RecoveryBucket; amount: number; share: number } | undefined;
  second: { bucket: RecoveryBucket; amount: number; share: number } | undefined;
  rowCount: number;
  format: (amount: number) => string;
  ready: boolean;
}) {
  return (
    <div className="rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft sm:p-7">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">{eyebrow}</p>
      <h3 className="mt-1.5 text-[17px] font-semibold text-navy sm:text-[19px]">{heading(format(displayTotal))}</h3>
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

// The other side of the net, as its own compact breakdown in a contrasting tone rather than folded
// into (or netted away by) the main breakdown above: for a recovery story that's the short-paid /
// owed side; for an exposure story it's what was paid in excess.
function SideBreakdown({
  tone,
  prefix,
  eyebrow,
  heading,
  note,
  segments,
  format,
  ready,
}: {
  tone: "loss" | "accent";
  prefix: string;
  eyebrow: string;
  heading: string;
  note: string;
  segments: { bucket: RecoveryBucket; amount: number; share: number }[];
  format: (amount: number) => string;
  ready: boolean;
}) {
  const card = tone === "loss" ? "border-loss/20 bg-loss/[0.03]" : "border-accent/25 bg-accent/[0.04]";
  const text = tone === "loss" ? "text-loss" : "text-accent";
  const dot = tone === "loss" ? "bg-loss" : "bg-accent";
  return (
    <div className={`rounded-2xl border p-6 shadow-soft sm:p-7 ${card}`}>
      <p className={`text-[11px] font-semibold tracking-[0.14em] uppercase ${text}`}>{eyebrow}</p>
      <h3 className="mt-1.5 text-[17px] font-semibold text-navy sm:text-[19px]">{heading}</h3>
      <p className="mt-1.5 text-[13px] text-navy-body">{note}</p>

      <ul className="mt-5 flex flex-col gap-3">
        {segments.map(({ bucket, amount, share }) => (
          <li key={bucket} className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <span aria-hidden="true" className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${dot}`} />
              <div>
                <p className="text-[13.5px] font-semibold text-navy">{BUCKET_LABELS[bucket]}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-muted">{BUCKET_DESCRIPTIONS[bucket]}</p>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <p
                className={`text-[13.5px] font-semibold tabular-nums transition-opacity duration-300 ${text} ${ready ? "opacity-100" : "opacity-0"}`}
              >
                {prefix}
                {format(amount)}
              </p>
              <p className="mt-0.5 text-[12.5px] text-navy-muted">{Math.round(share * 100)}%</p>
            </div>
          </li>
        ))}
      </ul>
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
