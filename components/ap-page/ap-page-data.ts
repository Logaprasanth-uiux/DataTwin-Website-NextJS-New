// Copy for the Accounts Payable page (/products/accounts-payable). Sections read from here so wording is edited in one place.

import type { AiIconName } from "@/components/ai-page/AiArt";

export const HERO = {
  eyebrow: "Accounts Payable",
  lead: ["Invoices arrive as documents.", "They should land as correct entries."],
  body: "DataTwin takes the invoice from the inbox, reads it, matches it to the purchase order and receipt already in your ERP, runs it through your own control checklist, routes it for approval and posts it, then reads back the journal the ERP created and checks it against the entry it expected. After that it builds the payment run, generates the bank file, and clears the prepaids and provisions before the period ends.",
  proof: ["Sits above the ERP you already run", "Read-only until you turn posting on", "Your approval matrix, unchanged"],
  primary: "See what AP has cost you",
  secondary: { label: "How Discover works", href: "/platform/darp#how-it-works" },
} as const;

// ---- One invoice, end to end (the lifecycle picture) -------------------------------------------------------------

export type LifeNode = { title: string; sub: string; href: string; end?: boolean };

export const LIFE = {
  eyebrow: "One invoice, end to end",
  title: "Three phases, one engine underneath",
  card: { title: "The invoice lifecycle", live: "Live process" },
  phases: [
    {
      n: "01",
      title: "Invoice to bill",
      nodes: [
        { title: "Inbox", sub: "Email, SFTP, portal", href: "#gate-1" },
        { title: "Extraction", sub: "Every field read", href: "#gate-1" },
        { title: "Mapping", sub: "Vendor, PO, GRN", href: "#gate-2" },
        { title: "Matching", sub: "2-way and 3-way", href: "#gate-2" },
        { title: "Validation", sub: "Rules, tax, cost", href: "#gate-3" },
        { title: "Approval", sub: "Your matrix, limits", href: "#gate-4" },
        { title: "Post to ERP", sub: "Bill accounted", href: "#gate-5", end: true },
      ],
      banner: {
        label: "Journal check:",
        body: "every entry the ERP posts is compared, in real time, against the entry we expected at validation. Differences are raised the same day.",
      },
    },
    {
      n: "02",
      title: "Bill to payment",
      nodes: [
        { title: "Payment sheet", sub: "Built from due dates", href: "#bill-to-payment" },
        { title: "Prioritisation", sub: "Overdue, discounts, holds", href: "#bill-to-payment" },
        { title: "Approval", sub: "Workflow and limits", href: "#bill-to-payment" },
        { title: "Payment file", sub: "Per bank, per method", href: "#bill-to-payment" },
        { title: "Payment posted", sub: "Accounted back in the ERP", href: "#bill-to-payment", end: true },
      ],
      note: "Nothing pays itself. The run is built for you; a person releases it.",
    },
    {
      n: "03",
      title: "Month end",
      nodes: [
        { title: "Prepaid amortisation", sub: "Scheduled when the bill was validated", href: "#month-end" },
        { title: "Provision management", sub: "Reversed on arrival, restored on cancellation", href: "#month-end" },
        { title: "Cost allocation", sub: "Static or driver-based, reversed with the entry", href: "#month-end" },
      ],
      note: "Decided when the invoice was validated, so the period end is a read rather than a rebuild.",
    },
  ] as readonly {
    n: string;
    title: string;
    nodes: readonly LifeNode[];
    banner?: { label: string; body: string };
    note?: string;
  }[],
  footer:
    "Read-only until you turn posting on — nothing migrates out of your ERP. Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
} as const;

// ---- Invoice to bill, gate by gate -------------------------------------------------------------------------------

export type Block = { icon?: AiIconName; tag: string; title?: string; body: string; points?: readonly string[] };

export type Gate = {
  id: string;
  n: string;
  label: string;
  title: string;
  lead: string;
  art: 1 | 2 | 3 | 4 | 5;
  blocks: readonly Block[];
  compact?: boolean;
  callout?: { tag: string; title: string; body: string };
  link?: { label: string; href: string };
};

