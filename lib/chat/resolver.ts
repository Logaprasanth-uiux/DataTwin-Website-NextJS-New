import { RECONCILIATION_CATALOG, type CatalogEntry } from "./data/catalog";
import { RECONCILIATION_FAMILIES } from "./data/families";

// A deterministic, data-driven stand-in for a real intent-matching model. It scores every catalogue
// entry by how many meaningful words the user's text shares with that entry's name/family/purpose
// (the family/purpose text already exists in Reconciliation_Catalog.xlsx / Recon_Hierarchy.xlsx —
// nothing here is a hand-written keyword list per reconciliation), weighted by how DISTINCTIVE each
// word is across the whole catalogue (inverse document frequency) so domain-universal words like
// "GST" or "reconciliation" — present in most entries — don't drown out words that actually tell
// entries apart. The public surface — `resolveIntent(text) -> { confidence, top, candidates }` —
// is the seam a real LLM resolver would later sit behind; the Chat UI only ever consumes this
// shape, never the scoring internals.

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "we", "i", "our", "us", "to", "of", "in", "on", "for",
  "and", "or", "with", "that", "this", "it", "its", "be", "been", "being", "has", "have", "had", "not",
  "dont", "do", "does", "did", "can", "could", "would", "should", "will", "what", "where", "when", "how",
  "why", "who", "which", "some", "any", "there", "their", "you", "your", "them", "they", "he", "she",
  "him", "her", "from", "by", "at", "as", "but", "if", "so", "just", "about", "im", "ive", "want",
  "trying", "think", "looking", "check", "checking", "sure", "like", "get", "got", "one", "also",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^-+|-+$/g, ""))
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

interface IndexedEntry {
  entry: CatalogEntry;
  nameTokens: Set<string>;
  familyTokens: Set<string>;
  purposeTokens: Set<string>;
}

const FAMILY_BY_ID = new Map(RECONCILIATION_FAMILIES.map((f) => [f.id, f]));

const INDEX: IndexedEntry[] = RECONCILIATION_CATALOG.map((entry) => {
  const family = FAMILY_BY_ID.get(entry.familyId);
  return {
    entry,
    nameTokens: new Set(tokenize(entry.name)),
    familyTokens: new Set(family ? tokenize(family.name) : []),
    purposeTokens: new Set(tokenize(entry.purpose)),
  };
});

// Document frequency across the whole catalogue, for IDF weighting. A word present in most/all
// entries (e.g. "gst") ends up with an IDF near zero and effectively stops mattering, with no
// hand-maintained stopword list required for domain-specific terms.
const DOCUMENT_FREQUENCY = new Map<string, number>();
for (const indexed of INDEX) {
  const allTokens = new Set([...indexed.nameTokens, ...indexed.familyTokens, ...indexed.purposeTokens]);
  for (const token of allTokens) {
    DOCUMENT_FREQUENCY.set(token, (DOCUMENT_FREQUENCY.get(token) ?? 0) + 1);
  }
}
const CATALOGUE_SIZE = INDEX.length;

function idf(token: string): number {
  const documentFrequency = DOCUMENT_FREQUENCY.get(token) ?? 1;
  return Math.log((CATALOGUE_SIZE + 1) / (documentFrequency + 1));
}

function scoreEntry(userTokens: readonly string[], indexed: IndexedEntry): number {
  let score = 0;
  for (const token of userTokens) {
    const weight = idf(token);
    if (indexed.nameTokens.has(token)) score += 3 * weight;
    if (indexed.familyTokens.has(token)) score += 2 * weight;
    if (indexed.purposeTokens.has(token)) score += weight;
  }
  return score;
}

// How much of the entry's own NAME the user effectively said, weighted by how distinctive each of
// those name-words is. This — not "how far ahead of the runner-up" — is what decides high
// confidence: real scores across a family are often close together (a query about ITC legitimately
// scores several ITC reconciliations similarly), but a query that has basically restated a specific
// reconciliation's name is a much more reliable signal than relative ranking.
function nameCoverage(userTokens: ReadonlySet<string>, indexed: IndexedEntry): { matched: number; weighted: number } {
  let matched = 0;
  let matchedWeight = 0;
  let totalWeight = 0;
  for (const token of indexed.nameTokens) {
    const weight = idf(token) || 0.01;
    totalWeight += weight;
    if (userTokens.has(token)) {
      matched += 1;
      matchedWeight += weight;
    }
  }
  return { matched, weighted: totalWeight > 0 ? matchedWeight / totalWeight : 0 };
}

