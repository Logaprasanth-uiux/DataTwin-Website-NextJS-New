import {
  createInitialDiscovery,
  selectDiscoveryOption as applySelectDiscoveryOption,
  submitFreeMessage as applySubmitFreeMessage,
} from "./discovery";
import { buildIntentSummary, userWordsForIntent } from "./intents";
import { generateMockResult, PURCHASE_GST_IDS, SALES_GST_IDS } from "./mockResult";
import { ANNUAL_ENTRY_ID, buildResolvedTopic, periodModeFor } from "./reconciliation";
import { PLACEHOLDER_TITLE } from "./title";
import { formatPeriodRange } from "./formatDate";
import type {
  ContactDetails,
  ConversationState,
  CustomPeriodRange,
  DemoOutcome,
  EntryContext,
  FileRequirement,
  FileSourceChoice,
  PeriodOptionId,
  ReconciliationCheckpoint,
  ReconciliationTopic,
  ScheduledMeeting,
  TranscriptItem,
  UploadedFile,
} from "./types";

// Pure conversation logic: given a state and an action, what's the next state; given a state,
// what does the transcript look like. No rendering, no storage, no browser APIs — this module
// could drive a CLI or a test just as easily as the chat UI.

export function getResolvedTopic(reconciliationId: string | null): ReconciliationTopic | null {
  if (!reconciliationId) return null;
  return buildResolvedTopic(reconciliationId);
}

// --- Multi-checkpoint scripted reconciliations (see ReconciliationTopic.furtherCheckpoints) -----

// The topic AS IT STANDS through a given checkpoint round: its required files are every file
// collected so far (this topic's own base files, plus each further checkpoint's files up to and
// including `index`), and its script fields (filesIntro/fileAckOverrides/portalFetchFileIds/
// autoAdvanceMessage/mockResult) are that round's own — everything downstream (FileUploadStep,
// ResultStep, RevealStep, ...) already just consumes a `ReconciliationTopic`, so nothing about
// those components needs to know checkpoints exist at all. For a topic with no further checkpoints
// this returns a value equal in every field to the topic itself — index 0 is always the only round.
function effectiveTopicForCheckpoint(topic: ReconciliationTopic, index: number): ReconciliationTopic {
  const checkpoints = topic.furtherCheckpoints ?? [];
  const current = index > 0 ? checkpoints[index - 1] : undefined;
  const requiredFiles = [...topic.requiredFiles, ...checkpoints.slice(0, index).flatMap((c) => c.files)];
  return {
    ...topic,
    requiredFiles,
    optionalFiles: index === 0 ? topic.optionalFiles : [],
    filesIntro: current ? current.filesIntro : topic.filesIntro,
    fileAckOverrides: current ? current.fileAckOverrides : topic.fileAckOverrides,
    portalFetchFileIds: current ? current.portalFetchFileIds : topic.portalFetchFileIds,
    autoAdvanceMessage: current ? current.autoAdvanceMessage : topic.autoAdvanceMessage,
    mockResult: current ? current.mockResult : topic.mockResult,
  };
}

function totalCheckpointCount(topic: ReconciliationTopic): number {
  return 1 + (topic.furtherCheckpoints?.length ?? 0);
}

// The topic as it stands at the conversation's CURRENT checkpoint — what every file-collection
// helper below should read/write against, so a scripted multi-round reconciliation asks for (and
// tracks readiness of) only its current round's files, not the whole eventual set up front.
export function getEffectiveTopic(state: ConversationState): ReconciliationTopic | null {
  const topic = getResolvedTopic(state.discovery.resolvedId);
  if (!topic) return null;
  return effectiveTopicForCheckpoint(topic, state.checkpointIndex ?? 0);
}

export function createInitialState(
  id: string,
  firstMessage: string | null,
  entryContext: EntryContext = "direct",
): ConversationState {
  const now = Date.now();
  const { discovery, status } = createInitialDiscovery(firstMessage, entryContext);
  const initial: ConversationState = {
    id,
    title: PLACEHOLDER_TITLE,
    createdAt: now,
    updatedAt: now,
    firstMessage,
    entryContext,
    phase: status === "resolved" ? "period-select" : status === "fallback" ? "schedule" : "discovery",
    discovery,
    selectedPeriodId: null,
    customPeriodRange: null,
    checkpointIndex: 0,
    uploads: {},
    maxRequiredFilesRevealed: 0,
    fileEvents: [],
    freeMessages: [],
    fileSource: {},
    portalFetch: {},
    fileValidation: {},
    filePreviewOpen: {},
    contact: null,
    userId: null,
    revealed: false,
    summaryContact: null,
    summaryVerified: false,
    scheduledMeeting: null,
    portalSessionExpiresAt: null,
    accuracyExtras: [],
    accuracyDismissed: false,
    intentConfirmed: status === "resolved" ? false : undefined,
  };
  // Named only once the intent is settled — never from the raw first message ("Hi issue").
  return status === "resolved" ? { ...initial, title: deriveConversationTitle(initial) } : initial;
}

// A conversation's title starts as "New conversation" (see createInitialState) and only becomes
// meaningful once the intent is finalized — the identified reconciliation's own business-friendly
// label. If discovery ends in the graceful "connect with the team" fallback with no specific
// reconciliation matched, it gets a neutral title rather than echoing a raw message like "Hi".
const FALLBACK_TITLE = "General enquiry";

