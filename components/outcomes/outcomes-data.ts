export type OutcomeKey = "cash" | "tax" | "auditor" | "leak" | "headcount" | "close";

export type Outcome = {
  key: OutcomeKey;
  number: string;
  title: string;
  description: string;
};

export const PHASE_ONE_LABEL = "Before you've adopted anything";
export const PHASE_TWO_LABEL = "With observability";

// Order matters: an outcome's position (0-5) is its turn in the one signal that runs 01 -> 02 -> 03 ->
// (observability goes live) -> 04 -> 05 -> 06.
export const PHASE_ONE: readonly Outcome[] = [
  {
    key: "cash",
    number: "01",
    title: "Cash back in the bank",
    description:
      "Overpayments, unapplied credits, discounts never taken and advances never recovered — collected through your existing settlement process.",
  },
  {
    key: "tax",
    number: "02",
    title: "Tax credits claimed while the window is open",
    description:
      "Input credit, reverse charge, withholding at the wrong rate, duty never reclaimed — each one checked against its statutory deadline.",
  },
  {
    key: "auditor",
    number: "03",
    title: "A defensible position for the auditor",
    description:
      "Misstatements corrected by period with the evidence attached, and a restatement pack prepared rather than improvised.",
  },
];

export const PHASE_TWO: readonly Outcome[] = [
  {
    key: "leak",
    number: "04",
    title: "The same leak doesn't reopen",
    description:
      "Every rule that found money in your history runs at transaction entry from then on — instrumented permanently, against goals and standards alike.",
  },
  {
    key: "headcount",
    number: "05",
    title: "Work stops scaling with headcount",
    description:
      "Matching, reconciling, validating and evidencing are handled by the engine — people move to judgment work.",
  },
  {
    key: "close",
    number: "06",
    title: "The close starts from an agreed position",
    description:
      "Balances reconciled continuously as transactions land, so period end begins with the numbers already tied out.",
  },
];
