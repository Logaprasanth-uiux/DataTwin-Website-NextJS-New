import type { ReconciliationTopic } from "@/lib/chat/types";
import { BlurredInsightPreview } from "./BlurredInsightPreview";
import { RecoveryResultCard } from "./RecoveryResultCard";

export function ResultStep({
  topic,
  active,
  onConnect,
}: {
  topic: ReconciliationTopic;
  active: boolean;
  onConnect: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <RecoveryResultCard result={topic.mockResult} />
      <BlurredInsightPreview rows={topic.mockResult.previewRows} revealed={false} />

      {active && (
        <div className="rounded-2xl border border-navy-hairline bg-navy/[0.02] p-6">
          <p className="text-[15px] font-medium text-navy">Want to see exactly where the recovery is sitting?</p>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-navy-body">
            Connect with the DataTwin Team to unlock the detailed recovery analysis and next steps.
          </p>
          <button
            type="button"
            onClick={onConnect}
            className="dt-button group mt-4 inline-flex h-12 items-center gap-2.5 rounded-full border border-navy bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90"
          >
            Connect with DataTwin Team
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-accent" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