function deriveConversationTitle(state: ConversationState): string {
  const topic = getResolvedTopic(state.discovery.resolvedId);
  return topic ? topic.label : FALLBACK_TITLE;
}

function touch(state: ConversationState): ConversationState {
  // Recomputed only while the title is still the generic placeholder; once it's been replaced with
  // something real it stays — no need to keep re-deriving it on every single action.
  const needsTitle = state.phase !== "discovery" && state.title === PLACEHOLDER_TITLE;
  const title = needsTitle ? deriveConversationTitle(state) : state.title;
  return { ...state, updatedAt: Date.now(), title };
}

function phaseForStatus(status: "continue" | "resolved" | "fallback"): ConversationState["phase"] {
  if (status === "resolved") return "period-select";
  if (status === "fallback") return "schedule";
  return "discovery";
}

// Landing on a reconciliation always pauses at the "here's what I understood" card first.
function intentGate(status: "continue" | "resolved" | "fallback"): { intentConfirmed: boolean | undefined } {
  return { intentConfirmed: status === "resolved" ? false : undefined };
}

// The follow-up asked when a monthly reconciliation's user picks "Year-end (annual)": year-end runs
// against GSTR-9 instead of GSTR-1, so confirm before switching to the annual flow.
const YEAR_ROUTE_TURN_ID = "year-route";

function answerYearRoute(state: ConversationState, optionId: string): ConversationState {
  if (optionId !== "yes") return touch({ ...state, selectedPeriodId: null });
  const topic = getResolvedTopic(ANNUAL_ENTRY_ID);
  return touch({
    ...state,
    title: topic?.label ?? state.title,
    phase: "period-select",
    selectedPeriodId: null,
    customPeriodRange: null,
    checkpointIndex: 0,
    intentConfirmed: false,
    discovery: {
      ...state.discovery,
      resolvedId: ANNUAL_ENTRY_ID,
      shownIds: [...state.discovery.shownIds, ANNUAL_ENTRY_ID],
    },
  });
}

export function selectDiscoveryOption(state: ConversationState, turnId: string, optionId: string): ConversationState {
  if (turnId === YEAR_ROUTE_TURN_ID) return answerYearRoute(state, optionId);
  const { discovery, status } = applySelectDiscoveryOption(state.discovery, turnId, optionId, state.firstMessage);
  return touch({ ...state, discovery, phase: phaseForStatus(status), ...intentGate(status) });
}

export function confirmIntent(state: ConversationState): ConversationState {
  if (state.intentConfirmed !== false) return state;
  return touch({ ...state, intentConfirmed: true });
}

// "Not quite" — back to discovery, with the rejected reconciliation already in `shownIds` so the
// resolver won't offer it straight back.
export function rejectIntent(state: ConversationState): ConversationState {
  if (state.intentConfirmed !== false) return state;
  const turns = [
    ...state.discovery.turns,
    { kind: "user" as const, id: `d${state.discovery.turns.length}`, text: "Not quite — that's not what I meant." },
  ];
  turns.push({
    kind: "freetext",
    id: `d${turns.length}`,
    prompt: "Sorry about that — tell me more about what you're seeing, and I'll take another look.",
    value: null,
  });
  return touch({
    ...state,
    phase: "discovery",
    intentConfirmed: undefined,
    selectedPeriodId: null,
    discovery: { ...state.discovery, turns, resolvedId: null },
  });
}

// A short, varied acknowledgement for a composer message sent once a reconciliation is already
// resolved — templated the same way every other assistant line in this prototype is (see
// REPLACE_PHRASES/REMOVE_PHRASES below), never a fabricated re-analysis of what was typed.
const FREE_MESSAGE_REPLIES_WITH_TOPIC = [
  (label: string) => `Noted — I'll keep that in mind as we continue with ${label}.`,
  (label: string) => `Got it, thanks — that's useful context for ${label}.`,
];
const FREE_MESSAGE_REPLIES_GENERIC = [
  "Noted — thanks for the extra detail.",
  "Got it, thanks for sharing that.",
];

function pickFreeMessageReply(index: number, topicLabel: string | null): string {
  if (topicLabel) {
    return FREE_MESSAGE_REPLIES_WITH_TOPIC[index % FREE_MESSAGE_REPLIES_WITH_TOPIC.length](topicLabel);
  }
  return FREE_MESSAGE_REPLIES_GENERIC[index % FREE_MESSAGE_REPLIES_GENERIC.length];
}

// The persistent composer's entry point — a second way to write into the exact same conversation
// state the quick-actions already use, not a parallel message system. While a reconciliation is
// still being narrowed down, this routes through the same discovery resolution engine that
// "Something else" uses (so it can actually resolve/narrow, not just echo). Once a reconciliation
// is resolved, there's no further identification/period/file logic to re-run here — the message is
// recorded and acknowledged in place, appended wherever the conversation currently stands.
// --- Outcomes other than a normal result (demo) -------------------------------------------------

const DEMO_OUTCOME_LABEL: Record<DemoOutcome, string> = {
  "file-error": "a file error",
  "api-error": "a GST Portal (API) error",
  "reconciliation-error": "a reconciliation error",
  "no-impact": "a no-impact result",
};

