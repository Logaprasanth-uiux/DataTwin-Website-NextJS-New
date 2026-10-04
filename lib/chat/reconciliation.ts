import { RECONCILIATION_CATALOG, type CatalogEntry } from "./data/catalog";
import { FILE_DEFS } from "./data/files";
import { generateMockResult } from "./mockResult";
import type { FileRequirement, ReconciliationCheckpoint, ReconciliationTopic } from "./types";

export function getCatalogEntry(id: string | null): CatalogEntry | null {
  if (!id) return null;
  return RECONCILIATION_CATALOG.find((entry) => entry.id === id) ?? null;
}

const MAX_SUPPLEMENTARY_FILES = 2;

// Family 8 is the annual GSTR-9 / GSTR-9C family — everything else is reconciled month by month.
const ANNUAL_FAMILY_ID = "8";
export const ANNUAL_ENTRY_ID = "8.5";

// The catalogue's own names read as spreadsheet row labels for a couple of entries; chat shows a
// plainer name for these (the catalogue itself is left untouched).
const CHAT_LABEL_OVERRIDES: Record<string, string> = {
  [ANNUAL_ENTRY_ID]: "Books Turnover vs GSTR-9",
};

// GSTR-9 annual return, e-invoice (IRP) register and e-way bill register all come from government
// portals, so they can be fetched instead of uploaded.
const PORTAL_FETCHABLE_FILE_IDS = new Set(["F14", "F39", "F40"]);

export function periodModeFor(reconciliationId: string | null): "monthly" | "annual" {
  return getCatalogEntry(reconciliationId)?.familyId === ANNUAL_FAMILY_ID ? "annual" : "monthly";
}

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

// A scripted flow's base round can also relabel one of the generically-derived required files —
// e.g. entry 10.1's own File_Requirements name for F18 is "GSTR-1 GSTR-1A Annual" (the portal
// export genuinely bundles both), but "Sales Register vs GST Reconciliation" asks for GSTR-1A
// separately as its own later checkpoint, so the base round's card needs to read as plain "GSTR-1"
// or the two asks read as duplicates of each other.
type ReconciliationScript = Pick<
  ReconciliationTopic,
  "filesIntro" | "fileAckOverrides" | "portalFetchFileIds" | "autoAdvanceMessage" | "furtherCheckpoints"
> & {
  requiredFileNameOverrides?: Record<string, string>;
  /** Replaces a required file's generic catalogue description with one that fits this flow. */
  requiredFileWhyOverrides?: Record<string, string>;
  /** Narrows the generically-derived required files to just these (in this order) — the rest of
   * the catalogue entry's files are dropped rather than asked up front, so a scripted flow can
   * introduce them as its own later rounds instead. */
  baseFileIds?: string[];
};

