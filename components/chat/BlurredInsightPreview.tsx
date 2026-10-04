"use client";

import { useRecoveryFormatter } from "@/lib/chat/useCurrency";
import type { RecoveryBucket, RecoveryPreviewRow } from "@/lib/chat/types";

// Styled by `bucket` (a small internal grouping), not by the raw classification text — the real
// data spans roughly 40 distinct classifications, too many for a fixed style each.
const BUCKET_STYLES: Record<RecoveryBucket, string> = {
  recovery: "bg-accent/[0.12] text-navy",
  correction: "bg-crimson/[0.08] text-crimson",
  followup: "bg-navy/[0.06] text-navy-muted",
  neutral: "bg-navy/[0.06] text-navy-muted",
};

export function BlurredInsightPreview({
  rows,
  revealed,
  heading = "Where is the recovery coming from?",
  showSign = true,
  className = "",
}: {
  rows: readonly RecoveryPreviewRow[];
  revealed: boolean;
  heading?: string;
  /** False for a mismatch story, where an amount is a difference, not money in or out. */
  showSign?: boolean;
  className?: string;
}) {
  const { formatter, ready } = useRecoveryFormatter();

  return (
    <div className={`@container rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft ${className}`}>
      <p className="text-[13.5px] font-medium text-navy">{heading}</p>

      <div className="mt-4 hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_4.5rem_5.5rem_6rem] gap-4 border-b border-navy-divider pb-2 text-[10.5px] font-semibold tracking-[0.12em] text-navy-faint uppercase @xl:grid">
        <span>Finding</span>
        <span>Detail</span>
        <span className="text-right">Records</span>
        <span>Priority</span>
        <span className="text-right">Impact</span>
      </div>

      <div className="mt-2 flex flex-col divide-y divide-navy-divider @xl:mt-0">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3 @xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_4.5rem_5.5rem_6rem]"
          >
            <span
              className={`w-fit max-w-full flex-shrink-0 truncate rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.04em] whitespace-nowrap ${BUCKET_STYLES[row.bucket]}`}
            >
              {row.classification}
            </span>
            <span
              className={`order-last col-span-2 truncate text-[13px] text-navy @xl:order-none @xl:col-span-1 ${revealed ? "" : "blur-[6px] select-none"}`}
              aria-hidden={!revealed}
            >
              {row.detail}
            </span>
            <span
              className={`hidden text-right tabular-nums text-[13px] text-navy-body @xl:block ${revealed ? "" : "blur-[6px] select-none"}`}
              aria-hidden={!revealed}
            >
              {row.records}
            </span>
            <span
              className={`hidden text-[12.5px] text-navy-body @xl:block ${revealed ? "" : "blur-[6px] select-none"}`}
              aria-hidden={!revealed}
            >
              {row.priority}
            </span>
            <span
              className={`text-right tabular-nums text-[13.5px] font-medium ${
                showSign && row.sign === "negative" ? "text-loss" : "text-navy"
              } ${revealed ? "" : "blur-[6px] select-none"}`}
              aria-hidden={!revealed}
            >
              {ready ? `${showSign && row.sign === "negative" ? "−" : ""}${formatter.format(row.amount)}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
