// Copy for the "shared engine" diagram, taken from the reference diagram (datatwin-engine.svg). Order of
// SOURCES matters: source i sits at ENGINE.angles[i] on the outer ring.

export const SOURCES = [
  "Email",
  "PDF invoices",
  "Handwritten",
  "EDI",
  "Customer contracts",
  "Partner agreements",
  "Vendor contracts",
  "Price agreements",
  "Rebate terms",
  "ERP",
  "CRM",
  "Sales orders",
  "Vendor ERP",
  "Bank & gateway",
] as const;

export const MODULES = [
  { code: "AP", name: "Accounts Payable", desc: "Duplicates, price and quantity variance, tax eligibility, approval limits" },
  { code: "AR", name: "Accounts Receivable", desc: "Many-to-many receipt matching; withheld tax split from genuine shortfall" },
  { code: "PP", name: "Partner Payouts", desc: "Payout and settlement tested against the partner agreement" },
  { code: "SC", name: "Sales Commissions & Incentives", desc: "Plan-based calculation, validated before the payout is released" },
  { code: "CR", name: "Channel & Distributor Rebates", desc: "Claims re-priced against the terms in force, tested before the credit" },
  { code: "FC", name: "Financial Statement Close", desc: "8 domains · 56 sub-processes · 204 close-blocker indicators" },
] as const;

export const STAGES = ["Acquire & model", "Reconcile, clean & process", "Workflow & report"] as const;

export const DARP_STEPS = [
  { letter: "D", name: "Discover", desc: "Read the whole population out of the systems you run. Read-only." },
  { letter: "A", name: "Assess", desc: "Value every finding and rank it by size and by likelihood of collection." },
  { letter: "R", name: "Recover", desc: "Package the evidence into claims. The cash comes back." },
  { letter: "P", name: "Prevent", desc: "The same rules now run at entry, on every transaction." },
] as const;

export const OUTPUTS = [
  { title: "Recovery reports", sub: "claims and dispute packs" },
  { title: "ERP / ledger", sub: "your system of record", ledger: true },
  { title: "Financial close", sub: "8 domains · 204 indicators" },
] as const;

export const ENGINE_COPY = {
  intro:
    "DataTwin sits between the systems you already run and the ledger they feed. Everything in navy is DataTwin; everything outside it is yours.",
  capPlan: "your systems around the outside · DataTwin between · your ledger at the centre",
  capSection: "your systems at the top · DataTwin between · your ledger at the bottom",
  passed: "Only what passed is recorded",
  ledgerLabel: "Your ledger and reports",
  exceptions: "Exceptions routed to a named owner — during the period, not at the close.",
  trust: "ISO 27001 certified · SOC 2 attested · runs on top of SAP, NetSuite or any ERP, with no migration",
  title: "One engine, two views of the same object",
} as const;