// Bespoke walkthrough copy for reconciliations with a scripted journey. Everything else keeps the
// generic templated copy built below; this only ever *adds* optional fields onto the topic the
// generic path already produces, so a reconciliation with no entry here behaves exactly as it did
// before.
const RECONCILIATION_SCRIPTS: Record<string, ReconciliationScript> = {
  // "Advances Received vs GST Liability": advances taken from customers are taxable when received,
  // reported in GSTR-1 (advance table) and paid through GSTR-3B, then adjusted when the invoice is
  // raised. Advance Register + GSTR-1 first; the sales register and GSTR-3B as accuracy rounds.
  "10.11": {
    baseFileIds: ["F22", "F18"],
    requiredFileWhyOverrides: {
      F22: "Lists advances received from customers, with dates and amounts, so each can be checked for GST at receipt and for later adjustment.",
      F18: "Shows the advances you reported and the adjustments you made against invoices for the period.",
    },
    requiredFileNameOverrides: { F18: "GSTR-1" },
    filesIntro:
      "Let's start with your Advance Register for the period.\n\nWhy this helps: Lists every advance received from customers.",
    fileAckOverrides: {
      F22: "Got it. Now share your GSTR-1 for the same period.\n\nWhy this helps: Shows which advances were reported and which were adjusted.",
    },
    portalFetchFileIds: ["F18"],
    autoAdvanceMessage: "Both files are ready. Running your Advances vs GST Liability reconciliation... ⏳",
    furtherCheckpoints: [
      {
        filesIntro:
          "Add your Sales Revenue Register for a more accurate number, or continue with what's already uploaded.\n\nWhy this helps: Confirms advances were adjusted against the right invoices.",
        files: [{ fileId: "F17", name: FILE_DEFS.F17.name, level: "required", why: FILE_DEFS.F17.why }],
        accuracyBenefit:
          "Matches each advance to the invoice that later adjusted it, so adjusted advances stop showing up as still-unreported.",
        autoAdvanceMessage: "Sales register received. Refreshing your reconciliation... ⏳",
        mockResult: generateMockResult("10.11::checkpoint-1"),
      },
      {
        filesIntro:
          "Last one — add your GSTR-3B Liability Summary for the final number, or continue as-is.\n\nWhy this helps: Confirms tax on advances was actually paid.",
        files: [
          {
            fileId: "SG-GSTR3B",
            name: "GSTR-3B Liability Summary",
            level: "required",
            why: "Confirms the output tax declared and paid in GSTR-3B includes the tax due on advances.",
          },
        ],
        portalFetchFileIds: ["SG-GSTR3B"],
        accuracyBenefit:
          "Checks that tax due on advances reached GSTR-3B, which is where unpaid tax on advances shows up.",
        autoAdvanceMessage: "All documents are in. Running your final Advances vs GST Liability reconciliation... ⏳",
        mockResult: generateMockResult("10.11::checkpoint-2"),
      },
    ],
  },
  // "HSN/SAC Summary vs Sales Register": the GSTR-1 HSN summary (Table 12) against the same
  // period's sales register, then the HSN master and credit/debit notes as accuracy rounds.
  "10.12": {
    baseFileIds: ["F17", "F58"],
    filesIntro:
      "Let's start with your Sales Revenue Register for the period.\n\nWhy this helps: Sets the books-side HSN/SAC baseline.",
    fileAckOverrides: {
      F17: "Got it. Now share your GSTR-1 HSN Summary for the same period.\n\nWhy this helps: Shows the HSN/SAC-wise values you reported.",
    },
    portalFetchFileIds: ["F58"],
    autoAdvanceMessage: "Both files are ready. Running your HSN/SAC Summary vs Sales Register reconciliation... ⏳",
    furtherCheckpoints: [
      {
        filesIntro:
          "Add your HSN/SAC Master for a more accurate number, or continue with what's already uploaded.\n\nWhy this helps: Catches wrong or missing HSN/SAC codes at source.",
        files: [{ fileId: "F59", name: FILE_DEFS.F59.name, level: "required", why: FILE_DEFS.F59.why }],
        accuracyBenefit:
          "Checks each item's code and rate against your master, so wrong-code and wrong-rate differences are explained instead of left as gaps.",
        autoAdvanceMessage: "HSN/SAC master received. Refreshing your reconciliation... ⏳",
        mockResult: generateMockResult("10.12::checkpoint-1"),
      },
      {
        filesIntro:
          "Last one — add your credit/debit notes for the final number, or continue as-is.\n\nWhy this helps: Nets returns and price changes out of each HSN total.",
        files: [{ fileId: "F31", name: FILE_DEFS.F31.name, level: "required", why: FILE_DEFS.F31.why }],
        accuracyBenefit:
          "Nets credit and debit notes out of each HSN/SAC total, so returns don't read as quantity or value differences.",
        autoAdvanceMessage: "Credit/debit notes received. Recalculating... ⏳",
        mockResult: generateMockResult("10.12::checkpoint-2"),
      },
    ],
  },
  // "Gross Turnover Reconciliation - Table 5/6" — the year-end (GSTR-9) counterpart to the monthly
  // Sales Register vs GSTR-1 flow: full-year books turnover against the annual return. Same
  // round-by-round shape: Sales Register + GSTR-9 first, then the financial statements, the Trial
  // Balance and the credit/debit notes as optional accuracy rounds.
  "8.5": {
    baseFileIds: ["F17", "F14"],
    filesIntro:
      "Let's start with your Sales Revenue Register for the full financial year.\n\nWhy this helps: Sets the books-side turnover baseline.",
    fileAckOverrides: {
      F17: "Got it. Now share your GSTR-9 for the same financial year.\n\nWhy this helps: Shows the turnover you declared in the annual return.",
    },
    portalFetchFileIds: ["F14"],
    autoAdvanceMessage: "Both files are ready. Running your Books Turnover vs GSTR-9 reconciliation... ⏳",
    furtherCheckpoints: [
      {
        filesIntro:
          "Add your Annual Financial Statements for a more accurate number, or continue with what's already uploaded.\n\nWhy this helps: Ties turnover to the audited figures instead of the register alone.",
        files: [{ fileId: "F15", name: FILE_DEFS.F15.name, level: "required", why: FILE_DEFS.F15.why }],
        accuracyBenefit:
          "Starts from the audited turnover, so differences between your books and the annual return are explained by real adjustments instead of showing up as gaps.",
        autoAdvanceMessage: "Financial statements received. Refreshing your reconciliation... ⏳",
        mockResult: generateMockResult("8.5::checkpoint-1"),
      },
      {
        filesIntro:
          "Add your Trial Balance for an even tighter number, or continue as-is.\n\nWhy this helps: Confirms revenue ledger totals behind the turnover.",
        files: [{ fileId: "F16", name: FILE_DEFS.F16.name, level: "required", why: FILE_DEFS.F16.why }],
        accuracyBenefit:
          "Checks the revenue ledger balances behind your turnover, which is where unbilled or misposted sales usually surface.",
        autoAdvanceMessage: "Trial Balance received. Recalculating... ⏳",
        mockResult: generateMockResult("8.5::checkpoint-2"),
      },
      {
        filesIntro:
          "Last one — add your credit/debit notes for the final number, or continue as-is.\n\nWhy this helps: Adjusts turnover for returns and price changes.",
        files: [{ fileId: "F06", name: FILE_DEFS.F06.name, level: "required", why: FILE_DEFS.F06.why }],
        accuracyBenefit:
          "Adjusts annual turnover for credit and debit notes issued during the year, so returns and price changes don't read as unexplained differences.",
        autoAdvanceMessage: "All documents are in. Running your final Books Turnover vs GSTR-9 reconciliation... ⏳",
        mockResult: generateMockResult("8.5::checkpoint-3"),
      },
    ],
  },
  "1.2": {
    filesIntro:
      "Let's get started — please upload your Vendor Bill Register.\n\nWhy this helps: Sets your purchase baseline.",
    fileAckOverrides: {
      F05: "Got it. Now share your GSTR-2B Detail.\n\nWhy this helps: Flags claimable ITC and mismatches.",
    },
    portalFetchFileIds: ["F02"],
    autoAdvanceMessage: "Both files are ready. Running your reconciliation summary... ⏳",
  },
  // "Sales Register vs GST Reconciliation": four progressive rounds, each adding one more document
  // and showing a refreshed, more accurate result — Sales Register + GSTR-1 first, then GSTR-1A,
  // then the outward credit/debit notes, then the GSTR-3B Liability Summary that closes the loop.
  // The two GSTR-1A/GSTR-3B-summary file ids below are hand-written for this script specifically
  // (not drawn from File_Requirements.xlsx — see FileRequirement's own doc comment on
  // ReconciliationCheckpoint.files), using a non-numeric id so they can never collide with a real
  // generated F-number.
  "10.1": {
    filesIntro:
      "Let's start with your Sales Revenue Register for the period.\n\nWhy this helps: Sets the books-side baseline.",
    requiredFileNameOverrides: {
      F18: "GSTR-1",
    },
    fileAckOverrides: {
      F17: "Got it. Now share your GSTR-1 for the same period.\n\nWhy this helps: Matches every invoice to what's reported.",
    },
    portalFetchFileIds: ["F18"],
    autoAdvanceMessage: "Both files are ready. Running your Sales Register vs GSTR-1 reconciliation... ⏳",
    furtherCheckpoints: [
      {
        // The pitch for this round IS its filesIntro — the ask ("share it below") sits right next
        // to a "continue with the existing uploaded documents alone" way out (see FileUploadStep),
        // not behind a separate yes/no turn first.
        filesIntro:
          "Add your GSTR-1A for a more accurate number, or continue with what's already uploaded.\n\nWhy this helps: Corrected or cancelled invoices won't be flagged as mismatches.",
        files: [
          {
            fileId: "SG-GSTR1A",
            name: "GSTR-1A",
            level: "required",
            why: "Captures same-period amendments to GSTR-1 — corrections, cancellations and rate fixes.",
          },
        ],
        portalFetchFileIds: ["SG-GSTR1A"],
        accuracyBenefit:
          "Picks up amendments, cancellations and rate corrections filed after your GSTR-1, so corrected invoices stop showing up as false mismatches.",
        autoAdvanceMessage: "GSTR-1A is in. Refreshing your reconciliation with the amendments included... ⏳",
        mockResult: generateMockResult("10.1::checkpoint-1"),
      },
      {
        filesIntro:
          "Add your credit/debit notes for an even tighter number, or continue as-is.\n\nWhy this helps: Links notes back to the right original invoice.",
        files: [
          {
            fileId: "F31",
            name: FILE_DEFS.F31.name,
            level: "required",
            why: FILE_DEFS.F31.why,
          },
        ],
        // No portal-fetch alternative here: credit/debit notes come from the company's own books,
        // not from a GST Portal download, so this round is upload-only.
        accuracyBenefit:
          "Ties every outward credit/debit note back to its original invoice, so returns and price adjustments correctly reduce what you've billed and what's recoverable.",
        autoAdvanceMessage: "Credit/debit notes received. Recalculating with the full adjustment trail... ⏳",
        mockResult: generateMockResult("10.1::checkpoint-2"),
      },
      {
        filesIntro:
          "Last one — add your GSTR-3B Liability Summary for the final, audit-ready number, or continue as-is.\n\nWhy this helps: Confirms declared tax matches what you owe.",
        files: [
          {
            fileId: "SG-GSTR3B",
            name: "GSTR-3B Liability Summary",
            level: "required",
            why: "Confirms the output tax liability actually declared in GSTR-3B against the sales-side reconciliation.",
          },
        ],
        portalFetchFileIds: ["SG-GSTR3B"],
        accuracyBenefit:
          "Checks the tax you actually declared in GSTR-3B against what your sales support, which is where short-paid or over-paid output tax shows up, and gives you the audit-ready number.",
        autoAdvanceMessage: "All documents are in. Running your final Sales Register vs GST reconciliation... ⏳",
        mockResult: generateMockResult("10.1::checkpoint-3"),
      },
    ],
  },
};

