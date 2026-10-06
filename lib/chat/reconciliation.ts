import { RECONCILIATION_CATALOG, type CatalogEntry } from "./data/catalog";
import { FILE_DEFS } from "./data/files";
import { FLOW_BY_ID, type FlowConfig } from "./flows";
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
  | "filesIntro"
  | "fileAckOverrides"
  | "portalFetchFileIds"
  | "autoAdvanceMessage"
  | "furtherCheckpoints"
  | "optionalGroups"
  | "optionalGroupsQuestion"
> & {
  requiredFileNameOverrides?: Record<string, string>;
  /** Replaces a required file's generic catalogue description with one that fits this flow. */
  requiredFileWhyOverrides?: Record<string, string>;
  /** Narrows the generically-derived required files to just these (in this order) — the rest of
   * the catalogue entry's files are dropped rather than asked up front, so a scripted flow can
   * introduce them as its own later rounds instead. */
  baseFileIds?: string[];
};

// The optional documents of the umbrella Sales with GST check, in the order they're offered. The
// "SG-" ids are hand-written for this check (not rows in File_Requirements.xlsx), as for 10.1.
const SALES_WITH_GST_OPTIONAL: { fileId: string; name: string; why: string; benefit: string; portal?: boolean }[] = [
  { fileId: "SG-GSTR3B", name: "GSTR-3B Liability Summary", why: "Shows the tax you actually paid, so GSTR-1 can be checked against it month by month.", benefit: "Checks the tax declared in GSTR-1 against what you paid in GSTR-3B, which is where short payment shows up, and brings ITC into the result.", portal: true },
  { fileId: "F39", name: "e-Invoice (IRP) Register", why: FILE_DEFS.F39.why, benefit: "Confirms every IRN appears in your register and GSTR-1 with matching values.", portal: true },
  { fileId: "F40", name: "e-Way Bill Register", why: FILE_DEFS.F40.why, benefit: "Ties e-way bill values and details back to the invoices they were raised for.", portal: true },
  { fileId: "F24", name: "Export / SEZ Register", why: "Lists export and SEZ invoices with their destination and treatment, so each can be checked against GSTR-1.", benefit: "Confirms exports and SEZ supplies are reported in the right GSTR-1 table, and none as taxable." },
  { fileId: "F60", name: FILE_DEFS.F60.name, why: FILE_DEFS.F60.why, benefit: "Matches each export invoice to its shipping bill, so exports without one are flagged." },
  { fileId: "F61", name: FILE_DEFS.F61.name, why: FILE_DEFS.F61.why, benefit: "Confirms each export made without paying IGST falls within a valid LUT." },
  { fileId: "F22", name: FILE_DEFS.F22.name, why: "Lists advances received from customers, so GST at receipt and later adjustments can be checked.", benefit: "Checks tax was paid on advances received and that adjustments against invoices are reported." },
  { fileId: "F58", name: "HSN/SAC Summary", why: FILE_DEFS.F58.why, benefit: "Compares HSN- and rate-wise totals in GSTR-1 with your sales register.", portal: true },
  { fileId: "F31", name: FILE_DEFS.F31.name, why: FILE_DEFS.F31.why, benefit: "Ties every credit and debit note back to its original invoice, so returns and price changes net off correctly." },
  { fileId: "SG-GSTR1A", name: "GSTR-1A", why: "Captures same-period amendments to GSTR-1: corrections, cancellations and rate fixes.", benefit: "Picks up amendments filed after your GSTR-1, so corrected invoices stop showing up as mismatches.", portal: true },
  { fileId: "SG-OTHERINC", name: "Other Income Register", why: "Lists income outside normal sales, such as sale of assets or scrap, recoveries, rent, notice pay and cross-charges between your GSTINs.", benefit: "Finds income in your books that may be a supply but was never reported in GSTR-1." },
];

