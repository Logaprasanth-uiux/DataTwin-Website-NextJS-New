// Content for the header mega menu. Every href is a "#" placeholder until the pages exist; an item with
// `action: "estimate"` opens the chat recovery flow instead of navigating.

export type MenuIconName =
  | "overview" | "security" | "ai" | "ap" | "ar" | "tax" | "recon" | "rebate" | "manufacturer"
  | "distributor" | "payouts" | "commission" | "fscp" | "blog" | "guides" | "glossary" | "case"
  | "customers" | "kpi" | "estimator";

export type MenuItem = {
  title: string;
  desc: string;
  href: string;
  icon: MenuIconName;
  badge?: string;
  action?: "estimate";
  children?: readonly MenuItem[];
};

export type MenuGroup = { label: string; items: readonly MenuItem[] };

export type MenuKey = "platform" | "products" | "learning";

export const MENU_TRIGGERS: readonly { key: MenuKey; label: string }[] = [
  { key: "platform", label: "Platform" },
  { key: "products", label: "Products" },
  { key: "learning", label: "Learning Centre" },
];

export const ESTIMATE_LABEL = "Discover Your Number";

// ---- Platform ------------------------------------------------------------------------------------------

export const PLATFORM_OVERVIEW = {
  title: "Platform Overview",
  desc: "How analyse-first works end to end — acquire, process, report — sitting above the ERP you already run, with nothing migrated.",
  cta: "See the whole platform",
  href: "/platform",
};

export const PLATFORM_DARP = {
  title: "DARP Framework",
  tagline: "Discover · Assess · Recover · Prevent",
  desc: "The recovery and processing engine behind every DataTwin engagement. Reads your transaction history read-only, values every finding, packages the evidence that gets the cash back — then turns the same rules forwards so the leak cannot reopen.",
  points: ["Read-only to start", "Full population, not a sample", "Prevent needs no second build"],
  href: "/platform/darp",
};

export const PLATFORM_ACROSS: MenuGroup = {
  label: "Across the platform",
  items: [
    {
      title: "Security",
      desc: "Read-only by default. ISO 27001 certified and SOC 2 attested, with role-based access and an immutable audit trail on every record. Cloud agnostic — runs on AWS, Azure, GCP or your own private cloud.",
      href: "/platform/security",
      icon: "security",
    },
    {
      title: "How AI is used",
      desc: "Where AI earns its place — reading documents, spotting anomalies, answering questions in plain language — and where deterministic rules run instead, because postings must be auditable.",
      href: "/platform/how-ai-is-used",
      icon: "ai",
    },
  ],
};

// ---- Products ------------------------------------------------------------------------------------------

export const PRODUCT_GROUPS: readonly MenuGroup[] = [
  {
    label: "Core finance operations",
    items: [
      { title: "Accounts Payable", desc: "Invoice to payment, accounted right", href: "/products/accounts-payable", icon: "ap" },
      { title: "Accounts Receivable", desc: "Order to cash, collected and applied", href: "#", icon: "ar" },
      { title: "Taxation Reconciliation", desc: "Returns, credits and ledgers that agree", href: "#", icon: "tax" },
      { title: "Reconciliation & Audit", desc: "Continuous, across every system", href: "#", icon: "recon" },
    ],
  },
  {
    label: "Rebates, incentives & payouts",
    items: [
      {
        title: "Channel Rebates",
        desc: "Ship & debit, SPAs, POS validation",
        href: "#",
        icon: "rebate",
        badge: "2 sides",
        children: [
          { title: "For Manufacturers", desc: "Pay only what's genuinely owed", href: "#", icon: "manufacturer" },
          { title: "For Distributors", desc: "Collect what you're owed, faster", href: "#", icon: "distributor" },
        ],
      },
      { title: "Partner Payouts", desc: "Reseller, affiliate, franchise, referral", href: "#", icon: "payouts" },
      { title: "Sales Commissions & Incentives", desc: "Calculated from actual revenue", href: "#", icon: "commission" },
    ],
  },
  {
    label: "Close & reporting",
    items: [
      {
        title: "FSCP",
        desc: "Financial Statement Close Process — close integrity, scored continuously",
        href: "#",
        icon: "fscp",
        badge: "200+ KPIs",
      },
    ],
  },
];

export const PRODUCTS_PROMO = {
  title: "Not sure where you're leaking?",
  desc: "Send a sample of your data. We'll come back with an estimate of what's recoverable.",
};

// ---- Learning Centre -----------------------------------------------------------------------------------

export const LEARNING_GROUPS: readonly MenuGroup[] = [
  {
    label: "Read",
    items: [
      { title: "Blog", desc: "Finance operations, automation, controls", href: "#", icon: "blog" },
      { title: "Guides", desc: "Deep dives on rebates, close and reconciliation", href: "#", icon: "guides" },
      { title: "Glossary", desc: "Ship & debit, SPA, GRNI, N-way and more", href: "#", icon: "glossary" },
    ],
  },
  {
    label: "Proof",
    items: [
      { title: "Case Studies", desc: "What we found, and what it was worth", href: "#", icon: "case" },
      { title: "Customers", desc: "Who trusts DataTwin with their close", href: "#", icon: "customers" },
    ],
  },
  {
    label: "Tools & downloads",
    items: [
      {
        title: "The 200+ Close KPI Catalogue",
        desc: "Every KPI we track, by process area",
        href: "#",
        icon: "kpi",
        badge: "PDF",
      },
      {
        title: ESTIMATE_LABEL,
        desc: "Share a sample, get a number back",
        href: "#",
        icon: "estimator",
        action: "estimate",
      },
    ],
  },
];

export const LEARNING_DOWNLOAD = {
  title: "The Close KPI Catalogue",
  desc: "All 200+ KPIs we score across inventory, rev rec, cash application and payments.",
  cta: "Download free",
  href: "#",
};
