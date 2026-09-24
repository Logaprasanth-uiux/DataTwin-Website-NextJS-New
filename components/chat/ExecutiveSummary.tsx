"use client";

import { useCurrencyFormatter } from "@/lib/chat/useCurrency";
import type { RecoveryBucket, RecoveryPreviewRow, TopicMockResult } from "@/lib/chat/types";

// The Executive Summary: a strong headline, a short insight subtitle, three prominent key-metric
// cards, a synthesized "bottom line", and a category-level breakdown of where the recovery is
// concentrated — all generated from the topic's own mock numbers, never fixed strings, so the
// interpretation stays accurate if that data changes. Shown gated behind SummaryAccessGate until
// the (mock) contact + OTP verification completes (see ResultStep); the detailed, line-by-line
// findings below this stay under the app's existing, separate unlock step (unchanged).
export function ExecutiveSummary({ result }: { result: TopicMockResult }) {
  const { formatter, ready } = useCurrencyFormatter();

  const format = (amount: number) => (ready ? formatter.format(amount) : "");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 px-1">
        <p className="dt-eyebrow dt-eyebrow-accent">Executive summary</p>
        <p className="max-w-xl text-[13.5px] leading-relaxed text-navy-body">
          A concise, CFO-ready view of this reconciliation&apos;s recoverable position — the headline figure,
          where it&apos;s concentrated, and what it means for the periods ahead.
        </p>
      </div>

      <div data-scroll-target="result" className="rounded-2xl border border-navy-hairline bg-white p-7 shadow-soft sm:p-8">
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

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 px-1">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">Key headline metrics</p>
          <p className="text-[13px] text-navy-body">If left unresolved, this exposure continues to grow each period.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard label="Recoverable now" value={format(result.potentialNow)} ready={ready} emphasis />
          <MetricCard label="Upcoming quarter" value={format(result.exposureQuarter)} ready={ready} />
          <MetricCard label="Coming year" value={format(result.exposureYear)} ready={ready} />
        </div>
      </div>

      <div className="rounded-2xl border border-accent/25 bg-accent/[0.06] p-6">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">Bottom line</p>
        <p
          className={`mt-2 text-[14.5px] leading-relaxed text-navy transition-opacity duration-300 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {format(result.potentialNow)} looks recoverable for this period alone — and that exposure could grow to{" "}
          {format(result.exposureYear)} over the coming year if these gaps go unaddressed.
        </p>
      </div>

      <RecoveryAreasChart previewRows={result.previewRows} format={format} ready={ready} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  ready,
  emphasis = false,
}: {
  label: string;
  value: string;
  ready: boolean;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border p-5 shadow-soft ${
        emphasis ? "border-accent/30 bg-accent/[0.04]" : "border-navy-hairline bg-white"
      }`}
    >
      <span className="text-[11.5px] font-medium tracking-[0.02em] text-navy-muted uppercase">{label}</span>
      <span
        className={`dt-display text-2xl font-semibold tracking-[-0.01em] transition-opacity duration-300 ${
          emphasis ? "text-accent" : "text-navy"
        } ${ready ? "opacity-100" : "opacity-0"}`}
      >
        {value}
      </span>
    </div>
  );
}

// Human-friendly category labels and design-system colors for the chart below — never the raw
// bucket key, and never a new color outside navy/accent/crimson.
const BUCKET_LABELS: Record<RecoveryBucket, string> = {
  recovery: "Potential recovery",
  correction: "Needs correction",
  followup: "Pending follow-up",
  neutral: "Under review",
};

const BUCKET_FILL_CLASS: Record<RecoveryBucket, string> = {
  recovery: "bg-accent",
  correction: "bg-crimson",
  followup: "bg-navy/45",
  neutral: "bg-navy/20",
};

// A stable, meaningful display order (most actionable first) rather than whatever order rows
// happen to appear in.
const BUCKET_ORDER: RecoveryBucket[] = ["recovery", "correction", "followup", "neutral"];

// The "visual breakdown of where the recovery comes from" — a single segmented bar plus a
// supporting category list, aggregated from the same mock findings the detailed section (further
// below, still gated) is built from. Category-level totals only: the individual line items
// themselves stay blurred until that separate, existing unlock step.
function RecoveryAreasChart({
  previewRows,
  format,
  ready,
}: {
  previewRows: readonly RecoveryPreviewRow[];
  format: (amount: number) => string;
  ready: boolean;
}) {
  const totalsByBucket = new Map<RecoveryBucket, number>();
  let grandTotal = 0;
  for (const row of previewRows) {
    totalsByBucket.set(row.bucket, (totalsByBucket.get(row.bucket) ?? 0) + row.amount);
    grandTotal += row.amount;
  }

  const segments = BUCKET_ORDER.filter((bucket) => totalsByBucket.has(bucket)).map((bucket) => {
    const amount = totalsByBucket.get(bucket)!;
    return { bucket, amount, share: grandTotal > 0 ? amount / grandTotal : 0 };
  });

  return (
    <div className="rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-navy-muted uppercase">Recovery areas</p>
      <p className="mt-2 text-[13.5px] font-medium text-navy">Where the identified recovery is concentrated</p>

      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-navy/[0.04]" role="img" aria-label="Recovery breakdown by category">
        {segments.map(({ bucket, share }) => (
          <div
            key={bucket}
            className={`${BUCKET_FILL_CLASS[bucket]} first:rounded-l-full last:rounded-r-full`}
            style={{ width: `${Math.max(share * 100, 2)}%` }}
            title={BUCKET_LABELS[bucket]}
          />
        ))}
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {segments.map(({ bucket, amount, share }) => (
          <li key={bucket} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex items-center gap-2 text-navy-body">
              <span aria-hidden="true" className={`h-2 w-2 flex-shrink-0 rounded-full ${BUCKET_FILL_CLASS[bucket]}`} />
              {BUCKET_LABELS[bucket]}
            </span>
            <span className="flex items-center gap-2 tabular-nums text-navy-muted">
              <span
                className={`font-medium text-navy transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
              >
                {format(amount)}
              </span>
              <span className="w-9 text-right">{Math.round(share * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
