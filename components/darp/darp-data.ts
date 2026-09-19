export type DarpStageKey = "discover" | "assess" | "recover" | "prevent";

export const DARP_STAGES: readonly { key: DarpStageKey; label: string; copy: string }[] = [
  { key: "discover", label: "Discover", copy: "Read-only. No process change." },
  { key: "assess", label: "Assess", copy: "You see the number first." },
  { key: "recover", label: "Recover", copy: "The engagement pays for itself." },
  { key: "prevent", label: "Prevent", copy: "Observability goes live." },
];

// Trusted-by names, in the order supplied.
export const TRUSTED_BY = [
  "Veranda",
  "Edureka",
  "Connect India",
  "J.K. Shah Classes",
  "Blue Dart",
  "Dr Agarwal's",
  "SunEdison",
  "CMS",
] as const;
