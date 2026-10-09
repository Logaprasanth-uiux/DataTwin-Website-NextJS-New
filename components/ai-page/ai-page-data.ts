// Copy for the How AI is used page (/platform/how-ai-is-used). Sections read from here so wording is edited in one place.

import type { AiIconName } from "./AiArt";

export const HERO = {
  eyebrow: "Across every stage of the platform",
  lead: ["Agents do the work.", "Rules do the posting."],
  body: "DataTwin is a multi-agent system: specialised agents with exclusive duties, cognitive interpretation of policies and contracts, humans at the control gates, and deterministic rules wherever something becomes an entry in your books. Here is exactly where each one operates.",
  capabilities: [
    { n: "01", icon: "multi", title: "Multi-agent framework", body: "Specialised agents with exclusive duties. Plug-and-play for new rules and geographies." },
    { n: "02", icon: "cognitive", title: "Cognitive + logical", body: "Interprets policies and contracts. Real-time decisions and escalations." },
    { n: "03", icon: "human", title: "Human-in-the-loop", body: "Intervention only at control gates, with an audit-ready accountability trail." },
    { n: "04", icon: "elastic", title: "Elastic scalability", body: "Compute and agents auto-scale for month-end and quarter-end peaks, so a first pass returns a number in about two minutes." },
    { n: "05", icon: "learning", title: "Continuous learning", body: "Feedback loops from exceptions and audits. RAG keeps rules current." },
  ] satisfies readonly { n: string; icon: AiIconName; title: string; body: string }[],
} as const;

// ---- The architecture ----------------------------------------------------------------------------------------

type Agent = { icon: AiIconName; name: string; body: string };

export const ARCH = {
  eyebrow: "The architecture",
  title: "Not one model. A team of specialists.",
  body: "A single general-purpose model asked to do everything is neither accurate nor auditable. DataTwin runs specialised agents, each with a narrow remit and a defined output, coordinated by an orchestration layer that decides what runs, in what order, and when a human is needed.",
  orchestrator: {
    icon: "orchestration",
    name: "Orchestration Agent",
    body: "Sits above everything else. Sequences the specialists, classifies what each finding is and how severe it is, routes work to the right agent or the right person, and holds the accountability trail that ties every agent action and human decision together.",
  } satisfies Agent,
  groups: [
    {
      title: "Intake & understanding",
      sub: "Getting data in, whatever shape it arrives in, and working out what it actually is.",
      agents: [
        { icon: "ingest", name: "Ingest Agent", body: "Email inbox listener, SFTP and shared folders, PDFs, Excel and CSV, images. It watches the channels rather than waiting to be fed." },
        { icon: "hygiene", name: "Data Hygiene Agent", body: "Duplicate checks by reference and checksum, multi-page document structure, multilingual documents, handwritten pages, document classification." },
        { icon: "registry", name: "Registry Agent", body: "Determines the vendor, item, tax, cost centre and company each record belongs to: the identity resolution that everything downstream depends on." },
      ],
    },
    {
      title: "Judgement & control",
      sub: "Interpreting the rules that govern a transaction, and spotting what should not be there.",
      agents: [
        { icon: "governance", name: "Governance Agent", body: "Interprets company policy, location-specific policy, accounting policies and principles, reporting standards, and the agreements and contracts that set the terms." },
        { icon: "risk", name: "Risk Intelligence Agent", body: "Pattern recognition, fraud scenario recognition, segregation-of-duties reasoning and contextual risk scoring, running continuously rather than at audit time." },
        { icon: "wf", name: "WF & Compliance Agent", body: "Tax jurisdiction rules, reverse charge, exemption and certificate handling, HSN/SAC classification, withholding, cross-border and taxability mapping." },
      ],
    },
    {
      title: "Resolution & reporting",
      sub: "Reconciling, explaining, correcting and telling people what happened.",
      agents: [
        { icon: "recon", name: "Recon Agent", body: "Fusion across vendor, PO, GRN and bill, and beyond AP into timesheets, expenses and gateway settlements. N-way, not two-way." },
        { icon: "investigation", name: "Investigation Agent (RCA)", body: "Deep-dives a flagged anomaly, finds the root cause, whether fraud, error or process gap, collects the evidence and recommends the corrective action." },
        { icon: "accounting", name: "Accounting Agent", body: "Expense and payment accounting, accrual handling, cost and management accounting. Produces the correct treatment, for a human to release." },
        { icon: "remediation", name: "Remediation Agent", body: "Fixes data gaps, resubmits, and closes the loop so the same exception does not return next cycle." },
        { icon: "kpi", name: "KPI & Communication Agent", body: "Touchless rate, exception rate, cycle time, SLA monitoring, exception heatmaps by vendor, and proactive alerts on breaches and holds." },
      ],
    },
  ] satisfies readonly { title: string; sub: string; agents: readonly Agent[] }[],
} as const;

