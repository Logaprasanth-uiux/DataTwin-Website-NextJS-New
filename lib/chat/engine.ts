import {
  createInitialDiscovery,
  selectDiscoveryOption as applySelectDiscoveryOption,
  submitFreeMessage as applySubmitFreeMessage,
} from "./discovery";
import { buildResolvedTopic } from "./reconciliation";
import { generateConversationTitle, PLACEHOLDER_TITLE } from "./title";
import { formatPeriodRange } from "./formatDate";
import type {
  ContactDetails,
  ConversationState,
  CustomPeriodRange,
  DiscoveryTurn,
  EntryContext,
  FileRequirement,
  FileSourceChoice,
  PeriodOptionId,
  ReconciliationTopic,
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

export function createInitialState(
  id: string,
  firstMessage: string | null,
  entryContext: EntryContext = "direct",
): ConversationState {
  const now = Date.now();
  const { discovery, status } = createInitialDiscovery(firstMessage, entryContext);
  return {
    id,
    title: generateConversationTitle(firstMessage),
    createdAt: now,
    updatedAt: now,
    firstMessage,
    entryContext,
    phase: status === "resolved" ? "period-select" : status === "fallback" ? "contact-form" : "discovery",
    discovery,
    selectedPeriodId: null,
    customPeriodRange: null,
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
  };
}

function isUserTurn(turn: DiscoveryTurn): turn is Extract<DiscoveryTurn, { kind: "user" }> {
  return turn.kind === "user";
}

// A conversation's title starts as "New conversation" (see createInitialState) and only becomes
// meaningful once there's something to name it after — the identified reconciliation's own
// business-friendly label, or (discovery ended in the graceful "connect with the team" fallback,
// with no specific reconciliation matched) whatever the user most recently described, using the
// same heuristic the hero prompt's own first message already goes through.
function deriveConversationTitle(state: ConversationState): string {
  const topic = getResolvedTopic(state.discovery.resolvedId);
  if (topic) return topic.label;

  const lastUserTurn = [...state.discovery.turns].reverse().find(isUserTurn);
  if (lastUserTurn) return generateConversationTitle(lastUserTurn.text);

  return state.firstMessage ? generateConversationTitle(state.firstMessage) : state.title;
}

function touch(state: ConversationState): ConversationState {
  // Recomputed only while the title is still the generic placeholder (a hero-launched
  // conversation already has a real, user-phrased title from the moment it's created — that's
  // left alone even after it resolves). Once it's been replaced with something real, it stays —
  // no need to keep re-deriving it (rebuilding the resolved topic) on every single action.
  const needsTitle = state.phase !== "discovery" && state.title === PLACEHOLDER_TITLE;
  const title = needsTitle ? deriveConversationTitle(state) : state.title;
  return { ...state, updatedAt: Date.now(), title };
}

function phaseForStatus(status: "continue" | "resolved" | "fallback"): ConversationState["phase"] {
  if (status === "resolved") return "period-select";
  if (status === "fallback") return "contact-form";
  return "discovery";
}

export function selectDiscoveryOption(state: ConversationState, turnId: string, optionId: string): ConversationState {
  const { discovery, status } = applySelectDiscoveryOption(state.discovery, turnId, optionId);
  return touch({ ...state, discovery, phase: phaseForStatus(status) });
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
export function submitChatMessage(state: ConversationState, text: string): ConversationState {
  const trimmed = text.trim();
  if (!trimmed) return state;

  if (state.phase === "discovery") {
    const { discovery, status } = applySubmitFreeMessage(state.discovery, trimmed);
    return touch({ ...state, discovery, phase: phaseForStatus(status) });
  }

  const topic = getResolvedTopic(state.discovery.resolvedId);
  const reply = pickFreeMessageReply(state.freeMessages.length, topic?.label ?? null);
  const freeMessages = [...state.freeMessages, { id: `fm${state.freeMessages.length}`, text: trimmed, reply }];
  return touch({ ...state, freeMessages });
}

export function selectPeriod(state: ConversationState, periodId: PeriodOptionId): ConversationState {
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
    const topic = getResolvedTopic(state.discovery.resolvedId);
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
  const portalFetch =
    source === "portal" ? { ...state.portalFetch, [fileId]: "gstin" as const } : state.portalFetch;
  return touch({ ...state, fileSource, portalFetch });
}

export function submitPortalGstin(state: ConversationState, fileId: string): ConversationState {
  if (state.portalFetch[fileId] !== "gstin") return state;
  return touch({ ...state, portalFetch: { ...state.portalFetch, [fileId]: "otp" } });
}

// The OTP itself is never passed in or stored — by the time this is called, the caller (a local
// verifying/fetching animation, not persisted state — see PortalFetchFlow) has already confirmed
// it. This just lands the fetched file exactly where a normal upload would, reusing the same
// ready-transition (and its nextFileHint/maxRequiredFilesRevealed side effects) unchanged.
export function completePortalFetch(state: ConversationState, fileId: string, fileName: string): ConversationState {
  const uploaded = recordUpload(state, fileId, fileName);
  return advanceUploadStatus(uploaded, fileId, "ready");
}

export function requiredFilesReady(state: ConversationState): boolean {
  const topic = getResolvedTopic(state.discovery.resolvedId);
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

export function beginVerification(state: ConversationState): ConversationState {
  if (!requiredFilesReady(state)) return state;
  return touch({ ...state, phase: "verifying" });
}

export function completeVerification(state: ConversationState): ConversationState {
  return touch({ ...state, phase: "result" });
}

export function openContactForm(state: ConversationState): ConversationState {
  return touch({ ...state, phase: "contact-form" });
}

export function submitContact(
  state: ConversationState,
  contact: ContactDetails,
  userId: string,
): ConversationState {
  return touch({ ...state, contact, userId: userId || state.userId, phase: "handoff" });
}

export function advanceToReveal(state: ConversationState): ConversationState {
  return touch({ ...state, phase: "reveal", revealed: true });
}

// --- Transcript ---------------------------------------------------------

export function buildTranscript(state: ConversationState): TranscriptItem[] {
  const items: TranscriptItem[] = [];
  const push = (item: TranscriptItem) => items.push(item);
  // Composer messages sent once a reconciliation is resolved can happen during ANY of the phases
  // below (still picking a period, mid-upload, waiting on verification, already at the result) —
  // appended right before every return, not just the final one, so a message typed before the
  // conversation has moved past "files" (say) doesn't silently vanish from the transcript.
  const finish = (): TranscriptItem[] => {
    appendFreeMessages(items, state);
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
    // fallback) — skip straight to contact/handoff, there's nothing to upload/verify.
    appendContactAndBeyond(items, state, null);
    return finish();
  }

  push({
    kind: "period-options",
    id: "period-select",
    prompt: "Which period would you like to analyse?",
    selectedId: state.selectedPeriodId,
    resolved: state.phase !== "period-select",
  });

  if (state.phase === "period-select") return finish();

  if (state.selectedPeriodId === "custom") {
    push({
      kind: "custom-period-input",
      id: "custom-period",
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

  const firstRequired = topic.requiredFiles[0];
  push({
    kind: "assistant-text",
    id: "files-ack",
    text:
      topic.filesIntro ??
      (firstRequired ? `Let's start with your ${firstRequired.name}.` : "Let's see what I have to work with."),
  });
  push({
    kind: "file-upload",
    id: "file-upload",
    topic,
    resolved: state.phase !== "files",
  });

  if (state.phase === "files") return finish();

  push({ kind: "verification", id: "verification" });

  if (state.phase === "verifying") return finish();

  push({ kind: "result", id: "result", topic });

  appendContactAndBeyond(items, state, topic);
  appendFileEvents(items, state, topic);
  return finish();
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
function appendFreeMessages(items: TranscriptItem[], state: ConversationState): void {
  for (const message of state.freeMessages) {
    items.push({ kind: "user-text", id: `free-user-${message.id}`, text: message.text });
    items.push({ kind: "assistant-text", id: `free-reply-${message.id}`, text: message.reply });
  }
}

function appendContactAndBeyond(items: TranscriptItem[], state: ConversationState, topic: ReconciliationTopic | null): void {
  if (state.phase === "result" || state.phase === "contact-form" || state.phase === "handoff" || state.phase === "reveal") {
    if (state.phase !== "result") {
      items.push({
        kind: "contact-form",
        id: "contact-form",
        resolved: state.phase !== "contact-form",
      });
    }
  }

  if (state.phase === "handoff" || state.phase === "reveal") {
    items.push({ kind: "handoff", id: "handoff", canReveal: topic !== null });
  }

  if (state.phase === "reveal" && topic) {
    items.push({ kind: "reveal", id: "reveal", topic });
  }
}