export type Confidence = "high" | "medium" | "low";

export interface ResolveResult {
  confidence: Confidence;
  top: CatalogEntry | null;
  /** Ranked, deduped candidates to present as options. Empty when confidence is "high" (no need
   * to ask) or "low" (nothing meaningful matched). */
  candidates: CatalogEntry[];
}

const MEDIUM_SCORE_THRESHOLD = 2;
const HIGH_MIN_MATCHED_NAME_TOKENS = 2;
const HIGH_MIN_WEIGHTED_NAME_COVERAGE = 0.6;
const CANDIDATE_COUNT = 3;

const GREETING_PATTERN = /^(hi|hello|hey|yo|sup|greetings|good\s?(morning|afternoon|evening))\b/i;
const CAPABILITY_PATTERN = /what can you|what do you do|who are you|help me find|what.{0,15}you help|how (can|do) you help|what.{0,10}you (know|good) (for|at)/i;

export type OpenerKind = "greeting" | "capability" | null;

// "Bill vs GSTR-2B" (1.2) has a bespoke scripted walkthrough (see reconciliation.ts's
// RECONCILIATION_SCRIPTS) whose trigger phrase needs to resolve unambiguously — but the generic
// score-highest-then-check-its-own-name-coverage approach below can rank a same-family entry that
// merely *shares* words (e.g. "Vendor Bill vs Vendor Ledger", via "vendor"/"bill") above it, since
// that scoring has no notion of "this phrase is really about entry X specifically". Rather than
// changing how ranking works in general — which could shift other borderline resolutions in ways
// this one fix can't fully verify — this checks for the one combination of tokens that's genuinely
// unambiguous for this entry: an explicit "GSTR-2B" mention alongside "bill", with no "GSTR-2A"
// mention (which would more likely mean the related 2A/2B consolidated entry, 1.4, instead).
const GSTR_2B_SCRIPTED_ENTRY_ID = "1.2";

function matchesGstr2bScriptedTrigger(userTokens: ReadonlySet<string>): CatalogEntry | null {
  if (!userTokens.has("gstr-2b") || !userTokens.has("bill")) return null;
  if (userTokens.has("gstr-2a") || userTokens.has("2a")) return null;
  return INDEX.find((i) => i.entry.id === GSTR_2B_SCRIPTED_ENTRY_ID)?.entry ?? null;
}

/** Distinguishes a genuine greeting or "what can you do" question from an actual attempt at
 * describing a problem — so the reply can answer *that*, rather than treating every message as a
 * failed reconciliation match and reusing the same clarifying prompt regardless of what was said.
 * `null` means "treat this as a real attempt" — resolveIntent decides what happens next. */
export function classifyOpener(text: string): OpenerKind {
  const trimmed = text.trim();
  if (tokenize(trimmed).length === 0) return "greeting";
  const lower = trimmed.toLowerCase();
  if (GREETING_PATTERN.test(lower)) return "greeting";
  if (CAPABILITY_PATTERN.test(lower)) return "capability";
  return null;
}

export function resolveIntent(text: string, excludeIds: readonly string[] = []): ResolveResult {
  const userTokens = tokenize(text);
  if (userTokens.length === 0) {
    return { confidence: "low", top: null, candidates: [] };
  }
  const userTokenSet = new Set(userTokens);
  const excluded = new Set(excludeIds);

  const scriptedMatch = matchesGstr2bScriptedTrigger(userTokenSet);
  if (scriptedMatch && !excluded.has(scriptedMatch.id)) {
    return { confidence: "high", top: scriptedMatch, candidates: [] };
  }

  const scored = INDEX.filter((i) => !excluded.has(i.entry.id))
    .map((i) => ({ entry: i.entry, score: scoreEntry(userTokens, i), coverage: nameCoverage(userTokenSet, i) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return { confidence: "low", top: null, candidates: [] };
  }

  const first = scored[0];
  const isHighConfidence =
    first.coverage.matched >= HIGH_MIN_MATCHED_NAME_TOKENS && first.coverage.weighted >= HIGH_MIN_WEIGHTED_NAME_COVERAGE;

  if (isHighConfidence) {
    return { confidence: "high", top: first.entry, candidates: [] };
  }

  if (first.score < MEDIUM_SCORE_THRESHOLD) {
    return { confidence: "low", top: null, candidates: [] };
  }

  return {
    confidence: "medium",
    top: first.entry,
    candidates: scored.slice(0, CANDIDATE_COUNT).map((s) => s.entry),
  };
}
