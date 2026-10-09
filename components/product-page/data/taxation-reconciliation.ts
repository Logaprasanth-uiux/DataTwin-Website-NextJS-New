import type { ProductPageData } from "../product-types";

// Taxation Reconciliation. Wording is carried over unchanged from the existing page; layout is the new design's.

export const taxationReconciliation: ProductPageData = {
  metadata: {
    title: "Taxation Reconciliation: what you booked against what you filed | DataTwin",
    description:
      "Input credit unclaimed or taken on blocked spend, purchase register against supplier filings, output tax against revenue, reverse charge, withholding on both sides and the certificates behind it. Every item checked against its claim window and ranked by how long you have left.",
  },

  hero: {
    eyebrow: "Taxation Reconciliation",
    lead: ["Tax is the one counterparty", "you cannot negotiate with."],
    body: "Every other recovery is a conversation. Tax is arithmetic against a statute, which makes it the quietest line on the list and often the fastest to collect. DataTwin reconciles what you booked against what you filed, and both against what your suppliers and customers filed, on the payables side and the receivables side together. Then it ranks what is left by how long you have to act.",
    proof: ["Read-only on top of the ERP you already run", "Both sides: credit claimable and credit at risk", "Every item ranked by its remaining window"],
    primary: "See what tax has cost you",
    secondary: { label: "How Discover works", href: "/platform/darp#how-it-works" },
    glyphs: ["doc", "receipt", "calendar"],
    out: "register",
  },

  hub: {
    eyebrow: "Four registers, one difference list",
    title: "The four things that must agree",
    card: { title: "Register against return", live: "Live process" },
    inputsLabel: "The four things that must agree",
    inputs: [
      { title: "Returns as filed", sub: "Per registration, per period" },
      { title: "The ledger", sub: "What was actually booked" },
      { title: "What counterparties filed", sub: "Supplier returns and customer claims" },
      { title: "Certificates and documents", sub: "Withholding, exemption, shipping bills" },
    ],
    engine: { title: "DataTwin", sub: "Reads all four and names every difference" },
    outputsLabel: "One difference register",
    outputs: [
      { title: "Entity 1 · Apr · Input credit", sub: "Supplier never filed — at risk" },
      { title: "Entity 1 · Apr · Input credit", sub: "Eligible, never claimed — claimable" },
      { title: "Entity 1 · May · Output tax", sub: "Rate applied wrongly — exposure" },
      { title: "Entity 2 · May · Withholding", sub: "No certificate received — claimable" },
      { title: "Entity 2 · Jun · Reverse charge", sub: "Not self-assessed — exposure" },
    ],
    resultLabel: "Why this matters",
    result:
      "A tax difference is not an opinion. Either the ledger and the return agree or they do not, and the counterparty is a statute rather than a negotiation. What is missing is the reconciliation, not the argument.",
    footer:
      "Read-only to start — we reconcile and evidence; we do not file your returns. Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
  },

  duo: {
    eyebrow: "Two directions",
    title: "Two directions, and they fail in opposite ways",
    body: "Most tax work is organised by return rather than by direction, which hides the fact that the payables side and the receivables side leak differently. One loses money you were entitled to. The other creates exposure you have not provided for.",
    left: {
      arrow: "left",
      title: "Payables: money you are owed",
      body: "Input credit is yours if the spend was eligible, the document exists and your supplier actually filed. All three can fail, and the third is not in your control.",
    },
    right: {
      arrow: "right",
      title: "Receivables: exposure you carry",
      body: "Output tax is yours to get right. A wrong rate, a wrong place of supply or a credit note that never reversed becomes an assessment, with interest.",
    },
    banner: {
      title: "And a clock over both",
      body: "Almost every item has a statutory window. Once it closes the money is gone, valid claim or not, so urgency has to rank the findings, not just value.",
    },
  },

  lanes: {
    eyebrow: "The reconciliation",
    title: "Five parts, from register to notice",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "Register",
        title: "Start where every tax question starts: register against return",
        lead: "The books say one thing and the return says another, and nobody can say why without rebuilding both. Doing that once, per registration and per period, turns most tax questions from an investigation into a lookup.",
        motif: "compare",
        blocks: [
          {
            icon: "registry",
            tag: "Register",
            title: "Both registers, rebuilt",
            body: "From the ledger up. Purchase and sales registers reconstructed from the transactions themselves, at line level, for every registration and entity you hold.",
            points: [
              "Every registration and entity reconciled separately",
              "Built from transactions rather than from a filed summary",
              "Multi-entity and multi-state positions held side by side",
            ],
          },
          {
            icon: "recon",
            tag: "Return",
            title: "Return against register",
            body: "Period by period. What was filed compared to what the books support, with each difference carrying the invoices behind it rather than a net figure.",
            points: [
              "Differences explained by invoice, not by a summary total",
              "Amendments and revised returns tracked to the period they fix",
              "Late and missing filings surfaced against the period they cover",
            ],
          },
          {
            icon: "kpi",
            tag: "Window",
            title: "Aged by window",
            body: "Urgency, not just value. Each difference is tagged with the statutory window it sits in, so what is about to expire is ranked above what is merely large.",
            points: [
              "Every item carries its remaining claim or correction window",
              "Items past their window reported honestly as closed",
              "Ranking by urgency and value together, not value alone",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        eyebrow: "← Payables side",
        label: "Credit",
        title: "Credit you can claim, and credit you should not have",
        lead: "Input credit fails in two directions at once. Credit is left unclaimed on eligible spend because nobody matched the document, and credit is claimed on spend that was never eligible or against suppliers who never filed. Both are found the same way.",
        motif: "ranking",
        blocks: [
          {
            icon: "accounting",
            tag: "Claimable, unclaimed",
            title: "Money sitting in the register",
            body: "Eligible spend where the credit was never taken, including import duty, reverse charge and credits stranded in a period nobody revisited.",
            points: [
              "Eligible purchases with no corresponding credit claimed",
              "Import duty and reverse charge credit never taken",
              "Credits stranded in a closed period, with the window shown",
            ],
          },
          {
            icon: "risk",
            tag: "Claimed, at risk",
            title: "Credit you may have to give back",
            body: "Credit taken on blocked or ineligible spend, or against suppliers whose own returns do not show the invoice.",
            points: [
              "Purchase register matched to supplier filings, line by line",
              "Blocked and ineligible categories tested against the spend",
              "Credit requiring reversal surfaced before an assessment finds it",
            ],
          },
          {
            icon: "investigation",
            tag: "The supplier gap",
            title: "Not in your control",
            body: "A valid invoice from a supplier who never filed is a credit at risk. The gap is quantified per supplier so it can be chased while it is still recoverable.",
            points: [
              "Differences aggregated by supplier, with the invoices listed",
              "Suppliers who file late separated from those who never file",
              "The chase pack assembled from your own records",
            ],
          },
        ],
      },
      {
        id: "lane-3",
        n: "3",
        eyebrow: "Receivables side →",
        label: "Output tax",
        title: "What you charged, and what you should have",
        lead: "Output tax rarely goes wrong in the total. It goes wrong on a class of invoices, in one state, or on one product, and it stays wrong for as long as the master data that produced it stays wrong. Re-performing the decision on the invoice is what finds it.",
        motif: "calc",
        blocks: [
          {
            icon: "wf",
            tag: "Rate and classification",
            title: "Re-performed, not assumed",
            body: "Rate, classification and treatment tested against the item and customer on each invoice, rather than trusted from the master data behind them.",
            points: [
              "Rate and classification checked against the item and customer",
              "Exemptions and concessional rates tested against their conditions",
              "A wrong classification traced back to the master data behind it",
            ],
          },
          {
            icon: "registry",
            tag: "Place of supply",
            title: "Where it was actually supplied",
            body: "Inter-state, intra-state and export treatment tested per invoice, since the consequence of getting it wrong is paying twice and reclaiming once.",
            points: [
              "Place of supply tested per invoice, not per customer",
              "Export and zero-rated treatment matched to its documentation",
              "Invoices taxed in the wrong jurisdiction listed with the value",
            ],
          },
          {
            icon: "remediation",
            tag: "Credit notes and returns",
            title: "What was reversed, and when",
            body: "Credit notes tested against the invoice they reverse and the period they landed in. A reversal in the wrong period is a difference in two returns.",
            points: [
              "Credit notes matched to the invoice and period they reverse",
              "Sales returns reconciled to the tax originally charged",
              "Reversals outside their permitted window flagged",
            ],
          },
        ],
      },
      {
        id: "lane-4",
        n: "4",
        label: "Withholding",
        title: "Withholding runs both ways, and both ways leak",
        lead: "Tax your customers withheld is a credit you have to claim, and it fails when the certificate never arrives. Tax you withheld on vendors is a liability you have to deposit at the right rate, and it fails on section, threshold and certificate.",
        motif: "tiers",
        blocks: [
          {
            icon: "ingest",
            tag: "What was withheld from you",
            title: "A credit to collect",
            body: "Short payments from customers reconciled to the tax they withheld, and the credit claimed rather than left sitting as an unexplained shortfall.",
            points: [
              "Withholding matched to the certificate and the period",
              "Certificates never received, chased with the invoice attached",
              "Credit claimed reconciled to what was actually deducted",
            ],
          },
          {
            icon: "governance",
            tag: "What you withheld",
            title: "A liability to get right",
            body: "Rate, section and threshold tested per vendor and payment, including thresholds only breached once spend is aggregated across the year.",
            points: [
              "Rate and section tested against the nature of the payment",
              "Thresholds tracked on aggregated spend, not per invoice",
              "Deposits and returns reconciled to what was actually deducted",
            ],
          },
          {
            icon: "hygiene",
            tag: "Certificates and exemptions",
            title: "Dated, and they expire",
            body: "Lower-deduction and exemption certificates applied only inside their validity, since an expired certificate silently becomes a short deduction.",
            points: [
              "Certificates applied only within their validity window",
              "Expired certificates surfaced before the next payment run",
              "Vendors with no certificate on file, listed before deduction",
            ],
          },
        ],
        callout: {
          tag: "What this is not.",
          body: "We reconcile and evidence. We do not file your returns, and we are not a substitute for your tax advisers. Rules are configured per jurisdiction rather than assumed, so the honest question to ask us early is which of your jurisdictions are already configured and which would be new work. We would rather answer that before a contract than after one.",
        },
      },
      {
        id: "lane-5",
        n: "5",
        label: "The notice",
        title: "And when the notice arrives, the answer is already assembled",
        lead: "A tax assessment is a reconciliation somebody else has run on your data. If you have run it first, responding is a print rather than a project, and the difference between those two is usually several weeks and a lot of goodwill.",
        motif: "ledger",
        blocks: [
          {
            icon: "elastic",
            tag: "The annual position",
            title: "Built through the year",
            body: "The annual reconciliation assembled from the periods as they close, rather than reconstructed in the weeks before it is due.",
            points: [
              "Period reconciliations rolled forward into the annual position",
              "Differences carried with the explanation agreed at the time",
              "Prior-year corrections separated from current-year movement",
            ],
          },
          {
            icon: "hygiene",
            tag: "Evidence, attached",
            title: "Invoice level",
            body: "Every difference carries the invoices, documents and filings behind it, so a query is answered from the record rather than from memory.",
            points: [
              "Each difference traceable to the invoices that create it",
              "Supporting documents held against the item they support",
              "Full population, so a sampled challenge can be answered in full",
            ],
          },
          {
            icon: "human",
            tag: "The same view for the auditor",
            title: "And for your adviser",
            body: "Your auditor and your tax adviser read the same reconciliation your team does, which removes most of the back and forth.",
            points: [
              "One reconciliation, read by finance, audit and advisers",
              "Sign-off recorded against the period it covers",
              "Changes after sign-off visible as changes, not as edits",
            ],
          },
        ],
      },
    ],
  },

  prevent: {
    eyebrow: "Prevent",
    title: "Then the same checks run forward, before the return is filed",
    body: "Prevent is not a second build. The checks that reconciled last year are the checks that run on this month’s transactions. That is where a one-off recovery starts compounding.",
    steps: [
      { n: "1", title: "At entry", body: "Rate, classification and place of supply tested on the transaction, before it posts." },
      { n: "2", title: "At payment", body: "Withholding rate, section and threshold applied from the vendor record and the year to date." },
      { n: "3", title: "Before filing", body: "Register against return reconciled while the period is still open to correct." },
      { n: "4", title: "After filing", body: "Counterparty filings matched as they appear, so a supplier gap is a same-month chase." },
      { n: "5", title: "At the close", body: "The annual position assembled from periods already agreed, not rebuilt." },
    ],
    link: { label: "How Recover becomes Prevent", href: "/platform/darp#how-it-works" },
  },

  changes: {
    eyebrow: "What changes",
    title: "What changes, honestly stated",
    body: "Not a longer list of features. A different distribution of who does what, and when a difference is found.",
    columns: { point: "Where it shows", today: "How tax reconciliation runs today", datatwin: "How it runs on DataTwin" },
    rows: [
      { point: "The register", today: "Downloaded, pasted into a workbook, reconciled by whoever has time", datatwin: "Rebuilt from transactions, per registration and period, as the period closes" },
      { point: "Supplier gaps", today: "Found at the annual return, when the supplier has stopped answering", datatwin: "Matched as filings appear, so the chase happens while it still works" },
      { point: "Classification", today: "Trusted from master data until an assessment disagrees", datatwin: "Re-performed on the invoice, with the master-data cause identified" },
      { point: "Withholding", today: "Checked per invoice, so aggregated thresholds are missed", datatwin: "Tracked across the year per vendor, per section" },
      { point: "Certificates", today: "Chased at year end, when many can no longer be obtained", datatwin: "Chased against the period they belong to, with the invoice attached" },
      { point: "Urgency", today: "Findings ranked by value, so expiring items get missed", datatwin: "Ranked by remaining window and value together" },
      { point: "A notice", today: "A project: rebuild the period, find the documents, explain the gap", datatwin: "A print: the reconciliation and its evidence already exist" },
    ],
  },

  start: {
    eyebrow: "Start here",
    title: "Before you change anything, find out what it has already cost you",
    body: "Everything above is prevention; it stops the next period leaking. It does nothing about the periods already filed, which are sitting in your registers right now, some of them still inside their window. So we start there, read-only, before there is anything to sign.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us the purchase and sales registers, the returns as filed and the counterparty data. We test the full transaction population, not a sample, and come back with what is claimable, what is at risk and how long you have on each. Before any contract.",
    flow: ["Purchase and sales registers", "Returns as filed and counterparty data", "Full population tested", "Claimable, at risk, and the days left on each"],
    items: [
      { kind: "cash", title: "Claimable", body: "Credit never taken on eligible spend. Import duty and reverse charge missed. Withholding left." },
      { kind: "control", title: "At risk", body: "Credit taken on blocked spend, or against suppliers whose returns never showed the invoice." },
      { kind: "misstated", title: "Exposure", body: "Wrong rate, classification or place of supply. Reverse charge never self-assessed. Reversals missed." },
      { kind: "clock", title: "Expiring", body: "Items still inside their window, ranked by the days left rather than by the amount." },
    ],
    note: "The same engine runs tax reconciliation for manufacturing, distribution, retail, pharma and services groups running multiple registrations and entities. Rules are configured per jurisdiction, so ask us early which of yours are covered.",
    cta: "Get an estimate for tax",
    link: { label: "How Discover works", href: "/platform/darp#how-it-works" },
  },
};
