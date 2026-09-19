export type SolutionKey =
  | "ap"
  | "ar"
  | "tax"
  | "rebates"
  | "payouts"
  | "commissions";

export type SolutionItem = {
  key: SolutionKey;
  title: string;
  description: string;
};

export type SolutionCategory = {
  label: string;
  items: readonly SolutionItem[];
};

// Order matters: the position across both categories (0-5) is the process's "slot" in the
// engine's one-at-a-time cycle, so the animation visits Core first, then Rebates.
export const SOLUTION_CATEGORIES: readonly [SolutionCategory, SolutionCategory] = [
  {
    label: "Core finance operations",
    items: [
      {
        key: "ap",
        title: "Accounts Payable",
        description:
          "Touchless capture, N-way matching, duplicate and overpayment prevention. Approvals that don't stall, accounting treatment validated.",
      },
      {
        key: "ar",
        title: "Accounts Receivable",
        description:
          "Automated billing, cash application, deductions and disputes, risk-ranked collections, revenue in the right period.",
      },
      {
        key: "tax",
        title: "Taxation Reconciliation",
        description:
          "Returns, input credits, withholding and ledgers reconciled against the books. Differences corrected before filing, not after a notice.",
      },
    ],
  },
  {
    label: "Rebates, incentives & payouts",
    items: [
      {
        key: "rebates",
        title: "Channel Rebates",
        description:
          "Validating each claim from the distributor, be it ship & debit or any other scheme, against distributor data, the contract and our own.",
      },
      {
        key: "payouts",
        title: "Partner Payouts",
        description:
          "Reseller, affiliate, franchise and referral payouts recalculated from the agreement and validated against source activity.",
      },
      {
        key: "commissions",
        title: "Sales Commissions & Incentives",
        description:
          "Plans calculated from booked and collected revenue. Clawbacks, adjustments and accruals with statements that survive a query.",
      },
    ],
  },
];

export const MORE_USE_CASES = [
  "Fixed asset accounting",
  "Inter-company reconciliation",
  "Bank reconciliation",
  "GRNI & accrual ageing",
  "Expense & T&E",
  "Payroll reconciliation",
  "Freight & logistics billing",
  "Subscription & usage billing",
  "Royalty accounting",
  "Franchise fees",
  "Warranty claims",
  "Trade spend & co-op",
  "Price protection",
  "Stock rotation",
  "Deposits & retentions",
  "Import duty & drawback",
  "Marketplace settlements",
  "Loyalty & points liability",
  "Vendor master hygiene",
  "Statutory returns",
] as const;
