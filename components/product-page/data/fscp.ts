import type { ProductPageData } from "../product-types";

// FSCP, the Financial Statement Close Process. Wording is carried over unchanged from the existing page; layout is the new design's.

export const fscp: ProductPageData = {
  metadata: {
    title: "FSCP: the Financial Statement Close Process, scored continuously | DataTwin",
    description:
      "Eight domains, 56 sub-processes and 204 close-blocker metrics scored against your period-end close. Every metric declares whether there is a blocker and how severe it is, so the close is worked by exception rather than by checklist.",
  },

  hero: {
    eyebrow: "FSCP",
    lead: ["A close status of 92% complete", "tells nobody what to do next."],
    body: "FSCP is an operating framework for the financial statement close: eight domains, 56 sub-processes and 204 metrics, every one of which answers a single question. Is there a close blocker here, and how severe is it. Not a percentage, not a task list, but a count, a value and a colour that a controller can act on this afternoon.",
    proof: ["Scores your close, does not run it", "Every metric is a blocker, not a statistic", "Read-only on top of the ERP you already run"],
    primary: "Score my last close",
    secondary: { label: "How Discover works", href: "/platform/darp#how-it-works" },
    glyphs: ["bank", "doc", "calendar"],
    out: "register",
  },

  hub: {
    eyebrow: "One close cockpit",
    title: "Eight domains, one close cockpit",
    card: { title: "Eight domains → DataTwin → the register of close blockers", live: "Live process" },
    inputsLabel: "Eight domains, 56 sub-processes",
    inputs: [
      { title: "IC", sub: "28 KPIs" },
      { title: "CF", sub: "28 KPIs" },
      { title: "GA", sub: "39 KPIs" },
      { title: "TF", sub: "20 KPIs" },
      { title: "RC", sub: "33 KPIs" },
      { title: "FP", sub: "24 KPIs" },
      { title: "PC", sub: "15 KPIs" },
      { title: "IR", sub: "17 KPIs" },
    ],
    engine: { title: "DataTwin", sub: "Scores 204 metrics against your close" },
    outputsLabel: "What is blocking this close",
    outputs: [
      { title: "CF — Journals unposted", sub: "14 of 140" },
      { title: "TF — GR/IR unmatched", sub: "82 items" },
      { title: "GA — Accruals not raised", sub: "9 of 61" },
      { title: "IC — Confirmations open", sub: "3 entities" },
      { title: "RC — Sign-offs pending", sub: "clear" },
    ],
    resultLabel: "The dashboard rule",
    result:
      "Show only close blockers: pending, mismatch, difference, breach, missing reference or unresolved approval. Every metric declares whether there is a blocker, and how severe it is.",
    footer:
      "Read-only to start. Nothing changes in your ERP or your close calendar. FSCP runs on the same engine that powers the DARP Framework: acquire, process, govern, report.",
  },

  cards: {
    eyebrow: "The shape",
    title: "The shape of the framework",
    body: "Not a dashboard somebody designed to look busy. A structure with a fixed number of places a close can fail, so the same question is asked of every period and every entity.",
    stat: true,
    items: [
      { tag: "Domains", title: "8", body: "" },
      { tag: "Sub-processes", title: "56", body: "" },
      { tag: "KPI metrics", title: "204", body: "" },
      { tag: "Colour logic", title: "R/O/G", body: "" },
    ],
    linkPrompt: "Browse the 204 metrics",
    link: { label: "Open the catalogue", href: "/products/close-kpi-catalogue" },
  },

  matrix: {
    eyebrow: "Every metric",
    title: "Every metric declares the same six things",
    body: "The base table stays deliberately simple. Percentage, severity and the message a controller reads are all derived from it, which is why a new metric is a new row rather than a new report.",
    columns: ["Column", "What it holds", "Example"],
    rows: [
      ["Domain", "Which of the eight it belongs to", "Core Finance"],
      ["Close process", "The sub-process inside that domain", "General ledger"],
      ["Metric", "The issue being measured, always a blocker", "Journals unposted at close"],
      ["Value", "The pending, differing or breaching amount", "14"],
      ["Total count", "The denominator it is measured against", "140"],
      ["Colour", "Severity, from thresholds you set", "Red"],
    ],
    note: {
      title: "And four things are derived, never entered.",
      body: "Issue percentage is value over total count. Issue exists is value above zero. Severity comes from your thresholds, and the message writes itself: 14 of 140 pending.",
    },
    before: "lanes",
  },

  lanes: {
    eyebrow: "The framework",
    title: "From the design rule to the closes it has changed",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "Design rule",
        title: "The design rule: show only what is blocking the close",
        lead: "Most close dashboards report progress. Progress is a comfort, not an instruction. Every FSCP metric is a blocker measure, so anything showing on the cockpit is something a person has to decide about before the books close.",
        motif: "ranking",
        blocks: [
          {
            icon: "ingest",
            tag: "Capture the blockers",
            title: "Into one cockpit",
            body: "Pending, exception, mismatch, breach and ageing values from every domain brought into one place, at the same grain.",
            points: [
              "Pending items, mismatches, breaches and ageing, in one view",
              "Every domain scored on the same day, on the same basis",
              "Sourced from the systems, not from a status meeting",
            ],
          },
          {
            icon: "kpi",
            tag: "Prioritise by materiality",
            title: "Value, not count alone",
            body: "A count says how many. A value says how much. Together they separate small operational noise from something that will move the statements.",
            points: [
              "Count and value carried on every metric",
              "Small operational issues separated from close-impacting risk",
              "Severity from thresholds you set, not from a fixed scale",
            ],
          },
          {
            icon: "human",
            tag: "Resolve before final close",
            title: "Each colour is a work item",
            body: "Every red and orange becomes a work item for review, approval or correction, with an owner, rather than a line in a report.",
            points: [
              "Each blocker routed to the person who can clear it",
              "Cleared blockers recorded against the period they blocked",
              "What was accepted rather than fixed, and on whose authority",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        eyebrow: "The eight domains",
        label: "Domains",
        title: "The eight domains, and what each one is watching for",
        lead: "Each domain owns a set of sub-processes and a set of blockers. The three listed under each are the headline ones; the full 204 are in the catalogue.",
        motif: "hub",
        blocks: [
          {
            icon: "registry",
            tag: "IC · 7 sub-processes · 28 KPIs",
            title: "Intercompany Finance",
            body: "Eliminate intercompany billing, booking, settlement and confirmation blockers.",
            points: ["Billing and AP booking pending", "Settlement and cash application gaps", "Balance confirmation differences"],
          },
          {
            icon: "accounting",
            tag: "CF · 5 sub-processes · 28 KPIs",
            title: "Core Finance",
            body: "Protect the core books: GL, AP, AR, fixed assets, bank and cash.",
            points: ["Unposted journals and TB differences", "Blocked invoices and overdue AR", "Bank reconciliation gaps"],
          },
          {
            icon: "governance",
            tag: "GA · 13 sub-processes · 39 KPIs",
            title: "GA Close",
            body: "Drive period-end close activities from master data through to P&L review.",
            points: ["Sub-ledger close gaps", "Accruals, provisions and reclass pending", "P&L variance and close task breaches"],
          },
          {
            icon: "recon",
            tag: "TF · 4 sub-processes · 20 KPIs",
            title: "Transaction Finance",
            body: "Control transactional close flows across P2P, O2C, inventory and payroll.",
            points: ["Three-way match and GR/IR exceptions", "Unbilled revenue and billing blocks", "Inventory and payroll posting issues"],
          },
          {
            icon: "wf",
            tag: "RC · 8 sub-processes · 33 KPIs",
            title: "Reporting & Compliance",
            body: "Finalise post-close reports, schedules, controls and the consolidation package.",
            points: ["Reports and schedules pending", "Control evidence and sign-off gaps", "GAAP and elimination entries pending"],
          },
          {
            icon: "elastic",
            tag: "FP · 8 sub-processes · 24 KPIs",
            title: "Financial Planning",
            body: "Close budget, forecast and review cycles with approved management inputs.",
            points: ["Budget inputs and approvals pending", "Variance explanations open", "Forecast accuracy and margin gaps"],
          },
          {
            icon: "kpi",
            tag: "PC · 3 sub-processes · 15 KPIs",
            title: "Planning & Control",
            body: "Validate cost, profit-centre and FP&A control views before management close.",
            points: ["Unallocated costs and mapping errors", "Profit-centre loss alerts", "MIS packs and actions open"],
          },
          {
            icon: "risk",
            tag: "IR · 8 sub-processes · 17 KPIs",
            title: "Intelligence & Risk",
            body: "Surface anomalies, recovery opportunities and audit-trail risks early.",
            points: ["Critical anomalies detected", "Recovery actions pending", "Manual touch and unauthorised changes"],
          },
        ],
        link: { label: "The full 204-metric catalogue", href: "/products/close-kpi-catalogue" },
      },
      {
        id: "lane-3",
        n: "3",
        eyebrow: "The same four stages",
        label: "DARP",
        title: "The same four stages the rest of the platform runs on",
        lead: "FSCP is not a separate system with its own logic. It is the DARP Framework pointed at the close, which is why the rules that recovered money in Discover are the rules that score the close in Prevent.",
        motif: "flow",
        compact: true,
        blocks: [
          { icon: "ingest", tag: "1 · Discover", body: "Ingest, cleanse and harmonise across every stream. Detect anomalies, quantify exposure and rank by materiality." },
          { icon: "recon", tag: "2 · Assess", body: "Connect ERP, bank, operations and partner silos. Attribute root cause and separate systemic from one-off." },
          { icon: "remediation", tag: "3 · Recover", body: "Route exceptions to accountable owners. Corrections, holds and adjustments in flight, with confirmation logged." },
          { icon: "risk", tag: "4 · Prevent", body: "Control redesign, early-warning signals and board-ready narratives, looping back into Discover." },
        ],
        callout: {
          tag: "Where AI is used here, and where it is not.",
          body: "AI reads documents, detects anomalies, attributes root cause and writes the narrative. Deterministic rules decide every threshold, every severity and everything that posts to the books. Nothing posts because a model was confident.",
        },
        link: { label: "How the DARP Framework works", href: "/platform/darp" },
      },
      {
        id: "lane-4",
        n: "4",
        eyebrow: "Worked closes",
        label: "Worked closes",
        title: "Three closes, and what actually changed",
        lead: "These are engagements, described without naming the customers. The context matters more than the headline: a number without the shape of the business behind it is not evidence.",
        motif: "bars",
        blocks: [
          {
            icon: "accounting",
            tag: "Accounts payable",
            title: "Two entities, 25+ locations",
            body: "Over 5,000 invoices a month on SAP S/4HANA, half PO-linked. Discrepancies took four to five days to resolve; the AP close took five to seven.",
            points: [
              "Three-way reconciliation across invoice, PO or contract, and receipt",
              "Audit checklist run against every invoice, not a sample",
              "Prepaid, provision reversal and period-end accounting automated",
            ],
          },
          {
            icon: "recon",
            tag: "Accounts receivable",
            title: "20+ entities, 200+ locations",
            body: "Collections split across gateways, bank deposits, UPI and cash. Matching 20,000 enrolments a month to sales made AR close a ten-day job.",
            points: [
              "Screenshots, statements and gateway reports read into one pipeline",
              "Match codes for each settlement scenario, across dimensions",
              "End-to-end collection reconciliation and revenue recognition",
            ],
          },
          {
            icon: "elastic",
            tag: "Inventory",
            title: "Multi-plant manufacturer",
            body: "Matching stock movements to GL balances across plants took five to eight days by hand, and provisions lacked the evidence to sign off.",
            points: [
              "Opening plus receipts less issues plus corrections, against the GL",
              "Ageing and policy-based provision, trued up material by material",
              "Routing across store keeper, material owner, cost accountant, controller",
            ],
          },
        ],
        callout: {
          tag: "What these three have in common.",
          body: "None of them started with new software in the transaction path. Each started by rebuilding the reconciliation on history that already existed, which is what made the close time fall. The cycle-time figures are the customers’ own, measured before and after.",
        },
      },
    ],
  },

  start: {
    eyebrow: "Start here",
    title: "Before you adopt it, we score a close you have already done",
    body: "FSCP is prevention, and prevention is a promise about the future. The way to test a promise like that is to point it backwards first, at a close you already signed, and see what it would have flagged.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us the close data for a period you have already closed. We score all 204 metrics across the full population, not a sample, and come back with the blockers that were live at the time and what they were worth. Before any contract.",
    flow: ["The close data", "A period already closed", "All 204 metrics scored", "The blockers that were live, and what they were worth"],
    items: [
      { kind: "control", title: "What was red", body: "The blockers live on the day you signed, each with its count, value and denominator." },
      { kind: "clock", title: "What was missed", body: "Items that cleared after the close rather than before it, and the periods they should have landed in." },
      { kind: "misstated", title: "What repeats", body: "Exceptions across three consecutive closes, where a control is missing rather than a task." },
      { kind: "cash", title: "What it costs", body: "The days spent on tasks a metric would have caught, and where the close calendar actually breaks." },
    ],
    note: "The framework runs the same way for manufacturing, distribution, retail, edtech, pharma and multi-entity groups. The thresholds are yours; the 204 questions are the same.",
    cta: "Score my last close",
    link: { label: "See all 204 metrics", href: "/products/close-kpi-catalogue" },
  },
};