// A typed demo command. Once a reconciliation is under way, a short message that names an outcome
// is enough: "file error", "api error", "portal error", "reconciliation error", "no impact",
// "all clear" (or the same starting with demo / simulate / test / force). Before that, while
// DataTwin is still working out what the user is asking about, only the prefixed form counts, so a
// real question like "my GST file has an error" still goes to the normal conversation. Anything
// longer than six words is treated as ordinary conversation.
export function parseDemoCommand(text: string, underway = true): DemoOutcome | null {
  const t = text.toLowerCase().trim();
  const prefixed = /^(demo|simulate|test|force|trigger|show)\b/.test(t);
  if (!prefixed && (!underway || t.split(/\s+/).length > 6)) return null;
  if (!/(error|fail|crash|broke|impact|issue|clear)/.test(t)) return null;
  if (/(no[\s-]?impact|no issues?|all clear|clean|no difference|no mismatch)/.test(t)) return "no-impact";
  if (/(api|portal|server|timeout|time out)/.test(t)) return "api-error";
  if (/recon/.test(t)) return "reconciliation-error";
  return "file-error";
}

// A file whose name says it's bad ("sales-error.xlsx", "corrupt.csv") ends the run with a file
// error too, so the error can also be reached just by choosing a file.
const BAD_FILE_NAME = /error|corrupt|invalid/i;

export function submitChatMessage(state: ConversationState, text: string): ConversationState {
  const trimmed = text.trim();
  if (!trimmed) return state;

  const demo = parseDemoCommand(trimmed, state.phase !== "discovery");
  if (demo) {
    const reply = `Demo mode: your next run will end with ${DEMO_OUTCOME_LABEL[demo]}. Carry on as normal.`;
    const freeMessages = [...state.freeMessages, { id: `fm${state.freeMessages.length}`, text: trimmed, reply, demo: true }];
    return touch({ ...state, freeMessages, demoOutcome: demo });
  }

  if (state.phase === "discovery") {
    const { discovery, status } = applySubmitFreeMessage(state.discovery, trimmed);
    return touch({ ...state, discovery, phase: phaseForStatus(status), ...intentGate(status) });
  }

  const topic = getResolvedTopic(state.discovery.resolvedId);
  const reply = pickFreeMessageReply(state.freeMessages.length, topic?.label ?? null);
  const freeMessages = [...state.freeMessages, { id: `fm${state.freeMessages.length}`, text: trimmed, reply }];
  return touch({ ...state, freeMessages });
}

export function selectPeriod(state: ConversationState, periodId: PeriodOptionId): ConversationState {
  // "Year-end" isn't a period to analyse — it opens the switch-to-GSTR-9 question instead.
  if (periodId === "year-end") return touch({ ...state, selectedPeriodId: periodId });
  const phase = periodId === "custom" ? "custom-period" : "files";
  return touch({ ...state, selectedPeriodId: periodId, phase });
}

export function submitCustomPeriod(state: ConversationState, range: CustomPeriodRange): ConversationState {
  return touch({ ...state, customPeriodRange: range, phase: "files" });
}

function nextFileEventId(state: ConversationState): string {
  return `fe${state.fileEvents.length}`;
}

// Re-uploading a file that was already acknowledged ("ready") in the conversation is a *replace*,
// not a fresh upload — it gets its own appended event (see buildTranscript) rather than silently
// rewriting the original upload exchange.
export function recordUpload(state: ConversationState, fileId: string, fileName: string): ConversationState {
  const previous = state.uploads[fileId];
  const upload: UploadedFile = { fileId, fileName, status: "uploaded" };
  const wasReady = previous?.status === "ready";
  const fileEvents = wasReady
    ? [...state.fileEvents, { id: nextFileEventId(state), kind: "replace" as const, fileId, fileName }]
    : state.fileEvents;
  return touch({ ...state, uploads: { ...state.uploads, [fileId]: upload }, fileEvents });
}

export function advanceUploadStatus(
  state: ConversationState,
  fileId: string,
  status: UploadedFile["status"],
): ConversationState {
  const existing = state.uploads[fileId];
  if (!existing) return state;
  let nextFileHint = existing.nextFileHint;
  let maxRequiredFilesRevealed = state.maxRequiredFilesRevealed;
  // Captured once, the moment this file first becomes ready — never recomputed on later renders,
  // so the acknowledgement message that reads it stays fixed even after other files are uploaded.
  if (status === "ready" && nextFileHint === undefined) {
    const topic = getEffectiveTopic(state);
    const index = topic?.requiredFiles.findIndex((f) => f.fileId === fileId) ?? -1;
    const next = topic && index !== -1 ? topic.requiredFiles[index + 1] : undefined;
    nextFileHint = next?.fileId ?? null;
    // The reveal high-water mark only ever grows — removing an earlier required file later must
    // not hide this one (or anything after it) from the progressive file views.
    if (index !== -1) maxRequiredFilesRevealed = Math.max(maxRequiredFilesRevealed, index + 1);
  }
  return touch({
    ...state,
    uploads: { ...state.uploads, [fileId]: { ...existing, status, nextFileHint } },
    maxRequiredFilesRevealed,
  });
}

