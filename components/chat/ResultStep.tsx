import type { ContactDetails, ReconciliationTopic } from "@/lib/chat/types";
import { BlurredInsightPreview } from "./BlurredInsightPreview";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { SummaryAccessGate } from "./SummaryAccessGate";

// New results sequence: contact verification -> Executive Summary -> detailed findings.
// Until `summaryVerified`, the Executive Summary renders blurred behind SummaryAccessGate's
// name/work-email/phone + OTP form (a lighter-weight gate than the one below, just to view the
// summary teaser). Once verified, the summary is fully visible and the detailed line-item findings
// appear beneath it — still blurred, unlocked only by the app's existing, separate "connect with
// the DataTwin Team" -> contact form -> handoff -> reveal chain (unchanged).
export function ResultStep({
  topic,
  active,
  summaryContact,
  summaryVerified,
  onSubmitSummaryContact,
  onVerifySummaryOtp,
  onConnect,
}: {
  topic: ReconciliationTopic;
  active: boolean;
  summaryContact: ContactDetails | null;
  summaryVerified: boolean;
  onSubmitSummaryContact: (contact: ContactDetails) => void;
  onVerifySummaryOtp: () => void;
  onConnect: () => void;
}) {
  if (!summaryVerified) {
    return (
      <div className="relative flex flex-col">
        <div aria-hidden="true" className="pointer-events-none blur-md select-none">
          <ExecutiveSummary result={topic.mockResult} />
        </div>
        <div className="absolute inset-0 flex items-start justify-center pt-2 sm:items-center sm:pt-0">
          <SummaryAccessGate contact={summaryContact} onSubmitContact={onSubmitSummaryContact} onVerifyOtp={onVerifySummaryOtp} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <ExecutiveSummary result={topic.mockResult} />
      <BlurredInsightPreview rows={topic.mockResult.previewRows} revealed={false} />

      {active && (
        <div className="rounded-2xl border border-navy-hairline bg-navy/[0.02] p-6">
          <p className="text-[15px] font-medium text-navy">Want to see exactly where the recovery is coming from?</p>
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
