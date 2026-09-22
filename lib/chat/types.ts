// Shared types for the mock conversational recovery experience.
// Kept separate from the data/config layer and from presentation components so any of the
// three can be swapped independently later (e.g. data -> real backend, engine -> real AI service).

export type FileRequirementLevel = "required" | "optional" | "conditional";

export interface FileRequirement {
  fileId: string;
  name: string;
  level: FileRequirementLevel;
  why: string;
}

export type RecoveryClassification =
  | "Potential Recovery"
  | "Follow-up / Timing"
  | "Compliance / Correction"
  | "Vendor Follow-up";

export interface RecoveryOutput {
  outputId: string;
  label: string;
  classification: RecoveryClassification;
  meaning: string;
}

export interface RecoveryPreviewRow {
  /** Business classification only — never the specific vendor/invoice identifier. */
  classification: RecoveryClassification;
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

export interface ReconciliationTopic {
  id: string;
  /** Shown to the user as an option under the first narrowing question. */
  label: string;
  /** Assistant follow-up once this topic is selected. */
  acknowledgement: string;
  requiredFiles: FileRequirement[];
  optionalFiles: FileRequirement[];
  recoveryOutputs: RecoveryOutput[];
  mockResult: TopicMockResult;
}

export const PERIOD_OPTIONS = [
  { id: "current-quarter", label: "Current quarter" },
  { id: "current-fy", label: "Current financial year" },
  { id: "previous-fy", label: "Previous financial year" },
  { id: "custom", label: "Custom period" },
] as const;

export type PeriodOptionId = (typeof PERIOD_OPTIONS)[number]["id"];

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
}

export type ConversationPhase =
  | "topic-select"
  | "something-else"
  | "period-select"
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

export interface ConversationState {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  firstMessage: string | null;
  phase: ConversationPhase;
  selectedTopicId: string | null;
  somethingElseText: string | null;
  selectedPeriodId: PeriodOptionId | null;
  uploads: Record<string, UploadedFile>;
  contact: ContactDetails | null;
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
      kind: "topic-options";
      id: string;
      prompt: string;
      selectedId: string | null;
      resolved: boolean;
    }
  | { kind: "something-else-input"; id: string; resolved: boolean; value: string | null }
  | {
      kind: "period-options";
      id: string;
      prompt: string;
      selectedId: PeriodOptionId | null;
      resolved: boolean;
    }
  | { kind: "file-upload"; id: string; topic: ReconciliationTopic; resolved: boolean }
  | { kind: "verification"; id: string }
  | { kind: "result"; id: string; topic: ReconciliationTopic }
  | { kind: "contact-form"; id: string; resolved: boolean }
  | { kind: "handoff"; id: string }
  | { kind: "reveal"; id: string; topic: ReconciliationTopic };