// Removing a file that was already acknowledged gets its own appended event; removing one still
// mid-upload (never shown in the conversation yet) is just undone with nothing to acknowledge.
// Also clears any GST-Portal source choice/progress for this file, so removing one goes back to
// offering the upload-vs-portal choice fresh rather than reopening mid-flow.
export function removeUpload(state: ConversationState, fileId: string): ConversationState {
  const existing = state.uploads[fileId];
  const wasReady = existing?.status === "ready";
  const next = { ...state.uploads };
  delete next[fileId];
  const fileEvents =
    wasReady && existing
      ? [...state.fileEvents, { id: nextFileEventId(state), kind: "remove" as const, fileId, fileName: existing.fileName }]
      : state.fileEvents;
  const fileSource = { ...state.fileSource };
  delete fileSource[fileId];
  const portalFetch = { ...state.portalFetch };
  delete portalFetch[fileId];
  const fileValidation = { ...state.fileValidation };
  delete fileValidation[fileId];
  const filePreviewOpen = { ...state.filePreviewOpen };
  delete filePreviewOpen[fileId];
  return touch({ ...state, uploads: next, fileEvents, fileSource, portalFetch, fileValidation, filePreviewOpen });
}

// --- First-document mock validation (see FileValidationFlow) -----------

export function beginFileValidation(state: ConversationState, fileId: string): ConversationState {
  if (state.fileValidation[fileId]) return state; // already started — don't restart mid-flow
  return touch({ ...state, fileValidation: { ...state.fileValidation, [fileId]: "verifying" } });
}

export function flagFileIssue(state: ConversationState, fileId: string): ConversationState {
  if (state.fileValidation[fileId] !== "verifying") return state;
  return touch({ ...state, fileValidation: { ...state.fileValidation, [fileId]: "issue" } });
}

// The upload still proceeds to "ready" exactly as it would without the mock issue — the same
// nextFileHint/maxRequiredFilesRevealed side effects apply — this only additionally records that
// it was continued *despite* a flagged issue, so the acknowledgement that follows can say so (see
// FileUploadStep).
export function continueWithFileIssue(state: ConversationState, fileId: string): ConversationState {
  if (state.fileValidation[fileId] !== "issue") return state;
  const acknowledged = touch({ ...state, fileValidation: { ...state.fileValidation, [fileId]: "acknowledged" } });
  return advanceUploadStatus(acknowledged, fileId, "ready");
}

// Same effect as removing the file (back to the upload prompt) plus clearing its validation state,
// so a freshly re-uploaded file goes through its own clean verification pass rather than resuming
// mid-flow.
export function replaceFlaggedFile(state: ConversationState, fileId: string): ConversationState {
  return removeUpload(state, fileId);
}

export function toggleFilePreview(state: ConversationState, fileId: string): ConversationState {
  return touch({ ...state, filePreviewOpen: { ...state.filePreviewOpen, [fileId]: !state.filePreviewOpen[fileId] } });
}

// --- GST Portal fetch (see FileSourceChoice/PortalFetchFlow) -----------

export function chooseFileSource(state: ConversationState, fileId: string, source: FileSourceChoice): ConversationState {
  if (state.fileSource[fileId]) return state; // already chosen — don't reset an in-progress flow
  const fileSource = { ...state.fileSource, [fileId]: source };
  // An earlier OTP verification still inside its window is reused: no GSTIN/consent/OTP again.
  const sessionActive = (state.portalSessionExpiresAt ?? 0) > Date.now();
  const portalFetch =
    source === "portal"
      ? { ...state.portalFetch, [fileId]: sessionActive ? ("session" as const) : ("gstin" as const) }
      : state.portalFetch;
  return touch({ ...state, fileSource, portalFetch });
}

export function submitPortalGstin(state: ConversationState, fileId: string): ConversationState {
  if (state.portalFetch[fileId] !== "gstin") return state;
  return touch({ ...state, portalFetch: { ...state.portalFetch, [fileId]: "consent" } });
}

// The user explicitly agrees to the GSTIN/OTP-authorised portal access before OTP verification is
// ever triggered (see PortalFetchFlow's consent modal) — only then does the flow proceed to "otp".
export function agreePortalConsent(state: ConversationState, fileId: string): ConversationState {
  if (state.portalFetch[fileId] !== "consent") return state;
  return touch({ ...state, portalFetch: { ...state.portalFetch, [fileId]: "otp" } });
}

// Declining consent backs all the way out of the portal path — clearing `fileSource` re-offers the
// upload-vs-portal choice fresh (see FileSourceChoice), rather than leaving the user stuck mid-flow
// or silently dropping them into OTP anyway.
export function cancelPortalConsent(state: ConversationState, fileId: string): ConversationState {
  const fileSource = { ...state.fileSource };
  delete fileSource[fileId];
  const portalFetch = { ...state.portalFetch };
  delete portalFetch[fileId];
  return touch({ ...state, fileSource, portalFetch });
}

// The OTP itself is never passed in or stored — by the time this is called, the caller (a local
// verifying/fetching animation, not persisted state — see PortalFetchFlow) has already confirmed
// it. This just lands the fetched file exactly where a normal upload would, reusing the same
// ready-transition (and its nextFileHint/maxRequiredFilesRevealed side effects) unchanged.
export function completePortalFetch(state: ConversationState, fileId: string, fileName: string): ConversationState {
  const uploaded = recordUpload(state, fileId, fileName);
  const ready = advanceUploadStatus(uploaded, fileId, "ready");
  // The verification behind this fetch stays reusable for a while (see chooseFileSource).
  return { ...ready, portalSessionExpiresAt: Date.now() + PORTAL_SESSION_MS };
}

export function requiredFilesReady(state: ConversationState): boolean {
  const topic = getEffectiveTopic(state);
  if (!topic) return false;
  return topic.requiredFiles.every((f) => state.uploads[f.fileId]?.status === "ready");
}

