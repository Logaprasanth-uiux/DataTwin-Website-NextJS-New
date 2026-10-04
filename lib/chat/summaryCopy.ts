import type { SummaryFraming } from "./types";

// The few lines around the findings table that depend on what the summary is about (see
// TopicMockResult.framing) — kept in one place so the locked table, its call to action and the
// unlocked view all describe the same thing.
export function framingCopy(framing: SummaryFraming | undefined) {
  switch (framing) {
    case "exposure":
      return {
        tableHeading: "Where is the exposure coming from?",
        ctaTitle: "Want to see exactly where the exposure is coming from?",
        ctaBody: "Schedule a conversation with the DataTwin Team to unlock the detailed exposure analysis and next steps.",
        revealTitle: "Exposure analysis unlocked",
      };
    case "mismatch":
      return {
        tableHeading: "Where are the differences coming from?",
        ctaTitle: "Want to see exactly which records differ?",
        ctaBody: "Schedule a conversation with the DataTwin Team to unlock the record-level differences and next steps.",
        revealTitle: "Difference analysis unlocked",
      };
    default:
      return {
        tableHeading: "Where is the recovery coming from?",
        ctaTitle: "Want to see exactly where the recovery is coming from?",
        ctaBody: "Schedule a conversation with the DataTwin Team to unlock the detailed recovery analysis and next steps.",
        revealTitle: "Recovery analysis unlocked",
      };
  }
}
