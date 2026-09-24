import { createConversationId, writePendingHandoff } from "./storage";
import type { EntryContext } from "./types";

// Entry points into the chat experience from the marketing site. Both open the chat in a new
// browser tab, always pointed at a brand-new conversation id; the handoff payload travels through
// localStorage (readable by the new tab, unlike sessionStorage) so the exact first message
// survives the tab boundary without re-entry. Each records how the user got there
// (`entryContext`) so the opening assistant message can match — see lib/chat/discovery.ts.
//
// Neither one decides here whether there's a previous conversation worth resuming — that "Welcome
// back" decision belongs entirely to the chat screen itself (see ChatPageClient), not the website,
// so every CTA lands the user in chat first and the prompt (if any) appears there.

// Deliberately *not* `noopener`/`noreferrer`: this is a same-origin, same-app tab (the chat
// screen), not a link to an external site, so there's no reverse-tabnabbing risk in keeping
// `window.opener` — and ChatHeader's "Back to DataTwin" relies on that reference to refocus this
// exact tab (rather than opening a duplicate) when the chat tab closes itself.
function openChatTab(id: string): void {
  window.open(`/chat?cid=${id}`, "_blank");
}

/** Hero prompt "Enter" — always starts a fresh conversation, no resumable-conversation check. */
export function launchChatFromHero(message: string): void {
  const trimmed = message.trim();
  if (!trimmed) return;
  const id = createConversationId();
  writePendingHandoff({ id, firstMessage: trimmed, entryContext: "hero", createdAt: Date.now() });
  openChatTab(id);
}

/** A fresh conversation with no opening user message (assistant greets first). */
export function launchFreshChat(entryContext: EntryContext = "recovery-cta"): void {
  const id = createConversationId();
  writePendingHandoff({ id, firstMessage: null, entryContext, createdAt: Date.now() });
  openChatTab(id);
}
