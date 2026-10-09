import type { ProductPageData } from "../product-types";

// Channel Rebates for Manufacturers. Wording is carried over unchanged from the existing page; layout is the new design's.

export const channelRebatesManufacturers: ProductPageData = {
  metadata: {
    title: "Channel Rebates for Manufacturers: pay only what is genuinely owed | DataTwin",
    description:
      "Validate ship and debit, price protection, stock rotation and rebate claims against the authorised price, the POS and the stock position, and compute variable consideration from the same rows. We recompute settled claims first, read-only, before anything changes.",
  },

  hero: {
    eyebrow: "Channel Rebates · for Manufacturers",
    lead: ["You are paying claims", "you cannot test."],
    body: "A distributor claims the difference between what they paid you and what you authorised them to sell at. Testing that claim means knowing the registration, the authorised price, the sell-through and the stock position at the moment of the claim, and most of that arrives late, in a format nobody reconciles line by line. DataTwin validates every claim against what you actually authorised, and computes the reserve from the same rows.",
    proof: ["Read-only on top of the ERP you already run", "Every claim tested, not a sample", "The reserve computed from the same rows"],
    primary: "See what the channel has cost you",
    secondary: { label: "Channel rebates in general", href: "/products/channel-rebates" },
    glyphs: ["receipt", "doc", "coin"],
    out: "register",
  },

  hub: {
    eyebrow: "What you authorised, and what gets claimed",
    title: "Every claim rests on something you agreed",
    card: { title: "What you authorised → what every claim is tested against", live: "Live process" },
    inputsLabel: "What you authorised",
    inputs: [
      { title: "Distributor", sub: "And their tier" },
      { title: "Territory", sub: "Region or end-market" },
      { title: "Product", sub: "Line, family, SKU" },
      { title: "Programme", sub: "Ship & debit, SPA, rotation" },
      { title: "Registration", sub: "Design win, named account" },
      { title: "Authorised price", sub: "And its window" },
      { title: "Eligibility", sub: "Stock, tier, end customer" },
      { title: "Debit allowed", sub: "Cost less authorised" },
      { title: "Credit allowed", sub: "On repriced stock" },
      { title: "Rebate earned", sub: "On qualifying volume" },
    ],
    engine: { title: "DataTwin", sub: "Flattened to rows" },
    outputsLabel: "What every claim is tested against",
    outputs: [
      { title: "Dist A — Line A · Ship and debit", sub: "Registered · valid" },
      { title: "Dist A — Line A · Ship and debit", sub: "Not registered · reject" },
      { title: "Dist A — Line B · Price protection", sub: "Stock on hand · valid" },
      { title: "Dist B — Line A · Ship and debit", sub: "Window closed · reject" },
      { title: "Dist B — Line C · Volume rebate", sub: "Tier 2 reached · accrue" },
    ],
    resultLabel: "Why this matters",
    result:
      "A claim you cannot test is a claim you pay. Validating it against the authorisation, the POS and the stock position turns channel spend from an estimate into a number you can stand behind — read-only to start, nothing changes in your ERP or your distributor relationships.",
    footer: "Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
  },

  cards: {
    eyebrow: "The seven axes",
    title: "Your channel programmes vary along the same seven axes",
    body: "Ship and debit, price protection and stock rotation look like three problems. They are one structure with three sets of nouns, which is why they resolve on one engine rather than three tools.",
    items: [
      { tag: "Who", title: "Which distributor, at which tier", body: "The tier and the agreement decide which programmes apply and at what rate." },
      { tag: "Where", title: "Which territory or end-market", body: "Region, channel, or the named account a deviated price was registered against." },
      { tag: "What", title: "Which product it covers", body: "Line, family or SKU, and bundles the programme treats as a single item." },
      { tag: "Which programme", title: "What kind of adjustment", body: "Ship and debit, price protection, stock rotation, design registration, rebate, co-op and MDF." },
      { tag: "When", title: "In which window", body: "The authorised price window, the earning period, and the window a claim may be filed in." },
      { tag: "How much", title: "Against what measure", body: "Units sold through, value shipped, or stock on hand at the moment of a price change." },
      { tag: "How it pays", title: "Debit, credit or accrual", body: "A debit against your invoice, a credit on held stock, or a reserve that trues up later." },
    ],
    outcome: {
      tag: "The leaf",
      title: "And at the end of every path, an authorisation",
      body: "Seven answers say what this distributor was entitled to claim. Anything else is an exception, not a payment.",
    },
  },

  lanes: {
    eyebrow: "The channel",
    title: "From the authorisation to the reserve",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "Authorised",
        title: "It starts with what you actually authorised",
        lead: "Every claim rests on something you agreed: a registered design win, a named-account price, a tier the distributor reached, a price you cut on stock they were holding. If that record is scattered across portals and mail threads, the claim cannot be tested, only trusted.",
        motif: "doc",
        blocks: [
          {
            icon: "governance",
            tag: "Registrations and SPAs",
            title: "The authorisation, as rows",
            body: "Design registrations, named-account approvals and deviated prices captured with their product, customer, price and window.",
            points: [
              "Registrations and approvals held with the window they cover",
              "Deviated prices tied to the account they were granted for",
              "Extensions and amendments dated rather than overwritten",
            ],
          },
          {
            icon: "registry",
            tag: "Programme terms",
            title: "What each distributor is on",
            body: "Tier, rate, eligibility and filing rules per distributor and per programme, so no claim is judged against a general policy.",
            points: [
              "Tiers and rates per distributor, per programme, per period",
              "Eligibility rules stated rather than inferred at claim time",
              "Filing windows recorded as part of the terms",
            ],
          },
          {
            icon: "kpi",
            tag: "Effective dating",
            title: "Prices move, authorisations expire",
            body: "A price cut, a tier change or a lapsed registration each change what may be claimed, from a date. That date is carried.",
            points: [
              "Price changes effective from a date, against held stock",
              "Registrations that lapsed shown as lapsed, not silently valid",
              "Retrospective tiers recomputing the period they reprice",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        label: "Claims",
        title: "Then every claim is tested, not sampled",
        lead: "Overpayment in the channel is rarely fraud. It is a claim against a registration that expired, a unit that was never sold through, a price the distributor believed was authorised, or the same sale claimed twice under two programmes. Each one is findable, and none is findable by eye.",
        motif: "compare",
        blocks: [
          {
            icon: "recon",
            tag: "Against the authorisation",
            title: "Line by line",
            body: "Each claim line matched to the registration or agreement it cites, on product, customer, price and date.",
            points: [
              "Claims citing no valid authorisation surfaced before payment",
              "Deviated price claimed compared to the price authorised",
              "Claims outside the authorised window flagged with the date",
            ],
          },
          {
            icon: "investigation",
            tag: "Against sell-through",
            title: "Did the unit actually move",
            body: "Claims reconciled to the POS and inventory data the distributor reports, so a claim without a sale behind it does not settle.",
            points: [
              "Claimed units matched to reported sell-through",
              "Units claimed but never reported as sold, listed",
              "Stock positions used to test price protection and rotation",
            ],
          },
          {
            icon: "hygiene",
            tag: "Against each other",
            title: "One sale, one claim",
            body: "The same transaction claimed under two programmes, or by two distributors, is one of the quietest overpayments in the channel.",
            points: [
              "Duplicate and near-duplicate claims across programmes",
              "The same unit claimed by more than one counterparty",
              "Rebate and ship-and-debit claimed on the same sale, where terms exclude it",
            ],
          },
        ],
        callout: {
          tag: "A contract question",
          title: "Marginal or whole-volume is a contract question, not a product setting.",
          body: "When a distributor crosses a tier, does the better rate apply to all volume in the period or only to what falls above the band? Both appear in real programmes, and a retrospective tier can reprice volume you already settled. We read it from your terms and show which reading produced the number.",
        },
      },
      {
        id: "lane-3",
        n: "3",
        label: "Reserve",
        title: "The reserve is the number your auditor will actually test",
        lead: "Channel programmes are variable consideration. Under ASC 606 and Ind AS 115 they have to be estimated at the point of sale and re-measured every period, which makes the estimate a recurring, audit-exposed workload rather than a quarter-end task.",
        motif: "bars",
        blocks: [
          {
            icon: "elastic",
            tag: "Estimated from transactions",
            title: "Not from a percentage",
            body: "The reserve is built from eligible sales and the programme rows that govern them, so estimate and eventual claim share one basis.",
            points: [
              "Built from eligible transactions rather than a historical rate",
              "Retrospective tiers reflected as the period develops",
              "Distributor inventory carried into price protection exposure",
            ],
          },
          {
            icon: "remediation",
            tag: "Trued up with a trail",
            title: "Every period",
            body: "When claims settle, the movement between estimate and actual is posted with the transactions and programmes behind it.",
            points: [
              "Movement explained per programme and per distributor",
              "Prior-period corrections separated from current movement",
              "Settled claims reconciled back to the reserve they released",
            ],
          },
          {
            icon: "risk",
            tag: "Evidence for audit",
            title: "Assembled as it happens",
            body: "Agreement, sale, claim and settlement are held against one another, so testing the reserve is a read rather than a reconstruction.",
            points: [
              "Full population tested rather than a judgemental sample",
              "The basis of estimate documented as it was applied",
              "Every reserve movement traceable to the claims behind it",
            ],
          },
        ],
      },
      {
        id: "lane-4",
        n: "4",
        eyebrow: "The distributor portal",
        label: "Portal",
        title: "And the distributor stops emailing your channel team",
        lead: "Most of a channel team’s week is answering two questions: was my claim accepted, and why was it short-paid. A portal that shows the distributor its own claims against your authorisation record answers both, and turns a dispute into a specific line rather than a balance.",
        motif: "hub",
        blocks: [
          {
            icon: "kpi",
            tag: "Claim status, live",
            title: "With the reason attached",
            body: "Accepted, rejected or short-paid, each with the authorisation it was tested against and the rule that decided it.",
            points: [
              "Every claim with its status and the test it passed or failed",
              "Short-pay reasons visible without a phone call",
              "Registrations and authorised prices visible to the distributor",
            ],
          },
          {
            icon: "ingest",
            tag: "Tracings on arrival",
            title: "Validated at upload",
            body: "Sell-through files checked for the faults that cause rejection at upload, so a rejection does not arrive weeks later.",
            points: [
              "Format and completeness checked before submission",
              "Missing periods and duplicate files caught immediately",
              "The original file retained as evidence for the claims it supports",
            ],
          },
          {
            icon: "human",
            tag: "Disputes against a line",
            title: "Not against a total",
            body: "The distributor challenges a claim with your evidence already attached, and the exchange stays with the programme it belongs to.",
            points: [
              "Disputes raised against a claim line, not a statement",
              "Both sides working from the same authorisation record",
              "Resolution recorded against the programme it settles",
            ],
          },
        ],
      },
    ],
  },

  prevent: {
    eyebrow: "Then it runs forward",
    title: "The same rows run forward, before the claim is paid",
    body: "Prevent is not a second build. The rows that revalidated your settled claims are the rows that test the next one. That is where a one-off recovery starts compounding.",
    steps: [
      { n: "1", title: "Programme agreed", body: "Terms, tiers and eligibility become rows, tested for gaps before they govern anything." },
      { n: "2", title: "Price authorised", body: "Registrations and deviated prices captured with their window, so a claim has something to cite." },
      { n: "3", title: "Claim received", body: "Tested against the authorisation, the sell-through and the stock position, before it settles." },
      { n: "4", title: "Exception reviewed", body: "Only what the rules cannot settle reaches a person, with the difference already quantified." },
      { n: "5", title: "Reserve reported", body: "Estimate and true-up computed from the same rows that validate the claims." },
    ],
    link: { label: "How Recover becomes Prevent", href: "/platform/darp#how-it-works" },
  },

  start: {
    eyebrow: "Start here",
    title: "Before you change anything, find out what it has already cost you",
    body: "Everything above is prevention; it stops the next quarter leaking. It does nothing about the claims already settled, which are sitting in your channel history right now. So we start there, read-only, before there is anything to sign.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us the programme terms, the registrations, the claim history and the POS your distributors reported. We revalidate the full claim population, not a sample, and come back with what is recoverable, split by heading. Before any contract.",
    flow: ["Programme terms and registrations", "Claim history and reported POS", "Full claim population revalidated", "What is recoverable, by heading"],
    items: [
      { kind: "control", title: "Paid without authority", body: "Claims settled against a registration that had expired, or a price nobody authorised." },
      { kind: "apart", title: "Paid without a sale", body: "Units debited that never appear in reported sell-through, and stock claims above stock held." },
      { kind: "cash", title: "Paid twice", body: "The same sale claimed under two programmes, or by two distributors in the same period." },
      { kind: "misstated", title: "Reserved wrongly", body: "Over-accrual that inflated reported margin and then trued down, and tiers applied on the wrong reading." },
    ],
    note: "The same engine runs channel programmes for fabless and component makers, integrated device manufacturers, equipment and instrument makers, and industrial and electrical brands selling through authorised distribution.",
    cta: "Get an estimate for the channel",
    link: { label: "The distributor side", href: "/products/channel-rebates/distributors" },
  },
};