// ---- Underneath the agents -----------------------------------------------------------------------------------

export const ENGINES = {
  eyebrow: "Underneath the agents",
  title: "Three engines the agents call on",
  items: [
    {
      kind: "ocr",
      title: "DataTwin OCR Models",
      tag: "Reading what arrives",
      body: "Purpose-trained for finance documents rather than general text. Invoices in any layout, multi-page and multi-language documents, handwritten annotations, payment screenshots and gateway reports, at line level, not just header.",
    },
    {
      kind: "rag",
      title: "DataTwin RAG Models",
      tag: "Knowing the rules that apply",
      body: "Retrieval over your own contracts, price agreements, tax positions and policies, so an agent reasons against your terms as they stood on the relevant date, not a generic interpretation. This is how rules stay current as agreements change.",
    },
    {
      kind: "audere",
      title: "AUDERE",
      tag: "Autonomous Data Engineering & Recon Engine",
      body: "The part that models a source it has never seen, builds the schema, applies the SCDP transformations and runs the reconciliation. It is why a new entity or distributor format does not need a mapping project first.",
    },
  ],
  vocabulary: "The vocabulary here, from SCDP and N-way to RAG and full population, is all defined in plain language.",
  soon: ["Glossary", "Guides on how the engine works"],
} as const;

// ---- In practice ---------------------------------------------------------------------------------------------

export const PRACTICE = {
  eyebrow: "In practice",
  title: "Four places the intelligence does the work",
  body: "Concretely, on the platform, today, not on a roadmap. These are the same four capabilities summarised on the Platform overview, described here with the engines behind them.",
  items: [
    {
      kind: "source",
      title: "It models new sources for itself",
      body: "A distributor with their own claim format, a bank whose statement layout matches nobody else’s, an entity from an acquisition. AUDERE reads it, infers what each field means and builds the acquisition model. No mapping spreadsheet.",
    },
    {
      kind: "schema",
      title: "It builds the schema from your requirement",
      body: "Describe what needs reconciling and against what. The engine elicits the detail, then constructs the schema, rules and checks included, for entities it has never handled. SCDP makes that possible: transformation is declared, not coded.",
    },
    {
      kind: "reason",
      title: "It reasons through the hard reconciliations",
      body: "Identifiers that disagree across systems. A fact that only exists inside a clause. An answer that depends on context spread across records. A rules engine stops there; reasoning resolves those faster than a manual queue.",
    },
    {
      kind: "terms",
      title: "It reads the documents that hold the terms",
      body: "The governing fact in finance is usually in a document: a clause, a certificate, a roster, a remittance. OCR and RAG let an agent cite the term that governed a transaction, which is what a counterparty will accept.",
    },
  ],
  prompt: "Easier to judge on your own data than from a description.",
} as const;

// ---- Closed-loop assurance -----------------------------------------------------------------------------------

export const LOOP = {
  eyebrow: "Closed-loop assurance",
  title: "Stop it at source. Investigate what got through.",
  body: "Two directions running at once, one preventing and one correcting, each feeding the other.",
  preventive: {
    tag: "Preventive",
    title: "Applies policy before anything posts",
    points: [
      "Rules and policies applied before the entry is created",
      "Errors stopped at source: two-way and three-way match, approval limits",
      "Continuous preventive checks on master data, thresholds and cut-offs",
      "Eligibility and tax treatment determined at bill creation, not at close",
    ],
    agents: "Governance, Risk Intelligence, WF & Compliance",
  },
  corrective: {
    tag: "Corrective",
    title: "Deep-dives whatever still gets flagged",
    points: [
      "Anomaly investigated after it is raised, not filed for later",
      "Root cause identified: fraud, error or process gap",
      "Evidence collected and a corrective action recommended",
      "The fix feeds back as a new preventive rule, so it does not recur",
    ],
    agents: "Investigation, Recon, Remediation",
  },
  flowTitle: "Exception to remediation, end to end",
  steps: [
    { n: "01", title: "Detect", body: "Governance, Risk and Compliance agents flag the anomaly as it appears." },
    { n: "02", title: "Classify", body: "Orchestration assigns a type and a severity, so response matches the risk." },
    { n: "03", title: "Route", body: "Sent to remediation, or to a named human where judgement is required." },
    { n: "04", title: "Remediate", body: "Data gaps fixed, corrections prepared, the item resubmitted." },
    { n: "05", title: "Close & learn", body: "Resolved, and the outcome feeds back to improve the next cycle." },
  ],
  prompt: "Which of your exceptions never get closed? That is usually where we start.",
  cta: "Tell us your situation",
  agentsLabel: "Agents:",
} as const;

