"use client";

import { useState } from "react";
import { findResumableConversation, launchExistingChat, launchFreshChat } from "@/lib/chat/launch";
import type { ConversationSummary, EntryContext } from "@/lib/chat/types";
import { ContinueConversationModal } from "./ContinueConversationModal";

// Shared "launch the chat, checking for a resumable conversation first" behaviour, kept as a hook
// (rather than baked into one button component) so different-looking CTAs — the plain pill CTA and
// the header's richer "Stop the leakage" indicator — can trigger the exact same flow without
// either one being forced into the other's markup.
export function useChatLaunch(entryContext: EntryContext) {
  const [pending, setPending] = useState<ConversationSummary | null>(null);

  const onClick = () => {
    const existing = findResumableConversation();
    if (existing) {
      setPending(existing);
      return;
    }
    launchFreshChat(entryContext);
  };

  const modal = pending ? (
    <ContinueConversationModal
      conversation={pending}
      onClose={() => setPending(null)}
      onContinue={() => {
        launchExistingChat(pending.id);
        setPending(null);
      }}
      onStartNew={() => {
        launchFreshChat(entryContext);
        setPending(null);
      }}
    />
  ) : null;

  return { onClick, modal };
}