// The optional documents of the umbrella Purchase with GST check, by the group each belongs to. The
// user is asked which groups apply (see ReconciliationTopic.optionalGroups) and is only offered the
// documents of those. All of these have a definition in FILE_DEFS already.
const PURCHASE_WITH_GST_GROUPS: { id: string; label: string }[] = [
  { id: "vendor", label: "Vendor filings (GSTR-2A) and credit notes" },
  { id: "claimed", label: "ITC claimed in GSTR-3B" },
  { id: "ims", label: "IMS accepted, rejected or pending" },
  { id: "ledgers", label: "ITC ledgers in your books" },
  { id: "reversals", label: "ITC reversals and eligibility" },
  { id: "rcm", label: "Reverse charge (RCM)" },
  { id: "imports", label: "Imports of goods" },
  { id: "capital", label: "Capital goods" },
  { id: "isd", label: "ISD distribution" },
];

const PURCHASE_WITH_GST_OPTIONAL: { group: string; fileId: string; benefit: string }[] = [
  { group: "vendor", fileId: "F01", benefit: "Shows what vendors have reported against you, so vendors who have not filed or who amended an invoice stand out." },
  { group: "vendor", fileId: "F06", benefit: "Ties supplier credit and debit notes to the purchase invoices, so ITC is adjusted correctly." },
  { group: "claimed", fileId: "F03", benefit: "Checks the ITC you claimed against what GSTR-2B supports, and brings unclaimed and excess ITC into the result." },
  { group: "ims", fileId: "F29", benefit: "Reconciles accepted, rejected and pending invoice actions, so credit is neither lost nor claimed wrongly." },
  { group: "ledgers", fileId: "F07", benefit: "Ties the input CGST, SGST and IGST balances in your books to the credit taken in GSTR-3B." },
  { group: "ledgers", fileId: "F04", benefit: "Shows the credit actually available and used on the portal." },
  { group: "reversals", fileId: "F12", benefit: "Ties your reversals and reclaims to the Electronic Credit Reversal and Reclaimed Statement." },
  { group: "reversals", fileId: "F51", benefit: "Works out the common credit to reverse under Rules 42 and 43." },
  { group: "reversals", fileId: "F52", benefit: "Flags vendors unpaid beyond 180 days, where ITC has to be reversed under Rule 37." },
  { group: "reversals", fileId: "F50", benefit: "Marks purchases that are blocked under Section 17(5) or otherwise ineligible." },
  { group: "rcm", fileId: "F13", benefit: "Compares reverse-charge expenses with the RCM paid in cash and the ITC taken on it." },
  { group: "imports", fileId: "F34", benefit: "Matches each bill of entry to the import ITC claimed." },
  { group: "imports", fileId: "F35", benefit: "Cross-checks ICEGATE import data with GSTR-2B and your books." },
  { group: "capital", fileId: "F62", benefit: "Checks ITC on capital goods against the additions in your fixed asset register." },
  { group: "isd", fileId: "F37", benefit: "Shows the credit your Input Service Distributor distributed." },
  { group: "isd", fileId: "F38", benefit: "Compares the credit distributed with what each branch GSTIN received." },
];

// The optional documents of the umbrella Tax payments and ledgers check, by group (see
// PURCHASE_WITH_GST_GROUPS for the same shape). The required pair is GSTR-3B and the electronic
// liability ledger. All of these have a definition in FILE_DEFS already.
const TAX_PAYMENTS_GROUPS: { id: string; label: string }[] = [
  { id: "credit", label: "Credit ledger and input accounts in your books" },
  { id: "interest", label: "Cash ledger, interest and late fees" },
  { id: "drc03", label: "DRC-03 payments" },
  { id: "refunds", label: "Refunds claimed and received" },
  { id: "demands", label: "Demands and orders" },
];

