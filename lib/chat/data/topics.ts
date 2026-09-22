import type { ReconciliationTopic } from "../types";
import { FILES } from "./files";
import { RECOVERY_OUTPUTS } from "./recoveryOutputs";

// The narrowing question's options. This is deliberately a short, curated slice of the full
// DataTwin reconciliation catalogue (134 reconciliation types across 18 families) — the chat
// experience is meant to progressively narrow, not expose the complete catalogue. Each topic
// here maps conceptually to one real reconciliation from that catalogue; amounts in
// `mockResult` are illustrative demo values only.

export const RECONCILIATION_TOPICS: ReconciliationTopic[] = [
  {
    id: "unclaimed-itc",
    label: "Unclaimed ITC",
    acknowledgement:
      "Got it — let's check for eligible credit sitting on the portal that hasn't been claimed yet.",
    requiredFiles: [FILES.gstr2bRequired(), FILES.itcClaimWorkingRequired()],
    optionalFiles: [FILES.vendorBillOptional()],
    recoveryOutputs: [RECOVERY_OUTPUTS.unclaimedItc, RECOVERY_OUTPUTS.deferredItc],
    mockResult: {
      potentialNow: 5_000_000,
      exposureQuarter: 7_000_000,
      exposureYear: 8_000_000,
      previewRows: [
        { classification: "Potential Recovery", detail: "Eligible credit available but not claimed", amount: 3_180_000 },
        { classification: "Potential Recovery", detail: "Eligible credit carried forward, not yet claimed", amount: 1_420_000 },
        { classification: "Compliance / Correction", detail: "Partial claim on an otherwise eligible invoice", amount: 400_000 },
      ],
      nextActions: [
        "Prioritise the highest-value unclaimed invoices for this period's return",
        "Confirm eligibility on deferred credit before the claim window closes",
        "Set up a recurring check so newly available credit doesn't go unclaimed again",
      ],
    },
  },
  {
    id: "itc-vs-return",
    label: "ITC claimed vs return",
    acknowledgement: "Let's compare what's available on the portal against what actually made it into your filed return.",
    requiredFiles: [FILES.gstr2bRequired(), FILES.gstr3bRequired()],
    optionalFiles: [FILES.itcClaimWorkingOptional()],
    recoveryOutputs: [RECOVERY_OUTPUTS.unclaimedItc, RECOVERY_OUTPUTS.excessItcClaim],
    mockResult: {
      potentialNow: 3_200_000,
      exposureQuarter: 4_100_000,
      exposureYear: 4_800_000,
      previewRows: [
        { classification: "Potential Recovery", detail: "Available on the portal but not claimed in the return", amount: 2_050_000 },
        { classification: "Potential Recovery", detail: "Eligible credit missed for the filing period", amount: 780_000 },
        { classification: "Compliance / Correction", detail: "Claimed above the amount available for the period", amount: 370_000 },
      ],
      nextActions: [
        "Reconcile this period's return against portal availability before the next filing",
        "Flag the excess-claim line for review with your tax team",
        "Track period-over-period drift between availability and claim",
      ],
    },
  },
  {
    id: "2b-vs-books",
    label: "2B vs Books",
    acknowledgement: "Let's check whether the invoices in your books are all showing up on the portal.",
    requiredFiles: [FILES.vendorBillRequired(), FILES.gstr2bRequired()],
    optionalFiles: [FILES.gstr2aOptional()],
    recoveryOutputs: [RECOVERY_OUTPUTS.twoBPending, RECOVERY_OUTPUTS.vendorUploadPending],
    mockResult: {
      potentialNow: 1_850_000,
      exposureQuarter: 2_400_000,
      exposureYear: 2_900_000,
      previewRows: [
        { classification: "Follow-up / Timing", detail: "Booked invoice not yet reflected on the portal", amount: 1_120_000 },
        { classification: "Vendor Follow-up", detail: "Invoice booked but not supplier-reported yet", amount: 540_000 },
        { classification: "Follow-up / Timing", detail: "Likely a timing gap between books and the portal", amount: 190_000 },
      ],
      nextActions: [
        "Follow up with the vendors behind the largest pending invoices",
        "Re-check next period once outstanding uploads land",
        "Separate genuine timing gaps from invoices that need vendor escalation",
      ],
    },
  },
];

export const SOMETHING_ELSE_OPTION_ID = "something-else";
