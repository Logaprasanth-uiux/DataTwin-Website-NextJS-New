// Copy for the DARP Framework page (/platform/darp). Sections read from here so wording is edited in one place.

export const HERO = {
  eyebrow: "The DARP Framework",
  lead: ["The framework that helps solve", "all your finance issues"],
  body: "Discover, Assess & Recover identifies the leak and gets your money back. Prevent is your strategic solution to plug the leak for good, employing the same rules deployed during recovery.",
  proof: [
    "Read-only to start",
    "Full population, not a sample",
    "A number in about two minutes",
    "Funded by what it recovers",
    "No second build during Prevent",
  ],
} as const;

// ---- Why DARP ----------------------------------------------------------------------------------------

export const WHY = {
  eyebrow: "Why the DARP Framework",
  title: "You’ve been offered this multiple times before. And been disappointed every time.",
  body: "Every CFO we meet has already heard a version of this pitch. Here’s what was wrong with each one, and what we do instead.",
  offeredLabel: "What you’ve already been offered",
  offered: [
    {
      who: "The software vendor",
      pitch: "“Buy the platform. The business case comes with it.”",
      flaw: "The value is a projection built on someone else’s benchmark, and you pay before it’s tested against a single one of your own transactions.",
    },
    {
      who: "The recovery audit firm",
      pitch: "“We’ll find your duplicate payments for a share of what we recover.”",
      flaw: "Money comes back once. Nothing changes upstream, so the same leakage restarts the following quarter and you pay a contingency fee on it again.",
    },
    {
      who: "The controls programme",
      pitch: "“A transformation project to fix the control environment.”",
      flaw: "Long, expensive and paid up front, with the benefit still unproven at the exact point you have to commit to it.",
    },
  ],
  insteadLabel: "What DARP does instead",
  instead: [
    {
      letter: "D",
      title: "Evidence, not a benchmark",
      body: "Findings come from your own ledger, not an industry average. The number is yours because the data is yours.",
    },
    {
      letter: "A",
      title: "A number before a commitment",
      body: "The value is quantified and agreed before anyone signs for a platform. You decide with the figure in front of you.",
    },
    {
      letter: "R",
      title: "Funded by money already written off",
      body: "The engagement pays for itself out of cash the business had given up on. No new budget line to defend.",
    },
    {
      letter: "P",
      title: "Observability, not another audit",
      body: "What found the money running backwards runs forwards at transaction entry, permanently instrumented against your goals and the standards. No second build.",
    },
  ],
} as const;

// ---- One engine --------------------------------------------------------------------------------------

export const ENGINE = {
  eyebrow: "The structural point",
  title: "The diagnostic and the product are one engine pointed in two directions.",
  body: "Discover, Assess and Recover (DAR) acquires your history, processes and analyses it, and hands you the recovery actions to take. Recover first. Then, if you are happy, point the same actions forwards at transaction entry. Nothing is rebuilt, so no cost for a second build.",
  backwards: {
    tag: "Backwards · DAR",
    title: "Reads your history",
    body: "Every past transaction is tested against the rules. The output is recovery actions.",
  },
  rules: { tag: "Same rules", title: "Built once", body: "Nothing is rebuilt or re-implemented." },
  forwards: {
    tag: "Forwards · Prevent",
    title: "Guards the entry point",
    body: "The identical rules test each transaction as it arrives.",
  },
  oneliner: "That is the claim. Here is what it looked like for someone else.",
  cta: "Read a recovery case study",
} as const;

// ---- How it works ------------------------------------------------------------------------------------

export type Stage = {
  key: "discover" | "assess" | "recover" | "prevent";
  letter: string;
  timing: string;
  title: string;
  intro: string;
  need: string;
  get: string;
};

