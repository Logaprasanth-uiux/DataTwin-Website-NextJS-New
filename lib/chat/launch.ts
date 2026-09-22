import { createConversationId, getMostRecentConversation, writePendingHandoff } from "./storage";
import type { ConversationSummary } from "./types";

// Entry points into the chat experience from the marketing site. Both open the chat in a new
// browser tab; the handoff payload travels through localStorage (readable by the new tab, unlike
// sessionStorage) so the exact first message survives the tab boundary without re-entry.

function openChatTab(id: string): void {
  window.open(`/chat?cid=${id}`, "_blank", "noopener,noreferrer");
}

/** Hero prompt "Enter" — always starts a fresh conversation, no existing-conversation check. */
export function launchChatFromHero(message: string): void {
  const trimmed = message.trim();
  if (!trimmed) return;
  const id = createConversationId();
  writePendingHandoff({ id, firstMessage: trimmed, createdAt: Date.now() });
  openChatTab(id);
}

/** A fresh conversation with no opening user message (assistant greets first). */
export function launchFreshChat(): void {
  const id = createConversationId();
  writePendingHandoff({ id, firstMessage: null, createdAt: Date.now() });
  openChatTab(id);
}

export function launchExistingChat(id: string): void {
  openChatTab(id);
}

export function findResumableConversation(): ConversationSummary | null {
  return getMostRecentConversation();
}
