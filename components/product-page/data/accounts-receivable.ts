import type { ProductPageData } from "../product-types";

// Accounts Receivable. Wording is carried over unchanged from the existing page; layout is the new design's.

export const accountsReceivable: ProductPageData = {
  metadata: {
    title: "Accounts Receivable: sales to cash, reconciled | DataTwin",
    description:
      "Sales against collections, collections against banking and payment gateways, sales against tax. Cash application including partial clearing, and revenue recognised in the right period. Discover values the gap first, read-only, before any contract.",
  },

  hero: {
    eyebrow: "Accounts Receivable",
    lead: ["The money arrives.", "Proving what it settled is the work."],
    body: "DataTwin reads what your customers sent you, what your banks and gateways report, and what your ERP recorded, then rebuilds one reconciliation position across all three. Every receipt matched to an invoice, every short payment given a reason, every partial cleared to the line rather than parked in an unapplied bucket. We start on your history, read-only, before anything in your systems changes.",
    proof: ["Sits above the ERP and billing you already run", "Read-only until you turn application on", "Full transaction population, not a sample"],
    primary: "See what AR has cost you",
    secondary: { label: "How Discover works", href: "/platform/darp#how-it-works" },
    glyphs: ["upload", "bank", "card"],
    out: "register",
  },

  hub: {
    eyebrow: "Everything that proves a receipt, in one place",
    title: "Eight kinds of evidence, one position back",
    card: { title: "Everything that proves a receipt", live: "Live process" },
    inputsLabel: "Evidence that settles a receipt",
    inputs: [
      { title: "Digital screenshots", sub: "Customer proof of payment" },
      { title: "Bank statements", sub: "Every account, every entity" },
      { title: "NEFT and UPI refs", sub: "Buried in free text" },
      { title: "ERP collections", sub: "What the ledger shows" },
      { title: "Gateway settlements", sub: "Gross, fees, net, per cycle" },
      { title: "Cheque deposit slips", sub: "Scanned, often handwritten" },
      { title: "Cash deposit refs", sub: "Branch slip against book" },
      { title: "Undeposited cheques", sub: "Still sitting in a drawer" },
    ],
    engine: { title: "DataTwin", sub: "Reads every source and rebuilds the reconciliation" },
    outputsLabel: "What comes back",
    outputs: [
      { title: "Sales vs collections", sub: "Billed against received" },
      { title: "Collections vs bank", sub: "And gateway settlements" },
      { title: "Sales vs taxation", sub: "Returns against the books" },
      { title: "Cash applied", sub: "Partials cleared, not parked" },
    ],
    result: "One reconciliation position: every receipt matched to an invoice, every difference named, every unapplied amount aged.",
    footer:
      "Read-only to start — nothing changes in your billing system or your bank. Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
  },

  dar: {
    eyebrow: "Discover · Assess · Recover",
    title: "We start with the reconciliation, not the rollout",
    body: "Nothing about how your team collects cash changes on day one. We take the history as it is, rebuild the position, and show you what is sitting unrecovered inside it. Prevention comes after the number is agreed.",
    items: [
      { letter: "D", title: "Discover", body: "Sales, collections, bank and gateway data as they are. In about two minutes, the recoverable total split by heading, before any contract." },
      { letter: "A", title: "Assess", body: "After the contract, each heading is drilled to the last invoice and receipt, then prioritised with your team. It ends in a signed-off scope of what to recover." },
      { letter: "R", title: "Recover", body: "Only the signed-off scope is worked. Short payments evidenced, unapplied cash applied, wrong entries corrected, each with its trail." },
    ],
    link: { label: "The DARP Framework in full", href: "/platform/darp" },
  },

  lanes: {
    eyebrow: "Six reconciliations, one position",
    title: "From the evidence to the books",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "Evidence",
        title: "The evidence arrives however the payer chose to send it",
        lead: "A receipt is only provable if you can see all of it. Customers send screenshots, banks report in their own format, gateways settle net of fees on their own cycle, and cheques sit in a drawer until someone deposits them. All of it comes in, and the original is kept.",
        motif: "converge",
        blocks: [
          {
            icon: "ingest",
            tag: "Collect",
            title: "Every source, one queue",
            body: "Bank feeds, gateway settlement files, ERP extracts, branch slips and the screenshots customers email. The original is always kept.",
            points: [
              "Statement, settlement and ledger extracts on a schedule you set",
              "Customer proof of payment collected from the mailbox it lands in",
              "Cheque and cash deposit slips scanned and read in the same pipeline",
            ],
          },
          {
            icon: "kpi",
            tag: "Read",
            title: "Not retyped",
            body: "References, dates, amounts and payer names read off each document, including handwriting and the narration a UPI reference hides in.",
            points: [
              "Handwritten slips and photographs handled in the same pipeline",
              "Payment references pulled out of free-text narration fields",
              "Every field confidence-scored; low confidence goes to a person",
            ],
          },
          {
            icon: "hygiene",
            tag: "Normalise",
            title: "One shape, many banks",
            body: "Each bank, gateway and entity formats differently. They are brought to one shape, so a receipt can be compared across all of them at once.",
            points: [
              "Multi-bank, multi-entity and multi-currency handled together",
              "Gateway gross, fee and net split out of the settlement line",
              "Duplicate deposits recognised across channels and periods",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        label: "Collections",
        title: "Sales against collections",
        lead: "Billed is not received. The gap between the two is where a receivable quietly ages into a write-off, and most of it is not bad debt. It is a deduction nobody evidenced, or a payment nobody applied.",
        motif: "match",
        blocks: [
          {
            icon: "recon",
            tag: "Matched to the invoice",
            title: "Receipt to bill, by line",
            body: "Each receipt tested against open invoices on reference, amount, payer and date, including one payment covering many invoices.",
            points: [
              "One receipt against many invoices, and many receipts against one",
              "Payer name variants resolved back to the same customer",
              "Advances and on-account receipts held separately, never forced",
            ],
          },
          {
            icon: "investigation",
            tag: "Short payments named",
            title: "A reason, not a balance",
            body: "Where the customer paid less, the shortfall is classified rather than left open: discount taken, deduction claimed, tax withheld, or simply short.",
            points: [
              "Deductions traced to the claim or credit note behind them",
              "Tax withheld at source matched to the certificate",
              "Unexplained shortfalls flagged with invoice and evidence attached",
            ],
          },
          {
            icon: "kpi",
            tag: "Ageing that holds",
            title: "What is really outstanding",
            body: "Once receipts are applied properly the ageing changes. What remains is genuinely outstanding, not unapplied cash sitting in the wrong bucket.",
            points: [
              "Ageing rebuilt on applied cash rather than open balances",
              "Disputed and deducted amounts separated from ordinary overdue",
              "Customer position consolidated across entities and currencies",
            ],
          },
        ],
      },
      {
        id: "lane-3",
        n: "3",
        label: "Banking",
        title: "Collections against banking and payment gateways",
        lead: "For anyone selling through cards, wallets or a marketplace, the money in the bank is never the money on the order. Fees, refunds, chargebacks and settlement cycles all sit in between, and each one is a place a difference can hide.",
        motif: "compare",
        blocks: [
          {
            icon: "recon",
            tag: "Bank to book",
            title: "Line by line, both ways",
            body: "Every bank line matched to a recorded receipt in both directions, so credits with nothing behind them surface as clearly as entries with no credit.",
            points: [
              "Credits in the bank with no entry in the books, listed",
              "Entries in the books with no bank credit, listed",
              "Timing differences aged rather than quietly netted away",
            ],
          },
          {
            icon: "wf",
            tag: "Gateway settlement",
            title: "Gross, fee, net",
            body: "Settlement files unpacked into gross, fee and net, then tested against the orders in that cycle and the amount that actually reached the account.",
            points: [
              "Commission and fee re-performed against the agreed rate",
              "Refunds and chargebacks matched back to the original order",
              "Cycles that settled late, short or partly, flagged as they occur",
            ],
          },
          {
            icon: "registry",
            tag: "Cash and cheque",
            title: "The slow instruments",
            body: "Deposit slips read and matched to the branch credit, with instruments that were received but never banked surfaced by age.",
            points: [
              "Deposit slip against branch credit, per entity and account",
              "Cheques received but never deposited, surfaced and aged",
              "Returned and bounced instruments traced back to the invoice",
            ],
          },
        ],
      },
      {
        id: "lane-4",
        n: "4",
        label: "Application",
        title: "Cash application, including partial clearing",
        lead: "Cash application is where reconciliations are usually lost. A payment that does not exactly equal an invoice gets parked, and once it is parked nobody goes back to it. Here the settled portion clears against the lines it settles, and only the genuine residue stays open.",
        motif: "split",
        blocks: [
          {
            icon: "governance",
            tag: "Applied on evidence",
            title: "Most of it, without a person",
            body: "Receipts applied to invoices on what the evidence says: remittance advice, reference, amount, and how that customer has historically paid.",
            points: [
              "Remittance advice read from email, PDF or portal upload",
              "Customer payment behaviour learned and used as evidence",
              "Every application recorded with the reason it was made",
            ],
          },
          {
            icon: "remediation",
            tag: "Partial clearing",
            title: "Cleared to the line, not parked",
            body: "Where a payment settles part of an invoice, the settled portion clears and the residue stays open carrying the reason it stayed open.",
            points: [
              "Invoices cleared line by line rather than all or nothing",
              "Residue carried with the deduction or dispute that caused it",
              "Nothing pushed into a suspense or unapplied account by default",
            ],
          },
          {
            icon: "human",
            tag: "Exceptions to a person",
            title: "Only what needs judgement",
            body: "What the evidence does not settle goes to your team with the candidate invoices ranked and the difference already quantified.",
            points: [
              "Ranked candidates, each with the reason it was proposed",
              "Write-off and tolerance limits applied from your own policy",
              "Approval captured against the receipt, not left in an email",
            ],
          },
        ],
      },
      {
        id: "lane-5",
        n: "5",
        label: "Taxation",
        title: "Sales against taxation",
        lead: "The revenue you filed and the revenue you booked should be the same number. When they are not, the difference is usually found by a tax authority rather than by you, and by then it carries interest.",
        motif: "bars",
        blocks: [
          {
            icon: "wf",
            tag: "Return to ledger",
            title: "Filed against booked",
            body: "Output tax in the returns compared to the revenue and tax recorded in the ledger, period by period and registration by registration.",
            points: [
              "Every registration and entity reconciled separately",
              "Amendments tracked back to the period they correct",
              "Differences explained by invoice, not by a summary total",
            ],
          },
          {
            icon: "risk",
            tag: "Rate and classification",
            title: "Re-performed, not assumed",
            body: "Rate, place of supply and classification re-performed on the invoice itself, rather than trusted from the master data that produced it.",
            points: [
              "Rate and classification checked against item and customer",
              "Place of supply and export treatment tested per invoice",
              "Credit notes tested against the invoice they reverse",
            ],
          },
          {
            icon: "accounting",
            tag: "Withholding and credits",
            title: "What the customer deducted",
            body: "Tax the customer withheld matched to the certificate, so the credit gets claimed instead of sitting as an unexplained shortfall.",
            points: [
              "Withholding matched to the certificate and the period",
              "Certificates not received chased with the invoice attached",
              "Credits claimed reconciled to what was actually deducted",
            ],
          },
        ],
      },
      {
        id: "lane-6",
        n: "6",
        label: "Revenue",
        title: "Revenue recognition",
        lead: "Invoiced is not earned. Where delivery, service periods or milestones sit between the two, the recognised number has to be built from what actually happened rather than from what was billed.",
        motif: "timeline",
        blocks: [
          {
            icon: "governance",
            tag: "Performance obligations",
            title: "Built from the contract",
            body: "Recognition driven by delivery, service period or milestone as the contract defines it, not by the date the invoice happened to be raised.",
            points: [
              "Subscription and service periods spread across periods earned",
              "Milestone and delivery evidence linked to the entry",
              "Contract changes carried through to the remaining schedule",
            ],
          },
          {
            icon: "elastic",
            tag: "Deferred and unbilled",
            title: "Both sides visible",
            body: "Billed ahead sits in deferred revenue, earned ahead sits as unbilled, and both roll forward with the entries that moved them.",
            points: [
              "Deferred and unbilled balances rolled forward with movement",
              "Schedules released automatically as the period is earned",
              "Cut-off tested at period end rather than assumed",
            ],
          },
          {
            icon: "risk",
            tag: "Evidence for audit",
            title: "Assembled as it happens",
            body: "Contract, delivery evidence and the entry are held against one another, so testing recognition is a read rather than a reconstruction.",
            points: [
              "Contract, evidence and journal held together per obligation",
              "Every recognition entry traceable to what it recognised",
              "Sample testing replaced by full-population evidence",
            ],
          },
        ],
      },
    ],
  },

  prevent: {
    eyebrow: "Prevent",
    title: "Then the same rules run forward, on the money coming in",
    body: "Prevent is not a second build. The rules that found the money are the rules that run on tomorrow’s transactions, across the whole money-in lifecycle. That is where a one-off recovery starts compounding.",
    steps: [
      { n: "1", title: "Order to invoice", body: "Checked against the order, the contract price and the tax treatment before it is sent." },
      { n: "2", title: "Invoice to collection", body: "Due dates, reminders and promises tracked per customer, with the evidence attached." },
      { n: "3", title: "Collection to bank", body: "Bank and gateway lines matched to receipts daily, not at year end." },
      { n: "4", title: "Bank to application", body: "Receipts applied and partials cleared as they land, so nothing parks in suspense." },
      { n: "5", title: "Application to books", body: "Revenue, tax and deferrals posted from what happened, with the journal read back." },
    ],
    link: { label: "How Recover becomes Prevent", href: "/platform/darp#how-it-works" },
  },

  hood: {
    eyebrow: "Under the hood",
    title: "What is actually doing the work",
    body: "Specialised agents with narrow, defined duties, coordinated by an orchestration agent. Deterministic rules run wherever something posts to the books. Nothing posts because a model was confident.",
    items: [
      { icon: "ingest", title: "Remittance Agent", tag: "Reading the proof", body: "Remittance advices, deposit slips and payment screenshots read in one pipeline, handwriting included, with the reference pulled out of free text." },
      { icon: "recon", title: "Matching Agent", tag: "Applying the evidence", body: "Receipts matched on reference, amount, payer and behaviour, partials cleared to the line, and every application recorded with its reason." },
      { icon: "accounting", title: "Revenue Agent", tag: "Recognised, not assumed", body: "Recognition built from delivery and service periods, deferrals rolled forward, and tax re-performed on the invoice before anything posts." },
    ],
    links: [
      { label: "The full agent architecture", href: "/platform/how-ai-is-used#architecture" },
      { label: "How your data is protected", href: "/platform/security" },
    ],
  },

  changes: {
    eyebrow: "What changes",
    title: "What changes, honestly stated",
    body: "Not a longer list of features. A different distribution of who does what, and when a difference is found.",
    columns: { point: "Where it shows", today: "How AR runs today", datatwin: "How it runs on DataTwin" },
    rows: [
      { point: "Workload", today: "Receipts matched to invoices by hand, with the difficult ones left unapplied", datatwin: "Most receipts applied on evidence; your team works only the exceptions that need judgement" },
      { point: "Cycle time", today: "Reconciliation done at month end, weeks after the money actually moved", datatwin: "Bank, gateway and ledger agreed daily, so a difference is found while it can still be answered" },
      { point: "Unapplied cash", today: "Parked in suspense and revisited when somebody has the time", datatwin: "Cleared to the line as it lands, with the residue carrying the reason it stayed open" },
      { point: "Short payments", today: "Aged and eventually written off, because nobody evidenced the deduction", datatwin: "Classified at the receipt, with the claim, credit note or certificate behind it attached" },
      { point: "Tax", today: "Differences between returns and books surface in an assessment", datatwin: "Return against ledger reconciled every period, per registration, explained by invoice" },
      { point: "Revenue", today: "Recognition rebuilt in a spreadsheet at period end", datatwin: "Built from obligations as they are met, with deferred and unbilled rolling forward" },
      { point: "Audit", today: "Sample testing, with correction long after the event", datatwin: "Evidence assembled as the transaction happens, so testing is a read rather than a project" },
    ],
  },

  start: {
    eyebrow: "Start here",
    title: "Before you change anything, find out what it has already cost you",
    body: "Everything above is prevention; it stops the next one. It does nothing about the last three years, which are sitting in your receivables history right now. So we start there, read-only, before there is anything to sign.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us sales, collections, bank statements and gateway settlements. We test the full transaction population, not a sample, and come back with what is recoverable, split by heading. Before any contract.",
    flow: ["Sales and collections", "Bank statements and gateway settlements", "Full population tested", "What is recoverable, by heading"],
    items: [
      { kind: "cash", title: "Cash never applied", body: "Receipts never applied. Duplicate deposits. Advances never set off against a bill." },
      { kind: "apart", title: "Money short-paid", body: "Deductions with no claim. Discounts outside terms. Tax withheld, no certificate." },
      { kind: "tax", title: "Fees and settlements", body: "Commission above the agreed rate. Cycles settled short. Refunds never traced back." },
      { kind: "misstated", title: "Entries that are wrong", body: "Revenue in the wrong period. Deferrals never released. Balances that agree only in total." },
    ],
    note: "We run these reconciliations for retail, edtech, manufacturing and pharma finance teams. The shape of the evidence differs in each; the questions do not.",
    cta: "Get an estimate for AR",
    link: { label: "How Discover works", href: "/platform/darp#how-it-works" },
  },
};