export const HOW = {
  eyebrow: "How it works",
  title: "Suspicion to proof to cash to control",
  body: "Four stages. You can stop after any of them, and most of the value arrives before you’ve committed to anything.",
  note: "Indicative for a single process area. Broader scope takes longer, and we will say so before we start rather than after.",
  discoverSteps: [
    { tag: "No contract", title: "Scope and access", body: "Agree the process area and period. You send an export, or grant read access. NDA and security review happen here." },
    { tag: "~2 minutes", title: "Discover runs", body: "The full population is tested against every rule for that area, in about two minutes of run time, not weeks of fieldwork." },
    { tag: "Same day", title: "You have the number", body: "The total recoverable figure, split across cash, tax, misstatement and control exposure. Yours to keep, whatever you decide next." },
  ],
  contract: {
    title: "Contract",
    body: "You decide here. You have a quantified number and you have paid nothing. Everything above happened on your data, with no commitment. Everything below starts once a contract is in place.",
    cta: "Get to this point",
  },
  stages: [
    {
      key: "discover",
      letter: "D",
      timing: "Before any contract",
      title: "Discover",
      intro:
        "We ingest the transaction history your systems already hold and test the full population for every anomaly, duplicate, mismatch and unclaimed entitlement.",
      need: "Read access to the relevant history, an export is enough. For payables that means AP transactions and the vendor master. We are reading, not writing.",
      get: "The total recoverable number in about two minutes of run time, yours before there is anything to sign. The waiting is access and NDA, not analysis.",
    },
    {
      key: "assess",
      letter: "A",
      timing: "After contract",
      title: "Assess",
      intro:
        "Now the number opens up. Every finding is drilled to the last level: the transaction, the clause breached, the evidence behind it. Assess ends with your sign-off on what gets pursued.",
      need: "Contracts, price agreements and program terms where they govern the amount, plus your team’s judgement on what is collectible and what is worth the relationship.",
      get: "Drill-down to the last level on every finding, a prioritised list agreed jointly, and a signed-off recovery scope before a single claim goes out.",
    },
    {
      key: "recover",
      letter: "R",
      timing: "Execution",
      title: "Recover",
      intro:
        "We do the work to bring back what you signed off. Each finding becomes an instrument to follow up with the counterparty, and we help you chase it rather than just handing you a list.",
      need: "Your existing route to the counterparty, and someone on your side to countersign what goes out.",
      get: "Debit notes, revised returns, correcting journals and dispute packs, each carrying its evidence. Cash and credit tracked through to settlement.",
    },
    {
      key: "prevent",
      letter: "P",
      timing: "The engine turns around",
      title: "Prevent",
      intro:
        "Everything until now ran over historical data. Prevent points the identical engine forwards: the same rules now test each transaction as it arrives. You built them once; they simply change direction.",
      need: "A live connection rather than an export, and agreement on who owns each exception type.",
      get: "The same tests running at the point of entry, exceptions routed with an owner and an SLA, and a leakage rate you can watch decline month over month.",
    },
  ] satisfies readonly Stage[],
  compounding:
    "Steps Assess and Recover return the money once. Prevent is the step that stops it going out again, every period, without another engagement.",
  cta: "Start with Discover",
} as const;

// ---- What Discover finds -----------------------------------------------------------------------------

export type Finding = {
  n: string;
  kind: "cash" | "tax" | "misstated" | "control";
  title: string;
  tag: string;
  cashLabel: string;
  points: readonly string[];
  valuedBy: string;
};

export const FINDS = {
  eyebrow: "What Discover finds",
  title: "Four kinds of finding, valued four different ways",
  body: "These are outcome types, not topic areas. The first two put cash back. The third is audit position with no cash attached, and we say so plainly, because that is what makes the first two credible. The fourth explains why the other three keep recurring.",
  items: [
    {
      n: "01",
      kind: "cash",
      title: "Cash recoverable",
      tag: "Money back to the bank",
      cashLabel: "Puts cash back",
      points: [
        "Duplicate and near-duplicate payments across entities",
        "Paid above contract or PO price",
        "Tier and volume discounts never applied",
        "Early-payment discounts available, not taken",
        "Credit notes and debit balances never applied",
        "Advances, deposits and retentions not recovered",
        "Quantity paid exceeds quantity received",
      ],
      valuedBy: "The delta between paid and payable, netted against open vendor balances and prior claims.",
    },
    {
      n: "02",
      kind: "tax",
      title: "Tax recoverable",
      tag: "Credit or refund",
      cashLabel: "Puts cash back",
      points: [
        "Input credit unclaimed, or taken on blocked spend",
        "Purchase register vs vendor-filed return mismatch",
        "Reverse charge missed; wrong place of supply",
        "Withholding at the wrong rate or section",
        "Thresholds missed on aggregated vendor spend",
        "Lower-deduction certificates expired or unapplied",
        "Import duty paid, credit never taken",
      ],
      valuedBy: "Credit claimable against credit at risk, with the statutory claim window checked per item.",
    },
    {
      n: "03",
      kind: "misstated",
      title: "Misstated",
      tag: "Wrong numbers, no cash",
      cashLabel: "No cash attached",
      points: [
        "Goods received, not invoiced, not accrued",
        "Accrual raised and invoice booked: double count",
        "Accruals never reversed the following period",
        "Prepaids expensed in full, not amortised",
        "Provisions never released after settlement",
        "Capex expensed; wrong entity or cost centre",
        "FX rate or rate-date errors on open balances",
      ],
      valuedBy:
        "Period-by-period P&L and balance sheet impact. No cash moves; this is the audit-readiness line.",
    },
    {
      n: "04",
      kind: "control",
      title: "Control weakness",
      tag: "Why it keeps happening",
      cashLabel: "Explains recurrence",
      points: [
        "Duplicate vendors; bank shared with an employee",
        "Bank details changed just before a large payment",
        "Invoices repeatedly just under approval limits",
        "Self-approval or approval beyond delegated authority",
        "Non-PO spend, retrospective POs, wide tolerances",
        "Vendor master edited by the payment approver",
        "MSME timelines and sanctions screening breached",
      ],
      valuedBy:
        "By recurrence rate and exposure across the population, not by the size of any one instance.",
    },
  ] satisfies readonly Finding[],
  prompt: "Recognise one of these? Tell us which, and we will show you where we would look.",
  cta: "Discover Your Number?",
} as const;