// The required files that should be visible/askable right now — one at a time, in order, plus
// whichever ones are already done. Shared by the transcript's file-upload turn and the compact
// file panel so both surface the same "current" document instead of the panel dumping every
// requirement up front. `maxRevealed` is the high-water mark from state — it only grows, so
// removing an earlier file never pulls later, already-shown files back out of view.
export function visibleRequiredFiles(
  topic: ReconciliationTopic,
  uploads: Record<string, UploadedFile>,
  maxRevealed = 0,
): FileRequirement[] {
  const activeIndex = topic.requiredFiles.findIndex((f) => uploads[f.fileId]?.status !== "ready");
  const currentRevealCount = activeIndex === -1 ? topic.requiredFiles.length : activeIndex + 1;
  const revealCount = Math.min(Math.max(currentRevealCount, maxRevealed), topic.requiredFiles.length);
  return topic.requiredFiles.slice(0, revealCount);
}

// The answer to "which of these apply?" before the optional documents (see
// ReconciliationTopic.optionalGroups). Nothing picked means "just the required documents", which
// goes straight to the run; otherwise the documents of the chosen groups are offered.
export function chooseOptionalGroups(state: ConversationState, groupIds: string[]): ConversationState {
  if (state.optionalGroups) return state;
  const next = touch({ ...state, optionalGroups: groupIds });
  return groupIds.length === 0 ? beginVerification(next) : next;
}

export function beginVerification(state: ConversationState): ConversationState {
  if (!requiredFilesReady(state)) return state;
  // Optional documents added before the run (see OptionalDocsOffer) count towards the first
  // result, the same way ones added later from the "improve accuracy" card do.
  const { pending } = getAccuracyOffer(state);
  const accuracyExtras = pending.length > 0 ? [...(state.accuracyExtras ?? []), ...pending] : state.accuracyExtras;
  return touch({ ...state, accuracyExtras, phase: "verifying" });
}

// A multi-checkpoint scripted reconciliation (see ReconciliationTopic.furtherCheckpoints) doesn't
// go straight to its result once a round's verification completes, as long as a further checkpoint
// still exists to offer — instead it pre-advances straight into that next round's own file-upload
// turn (no separate yes/no decision first): the offer, its benefit, the upload card and a
// "continue with the existing uploaded documents alone" way out (see FileUploadStep/
// declineRemainingCheckpoints below) all live in that ONE turn. Only the true final round goes
// straight to "result", exactly as every other, non-checkpointed reconciliation already does.
export function completeVerification(state: ConversationState): ConversationState {
  // Straight to the result after the required documents. Every further document is optional, so
  // they are all offered together on the result's "improve accuracy" card (see getAccuracyOffer)
  // rather than asked for one at a time in the conversation first.
  const flagged = Object.values(state.uploads).find((upload) => BAD_FILE_NAME.test(upload.fileName));
  return touch({ ...state, phase: "result", demoOutcome: state.demoOutcome ?? (flagged ? "file-error" : undefined) });
}

// After an error outcome: back to the files, with nothing carried over from the failed run.
export function retryAfterOutcome(state: ConversationState): ConversationState {
  return touch({
    ...state,
    phase: "files",
    demoOutcome: undefined,
    nextCheck: undefined,
    uploads: {},
    fileEvents: [],
    fileSource: {},
    portalFetch: {},
    fileValidation: {},
    filePreviewOpen: {},
    accuracyExtras: [],
    optionalGroups: undefined,
    checkpointIndex: 0,
    maxRequiredFilesRevealed: 0,
  });
}

export function answerNextCheck(state: ConversationState, choice: "another" | "done"): ConversationState {
  return touch({ ...state, nextCheck: choice });
}

// The "continue with the existing uploaded documents alone" way out of an offered checkpoint round
// (see completeVerification above) — rolls that pre-advance back, since nothing for this round has
// been uploaded yet (FileUploadStep only ever offers this while that's true), and moves straight to
// the conversation's one-and-only result using whatever was already collected. A no-op from
// anywhere but an in-progress "files" phase, or from the topic's own base round (checkpointIndex 0
// — nothing to decline back to).
export function declineRemainingCheckpoints(state: ConversationState): ConversationState {
  if (state.phase !== "files") return state;
  const checkpointIndex = state.checkpointIndex ?? 0;
  if (checkpointIndex === 0) return state;
  return touch({ ...state, checkpointIndex: checkpointIndex - 1, phase: "result" });
}

// --- "Improve accuracy" card (see ResultStep) ---------------------------------------------------

export interface AccuracyOffer {
  /** Checkpoint rounds whose documents haven't been folded into the current result yet. */
  remaining: { index: number; checkpoint: ReconciliationCheckpoint }[];
  /** The subset of `remaining` whose documents are already uploaded/fetched and ready — added to
   * the result by "Refresh my result". */
  pending: number[];
  /** How many documents were folded in via the card so far. */
  appliedCount: number;
}

const PORTAL_SESSION_MS = 12 * 60 * 60 * 1000;

// Rounds normally run strictly in order, so before the card is used everything from
// `checkpointIndex` on is missing; documents added from the card (in any order) are tracked in
// `accuracyExtras` and drop out of `remaining` once refreshed into the result.
export function getAccuracyOffer(state: ConversationState): AccuracyOffer {
  const topic = getResolvedTopic(state.discovery.resolvedId);
  const checkpoints = topic?.furtherCheckpoints ?? [];
  const used = new Set([...checkpoints.keys()].filter((i) => i < (state.checkpointIndex ?? 0)));
  (state.accuracyExtras ?? []).forEach((i) => used.add(i));
  const remaining = checkpoints.map((checkpoint, index) => ({ index, checkpoint })).filter(({ index }) => !used.has(index));
  const pending = remaining
    .filter(({ checkpoint }) => checkpoint.files.every((f) => state.uploads[f.fileId]?.status === "ready"))
    .map(({ index }) => index);
  return { remaining, pending, appliedCount: (state.accuracyExtras ?? []).length };
}

