// Everything the global Footer shows, in one place, so every page renders the same footer and a link or
// line of copy is only ever edited here. A link marked `soon` is not published yet: the footer shows it with a
// "Soon" badge and does not link it.

export type FooterLink = { label: string; href: string; soon?: boolean };
export type FooterGroup = { title: string; links: readonly FooterLink[] };

export const CONTACT_EMAIL = "solve@datatwin.ai";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export const FOOTER_GROUPS: readonly FooterGroup[] = [
  {
    title: "Platform",
    links: [
      { label: "Platform Overview", href: "/platform" },
      { label: "DARP Framework", href: "/platform/darp" },
      { label: "Security", href: "/platform/security" },
      { label: "How AI is used", href: "/platform/how-ai-is-used" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Accounts Payable", href: "/products/accounts-payable" },
      { label: "Accounts Receivable", href: "/products/accounts-receivable" },
      { label: "Taxation Reconciliation", href: "/products/taxation-reconciliation" },
      { label: "Reconciliation & Audit", href: "/products/reconciliation-audit" },
      { label: "Channel Rebates", href: "/products/channel-rebates" },
      { label: "Partner Payouts", href: "/products/partner-payouts" },
      { label: "Sales Commissions", href: "/products/sales-commissions" },
      { label: "FSCP", href: "/products/fscp" },
      { label: "Close KPI Catalogue", href: "/products/close-kpi-catalogue" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Customers", href: "/#trusted-by" },
      { label: "Case Studies", href: "#case-studies", soon: true },
      { label: "Blog", href: "#blog", soon: true },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export const BRAND_STATEMENT =
  "AI-native financial intelligence for the office of the CFO. We find, recover and prevent financial leakage across finance processes — on top of the systems you already run. Discover, Assess & Recover proves the number before you adopt anything; prevention runs the same rules forwards, at transaction entry.";

export const TRUST_LINE = "ISO 27001 certified · SOC 2 attested · Cloud agnostic";

export const COPYRIGHT = "© 2026 DataTwin. All rights reserved.";
export const LOCATION = "Chennai, India";

export type SocialPlatform = "linkedin" | "x" | "youtube";
export type SocialLink = { platform: SocialPlatform; label: string; href: string | null };

// DataTwin's social accounts. NO URLs have been supplied yet, so none are invented: each platform is
// a visual slot (an icon that is not yet a link). To publish one, set its `href` to the company's real
// profile URL; to add or remove a platform, edit this list (and SOCIAL_PATHS in footer-icons.tsx for a
// new one). Nothing else needs to change.
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { platform: "linkedin", label: "LinkedIn", href: null },
  { platform: "x", label: "X", href: null },
  { platform: "youtube", label: "YouTube", href: null },
];

export const LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
];
