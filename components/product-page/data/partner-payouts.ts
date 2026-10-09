import type { ProductPageData } from "../product-types";

// Partner Payouts. Wording is carried over unchanged from the existing page; layout is the new design's.

export const partnerPayouts: ProductPageData = {
  metadata: {
    title: "Partner Payouts: every scheme, computed and evidenced | DataTwin",
    description:
      "Partner payout schemes as sheets rather than code: fixed, variable, tiered, minimum guarantee and incentive, with overlap and precedence resolved, deductions netted and a statement each partner can see. We recompute your paid history first, read-only, before anything changes.",
  },

  hero: {
    eyebrow: "Partner Payouts",
    lead: ["Your contracts are not complicated.", "Paying them by hand is."],
    body: "A payout scheme is a set of conditions ending in a rate. DataTwin takes the scheme as it was agreed, turns it into rows, and computes every partner’s payout from your own volume and activity data. Tiers, slabs, guarantees, incentives and deductions all resolve in one pass. We start by recomputing periods you have already paid, read-only, so you see what the spreadsheet got wrong before you change anything.",
    proof: ["A new scheme is a new sheet, not a new build", "Slabs behave as your contract defines them", "Read-only until you turn computation on"],
    primary: "See what payouts have cost you",
    secondary: { label: "How Discover works", href: "/platform/darp#how-it-works" },
    glyphs: ["doc", "chart", "coin"],
    out: "entry",
  },

  hub: {
    eyebrow: "One scheme, two forms",
    title: "A scheme is a set of conditions ending in a rate",
    card: { title: "The scheme, as agreed → the same scheme, as rows", live: "Live process" },
    inputsLabel: "The scheme, as it was agreed",
    inputs: [
      { title: "Customer", sub: "Business model" },
      { title: "Territory", sub: "Station, cluster, block" },
      { title: "Category", sub: "And offering" },
      { title: "Resource class", sub: "The asset used" },
      { title: "Partner class", sub: "Direct or vendor" },
      { title: "Rate form", sub: "Fixed, variable, tiered" },
      { title: "Period", sub: "Month, day, slot, season" },
      { title: "Rate", sub: "Per unit or per day" },
      { title: "Slab rate", sub: "By band" },
      { title: "Guarantee", sub: "A floor, not a rate" },
    ],
    engine: { title: "DataTwin", sub: "Flattened to rows" },
    outputsLabel: "The same scheme, as rows",
    outputs: [
      { title: "Cluster 1 — Category A · Direct", sub: "Variable · 15" },
      { title: "Cluster 1 — Category A · Direct", sub: "Tier, slab 1 · 10" },
      { title: "Cluster 1 — Category A · Direct", sub: "Tier, slab 2 · 11" },
      { title: "Cluster 1 — Category A · Vendor", sub: "Fixed · 16" },
      { title: "Cluster 2 — Category B · Direct", sub: "Guarantee · floor" },
    ],
    resultLabel: "Why this matters",
    result:
      "A new scheme is a new sheet, not a new build. Six commercially different schemes are six sheets on one engine, which is why the second scheme does not wait behind an IT queue — read-only to start, nothing changes in your payout run or your ledger.",
    footer: "Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
  },

  cards: {
    eyebrow: "The seven axes",
    title: "Every payout scheme varies along the same seven axes",
    body: "Different industries use different nouns. The structure underneath does not change, which is why one engine covers a fleet operator, a distributor and an insurer without a rewrite for each.",
    items: [
      { tag: "Who", title: "Which partner, on what terms", body: "Customer, business model, and the partner class: direct, vendor, franchisee, agent." },
      { tag: "Where", title: "Where does geography bite", body: "Station, cluster, block, region, or nowhere at all when a scheme runs nationally." },
      { tag: "What", title: "Which offering it applies to", body: "Category, product, or a bundle of products treated as one line in the scheme." },
      { tag: "With what", title: "Which resource did the work", body: "Vehicle class, machine, seat, licence. The asset changes the rate." },
      { tag: "When", title: "Over what window", body: "Month, day, shift or slot, and named periods such as a festival or campaign." },
      { tag: "How much", title: "What is the rate applied to", body: "Units, volume, days present, value shipped, or a band over any of those." },
      { tag: "How it pays", title: "What shape does the money take", body: "Fixed, variable, tiered or slabbed, minimum guarantee, one-off incentive." },
    ],
    outcome: {
      tag: "The leaf",
      title: "And at the end of every path, a rate",
      body: "Seven answers select one row. That row carries the rate. Nothing about the scheme lives in code.",
    },
  },

  lanes: {
    eyebrow: "The payout",
    title: "From the contract to the payment",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "The sheet",
        title: "The scheme becomes a sheet, and the sheet is checked before it pays",
        lead: "A contract is negotiated as a tree and signed as a document. Neither form can pay anybody. It becomes payable when every path through it is a row, and the rows are tested against each other before the first run rather than after the first dispute.",
        motif: "doc",
        blocks: [
          {
            icon: "ingest",
            tag: "Captured",
            title: "From the contract, not retyped",
            body: "Rates, conditions and effective dates read off the signed agreement and turned into rows, with the source document kept against them.",
            points: [
              "Annexures, rate cards and amendments read in one pipeline",
              "Every row traceable back to the clause it came from",
              "Effective dates carried, so a rate change does not overwrite history",
            ],
          },
          {
            icon: "risk",
            tag: "Tested",
            title: "Before it goes live",
            body: "The sheet is checked for the faults that quietly double or halve a payout: gaps, overlaps, duplicates and conditions that can never be met.",
            points: [
              "Duplicate rows, and rows that differ only in the rate",
              "Bands that leave a gap, or overlap so two rates both apply",
              "Conditions no partner can satisfy, flagged rather than paid",
            ],
          },
          {
            icon: "kpi",
            tag: "Versioned",
            title: "Rates change, history should not",
            body: "Each version is dated. A rate backdated to January recomputes the periods it touches, instead of silently changing what was paid.",
            points: [
              "Retrospective changes recompute the periods they touch",
              "The difference lands as arrears or a recovery, with the reason",
              "What was paid under the old rate stays visible",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        label: "The measure",
        title: "The measure has to be right before the rate matters",
        lead: "A correct rate applied to a wrong count pays the wrong amount, and nobody notices because the rate looks right. The volume, the days and the value all come from your own systems and are reconciled before anything is multiplied.",
        motif: "converge",
        blocks: [
          {
            icon: "recon",
            tag: "Counted",
            title: "From your systems, not a summary",
            body: "Units, trips, shipments, disbursals, policies or hours taken from the transaction record itself, at the grain the scheme is written at.",
            points: [
              "Counted at the grain the scheme uses, not rolled up first",
              "Cancellations, returns and reversals removed from the count",
              "The same unit never counted under two territories",
            ],
          },
          {
            icon: "hygiene",
            tag: "Qualified",
            title: "What actually counts",
            body: "Not every unit qualifies. Exclusions in the contract are applied to the measure before any rate is chosen.",
            points: [
              "Excluded categories, customers and channels removed",
              "Attendance and activity thresholds evaluated per partner",
              "Disputed and cancelled units held out until they settle",
            ],
          },
          {
            icon: "investigation",
            tag: "Reconciled",
            title: "Against the source of truth",
            body: "The measure is agreed against the operating system before payout, so nobody is arguing about the count afterwards.",
            points: [
              "Volume agreed against the operating system, not the payout sheet",
              "Differences listed by partner and period, with the records behind them",
              "The agreed count frozen once the period closes",
            ],
          },
        ],
      },
      {
        id: "lane-3",
        n: "3",
        label: "Computation",
        title: "Then the computation, in the shape your contract actually uses",
        lead: "Most payout tools support one or two rate forms well and bend the rest to fit. Real contracts mix them inside a single period, and the mixing is the part that goes wrong.",
        motif: "tiers",
        blocks: [
          {
            icon: "accounting",
            tag: "Fixed and variable",
            title: "The straightforward half",
            body: "A rate per day, per unit or per period, applied to the qualified measure. This part is rarely where money is lost, and it is where most tools stop.",
            points: [
              "Per unit, per day, per trip, per policy or per period",
              "Multiple rates in one period, each with its own window",
              "Currency and rounding handled at the rate, not at the total",
            ],
          },
          {
            icon: "kpi",
            tag: "Tiers and slabs",
            title: "As your contract defines them",
            body: "A band pays either on the whole volume or only on the units inside it. We do not impose a convention, because contracts genuinely differ.",
            points: [
              "Whole-volume or marginal, set per scheme rather than globally",
              "Retrospective tiers that reprice earlier volume when a band is hit",
              "The band that was applied shown next to the one below it",
            ],
          },
          {
            icon: "elastic",
            tag: "Guarantees and incentives",
            title: "Floors, cliffs and one-offs",
            body: "A guarantee is a floor evaluated over a period, not a rate. An incentive often has a cliff: one unit short and the whole component is zero.",
            points: [
              "Guarantee compared against the computed total, then topped up",
              "Cliffs shown as a distance to the threshold, before the period ends",
              "Seasonal and campaign incentives applied only inside their window",
            ],
          },
        ],
        callout: {
          tag: "A contract question",
          title: "Marginal or whole-slab is a contract question, not a product setting.",
          body: "Ask whether volume of 70 against bands of 1 to 60 and 61 to 100 pays the higher rate on all 70 or on the last 10. Both are common, both are correct somewhere, and the difference is the single most frequent cause of a payout dispute. We read it from your contract and show which reading was used.",
        },
      },
      {
        id: "lane-4",
        n: "4",
        label: "Precedence",
        title: "One partner can qualify under four schemes in the same month",
        lead: "Base payout, a seasonal incentive, an attendance bonus and a minimum guarantee can all apply to the same partner in the same period. Whether they stack, whether the best one wins, or whether the guarantee absorbs the rest is a commercial decision. It should be recorded, not improvised.",
        motif: "hub",
        blocks: [
          {
            icon: "governance",
            tag: "Precedence",
            title: "Decided once, applied every time",
            body: "The order in which schemes resolve is configured with you and then applied identically to every partner and every period.",
            points: [
              "Stack, best-of, or absorb, set per pair of schemes",
              "The same rule applied to every partner, with no local exceptions",
              "A change of rule recomputes rather than applying from now on",
            ],
          },
          {
            icon: "risk",
            tag: "No double counting",
            title: "One unit, one payment",
            body: "The same volume paid under two overlapping schemes is one of the largest and quietest leaks in any payout run.",
            points: [
              "Every unit tagged with the scheme that paid for it",
              "Units claimed by two schemes surfaced before payment",
              "Overlapping territories and categories resolved explicitly",
            ],
          },
          {
            icon: "hygiene",
            tag: "The workings, kept",
            title: "Not just the answer",
            body: "For every partner and period, the computation is retained: which rows applied, in what order, against what measure.",
            points: [
              "Every payout traceable to the rows that produced it",
              "The rejected alternatives kept alongside the applied one",
              "A dispute answered from the record rather than rebuilt",
            ],
          },
        ],
      },
      {
        id: "lane-5",
        n: "5",
        label: "Deductions",
        title: "What comes off, before anything goes out",
        lead: "The gross payout is not what the partner receives. Advances, damages, shortages, asset recoveries and withholding all sit between the two, and each one is a place where a partner is either short-changed or overpaid without anyone intending it.",
        motif: "ledger",
        blocks: [
          {
            icon: "remediation",
            tag: "Recoveries",
            title: "Netted, with a reason",
            body: "Advances, equipment, damages, shortages and penalties netted against the payout, each carrying the event that caused it.",
            points: [
              "Advances recovered on the schedule that was agreed",
              "Damages and shortages linked to the incident record",
              "Nothing deducted without a reference the partner can check",
            ],
          },
          {
            icon: "wf",
            tag: "Withholding",
            title: "At the right rate, per class",
            body: "Tax withheld according to the partner class and the applicable rate, with certificates produced rather than requested later.",
            points: [
              "Rate driven by partner class and registration status",
              "Certificates generated with the payout, not at year end",
              "Thresholds tracked across the year rather than per payment",
            ],
          },
          {
            icon: "ingest",
            tag: "The payment file",
            title: "Ready to run",
            body: "The bank file and the accounting entry come from one computation, so the books and the bank cannot disagree.",
            points: [
              "One computation behind the payment file and the journal",
              "Entity, cost centre and account determined from the scheme",
              "Failed and returned payments traced back to the payout line",
            ],
          },
        ],
      },
      {
        id: "lane-6",
        n: "6",
        eyebrow: "The partner portal",
        label: "Portal",
        title: "The partner stops calling to ask how the number was reached",
        lead: "Most of a payout team’s month is not computing payouts. It is explaining them. A partner who can see their own volume, their own band and the distance to the next one asks a different and much shorter question.",
        motif: "register",
        blocks: [
          {
            icon: "kpi",
            tag: "Their own numbers",
            title: "Live, not at month end",
            body: "Volume so far, the band it currently falls in, and what has accrued. Visible during the period, when the partner can still act on it.",
            points: [
              "Running volume and accrued payout, updated as data arrives",
              "The current band and the distance to the next one",
              "Attendance and qualifying thresholds shown against the target",
            ],
          },
          {
            icon: "accounting",
            tag: "The statement",
            title: "Workings included",
            body: "Every payout line with the scheme, the rate, the measure and the deductions that produced it. The same view your team sees.",
            points: [
              "Gross, deductions and net, each with the rows behind them",
              "Downloadable statement per period, per partner",
              "Withholding certificates attached to the period they cover",
            ],
          },
          {
            icon: "human",
            tag: "Queries in one place",
            title: "Not in an inbox",
            body: "A partner disputes a line rather than an amount, your team answers against the record, and the exchange stays attached to the payout.",
            points: [
              "Disputes raised against a specific line, not a total",
              "The evidence already attached when the query opens",
              "Resolution recorded against the period it affects",
            ],
          },
        ],
      },
    ],
  },

  prevent: {
    eyebrow: "Then it runs forward",
    title: "The same sheets run forward, before the money leaves",
    body: "Prevent is not a second build. The rows that recomputed your history are the rows that compute the next run. That is where a one-off recovery starts compounding.",
    steps: [
      { n: "1", title: "Scheme agreed", body: "A new scheme becomes rows and is tested for gaps and overlaps before it is live." },
      { n: "2", title: "Measure agreed", body: "Volume and activity reconciled to the operating system and frozen for the period." },
      { n: "3", title: "Payout computed", body: "Every scheme resolved in the agreed order, tiers and guarantees together." },
      { n: "4", title: "Checked and approved", body: "Outliers and swings against prior periods surfaced before approval, not after payment." },
      { n: "5", title: "Paid and posted", body: "One computation behind the bank file, the journal and the partner statement." },
    ],
    link: { label: "How Recover becomes Prevent", href: "/platform/darp#how-it-works" },
  },

  hood: {
    eyebrow: "Under the hood",
    title: "What is actually doing the work",
    body: "Specialised agents with narrow, defined duties, coordinated by an orchestration agent. Deterministic rules run wherever something posts to the books. Nothing posts because a model was confident.",
    items: [
      { icon: "ingest", title: "Scheme Agent", tag: "Reading the agreement", body: "Contracts, annexures and rate cards read into rows, including scanned and amended documents, with each row tied to its clause." },
      { icon: "accounting", title: "Computation Agent", tag: "Applying the rows", body: "Measure qualified, schemes resolved in order, tiers and guarantees applied, and the workings kept against every payout line." },
      { icon: "risk", title: "Exception Agent", tag: "Finding what looks wrong", body: "Swings against prior periods, partners near a cliff, units claimed twice and deductions without a source, surfaced before payment." },
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
    columns: { point: "Where it shows", today: "How payouts run today", datatwin: "How they run on DataTwin" },
    rows: [
      { point: "The scheme", today: "A signed PDF, retyped into a spreadsheet by whoever owns the run", datatwin: "Rows tied to the clause they came from, tested for gaps and overlaps before they pay" },
      { point: "A new scheme", today: "A new tab, a new formula, and a person who now cannot take leave at month end", datatwin: "A new sheet on the same engine, live in the period it was agreed" },
      { point: "Tiers and slabs", today: "Whichever reading the formula happened to encode", datatwin: "Marginal or whole-volume as the contract defines it, and the reading is visible" },
      { point: "Overlapping schemes", today: "Resolved differently by different people in different months", datatwin: "One precedence rule, applied to every partner and every period" },
      { point: "Disputes", today: "Rebuilt from scratch each time, often to a different answer", datatwin: "Answered from the retained workings, in the partner portal" },
      { point: "Rate changes", today: "Backdated by editing the sheet, so history quietly changes", datatwin: "Versioned and dated; a backdated rate recomputes and raises arrears" },
      { point: "Audit", today: "Sample testing of a spreadsheet nobody fully understands", datatwin: "Every payout traceable to rows, measure and approval, across the full population" },
    ],
  },

  start: {
    eyebrow: "Start here",
    title: "Before you change anything, find out what it has already cost you",
    body: "Everything above is prevention; it stops the next run going wrong. It does nothing about the periods already paid, which are sitting in your payout history right now. So we start there, read-only, before there is anything to sign.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us the schemes and the volume history. We recompute every partner and every period across the full transaction population, not a sample, and come back with what is recoverable, split by heading. Before any contract.",
    flow: ["The schemes", "The volume history", "Every partner and period recomputed", "What is recoverable, by heading"],
    items: [
      { kind: "cash", title: "Overpaid", body: "The wrong band applied. A scheme run past its end date. A condition never actually met." },
      { kind: "apart", title: "Underpaid", body: "Volume wrongly excluded. A rate agreed and never applied. Arrears nobody asked for." },
      { kind: "misstated", title: "Paid twice", body: "The same units paid by two schemes. A guarantee topped up where the base already cleared." },
      { kind: "control", title: "Never netted", body: "Advances, damages and shortages that were never deducted, and withholding taken at the wrong rate." },
    ],
    note: "The same engine runs payouts for logistics and last-mile fleets, gig and field-force platforms, franchise networks, staffing and managed services, and bank and NBFC sourcing partners. The nouns change; the seven axes do not.",
    cta: "Get an estimate for payouts",
    link: { label: "How Discover works", href: "/platform/darp#how-it-works" },
  },
};