export const GATES = {
  eyebrow: "Invoice to bill, gate by gate",
  title: "Five checks between a document and an entry",
  items: [
    {
      id: "gate-1",
      n: "1",
      label: "Arrive",
      title: "It arrives however the vendor chose to send it",
      lead: "Invoices do not turn up in one format. They come as PDFs attached to an email, scans dropped on a shared folder, photographs taken on a phone, one attachment containing three separate invoices, and occasionally something handwritten. The inbox takes all of it, and keeps the original as evidence.",
      art: 1,
      blocks: [
        {
          icon: "ingest",
          tag: "Ingest",
          title: "One queue, every channel",
          body: "Mailbox, SFTP, shared folder or vendor upload. One queue, with sender, timestamp and the original kept.",
          points: [
            "Monitored email inbox, with the covering message kept alongside the invoice",
            "SFTP and shared-folder collection on a schedule you set",
            "Vendor portal upload, so the vendor files it rather than emailing your team",
          ],
        },
        {
          icon: "kpi",
          tag: "Extraction",
          title: "Read, not retyped",
          body: "Header and line-level fields read off the document, from number and date to rate, tax and total. Models tuned to your formats.",
          points: [
            "Multi-page documents and multi-invoice attachments split correctly",
            "Multilingual and handwritten documents handled in the same pipeline",
            "Every field confidence-scored; low confidence goes to a person, not into the ledger",
          ],
        },
        {
          icon: "hygiene",
          tag: "Hygiene",
          title: "Duplicates stopped at the door",
          body: "Before a bill exists, the document is tested against everything already received, by reference, checksum, vendor and amount, or channel.",
          points: [
            "Reference, checksum and near-duplicate matching across entities and periods",
            "One invoice arriving by both email and portal recognised as one invoice",
            "Documents classified: invoice, credit note, debit note, statement, contract",
          ],
        },
      ],
      link: { label: "How the extraction models work", href: "/platform/how-ai-is-used#engines" },
    },
    {
      id: "gate-2",
      n: "2",
      label: "Match",
      title: "It is matched against what your ERP already knows",
      lead: "An invoice on its own is a claim. It becomes a bill when it agrees with something you already committed to. DataTwin reads the open purchase orders, goods receipts, service entry sheets, vendor master and item master out of your ERP, links the invoice to the right ones, and tests them line by line.",
      art: 2,
      blocks: [
        {
          icon: "registry",
          tag: "Mapping",
          title: "Linked to the right record",
          body: "Linked automatically to the vendor, order, receipt, item, contract and entity, wherever the data allows.",
          points: [
            "Vendor resolved from name, tax registration and bank details, not just a quoted code",
            "Item resolved from description and classification code where no item code is given",
            "The governing contract or agreement attached to the invoice it prices",
          ],
        },
        {
          icon: "recon",
          tag: "Matching",
          title: "Two-way and three-way, by line",
          body: "Order against receipt against invoice, by line. A total can agree while every line under it is wrong.",
          points: [
            "Two-way for services and expenses, three-way wherever a receipt exists",
            "Price, quantity and unit-of-measure variances separated rather than lumped together",
            "Tolerances applied by vendor, category or value band, as your policy defines them",
          ],
        },
        {
          icon: "investigation",
          tag: "Root cause",
          title: "Classified, not just flagged",
          body: "Every mismatch is tagged with what caused it, so it routes to whoever can resolve it.",
          points: [
            "Rate error, quantity variance, missing receipt and wrong tax code each tagged distinctly",
            "A missing receipt is chased with the receiver, not sent back to the vendor",
            "Price differences traced to the contract clause that governs them",
          ],
        },
      ],
    },
    {
      id: "gate-3",
      n: "3",
      label: "Validate",
      title: "It is checked against your rules, not generic ones",
      lead: "Matching proves the invoice agrees with the order. Validation proves the bill is right to book. This is where your own internal checklist runs, the one currently living in a spreadsheet, or in the head of the person who has been doing this for eleven years.",
      art: 3,
      compact: true,
      blocks: [
        { icon: "governance", tag: "Internal checklist", body: "Your own control checklist, run on every transaction rather than a sample, with the result recorded before posting." },
        { icon: "wf", tag: "Tax validation", body: "Registration confirmed active, rate and calculation re-performed, reverse charge and withholding applied, credit eligibility checked against supplier filings." },
        { icon: "remediation", tag: "Provision reversal", body: "Any existing provision is reversed as the bill is created, and put back with its allocated cost if the bill is cancelled." },
        { icon: "elastic", tag: "Cost allocation", body: "Split across entity, line of business and cost centre by rule or by a driver from the invoice. It reverses with the entry." },
        { icon: "accounting", tag: "Prepaid treatment", body: "The amortisation schedule is built at validation, so month-end releases the right amount without rebuilding it." },
        { icon: "learning", tag: "Foreign currency", body: "Rate applied under your policy. Differences across invoice, receipt and payment dates are recognised, not absorbed." },
      ],
      callout: {
        tag: "Why this matters for gate 5",
        title: "By the end of validation, DataTwin knows what the entry should be",
        body: "It holds that entry in full before the ERP posts anything. Nothing is booked because a model felt confident: the entry comes from rules in the schema, so the same invoice always produces the same entry. That is what lets us check the ERP.",
      },
    },
    {
      id: "gate-4",
      n: "4",
      label: "Approve",
      title: "It goes to the people who should see it",
      lead: "Approval is rarely one step. Different invoices need different people, sometimes in sequence because the second approver needs the first one’s decision, sometimes at the same time because they do not.",
      art: 4,
      blocks: [
        {
          icon: "escalate",
          tag: "Routing",
          title: "Serial, parallel or both",
          body: "Routed by value band, cost centre, category, entity or vendor risk, in sequence or in parallel as the case needs.",
          points: [
            "Your existing approval matrix and delegation limits, not a new one",
            "Parallel approvals collected at once rather than queued behind each other",
            "Out-of-office delegation and escalation after a defined wait",
          ],
        },
        {
          icon: "guidance",
          tag: "What the approver sees",
          title: "Context, not a queue",
          body: "Invoice, order, receipt, variances with causes, checklist result and the entry to be posted. No other system needed.",
          points: [
            "The original document, always one click away",
            "Variances explained, not just highlighted",
            "The proposed accounting entry, before it exists in the ERP",
          ],
        },
        {
          icon: "human",
          tag: "Human-in-the-loop",
          title: "One of six control gates",
          body: "One of six places a person is asked to act. The others: a missing input, a correction, an arbitration, an escalation, a policy fix.",
          points: [
            "Every human decision logged next to the agent action that preceded it",
            "Overrides recorded with a reason, and used to improve the rule",
            "An accountability trail that reads the same to you and to your auditor",
          ],
        },
      ],
      link: { label: "Where a person is always in the loop", href: "/platform/how-ai-is-used#human-in-the-loop" },
    },
    {
      id: "gate-5",
      n: "5",
      label: "Post & check",
      title: "It posts, and then the posting itself is checked",
      lead: "Approved bills go into the ERP, and the ERP does its own accounting. Almost every AP tool stops there.",
      art: 5,
      blocks: [
        {
          icon: "risk",
          tag: "Real-time accounting validation",
          title: "The ERP posts a journal. We already knew what it should say.",
          body: "DataTwin reads back the journal the ERP created and compares it line by line against the entry it computed at validation. Differences are raised the same day, not at quarter end or by an auditor a year later.",
          points: [
            "Account, cost centre, tax code, currency and amount each tested independently",
            "Configuration drift in the ERP surfaced by the entries it starts producing",
            "Every comparison retained as evidence, attached to the invoice that started it",
          ],
        },
      ],
      link: { label: "The engine underneath this", href: "/platform/how-ai-is-used#architecture" },
    },
  ] satisfies readonly Gate[],
} as const;

