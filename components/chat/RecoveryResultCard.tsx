"use client";

import { useCurrencyFormatter } from "@/lib/chat/useCurrency";
import type { TopicMockResult } from "@/lib/chat/types";

export function RecoveryResultCard({ result }: { result: TopicMockResult }) {
  const { formatter, ready } = useCurrencyFormatter();

  const format = (amount: number) => (ready ? formatter.format(amount) : "");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-navy-hairline bg-white p-7 shadow-soft sm:p-8">
        <p className="dt-eyebrow dt-eyebrow-accent">Potential recovery identified</p>
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

      <div className="rounded-2xl border border-navy-hairline bg-navy/[0.02] p-6">
        <p className="text-[13.5px] font-medium text-navy">If left unresolved, the exposure could continue to grow.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ExposureTile label="Recoverable now" value={format(result.potentialNow)} ready={ready} emphasis />
          <ExposureTile label="Upcoming quarter" value={format(result.exposureQuarter)} ready={ready} />
          <ExposureTile label="Coming year" value={format(result.exposureYear)} ready={ready} />
        </div>
      </div>
    </div>
  );
}

function ExposureTile({
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
    <div className="flex flex-col gap-1">
      <span
        className={`dt-display text-xl font-semibold tracking-[-0.01em] transition-opacity duration-300 ${
          emphasis ? "text-accent" : "text-navy"
        } ${ready ? "opacity-100" : "opacity-0"}`}
      >
        {value}
      </span>
      <span className="text-[12px] text-navy-muted">{label}</span>
    </div>
  );
}
