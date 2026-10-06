import { RECONCILIATION_CATALOG, type CatalogEntry } from "./data/catalog";
import { RECONCILIATION_FAMILIES } from "./data/families";
import { AREAS, AREA_BY_ID, areaOfFamily, type AreaId } from "./areas";
import { FLOWS } from "./flows";

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
    // A bare "2B", "2A" or "3B" is shorthand for the return — keep it, as the return's name.
    .map((t) => (/^(2a|2b|3b)$/.test(t) ? `gstr-${t}` : t))
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
  /** False when nothing in the message overlapped with the catalogue at all (small talk, an
   * unrelated question) — as opposed to a GST-sounding message that's merely too vague to place. */
  anySignal?: boolean;
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

// "Sales Register vs GSTR-1" (10.1) also has a bespoke multi-round scripted walkthrough (see
// reconciliation.ts's RECONCILIATION_SCRIPTS) — the "Sales Register vs GST Reconciliation" flow.
// Its trigger phrases ("Sales Register vs GST", "Accounts Receivables Check", "sales vs gst",
// "GSTR-1") are looser and more varied than 1.2's, so this checks several independent signals
// rather than one fixed combination — any one of them is specific enough on its own. A bare
// "GSTR-1" only counts when no OTHER GST return is also mentioned (which would more likely mean
// one of the other outward/inward-supply entries instead).
const SALES_REGISTER_GST_SCRIPTED_ENTRY_ID = "10.1";
export const SALES_WITH_GST_ENTRY_ID = "10.15";
export const PURCHASE_WITH_GST_ENTRY_ID = "1.14";
export const TAX_PAYMENTS_ENTRY_ID = "11.9";

function matchesSalesRegisterGstScriptedTrigger(userTokens: ReadonlySet<string>): CatalogEntry | null {
  const hasSalesRegister = userTokens.has("sales") && userTokens.has("register");
  const hasAccountsReceivablesCheck =
    userTokens.has("accounts") && (userTokens.has("receivables") || userTokens.has("receivable"));
  const hasSalesVsGst = userTokens.has("sales") && userTokens.has("gst");
  const mentionsOtherGstReturn =
    userTokens.has("gstr-1a") ||
    userTokens.has("gstr-2") ||
    userTokens.has("gstr-2a") ||
    userTokens.has("gstr-2b") ||
    userTokens.has("gstr-3b");
  const hasGstr1Only = userTokens.has("gstr-1") && !mentionsOtherGstReturn;

  if (!hasSalesRegister && !hasAccountsReceivablesCheck && !hasSalesVsGst && !hasGstr1Only) return null;
  // "My sales vs GST" with no register, no GSTR-1 and no particular return named is the whole sales
  // side, not the one Sales Register vs GSTR-1 check: it gets the umbrella Sales with GST flow.
  const namesAReturn = [...userTokens].some((t) => t.startsWith("gstr"));
  if (hasSalesVsGst && !hasSalesRegister && !hasAccountsReceivablesCheck && !namesAReturn) {
    return INDEX.find((i) => i.entry.id === SALES_WITH_GST_ENTRY_ID)?.entry ?? null;
  }
  return INDEX.find((i) => i.entry.id === SALES_REGISTER_GST_SCRIPTED_ENTRY_ID)?.entry ?? null;
}

// "My purchases vs GST" or "an ITC issue", with no particular return, register or topic named, is the
// whole purchase side: it gets the umbrella Purchase with GST flow. Anything more specific (a named
// return such as GSTR-2B, or IMS, RCM, imports, ISD, capital goods, reversals) keeps its own flow.
const PURCHASE_SPECIFIC_WORDS = [
  "ims", "rcm", "reverse", "reversal", "reversals", "reclaim", "import", "imports", "isd", "capital",
  "blocked", "register", "ledger", "180", "unpaid", "bill", "boe", "icegate", "vendor", "vendors",
];