// ---- Bill to payment ---------------------------------------------------------------------------------------------

export const PAY = {
  eyebrow: "Bill to payment",
  title: "Then the money goes out on your terms",
  body: "A payment run should be decided by due dates and discounts, not by which vendor called this morning. The run is built for you; you decide what leaves.",
  steps: [
    { n: "1", title: "Payment sheet", body: "Built from due dates across every entity and bank. Everything falling due in the window, with what is already overdue separated rather than buried in it." },
    { n: "2", title: "Prioritisation", body: "Early-payment discounts flagged with what each one is worth and the date it expires, so taking a discount becomes a decision rather than a deadline you missed." },
    { n: "3", title: "Selection & approval", body: "You choose what goes out. Disputes and holds are excluded automatically, and the approval workflow runs on the payment run itself, not only on the invoices inside it." },
    { n: "4", title: "Payment file", body: "Generated in the format the receiving bank and payment method require, per entity and per account, with the vendor’s validated bank details rather than whatever was in the last email." },
    { n: "5", title: "Payment accounted", body: "Once the payment is made it goes back to the ERP as an accounted payment, applied against the right bills, and that journal is checked the same way the bill’s was." },
  ],
  callout: {
    tag: "Worth knowing before you start",
    title: "Discounts you did not take are already on the table",
    body: "Early-payment discounts that lapsed, invoices paid twice, amounts paid above the contracted price, credit notes never applied. All of it is sitting in the history you already hold. Discover values it before any of this is switched on, and before there is anything to sign.",
    link: { label: "How the DARP Framework values it", href: "/platform/darp#finds" },
  },
} as const;

