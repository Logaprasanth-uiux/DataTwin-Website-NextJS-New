import type { RecoveryOutput } from "../types";

// Business-friendly recovery/exception descriptions, distilled from the DataTwin reconciliation
// source data (Recovery_Outputs). Internal output IDs (R01, R02, ...) are kept only as an
// internal key — they are never rendered in the UI.

export const RECOVERY_OUTPUTS = {
  unclaimedItc: {
    outputId: "R01",
    label: "Unclaimed ITC",
    classification: "Potential Recovery",
    meaning: "Eligible input tax credit that is available on the portal but hasn't been claimed yet.",
  },
  deferredItc: {
    outputId: "R04",
    label: "Deferred ITC",
    classification: "Potential Recovery",
    meaning: "Eligible credit that was intentionally carried forward rather than claimed immediately.",
  },
  excessItcClaim: {
    outputId: "R06",
    label: "Excess ITC Claim",
    classification: "Compliance / Correction",
    meaning: "Credit claimed above the amount available on the portal for the period.",
  },
  twoBPending: {
    outputId: "R02",
    label: "2B Pending",
    classification: "Follow-up / Timing",
    meaning: "A booked invoice hasn't appeared in the relevant GSTR-2B statement yet.",
  },
  vendorUploadPending: {
    outputId: "R03",
    label: "Vendor Upload Pending",
    classification: "Vendor Follow-up",
    meaning: "The invoice is in your books but the supplier hasn't reported it on the portal yet.",
  },
} as const satisfies Record<string, RecoveryOutput>;