// Folds every ready-but-not-yet-applied document from the card into the result.
export function applyAccuracyExtras(state: ConversationState): ConversationState {
  if (state.phase !== "result") return state;
  const { pending } = getAccuracyOffer(state);
  if (pending.length === 0) return state;
  return touch({ ...state, accuracyExtras: [...(state.accuracyExtras ?? []), ...pending] });
}

// The result topic with any card-added documents folded in: their files count as provided and the
// refreshed figures are those of the furthest round the documents cover (a mock — more documents,
// tighter number — same as the round-by-round flow).
function withAccuracyExtras(topic: ReconciliationTopic, effective: ReconciliationTopic, state: ConversationState): ReconciliationTopic {
  const extras = state.accuracyExtras ?? [];
  const checkpoints = topic.furtherCheckpoints ?? [];
  if (extras.length === 0) return effective;
  const covered = (state.checkpointIndex ?? 0) + extras.length;
  const requiredFiles = [...effective.requiredFiles, ...extras.flatMap((i) => checkpoints[i]?.files ?? [])];
  // Sales Register vs GSTR-1: the result is rebuilt for the documents actually provided, and shows
  // ITC only once GSTR-3B is among them.
  const mockResult =
    SALES_GST_IDS.has(topic.id)
      ? generateMockResult(`${topic.id}::round-${covered}`, { includeItc: requiredFiles.some((f) => f.fileId === "SG-GSTR3B") })
      : PURCHASE_GST_IDS.has(topic.id)
        ? generateMockResult(`${topic.id}::round-${covered}`, { fileIds: requiredFiles.map((f) => f.fileId) })
        : (checkpoints[covered - 1]?.mockResult ?? effective.mockResult);
  return { ...effective, requiredFiles, mockResult };
}

export function openSchedule(state: ConversationState): ConversationState {
  return touch({ ...state, phase: "schedule" });
}

// The contact details are already on file from the Executive Summary gate (see
// SummaryAccessGate) — this isn't re-asking for them, it's the same record, pre-filled and left
// editable in ScheduleMeetingStep. Scheduling no longer auto-unlocks the detailed findings below —
// the AI confirmation + meeting details are the deliberate end of this step; the findings stay
// blurred until an actual unlock exists. `phase` stays "schedule" (its `resolved` state is now
// driven by `scheduledMeeting` — see buildTranscript — not by a phase transition), so this only
// ever records the booking.
export function scheduleMeeting(
  state: ConversationState,
  contact: ContactDetails,
  meeting: ScheduledMeeting,
  userId: string,
): ConversationState {
  return touch({
    ...state,
    contact,
    userId: userId || state.userId,
    scheduledMeeting: meeting,
  });
}

// --- Executive Summary access gate (see ResultStep/SummaryAccessGate) --

export function submitSummaryContact(state: ConversationState, contact: ContactDetails): ConversationState {
  return touch({ ...state, summaryContact: contact });
}

export function verifySummaryOtp(state: ConversationState): ConversationState {
  if (!state.summaryContact) return state; // no contact on file yet — nothing to verify
  return touch({ ...state, summaryVerified: true });
}

// --- Transcript ---------------------------------------------------------