// ---- Month end ---------------------------------------------------------------------------------------------------

export const MONTH = {
  eyebrow: "Month end",
  title: "By the time the period ends, most of the close is behind you",
  body: "Month-end in payables is usually a rebuild: reconstructing prepaid schedules, working out which provisions to reverse, re-cutting allocations in a spreadsheet. None of that is new information; it was all decided when the invoice was validated. So it is done then.",
  items: [
    {
      kind: "amort",
      tag: "Prepaid amortisation",
      title: "Scheduled at bill time",
      body: "Built at validation from the period the invoice covers. Each period releases its slice, and the balance always reconciles.",
      points: [
        "Coverage period read from the invoice or the contract, not keyed by hand",
        "Part periods and mid-month starts handled properly",
        "Early termination or cancellation adjusts the remaining schedule",
      ],
    },
    {
      kind: "provision",
      tag: "Provision management",
      title: "Raised and released on evidence",
      body: "Raised where goods arrived without an invoice, reversed when it lands, restored if cancelled. GRNI stops being a balance nobody explains.",
      points: [
        "Provisions driven by receipts and contracts, not a period-end guess",
        "Reversal linked to the specific invoice that discharged it",
        "Ageing on every open provision, with the reason it is still open",
      ],
    },
    {
      kind: "alloc",
      tag: "Cost allocation",
      title: "Applied with the entry",
      body: "Run as the entry is created rather than a workbook afterwards, and reversed with it. Recharges applied at source.",
      points: [
        "Static rules or drivers taken from the transaction itself",
        "Multi-entity recharges applied at source",
        "Reversal of the bill reverses the allocation with it",
      ],
    },
  ],
  link: { label: "The close runs on this same engine", href: "/platform#engine" },
} as const;

// ---- Vendor portal -----------------------------------------------------------------------------------------------

export const PORTAL = {
  eyebrow: "Vendor portal",
  title: "The vendor stops emailing your AP team",
  body: "Most of an AP team’s day is not processing invoices. It is answering two questions: did you get my invoice, and when am I being paid. The portal answers both without a person in the middle, and catches the vendor problems that only surface at payment time.",
  items: [
    {
      kind: "onboarding",
      tag: "Onboarding",
      title: "Validated before they exist",
      body: "The vendor enters their own details, uploads their registration and bank proof, and is checked before the master record is created, so the problems that normally appear at the first payment appear at onboarding instead.",
      points: [
        "Tax registration confirmed valid and active at source",
        "Bank details verified as belonging to the vendor being onboarded",
        "Duplicate vendor detection across name, registration and bank account",
      ],
    },
    {
      kind: "submission",
      tag: "Invoice submission",
      title: "Straight into the pipeline",
      body: "The vendor uploads directly. The document goes into the same extraction and validation pipeline, so a missing mandatory field or a wrong order reference comes back to the vendor immediately rather than three weeks later.",
      points: [
        "Rejected at upload with the reason, not silently held",
        "Order reference validated against your open orders as they submit",
        "Credit notes and supporting documents attached to the right invoice",
      ],
    },
    {
      kind: "status",
      tag: "Payment status",
      title: "Answered without a phone call",
      body: "Every invoice with its current state and what it is waiting on: received, matched, held with the reason, approved, scheduled for a date, paid with a reference. The chase call stops because the answer is already there.",
      points: [
        "Current status and expected payment date on every open invoice",
        "Holds shown with the reason and what would clear them",
        "Payment references and remittance advice available on completion",
      ],
    },
    {
      kind: "recon",
      tag: "Reconciliation",
      title: "Against a line, not an email chain",
      body: "The vendor’s statement compared against your ledger, with the differences listed item by item and a conversation thread attached to each one. Disputes get resolved against a specific transaction instead of a forwarded spreadsheet.",
      points: [
        "Statement uploaded and reconciled automatically against your ledger",
        "Differences classified: missing, timing, amount, already paid, disputed",
        "A thread per difference, with the evidence attached to it",
      ],
    },
  ],
  alert: {
    title: "Alert on status change",
    body: "Onboarding checks are a snapshot. If a vendor’s tax registration lapses or their bank details change after they were approved, you are told before the next payment run rather than after the money has left, which is the point at which it stops being an administrative problem.",
  },
} as const;

