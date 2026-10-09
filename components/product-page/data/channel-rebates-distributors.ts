import type { ProductPageData } from "../product-types";

// Channel Rebates for Distributors. Wording is carried over unchanged from the existing page; layout is the new design's.

export const channelRebatesDistributors: ProductPageData = {
  metadata: {
    title: "Channel Rebates for Distributors: collect what you are owed, before it expires | DataTwin",
    description:
      "Unclaimed and underclaimed ship and debit, rebates and price protection, short-paid and rejected claims, and claims aging toward a filing deadline. Reconstructed from your own sales, agreements and vendor statements, read-only, with the substantiation attached.",
  },

  hero: {
    eyebrow: "Channel Rebates · for Distributors",
    lead: ["You fronted the margin.", "Now you have to claim it back."],
    body: "You buy at standard cost, sell at the price the vendor authorised, and recover the difference by filing a claim with a trail back to the agreement. Across ten vendor lines, each with its own portal, format and deadline, some of those claims are never raised, some are short-paid and never contested, and some quietly pass their filing window. DataTwin reconstructs what you were entitled to and shows what is still recoverable.",
    proof: ["Read-only on top of the ERP you already run", "Filing windows tracked per claim, not per vendor", "Every finding carries its substantiation"],
    primary: "See what the channel has cost you",
    secondary: { label: "Channel rebates in general", href: "/products/channel-rebates" },
    glyphs: ["receipt", "doc", "calendar"],
    out: "register",
  },

  hub: {
    eyebrow: "What you are owed, and how long you have",
    title: "Every sale entitled you to something — if you claim it in time",
    card: { title: "What you are entitled to claim → what every sale is tested against", live: "Live process" },
    inputsLabel: "What you are entitled to claim",
    inputs: [
      { title: "Vendor line", sub: "And your tier" },
      { title: "Territory", sub: "Region or end-market" },
      { title: "Product", sub: "Line, family, SKU" },
      { title: "Programme", sub: "Ship & debit, rebate, rotation" },
      { title: "Authorisation", sub: "Registration or SPA" },
      { title: "Rate form", sub: "Off-invoice, tiered, retro" },
      { title: "Filing window", sub: "Days from the sale" },
      { title: "Claimable", sub: "Cost less authorised price" },
      { title: "Rebate due", sub: "On qualifying volume" },
      { title: "Credit due", sub: "Price protection, rotation" },
    ],
    engine: { title: "DataTwin", sub: "Flattened to rows" },
    outputsLabel: "What every sale is tested against",
    outputs: [
      { title: "Vendor A — Line A · Ship and debit", sub: "14 days left · to file" },
      { title: "Vendor A — Line A · Ship and debit", sub: "3 days left · urgent" },
      { title: "Vendor A — Line B · Volume rebate", sub: "Period open · accruing" },
      { title: "Vendor B — Line C · Price protection", sub: "Cut announced · to file" },
      { title: "Vendor B — Line C · Ship and debit", sub: "Closed · lost" },
    ],
    resultLabel: "Why this matters",
    result:
      "You front the margin at the point of sale and recover it later. Every sale that never becomes a claim, and every claim that misses its window, is margin you already gave away and will not get back — read-only to start, nothing changes in your ERP or your vendor portals.",
    footer: "Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
  },

  cards: {
    eyebrow: "The seven axes",
    title: "Every vendor programme varies along the same seven axes",
    body: "Ten vendor lines feel like ten problems because each has its own portal and its own vocabulary. Underneath they are one structure, which is why they resolve on one engine rather than ten spreadsheets.",
    items: [
      { tag: "Who", title: "Which vendor, at which tier", body: "Each line carries its own programme, its own portal and its own claim format." },
      { tag: "Where", title: "Which territory or end-market", body: "Region, channel, or the named account a deviated price was registered against." },
      { tag: "What", title: "Which product it covers", body: "Line, family or SKU, and bundles the programme treats as a single item." },
      { tag: "Which programme", title: "What kind of recovery", body: "Ship and debit, price protection, stock rotation, volume rebate, co-op and MDF, chargeback." },
      { tag: "When", title: "By when must it be filed", body: "The earning period, and separately the filing window, which is the one that expires." },
      { tag: "How much", title: "Against what measure", body: "Units sold, value shipped, sell-through reported, or stock on hand when a price was cut." },
      { tag: "How it pays", title: "What shape does the money take", body: "A claim you file, a credit note you receive, or an off-invoice allowance you never see." },
    ],
    outcome: {
      tag: "The leaf",
      title: "And at the end of every path, a claimable amount",
      body: "Seven answers say what this sale entitled you to. Anything unclaimed is margin you fronted and never got back.",
    },
  },

  lanes: {
    eyebrow: "The channel",
    title: "From the entitlement to the margin",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "Entitled",
        title: "First, what were you actually entitled to claim",
        lead: "The claim is the last step. Before it there is an agreement, a registration, a tier and a price, spread across vendor portals, contract PDFs and a spreadsheet somebody maintains by hand. Reconstructing the entitlement is what turns a sale into a claim you can defend.",
        motif: "doc",
        blocks: [
          {
            icon: "governance",
            tag: "The agreements",
            title: "Read, not summarised",
            body: "Vendor programme terms, registrations and authorised prices captured with their product, customer, rate and window.",
            points: [
              "Contract PDFs, portal terms and rate cards read in one pipeline",
              "Registrations and deviated prices held with the window they cover",
              "Amendments dated, so a mid-quarter change does not rewrite history",
            ],
          },
          {
            icon: "ingest",
            tag: "The movements",
            title: "What shipped, what sold",
            body: "Purchases, sales, credit notes and stock on hand at line level, at the grain the programme is written at.",
            points: [
              "Sales and shipment history at line level, not summarised",
              "On-hand stock, for price protection and rotation entitlement",
              "Returns and cancellations removed before anything is claimed",
            ],
          },
          {
            icon: "recon",
            tag: "Sale to entitlement",
            title: "Every line tested",
            body: "Each sale matched to the programme that governs it, so the claimable amount is computed rather than remembered.",
            points: [
              "One sale can qualify under more than one programme",
              "Sales with no programme behind them surfaced, not ignored",
              "Claimable amount computed from cost, authorised price and volume",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        label: "Claimed",
        title: "Then, what was claimed, and what actually arrived",
        lead: "Filing a claim is not recovering money. A claim can be rejected for a malformed tracing, short-paid without an explanation anyone chased, or settled at a rate that does not match the agreement. The gap between raised and received is where the recoverable money sits.",
        motif: "compare",
        blocks: [
          {
            icon: "investigation",
            tag: "Never raised",
            title: "The largest and quietest gap",
            body: "Sales that earned a claim which nobody filed, listed against the transaction that earned it and the programme that allowed it.",
            points: [
              "Every qualifying sale compared to the claims actually filed",
              "Price protection never taken on stock repriced at a cut",
              "Rotation and return credits never claimed against the terms",
            ],
          },
          {
            icon: "remediation",
            tag: "Short-paid",
            title: "Settled below entitlement",
            body: "Claims paid at less than the agreement supports, with the difference quantified and the substantiation still attached.",
            points: [
              "Claim, credit note and remittance matched three ways",
              "Short-pay reasons classified, so the pattern is visible",
              "The evidence needed to contest, assembled with the finding",
            ],
          },
          {
            icon: "accounting",
            tag: "Aged and unsettled",
            title: "Working capital off the ledger",
            body: "Claims filed and never settled are receivables your ERP does not show. They are aged by vendor and programme, and chased.",
            points: [
              "Filed and unsettled claims aged by vendor and programme",
              "Rejections that were never resubmitted, listed with time left",
              "What is genuinely uncollectible separated from what is late",
            ],
          },
        ],
        callout: {
          tag: "An expiry date",
          title: "Some of this money has an expiry date, and the clock is per claim.",
          body: "Healthcare chargebacks are the sharpest case: distributors typically file within roughly 45 days of the sale, and once the window closes there is no retroactive claim. Other programmes are more forgiving, but few are open-ended. We track the window against each claim rather than each vendor, and we report closed windows honestly, including where recovery is no longer possible.",
        },
      },
      {
        id: "lane-3",
        n: "3",
        label: "Customers",
        title: "And your own customer agreements leak in both directions",
        lead: "A special pricing agreement cuts both ways. Bill at standard when a deviated price was authorised and you overbill the customer, which becomes a dispute and a credit. Bill at the deviated price with no approved agreement and you have given the margin away for nothing.",
        motif: "calc",
        blocks: [
          {
            icon: "wf",
            tag: "SPA both ways",
            title: "Overbilled and underbilled",
            body: "Every customer invoice tested against the special pricing that was authorised for that account and product.",
            points: [
              "Billed at standard where a deviated price was authorised",
              "Billed at a deviated price with no approved agreement behind it",
              "Expired agreements still being honoured, listed by account",
            ],
          },
          {
            icon: "kpi",
            tag: "Customer rebates",
            title: "What you owe, computed",
            body: "Growth incentives and volume rebates payable to your customers, computed on the same engine that computes what your vendors owe you.",
            points: [
              "Tiered and retrospective customer rebates computed per period",
              "Accrual built from eligible sales rather than a flat percentage",
              "Claims your customers file, tested against the agreement they cite",
            ],
          },
          {
            icon: "elastic",
            tag: "The margin, finally",
            title: "Gross to net, per line",
            body: "With both sides reconciled, the margin on a line is what the programmes actually produce rather than what the invoice said.",
            points: [
              "True gross-to-net per transaction, not per month",
              "Programme adjustments attached to the line they belong to",
              "Reported margin that stops being provisional",
            ],
          },
        ],
      },
      {
        id: "lane-4",
        n: "4",
        eyebrow: "One portal, both directions",
        label: "Portal",
        title: "The same view against your vendors and for your customers",
        lead: "The same view that lets your customers see their own claims and agreements is the view your own team uses against your vendors. Both sides of the channel, one record, and most of the correspondence stops before it starts.",
        motif: "hub",
        blocks: [
          {
            icon: "kpi",
            tag: "Claim status, live",
            title: "With the window on it",
            body: "What was claimed, what was accepted, what was short-paid and why, with the days left to file shown next to it.",
            points: [
              "Every claim with its status, evidence and remaining window",
              "Short-pay reasons visible without chasing a portal",
              "Deadlines counted down rather than discovered afterwards",
            ],
          },
          {
            icon: "ingest",
            tag: "Tracings on arrival",
            title: "Validated at upload",
            body: "Sell-through files checked for the faults that cause rejection at upload rather than weeks later.",
            points: [
              "Format and completeness checked before submission",
              "Missing periods and duplicate files caught immediately",
              "The original file kept as evidence for the claim it supports",
            ],
          },
          {
            icon: "human",
            tag: "Disputes against a line",
            title: "Not against a total",
            body: "A customer challenges a specific claim with the evidence already attached, and the exchange stays with the agreement it concerns.",
            points: [
              "Disputes raised against a claim line, not a balance",
              "Both sides working from the same agreement record",
              "Resolution recorded against the programme it settles",
            ],
          },
        ],
      },
    ],
  },

  prevent: {
    eyebrow: "Then it runs forward",
    title: "The same rows run forward, before the window closes",
    body: "Prevent is not a second build. The rows that reconstructed your entitlement are the rows that raise the next claim. That is where a one-off recovery starts compounding.",
    steps: [
      { n: "1", title: "Programme agreed", body: "Vendor terms, tiers and registrations become rows, tested for gaps first." },
      { n: "2", title: "Sale made", body: "Every qualifying sale generates its claim entitlement as it happens, not at month end." },
      { n: "3", title: "Claim substantiated", body: "Assembled from your own sales and stock data, in the format the vendor requires." },
      { n: "4", title: "Deadline watched", body: "Windows tracked per claim, with alerts while there is still time to file." },
      { n: "5", title: "Margin reported", body: "True gross-to-net per line, so reported margin stops being provisional." },
    ],
    link: { label: "How Recover becomes Prevent", href: "/platform/darp#how-it-works" },
  },

  start: {
    eyebrow: "Start here",
    title: "Before you change anything, find out what it has already cost you",
    body: "Everything above is prevention; it stops the next quarter leaking. It does nothing about the sales already made and the claims already settled, which are sitting in your history right now. So we start there, read-only, before there is anything to sign.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us the vendor agreements, the sales and claim history and the vendor statements. We test the full transaction population, not a sample, and come back with what is recoverable, split by heading, with the substantiation attached. Before any contract.",
    flow: ["Vendor agreements", "Sales and claim history, vendor statements", "Full population tested", "What is recoverable, with the substantiation attached"],
    items: [
      { kind: "cash", title: "Never claimed", body: "Sales that earned a claim nobody raised, and price protection never taken on repriced stock." },
      { kind: "apart", title: "Short-paid", body: "Claims settled below entitlement, and rejections nobody resubmitted before the window shut." },
      { kind: "clock", title: "Aged out", body: "Claims past their filing window. Reported honestly, including where recovery is now closed." },
      { kind: "misstated", title: "Given away", body: "Deviated prices billed with no authorised agreement, and expired agreements still honoured." },
    ],
    note: "The same engine runs channel programmes for electronic component distribution, industrial and MRO, electrical, data and security, IT and networking hardware, and medical and pharmaceutical distribution.",
    cta: "Get an estimate for the channel",
    link: { label: "The manufacturer side", href: "/products/channel-rebates/manufacturers" },
  },
};
