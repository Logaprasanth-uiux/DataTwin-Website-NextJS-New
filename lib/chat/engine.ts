import { RECONCILIATION_TOPICS, SOMETHING_ELSE_OPTION_ID } from "./data/topics";
import { generateConversationTitle } from "./title";
import type {
  ConversationState,
  PeriodOptionId,
  ReconciliationTopic,
  TranscriptItem,
  UploadedFile,
} from "./types";

// Pure conversation logic: given a state and an action, what's the next state; given a state,
// what does the transcript look like. No rendering, no storage, no browser APIs — this module
// could drive a CLI or a test just as easily as the chat UI.

export function getTopic(topicId: string | null): ReconciliationTopic | null {
  if (!topicId) return null;
  return RECONCILIATION_TOPICS.find((topic) => topic.id === topicId) ?? null;
}

export function createInitialState(id: string, firstMessage: string | null): ConversationState {
  const now = Date.now();
  return {
    id,
    title: generateConversationTitle(firstMessage),
    createdAt: now,
    updatedAt: now,
    firstMessage,
    phase: "topic-select",
    selectedTopicId: null,
    somethingElseText: null,
    selectedPeriodId: null,
    uploads: {},
    contact: null,
    revealed: false,
  };
}

function touch(state: ConversationState): ConversationState {
  return { ...state, updatedAt: Date.now() };
}

export function selectTopic(state: ConversationState, topicId: string): ConversationState {
  if (topicId === SOMETHING_ELSE_OPTION_ID) {
    return touch({ ...state, selectedTopicId: topicId, phase: "something-else" });
  }
  const topic = getTopic(topicId);
  if (!topic) return state;
  return touch({ ...state, selectedTopicId: topicId, phase: "period-select" });
}

export function submitSomethingElse(state: ConversationState, text: string): ConversationState {
  return touch({ ...state, somethingElseText: text.trim(), phase: "contact-form" });
}

export function selectPeriod(state: ConversationState, periodId: PeriodOptionId): ConversationState {
  return touch({ ...state, selectedPeriodId: periodId, phase: "files" });
}

export function recordUpload(state: ConversationState, fileId: string, fileName: string): ConversationState {
  const upload: UploadedFile = { fileId, fileName, status: "uploaded" };
  return touch({ ...state, uploads: { ...state.uploads, [fileId]: upload } });
}

export function advanceUploadStatus(
  state: ConversationState,
  fileId: string,
  status: UploadedFile["status"],
): ConversationState {
  const existing = state.uploads[fileId];
  if (!existing) return state;
  return touch({ ...state, uploads: { ...state.uploads, [fileId]: { ...existing, status } } });
}

export function removeUpload(state: ConversationState, fileId: string): ConversationState {
  const next = { ...state.uploads };
  delete next[fileId];
  return touch({ ...state, uploads: next });
}

export function requiredFilesReady(state: ConversationState): boolean {
  const topic = getTopic(state.selectedTopicId);
  if (!topic) return false;
  return topic.requiredFiles.every((f) => state.uploads[f.fileId]?.status === "ready");
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
  contact: ConversationState["contact"],
): ConversationState {
  return touch({ ...state, contact, phase: "handoff" });
}

export function advanceToReveal(state: ConversationState): ConversationState {
  return touch({ ...state, phase: "reveal", revealed: true });
}

// --- Transcript ---------------------------------------------------------

const OPENING_QUESTION = "What are you mainly trying to identify?";
const GREETING = "Hi, I'm here to help you find what's recoverable.";

export function buildTranscript(state: ConversationState): TranscriptItem[] {
  const items: TranscriptItem[] = [];
  const push = (item: TranscriptItem) => items.push(item);

  if (state.firstMessage) {
    push({ kind: "user-text", id: "first-message", text: state.firstMessage });
    push({
      kind: "assistant-text",
      id: "opening-ack",
      text: "I can help narrow this down.",
    });
  } else {
    push({ kind: "assistant-text", id: "opening-ack", text: GREETING });
  }

  push({
    kind: "topic-options",
    id: "topic-select",
    prompt: OPENING_QUESTION,
    selectedId: state.selectedTopicId,
    resolved: state.phase !== "topic-select",
  });

  if (state.selectedTopicId === SOMETHING_ELSE_OPTION_ID) {
    push({
      kind: "assistant-text",
      id: "something-else-ack",
      text: "No problem — tell me a bit about what you're looking into, and our team can help pinpoint the right reconciliation.",
    });
    push({
      kind: "something-else-input",
      id: "something-else-input",
      resolved: state.phase !== "something-else",
      value: state.somethingElseText,
    });
    if (state.phase !== "topic-select" && state.phase !== "something-else") {
      push({
        kind: "assistant-text",
        id: "something-else-handoff",
        text: "Thanks — that's a bit more specialised. Let's get you connected with the DataTwin Team so they can identify the right reconciliation and next steps with you directly.",
      });
    }
    appendContactAndBeyond(items, state);
    return items;
  }

  const topic = getTopic(state.selectedTopicId);
  if (!topic) return items;

  push({ kind: "assistant-text", id: "topic-ack", text: topic.acknowledgement });

  push({
    kind: "period-options",
    id: "period-select",
    prompt: "Which period would you like to analyse?",
    selectedId: state.selectedPeriodId,
    resolved: state.phase !== "period-select" && state.phase !== "topic-select",
  });

  if (state.phase === "period-select") return items;

  push({
    kind: "assistant-text",
    id: "files-ack",
    text: "Here's what I'll need to run this reconciliation.",
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

  appendContactAndBeyond(items, state);
  return items;
}

function appendContactAndBeyond(items: TranscriptItem[], state: ConversationState): void {
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
    items.push({ kind: "handoff", id: "handoff" });
  }

  if (state.phase === "reveal") {
    const topic = getTopic(state.selectedTopicId);
    if (topic) {
      items.push({ kind: "reveal", id: "reveal", topic });
    }
  }
}
