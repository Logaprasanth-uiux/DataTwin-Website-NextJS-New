// Mock "affected data" for the first required file's validation issue (see
// components/chat/FileValidationFlow.tsx) — never real file contents, just a plausible-looking
// placeholder table with one column deliberately left blank on some rows. Kept in one place so the
// in-chat issue card, the file drawer, and the chat message all describe the exact same numbers
// instead of three independently hardcoded strings drifting apart.

export interface MockIssueRow {
  invoice: string;
  vendor: string;
  gstin: string;
  amount: string;
}

export const MOCK_ISSUE_FIELD = "GSTIN";

export const MOCK_ISSUE_ROWS: MockIssueRow[] = [
  { invoice: "INV-2231", vendor: "Orion Traders", gstin: "27AAECA1234F1Z8", amount: "₹84,200" },
  { invoice: "INV-2232", vendor: "Blue Harbor Pvt Ltd", gstin: "", amount: "₹1,12,500" },
  { invoice: "INV-2233", vendor: "Nexa Components", gstin: "24AAKCS5678D1Z3", amount: "₹46,900" },
  { invoice: "INV-2234", vendor: "Ridgeline Supplies", gstin: "", amount: "₹67,300" },
  { invoice: "INV-2235", vendor: "Solaris Freight Co", gstin: "29AABCU9988E1Z6", amount: "₹38,150" },
  { invoice: "INV-2236", vendor: "Meridian Textiles", gstin: "", amount: "₹1,54,000" },
  { invoice: "INV-2237", vendor: "Crestpoint Logistics", gstin: "07AACCK4432P1Z1", amount: "₹22,600" },
  { invoice: "INV-2238", vendor: "Harborline Packaging", gstin: "19AADCM7711Q1Z4", amount: "₹91,750" },
  { invoice: "INV-2239", vendor: "Vantage Industrial Co", gstin: "", amount: "₹58,900" },
  { invoice: "INV-2240", vendor: "Silverline Traders", gstin: "33AAACB2266R1Z9", amount: "₹1,05,300" },
];

export const MOCK_ISSUE_MISSING_COUNT = MOCK_ISSUE_ROWS.filter((row) => !row.gstin).length;

// Generated from the mock data above (field + counts), not a fixed string, so it stays accurate if
// that data ever changes — e.g. "GSTIN column is missing for 4 of 10 rows — without it, those rows
// can't be confidently matched during reconciliation."
export function describeMockFileIssue(): string {
  return `${MOCK_ISSUE_FIELD} column is missing for ${MOCK_ISSUE_MISSING_COUNT} of ${MOCK_ISSUE_ROWS.length} rows — without it, those rows can't be confidently matched during reconciliation.`;
}
