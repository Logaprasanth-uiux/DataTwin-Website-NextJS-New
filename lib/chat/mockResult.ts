import { RECONCILIATION_CATALOG } from "./data/catalog";
import { RECON_TO_OUTPUTS, RECOVERY_OUTPUT_DEFS, type RecoveryOutputDef } from "./data/recoveryOutputs";
import type { RecoveryBucket, RecoveryPreviewRow, SummaryFraming, TopicMockResult } from "./types";

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

export function generateMockResult(reconciliationId: string): TopicMockResult {
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
