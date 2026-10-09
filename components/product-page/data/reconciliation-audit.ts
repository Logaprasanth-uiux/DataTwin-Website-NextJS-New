import type { ProductPageData } from "../product-types";

// Reconciliation & Audit. Wording is carried over unchanged from the existing page; layout is the new design's.

export const reconciliationAudit: ProductPageData = {
  metadata: {
    title: "Reconciliation and Audit: two-way to N-way, continuously | DataTwin",
    description:
      "Any two sides, at any grain, with tolerance and fuzzy matching, many-to-many resolution, a reason on every difference and sign-off recorded against the period. Full population rather than a sample, with every match carrying the document that supports it.",
  },

  hero: {
    eyebrow: "Reconciliation & Audit",
    lead: ["Most tools match two things.", "Finance problems rarely have two sides."],
    body: "An invoice against a purchase order against a receipt against a contract price. A claim against point-of-sale against inventory against an agreement. DataTwin reconciles N-way at whatever grain the question needs, with tolerance rules and fuzzy matching where identifiers disagree across systems, and every match carries the document that supports it. The result is auditable rather than asserted, which matters more than the match rate the moment somebody challenges it.",
    proof: ["Two-way through N-way, at line, header or balance", "Full population rather than a sample", "Every match linked to the document behind it"],
    primary: "See what is not reconciling",
    secondary: { label: "How Discover works", href: "/platform/darp#how-it-works" },
    glyphs: ["bank", "doc", "receipt"],
    out: "register",
  },

  hub: {
    eyebrow: "Any two sides, one exception register",
    title: "Whatever the two sides are",
    card: { title: "Any two sides, matched N-way", live: "Live process" },
    inputsLabel: "Whatever the two sides are",
    inputs: [
      { title: "Your ledgers", sub: "GL, sub-ledgers, entities" },
      { title: "Counterparty statements", sub: "Banks, vendors, customers, portals" },
      { title: "Operational systems", sub: "Billing, WMS, CRM, payroll, gateways" },
      { title: "The documents", sub: "Contracts, POs, GRNs, certificates" },
    ],
    engine: { title: "DataTwin", sub: "Matches N-way, then names what did not match" },
    outputsLabel: "One exception register",
    outputs: [
      { title: "Bank vs book — Credit, no entry", sub: "Unidentified receipt · 4d · open" },
      { title: "Invoice vs GRN — Qty billed above", sub: "Short receipt · 11d · open" },
      { title: "Intercompany — One-sided entry", sub: "Not booked by counter · 31d · aged" },
      { title: "GL vs sub-ledger — Control account", sub: "Manual journal · 2d · explained" },
      { title: "Payroll vs GL — Net pay", sub: "Matches · 0d · clean" },
    ],
    resultLabel: "Why this matters",
    result:
      "A reconciliation that produces a number is half a reconciliation. The half that matters is the list of differences, each with a reason, an age and somebody’s name against it.",
    footer:
      "Read-only to start — nothing changes in your ledgers or your source systems. Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
  },

  cards: {
    eyebrow: "The engine",
    title: "Every reconciliation is the same seven questions",
    body: "Bank against book and invoice against receipt feel like different jobs. They are the same seven decisions with different sources, which is why they run on one engine rather than on a tool for each and a spreadsheet for the rest.",
    items: [
      { tag: "01 · The two sides", title: "What is being compared", body: "Two systems, or four. A ledger against a statement, or an invoice against a PO against a receipt against a contract." },
      { tag: "02 · The grain", title: "At what level do they meet", body: "Line, header, batch or balance. Most failed reconciliations are two sides compared at different grains." },
      { tag: "03 · The key", title: "What makes a pair a pair", body: "A reference, or an amount and a date, or a name that is spelled differently in each system." },
      { tag: "04 · The tolerance", title: "When is a difference a difference", body: "Rounding, exchange rates and fees mean exact equality is often the wrong test." },
      { tag: "05 · The timing", title: "When should they agree", body: "Cut-off, settlement cycles and in-transit items make a real difference look like an error." },
      { tag: "06 · The reason", title: "Why did this one not match", body: "A difference without a reason is a to-do. A difference with a reason is either resolved or accepted." },
      { tag: "07 · The sign-off", title: "Who says it is right", body: "Preparer, reviewer, date. A reconciliation nobody owns is not a control, whatever the match rate." },
    ],
    outcome: {
      tag: "The outcome",
      title: "A position somebody stands behind",
      body: "Seven answers turn a matching exercise into a control, on the engine every DataTwin product runs on.",
    },
  },

  lanes: {
    eyebrow: "The reconciliation",
    title: "From two sides to a position",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "Same shape",
        title: "Getting both sides into the same shape is most of the work",
        lead: "Reconciliation projects rarely fail at matching. They fail earlier, because one side is a PDF, the other is an export nobody can schedule, and the identifier that should join them was truncated by a system in between.",
        motif: "converge",
        blocks: [
          {
            icon: "ingest",
            tag: "Whatever shape it arrives in",
            title: "Feed, file or document",
            body: "Direct connections, scheduled extracts, portal downloads, statements and scanned documents all land in the same pipeline.",
            points: [
              "ERP, banking, gateway, billing and operational systems",
              "Statements and confirmations read as data, not filed as PDFs",
              "The original kept as evidence for the match it supports",
            ],
          },
          {
            icon: "hygiene",
            tag: "Normalised",
            title: "One shape, many systems",
            body: "Dates, currencies, entity codes and identifiers brought to one form so two sides can be compared without a manual clean-up first.",
            points: [
              "Multi-entity, multi-currency and multi-book handled together",
              "Identifiers repaired where a system truncated or reformatted them",
              "Reference data mapped once and reused by every reconciliation",
            ],
          },
          {
            icon: "kpi",
            tag: "At the right grain",
            title: "Line, header or balance",
            body: "Two sides compared at the level the question needs. Comparing a line-level source to a header-level one is why reconciliations never close.",
            points: [
              "Line, header, batch or balance, set per reconciliation",
              "Aggregation applied deliberately rather than by accident",
              "Both sides held at their native grain as well as the compared one",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        label: "Matching",
        title: "Then the matching, which is not usually one to one",
        lead: "One receipt settles seven invoices. One bank credit covers three gateway batches. One invoice spans two purchase orders. Any tool can match a reference to a reference; the work is in everything that is not that.",
        motif: "split",
        blocks: [
          {
            icon: "recon",
            tag: "One to many, many to many",
            title: "Resolved, not deferred",
            body: "Split settlements, batch payments and part-deliveries resolved into the set of records they actually cover.",
            points: [
              "One-to-many and many-to-many sets resolved explicitly",
              "Split and batch settlements unbundled to their components",
              "Partial matches cleared to the part they settle, not left whole",
            ],
          },
          {
            icon: "governance",
            tag: "Tolerance",
            title: "When close enough is correct",
            body: "Rounding, bank charges, exchange differences and agreed variances treated as tolerances rather than exceptions, with the rule visible.",
            points: [
              "Tolerance by value, percentage or both, per reconciliation",
              "Charges and exchange differences classified, not absorbed",
              "What was matched within tolerance shown, never hidden",
            ],
          },
          {
            icon: "registry",
            tag: "Fuzzy, where it has to be",
            title: "Names never agree",
            body: "Where identifiers differ across systems, matching uses names, amounts and dates together, and records why each match was made.",
            points: [
              "Party name variants resolved to one counterparty",
              "Amount, date and narration used together where no key exists",
              "Every fuzzy match carrying its confidence and its reason",
            ],
          },
        ],
      },
      {
        id: "lane-3",
        n: "3",
        label: "Exceptions",
        title: "The unmatched list is the product, not the leftovers",
        lead: "A reconciliation that ends with a number and a pile of unmatched items has moved the work rather than done it. Each difference needs a reason, an owner and an age, or it will be the same difference next month.",
        motif: "register",
        blocks: [
          {
            icon: "investigation",
            tag: "A reason on every line",
            title: "Classified, not listed",
            body: "Differences classified into timing, error, omission, dispute and unidentified, so the list can be worked by cause instead of read top to bottom.",
            points: [
              "Timing differences separated from genuine breaks",
              "Root cause attached, so the same break stops recurring",
              "Unidentified items named as unidentified, not netted away",
            ],
          },
          {
            icon: "kpi",
            tag: "Aged",
            title: "A break gets older, not better",
            body: "Every open difference carries its age, so a two-day item and a two-year item are never presented as the same problem.",
            points: [
              "Ageing by reconciliation, counterparty and reason",
              "Items past a threshold escalated rather than carried forward",
              "What was written off, and on whose authority",
            ],
          },
          {
            icon: "human",
            tag: "Owned",
            title: "Somebody is working it",
            body: "Each break is assigned, worked and closed with a note, so the reconciliation is a live control rather than a monthly report.",
            points: [
              "Assignment, action and closure recorded against the item",
              "Correspondence and evidence attached to the break itself",
              "What is genuinely irrecoverable separated from what is late",
            ],
          },
        ],
      },
      {
        id: "lane-4",
        n: "4",
        label: "Audit",
        title: "And the audit changes shape, because the population is already tested",
        lead: "Sampling exists because testing everything by hand is impossible. Once every transaction has already been tested and the evidence is attached to it, the argument for a sample is weaker, and the conversation with your auditor gets shorter.",
        motif: "checklist",
        blocks: [
          {
            icon: "risk",
            tag: "Full population",
            title: "Rates, not instances",
            body: "Testing everything reports a rate rather than a handful of findings, which is a different and more useful conversation with a board.",
            points: [
              "Every transaction tested, not a judgemental selection",
              "Exceptions reported as a rate across the population",
              "Thousands of items below materiality that add up, surfaced",
            ],
          },
          {
            icon: "hygiene",
            tag: "Evidence attached",
            title: "As it happens",
            body: "The document that supports a match is held against the match, so testing is a read rather than a document request.",
            points: [
              "Every match linked to the record that supports it",
              "A complete trail from source record to posted entry",
              "Sample requests answered without a new extraction",
            ],
          },
          {
            icon: "learning",
            tag: "Continuous, not periodic",
            title: "Controls that run",
            body: "Reconciliations and control checks run on a schedule rather than at period end, so a failure is found in the week it happens.",
            points: [
              "Control checks run continuously, not as a close task",
              "Breaks escalated on age rather than discovered at close",
              "The same evidence serves internal and statutory audit",
            ],
          },
        ],
      },
    ],
  },

  matrix: {
    eyebrow: "In practice",
    title: "What people actually reconcile",
    body: "This is not a fixed list of supported reconciliations. It is the set we see most often. A new one is a new configuration of the seven questions above, not a new product.",
    columns: ["Reconciliation", "One side", "The other side", "What it catches"],
    rows: [
      ["Bank to book", "Bank statements, all accounts", "Cash book and GL", "Unidentified receipts, unpresented items, charges never booked"],
      ["Gateway settlement", "Settlement files", "Orders and bank credits", "Fees above the agreed rate, refunds and chargebacks never traced"],
      ["Invoice to PO to GRN", "Vendor invoice lines", "Order and receipt", "Billed above ordered or received, price and quantity breaks"],
      ["Receipt to invoice", "Customer receipts", "Open invoices", "Unapplied cash, short payments with no deduction behind them"],
      ["GL to sub-ledger", "Control accounts", "AP, AR, fixed assets, stock", "Manual journals to control accounts, and balances that stopped agreeing"],
      ["Intercompany", "Entity A books", "Entity B books", "One-sided entries, mismatched amounts, unagreed balances at close"],
      ["Inventory", "Physical and WMS", "Stock ledger", "Shrinkage, goods in transit, receipts booked but never accrued"],
      ["Payroll", "Payroll register", "GL and bank", "Net pay differences, statutory deductions never deposited"],
      ["Revenue", "Billing system", "Revenue and deferred balances", "Unbilled and deferred that never rolled forward, cut-off errors"],
      ["Tax", "Registers and returns", "Ledger and counterparty filings", "Credit at risk, credit unclaimed, exposure from wrong treatment"],
      ["Claims and programmes", "Claims and agreements", "Sales, POS and settlements", "Unclaimed and short-paid claims, and claims about to age out"],
      ["Payouts and commissions", "Scheme or plan rows", "Volume, bookings and payments", "Wrong band applied, overlapping schemes, guarantees topped up twice"],
    ],
    note: {
      title: "Not a fixed catalogue.",
      body: "If you can describe the two sides, the grain and what counts as a difference, it can be configured. That is the whole argument for one engine rather than a tool per reconciliation: the eleventh one costs what the first one cost, and no less, but it does not wait for a release.",
    },
  },

  prevent: {
    eyebrow: "Prevent",
    title: "Then it stops being a month-end exercise",
    body: "Prevent is not a second build. The reconciliations that found your history are the reconciliations that run every night. That is where a one-off clean-up starts compounding.",
    steps: [
      { n: "1", title: "Configured", body: "The two sides, the grain, the key and the tolerance agreed once, per reconciliation." },
      { n: "2", title: "Run on schedule", body: "Nightly or intraday, so a break is days old rather than a month old." },
      { n: "3", title: "Classified", body: "Every difference given a reason and an owner as it appears." },
      { n: "4", title: "Escalated", body: "Age and value drive escalation, rather than somebody remembering at close." },
      { n: "5", title: "Signed off", body: "Preparer and reviewer recorded against the period, with the evidence attached." },
    ],
    link: { label: "How Recover becomes Prevent", href: "/platform/darp#how-it-works" },
  },

  changes: {
    eyebrow: "What changes",
    title: "What changes, honestly stated",
    body: "Not a longer list of features. A different distribution of who does what, and when a difference is found.",
    columns: { point: "Where it shows", today: "How reconciliation runs today", datatwin: "How it runs on DataTwin" },
    rows: [
      { point: "When it runs", today: "At period end, on the days there is least time for it", datatwin: "On a schedule, so a break is found in the week it happens" },
      { point: "How many sides", today: "Two, because that is what the tool does", datatwin: "As many as the question needs, at the grain it needs" },
      { point: "The hard matches", today: "Left unmatched, or forced through so the total agrees", datatwin: "Many-to-many resolved, with tolerance and fuzzy matching recorded" },
      { point: "The unmatched list", today: "A pile that gets carried forward", datatwin: "Classified by reason, aged, owned and escalated" },
      { point: "Evidence", today: "Found again each time somebody asks", datatwin: "Attached to the match when the match was made" },
      { point: "A new reconciliation", today: "A new spreadsheet, and a person who now maintains it", datatwin: "A new configuration of the same seven questions" },
      { point: "Audit", today: "A sample, tested after the event", datatwin: "Full population, tested as it happens" },
    ],
  },

  start: {
    eyebrow: "Start here",
    title: "Before you change anything, find out what it has already cost you",
    body: "Everything above is prevention; it stops the next month breaking. It does nothing about the differences already sitting in your ledgers, some of them for years. So we start there, read-only, before there is anything to sign.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us the two sides of whichever reconciliation worries you most. We test the full transaction population, not a sample, and come back with what is recoverable and what is merely unexplained, split by heading. Before any contract.",
    flow: ["One side", "The other side", "Full population tested", "What is recoverable and what is merely unexplained"],
    items: [
      { kind: "cash", title: "Money to collect", body: "Receipts never applied, credits never taken, claims never raised, balances owed and never chased." },
      { kind: "apart", title: "Money paid out", body: "Duplicate and over-payments, charges above the agreed rate, deductions never netted." },
      { kind: "misstated", title: "Entries that are wrong", body: "Control accounts that stopped agreeing, one-sided intercompany, accruals never reversed." },
      { kind: "control", title: "Control gaps", body: "Why the first three keep happening: recs nobody owns, breaks nobody ages, sign-off nobody records." },
    ],
    note: "The same engine reconciles for manufacturing, distribution, retail, logistics, pharma, financial services and multi-entity groups. If you can describe the two sides, it can be configured.",
    cta: "Get an estimate",
    link: { label: "How Discover works", href: "/platform/darp#how-it-works" },
  },
};
