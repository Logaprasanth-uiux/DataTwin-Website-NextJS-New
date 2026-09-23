"use client";

import { CtaLink } from "@/components/ui/CtaLink";
import type { EntryContext } from "@/lib/chat/types";
import { useChatLaunch } from "./useChatLaunch";

// Drop-in replacement for a `<CtaLink href="#contact">` that instead launches the chat
// experience — checking for a mocked previous conversation first, per the "existing conversation"
// requirement, before opening a fresh one. `entryContext` shapes the opening assistant message
// (see lib/chat/discovery.ts) so the chat feels like a continuation of whichever CTA was clicked.
export function RecoveryCtaButton({
  children,
  entryContext = "recovery-cta",
}: {
  children: React.ReactNode;
  entryContext?: EntryContext;
}) {
  const { onClick, modal } = useChatLaunch(entryContext);

  return (
    <>
      <CtaLink onClick={onClick}>{children}</CtaLink>
      {modal}
    </>
  );
}
