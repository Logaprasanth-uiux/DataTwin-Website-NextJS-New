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

// Which way a finding moves the net position: "positive" is money coming back (overpaid, over-
// reported, a genuine recoverable amount); "negative" is a liability — tax short-paid or under-
// reported that's actually owed. A reconciliation nets these against each other into
// TopicMockResult.potentialNow, so a modest net figure can still sit on top of two much larger
// gross numbers pulling in opposite directions — both are shown explicitly (see ExecutiveSummary)
// rather than only ever surfacing the net.
export type RecoverySign = "positive" | "negative";

export interface RecoveryPreviewRow {
  /** Business classification label — real text from the recovery-output data, not narrowed to a
   * fixed set, since the full catalogue spans ~40 distinct classifications. */
  classification: string;
  /** Only used for visual styling (accent/crimson/neutral treatment), never shown to the user. */
  bucket: RecoveryBucket;
  /** Revealed only after the unlock step. */
  detail: string;
  /** Always a non-negative magnitude — `sign` says which direction it moves the net position. */
  amount: number;
  sign: RecoverySign;
}

export interface TopicMockResult {
  /** The NET recoverable position — `grossPositive - grossNegative`. This is the headline figure
   * quoted everywhere a single number is needed; the two gross figures below are what it's made
   * of, shown alongside it rather than only implied by it. */
  potentialNow: number;
  /** Total of every positive-signed row — money coming back. */
  grossPositive: number;
  /** Total of every negative-signed row — tax short-paid/under-reported, still owed. */
  grossNegative: number;
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
  /** Overrides the generic "Let's start with your X." lead-in shown right before file collection
   * begins, for a reconciliation with a bespoke walkthrough script (see reconciliation.ts). */
  filesIntro?: string;
  /** Keyed by fileId: overrides the generic "Got it — I've received your X. {why}" (+ next-file
   * mention) acknowledgement shown once that specific required file reaches "ready". */
  fileAckOverrides?: Record<string, string>;
  /** Required-file ids that offer "fetch directly from the GST Portal" as an alternative to
   * uploading — see FileSourceChoice/PortalFetchFlow. */
  portalFetchFileIds?: string[];
  /** Shown once every required file is ready, instead of the generic "Perfect — I have what I
   * need..." + optional-files offer + manual "Continue to verification" button — and, after a
   * short beat, automatically continues into verification itself. */
  autoAdvanceMessage?: string;
  /** A scripted reconciliation can run several rounds instead of just one: collect a document,
   * verify it, then — instead of showing a result — offer one more document as an accuracy
   * improvement (its own file-upload turn, `filesIntro` making the pitch and the benefit) with a
   * "continue with the existing uploaded documents alone" way out for anyone who'd rather stop
   * here; only once there's nothing further to offer (or the user has declined it) does the
   * one-and-only result for the whole conversation actually show. See the "Sales Register vs GST
   * Reconciliation" walkthrough in reconciliation.ts. Absent for every other (single-round) topic,
   * which behaves exactly as before — straight from verification to its result, no offer in
   * between. */
  furtherCheckpoints?: ReconciliationCheckpoint[];
}

// One additional round of a multi-checkpoint scripted reconciliation (see
// ReconciliationTopic.furtherCheckpoints) — collect one more document before the conversation's
// result is shown. `files` are this round's own newly-required documents, hand-written
// FileRequirement literals rather than necessarily drawn from FILE_DEFS, since a scripted
// follow-up round may ask for a document the generic catalogue doesn't itemise on its own (e.g.
// GSTR-1A as its own ask after GSTR-1 already went by).
export interface ReconciliationCheckpoint {
  files: FileRequirement[];
  filesIntro?: string;
  fileAckOverrides?: Record<string, string>;
  portalFetchFileIds?: string[];
  autoAdvanceMessage?: string;
  /** One business-specific line on what adding this round's document improves, shown on the
   * "improve accuracy" card after the result (see ResultStep) if this round was skipped. */
  accuracyBenefit?: string;
  /** This round's own refreshed result, shown once its files are all ready and verified. */
  mockResult: TopicMockResult;
}

