"use client";

import { useCurrencyFormatter } from "@/lib/chat/useCurrency";
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
}: {
  rows: readonly RecoveryPreviewRow[];
  revealed: boolean;
}) {
  const { formatter, ready } = useCurrencyFormatter();

  return (
    <div className="rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
      <p className="text-[13.5px] font-medium text-navy">Where is the recovery sitting?</p>

      <div className="mt-4 flex flex-col divide-y divide-navy-divider">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.04em] whitespace-nowrap ${BUCKET_STYLES[row.bucket]}`}
              >
                {row.classification}
              </span>
              <span
                className={`truncate text-[13px] text-navy ${revealed ? "" : "blur-[6px] select-none"}`}
                aria-hidden={!revealed}
              >
                {row.detail}
              </span>
            </div>
            <span
              className={`flex-shrink-0 tabular-nums text-[13.5px] font-medium text-navy ${
                revealed ? "" : "blur-[6px] select-none"
              }`}
              aria-hidden={!revealed}
            >
              {ready ? formatter.format(row.amount) : ""}
            </span>
          </div>
        ))}
      </div>

      {!revealed && (
        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-navy-faint">
          <LockIcon className="h-3 w-3" />
          Full detail unlocks after connecting with the DataTwin Team
        </p>
      )}
    </div>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
