import type { ContactDetails, ReconciliationTopic } from "@/lib/chat/types";
import { BlurredInsightPreview } from "./BlurredInsightPreview";
import { ExecutiveSummary, ExecutiveSummaryBody, ExecutiveSummaryHeader } from "./ExecutiveSummary";
import { SummaryAccessGate } from "./SummaryAccessGate";

// New results sequence: contact verification -> Executive Summary -> detailed findings.
// Until `summaryVerified`, the Executive Summary renders blurred behind SummaryAccessGate's
// name/work-email/phone + OTP form (a lighter-weight gate than the one below, just to view the
// summary teaser). Once verified, the summary is fully visible and the detailed line-item findings
// appear beneath it — still blurred, unlocked only by scheduling a conversation with the DataTwin
// Team (see ScheduleMeetingStep/RevealStep) — the same contact record from the gate above, never
// asked for a second time.
export function ResultStep({
  topic,
  active,
  summaryContact,
  summaryVerified,
  onSubmitSummaryContact,
  onVerifySummaryOtp,
  onOpenSchedule,
}: {
  topic: ReconciliationTopic;
  active: boolean;
  summaryContact: ContactDetails | null;
  summaryVerified: boolean;
  onSubmitSummaryContact: (contact: ContactDetails) => void;
  onVerifySummaryOtp: () => void;
  onOpenSchedule: () => void;
}) {
  // `data-scroll-target="result"` lives on this outer wrapper — not on anything inside either
  // branch — so ChatPageClient's "land on this phase" scroll always brings the *whole* thing
  // (header included) to the top of the viewport in one place, regardless of which branch is
  // active. Landing partway into either branch's own content is exactly what previously left the
  // gate's heading (or, before that, the form itself) scrolled just out of view above it.
  if (!summaryVerified) {
    return (
      <div data-scroll-target="result" className="flex flex-col gap-6">
        {/* Shown plainly, never blurred or covered — it's scene-setting prose, not a recoverable
            figure, and it's exactly the "heading/instructions above the form" that must stay
            visible alongside it. */}
        <ExecutiveSummaryHeader result={topic.mockResult} />
        <div className="relative flex flex-col">
          <div aria-hidden="true" className="pointer-events-none blur-md select-none">
            <ExecutiveSummaryBody result={topic.mockResult} />
          </div>
          {/* This overlay spans exactly the (blurred) body above it — a plain top-anchored overlay
              is enough (no `sticky` needed): since the scroll target above already brings this
              whole section's top into view, the overlay's own top is already in view too. */}
          <div className="absolute inset-0 flex items-start justify-center px-4 pt-3">
            <div className="w-full max-w-sm">
              <SummaryAccessGate contact={summaryContact} onSubmitContact={onSubmitSummaryContact} onVerifyOtp={onVerifySummaryOtp} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-scroll-target="result" className="flex flex-col gap-5">
      <ExecutiveSummary result={topic.mockResult} />
      <BlurredInsightPreview rows={topic.mockResult.previewRows} revealed={false} />

      {active && (
        <div className="rounded-2xl border border-navy-hairline bg-navy/[0.02] p-6">
          <p className="text-[15px] font-medium text-navy">Want to see exactly where the recovery is coming from?</p>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-navy-body">
            Schedule a conversation with the DataTwin Team to unlock the detailed recovery analysis and next steps.
          </p>
          <button
            type="button"
            onClick={onOpenSchedule}
            className="dt-button group mt-4 inline-flex h-12 items-center gap-2.5 rounded-full border border-navy bg-navy px-6 text-[14px] text-white transition-colors hover:bg-navy/90"
          >
            Schedule a conversation
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