function matchesPurchaseWithGstTrigger(userTokens: ReadonlySet<string>): CatalogEntry | null {
  const tokens = [...userTokens];
  if (tokens.some((t) => t.startsWith("gstr")) || PURCHASE_SPECIFIC_WORDS.some((w) => userTokens.has(w))) return null;
  const purchaseWord = userTokens.has("purchase") || userTokens.has("purchases") || userTokens.has("inward");
  const gstWord = userTokens.has("gst") || userTokens.has("itc");
  const itcIssue = userTokens.has("itc") && (userTokens.has("issue") || userTokens.has("issues") || userTokens.has("problem") || userTokens.has("problems"));
  if (!((purchaseWord && gstWord) || itcIssue)) return null;
  return INDEX.find((i) => i.entry.id === PURCHASE_WITH_GST_ENTRY_ID)?.entry ?? null;
}

// "My GST payments", "tax payment reconciliation" or "a ledger issue", with no particular return,
// ledger, notice or refund named, is the whole tax-payment side: it gets the umbrella Tax payments
// and ledgers flow. Anything more specific keeps its own flow.
const TAX_SPECIFIC_WORDS = [
  "electronic", "credit", "cash", "liability", "challan", "interest", "penalty", "penalties", "late", "fee", "fees",
  "demand", "demands", "order", "orders", "notice", "refund", "refunds", "drc-03", "drc-01b", "drc-01c", "rfd-01",
  "rfd-06", "roll-forward", "rollforward", "vendor", "vendors", "supplier", "suppliers", "bank", "bill", "bills",
  "sales", "purchase", "purchases", "itc",
];

function matchesTaxPaymentsTrigger(userTokens: ReadonlySet<string>): CatalogEntry | null {
  const tokens = [...userTokens];
  if (tokens.some((t) => t.startsWith("gstr") || t.startsWith("drc") || t.startsWith("rfd"))) return null;
  if (TAX_SPECIFIC_WORDS.some((w) => userTokens.has(w))) return null;
  const taxWord = userTokens.has("tax") || userTokens.has("gst");
  const paymentWord = userTokens.has("payment") || userTokens.has("payments") || userTokens.has("paid") || userTokens.has("paying");
  const ledgerWord = userTokens.has("ledger") || userTokens.has("ledgers");
  if (!((taxWord && paymentWord) || (ledgerWord && (taxWord || userTokens.has("issue") || userTokens.has("issues") || userTokens.has("reconciliation"))))) {
    return null;
  }
  return INDEX.find((i) => i.entry.id === TAX_PAYMENTS_ENTRY_ID)?.entry ?? null;
}

/** Distinguishes a genuine greeting or "what can you do" question from an actual attempt at
 * describing a problem — so the reply can answer *that*, rather than treating every message as a
 * failed reconciliation match and reusing the same clarifying prompt regardless of what was said.
 * `null` means "treat this as a real attempt" — resolveIntent decides what happens next. */
// Year-end reconciliation runs against the annual return (GSTR-9), not GSTR-1 — so any mention of
// the annual return or a year-end/annual check goes to the Books Turnover vs GSTR-9 flow, ahead of
// the sales-register trigger above (which would otherwise claim "sales register vs GSTR-9").
const ANNUAL_SCRIPTED_ENTRY_ID = "8.5";

function matchesAnnualScriptedTrigger(userTokens: ReadonlySet<string>): CatalogEntry | null {
  const annual =
    userTokens.has("annual") ||
    userTokens.has("yearly") ||
    userTokens.has("year-end") ||
    userTokens.has("yearend") ||
    userTokens.has("gstr-9") ||
    userTokens.has("gstr9") ||
    userTokens.has("gstr-9c") ||
    userTokens.has("gstr9c") ||
    (userTokens.has("year") && userTokens.has("end"));
  if (!annual) return null;
  return INDEX.find((i) => i.entry.id === ANNUAL_SCRIPTED_ENTRY_ID)?.entry ?? null;
}

// Advances received from customers and HSN/SAC summaries each have their own scripted flow. Both
// are checked ahead of the sales-register trigger, which would otherwise claim "HSN summary vs
// sales register". "Advance" alone is ambiguous (advances to vendors are a payables matter), so it
// needs customer/output-side context and no purchase-side word.
const ADVANCES_SCRIPTED_ENTRY_ID = "10.11";
const HSN_SAC_SCRIPTED_ENTRY_ID = "10.12";