// ---- Under the hood ----------------------------------------------------------------------------------------------

export const HOOD = {
  eyebrow: "Under the hood",
  title: "What is actually doing the work",
  body: "Specialised agents with narrow, defined duties, coordinated by an orchestration agent, so a new rule or a new jurisdiction is a new agent rather than a rewrite of the pipeline.",
  items: [
    {
      icon: "ingest",
      title: "Intelligent OCR",
      tag: "Reading the document",
      body: "One pipeline for PDFs, scans, photographs, multi-page and handwritten. Tuned to your formats, and reading what the transaction is, not just what the fields say.",
    },
    {
      icon: "governance",
      title: "Governance Agent",
      tag: "Applying your policy",
      body: "N-way matching by line, your audit checklist on every transaction, root cause on each mismatch. Patterns across vendors surface what precedes fraud.",
    },
    {
      icon: "wf",
      title: "Tax Validation Agent",
      tag: "Correct before it posts",
      body: "Registration validated in real time, rates and calculations re-performed, reverse charge applied, and credit eligibility checked against supplier filings before the credit is claimed.",
    },
  ] satisfies readonly { icon: AiIconName; title: string; tag: string; body: string }[],
  links: [
    { label: "The full agent architecture", href: "/platform/how-ai-is-used#architecture" },
    { label: "How your data is protected", href: "/platform/security" },
  ],
} as const;

// ---- What changes ------------------------------------------------------------------------------------------------

export const CHANGES = {
  eyebrow: "What changes",
  title: "What changes, honestly stated",
  body: "Not a longer list of features. A different distribution of who does what, and when a problem is found.",
  columns: { point: "Where it shows", today: "How AP runs today", datatwin: "How it runs on DataTwin" },
  rows: [
    { point: "Workload", today: "Heavy manual effort on entry, validation and chasing exceptions", datatwin: "The routine work is automated; your team spends its time on the exceptions that need judgement" },
    { point: "Cycle time", today: "Slow approvals, held up by exceptions and rework", datatwin: "Invoice to pay moves at machine speed, with a person involved only where a person is required" },
    { point: "Error handling", today: "Errors detected after the fact, corrected through rework", datatwin: "Rules applied before posting, so most errors never get created" },
    { point: "Risk", today: "Fraud and anomalies spotted late, if at all", datatwin: "Patterns monitored continuously across vendors, amounts and behaviour" },
    { point: "Transparency", today: "Limited visibility, reporting that arrives after the decision", datatwin: "Status on every invoice, with the reason it is where it is" },
    { point: "Audit", today: "Heavy after-the-fact testing, correction long after the event", datatwin: "Evidence assembled as the transaction happens, so testing is a read rather than a project" },
    { point: "Compliance", today: "Policy applied inconsistently, with heavy dependence on internal audit", datatwin: "The same checks on every transaction, with the result recorded against it" },
  ],
} as const;

// ---- Start here --------------------------------------------------------------------------------------------------

export const START = {
  eyebrow: "Start here",
  title: "Before you change anything, find out what it has already cost you",
  body: "Everything above is prevention; it stops the next one. It does nothing about the last three years, which are sitting in your AP history right now. So we start there, read-only, before there is anything to sign.",
  stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
  how: "Send us AP history and the vendor master. We test the full transaction population, not a sample, and come back with what is recoverable, split by cash, tax, misstatement and control gaps. Before any contract.",
  flow: ["AP history", "Vendor master", "Full population tested", "Cash, tax, misstatement, control gaps"],
  items: [
    { kind: "cash", title: "Cash back", body: "Duplicate and near-duplicate payments. Paid above contract or order. Quantity paid above quantity received. Credits and advances never recovered." },
    { kind: "tax", title: "Tax reclaimable", body: "Credit never claimed, or claimed against suppliers who never filed. Wrong rate or classification. Reverse charge misapplied." },
    { kind: "misstated", title: "Entries that are wrong", body: "Wrong account, entity or cost centre. Provisions open on invoices long paid. Totals that agree while every line beneath disagrees." },
    { kind: "control", title: "Control gaps", body: "Why the first three keep happening: tolerances nobody set, limits bypassed, bank details changed unchallenged, duplicate vendors." },
  ] as const,
  cta: "Get an estimate for AP",
  link: { label: "How Discover works", href: "/platform/darp#how-it-works" },
} as const;
