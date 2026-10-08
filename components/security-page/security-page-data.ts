// Copy for the Security page (/platform/security). Sections read from here so wording is edited in one place.

export const HERO = {
  eyebrow: "Across every stage of the platform",
  lead: ["We ask for read access.", "Nothing more."],
  body: "The first thing we ask any customer for is data, so the first thing we should be able to explain is exactly how it is handled. Certifications, access model, encryption, residency and audit trail, in the detail your security team will ask for.",
  certs: [
    {
      icon: "iso",
      title: "ISO 27001 certified",
      body: "An audited information security management system covering the platform, the people who run it and the processes around it.",
    },
    {
      icon: "soc",
      title: "SOC 2 attested",
      body: "An independent auditor’s report on our controls for security, availability and confidentiality. Available under NDA.",
    },
    {
      icon: "cloud",
      title: "Cloud agnostic",
      body: "Prevention deploys on AWS, Azure, GCP or your own private cloud, inside your estate and under your controls.",
    },
  ],
} as const;

export const POSTURE = {
  eyebrow: "The default posture",
  lead: ["DataTwin reads. It does not write,", "until you decide otherwise."],
  body: "Discover and Assess require read access and nothing else. There is no agent installed in your environment, no schema change in your ERP, no service account with posting rights, and no path by which our analysis can alter a record in your books. Write-back exists only in Prevent, only for the processes you enable, and only for data that has already passed your rules. It is a decision you make later, not a condition of finding out what you are owed.",
  lanes: [
    { tag: "Discover & Assess", title: "Read access" },
    { tag: "Prevent", title: "Write-back" },
  ],
} as const;

export type ControlKind = "rbac" | "encryption" | "audit" | "operations";

export const CONTROLS = {
  eyebrow: "Controls",
  title: "How the platform is protected",
  body: "The controls a finance or security reviewer asks about, described plainly rather than as a list of logos.",
  groups: [
    {
      kind: "rbac",
      title: "Access control & RBAC",
      lead: "Every permission is granted to a role, never to a person directly, and every role is scoped to the narrowest set of data and actions that role actually needs.",
      points: [
        "Role-based access control across entity, process area, period and data class: a rebate analyst sees rebate data for their entities, and nothing else",
        "Least privilege by default. New users start with no access; entitlements are added deliberately and reviewed periodically",
        "Segregation of duties enforced in the model: the person who edits a rule cannot be the person who approves an exception raised by it",
        "SSO and SAML 2.0 against your identity provider, with MFA inherited from your own policy",
        "SCIM provisioning so leavers lose access when your directory says so, not when someone remembers",
        "Session controls: configurable timeout, device and IP restrictions, forced re-authentication for sensitive actions",
      ],
    },
    {
      kind: "encryption",
      title: "Encryption & key handling",
      lead: "Data is encrypted everywhere it sits and everywhere it moves, with keys managed separately from the data they protect.",
      points: [
        "TLS 1.2+ in transit for every connection, including internal service-to-service traffic",
        "AES-256 at rest across databases, object storage, backups and snapshots",
        "Managed key service with scheduled rotation; customer-managed keys available on private deployments",
        "Secrets isolated from application code and configuration, never written to logs",
        "Credentials for source systems stored encrypted and scoped read-only wherever the source supports it",
      ],
    },
    {
      kind: "audit",
      title: "Audit trail & evidence",
      lead: "Auditability is not a reporting feature bolted on afterwards; it is how the platform records its own work, which is what makes findings defensible.",
      points: [
        "Immutable audit trail on every record: what changed, when, by whom or by which rule, and what the value was before",
        "Every finding traceable to the source transaction and the document that supports it",
        "Rule versioning: you can reconstruct which version of a rule produced a finding, and when it changed",
        "Access logging on reads as well as writes, so you can answer who looked at what",
        "Exportable evidence packs for your auditor, assembled as the work is done rather than reconstructed later",
      ],
    },
    {
      kind: "operations",
      title: "Operations & assurance",
      lead: "The controls around the people and processes that run the platform, which is the half of ISO 27001 that software alone does not cover.",
      points: [
        "Secure SDLC with peer review, dependency scanning and static analysis before release",
        "Independent penetration testing, with findings tracked to closure",
        "Vulnerability management against defined remediation windows by severity",
        "Documented incident response with defined notification commitments, available in the security pack",
        "Backup and disaster recovery tested to agreed RPO and RTO targets",
        "Background-checked staff, security training, and access reviews on a fixed cycle",
        "Sub-processor register maintained and disclosed",
      ],
    },
  ],
} as const;