export function buildTranscript(state: ConversationState): TranscriptItem[] {
  const items: TranscriptItem[] = [];
  const push = (item: TranscriptItem) => items.push(item);
  // Composer messages sent once a reconciliation is resolved can happen during ANY of the phases
  // below (still picking a period, mid-upload, waiting on verification, already at the result) —
  // appended right before every return, not just the final one, so a message typed before the
  // conversation has moved past "files" (say) doesn't silently vanish from the transcript.
  let outcomeShown = false;
  const finish = (): TranscriptItem[] => {
    appendFreeMessages(items, state, outcomeShown ? "other" : "all");
    return items;
  };

  if (state.firstMessage) {
    push({ kind: "user-text", id: "first-message", text: state.firstMessage });
  }

  for (const turn of state.discovery.turns) {
    if (turn.kind === "message") {
      push({ kind: "assistant-text", id: turn.id, text: turn.text });
    } else if (turn.kind === "options") {
      push({
        kind: "discovery-options",
        id: turn.id,
        prompt: turn.prompt,
        options: turn.options,
        selectedId: turn.selectedId,
        resolved: turn.selectedId !== null,
      });
    } else if (turn.kind === "freetext") {
      // No inline input here — the persistent composer (see submitChatMessage/submitFreeMessage)
      // is the one place to type a reply, so this is just DataTwin's question, same as any other
      // assistant line. Whatever the user types next shows up as its own appended "user" turn.
      push({ kind: "assistant-text", id: turn.id, text: turn.prompt });
    } else {
      push({ kind: "user-text", id: turn.id, text: turn.text });
    }
  }

  if (state.phase === "discovery") return finish();

  const topic = getResolvedTopic(state.discovery.resolvedId);

  if (!topic) {
    // Discovery ended without identifying a reconciliation (the graceful "connect with the team"
    // fallback) — skip straight to scheduling, there's nothing to upload/verify.
    appendContactAndBeyond(items, state, null);
    return finish();
  }

  const summary = buildIntentSummary(topic);
  const intentPending = state.intentConfirmed === false;
  push({
    kind: "intent-card",
    id: "intent-card",
    label: topic.label,
    userWords: userWordsForIntent(state),
    ...summary,
    resolved: !intentPending,
  });
  if (intentPending) return finish();

  const mode = periodModeFor(topic.id);
  const yearEndPicked = state.selectedPeriodId === "year-end";
  push({
    kind: "period-options",
    id: "period-select",
    mode,
    prompt: "Which period would you like to analyse?",
    selectedId: state.selectedPeriodId,
    resolved: state.phase !== "period-select" || yearEndPicked,
  });

  if (state.phase === "period-select" && yearEndPicked) {
    push({
      kind: "discovery-options",
      id: YEAR_ROUTE_TURN_ID,
      prompt:
        "Year-end checks use your annual return (GSTR-9) instead of GSTR-1, so I'd run Books Turnover vs GSTR-9 for the full financial year. Is that okay?",
      options: [
        { id: "yes", label: "Yes, run the year-end check" },
        { id: "no", label: "No, stay with a single month" },
      ],
      selectedId: null,
      resolved: false,
    });
    return finish();
  }

  if (state.phase === "period-select") return finish();

  if (state.selectedPeriodId === "custom") {
    push({
      kind: "custom-period-input",
      id: "custom-period",
      mode,
      resolved: state.phase !== "custom-period",
      value: state.customPeriodRange,
    });
    if (state.phase === "custom-period") return finish();
    push({
      kind: "assistant-text",
      id: "custom-period-ack",
      text: `Got it — I'll look at ${formatPeriodRange(state.customPeriodRange!)}.`,
    });
  }

  // A scripted multi-checkpoint reconciliation (see ReconciliationTopic.furtherCheckpoints) collects
  // one round at a time — files, then verification — pre-advancing straight into the next round's
  // own file-upload turn once a round with a further checkpoint finishes verifying (see
  // completeVerification), rather than stopping for a separate decision first. Only ONE round ever
  // actually reaches "result": every earlier round's own files/verification stay in the transcript
  // as real, already-settled history (this loop still renders every round up to and including the
  // current one in full), but a round the conversation has since moved past never gets a result of
  // its own — the loop just carries on (`continue`) until it reaches whichever round the
  // conversation is actually resting on. A topic with no further checkpoints has exactly one round
  // and goes straight to "result", so this behaves exactly as it did before checkpoints existed.
  const totalRounds = totalCheckpointCount(topic);
  const currentCheckpointIndex = state.checkpointIndex ?? 0;
  for (let round = 0; round <= currentCheckpointIndex && round < totalRounds; round++) {
    const isCurrentRound = round === currentCheckpointIndex;
    const effectiveTopic = effectiveTopicForCheckpoint(topic, round);
    const roundFiles = round === 0 ? effectiveTopic.requiredFiles : topic.furtherCheckpoints![round - 1].files;
    const firstNewFile = roundFiles[0];

    push({
      kind: "assistant-text",
      id: `files-ack-${round}`,
      text:
        effectiveTopic.filesIntro ??
        (firstNewFile
          ? `Let's start with your ${firstNewFile.name}.\n\nWhy this helps: ${firstNewFile.why}`
          : "Let's see what I have to work with."),
    });
    push({
      kind: "file-upload",
      id: `file-upload-${round}`,
      topic: effectiveTopic,
      resolved: !isCurrentRound || state.phase !== "files",
      // Every earlier round's files were already shown in full in that round's own "file-upload"
      // item — this one starts right after them, on `effectiveTopic.requiredFiles`'s own
      // cumulative list, so only this round's newly-added file(s) render here.
      startFileIndex: effectiveTopic.requiredFiles.length - roundFiles.length,
      // Offering to stop here only makes sense for a checkpoint round (never the mandatory base
      // pair), only while it's the one currently being asked for, and only before the user has
      // engaged with its file at all — once they have, they've effectively already said "add it".
      canDecline:
        round > 0 &&
        isCurrentRound &&
        state.phase === "files" &&
        roundFiles.every((f) => !state.uploads[f.fileId] && !state.fileSource[f.fileId]),
    });

    if (isCurrentRound && state.phase === "files") return finish();

    push({ kind: "verification", id: `verification-${round}` });

    if (isCurrentRound && state.phase === "verifying") return finish();

    // This round has been superseded — completeVerification already pre-advanced past it into the
    // next one — nothing further to show for it.
    if (!isCurrentRound) continue;

    const resultTopic = withAccuracyExtras(topic, effectiveTopic, state);
    if (state.demoOutcome) {
      // The command that caused this outcome reads just before it, not after.
      appendFreeMessages(items, state, "demo");
      appendOutcome(items, state, resultTopic);
      outcomeShown = true;
      return finish();
    }
    push({ kind: "result", id: "result", topic: resultTopic, active: state.phase === "result" });
    appendContactAndBeyond(items, state, resultTopic);
    appendFileEvents(items, state, effectiveTopic);
    return finish();
  }

  // Unreachable in practice — the loop above always returns by the time it processes
  // `currentCheckpointIndex` — kept only so this function provably returns on every path.
  return finish();
}