// Assembles the shape the existing upload/verification/result/reveal components already expect
// (`ReconciliationTopic`), on demand from the catalogue + file data once the discovery engine has
// identified a reconciliation — nothing about those downstream components needs to change.
export function buildResolvedTopic(reconciliationId: string): ReconciliationTopic | null {
  const entry = getCatalogEntry(reconciliationId);
  if (!entry) return null;
  const { required, optional } = buildFileRequirements(entry);
  const { requiredFileNameOverrides, requiredFileWhyOverrides, baseFileIds, ...script } = RECONCILIATION_SCRIPTS[entry.id] ?? {};
  const requiredBase = baseFileIds
    ? baseFileIds.map((id) => required.find((f) => f.fileId === id)).filter((f): f is FileRequirement => Boolean(f))
    : required;
  const requiredWithOverrides = requiredBase.map((f) => ({
    ...f,
    name: requiredFileNameOverrides?.[f.fileId] ?? f.name,
    why: requiredFileWhyOverrides?.[f.fileId] ?? f.why,
  }));
  return {
    id: entry.id,
    label: CHAT_LABEL_OVERRIDES[entry.id] ?? entry.name,
    acknowledgement: `Let's work through ${entry.name} — ${lowercaseFirst(entry.purpose)}`,
    requiredFiles: requiredWithOverrides,
    // Documents that can be downloaded from a government portal offer "Fetch from GST Portal"
    // alongside upload, in every reconciliation that asks for them — a script can still set its own
    // list explicitly (the spread below wins).
    portalFetchFileIds: [...requiredWithOverrides, ...(baseFileIds ? [] : optional)].map((f) => f.fileId).filter((id) => PORTAL_FETCHABLE_FILE_IDS.has(id)),
    optionalFiles: baseFileIds ? [] : optional,
    mockResult: generateMockResult(entry.id),
    ...script,
  };
}

function lowercaseFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}