export const PERIOD_OPTIONS = [
  { id: "current-period", label: "Current period" },
  { id: "previous-period", label: "Previous period" },
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

// A required file that offers a "fetch directly from the GST Portal" alternative to uploading
// (see ReconciliationTopic.portalFetchFileIds) walks through: pick a source -> (if portal) enter
// GSTIN -> enter OTP -> a brief mock verify/fetch animation -> the file lands in `uploads` as
// "ready", exactly like a normal upload. Only the two waiting-on-the-user stages are persisted;
// the verify/fetch animation itself is transient, component-local state (see PortalFetchFlow).
export type FileSourceChoice = "upload" | "portal";
export type PortalFetchStage = "gstin" | "consent" | "otp";

// A brief mock validation pass on the FIRST required file only (see FileValidationFlow) — a
// staged check, not real parsing: "verifying" -> "issue" (a mock missing-field finding, with a
// mock highlighted preview available in the file drawer) -> "acknowledged" (user chose to
// continue anyway; the upload still proceeds to "ready" as normal). Absent entirely for every
// other file, and for this one too until its upload first reaches "recognised".
export type FileValidationStage = "verifying" | "issue" | "acknowledged";

// A record of a replace/remove action taken on a file that had already been acknowledged in the
// conversation — rendered as its own appended message (see buildTranscript), never folded back
// into the original upload exchange.
export interface FileActionEvent {
  id: string;
  kind: FileActionKind;
  fileId: string;
  fileName: string;
}

// A message sent through the persistent composer after a reconciliation is already resolved,
// paired with DataTwin's (templated, not invented-on-the-fly) acknowledgement — see
// `submitChatMessage` in engine.ts.
export interface FreeMessage {
  id: string;
  text: string;
  reply: string;
}

export type ConversationPhase =
  | "discovery"
  | "period-select"
  | "custom-period"
  | "files"
  | "verifying"
  | "result"
  | "schedule"
  | "reveal";

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
}

// A (mock) meeting time picked in ScheduleMeetingStep — paired with `ConversationState.contact`
// (name/email/phone) rather than duplicating them, since scheduling reuses/edits that same record.
export interface ScheduledMeeting {
  date: string;
  time: string;
}