// ---- The objection -----------------------------------------------------------------------------------

export const AUDIT = {
  eyebrow: "The objection",
  title: "“Our auditors already do this”",
  body: "They don’t, and it isn’t a criticism of them. An audit exists to form an opinion, not to find money, and those two jobs need different methods.",
  audit: {
    label: "The audit approach",
    title: "A sample, against a materiality threshold",
    paras: [
      "Items below materiality are out of scope by design. What comes back is a set of instances (this invoice, that approval) sufficient to support an opinion on the financial statements.",
      "It cannot tell you the rate at which something happens, and it cannot see the thousands of small items that are individually immaterial and collectively worth recovering.",
    ],
  },
  darp: {
    label: "The DARP approach",
    title: "The full population, then every transaction as it lands",
    paras: [
      "Discover tests every transaction in the history against every rule. Nothing is out of scope for being small, because the value is in the aggregate, and the aggregate is where recovery lives.",
      "Reading everything reports rates, not instances. A rate tells you whether you have an incident or a broken process, which is exactly what makes the case for prevention.",
    ],
  },
  closing:
    "Then Prevent keeps it running. The same tests fire on each transaction in near real time, as it arrives, so the population is never re-sampled after the fact. An audit looks backwards once a year; DARP looks backwards once and then never stops looking forwards.",
  soon: ["How full-population testing works", "Glossary: sampling, materiality, N-way"],
} as const;

// ---- What it costs -----------------------------------------------------------------------------------

export const COST = {
  eyebrow: "What it costs you to find out",
  title: "Almost nothing, and that is the point",
  body: "The barrier to knowing what you are losing should not be another project. Here is the entire ask.",
  items: [
    {
      icon: "read",
      title: "Read access, nothing more",
      body: "An export of the relevant history is enough to start. We do not write to your systems, we do not need a sandbox, and nobody on your team changes how they work.",
    },
    {
      icon: "shield",
      title: "Handled to enterprise standard",
      body: "ISO 27001 certified and SOC 2 attested, with role-based access and an immutable audit trail on every record. Cloud agnostic: AWS, Azure, GCP or your own private cloud.",
    },
    {
      icon: "apart",
      title: "No counterparty cooperation",
      body: "Discover runs entirely on data you already own. Your vendors, distributors and customers are not involved until you decide to pursue something.",
    },
  ],
  ask: "That is the entire ask.",
  equation: ["One export", "~2 min run time", "you know"],
} as const;

// ---- How it is paid for ------------------------------------------------------------------------------

export const PAID = {
  eyebrow: "How it is paid for",
  title: "The top half pays for the bottom half",
  body: "If a room only remembers one thing about DARP, this is the thing worth remembering.",
  top: {
    tag: "One-off · Discover, Assess, Recover",
    title: "Funded by money already written off",
    body: "The diagnostic and the recovery are paid for out of cash the business had given up on, not from a new budget line you have to defend. You are not being asked to believe a business case, because by the time there is a decision to make, the number is already yours and it came from your own ledger.",
  },
  flow: "recovered cash funds this",
  bottom: {
    tag: "Recurring · Prevent",
    title: "The part that renews",
    body: "Prevention is a subscription because it is a product that keeps running, not a project that ends. And because the rule set already exists, there is no second implementation to pay for, which is the only reason recovery can fund prevention instead of competing with it for the same budget.",
  },
  closing: "The only figure that matters is yours. It takes one data export to find it.",
  cta: "Recover Your Number",
} as const;

// ---- Where DARP applies ------------------------------------------------------------------------------

