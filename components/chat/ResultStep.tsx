import type { ReactNode } from "react";
import type { ContactDetails, ReconciliationTopic } from "@/lib/chat/types";
import { framingCopy } from "@/lib/chat/summaryCopy";
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
//
// A multi-checkpoint scripted reconciliation (see ReconciliationTopic.furtherCheckpoints) still
// only ever shows ONE result for the whole conversation — the "add one more document, or continue
// with these documents alone" decision happens earlier, right after each round's own verification
// (see the "checkpoint-decision" TranscriptItem / Transcript.tsx), so by the time this component
// ever renders, there's nothing further to offer here.
export function ResultStep({
  topic,
  active,
  summaryContact,
  summaryVerified,
  onSubmitSummaryContact,
  onVerifySummaryOtp,
  onOpenSchedule,
  accuracyOffer,
}: {
  topic: ReconciliationTopic;
  active: boolean;
  summaryContact: ContactDetails | null;
  summaryVerified: boolean;
  onSubmitSummaryContact: (contact: ContactDetails) => void;
  onVerifySummaryOtp: () => void;
  onOpenSchedule: () => void;
  /** The "improve accuracy" card, already wired up by the caller (Transcript); null when there is nothing to offer. */
  accuracyOffer: ReactNode;
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
        {/* Only the top of the summary is shown behind the form, softly blurred and fading out — a
            teaser sized to the form instead of a tall wall of blur. Verifying swaps in the whole
            summary. The form itself is what sets this block's height. */}
        <div className="relative flex min-h-[460px] items-center justify-center py-6">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="relative select-none [mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)]">
              <div className="blur-md">
                <ExecutiveSummaryBody result={topic.mockResult} />
              </div>
              <div className="absolute inset-0 bg-navy/[0.07]" />
            </div>
          </div>
          <div className="relative z-10 w-full max-w-sm px-4">
            <SummaryAccessGate contact={summaryContact} onSubmitContact={onSubmitSummaryContact} onVerifyOtp={onVerifySummaryOtp} />
          </div>
        </div>
      </div>
    );
  }

  const copy = framingCopy(topic.mockResult.framing);

  return (
    <div data-scroll-target="result" className="flex flex-col gap-5">
      <ExecutiveSummary result={topic.mockResult} />

      {/* The call to action sits ON the blurred findings, like the access form over the summary
          above — right where the locked detail is, instead of somewhere below it that's easy to
          miss. It goes away once the user opens the scheduling step. */}
      <div className="relative">
        <BlurredInsightPreview rows={topic.mockResult.previewRows} revealed={false} className="min-h-[340px]" heading={copy.tableHeading} showSign={topic.mockResult.framing !== "mismatch"} />
        {active && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-navy/[0.07] px-4">
            <div className="w-full max-w-md rounded-2xl border border-navy-hairline bg-white p-6 shadow-soft">
              <p className="text-[15px] font-medium text-navy">{copy.ctaTitle}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-navy-body">{copy.ctaBody}</p>
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
          </div>
        )}
      </div>

      {active && accuracyOffer}
    </div>
  );
}