function matchesAdvancesScriptedTrigger(userTokens: ReadonlySet<string>): CatalogEntry | null {
  const advance = userTokens.has("advance") || userTokens.has("advances");
  const customerSide = ["received", "receipt", "receipts", "customer", "customers", "output", "liability", "sales", "gst", "tax"].some(
    (t) => userTokens.has(t),
  );
  const purchaseSide = ["vendor", "vendors", "supplier", "suppliers", "purchase", "paid", "itc"].some((t) => userTokens.has(t));
  if (!advance || !customerSide || purchaseSide) return null;
  return INDEX.find((i) => i.entry.id === ADVANCES_SCRIPTED_ENTRY_ID)?.entry ?? null;
}

function matchesHsnSacScriptedTrigger(userTokens: ReadonlySet<string>): CatalogEntry | null {
  const hsnSac = userTokens.has("hsn") || userTokens.has("sac") || userTokens.has("hsn/sac") || userTokens.has("hsn-sac");
  if (!hsnSac) return null;
  return INDEX.find((i) => i.entry.id === HSN_SAC_SCRIPTED_ENTRY_ID)?.entry ?? null;
}

// e-Invoice (IRN) checked against both the sales register and GSTR-1, and exports / SEZ supplies
// in their two kinds (with LUT, with payment of IGST). Checked ahead of the sales-register trigger.
// "e-way bill" mentions are left to their own reconciliation. An export described without saying
// which kind gets both offered, rather than guessing.
const E_INVOICE_SCRIPTED_ENTRY_ID = "14.8";
const EXPORTS_LUT_ENTRY_ID = "10.13";
const EXPORTS_IGST_ENTRY_ID = "10.14";

function entryById(id: string): CatalogEntry | null {
  return INDEX.find((i) => i.entry.id === id)?.entry ?? null;
}

function matchesEInvoiceScriptedTrigger(userTokens: ReadonlySet<string>): CatalogEntry | null {
  const eInvoice = ["e-invoice", "einvoice", "e-invoices", "einvoices", "irn", "irp"].some((t) => userTokens.has(t));
  const eWayBill = ["e-way", "eway", "ewb", "e-waybill", "ewaybill"].some((t) => userTokens.has(t));
  if (!eInvoice || eWayBill) return null;
  return entryById(E_INVOICE_SCRIPTED_ENTRY_ID);
}

function matchesExportsScriptedTrigger(userTokens: ReadonlySet<string>): ResolveResult | null {
  const exportLike = ["export", "exports", "exported", "sez", "zero-rated", "shipping"].some((t) => userTokens.has(t));
  if (!exportLike) return null;
  const lut = entryById(EXPORTS_LUT_ENTRY_ID);
  const igst = entryById(EXPORTS_IGST_ENTRY_ID);
  if (!lut || !igst) return null;
  const mentionsLut = userTokens.has("lut");
  const withoutLut = mentionsLut && (userTokens.has("without") || userTokens.has("no") || userTokens.has("not"));
  const paysIgst = (userTokens.has("igst") && (userTokens.has("paid") || userTokens.has("payment") || userTokens.has("pay"))) || userTokens.has("refund");
  if (withoutLut || paysIgst) return { confidence: "high", top: igst, candidates: [] };
  if (mentionsLut) return { confidence: "high", top: lut, candidates: [] };
  return { confidence: "medium", top: lut, candidates: [lut, igst] };
}

