import type { ProductPageData } from "../product-types";

// Sales Commissions & Incentives. Wording is carried over unchanged from the existing page; layout is the new design's.

export const salesCommissions: ProductPageData = {
  metadata: {
    title: "Sales Commissions and Incentives: computed, evidenced, visible | DataTwin",
    description:
      "Commission plans as sheets rather than spreadsheet formulas: quota attainment, tiers and accelerators, splits and overlays, draws and clawbacks, all computed from your own bookings. Reps see their own numbers. We recompute paid periods first, read-only, before anything changes.",
  },

  hero: {
    eyebrow: "Sales Commissions & Incentives",
    lead: ["Every rep keeps a shadow spreadsheet.", "They are not wrong to."],
    body: "A commission plan is a set of conditions ending in a rate. DataTwin takes the plan as it was written, turns it into rows, and computes every statement from your own bookings and collections. Attainment, tiers, accelerators, splits, draws and clawbacks resolve together. We start by recomputing periods you have already paid, read-only, so you find out whether the shadow spreadsheets were right.",
    proof: ["A plan change is a change to rows, not code", "Tiers behave as your plan defines them", "Read-only until you turn computation on"],
    primary: "See what commissions have cost you",
    secondary: { label: "How Discover works", href: "/platform/darp#how-it-works" },
    glyphs: ["doc", "receipt", "coin"],
    out: "chart",
  },

  hub: {
    eyebrow: "One plan, two forms",
    title: "A plan is a set of conditions ending in a rate",
    card: { title: "The plan, as written → the same plan, as rows", live: "Live process" },
    inputsLabel: "The plan, as it was written",
    inputs: [
      { title: "Rep", sub: "And role" },
      { title: "Territory", sub: "Region, segment, named" },
      { title: "Offering", sub: "Product or line" },
      { title: "Credit", sub: "Full, split, overlay" },
      { title: "Attainment", sub: "Against quota" },
      { title: "Rate form", sub: "Flat, tiered, accelerated" },
      { title: "Period", sub: "Month, quarter, year" },
      { title: "Rate", sub: "Percent or per deal" },
      { title: "Accelerator", sub: "Above target" },
      { title: "Draw", sub: "A floor, then recovered" },
    ],
    engine: { title: "DataTwin", sub: "Flattened to rows" },
    outputsLabel: "The same plan, as rows",
    outputs: [
      { title: "West — New business · Full", sub: "To 80% · 4%" },
      { title: "West — New business · Full", sub: "80 to 100% · 6%" },
      { title: "West — New business · Full", sub: "Above 100% · 9%" },
      { title: "West — Renewal · Full", sub: "Any · 1.5%" },
      { title: "West — New business · Split 50", sub: "Any · half" },
    ],
    resultLabel: "Why this matters",
    result:
      "A plan change is a change to rows, not to code. Which is why a mid-year plan revision can be modelled against last quarter before anyone signs it, and applied the month it was agreed — read-only to start, nothing changes in your CRM or your payroll run.",
    footer: "Every stage runs on the same engine that powers the DARP Framework and FSCP: acquire, process, govern, report.",
  },

  cards: {
    eyebrow: "The seven axes",
    title: "Every commission plan varies along the same seven axes",
    body: "A logistics payout, a distributor rebate and a sales commission are the same structure with different nouns. That is why one engine covers all three, and why your plan does not need a product built around it.",
    items: [
      { tag: "Who", title: "Which seller, in which role", body: "Rep, manager, overlay, partner-sourced. The role decides which plan applies." },
      { tag: "Where", title: "Which territory or segment", body: "Region, vertical, named-account list, or a house account nobody is paid on." },
      { tag: "What", title: "Which offering it applies to", body: "New business, renewal, expansion, services, hardware. Each often carries its own rate." },
      { tag: "Whose deal", title: "How the credit is split", body: "Full credit, a split between reps, an overlay paid alongside, or a manager rollup." },
      { tag: "When", title: "Which period does it land in", body: "Booking, invoice or cash date, and the quarter or year quota is measured over." },
      { tag: "How much", title: "Attainment against what", body: "Revenue, margin, units or ACV, measured against a quota that can itself change." },
      { tag: "How it pays", title: "What shape does the money take", body: "Flat percent, tiered, accelerated above target, capped, drawn against, or clawed back." },
    ],
    outcome: {
      tag: "The leaf",
      title: "And at the end of every path, a rate",
      body: "Seven answers select one row. That row carries the rate. Nothing about the plan lives in code.",
    },
  },

  lanes: {
    eyebrow: "The commission",
    title: "From the plan to the statement",
    laneWord: "Part",
    items: [
      {
        id: "lane-1",
        n: "1",
        label: "The sheet",
        title: "The plan becomes a sheet, and the sheet is tested before anyone is paid on it",
        lead: "A comp plan is written as a document, argued over, signed, and then retyped into formulas by one person in finance. The document and the formulas drift apart from the first amendment. Here the plan is rows, and the rows are tested before the first statement.",
        motif: "doc",
        blocks: [
          {
            icon: "ingest",
            tag: "Captured",
            title: "From the plan, not retyped",
            body: "Rates, quotas, thresholds and dates read off the signed plan and its amendments, with each row tied back to the clause that set it.",
            points: [
              "Plan documents, quota letters and amendments read together",
              "Every row traceable to the clause behind it",
              "Per-rep variations carried without a separate spreadsheet",
            ],
          },
          {
            icon: "risk",
            tag: "Tested",
            title: "Before it goes live",
            body: "Checked for the faults that make a plan unpayable: bands that gap or overlap, targets nobody can reach, rates that contradict the plan.",
            points: [
              "Attainment bands that leave a gap or overlap",
              "Thresholds no territory can reach on its own quota",
              "Rows that disagree with the signed plan, listed before payment",
            ],
          },
          {
            icon: "kpi",
            tag: "Versioned",
            title: "Plans change mid-year",
            body: "Quota changes, territory moves and mid-year revisions are dated. What was earned under the old plan stays as it was earned.",
            points: [
              "Territory and quota changes effective from a date, not a file save",
              "Mid-year revisions recompute only the periods they touch",
              "The difference lands as an adjustment, with the reason attached",
            ],
          },
        ],
      },
      {
        id: "lane-2",
        n: "2",
        label: "Credit",
        title: "Most disputes are about credit, not about rate",
        lead: "Reps rarely argue that the percentage is wrong. They argue that the deal was theirs, that the split was not what was agreed, or that the booking landed in the wrong quarter. Crediting is decided from the record rather than from whoever escalates hardest.",
        motif: "match",
        blocks: [
          {
            icon: "registry",
            tag: "Whose deal",
            title: "Decided from the record",
            body: "Credit assigned from the account, territory and opportunity data you already hold, on the rules the plan states.",
            points: [
              "Territory, named account and segment rules applied in order",
              "House and unassigned accounts handled explicitly, not by default",
              "Reassignments effective from a date, with the deals they move",
            ],
          },
          {
            icon: "recon",
            tag: "Splits and overlays",
            title: "More than one person paid",
            body: "A deal split between reps, an overlay specialist paid alongside, and a manager rollup are all computed from the same booking.",
            points: [
              "Splits by percentage or by line, as the plan defines them",
              "Overlay and specialist credit that does not reduce the rep credit",
              "Manager rollup computed from the team, not re-keyed",
            ],
          },
          {
            icon: "elastic",
            tag: "Which period",
            title: "Booking, invoice or cash",
            body: "A deal credited on booking pays earlier than one credited on cash. The plan says which, and the computation follows it rather than convention.",
            points: [
              "Credit date driven by the plan, per offering if it differs",
              "Amendments, upsells and cancellations moved to the right period",
              "Deals crossing a period boundary held to one side, not both",
            ],
          },
        ],
      },
      {
        id: "lane-3",
        n: "3",
        label: "Computation",
        title: "Then the computation, in the shape your plan actually uses",
        lead: "Flat percentages are easy and rare. Real plans mix a tiered rate on new business with a flat rate on renewals, an accelerator above target, a cap somewhere, and a draw underneath it all.",
        motif: "tiers",
        blocks: [
          {
            icon: "kpi",
            tag: "Attainment",
            title: "Against a moving quota",
            body: "Measured on the basis the plan names, against a quota that can change mid-period, with the change carried through the bands.",
            points: [
              "Revenue, margin, units or ACV, as the plan defines attainment",
              "Quota changes applied from their effective date",
              "Prior-period adjustments flowed into the right attainment",
            ],
          },
          {
            icon: "accounting",
            tag: "Tiers and accelerators",
            title: "As your plan defines them",
            body: "A band pays either on all attainment or only on what falls inside it. We do not impose a convention, because plans genuinely differ.",
            points: [
              "Whole-attainment or marginal, set per plan rather than globally",
              "Accelerators above target, and caps where the plan sets one",
              "The band applied shown next to the one below it",
            ],
          },
          {
            icon: "remediation",
            tag: "Draws and clawbacks",
            title: "Floors and reversals",
            body: "A draw is a floor recovered later, not a rate. A clawback reverses commission when the deal it rested on does not hold.",
            points: [
              "Recoverable and non-recoverable draws tracked to their balance",
              "Clawback triggered by cancellation, churn or non-payment",
              "Recovery scheduled rather than taken in one shock",
            ],
          },
        ],
        callout: {
          tag: "A plan question",
          title: "Marginal or whole-attainment is a plan question, not a product setting.",
          body: "At 110% of quota, does the accelerator pay on all 110 or only on the last 10? Both are written into real plans, both are correct somewhere, and the difference is the most common cause of a commission dispute. We read it from your plan document and show which reading was used on every statement.",
        },
      },
      {
        id: "lane-4",
        n: "4",
        label: "Statement",
        title: "The statement is the product, and it should answer the question before it is asked",
        lead: "A statement showing a single number invites a call. A statement showing the deals, the attainment, the band and the distance to the next one answers most of what the rep wanted to know, and turns the rest into a specific question.",
        motif: "register",
        blocks: [
          {
            icon: "kpi",
            tag: "Their own numbers",
            title: "Live, not at quarter end",
            body: "Attainment so far, the band it currently falls in, accrued commission, and what the next deal is worth. Visible while the rep can still act on it.",
            points: [
              "Running attainment and accrued commission, updated as deals close",
              "The current band and the distance to the next one",
              "What the next unit of attainment pays, at the current band",
            ],
          },
          {
            icon: "accounting",
            tag: "The workings",
            title: "Deal by deal",
            body: "Every deal that contributed, the credit applied, the rate that paid it, and any split or clawback against it.",
            points: [
              "Each deal with its credit, rate and the row that produced it",
              "Splits and overlays shown from both sides",
              "Adjustments and clawbacks carrying the event that caused them",
            ],
          },
          {
            icon: "human",
            tag: "Queries in one place",
            title: "Not in an inbox",
            body: "A rep disputes a deal rather than a total, the evidence is already attached, and the answer stays with the period it affects.",
            points: [
              "Disputes raised against a specific deal, not a statement total",
              "Manager and finance see the same record the rep sees",
              "Resolution recorded against the period, and the plan row",
            ],
          },
        ],
      },
    ],
  },

  prevent: {
    eyebrow: "Then it runs forward",
    title: "The same sheets run forward, before the statement goes out",
    body: "Prevent is not a second build. The rows that recomputed your history are the rows that compute next quarter. That is where a one-off correction starts compounding.",
    steps: [
      { n: "1", title: "Plan agreed", body: "A new plan becomes rows and is tested for gaps and unreachable targets before it is live." },
      { n: "2", title: "Credit assigned", body: "Every booking credited on the plan rules, with splits and overlays resolved at the same time." },
      { n: "3", title: "Commission computed", body: "Attainment measured, bands applied, draws and clawbacks resolved in one pass." },
      { n: "4", title: "Checked and approved", body: "Outliers, large swings and negative statements surfaced for a person before the run." },
      { n: "5", title: "Paid and posted", body: "One computation behind the payroll file, the accrual and the rep statement." },
    ],
    link: { label: "How Recover becomes Prevent", href: "/platform/darp#how-it-works" },
  },

  changes: {
    eyebrow: "What changes",
    title: "What changes, honestly stated",
    body: "Not a longer list of features. A different distribution of who does what, and when a difference is found.",
    columns: { point: "Where it shows", today: "How commissions run today", datatwin: "How they run on DataTwin" },
    rows: [
      { point: "The plan", today: "A signed document, and a workbook that no longer matches it", datatwin: "Rows tied to the clause they came from, tested before anyone is paid on them" },
      { point: "Crediting", today: "Settled by whoever escalates hardest", datatwin: "Assigned from the account and territory record, on the rules the plan states" },
      { point: "Tiers", today: "Whichever reading the formula happened to encode", datatwin: "Marginal or whole-attainment as the plan defines it, and the reading is visible" },
      { point: "Visibility", today: "A number at quarter end, and a shadow spreadsheet all quarter", datatwin: "Live attainment, current band and the value of the next deal" },
      { point: "Disputes", today: "Rebuilt by hand, often to a different answer", datatwin: "Answered from the retained workings, against a named deal" },
      { point: "Plan changes", today: "A new workbook, and history quietly rewritten", datatwin: "Versioned and dated; a revision recomputes only what it touches" },
      { point: "Audit and accrual", today: "A quarter-end reconstruction nobody enjoys", datatwin: "Accrual computed from the same rows that pay, across the full population" },
    ],
  },

  start: {
    eyebrow: "Start here",
    title: "Before you change the plan, find out what the last one cost you",
    body: "Everything above is prevention; it stops the next quarter going wrong. It does nothing about the quarters already paid, which are sitting in your commission history right now. So we start there, read-only, before there is anything to sign.",
    stat: { value: "2", unit: "min", text: "This is how long it takes to understand how much can be recovered." },
    how: "Send us the plan documents and the booking history. We recompute every rep and every period across the full population, not a sample, and come back with what is recoverable, split by heading. Before any contract.",
    flow: ["The plan documents", "The booking history", "Every rep and period recomputed", "What is recoverable, by heading"],
    items: [
      { kind: "cash", title: "Overpaid", body: "The wrong band applied. An accelerator paid below target. A cap the workbook never enforced." },
      { kind: "apart", title: "Underpaid", body: "Deals credited to nobody. Splits never applied. Quota changes agreed and never carried through." },
      { kind: "misstated", title: "Paid twice", body: "The same deal credited to a rep and an overlay as if both were the primary earner." },
      { kind: "control", title: "Never recovered", body: "Draws that were never repaid, and clawbacks on cancelled deals that nobody raised." },
    ],
    note: "The same engine runs incentive plans for software and SaaS, insurance agency and broker networks, bank and NBFC sourcing teams, pharma and medical field forces, and real estate. The nouns change; the seven axes do not.",
    cta: "Get an estimate for commissions",
    link: { label: "How Discover works", href: "/platform/darp#how-it-works" },
  },
};
