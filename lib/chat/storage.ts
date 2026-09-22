import type { ConversationState, ConversationSummary } from "./types";

// Mock persistence for the prototype conversational experience — plain localStorage, no backend,
// no auth, no cookies. A conversation opened in a new tab reads its handoff payload from here.

const INDEX_KEY = "dt-chat:index";
const PENDING_KEY = "dt-chat:pending";
const conversationKey = (id: string) => `dt-chat:conversation:${id}`;

export interface PendingHandoff {
  id: string;
  firstMessage: string | null;
  createdAt: number;
}

const isBrowser = () => typeof window !== "undefined";

export function createConversationId(): string {
  return `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function writePendingHandoff(payload: PendingHandoff): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable (private mode, quota) — the chat page falls back to a fresh empty start.
  }
}

export function readPendingHandoff(id: string): PendingHandoff | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingHandoff;
    return parsed.id === id ? parsed : null;
  } catch {
    return null;
  }
}

function readIndex(): ConversationSummary[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ConversationSummary[];
  } catch {
    return [];
  }
}

function writeIndex(index: ConversationSummary[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch {
    // Best-effort only.
  }
}

export function getMostRecentConversation(): ConversationSummary | null {
  const index = readIndex();
  if (index.length === 0) return null;
  return [...index].sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null;
}

export function loadConversation(id: string): ConversationState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(conversationKey(id));
    if (!raw) return null;
    return JSON.parse(raw) as ConversationState;
  } catch {
    return null;
  }
}

export function saveConversation(state: ConversationState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(conversationKey(state.id), JSON.stringify(state));
    const index = readIndex().filter((entry) => entry.id !== state.id);
    index.push({ id: state.id, title: state.title, updatedAt: state.updatedAt });
    writeIndex(index);
  } catch {
    // Best-effort only — the conversation still works for the current tab session.
  }
}
