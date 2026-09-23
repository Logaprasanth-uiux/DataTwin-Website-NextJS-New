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

export function generateMockResult(reconciliationId: string): TopicMockResult {
  const random = mulberry32(hashString(reconciliationId));
  const potentialNow = round10k(800_000 + random() * 5_200_000);
  const exposureQuarter = round10k(potentialNow * (1.25 + random() * 0.25));
  const exposureYear = round10k(exposureQuarter * (1.1 + random() * 0.25));

  const outputs = outputsFor(reconciliationId).slice(0, 3);
  const rowCount = Math.max(2, Math.min(3, outputs.length || 2));

  const previewRows: RecoveryPreviewRow[] = [];
  let remaining = potentialNow;
  for (let i = 0; i < rowCount; i++) {
    const output = outputs[i];
    const isLast = i === rowCount - 1;
    const share = isLast ? remaining : round10k(remaining * (0.35 + random() * 0.35));
    remaining -= share;
    previewRows.push({
      classification: output?.classification ?? "Potential Recovery",
      bucket: output?.bucket ?? "recovery",
      detail: output?.meaning ?? "Difference identified during the initial reconciliation",
      amount: Math.max(share, 10_000),
    });
  }

  const buckets = new Set(outputs.map((o) => o.bucket));
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
