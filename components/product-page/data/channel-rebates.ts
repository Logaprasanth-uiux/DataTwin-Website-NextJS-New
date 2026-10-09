import type { ProductPageData } from "../product-types";

// Channel Rebates. Wording is carried over unchanged from the existing page; layout is the new design's.

export const channelRebates: ProductPageData = {
  metadata: {
    title: "Channel Rebates: the gross-to-net your ERP cannot see | DataTwin",
    description:
      "Ship and debit, price protection, SPAs, tiered and retrospective rebates, co-op and MDF, stock rotation and chargebacks, reconciled against POS and vendor statements. Read-only recovery first: what is unclaimed, short-paid, over-accrued or aging out, with the substantiation attached.",
  },

  hero: {
    eyebrow: "Channel Rebates",
    lead: ["The invoice price is not the margin.", "The programmes decide, and they arrive late."],
    body: "Distribution does not run on list prices. It runs on ship and debit, price protection, special pricing agreements, tiered and retrospective rebates, co-op funds, stock rotation and chargebacks, which land weeks after the sale, from different counterparties, in vendor portals and spreadsheets. DataTwin reconstructs the true gross-to-net from what you already hold, and shows what is unclaimed, short-paid, over-accrued or about to age out.",
    proof: ["Read-only on top of the ERP you already run", "No programme redesign, no re-platforming", "Every finding carries its substantiation"],
    primary: "See what the channel has cost you",
    secondary: { label: "How Discover works", href: "/platform/darp#how-it-works" },
    glyphs: ["receipt", "doc", "coin"],
    out: "chart",
  },

  hub: {
    eyebrow: "One programme, two forms",
    title: "A programme is a set of conditions ending in a rate",
    card: { title: "Programme, as agreed → programme, as rows", live: "Live process" },
    inputsLabel: "The programme, as it was agreed",
    inputs: [
      { title: "Counterparty", sub: "Vendor or customer" },
      { title: "Territory", sub: "Region or channel" },
      { title: "Product", sub: "Line, family, SKU" },
      { title: "Programme", sub: "Ship & debit, SPA, rebate" },
      { title: "Eligibility", sub: "Who and what qualifies" },
      { title: "Rate form", sub: "Off-invoice, tiered, retro" },
      { title: "Window", sub: "Period and filing deadline" },
      { title: "Deviated price", sub: "The claimable difference" },
      { title: "Slab rate", sub: "By volume band" },
      { title: "Allowance", sub: "Co-op, MDF, rotation" },
    ],
    engine: { title: "DataTwin", sub: "Flattened to rows" },
    outputsLabel: "The same programme, as rows",
    outputs: [
      { title: "Line A — Ship and debit", sub: "Registered · Per unit sold · cost less" },
      { title: "Line A — Volume rebate", sub: "All sales · To 10,000 · 2%" },
      { title: "Line A — Volume rebate", sub: "All sales · Above 10,000 · 3.5%" },
      { title: "Line B — SPA", sub: "Named account · Per unit sold · deviated" },
      { title: "Line B — Price protection", sub: "On-hand stock · At price cut · credit" },
    ],
    resultLabel: "Why this matters",
    result:
      "The ERP books the transaction at the price on the document. The programmes that decide the real margin arrive later, from other parties, in other formats. That gap is what we reconstruct — read-only to start, nothing changes in your ERP, your portals or your claims.",
    footer: "Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
  },

  duo: {
    eyebrow: "Both directions",
    title: "The same machinery, pointed both ways",
    body: "Most tools are built for one side of the channel. The mechanics are mirror images, which is why one engine can compute what a vendor owes you and what you owe a customer, from the same rows.",
    left: {
      arrow: "left",
      tag: "If you file the claims",
      title: "Buy side, money coming to you",
      body: "Ship and debit, price protection, tiered and retrospective rebates, co-op and MDF, stock rotation. Every unit shipped should trigger a claim.",
    },
    right: {
      arrow: "right",
      tag: "If you pay the claims",
      title: "Sell side, money you owe",
      body: "Special pricing agreements, customer rebates and growth incentives, and the chargebacks a distributor claims back from you.",
    },
    banner: {
      title: "And the tracings between them",
      body: "POS and sell-through data substantiates every buy-side claim. Late or malformed tracings are why claims get rejected, often too late to refile.",
    },
  },

  lanes: {
    eyebrow: "The channel",
    title: "From the terms to the margin",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "Terms",
        title: "The terms live outside the ledger, so that is where we start",
        lead: "The ERP records order-to-cash and procure-to-pay at the price on the document. The agreement that governs the real price sits in a vendor portal, a contract PDF, an EDI feed or a spreadsheet on somebody’s desktop. Reported margin is provisional until all of it is read.",
        motif: "doc",
        blocks: [
          {
            icon: "governance",
            tag: "The agreements",
            title: "Read, not summarised",
            body: "Vendor programme terms, customer SPAs and rebate schedules read into rows, including scanned annexures and mid-period amendments.",
            points: [
              "Contract PDFs, portal terms and rate cards read in one pipeline",
              "Amendments dated, so a mid-quarter change does not rewrite history",
              "Each row traceable to the clause and document behind it",
            ],
          },
          {
            icon: "ingest",
            tag: "The movements",
            title: "What actually shipped and sold",
            body: "Invoices, credit notes, shipments, on-hand inventory and POS or sell-through tracings, at the grain the programme is written at.",
            points: [
              "Sales and shipment history at line level, not summarised first",
              "On-hand stock positions, for price protection and rotation",
              "POS and sell-through tracings, in whatever shape they arrive",
            ],
          },
          {
            icon: "recon",
            tag: "The counterparty view",
            title: "Their numbers, next to yours",
            body: "Vendor statements, portal claim status, remittance detail and customer claim submissions, so both sides of every programme are visible at once.",
            points: [
              "Vendor portal statements and claim status read as data",
              "Remittance detail matched to the claims it settled",
              "Customer submissions held against the agreement they cite",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        label: "Gross-to-net",
        title: "Then the true gross-to-net is rebuilt, transaction by transaction",
        lead: "Not a summary and not a sample. Every line is tested against the programme that governs it, so the margin you report is the margin the programmes actually produce.",
        motif: "tiers",
        blocks: [
          {
            icon: "registry",
            tag: "Line to programme",
            title: "Which terms govern this sale",
            body: "Each transaction matched to the vendor programme and the customer agreement that apply to it, on product, territory, account and date.",
            points: [
              "One line can fall under several programmes, and often does",
              "Eligibility tested per line, not assumed from the header",
              "Lines governed by no programme surfaced rather than ignored",
            ],
          },
          {
            icon: "kpi",
            tag: "Tiers and retros",
            title: "As your contract defines them",
            body: "A volume band pays on all volume or only the units inside it, and a retrospective tier reprices earlier volume once the band is hit.",
            points: [
              "Whole-volume or marginal, set per programme, not globally",
              "Retrospective tiers repricing prior volume in the period",
              "The band applied shown next to the one below it",
            ],
          },
          {
            icon: "investigation",
            tag: "Claim against settlement",
            title: "What was owed, what arrived",
            body: "Every claim compared to what the vendor actually paid, so short-pays and rejections surface with the substantiation still attached.",
            points: [
              "Claim, credit note and remittance matched three ways",
              "Short-paid and rejected claims listed with the reason given",
              "Aged claim receivables, so nothing sits off-ledger unnoticed",
            ],
          },
        ],
        callout: {
          tag: "A contract question",
          title: "Marginal or whole-volume is a contract question, not a product setting.",
          body: "At 12,000 units against bands of 1 to 10,000 and above, does the higher rate pay on all 12,000 or only on the last 2,000? Both are written into real agreements. We read it from your contract, apply it per programme, and show which reading produced the number.",
        },
      },
      {
        id: "lane-3",
        n: "3",
        label: "Deadlines",
        title: "Some of this money has an expiry date",
        lead: "A claim filed late is not a slow recovery. In several programmes it is no recovery at all. Healthcare chargebacks are the sharpest case, where a distributor typically files within roughly 45 days of the sale and there is no retroactive claim afterwards.",
        motif: "calendar",
        blocks: [
          {
            icon: "kpi",
            tag: "The clock, per programme",
            title: "Not one deadline, many",
            body: "Every programme carries its own filing window, and they rarely align. The window is tracked per claim rather than per vendor.",
            points: [
              "Filing deadlines held against each claim, per programme",
              "Claims approaching a window surfaced while they can still be filed",
              "Windows that have closed reported honestly, not quietly dropped",
            ],
          },
          {
            icon: "risk",
            tag: "Rejections that cost twice",
            title: "Late tracings, dead claims",
            body: "A claim rejected for a malformed tracing often comes back after the window has shut, so the rejection and the expiry arrive together.",
            points: [
              "Tracings validated before submission, not after rejection",
              "Rejection reasons classified, so the same fault stops recurring",
              "Resubmission time left, shown against the remaining window",
            ],
          },
          {
            icon: "accounting",
            tag: "Aged and unclaimed",
            title: "Working capital off the ledger",
            body: "Claims raised and never settled sit as receivables the ERP does not show. They are aged like any other receivable, and chased.",
            points: [
              "Unfiled claims surfaced against the sales that earned them",
              "Filed and unsettled claims aged by programme and counterparty",
              "What is genuinely uncollectible separated from what is merely late",
            ],
          },
        ],
      },
      {
        id: "lane-4",
        n: "4",
        label: "Accrual",
        title: "And the accrual is a number the auditor will ask about",
        lead: "Rebates and programme adjustments are estimated at the point of sale and trued up later. An over-accrual inflates reported margin and then trues down; an under-accrual does the reverse. Either way the estimate has to be defensible, not merely present.",
        motif: "ledger",
        blocks: [
          {
            icon: "elastic",
            tag: "Computed, not guessed",
            title: "From the same rows",
            body: "The accrual comes from the programme rows and the actual transactions, so the estimate and the eventual claim share one basis.",
            points: [
              "Accrual built from eligible transactions, per programme",
              "Retrospective tiers reflected as the period progresses",
              "The estimate and the claim reconciled when settlement arrives",
            ],
          },
          {
            icon: "remediation",
            tag: "True-up with a trail",
            title: "Every period",
            body: "When the claim settles or the tier resolves, the difference is posted with the reason and the transactions behind it.",
            points: [
              "Movement between estimate and actual explained per programme",
              "True-ups traced to the claims and tiers that caused them",
              "Prior-period corrections separated from current-period movement",
            ],
          },
          {
            icon: "hygiene",
            tag: "Evidence for audit",
            title: "Assembled as it happens",
            body: "Agreement, transactions, claim and settlement are held against one another, so testing the accrual is a read rather than a reconstruction.",
            points: [
              "Agreement, transaction, claim and settlement held together",
              "Full population tested rather than a sample",
              "The basis of estimate documented as it was applied",
            ],
          },
        ],
      },
      {
        id: "lane-5",
        n: "5",
        eyebrow: "One portal, both sides",
        label: "Portal",
        title: "A channel programme has two parties who need the same view",
        lead: "A channel programme has two parties who need the same view and almost never have it. The portal shows each side its own claims, its own tracings and its own status, against the same record, which removes most of the correspondence before it starts.",
        motif: "hub",
        blocks: [
          {
            icon: "kpi",
            tag: "Claim status, live",
            title: "For whoever raised it",
            body: "What was claimed, what was accepted, what was short-paid and why, with the days left in the filing window shown next to it.",
            points: [
              "Every claim with its status, its evidence and its window",
              "Short-pay reasons visible to both sides at the same time",
              "Deadlines counted down rather than discovered afterwards",
            ],
          },
          {
            icon: "ingest",
            tag: "Tracings and submissions",
            title: "Validated on arrival",
            body: "Sell-through data and claim submissions checked for the faults that cause rejection, at upload rather than after filing.",
            points: [
              "Format and completeness checked before anything is submitted",
              "Missing periods and duplicate submissions caught at upload",
              "The original file kept as evidence for the claim it supports",
            ],
          },
          {
            icon: "human",
            tag: "Disputes against a line",
            title: "Not against a total",
            body: "A counterparty challenges a specific claim with the evidence already attached, and the exchange stays with the programme and period it affects.",
            points: [
              "Disputes raised against a claim line, not a statement balance",
              "Both sides working from the same substantiation",
              "Resolution recorded against the programme it settles",
            ],
          },
        ],
      },
    ],
  },

  prevent: {
    eyebrow: "Then it runs forward",
    title: "The same rows run forward, before the margin is booked",
    body: "Prevent is not a second build. The rows that reconstructed your history are the rows that govern the next order. That is where a one-off recovery starts compounding.",
    steps: [
      { n: "1", title: "Programme agreed", body: "A new programme becomes rows, tested for gaps and overlaps before it governs anything." },
      { n: "2", title: "Order priced", body: "A deviated price that has no authorised agreement behind it is stopped at billing, not found later." },
      { n: "3", title: "Claim substantiated", body: "Claims assembled from POS and shipment data as the sale happens." },
      { n: "4", title: "Deadline watched", body: "Filing windows tracked per claim, with alerts while there is still time to act." },
      { n: "5", title: "Margin reported", body: "Accrual and true-up computed from the same rows, so reported margin stops being provisional." },
    ],
    link: { label: "How Recover becomes Prevent", href: "/platform/darp#how-it-works" },
  },

  changes: {
    eyebrow: "What this is",
    title: "What this is, and what it is not",
    body: "There is a mature market in rebate management software, and some of it is very good. We are not selling you that, and it is worth being clear about the difference before anyone books a meeting.",
    columns: { point: "", today: "A rebate management platform", datatwin: "DataTwin" },
    rows: [
      { point: "The motion", today: "Configure the platform, then run your programmes forward on it", datatwin: "Recompute what already happened, read-only, and show what leaked" },
      { point: "What you commit", today: "Programme redesign, ERP coupling, and a team to operate it", datatwin: "A read-only data extract, and nothing else until you decide" },
      { point: "First value", today: "After implementation, when programmes are live on the new system", datatwin: "A recovery number before there is anything to sign" },
      { point: "Where it sits", today: "In the transaction path, as the system that runs the programme", datatwin: "On top of the ERP you already run, which stays the system of record" },
      { point: "Best used", today: "When you have decided to re-platform programme management", datatwin: "When you suspect margin is leaking and want the number first" },
      { point: "Honest limit", today: "Deep configuration, workflow and settlement operations", datatwin: "We reconcile and evidence; we do not replace your programme operations" },
    ],
    note: {
      title: "Where we would not claim depth yet.",
      body: "Regulatory chargeback administration in US healthcare, with GPO rosters, tier eligibility and government pricing, is a specialist domain with entrenched providers. We reconcile chargeback claims and deadlines; we do not present ourselves as a government-pricing compliance system.",
    },
  },

  start: {
    eyebrow: "Start here",
    title: "Before you change anything, find out what it has already cost you",
    body: "Everything above is prevention; it stops the next quarter leaking. It does nothing about the programmes already settled, which are sitting in your claim history right now. So we start there, read-only, before there is anything to sign.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us the programme terms, the sales and claim history and the vendor statements. We test the full transaction population, not a sample, and come back with what is recoverable, split by heading, with the substantiation attached. Before any contract.",
    flow: ["Programme terms", "Sales and claim history, vendor statements", "Full population tested", "What is recoverable, with the substantiation attached"],
    items: [
      { kind: "cash", title: "Never claimed", body: "Sales that earned a claim nobody raised. Price protection never taken on stock repriced at a cut." },
      { kind: "apart", title: "Short-paid", body: "Claims settled below what the agreement supports, and rejections nobody contested in time." },
      { kind: "clock", title: "Aged out", body: "Claims past their filing window. Reported honestly, including where recovery is closed." },
      { kind: "misstated", title: "Mis-accrued", body: "Rebates over-accrued and trued down, and deviated prices billed with no authorised agreement." },
    ],
    note: "The same engine runs channel programmes for electronic component distribution, industrial and MRO, electrical and data, IT and networking hardware, and medical and pharmaceutical distribution. The programmes differ in name; the seven axes do not.",
    cta: "Get an estimate for the channel",
    link: { label: "How Discover works", href: "/platform/darp#how-it-works" },
  },
};
