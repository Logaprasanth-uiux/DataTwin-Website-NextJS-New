// Shared types for the mock conversational recovery experience.
// Kept separate from the data/config layer, the resolver, and presentation components so any of
// them can be swapped independently later (e.g. data -> real backend, resolver -> real AI service).

export type FileRequirementLevel = "required" | "optional" | "conditional";

export interface FileRequirement {
  fileId: string;
  name: string;
  level: FileRequirementLevel;
  why: string;
}

export type RecoveryBucket = "recovery" | "correction" | "followup" | "neutral";

export interface RecoveryPreviewRow {
  /** Business classification label — real text from the recovery-output data, not narrowed to a
   * fixed set, since the full catalogue spans ~40 distinct classifications. */
  classification: string;
  /** Only used for visual styling (accent/crimson/neutral treatment), never shown to the user. */
  bucket: RecoveryBucket;
  /** Revealed only after the unlock step. */
  detail: string;
  amount: number;
}

export interface TopicMockResult {
  potentialNow: number;
  exposureQuarter: number;
  exposureYear: number;
  previewRows: RecoveryPreviewRow[];
  nextActions: string[];
}

// A fully-resolved reconciliation, assembled on demand from the catalogue + file/recovery-output
// data once the discovery engine has identified it. Named `ReconciliationTopic` (rather than
// something like `ResolvedReconciliation`) because the downstream upload/verification/result/
// reveal components already consume this exact shape unchanged.
export interface ReconciliationTopic {
  id: string;
  /** Business-friendly name — safe to render directly, never an internal catalogue ID. */
  label: string;
  /** Assistant follow-up once this reconciliation is identified. */
  acknowledgement: string;
  requiredFiles: FileRequirement[];
  optionalFiles: FileRequirement[];
  mockResult: TopicMockResult;
}

export const PERIOD_OPTIONS = [
  { id: "current-quarter", label: "Current quarter" },
  { id: "current-fy", label: "Current financial year" },
  { id: "previous-fy", label: "Previous financial year" },
  { id: "custom", label: "Custom period" },
] as const;

export type PeriodOptionId = (typeof PERIOD_OPTIONS)[number]["id"];

export interface CustomPeriodRange {
  from: string;
  to: string;
}

export const VERIFICATION_STEPS = [
  "Preparing reconciliation",
  "Checking invoice population",
  "Matching portal records",
  "Comparing ITC claims",
  "Identifying timing differences",
  "Calculating recovery opportunities",
] as const;

export interface UploadedFile {
  fileId: string;
  fileName: string;
  status: "uploaded" | "recognised" | "ready";
  /** The next required file to mention once this one reaches "ready", captured at that moment so
   * the acknowledgement message it appears in never changes after the fact — see
   * `advanceUploadStatus` in engine.ts. `undefined` = not yet computed, `null` = computed, no next
   * file. */
  nextFileHint?: string | null;
}

export type FileActionKind = "replace" | "remove";

// A record of a replace/remove action taken on a file that had already been acknowledged in the
// conversation — rendered as its own appended message (see buildTranscript), never folded back
// into the original upload exchange.
export interface FileActionEvent {
  id: string;
  kind: FileActionKind;
  fileId: string;
  fileName: string;
}

export type ConversationPhase =
  | "discovery"
  | "period-select"
  | "custom-period"
  | "files"
  | "verifying"
  | "result"
  | "contact-form"
  | "handoff"
  | "reveal";

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
}

// How the user entered the chat — shapes the opening message (see lib/chat/discovery.ts).
export type EntryContext = "hero" | "leakage" | "recovery-cta" | "direct";

export interface DiscoveryOptionChoice {
  id: string;
  label: string;
}

// One beat of the free-form discovery conversation. Unlike the rest of `ConversationState`,
// discovery keeps an explicit ordered log rather than a few flags + a derived transcript — the
// branching (repeatable free-text rounds, varying candidate sets) isn't cleanly re-derivable from
// a handful of fields the way the older fixed 2-step flow was.
export type DiscoveryTurn =
  | { kind: "message"; id: string; text: string }
  | {
      kind: "options";
      id: string;
      prompt: string;
      options: DiscoveryOptionChoice[];
      selectedId: string | null;
    }
  | { kind: "freetext"; id: string; prompt: string; value: string | null };

export interface DiscoveryState {
  turns: DiscoveryTurn[];
  /** Catalogue id once identified (e.g. "3.7") — internal key, never rendered. */
  resolvedId: string | null;
  /** Free-text rounds used so far, for the "2-3 attempts then offer to connect" fallback. */
  attempts: number;
  /** Catalogue ids already offered/resolved this session, so repeated "Something else" rounds
   * don't keep re-surfacing the same candidates. */
  shownIds: string[];
}

export interface ConversationState {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  firstMessage: string | null;
  entryContext: EntryContext;
  phase: ConversationPhase;
  discovery: DiscoveryState;
  selectedPeriodId: PeriodOptionId | null;
  customPeriodRange: CustomPeriodRange | null;
  uploads: Record<string, UploadedFile>;
  /** High-water mark of how many required files have been progressively revealed — only ever
   * grows, so removing an earlier file never hides later, already-acknowledged ones. */
  maxRequiredFilesRevealed: number;
  /** Append-only log of replace/remove actions on already-acknowledged files — see buildTranscript. */
  fileEvents: FileActionEvent[];
  contact: ContactDetails | null;
  /** Mock temporary identifier (e.g. "DT-2026-0001"), minted once contact details are submitted —
   * prototype stand-in for a real account, shared across every conversation in this browser. */
  userId: string | null;
  revealed: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: number;
}

// Derived, read-only view of a conversation used purely for rendering. Built fresh from
// `ConversationState` on every render rather than stored, so the state itself stays minimal.
export type TranscriptItem =
  | { kind: "user-text"; id: string; text: string }
  | { kind: "assistant-text"; id: string; text: string }
  | {
      kind: "discovery-options";
      id: string;
      prompt: string;
      options: DiscoveryOptionChoice[];
      selectedId: string | null;
      resolved: boolean;
    }
  | { kind: "discovery-freetext"; id: string; prompt: string; resolved: boolean; value: string | null }
  | {
      kind: "period-options";
      id: string;
      prompt: string;
      selectedId: PeriodOptionId | null;
      resolved: boolean;
    }
  | { kind: "custom-period-input"; id: string; resolved: boolean; value: CustomPeriodRange | null }
  | { kind: "file-upload"; id: string; topic: ReconciliationTopic; resolved: boolean }
  | { kind: "verification"; id: string }
  | { kind: "result"; id: string; topic: ReconciliationTopic }
  | { kind: "contact-form"; id: string; resolved: boolean }
  | { kind: "handoff"; id: string; canReveal: boolean }
  | { kind: "reveal"; id: string; topic: ReconciliationTopic };
