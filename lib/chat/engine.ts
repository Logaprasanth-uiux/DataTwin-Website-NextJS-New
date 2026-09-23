import {
  createInitialDiscovery,
  selectDiscoveryOption as applySelectDiscoveryOption,
  submitDiscoveryFreeText as applySubmitDiscoveryFreeText,
} from "./discovery";
import { buildResolvedTopic } from "./reconciliation";
import { generateConversationTitle } from "./title";
import { formatPeriodRange } from "./formatDate";
import type {
  ContactDetails,
  ConversationState,
  CustomPeriodRange,
  EntryContext,
  FileRequirement,
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
    contact: null,
    userId: null,
    revealed: false,
  };
}

function touch(state: ConversationState): ConversationState {
  return { ...state, updatedAt: Date.now() };
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

export function submitDiscoveryFreeText(state: ConversationState, turnId: string, text: string): ConversationState {
  if (!text.trim()) return state;
  const { discovery, status } = applySubmitDiscoveryFreeText(state.discovery, turnId, text);
  return touch({ ...state, discovery, phase: phaseForStatus(status) });
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
export function removeUpload(state: ConversationState, fileId: string): ConversationState {
  const existing = state.uploads[fileId];
  const wasReady = existing?.status === "ready";
  const next = { ...state.uploads };
  delete next[fileId];
  const fileEvents =
    wasReady && existing
      ? [...state.fileEvents, { id: nextFileEventId(state), kind: "remove" as const, fileId, fileName: existing.fileName }]
      : state.fileEvents;
  return touch({ ...state, uploads: next, fileEvents });
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
    } else {
      push({
        kind: "discovery-freetext",
        id: turn.id,
        prompt: turn.prompt,
        resolved: turn.value !== null,
        value: turn.value,
      });
    }
  }

  if (state.phase === "discovery") return items;

  const topic = getResolvedTopic(state.discovery.resolvedId);

  if (!topic) {
    // Discovery ended without identifying a reconciliation (the graceful "connect with the team"
    // fallback) — skip straight to contact/handoff, there's nothing to upload/verify.
    appendContactAndBeyond(items, state, null);
    return items;
  }

  push({
    kind: "period-options",
    id: "period-select",
    prompt: "Which period would you like to analyse?",
    selectedId: state.selectedPeriodId,
    resolved: state.phase !== "period-select",
  });

  if (state.phase === "period-select") return items;

  if (state.selectedPeriodId === "custom") {
    push({
      kind: "custom-period-input",
      id: "custom-period",
      resolved: state.phase !== "custom-period",
      value: state.customPeriodRange,
    });
    if (state.phase === "custom-period") return items;
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
    text: firstRequired ? `Let's start with your ${firstRequired.name}.` : "Let's see what I have to work with.",
  });
  push({
    kind: "file-upload",
    id: "file-upload",
    topic,
    resolved: state.phase !== "files",
  });

  if (state.phase === "files") return items;

  push({ kind: "verification", id: "verification" });

  if (state.phase === "verifying") return items;

  push({ kind: "result", id: "result", topic });

  appendContactAndBeyond(items, state, topic);
  appendFileEvents(items, state, topic);
  return items;
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
