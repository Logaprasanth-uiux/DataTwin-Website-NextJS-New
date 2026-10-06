import { RECONCILIATION_CATALOG } from "./data/catalog";
import { FLOW_BY_ID } from "./flows";
import { RECON_TO_OUTPUTS, RECOVERY_OUTPUT_DEFS, type RecoveryOutputDef } from "./data/recoveryOutputs";
import type { RecoveryBucket, RecoveryPreviewRow, SalesGstArea, SummaryFraming, TopicMockResult } from "./types";

// Deterministic mock recovery figures — clearly demo values, never real calculations. Generated
// (not hand-authored) so the same mechanism works across all 133 catalogue entries instead of
// requiring bespoke numbers per reconciliation.

// Family-level fallback: ~30% of catalogue entries aren't directly named in any Recovery_Outputs
// row, so for those we borrow from another reconciliation in the same family — still real data,
// just one level less specific, rather than inventing a category.
const FAMILY_OUTPUT_IDS = new Map<string, string[]>();
for (const entry of RECONCILIATION_CATALOG) {
  const direct = RECON_TO_OUTPUTS[entry.id];
  if (!direct) continue;
  const existing = FAMILY_OUTPUT_IDS.get(entry.familyId) ?? [];
  for (const id of direct) {
    if (!existing.includes(id)) existing.push(id);
  }
  FAMILY_OUTPUT_IDS.set(entry.familyId, existing);
}