const TAX_PAYMENTS_OPTIONAL: { group: string; fileId: string; benefit: string }[] = [
  { group: "credit", fileId: "F04", benefit: "Shows the credit available and used on the portal, to tie to the input accounts in your books." },
  { group: "credit", fileId: "F07", benefit: "Ties the input CGST, SGST and IGST balances in your books to the credit used to pay tax." },
  { group: "interest", fileId: "F20", benefit: "Shows the cash paid, so interest and late fees can be checked against what was due." },
  { group: "interest", fileId: "F33", benefit: "Matches each challan to the liability it paid, including interest and late fees." },
  { group: "drc03", fileId: "F21", benefit: "Matches voluntary payments made through DRC-03 to the liabilities they were meant to cover." },
  { group: "refunds", fileId: "F41", benefit: "Lists the refunds you applied for, to compare with what was sanctioned." },
  { group: "refunds", fileId: "F42", benefit: "Shows what was sanctioned, so short or rejected refunds stand out." },
  { group: "refunds", fileId: "F43", benefit: "Confirms sanctioned refunds actually reached the bank and the books." },
  { group: "refunds", fileId: "F44", benefit: "Compares the refund you are eligible for with what was claimed." },
  { group: "demands", fileId: "F63", benefit: "Lists demands and orders raised, to track what has been paid and what is still open." },
  { group: "demands", fileId: "F57", benefit: "Links each notice response to the payment made against it." },
];