// Purchase-side, payment, cross-year and annual flows (see flows.ts) each list the phrases that
// mean them. When several flows match, the one whose matching phrase uses the most words wins
// (so "bill of entry vs GSTR-2B" is the import flow, not the plain purchase-vs-2B one); a tie goes
// to whichever comes first in that list.
function matchesFlowTrigger(userTokens: ReadonlySet<string>, excluded: ReadonlySet<string>): CatalogEntry | null {
  let best: { id: string; size: number } | null = null;
  for (const flow of FLOWS) {
    if (excluded.has(flow.id) || !flow.triggers) continue;
    for (const set of flow.triggers) {
      if (set.every((token) => userTokens.has(token)) && (!best || set.length > best.size)) {
        best = { id: flow.id, size: set.length };
      }
    }
  }
  return best ? entryById(best.id) : null;
}

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
    return { confidence: "low", top: null, candidates: [], anySignal: false };
  }
  const userTokenSet = new Set(userTokens);
  const excluded = new Set(excludeIds);

  const exportsMatch = matchesExportsScriptedTrigger(userTokenSet);
  if (exportsMatch && !matchesAnnualScriptedTrigger(userTokenSet) && !excluded.has(exportsMatch.top?.id ?? "")) {
    return exportsMatch;
  }

  const flowMatch = matchesFlowTrigger(userTokenSet, excluded);
  if (flowMatch) return { confidence: "high", top: flowMatch, candidates: [] };

  const scriptedMatch =
    matchesAnnualScriptedTrigger(userTokenSet) ??
    matchesHsnSacScriptedTrigger(userTokenSet) ??
    matchesAdvancesScriptedTrigger(userTokenSet) ??
    matchesEInvoiceScriptedTrigger(userTokenSet) ??
    matchesGstr2bScriptedTrigger(userTokenSet) ??
    matchesSalesRegisterGstScriptedTrigger(userTokenSet) ??
    matchesPurchaseWithGstTrigger(userTokenSet) ??
    matchesTaxPaymentsTrigger(userTokenSet);
  if (scriptedMatch && !excluded.has(scriptedMatch.id)) {
    return { confidence: "high", top: scriptedMatch, candidates: [] };
  }

  const scored = INDEX.filter((i) => !excluded.has(i.entry.id))
    .map((i) => ({ entry: i.entry, score: scoreEntry(userTokens, i), coverage: nameCoverage(userTokenSet, i) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return { confidence: "low", top: null, candidates: [], anySignal: false };
  }

  const first = scored[0];
  const isHighConfidence =
    first.coverage.matched >= HIGH_MIN_MATCHED_NAME_TOKENS && first.coverage.weighted >= HIGH_MIN_WEIGHTED_NAME_COVERAGE;

  if (isHighConfidence) {
    return { confidence: "high", top: first.entry, candidates: [] };
  }

  if (first.score < MEDIUM_SCORE_THRESHOLD) {
    return { confidence: "low", top: null, candidates: [], anySignal: true };
  }

  return {
    confidence: "medium",
    top: first.entry,
    candidates: scored.slice(0, CANDIDATE_COUNT).map((s) => s.entry),
  };
}

// --- Sides of GST (see areas.ts) -------------------------------------------------------------

export function areaOfEntry(entry: CatalogEntry): AreaId {
  return areaOfFamily(entry.familyId);
}

/** The side a message clearly points at: the one with the most keyword hits, as long as it beats the
 * runner-up. `null` when nothing points anywhere, or two sides tie — i.e. it's genuinely unclear. */
export function guessAreaFromText(text: string): AreaId | null {
  const tokens = new Set(tokenize(text));
  const hits = AREAS.map((area) => ({ id: area.id, count: area.keywords.filter((k) => tokens.has(k)).length }))
    .filter((h) => h.count > 0)
    .sort((a, b) => b.count - a.count);
  if (hits.length === 0) return null;
  if (hits.length > 1 && hits[0].count === hits[1].count) return null;
  return hits[0].id;
}

/** The closest checks within one side for a message — scored the same way as everywhere else, but
 * only among that side's checks. Falls back to the side's usual starting points when the message
 * has nothing specific to score. */
export function rankInArea(text: string, areaId: AreaId, excludeIds: readonly string[], limit = 3): CatalogEntry[] {
  const excluded = new Set(excludeIds);
  const userTokens = tokenize(text);
  const scored = INDEX.filter((i) => areaOfEntry(i.entry) === areaId && !excluded.has(i.entry.id))
    .map((i) => ({ entry: i.entry, score: scoreEntry(userTokens, i) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
  if (scored.length > 0) return scored;
  return AREA_BY_ID[areaId].starters
    .filter((id) => !excluded.has(id))
    .map((id) => entryById(id))
    .filter((e): e is CatalogEntry => e !== null)
    .slice(0, limit);
}