// ---- Human-in-the-loop ---------------------------------------------------------------------------------------

export const HITL = {
  eyebrow: "Human-in-the-loop",
  title: "People at the control gates, not in the queue",
  body: "AI handles the volume. Humans are involved where judgement, authority or accountability genuinely requires a person, and every one of those decisions is logged alongside the agent actions around it.",
  items: [
    { icon: "inputs", title: "Providing missing inputs", body: "A human enriches the packet where something simply is not in the data: a missing PO number, a tax certificate, vendor KYC." },
    { icon: "correct", title: "Correcting the AI’s course", body: "Reviewers accept, adjust or reject agent recommendations, such as an exception waiver or a policy override, and the correction is captured." },
    { icon: "guidance", title: "Approver guidance", body: "The agent recommends approve or reject with its reasoning attached. The person still decides, but not from a blank screen." },
    { icon: "arbitrate", title: "Exception arbitration", body: "Where two agents reach different conclusions, a human resolves the conflict rather than the system silently picking one." },
    { icon: "escalate", title: "Escalation handling", body: "Complex or high-value cases route to Controllers for sign-off, with thresholds you set rather than ones we assume." },
    { icon: "calibrate", title: "Policy calibration", body: "Reviewer corrections feed back into the Governance and Compliance agents, so the same judgement does not have to be made twice." },
  ] satisfies readonly { icon: AiIconName; title: string; body: string }[],
  prompt: "How other finance teams have set their control gates.",
  caseStudy: "Read a case study",
  writing: { label: "Writing on AI governance in finance", href: "/#outcomes" },
} as const;

// ---- The line we do not cross --------------------------------------------------------------------------------

export const LINE = {
  eyebrow: "The line we do not cross",
  lead: ["Nothing posts to your books", "because a model was confident."],
  paras: [
    "Every value that becomes an entry is produced or gated by explicit, inspectable, versioned rules. You can read the rule, see which version produced a finding, and trace it to the source record and the document behind it. Where an agent contributed reasoning, that reasoning is recorded as evidence supporting the decision, never as the decision itself.",
    "This is a deliberate architectural boundary, not a limitation we are working to remove. A finance platform that cannot explain why a number is what it is has not automated your close; it has made your close harder to defend.",
  ],
  legend: { reasoning: "Agent reasoning", evidence: "Evidence", rules: "Versioned rules", books: "Your books" },
  prompt: "Every finding we return can be traced to the rule and the document behind it. Test that on your data.",
  cta: "Tell us your issue",
} as const;

// ---- What changes --------------------------------------------------------------------------------------------

export const CHANGES = {
  eyebrow: "What changes",
  title: "Traditional operations vs agentic operations",
  columns: { point: "Critical point", traditional: "Traditional", datatwin: "With DataTwin agents" },
  rows: [
    { point: "Error handling", traditional: "Manual detection, high rework", datatwin: "Preventive governance plus auto-remediation minimises errors before they post" },
    { point: "Compliance", traditional: "Policy checks inconsistent, heavy audit dependency", datatwin: "Continuous cognitive validation with audit-ready evidence attached" },
    { point: "Cycle time", traditional: "Slow approvals from exceptions and rework", datatwin: "Faster invoice-to-pay, with human-in-the-loop only where it is needed" },
    { point: "Risk management", traditional: "Fraud and risk spotted late, reactively", datatwin: "Risk Intelligence Agent monitors patterns in real time" },
    { point: "Workload", traditional: "High manual effort across the team", datatwin: "Agents absorb the routine work; people move to judgement" },
    { point: "Transparency", traditional: "Limited visibility, delayed reporting", datatwin: "KPI dashboards with proactive communication on breaches and holds" },
    { point: "Audit", traditional: "Heavy, after-the-fact correction", datatwin: "Ongoing assurance in near real time, evidence assembled as work is done" },
    { point: "Scale", traditional: "Volume spikes overwhelm systems and teams", datatwin: "Compute and agents auto-scale; new geographies plug in as new agents" },
  ],
  prompt: "The fastest way to judge any of this is to point it at your own data.",
} as const;
