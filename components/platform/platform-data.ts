// Copy for the Platform Overview page (/platform). Sections read from here so wording is edited in one place.

import type { PlatformIconName } from "./PlatformIcons";

export type PlatformFeature = {
  icon: PlatformIconName;
  title: string;
  tag: string;
  description: string;
  points: readonly string[];
};

export const HERO_PROOF = [
  "A number in about two minutes",
  "Wraps your systems, nothing migrated",
  "Your rules, configured not coded",
  "New source? It models itself",
] as const;

// ---- 01 Data acquisition & modeling ----------------------------------------------------------------------

export const ACQUISITION = {
  number: "01",
  title: "Data Acquisition & Modeling",
  intro:
    "Get every source in, then model it so the pieces can actually be compared. Most reconciliation projects suffer here, mapping based on the system's data model. This is the part we automated first.",
  features: [
    {
      icon: "upload",
      title: "Upload",
      tag: "Start in minutes",
      description:
        "Drag a file in and go. CSVs, PDFs or screenshots. Nothing to configure and connect, every Discover engagement starts here.",
      points: [
        "Any structured or unstructured file",
        "Documents parsed, not just stored",
        "No IT ticket to run the first analysis",
      ],
    },
    {
      icon: "plug",
      title: "Integrations",
      tag: "For the ongoing run",
      description:
        "Live connections into ERP, banking, PGs and portals. Read-only by default; write-back only where enabled, on validated data.",
      points: [
        "SAP, Oracle, NetSuite, Dynamics, QuickBooks, Tally",
        "Bank feeds and gateway settlement files",
        "Distributor and partner portals",
      ],
    },
    {
      icon: "clock",
      title: "SFTP / EDI",
      tag: "For recurring volume",
      description:
        "Scheduled feeds on a cadence: distributor POS files, bank statements, PG settlements, vendor returns. Processed automatically.",
      points: [
        "Keyed, encrypted, scheduled transfer",
        "Bulk and high-frequency feeds",
        "Late and restated files handled cleanly",
      ],
    },
  ] satisfies readonly PlatformFeature[],
  ai: {
    icon: "scan",
    title: "Introduce a source we have never seen. It models itself.",
    body: "AUDERE, our Autonomous Data Engineering & Recon Engine, reads a source it has never seen, infers what each field means and builds the model to acquire it, then keeps that model current as the source changes. No mapping spreadsheet, no integration ticket.",
  },
} as const;

// ---- 02 Data processing & analysis -----------------------------------------------------------------------

export const PROCESSING = {
  number: "02",
  title: "Data Processing & Analysis",
  intro:
    "Turn raw records into a valued finding during discovery, a KPI score and an anomaly for financial close, a pass-or-fail at entry for Prevent. Transformation, testing and routing are all one continuous pass.",
  features: [
    {
      icon: "layers",
      title: "SCDP",
      tag: "Schema Controlled Data Processing",
      description:
        "The schema controls what happens to the data. Every reshaping step is declared once and applied everywhere. So are the rules.",
      points: [
        "Comes into its own when data must be transformed several times before it can be used",
        "Tolerances, eligibility, matching logic and controls are built into the schema, not bolted on after",
        "A rule cannot drift out of sync with the structure it tests; they are the same object",
      ],
    },
    {
      icon: "match",
      title: "Recon Engine",
      tag: "Part of the DARP framework",
      description:
        "Where the matching happens. Two-way through N-way, at whatever granularity the question needs.",
      points: [
        "Tolerance rules and fuzzy matching where identifiers disagree across systems",
        "Many-to-many resolution, including split and batch settlements",
        "Reasoning applied where a match cannot be settled by rules alone",
      ],
    },
    {
      icon: "workflow",
      title: "Workflow Automation",
      tag: "Any shape you need",
      description:
        "Serial, parallel or any combination. Approvals, reviews, escalations, branches and rework loops, configured to your organisation's needs.",
      points: [
        "Approval chains with delegation and segregation of duties",
        "Human inputs and confirmations wherever the data or the judgement is missing",
        "The control gates of AI governance, where a person confirms what an agent proposed",
      ],
    },
  ] satisfies readonly PlatformFeature[],
  ai: {
    icon: "sparkle",
    title: "Reasoning where matching alone cannot get there",
    body: "Plenty of reconciliations do not resolve on rules: identifiers disagree, or the fact that settles it is a clause inside a contract. DataTwin applies reasoning to exactly those cases, and builds the schema itself from what you describe. Everything that posts stays deterministic.",
  },
} as const;

// ---- 03 Dashboards & reporting ---------------------------------------------------------------------------

export const DASHBOARDS = {
  number: "03",
  title: "Dashboards & Reporting",
  intro:
    "Each product asks a different question of the same engine, so each gets its own reporting. Every number drills through to the transaction and to the document that supports it.",
  disclaimer: "Illustrative dashboards. Every figure shown is an example, not a customer result.",
  closing: "Reports are configured to the process, not to a template. Tell us what you need to see.",
} as const;

// ---- AI-native -------------------------------------------------------------------------------------------

export const AI_NATIVE = {
  eyebrow: "AI-native",
  title: "What makes it AI-native",
  intro:
    "Not a chatbot bolted onto a reporting tool. Three points where the platform would not function the same way without it, and one place we deliberately keep it out. The full architecture, from the agents to the models and the reasoning engine, is on the How AI is used page.",
  points: [
    {
      icon: "scan",
      title: "It models new sources for itself",
      body: "A source we have never seen is read, understood and modelled on arrival: fields inferred, relationships worked out, the acquisition model built without a mapping exercise.",
    },
    {
      icon: "diamond",
      title: "It builds the schema from your requirement",
      body: "Describe what needs reconciling against what. The engine elicits the detail and constructs the schema, with the rules and checks embedded inside it, for entities it has never handled.",
    },
    {
      icon: "swap",
      title: "It reasons through the hard reconciliations",
      body: "Where identifiers disagree, evidence sits in a document, or the answer depends on context across several records, reasoning resolves it, faster and more accurately than a manual queue.",
    },
    {
      icon: "shield",
      title: "It stays out of the posting decision",
      body: "Anything that becomes an entry in your books is governed by explicit, inspectable rules. Nothing posts because a model was confident. That boundary is deliberate and it is not moving.",
      emphasis: true,
    },
  ] satisfies readonly { icon: PlatformIconName; title: string; body: string; emphasis?: boolean }[],
  link: { label: "Agents, models, human-in-the-loop gates and the reasoning engine, in full.", href: "#how-ai-is-used" },
} as const;

// ---- Across the platform ---------------------------------------------------------------------------------

export const ACROSS = {
  eyebrow: "Across the platform",
  title: "Two things that apply at every stage",
  items: [
    {
      icon: "shield",
      title: "Security",
      body: "Read-only by default. ISO 27001 certified and SOC 2 attested, with role-based access, residency options and an immutable audit trail. AWS, Azure, GCP or your own cloud.",
      href: "#security",
    },
    {
      icon: "sparkle",
      title: "How AI is used",
      body: "The full account of where AI earns its place: document understanding, source modelling, schema construction, reasoning on hard matches, natural-language query. And where deterministic rules run instead.",
      href: "#how-ai-is-used",
    },
  ] satisfies readonly { icon: PlatformIconName; title: string; body: string; href: string }[],
  prompt: "Prefer to see the engine working rather than described?",
} as const;