// Bespoke walkthrough copy for reconciliations with a scripted journey. Everything else keeps the
// generic templated copy built below; this only ever *adds* optional fields onto the topic the
// generic path already produces, so a reconciliation with no entry here behaves exactly as it did
// before.
const RECONCILIATION_SCRIPTS: Record<string, ReconciliationScript> = {
  // "Sales Register vs e-Invoice vs GSTR-1": the e-invoice (IRN) register as a third document that
  // has to agree with both the books and the return. Credit/debit notes as the optional round.
  "14.8": {
    baseFileIds: ["F17", "F39", "F18"],
    requiredFileNameOverrides: { F18: "GSTR-1", F39: "e-Invoice (IRP) Register" },
    requiredFileWhyOverrides: {
      F39: "Lists every invoice registered on the e-invoice portal with its IRN, so each can be matched to your books and to GSTR-1.",
      F18: "Shows the invoices you reported for the period, to confirm each e-invoiced sale was reported with the same values.",
    },
    filesIntro:
      "Let's start with your Sales Revenue Register for the period.\n\nWhy this helps: Sets the books-side invoice list.",
    fileAckOverrides: {
      F17: "Got it. Now share your e-Invoice (IRP) Register for the same period.\n\nWhy this helps: Shows which invoices were registered and their IRNs.",
      F39: "Got it. Now share your GSTR-1 for the same period.\n\nWhy this helps: Confirms every e-invoiced sale was reported.",
    },
    portalFetchFileIds: ["F39", "F18"],
    autoAdvanceMessage: "All three files are ready. Running your Sales Register vs e-Invoice vs GSTR-1 reconciliation... ⏳",
    furtherCheckpoints: [
      {
        filesIntro: "Add your credit/debit notes for a more accurate number.",
        files: [{ fileId: "F31", name: FILE_DEFS.F31.name, level: "required", why: FILE_DEFS.F31.why }],
        accuracyBenefit:
          "Ties each credit or debit note to its e-invoice, so notes that were e-reported stop showing up as unmatched.",
        mockResult: generateMockResult("14.8::checkpoint-1"),
      },
    ],
  },
  // Zero-rated exports and supplies to SEZ units come in two kinds. This one: made under a Letter
  // of Undertaking, so no IGST is paid. Sales Register + GSTR-1 first; the export register, LUT
  // details and shipping bills as optional documents.
  "10.13": {
    baseFileIds: ["F17", "F18"],
    requiredFileNameOverrides: { F18: "GSTR-1" },
    requiredFileWhyOverrides: {
      F17: "Lists your sales for the period, including export and SEZ invoices marked as made under LUT.",
      F18: "Shows the exports and SEZ supplies you reported, to confirm they were reported as zero-rated with no IGST.",
    },
    filesIntro:
      "Let's start with your Sales Revenue Register for the period, with export and SEZ invoices marked as made under LUT.\n\nWhy this helps: Sets the books-side list of LUT exports.",
    fileAckOverrides: {
      F17: "Got it. Now share your GSTR-1 for the same period.\n\nWhy this helps: Shows how those exports were reported.",
    },
    portalFetchFileIds: ["F18"],
    autoAdvanceMessage: "Both files are ready. Running your Exports / SEZ with LUT reconciliation... ⏳",
    furtherCheckpoints: [
      {
        filesIntro: "Add your Export / SEZ Register.",
        files: [{ fileId: "F24", name: "Export / SEZ Register", level: "required", why: "Lists export and SEZ invoices with their destination and treatment, so each can be checked against GSTR-1." }],
        accuracyBenefit: "Confirms every export and SEZ invoice is reported in the right GSTR-1 table, and none is reported as taxable.",
        mockResult: generateMockResult("10.13::checkpoint-1"),
      },
      {
        filesIntro: "Add your LUT details.",
        files: [{ fileId: "F61", name: FILE_DEFS.F61.name, level: "required", why: FILE_DEFS.F61.why }],
        accuracyBenefit: "Confirms each export made without paying IGST falls within a valid LUT.",
        mockResult: generateMockResult("10.13::checkpoint-2"),
      },
      {
        filesIntro: "Add your shipping bill data.",
        files: [{ fileId: "F60", name: FILE_DEFS.F60.name, level: "required", why: FILE_DEFS.F60.why }],
        accuracyBenefit: "Matches each export invoice to its shipping bill, so exports without one are flagged.",
        mockResult: generateMockResult("10.13::checkpoint-3"),
      },
    ],
  },
  // The other kind: IGST is paid on the export or SEZ supply and claimed back as a refund later.
  // Sales Register, GSTR-1 and GSTR-3B first (what was reported and what was paid); the export
  // register, shipping bills and refund working as optional documents. The refund filing itself
  // is covered by the refund reconciliations (family 15) and can be linked from here later.
  "10.14": {
    baseFileIds: ["F17", "F18", "F03"],
    requiredFileNameOverrides: { F18: "GSTR-1", F03: "GSTR-3B" },
    requiredFileWhyOverrides: {
      F17: "Lists your sales for the period, including export and SEZ invoices marked as made with payment of IGST.",
      F18: "Shows the IGST you reported on exports and SEZ supplies.",
      F03: "Shows the IGST you actually paid, which is what you can claim back as a refund.",
    },
    filesIntro:
      "Let's start with your Sales Revenue Register for the period, with export and SEZ invoices marked as made with payment of IGST.\n\nWhy this helps: Sets the books-side list of exports on which IGST was paid.",
    fileAckOverrides: {
      F17: "Got it. Now share your GSTR-1 for the same period.\n\nWhy this helps: Shows the IGST reported on those exports.",
      F18: "Got it. Now share your GSTR-3B for the same period.\n\nWhy this helps: Shows the IGST actually paid.",
    },
    portalFetchFileIds: ["F18", "F03"],
    autoAdvanceMessage: "All three files are ready. Running your Exports / SEZ with IGST Payment reconciliation... ⏳",
    furtherCheckpoints: [
      {
        filesIntro: "Add your Export / SEZ Register.",
        files: [{ fileId: "F24", name: "Export / SEZ Register", level: "required", why: "Lists export and SEZ invoices with their destination and treatment, so each can be checked against GSTR-1." }],
        accuracyBenefit: "Confirms every export on which IGST was paid is reported in the right table and counted towards the refund.",
        mockResult: generateMockResult("10.14::checkpoint-1"),
      },
      {
        filesIntro: "Add your shipping bill data.",
        files: [{ fileId: "F60", name: FILE_DEFS.F60.name, level: "required", why: FILE_DEFS.F60.why }],
        accuracyBenefit: "Matches each export to its shipping bill, which the refund depends on.",
        mockResult: generateMockResult("10.14::checkpoint-2"),
      },
      {
        filesIntro: "Add your refund eligibility working.",
        files: [{ fileId: "F44", name: FILE_DEFS.F44.name, level: "required", why: FILE_DEFS.F44.why }],
        accuracyBenefit: "Compares the refund you've worked out with the IGST found in your returns, before you file.",
        mockResult: generateMockResult("10.14::checkpoint-3"),
      },
    ],
  },
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
  // "Sales with GST": the umbrella check for a user who says their sales have a GST issue without
  // naming one reconciliation. Sales Register + GSTR-1 are all that's needed to run; every other
  // sales-side document is optional, offered together before the run and again below the result.
  // The result is the Sales Register vs GSTR-1 summary (ITC appears once GSTR-3B is in).
  "10.15": {
    baseFileIds: ["F17", "F18"],
    requiredFileNameOverrides: { F18: "GSTR-1" },
    requiredFileWhyOverrides: {
      F17: "Lists your sales for the period, invoice by invoice, so each can be checked against what was reported.",
      F18: "Shows the sales you reported for the period, to match against your register.",
    },
    filesIntro:
      "Let's start with your Sales Revenue Register for the period.\n\nWhy this helps: Sets the books-side baseline.",
    fileAckOverrides: {
      F17: "Got it. Now share your GSTR-1 for the same period.\n\nWhy this helps: Matches every invoice to what's reported.",
    },
    portalFetchFileIds: ["F18"],
    autoAdvanceMessage: "Both files are ready. Running your Sales with GST reconciliation... ⏳",
    furtherCheckpoints: SALES_WITH_GST_OPTIONAL.map(
      ({ fileId, name, why, benefit, portal }, index): ReconciliationCheckpoint => ({
        files: [{ fileId, name, level: "required", why }],
        portalFetchFileIds: portal ? [fileId] : undefined,
        accuracyBenefit: benefit,
        mockResult: generateMockResult(`10.15::checkpoint-${index + 1}`),
      }),
    ),
  },
  // "Purchase with GST": the umbrella check for a user who says their purchases have a GST issue
  // without naming one reconciliation. Purchase Register + GSTR-2B are all that's needed to run. The
  // other purchase-side documents are optional and are asked for by group: the user says which of
  // these apply and is only offered those. Same result layout as Sales with GST, with ITC areas that
  // each appear only once the document behind them is in (see generatePurchaseGstResult).
  "1.14": {
    baseFileIds: ["F05", "F02"],
    requiredFileNameOverrides: { F05: "Purchase Register", F02: "GSTR-2B" },
    requiredFileWhyOverrides: {
      F05: "Lists your purchase invoices for the period, vendor by vendor, so each can be checked against what GST shows.",
      F02: "Shows the purchases your vendors reported for you, which is what your ITC can be claimed against.",
    },
    filesIntro:
      "Let's start with your Purchase Register for the period.\n\nWhy this helps: Sets the books-side baseline.",
    fileAckOverrides: {
      F05: "Got it. Now share your GSTR-2B for the same period.\n\nWhy this helps: Shows which of your purchase invoices your vendors have reported.",
    },
    portalFetchFileIds: ["F02"],
    autoAdvanceMessage: "Both files are ready. Running your Purchase with GST reconciliation... ⏳",
    optionalGroups: PURCHASE_WITH_GST_GROUPS,
    optionalGroupsQuestion: "To narrow this down, which of these apply to your purchases?",
    furtherCheckpoints: PURCHASE_WITH_GST_OPTIONAL.map(
      ({ group, fileId, benefit }, index): ReconciliationCheckpoint => ({
        group,
        files: [{ fileId, name: FILE_DEFS[fileId].name, level: "required", why: FILE_DEFS[fileId].why }],
        portalFetchFileIds: ["F01", "F03", "F04", "F29", "F37"].includes(fileId) ? [fileId] : undefined,
        accuracyBenefit: benefit,
        mockResult: generateMockResult(`1.14::checkpoint-${index + 1}`),
      }),
    ),
  },
  // "Tax payments and ledgers": the umbrella check for a user asking about their GST payments without
  // naming one reconciliation. GSTR-3B and the electronic liability ledger are all that's needed to run.
  // Everything else is optional and asked for by group. The result is framed as exposure, and each area
  // appears only once the document behind it is in (see generateTaxGstResult).
  "11.9": {
    baseFileIds: ["F03", "F19"],
    requiredFileNameOverrides: { F03: "GSTR-3B", F19: "Electronic Liability Ledger" },
    requiredFileWhyOverrides: {
      F03: "Shows the tax you declared for the period, which is what has to be paid.",
      F19: "Shows the liability on the portal and how much of it has been discharged.",
    },
    filesIntro:
      "Let's start with your GSTR-3B for the period.\n\nWhy this helps: Sets the tax you declared.",
    fileAckOverrides: {
      F03: "Got it. Now share your Electronic Liability Ledger for the same period.\n\nWhy this helps: Shows how much of that tax has actually been paid.",
    },
    portalFetchFileIds: ["F03", "F19"],
    autoAdvanceMessage: "Both files are ready. Running your Tax payments and ledgers reconciliation... ⏳",
    optionalGroups: TAX_PAYMENTS_GROUPS,
    optionalGroupsQuestion: "To narrow this down, which of these apply to your GST payments?",
    furtherCheckpoints: TAX_PAYMENTS_OPTIONAL.map(
      ({ group, fileId, benefit }, index): ReconciliationCheckpoint => ({
        group,
        files: [{ fileId, name: FILE_DEFS[fileId].name, level: "required", why: FILE_DEFS[fileId].why }],
        portalFetchFileIds: ["F04", "F20", "F41", "F42"].includes(fileId) ? [fileId] : undefined,
        accuracyBenefit: benefit,
        mockResult: generateMockResult(`11.9::checkpoint-${index + 1}`),
      }),
    ),
  },
};

