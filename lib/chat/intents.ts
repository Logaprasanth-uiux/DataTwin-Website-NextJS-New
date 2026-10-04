import { RECONCILIATION_CATALOG } from "./data/catalog";
import type { ConversationState, ReconciliationTopic } from "./types";

// The "here's what I understood" step shown once discovery has settled on a reconciliation and
// before the period question: a restatement of the user's problem, the outcome they're after, and
// the specific checks that will be run. Mock content — hand-written per reconciliation where we have
// it, derived from the catalogue entry otherwise — but the `buildIntentSummary` shape is the seam a
// real model would later fill.

export interface IntentSummary {
  problem: string;
  intent: string;
  /** What the analysis will actually look at — the "exact detail" the user is after. */
  checks: string[];
}

const SALES_VS_GSTR1: IntentSummary = {
  problem:
    "Your sales register and what's reported in GSTR-1 may not agree, so some invoices could be missing, duplicated or reported with the wrong value or tax.",
  intent: "Confirm every outward invoice is reported completely and correctly before the mismatch becomes a notice or a tax shortfall.",
  checks: [
    "Invoice-level match on taxable value, tax amount and tax rate",
    "Place of supply and B2B vs B2C classification",
    "Credit notes, debit notes and amendments tied back to original invoices",
  ],
};

const GSTR1_VS_3B: IntentSummary = {
  problem: "The tax declared in GSTR-1 may differ from the tax actually paid through GSTR-3B.",
  intent: "Find month-wise short payment early, so it can be paid with interest before it escalates into a DRC-01B notice.",
  checks: [
    "Month-by-month tax declared in GSTR-1 vs liability in GSTR-3B",
    "Short or excess payment by tax head (IGST, CGST, SGST, Cess)",
    "Persistent gaps that could trigger a DRC-01B notice",
  ],
};

const E_INVOICE: IntentSummary = {
  problem: "Your e-invoices (IRN) may not line up with your sales register and what's reported in GSTR-1.",
  intent: "Make sure every IRN shows up in GSTR-1 with matching values, and that cancelled invoices are handled correctly.",
  checks: [
    "Every IRN present in the sales register and in GSTR-1",
    "Invoice value and tax agreement between e-invoice and books",
    "Cancelled IRNs still active in the register or returns",
  ],
};

const E_WAY_BILL: IntentSummary = {
  problem: "E-way bill values may not tie back to the invoices they were raised for.",
  intent: "Confirm goods-movement documents agree with the sales invoices and e-invoices behind them.",
  checks: [
    "E-way bill value vs invoice value",
    "GSTIN, HSN and document-number linkage",
    "Invoices that moved goods without an e-way bill, or the reverse",
  ],
};

const EXPORTS: IntentSummary = {
  problem: "Your export and SEZ supplies may not match between shipping bills, GSTR-1 export tables and refund claims.",
  intent: "Check LUT vs with-payment treatment and that IGST refunds line up with what's reported, so refunds aren't delayed or denied.",
  checks: [
    "Shipping bills vs GSTR-1 export tables (6A)",
    "LUT (without payment) vs with-payment IGST exports",
    "IGST refund claimed vs refund-eligible zero-rated supplies",
  ],
};

const NOTES: IntentSummary = {
  problem: "Credit and debit notes you've issued may not be reported correctly in GSTR-1.",
  intent: "Make sure returns and price adjustments correctly reduce the tax you've reported on the original invoices.",
  checks: [
    "Each note linked to its original invoice",
    "Notes in the books vs notes reported in GSTR-1",
    "Amendments reported against the right period",
  ],
};

const ANNUAL_TURNOVER: IntentSummary = {
  problem:
    "The turnover in your books for the year may not agree with the turnover declared in your annual return (GSTR-9), and the difference hasn't been explained.",
  intent: "Reconcile full-year books turnover to GSTR-9 and document the reasons for any gap before the annual return and GSTR-9C are finalised.",
  checks: [
    "Full-year sales register turnover vs gross turnover in GSTR-9 (Tables 5 and 6)",
    "Adjustments for advances, credit/debit notes and timing differences",
    "Unexplained differences, with the amount at stake",
  ],
};

const ADVANCES: IntentSummary = {
  problem:
    "Advances you received from customers may not have been reported and paid in GST, or may not have been adjusted correctly when the invoice was raised.",
  intent: "Make sure tax on every advance was reported and paid on time, and that adjustments against invoices don't leave any advance counted twice or missed.",
  checks: [
    "Advances received in your register vs advances reported in GSTR-1",
    "Tax on advances declared in GSTR-1 vs tax paid in GSTR-3B",
    "Adjustments against later invoices, so nothing is double-counted or left open",
  ],
};

const HSN_SAC: IntentSummary = {
  problem:
    "The HSN/SAC summary in your GSTR-1 may not agree with your sales register, so quantities, values or tax by code could be wrong.",
  intent: "Catch wrong, missing or inconsistent HSN/SAC codes and rates before they cause mismatches, notices or rejected returns.",
  checks: [
    "HSN/SAC-wise taxable value and tax in GSTR-1 vs the sales register",
    "Quantity and unit differences by code",
    "Missing or invalid HSN/SAC codes and rate mismatches",
  ],
};

const OVERRIDES: Record<string, IntentSummary> = {
  "10.11": ADVANCES,
  "10.12": HSN_SAC,
  "8.5": ANNUAL_TURNOVER,
  "10.1": SALES_VS_GSTR1,
  "10.3": GSTR1_VS_3B,
  "8.3": GSTR1_VS_3B,
  "18.1": GSTR1_VS_3B,
  "14.1": E_INVOICE,
  "14.2": E_INVOICE,
  "14.3": E_INVOICE,
  "14.7": E_INVOICE,
  "14.5": E_WAY_BILL,
  "14.6": E_WAY_BILL,
  "15.1": EXPORTS,
  "10.5": NOTES,
};

function lowercaseFirst(text: string): string {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function buildIntentSummary(topic: ReconciliationTopic): IntentSummary {
  const override = OVERRIDES[topic.id];
  if (override) return override;

  const entry = RECONCILIATION_CATALOG.find((e) => e.id === topic.id);
  const purpose = entry ? lowercaseFirst(entry.purpose.replace(/\.$/, "")) : "reconcile the two sides";
  const files = topic.requiredFiles.map((f) => f.name);
  return {
    problem: `Your ${topic.label} figures may not agree between your books and what's reported or available on the GST Portal.`,
    intent: `Find where they differ and what it's worth — ${purpose}.`,
    checks: files.length > 1 ? [`${joinNames(files)} compared line by line`, "Differences grouped by cause, with the amount at stake"] : ["Differences grouped by cause, with the amount at stake"],
  };
}

// The user's own most recent description of the problem, quoted back so the summary visibly
// starts from what they said rather than a canned line.
export function userWordsForIntent(state: ConversationState): string | null {
  for (let i = state.discovery.turns.length - 1; i >= 0; i--) {
    const turn = state.discovery.turns[i];
    if (turn.kind === "user") return turn.text;
  }
  return state.firstMessage;
}