function outputsFor(reconciliationId: string): RecoveryOutputDef[] {
  const entry = RECONCILIATION_CATALOG.find((e) => e.id === reconciliationId);
  const ids = RECON_TO_OUTPUTS[reconciliationId] ?? (entry ? FAMILY_OUTPUT_IDS.get(entry.familyId) : undefined) ?? [];
  return ids.map((id) => RECOVERY_OUTPUT_DEFS[id]).filter((o): o is RecoveryOutputDef => Boolean(o));
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 — small, fast, deterministic PRNG seeded from the reconciliation id so the same
// reconciliation always shows the same mock figures within a session and across reloads.
function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round10k = (n: number) => Math.round(n / 10000) * 10000;

const ACTION_TEMPLATES: Record<RecoveryBucket, string[]> = {
  recovery: [
    "Prioritise the highest-value items here for the next filing window",
    "Confirm eligibility before the claim window closes",
  ],
  correction: [
    "Flag the affected records for review with your tax team",
    "Correct the underlying entries before the next filing period",
  ],
  followup: [
    "Follow up with the relevant counterparties to close the gap",
    "Re-check next period once outstanding items are resolved",
  ],
  neutral: [
    "Review the underlying records to confirm root cause",
    "Track this item through to resolution",
  ],
};

const ALL_OUTPUTS = Object.values(RECOVERY_OUTPUT_DEFS);

// Which story a reconciliation's summary tells. Anything not listed keeps the original "recovery"
// framing (which is what the Sales Register vs GSTR-1 summary uses and stays as it was).
const EXPOSURE_RECONCILIATIONS = new Set(["8.3", "8.5", "10.3", "10.9", "10.11", "18.1"]);
const MISMATCH_RECONCILIATIONS = new Set([
  "10.5", "10.7", "10.12", "10.13", "14.8", "14.1", "14.2", "14.3", "14.5", "14.6", "14.7",
]);

function framingFor(reconciliationId: string): SummaryFraming {
  const baseId = reconciliationId.split("::")[0];
  const configured = FLOW_BY_ID[baseId]?.framing;
  if (configured) return configured;
  if (EXPOSURE_RECONCILIATIONS.has(baseId)) return "exposure";
  if (MISMATCH_RECONCILIATIONS.has(baseId)) return "mismatch";
  return "recovery";
}

// The findings a reconciliation can show are limited to its own family's — an advances check never
// lists "Unclaimed ITC". Falls back to the wider catalogue only if a family has too few to read as
// an analysis at all.
const MIN_ROWS = 3;
const MIN_PREVIEW_ROWS = 6;

function familyPool(reconciliationId: string): RecoveryOutputDef[] {
  const entry = RECONCILIATION_CATALOG.find((e) => e.id === reconciliationId.split("::")[0]);
  const ids = entry ? (FAMILY_OUTPUT_IDS.get(entry.familyId) ?? []) : [];
  return ids.map((id) => RECOVERY_OUTPUT_DEFS[id]).filter((o): o is RecoveryOutputDef => Boolean(o));
}

// Deterministic Fisher-Yates using the same seeded PRNG, so the fill-in order (and therefore the
// full 10-15 row set) is stable per reconciliation rather than reshuffling every render.
function shuffled<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Splits `total` across `count` rows with a randomized-but-normalized weight each — reads as
// plausible individual line items (still blurred until unlocked) rather than even slices.
function splitAmount(count: number, total: number, random: () => number): number[] {
  if (count === 0) return [];
  const weights = Array.from({ length: count }, () => 0.4 + random());
  const weightTotal = weights.reduce((sum, w) => sum + w, 0);
  return weights.map((w) => Math.max(round10k((total * w) / weightTotal), 10_000));
}

// The Sales Register vs GSTR-1 result, built from a few amounts so everything on the summary tallies:
//   recoverable = GST overpaid (+ missed ITC once GSTR-3B is in)
//   payable     = GST underpaid + interest (+ excess ITC and blocked ITC once GSTR-3B is in)
//   net         = recoverable - payable   <- the headline "net current impact"
// ITC claimed / eligible are reference totals (excess = claimed - eligible-and-claimed). Projections
// start from the net and add recurring leakage and interest, so 3, 6 and 12 months all build on it.
// Sales Register vs GSTR-1 and the umbrella Sales with GST check share this result.
export const SALES_GST_IDS = new Set(["10.1", "10.15"]);
const SALES_GST_INTEREST_RATE = 0.18;

const SALES_GST_ROWS: { classification: string; detail: string; bucket: RecoveryBucket; sign: "positive" | "negative" }[] = [
  { classification: "Deterministic validation", detail: "Invoice reported twice in GSTR-1, so GST was paid twice", bucket: "recovery", sign: "positive" },
  { classification: "LLM validation", detail: "Item classified under a higher-rate HSN than its description supports", bucket: "followup", sign: "positive" },
  { classification: "Applicable / Not applicable", detail: "Export invoice reported as taxable although the LUT applies", bucket: "neutral", sign: "positive" },
  { classification: "Deterministic validation", detail: "Invoice in the sales register but missing from GSTR-1", bucket: "correction", sign: "negative" },
  { classification: "Deterministic validation", detail: "Tax rate in GSTR-1 lower than the rate for the HSN", bucket: "correction", sign: "negative" },
  { classification: "LLM validation", detail: "Place of supply read as intra-state but reported inter-state", bucket: "followup", sign: "negative" },
  { classification: "Applicable / Not applicable", detail: "e-invoice applicable but the invoice was not reported as one", bucket: "neutral", sign: "negative" },
  { classification: "Data quality check", detail: "Customer GSTIN missing, so a B2B sale was reported as B2C", bucket: "recovery", sign: "negative" },
];

function generateSalesGstResult(reconciliationId: string, includeItc: boolean): TopicMockResult {
  const random = mulberry32(hashString(reconciliationId));
  const overpaid = round10k(800_000 + random() * 5_200_000);
  const underpaid = round10k(overpaid * (0.12 + random() * 0.4));
  let missed = 0;
  let excess = 0;
  let blocked = 0;
  let claimed = 0;
  let eligible = 0;
  if (includeItc) {
    missed = round10k(overpaid * (0.1 + random() * 0.15));
    excess = round10k(overpaid * (0.06 + random() * 0.1));
    blocked = round10k(overpaid * (0.03 + random() * 0.06));
    const eligibleAndClaimed = round10k((excess + missed) * (1 + random() * 0.6));
    claimed = eligibleAndClaimed + excess;
    eligible = eligibleAndClaimed + missed;
  }
  const interest = round10k((underpaid + excess) * (0.14 + random() * 0.08));

  const grossPositive = overpaid + missed;
  const grossNegative = underpaid + excess + blocked + interest;
  const net = grossPositive - grossNegative;

  const area = (id: SalesGstArea["id"], label: string, description: string, amount: number, kind: SalesGstArea["kind"]): SalesGstArea => ({
    id, label, description, amount, kind,
  });
  const areas: SalesGstArea[] = [
    area("gst-overpaid", "GST overpaid", "Output GST paid above what was due, which you can recover", overpaid, "recoverable"),
    area("gst-underpaid", "GST underpaid", "Output GST short-paid against your invoices, still payable", underpaid, "payable"),
  ];
  if (includeItc) {
    areas.push(
      area("itc-claimed", "ITC claimed", "Input tax credit claimed in GSTR-3B for the period", claimed, "reference"),
      area("itc-eligible", "ITC eligible", "Input tax credit you are eligible to claim", eligible, "reference"),
      area("itc-excess", "Excess ITC", "Claimed above what is eligible, to be reversed", excess, "payable"),
      area("itc-missed", "Missed ITC", "Eligible but not claimed, which you can still recover", missed, "recoverable"),
      area("itc-blocked", "Blocked ITC", "Claimed on blocked credits, to be reversed", blocked, "payable"),
    );
  }
  areas.push(area("interest", "Interest exposure", "Interest on tax underpaid and on ITC claimed in excess", interest, "payable"));

  // Projections build on the net: recurring leakage per month plus interest on the net.
  const monthlyLeakage = round10k(net * (0.04 + random() * 0.04));
  const projections = ([3, 6, 12] as const).map((months) => {
    const leakage = monthlyLeakage * months;
    const interestOnNet = round10k((net * SALES_GST_INTEREST_RATE * months) / 12);
    return { months, leakage, interest: interestOnNet, total: net + leakage + interestOnNet };
  });

  // Line items: the three recoverable ones share `grossPositive`, the five payable ones `grossNegative`.
  const positiveRows = SALES_GST_ROWS.filter((r) => r.sign === "positive");
  const negativeRows = SALES_GST_ROWS.filter((r) => r.sign === "negative");
  const positiveAmounts = splitAmount(positiveRows.length, grossPositive, random);
  const negativeAmounts = splitAmount(negativeRows.length, grossNegative, random);
  // Rounding each line to the nearest 10k can leave the lines a little off their total — the last
  // line takes the difference so the table adds up exactly to the summary.
  positiveAmounts[positiveAmounts.length - 1] += grossPositive - positiveAmounts.reduce((sum, v) => sum + v, 0);
  negativeAmounts[negativeAmounts.length - 1] += grossNegative - negativeAmounts.reduce((sum, v) => sum + v, 0);
  const rowsWithAmounts = SALES_GST_ROWS.map((row) => ({
    row,
    amount: row.sign === "positive" ? positiveAmounts[positiveRows.indexOf(row)] : negativeAmounts[negativeRows.indexOf(row)],
  }));
  const largest = Math.max(...rowsWithAmounts.map((r) => r.amount), 1);
  const previewRows: RecoveryPreviewRow[] = rowsWithAmounts.map(({ row, amount }) => {
    const weight = amount / largest;
    return {
      classification: row.classification,
      bucket: row.bucket,
      detail: row.detail,
      amount,
      sign: row.sign,
      records: 2 + Math.floor(random() * 38),
      priority: weight >= 0.66 ? "High" : weight >= 0.33 ? "Medium" : "Low",
    };
  });

  return {
    framing: "recovery",
    salesGst: { areas, projections, includesItc: includeItc },
    potentialNow: net,
    grossPositive,
    grossNegative,
    exposureQuarter: projections[0].total,
    exposureYear: projections[2].total,
    previewRows,
    nextActions: [
      "Correct the invoices the rule-based checks flagged before the next filing",
      "Review the place-of-supply and HSN calls the model flagged with your tax team",
      "Confirm e-invoice and LUT applicability for the flagged invoices",
    ],
  };
}

// --- Purchase with GST ---------------------------------------------------------------------
// The purchase-side counterpart of the result above, built the same way (a few amounts, everything
// derived from them, so the headline, the pills, the projections and the areas tally) — but each area
// only exists when the document behind it was provided:
//   ITC missing in 2B      purchase register + GSTR-2B (always)       recoverable once vendors file
//   Unclaimed ITC          GSTR-3B                                     recoverable
//   ITC claimed above 2B   GSTR-3B                                     payable (to reverse)
//   ITC to reverse         any reversal / eligibility working          payable (blocked, Rule 37, Rule 42/43)
//   Interest               when there is anything payable              payable
export const PURCHASE_GST_IDS = new Set(["1.14"]);
const GSTR3B_FILE_ID = "F03";
const REVERSAL_FILE_IDS = ["F12", "F51", "F52", "F50"];

const PURCHASE_GST_ROWS: {
  classification: string;
  detail: string;
  bucket: RecoveryBucket;
  sign: "positive" | "negative";
  needs: "base" | "3b" | "reversal" | "payable";
}[] = [
  { classification: "Deterministic validation", detail: "Invoice in the purchase register but missing from GSTR-2B because the vendor has not filed", bucket: "recovery", sign: "positive", needs: "base" },
  { classification: "Data quality check", detail: "Vendor GSTIN or invoice value differs between the register and GSTR-2B", bucket: "followup", sign: "positive", needs: "base" },
  { classification: "Deterministic validation", detail: "Eligible ITC shown in GSTR-2B but not claimed in GSTR-3B", bucket: "recovery", sign: "positive", needs: "3b" },
  { classification: "Deterministic validation", detail: "ITC claimed in GSTR-3B above what GSTR-2B supports", bucket: "correction", sign: "negative", needs: "3b" },
  { classification: "LLM validation", detail: "Invoice claimed in a period other than the one GSTR-2B reports it in", bucket: "followup", sign: "negative", needs: "3b" },
  { classification: "Applicable / Not applicable", detail: "Credit claimed on a blocked item under Section 17(5)", bucket: "neutral", sign: "negative", needs: "reversal" },
  { classification: "Deterministic validation", detail: "Vendor unpaid beyond 180 days, so the ITC has to be reversed", bucket: "correction", sign: "negative", needs: "reversal" },
  { classification: "Deterministic validation", detail: "Interest on ITC claimed in excess or not reversed in time", bucket: "correction", sign: "negative", needs: "payable" },
];

function generatePurchaseGstResult(reconciliationId: string, fileIds: readonly string[]): TopicMockResult {
  const random = mulberry32(hashString(reconciliationId));
  const has3b = fileIds.includes(GSTR3B_FILE_ID);
  const hasReversal = REVERSAL_FILE_IDS.some((id) => fileIds.includes(id));

  const missing = round10k(800_000 + random() * 5_200_000);
  const unclaimed = has3b ? round10k(missing * (0.1 + random() * 0.15)) : 0;
  const claimedAbove = has3b ? round10k(missing * (0.1 + random() * 0.25)) : 0;
  const toReverse = hasReversal ? round10k(missing * (0.06 + random() * 0.1)) : 0;
  const hasPayable = claimedAbove + toReverse > 0;
  const interest = hasPayable ? round10k((claimedAbove + toReverse) * (0.14 + random() * 0.08)) : 0;

  const grossPositive = missing + unclaimed;
  const grossNegative = claimedAbove + toReverse + interest;
  const net = grossPositive - grossNegative;

  const area = (id: SalesGstArea["id"], label: string, description: string, amount: number, kind: SalesGstArea["kind"]): SalesGstArea => ({
    id, label, description, amount, kind,
  });
  const areas: SalesGstArea[] = [
    area("itc-missing-2b", "ITC missing in 2B", "Booked in your purchase register but not in GSTR-2B, claimable once the vendors file", missing, "recoverable"),
  ];
  if (has3b) {
    areas.push(
      area("itc-unclaimed", "Unclaimed ITC", "Eligible and shown in GSTR-2B, but not claimed in GSTR-3B", unclaimed, "recoverable"),
      area("itc-claimed-above-2b", "ITC claimed above 2B", "Claimed in GSTR-3B beyond what GSTR-2B supports, to be reversed", claimedAbove, "payable"),
    );
  }
  if (hasReversal) {
    areas.push(area("itc-to-reverse", "ITC to reverse", "Blocked credits, unpaid vendors and common credit that need reversing", toReverse, "payable"));
  }
  if (hasPayable) {
    areas.push(area("interest", "Interest exposure", "Interest on ITC claimed in excess or not reversed in time", interest, "payable"));
  }

  const monthlyLeakage = round10k(net * (0.04 + random() * 0.04));
  const projections = ([3, 6, 12] as const).map((months) => {
    const leakage = monthlyLeakage * months;
    const interestOnNet = round10k((net * SALES_GST_INTEREST_RATE * months) / 12);
    return { months, leakage, interest: interestOnNet, total: net + leakage + interestOnNet };
  });

  const included = (needs: (typeof PURCHASE_GST_ROWS)[number]["needs"]) =>
    needs === "base" || (needs === "3b" && has3b) || (needs === "reversal" && hasReversal) || (needs === "payable" && hasPayable);
  const rows = PURCHASE_GST_ROWS.filter((r) => included(r.needs));
  const positiveRows = rows.filter((r) => r.sign === "positive");
  const negativeRows = rows.filter((r) => r.sign === "negative");
  const positiveAmounts = splitAmount(positiveRows.length, grossPositive, random);
  const negativeAmounts = splitAmount(negativeRows.length, grossNegative, random);
  // As on the sales side, the last line of each group takes the rounding difference so the table adds up.
  if (positiveAmounts.length > 0) positiveAmounts[positiveAmounts.length - 1] += grossPositive - positiveAmounts.reduce((sum, v) => sum + v, 0);
  if (negativeAmounts.length > 0) negativeAmounts[negativeAmounts.length - 1] += grossNegative - negativeAmounts.reduce((sum, v) => sum + v, 0);
  const rowsWithAmounts = rows.map((row) => ({
    row,
    amount: row.sign === "positive" ? positiveAmounts[positiveRows.indexOf(row)] : negativeAmounts[negativeRows.indexOf(row)],
  }));
  const largest = Math.max(...rowsWithAmounts.map((r) => r.amount), 1);
  const previewRows: RecoveryPreviewRow[] = rowsWithAmounts.map(({ row, amount }) => {
    const weight = amount / largest;
    return {
      classification: row.classification,
      bucket: row.bucket,
      detail: row.detail,
      amount,
      sign: row.sign,
      records: 2 + Math.floor(random() * 38),
      priority: weight >= 0.66 ? "High" : weight >= 0.33 ? "Medium" : "Low",
    };
  });

  return {
    framing: "recovery",
    salesGst: { areas, projections, includesItc: has3b, side: "purchase" },
    potentialNow: net,
    grossPositive,
    grossNegative,
    exposureQuarter: projections[0].total,
    exposureYear: projections[2].total,
    previewRows,
    nextActions: [
      "Follow up with the vendors whose invoices are missing from GSTR-2B before the next filing",
      "Claim the eligible ITC that is showing in GSTR-2B but was left out of GSTR-3B",
      "Reverse any excess or blocked credit, with interest, before it becomes a notice",
    ],
  };
}

export function generateMockResult(reconciliationId: string, options: { includeItc?: boolean; fileIds?: string[] } = {}): TopicMockResult {
  if (SALES_GST_IDS.has(reconciliationId.split("::")[0])) return generateSalesGstResult(reconciliationId, options.includeItc ?? false);
  if (PURCHASE_GST_IDS.has(reconciliationId.split("::")[0])) return generatePurchaseGstResult(reconciliationId, options.fileIds ?? []);
  const random = mulberry32(hashString(reconciliationId));

  // A reconciliation nets two real, opposite-direction findings against each other: money coming
  // back (overpaid, over-reported) and tax that turns out to be short-paid/under-reported — a
  // genuine liability, not a recoverable amount. `potentialNow` (the headline figure quoted
  // everywhere a single number is needed) is what's left once one is set against the other — it
  // can end up modest even when both gross sides are substantial, which is exactly why both are
  // shown explicitly (see ExecutiveSummary) rather than only ever surfacing the net. Exposure
  // growth is projected off the gross recoverable side, not the net, so it stays meaningful even
  // when the net itself is small.
  const framing = framingFor(reconciliationId);
  const larger = round10k(800_000 + random() * 5_200_000);
  const smaller = round10k(larger * (0.15 + random() * 0.55));
  const growthBase = round10k(larger * (1.25 + random() * 0.25));
  const growthYear = round10k(growthBase * (1.1 + random() * 0.25));
  // recovery: recoverable side leads, net of what's short-paid (the original behaviour).
  // exposure: the owed side leads, net of what was paid in excess; exposure projected off it.
  // mismatch: two directions of difference, summed into one "value affected" figure — not netted.
  const grossPositive = framing === "exposure" ? smaller : larger;
  const grossNegative = framing === "exposure" ? larger : smaller;
  const potentialNow =
    framing === "mismatch" ? grossPositive + grossNegative : Math.max(Math.abs(grossPositive - grossNegative), 0);
  const exposureQuarter = growthBase;
  const exposureYear = growthYear;

  // The reconciliation's own directly-detected findings come first (also what `nextActions` below
  // is grounded in), then enough additional real findings from the wider 69-entry recovery-output
  // catalogue — deterministically shuffled, never repeating one already included — to read as a
  // substantial, varied analysis (~10-15 rows) rather than a 2-3 row sample. Every row is still a
  // real catalogue entry (classification/bucket/meaning), never invented text, and nothing here
  // renders the internal `id`.
  const primaryOutputs = outputsFor(reconciliationId);
  const targetRowCount = 10 + Math.floor(random() * 6); // 10-15
  const selected: RecoveryOutputDef[] = [...primaryOutputs];
  const usedIds = new Set(selected.map((o) => o.id));
  const pool = familyPool(reconciliationId);
  const padding = pool.length + selected.length >= MIN_ROWS ? pool : [...pool, ...ALL_OUTPUTS];
  for (const output of shuffled(padding, random)) {
    if (selected.length >= targetRowCount) break;
    if (usedIds.has(output.id)) continue;
    usedIds.add(output.id);
    selected.push(output);
  }

  // A small family can only name a few distinct findings, but one finding is normally several line
  // items (different documents, different amounts) — so cycle through them until the table reads
  // like a real analysis. Only the line items repeat; the totals are split across them below.
  const distinct = [...selected];
  for (let i = 0; selected.length < MIN_PREVIEW_ROWS && distinct.length > 0; i++) {
    selected.push(distinct[i % distinct.length]);
  }

  // Which rows land on which side of the net: a fixed, illustrative split (not itself drawn from
  // the underlying bucket taxonomy, which isn't a statement of sign) — roughly two-thirds
  // positive, the rest negative, nudged so a short row set never comes out one-sided despite both
  // gross figures above being real, non-zero numbers.
  const positiveShare = framing === "exposure" ? 0.32 : framing === "mismatch" ? 0.5 : 0.68;
  const signs: Array<"positive" | "negative"> = selected.map(() => (random() < positiveShare ? "positive" : "negative"));
  if (selected.length >= 3) {
    if (!signs.includes("negative")) signs[signs.length - 1] = "negative";
    if (!signs.includes("positive")) signs[0] = "positive";
  }
  const positiveIndexes = signs.reduce<number[]>((acc, sign, i) => (sign === "positive" ? [...acc, i] : acc), []);
  const negativeIndexes = signs.reduce<number[]>((acc, sign, i) => (sign === "negative" ? [...acc, i] : acc), []);
  const positiveAmounts = splitAmount(positiveIndexes.length, grossPositive, random);
  const negativeAmounts = splitAmount(negativeIndexes.length, grossNegative, random);

  const previewRows: RecoveryPreviewRow[] = selected.map((output, index) => {
    const sign = signs[index];
    const amount =
      sign === "positive"
        ? positiveAmounts[positiveIndexes.indexOf(index)]
        : negativeAmounts[negativeIndexes.indexOf(index)];
    return {
      classification: output.classification,
      bucket: output.bucket,
      detail: output.meaning,
      amount,
      sign,
      records: 2 + Math.floor(random() * 38),
      priority: "Medium" as const,
    };
  });
  // Priority is each line's share of the largest line.
  const largest = Math.max(...previewRows.map((row) => row.amount), 1);
  for (const row of previewRows) {
    const weight = row.amount / largest;
    row.priority = weight >= 0.66 ? "High" : weight >= 0.33 ? "Medium" : "Low";
  }

  const buckets = new Set(primaryOutputs.map((o) => o.bucket));
  if (buckets.size === 0) buckets.add("recovery");
  const nextActions: string[] = [];
  for (const bucket of buckets) {
    nextActions.push(...ACTION_TEMPLATES[bucket].slice(0, 2));
    if (nextActions.length >= 3) break;
  }

  return {
    framing,
    potentialNow,
    grossPositive,
    grossNegative,
    exposureQuarter,
    exposureYear,
    previewRows,
    nextActions: nextActions.slice(0, 3),
  };
}