export const APPLIES = {
  eyebrow: "Where DARP applies",
  title: "Anywhere there is a reconciliation",
  body: "DARP is not a channel product. It works wherever two or more records are supposed to agree and nobody has the time to prove it, and the more sources a reconciliation spans, the more it finds. Two-way is useful. N-way is where the value compounds.",
  items: [
    {
      title: "Vendor reconciliation (AP)",
      body: "Invoice against PO against goods receipt against contract price against payment. Duplicates, overpayments, discounts never taken and balances never applied surface where those five stop agreeing.",
    },
    {
      title: "Customer reconciliation (AR)",
      body: "Invoice against receipt against bank against gateway settlement, many-to-many. Withheld tax separated from genuine shortfall, so what is truly collectible is stated invoice by invoice.",
    },
    {
      title: "Taxation (both sides)",
      body: "Purchase register against vendor-filed returns; output tax against invoices raised; withholding against certificates held. Each item checked against the statutory window still open to it.",
    },
    {
      title: "Channel rebates & claims",
      badge: "Sharpest case",
      body: "The sharpest case, because the counterparty controls the evidence. Claims re-priced against the agreement in force on the resale date and tested against POS, roster and shipment history.",
    },
    {
      title: "Inter-company & the close",
      body: "Sub-ledger to GL, inter-company balances, accruals and provisions, prepaid schedules, FX revaluation. Where the reconciliation is the close, the finding is a cleaner sign-off.",
    },
    {
      title: "Payouts, commissions & incentives",
      body: "Agreement against activity against what was actually paid. Money owed to a third party, calculated outside the ERP, is reconciled the same way as everything else.",
    },
  ],
  twoWay: "Two-way",
  nWay: "N-way · where the money hides",
  nWayBody:
    "The harder the reconciliation, the more DARP is worth. A two-way match between two clean systems is something a competent team already does. A reconciliation spanning five sources, in four formats, against terms that live in a contract nobody has opened since signing, that is where the money hides, and it is precisely the work that never gets done by hand.",
  cta: "Tell us your situation",
} as const;

// ---- FAQ ---------------------------------------------------------------------------------------------

export const FAQ = {
  eyebrow: "Questions we get asked",
  title: "Before you send us anything",
  items: [
    {
      q: "What exactly do you need to run Discover?",
      a: [
        "Read access to the transaction history for one process area, and the master data that governs it. For payables that is AP transactions plus the vendor master; for channel rebates it is claims, POS files, contracts and shipment history. An export is enough, a live connection is only needed at the Prevent stage.",
      ],
    },
    {
      q: "How long does it take to get a number?",
      a: [
        "The Discover run itself takes about two minutes. Once the data is in, the full population is tested against every rule for that process area and the total recoverable figure comes back split across cash, tax, misstatement and control exposure.",
        "What takes longer is everything around it, agreeing scope, NDA, your security review, and pulling the extract. That is usually days rather than weeks, and none of it is analysis time. Nobody spends a quarter in fieldwork before you see a figure.",
      ],
    },
    {
      q: "Do our vendors, distributors or customers need to be involved?",
      a: [
        "Not for Discover or Assess. Both run entirely on data you already hold, which is why the first conversation costs nothing but data access. Counterparties only enter the picture at Recover, and only for the findings you decide to pursue.",
      ],
    },
    {
      q: "How is this different from our recovery audit firm?",
      a: [
        "Three ways. They sample; we read the full population. They take a contingency share and leave, so the same finding recurs next year; we turn each root cause into a control that runs at transaction entry. And their output is their file, ours is a system of record you keep, with the evidence attached to every finding.",
      ],
    },
    {
      q: "What if you don’t find much?",
      a: [
        "Then we tell you that, and you owe us nothing. Discover runs before any contract exists.",
        "You still end up with something useful: independent evidence, tested across your full transaction population rather than a sample, that this process is clean. That is a straight answer to a question your board or your auditors will ask eventually, and it cost you one data export.",
        "We would far rather report a small number than talk you into a big one we cannot stand behind. The number has to survive your team, your auditor and the counterparty you send a claim to.",
      ],
    },
    {
      q: "Does control weakness actually return cash?",
      a: [
        "Mostly it does not, and we say so up front. Cash only comes back where a loss actually crystallised. The value in that column is avoided loss and audit position, and being straight about it is what makes the cash and tax numbers credible.",
      ],
    },
    {
      q: "Do we have to take Prevent?",
      a: [
        "No. You can stop after Recover with the cash and the findings. Prevent exists because the alternative is running the same diagnostic again next year, and since the rules already exist, turning them forwards is a deployment rather than a fresh build.",
      ],
    },
    {
      q: "Where does our data sit?",
      a: [
        "It depends on the stage, and the distinction matters.",
        "Discover and Assess run in the DataTwin cloud. You send an extract, we analyse it there, and you get the findings back, so there is nothing to install and no infrastructure decision to make before you know whether the number is worth acting on.",
        "Prevent is deployed wherever you want it. It is cloud agnostic and runs on AWS, Azure, GCP or your own private cloud, so the system that sits permanently alongside your ERP lives inside your own estate and under your own controls.",
        "Throughout: ISO 27001 certified, SOC 2 attested, role-based access, data residency options and an immutable audit trail on every record.",
      ],
    },
  ],
  stillLabel: "Still something we have not answered?",
  cta: "Ask it directly",
} as const;