export type Cell = { v: "yes" | "no" | "part"; label: string };
const yes: Cell = { v: "yes", label: "Yes" };
const no: Cell = { v: "no", label: "No" };
const part = (label: string): Cell => ({ v: "part", label });

export const RBAC = {
  eyebrow: "Role-based access",
  title: "Who can do what",
  body: "An illustrative role model. Roles are configured to your organisation; these are the shapes most customers start from, and every one is scoped further by entity, process area and period.",
  columns: ["View findings", "Drill to source", "Edit rules", "Approve exceptions", "Release write-back"],
  roleLabel: "Role",
  rows: [
    { role: "Analyst", cells: [yes, yes, no, no, no] },
    { role: "Process owner", cells: [yes, yes, part("Propose only"), yes, no] },
    { role: "Controller", cells: [yes, yes, yes, yes, yes] },
    { role: "Internal audit", cells: [yes, yes, no, no, no] },
    { role: "External auditor", cells: [part("Read-only, scoped"), yes, no, no, no], spotlight: true },
    { role: "Administrator", cells: [part("Config only"), no, yes, no, no], spotlight: true },
  ] as readonly { role: string; cells: readonly Cell[]; spotlight?: boolean }[],
  note: "Note the last two rows. An external auditor gets a scoped, read-only view with full drill-down and no ability to change anything, so you can give evidence access without giving system access. And an administrator who configures roles cannot approve exceptions or release write-back, because whoever controls permissions should never also be able to use them.",
} as const;

export const DATA = {
  eyebrow: "Where the data sits",
  title: "Different answers for different stages",
  body: "This distinction matters, so we state it rather than hiding behind “cloud agnostic”.",
  stages: [
    {
      kind: "cloud",
      tag: "Discover & Assess · the diagnostic",
      title: "Runs in the DataTwin cloud",
      body: "You send an extract, we analyse it in our environment, and you get the findings back. Nothing is installed, no infrastructure decision is required, and no change is made to your systems, which is the point of a stage that exists to tell you whether the number is worth acting on. Data residency options are available where a jurisdiction requires it, and retention is agreed before you send anything.",
      left: "Your systems",
      right: "DataTwin cloud",
    },
    {
      kind: "estate",
      tag: "Prevent · the product",
      title: "Deploys wherever you want it",
      body: "Prevention sits permanently alongside your ERP, so it lives inside your own estate and under your own controls. Cloud agnostic in practice, not just in principle: the same application, deployed to whichever provider your architecture and your regulator require.",
      left: "Your ERP",
      right: "Prevent",
    },
  ],
  providers: ["AWS", "Azure", "GCP", "Your private cloud", "Your region"],
} as const;

export const FAQ = {
  eyebrow: "Security review",
  title: "What your team will ask",
  items: [
    {
      q: "Can we see the SOC 2 report and the ISO certificate?",
      a: "Yes. The ISO 27001 certificate is shareable on request. The SOC 2 report is available under NDA, together with our security pack: architecture overview, sub-processor register, incident response summary, penetration test summary and completed responses to the common questionnaires.",
    },
    {
      q: "Do you need write access to our ERP?",
      a: "Not for Discover or Assess. Those stages are read-only and cannot alter a record in your systems. Write-back is a Prevent capability, enabled per process, scoped to validated data, and released under a role that is separate from the one that configures rules.",
    },
    {
      q: "How long do you keep our data?",
      a: "Retention is agreed before you send anything and written into the engagement. If you decide not to proceed after Discover, we delete on request and confirm in writing. Nothing is retained for model training.",
    },
    {
      q: "Is our data used to train models?",
      a: "No. Your data is used to produce your findings. It is not used to train models, and it is not pooled with other customers’ data. Where the platform learns, it learns within your own tenant from your own corrections and outcomes.",
    },
    {
      q: "Can we restrict access by entity or region?",
      a: "Yes. Roles are scoped by entity, process area, period and data class, so a user in one region can be given access to that region’s data only. This is a common requirement in multi-entity groups and it is configured rather than customised.",
    },
    {
      q: "What happens if there is an incident?",
      a: "We run a documented incident response process with defined severity levels, containment steps and notification commitments. The specific timelines we commit to are stated in the security pack and in the contract rather than promised loosely here.",
    },
    {
      q: "Who at DataTwin can see our data?",
      a: "Access is least-privilege and role-based internally as well. Engineers do not have standing access to customer data; access for support or investigation is time-bound, approved, and logged in the same audit trail you can see.",
    },
  ],
} as const;
