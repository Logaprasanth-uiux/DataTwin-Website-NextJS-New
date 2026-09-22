"use client";

import { useState } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { findResumableConversation, launchExistingChat, launchFreshChat } from "@/lib/chat/launch";
import type { ConversationSummary } from "@/lib/chat/types";
import { ContinueConversationModal } from "./ContinueConversationModal";

// Drop-in replacement for a `<CtaLink href="#contact">` that instead launches the chat
// experience — checking for a mocked previous conversation first, per the "existing conversation"
// requirement, before opening a fresh one.
export function RecoveryCtaButton({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<ConversationSummary | null>(null);

  const handleClick = () => {
    const existing = findResumableConversation();
    if (existing) {
      setPending(existing);
      return;
    }
    launchFreshChat();
  };

  return (
    <>
      <CtaLink onClick={handleClick}>{children}</CtaLink>
      {pending && (
        <ContinueConversationModal
          conversation={pending}
          onClose={() => setPending(null)}
          onContinue={() => {
            launchExistingChat(pending.id);
            setPending(null);
          }}
          onStartNew={() => {
            launchFreshChat();
            setPending(null);
          }}
        />
      )}
    </>
  );
}
