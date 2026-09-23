// Generated from Recon_Hierarchy.xlsx (top-level family rows). Business-facing names/purposes
// only — no internal ranking or priority data is included.
export interface ReconciliationFamily {
  id: string;
  name: string;
  purpose: string;
}

export const RECONCILIATION_FAMILIES: ReconciliationFamily[] = [
  { id: "1", name: "Purchase Invoice ↔ GST Portal", purpose: "Core supplier/portal document matching" },
  { id: "2", name: "Book GST ↔ Accounting GL", purpose: "Validate accounting of input GST and receivable balance" },
  { id: "3", name: "ITC Availability ↔ ITC Claim", purpose: "Determine recovery, claim and overclaim opportunities" },
  { id: "4", name: "ITC Reversal ↔ Reclaim", purpose: "Control temporary reversals and subsequent reclaims" },
  { id: "5", name: "Filed Return ↔ GST Portal Credit Ledger", purpose: "Confirm return-level ITC flowed into portal credit" },
  { id: "6", name: "Vendor Invoice ↔ Payment ↔ Bank", purpose: "Payment controls supporting invoice lifecycle" },
  { id: "7", name: "Reverse Charge (RCM) Reconciliation", purpose: "Separate reverse-charge liability and ITC treatment" },
  { id: "8", name: "GSTR-9C Annual Reconciliation", purpose: "Annual reconciliation of turnover, taxable turnover, tax paid and ITC between books/financial statements and GSTR-9." },
  { id: "9", name: "Invoice Management System (IMS) Reconciliation", purpose: "Control recipient actions on supplier documents before/around GSTR-2B generation and identify ITC impact." },
  { id: "10", name: "Outward Supply & GST Liability Reconciliation", purpose: "Reconcile sales/revenue, GSTR-1/1A and GSTR-3B to identify output-GST leakage or overstatement." },
  { id: "11", name: "GST Liability & Tax Payment Reconciliation", purpose: "Reconcile declared GST liability to electronic liability, cash and credit ledgers and actual discharge." },
  { id: "12", name: "Import / SEZ / ICEGATE ITC Reconciliation", purpose: "Validate import/SEZ IGST and Bill-of-Entry data from books/ICEGATE through GSTR-2B and ITC claim." },
  { id: "13", name: "ISD / Common ITC Distribution Reconciliation", purpose: "Validate Input Service Distributor credit received, distributed and claimed by recipient GSTINs." },
  { id: "14", name: "E-Invoice / E-Way Bill Reconciliation", purpose: "Reconcile ERP sales documents with IRP/e-invoice, GSTR-1 and e-way bills for completeness and correctness." },
  { id: "15", name: "GST Refund Reconciliation & Recovery", purpose: "Identify, substantiate and track GST refund opportunities from eligibility through sanction and bank receipt." },
  { id: "16", name: "GST TDS / TCS Reconciliation", purpose: "Reconcile GST TDS/TCS deducted/collected with portal credit and books to identify unrecognized cash-ledger credits." },
  { id: "17", name: "Advanced ITC Eligibility / Reversal Reconciliation", purpose: "Validate legal/internal ITC eligibility, blocked/common credit, timing and reversal conditions beyond basic 2B availability." },
  { id: "18", name: "GST Return Compliance / DRC Controls", purpose: "Proactively identify GSTR-1 vs 3B and GSTR-2B vs 3B differences and track DRC-01B/01C resolution." },
];