// Documents that can be downloaded from the GST Portal (or its linked systems) offer "Fetch from GST
// Portal" in the flows generated from flows.ts.
const PORTAL_FLOW_FILE_IDS = new Set([
  "F01", "F02", "F03", "F04", "F14", "F18", "F19", "F20", "F29", "F37", "F39", "F40", "F41", "F42", "F54", "F55",
]);

// Builds a flow's script from its config (flows.ts) and its catalogue entry: the required
// documents first, then every other document as an optional round, all offered together before
// the run (see OptionalDocsOffer) and again on the result's accuracy card.
function scriptFromFlow(entry: CatalogEntry, flow: FlowConfig, label: string): ReconciliationScript {
  const base = flow.base ?? entry.fileIds.slice(0, 2);
  const optionalIds = [...entry.fileIds.filter((id) => !base.includes(id)), ...(flow.extra ?? []).filter((id) => !entry.fileIds.includes(id) && !base.includes(id))];
  return {
    baseFileIds: base,
    requiredFileNameOverrides: flow.names,
    requiredFileWhyOverrides: flow.whys,
    portalFetchFileIds: [...base, ...optionalIds].filter((id) => PORTAL_FLOW_FILE_IDS.has(id)),
    autoAdvanceMessage: `Running your ${label} reconciliation... ⏳`,
    furtherCheckpoints: optionalIds.flatMap((fileId, index): ReconciliationCheckpoint[] => {
      const def = FILE_DEFS[fileId];
      if (!def) return [];
      return [
        {
          files: [{ fileId, name: flow.names?.[fileId] ?? def.name, level: "required", why: flow.whys?.[fileId] ?? def.why }],
          portalFetchFileIds: PORTAL_FLOW_FILE_IDS.has(fileId) ? [fileId] : undefined,
          accuracyBenefit: flow.whys?.[fileId] ?? def.why,
          mockResult: generateMockResult(`${entry.id}::checkpoint-${index + 1}`),
        },
      ];
    }),
  };
}

// Assembles the shape the existing upload/verification/result/reveal components already expect
// (`ReconciliationTopic`), on demand from the catalogue + file data once the discovery engine has
// identified a reconciliation — nothing about those downstream components needs to change.
export function buildResolvedTopic(reconciliationId: string): ReconciliationTopic | null {
  const entry = getCatalogEntry(reconciliationId);
  if (!entry) return null;
  const { required, optional } = buildFileRequirements(entry);
  const flow = FLOW_BY_ID[entry.id];
  const written = RECONCILIATION_SCRIPTS[entry.id] ?? (flow ? scriptFromFlow(entry, flow, CHAT_LABEL_OVERRIDES[entry.id] ?? entry.name) : undefined);
  const { requiredFileNameOverrides, requiredFileWhyOverrides, baseFileIds, ...script } = written ?? {};
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