// How the user entered the chat — shapes the opening message (see lib/chat/discovery.ts). One
// value per distinct site CTA that launches chat, so each can get its own contextual greeting
// instead of falling back to a generic one.
export type EntryContext =
  | "hero"
  | "leakage"
  | "recovery-cta"
  | "situation"
  | "solutions"
  | "final-cta"
  | "direct";

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
  // A question DataTwin asked — rendered as a plain message, not an inline form; the answer comes
  // through the persistent composer as its own "user" turn below, not by filling `value` here.
  | { kind: "freetext"; id: string; prompt: string; value: string | null }
  // A message typed into the persistent chat composer rather than filling a specific inline
  // prompt — see `submitFreeMessage` in discovery.ts. Unlike "freetext" it isn't a reply to a
  // question DataTwin asked; it's the user proactively speaking up.
  | { kind: "user"; id: string; text: string };

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
  /** Which round of a multi-checkpoint scripted reconciliation is current — see
   * ReconciliationTopic.furtherCheckpoints. 0 = the topic's own base round; 1 = furtherCheckpoints[0];
   * and so on. Always 0 for a topic with no further checkpoints. */
  checkpointIndex: number;
  uploads: Record<string, UploadedFile>;
  /** High-water mark of how many required files have been progressively revealed — only ever
   * grows, so removing an earlier file never hides later, already-acknowledged ones. */
  maxRequiredFilesRevealed: number;
  /** Append-only log of replace/remove actions on already-acknowledged files — see buildTranscript. */
  fileEvents: FileActionEvent[];
  /** Keyed by fileId: which source the user picked for a file that offers a GST Portal fetch
   * alternative (see ReconciliationTopic.portalFetchFileIds). Absent = not yet chosen. */
  fileSource: Record<string, FileSourceChoice>;
  /** Keyed by fileId: how far a "portal" file-source choice has progressed. Only ever set for
   * files present in `fileSource` with value "portal". */
  portalFetch: Record<string, PortalFetchStage>;
  /** Keyed by fileId: mock validation stage — see FileValidationStage. Only ever populated for
   * the first required file of a resolved topic. */
  fileValidation: Record<string, FileValidationStage>;
  /** Keyed by fileId: whether the mock "affected data" preview is expanded in the file drawer. */
  filePreviewOpen: Record<string, boolean>;
  /** Messages typed into the persistent composer once a reconciliation is already resolved (the
   * composer routes discovery-phase messages through `discovery.turns` instead — see
   * `submitChatMessage` in engine.ts). Appended at the end of the transcript, wherever the
   * conversation currently stands. */
  freeMessages: FreeMessage[];
  contact: ContactDetails | null;
  /** Mock temporary identifier (e.g. "DT-2026-0001"), minted once contact details are submitted —
   * prototype stand-in for a real account, shared across every conversation in this browser. */
  userId: string | null;
  revealed: boolean;
  /** Name/work email/phone submitted to the lightweight gate shown over the Executive Summary
   * (see ResultStep/SummaryAccessGate) — separate from `contact`, which belongs to the later,
   * fuller "connect with the DataTwin Team" step that unlocks the detailed findings. `null` until
   * submitted. */
  summaryContact: ContactDetails | null;
  /** True once that gate's mock OTP step has been completed — only then is the Executive Summary
   * shown unblurred. The OTP itself is never persisted (see PortalFetchFlow's own OTP for the same
   * convention) — this flag is the only trace that verification happened. */
  summaryVerified: boolean;
  /** Set once ScheduleMeetingStep is submitted — `contact` above holds the name/email/phone used
   * for that booking (pre-filled from `summaryContact`, editable), this just holds the chosen
   * date/time. `null` until scheduled. */
  scheduledMeeting: ScheduledMeeting | null;
}

export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: number;
  /** Which CTA/entry point started this conversation — lets a later launch of the *same* CTA find
   * its own previous conversation instead of whichever one happens to be most recent overall. */
  entryContext: EntryContext;
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
  | {
      kind: "period-options";
      id: string;
      prompt: string;
      selectedId: PeriodOptionId | null;
      resolved: boolean;
    }
  | { kind: "custom-period-input"; id: string; resolved: boolean; value: CustomPeriodRange | null }
  | {
      kind: "file-upload";
      id: string;
      topic: ReconciliationTopic;
      resolved: boolean;
      /** How many of `topic.requiredFiles` (cumulative across every checkpoint so far — see
       * ReconciliationTopic.furtherCheckpoints) were already fully shown in an EARLIER round's own
       * "file-upload" item — this one only renders from that index on, so a later checkpoint's
       * round doesn't re-display the previous rounds' already-committed upload exchanges. 0 for a
       * topic's base round (nothing earlier to skip). */
      startFileIndex: number;
      /** True while this round offers a "continue with the existing uploaded documents alone" way
       * out instead of its own file — i.e. this round came from a checkpoint (never the base
       * round), it's the one currently being asked for, and nothing has been started on its file
       * yet (no upload, no source choice). Once the user engages — or this round is already
       * resolved, or is an earlier, already-superseded round — this is false. */
      canDecline: boolean;
    }
  | { kind: "verification"; id: string }
  | { kind: "result"; id: string; topic: ReconciliationTopic; active: boolean }
  | { kind: "schedule"; id: string; resolved: boolean }
  | { kind: "reveal"; id: string; topic: ReconciliationTopic };
