import { RECONCILIATION_CATALOG } from "./data/catalog";
import { RECON_TO_OUTPUTS, RECOVERY_OUTPUT_DEFS, type RecoveryOutputDef } from "./data/recoveryOutputs";
import type { RecoveryBucket, RecoveryPreviewRow, TopicMockResult } from "./types";

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

export function generateMockResult(reconciliationId: string): TopicMockResult {
  const random = mulberry32(hashString(reconciliationId));
  const potentialNow = round10k(800_000 + random() * 5_200_000);
  const exposureQuarter = round10k(potentialNow * (1.25 + random() * 0.25));
  const exposureYear = round10k(exposureQuarter * (1.1 + random() * 0.25));

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
  for (const output of shuffled(ALL_OUTPUTS, random)) {
    if (selected.length >= targetRowCount) break;
    if (usedIds.has(output.id)) continue;
    usedIds.add(output.id);
    selected.push(output);
  }

  // Split potentialNow across every row with a randomized-but-normalized weight — reads as
  // plausible individual line items (still blurred until unlocked) rather than even slices.
  const weights = selected.map(() => 0.4 + random());
  const weightTotal = weights.reduce((sum, w) => sum + w, 0);
  const previewRows: RecoveryPreviewRow[] = selected.map((output, index) => ({
    classification: output.classification,
    bucket: output.bucket,
    detail: output.meaning,
    amount: Math.max(round10k((potentialNow * weights[index]) / weightTotal), 10_000),
  }));

  const buckets = new Set(primaryOutputs.map((o) => o.bucket));
  if (buckets.size === 0) buckets.add("recovery");
  const nextActions: string[] = [];
  for (const bucket of buckets) {
    nextActions.push(...ACTION_TEMPLATES[bucket].slice(0, 2));
    if (nextActions.length >= 3) break;
  }

  return {
    potentialNow,
    exposureQuarter,
    exposureYear,
    previewRows,
    nextActions: nextActions.slice(0, 3),
  };
}