// The wording on each outcome card: a one-line headline, then two or three lines on what happened
// and what to do next, naming the file or check involved.
function appendOutcome(items: TranscriptItem[], state: ConversationState, topic: ReconciliationTopic): void {
  const outcome = state.demoOutcome!;
  const badUpload = Object.values(state.uploads).find((upload) => BAD_FILE_NAME.test(upload.fileName));
  const fileName = badUpload?.fileName ?? `your ${topic.requiredFiles[0]?.name ?? "file"}`;
  // Sales Register vs GSTR-1 is called "Sales Register vs GST reconciliation" in the conversation.
  const checkName =
    topic.id === "10.1"
      ? "Sales Register vs GST reconciliation"
      : topic.id === "10.15"
        ? "Sales with GST reconciliation"
        : topic.id === "1.14"
          ? "Purchase with GST reconciliation"
          : topic.label;
  const portalId = topic.portalFetchFileIds?.[0];
  const portalName = topic.requiredFiles.find((f) => f.fileId === portalId)?.name ?? "return";

  const content: Record<DemoOutcome, { title: string; reason: string }> = {
    "file-error": {
      title: "Oops! One of your files needs a look",
      reason: `Some entries in ${fileName} couldn't be read, such as rows with a missing GSTIN or amounts saved as text, so we couldn't match them reliably. Fix those rows and upload the file again. Nothing else you've shared is lost.`,
    },
    "api-error": {
      title: "Oops! We couldn't reach the GST Portal",
      reason: `The GST Portal didn't answer in time, so your ${portalName} couldn't be fetched and the reconciliation stopped. Your uploaded files are safe. Try again in a few minutes, or upload that file yourself.`,
    },
    "reconciliation-error": {
      title: "Oops! The reconciliation hit a snag",
      reason: `We matched most of your records, but too many invoices had no usable invoice number to finish ${checkName}. Check the invoice number column in your files and run it again.`,
    },
    "no-impact": {
      title: "Good news! No impact found",
      reason: `We checked ${checkName} and everything lines up. Your books and returns agree, so there's no tax at risk and nothing to recover for this period.`,
    },
  };
  items.push({ kind: "outcome", id: "outcome", outcome, ...content[outcome] });

  if (outcome === "no-impact") {
    items.push({
      kind: "next-check",
      id: "next-check",
      prompt: "Would you like to check another reconciliation?",
      options: [
        { id: "another", label: "Yes, check another" },
        { id: "done", label: "No, that's all for now" },
      ],
      selectedId: state.nextCheck ?? null,
    });
    if (state.nextCheck === "done") {
      items.push({
        kind: "assistant-text",
        id: "next-check-done",
        text: "Sounds good. I'm here whenever you want to run another check.",
      });
    }
  }
}

const REPLACE_PHRASES = [
  (name: string) =>
    `The updated ${name} is now in place. Would you like me to re-check the reconciliation using the updated file set?`,
  (name: string) =>
    `Thanks — I've swapped in the new ${name}. The reconciliation context has changed a little; want me to re-check it against the updated files?`,
];

const REMOVE_PHRASES = [
  (name: string) =>
    `Got it — I've removed ${name}. Continuing without it may reduce the completeness of the analysis. Want to carry on with what's already provided, or share another document instead?`,
  (name: string) =>
    `${name} has been removed from this reconciliation. The analysis will be less complete without it — let me know if you'd like to continue as-is or provide a replacement.`,
];

// Replace/remove actions can happen well after the original upload exchange (even once results
// are showing) — they're appended here as their own new turns rather than rewritten into the
// file-upload step they originated from.
function appendFileEvents(items: TranscriptItem[], state: ConversationState, topic: ReconciliationTopic | null): void {
  state.fileEvents.forEach((event, index) => {
    const requirement = topic
      ? [...topic.requiredFiles, ...topic.optionalFiles].find((f) => f.fileId === event.fileId)
      : undefined;
    const name = requirement?.name ?? event.fileName;
    const variant = index % 2;
    const text =
      event.kind === "replace" ? REPLACE_PHRASES[variant](name) : REMOVE_PHRASES[variant](name);
    items.push({ kind: "assistant-text", id: `file-event-${event.id}`, text });
  });
}

// Composer messages sent after discovery, each rendered as the user's turn immediately followed
// by DataTwin's acknowledgement — appended wherever the conversation currently stands (see
// `finish()` above), never rewriting an earlier turn.
function appendFreeMessages(items: TranscriptItem[], state: ConversationState, which: "all" | "demo" | "other"): void {
  for (const message of state.freeMessages) {
    if (which === "demo" && !message.demo) continue;
    if (which === "other" && message.demo) continue;
    items.push({ kind: "user-text", id: `free-user-${message.id}`, text: message.text });
    items.push({ kind: "assistant-text", id: `free-reply-${message.id}`, text: message.reply });
  }
}

function appendContactAndBeyond(items: TranscriptItem[], state: ConversationState, topic: ReconciliationTopic | null): void {
  if (state.phase === "schedule" || state.phase === "reveal") {
    // "Resolved" now tracks whether a meeting has actually been booked, not a phase transition —
    // scheduling no longer moves `phase` on to "reveal" (see scheduleMeeting), so a phase
    // comparison alone could never flip this back to true.
    items.push({ kind: "schedule", id: "schedule", resolved: state.scheduledMeeting !== null });
  }

  if (state.phase === "reveal" && topic) {
    items.push({ kind: "reveal", id: "reveal", topic });
  }
}
