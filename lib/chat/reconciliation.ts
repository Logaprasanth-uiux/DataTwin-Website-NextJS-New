import { RECONCILIATION_CATALOG, type CatalogEntry } from "./data/catalog";
import { FILE_DEFS } from "./data/files";
import { generateMockResult } from "./mockResult";
import type { FileRequirement, ReconciliationTopic } from "./types";

export function getCatalogEntry(id: string | null): CatalogEntry | null {
  if (!id) return null;
  return RECONCILIATION_CATALOG.find((entry) => entry.id === id) ?? null;
}

const MAX_SUPPLEMENTARY_FILES = 2;

function toRequirement(fileId: string, level: FileRequirement["level"]): FileRequirement | null {
  const def = FILE_DEFS[fileId];
  if (!def) return null;
  return { fileId: def.id, name: def.name, level, why: def.why };
}

// Reconciliation_Catalog.xlsx's own file column is literally named "Required Input Files" — every
// file it lists for a reconciliation IS what that reconciliation needs to run (confirmed by
// Recon_to_File_Matrix, which marks every one of those as "Required" too). Earlier this instead
// re-derived required/optional from each file's own general-purpose level in File_Requirements —
// which is a statement about that file's importance *across the whole system*, not about this one
// reconciliation — so a reconciliation whose only inputs happen to be generally-"Optional" files
// (e.g. "Vendor Ledger vs Bank Statement", which only ever uses the two payment-control files) ended
// up with zero required files and a "Continue to verification" that shouldn't have been reachable.
//
// "Optional"/"Recommended" additions instead come from sibling reconciliations in the same family:
// real files this reconciliation doesn't strictly need, but that a closely related reconciliation in
// Reconciliation_Catalog.xlsx does use — offered with their genuine File_Requirements benefit text,
// not an invented one.
function buildFileRequirements(entry: CatalogEntry): { required: FileRequirement[]; optional: FileRequirement[] } {
  const required: FileRequirement[] = [];
  for (const fileId of entry.fileIds) {
    const requirement = toRequirement(fileId, "required");
    if (requirement) required.push(requirement);
  }

  const requiredIds = new Set(entry.fileIds);
  const supplementaryIds: string[] = [];
  for (const sibling of RECONCILIATION_CATALOG) {
    if (sibling.familyId !== entry.familyId || sibling.id === entry.id) continue;
    for (const fileId of sibling.fileIds) {
      if (requiredIds.has(fileId) || supplementaryIds.includes(fileId)) continue;
      supplementaryIds.push(fileId);
    }
    if (supplementaryIds.length >= MAX_SUPPLEMENTARY_FILES) break;
  }

  const optional: FileRequirement[] = [];
  for (const fileId of supplementaryIds.slice(0, MAX_SUPPLEMENTARY_FILES)) {
    const def = FILE_DEFS[fileId];
    if (!def) continue;
    const requirement = toRequirement(fileId, def.level === "conditional" ? "conditional" : "optional");
    if (requirement) optional.push(requirement);
  }

  return { required, optional };
}

// Bespoke walkthrough copy for reconciliations with a scripted journey (currently just "Bill vs
// GSTR-2B" — see the GST Reconciliation flow). Everything else keeps the generic templated copy
// built below; this only ever *adds* optional fields onto the topic the generic path already
// produces, so a reconciliation with no entry here behaves exactly as it did before.
const RECONCILIATION_SCRIPTS: Record<
  string,
  Pick<ReconciliationTopic, "filesIntro" | "fileAckOverrides" | "portalFetchFileIds" | "autoAdvanceMessage">
> = {
  "1.2": {
    filesIntro:
      "Perfect, let's get your GST reconciliation done! ⚡\nFirst, please upload your Vendor Bill Register.\n\nWhy this helps: This sets your internal purchase baseline so we can identify missing invoices or unrecorded tax credits before filing.",
    fileAckOverrides: {
      F05: "Got it! Vendor Register is ready.\n\nNext, share your GSTR-2B Detail.\n\nWhy this helps: We'll cross-check this official statement against your books to highlight claimable ITC, tax mismatches, and portal differences.",
    },
    portalFetchFileIds: ["F02"],
    autoAdvanceMessage: "Both files are ready. Running your reconciliation summary... ⏳",
  },
};

// Assembles the shape the existing upload/verification/result/reveal components already expect
// (`ReconciliationTopic`), on demand from the catalogue + file data once the discovery engine has
// identified a reconciliation — nothing about those downstream components needs to change.
export function buildResolvedTopic(reconciliationId: string): ReconciliationTopic | null {
  const entry = getCatalogEntry(reconciliationId);
  if (!entry) return null;
  const { required, optional } = buildFileRequirements(entry);
  return {
    id: entry.id,
    label: entry.name,
    acknowledgement: `Let's work through ${entry.name} — ${lowercaseFirst(entry.purpose)}`,
    requiredFiles: required,
    optionalFiles: optional,
    mockResult: generateMockResult(entry.id),
    ...RECONCILIATION_SCRIPTS[entry.id],
  };
}

function lowercaseFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}
