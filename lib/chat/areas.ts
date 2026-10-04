// The "side" of GST a question is about. When a user's message doesn't point clearly at one
// reconciliation, DataTwin first works out (or asks) which side it's on, then narrows to a check
// within it — see discovery.ts. Every catalogue family belongs to exactly one area.

export type AreaId = "sales" | "purchase" | "tax" | "refunds" | "annual" | "tds" | "vendor-payments";

export interface Area {
  id: AreaId;
  label: string;
  /** One line on what this side covers, used by the playground's category cards. */
  blurb: string;
  /** Words (as the resolver tokenises them) that point at this side. Only used to guess the side. */
  keywords: string[];
  /** Where to start when nothing in the message points at a particular check on this side. */
  starters: string[];
}

export const AREAS: Area[] = [
  {
    id: "sales",
    label: "Sales",
    blurb: "Outward supplies: sales register against GSTR-1, advances, HSN/SAC, exports and SEZ, e-invoice and e-way bill.",
    keywords: ["sales", "sale", "outward", "customer", "customers", "revenue", "gstr-1", "gstr-1a", "output", "export", "exports", "sez", "hsn", "sac", "advance", "advances", "e-invoice", "einvoice", "irn", "e-way", "eway", "lut"],
    starters: ["10.1", "10.11", "14.8", "10.13"],
  },
  {
    id: "purchase",
    label: "Purchase & ITC",
    blurb: "Inward supplies and ITC: purchases against GSTR-2A and 2B, ITC claim, IMS, reversals, reverse charge, imports, ISD, capital goods.",
    keywords: ["purchase", "purchases", "vendor", "vendors", "supplier", "suppliers", "bill", "bills", "itc", "gstr-2a", "gstr-2b", "input", "ims", "rcm", "reverse", "import", "imports", "isd", "capital", "blocked", "reversal", "reclaim"],
    starters: ["1.2", "3.3", "17.1", "7.4"],
  },
  {
    id: "tax",
    label: "Tax payments & ledgers",
    blurb: "Paying the tax: liability, credit and cash ledgers, interest and late fees, DRC-03 and DRC-01B, demands and orders.",
    keywords: ["cash", "challan", "interest", "penalty", "penalties", "late", "drc-03", "drc-01b", "drc-01c", "demand", "demands", "notice", "liability", "ledger"],
    starters: ["11.1", "11.6", "11.5", "18.6"],
  },
  {
    id: "refunds",
    label: "Refunds",
    blurb: "Refund eligibility, claims, orders and bank receipts.",
    keywords: ["refund", "refunds", "rfd-01", "rfd-06"],
    starters: ["15.1", "15.7", "15.9"],
  },
  {
    id: "annual",
    label: "Annual returns (GSTR-9 / 9C)",
    blurb: "Books against the annual return, plus transactions that cross financial years.",
    keywords: ["annual", "yearly", "year-end", "gstr-9", "gstr-9c", "audited"],
    starters: ["8.5", "8.1", "8.16", "8.7"],
  },
  {
    id: "tds",
    label: "GST TDS & TCS",
    blurb: "GST TDS and TCS credit against GSTR-7, GSTR-8 and the books.",
    keywords: ["tds", "tcs", "gstr-7", "gstr-8", "deducted", "deductor"],
    starters: ["16.1", "16.2", "16.4"],
  },
  {
    id: "vendor-payments",
    label: "Vendor payments & bank",
    blurb: "Vendor bills, ledgers, payments and bank statements.",
    keywords: ["bank", "payments", "settlement", "paid"],
    starters: ["6.1", "6.2", "6.5"],
  },
];

export const AREA_BY_ID: Record<AreaId, Area> = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<AreaId, Area>;

const FAMILY_AREA: Record<string, AreaId> = {
  "1": "purchase", "2": "purchase", "3": "purchase", "4": "purchase", "5": "tax", "6": "vendor-payments",
  "7": "purchase", "8": "annual", "9": "purchase", "10": "sales", "11": "tax", "12": "purchase",
  "13": "purchase", "14": "sales", "15": "refunds", "16": "tds", "17": "purchase", "18": "tax",
};

export function areaOfFamily(familyId: string): AreaId {
  return FAMILY_AREA[familyId] ?? "purchase";
}
