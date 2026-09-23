"use client";

import { CtaLink } from "@/components/ui/CtaLink";
import type { EntryContext } from "@/lib/chat/types";
import { useChatLaunch } from "./useChatLaunch";

// Drop-in replacement for a `<CtaLink href="#contact">` that instead launches the chat
// experience directly. `entryContext` shapes the opening assistant message (see
// lib/chat/discovery.ts) and — if this same CTA has a previous conversation — the "Welcome back"
// prompt the chat screen itself shows (see ChatPageClient), so the chat feels like a continuation
// of whichever CTA was clicked. `className`/`variant` forward straight to the underlying CtaLink,
// so this can drop in wherever a plain `<CtaLink href="#contact">` sat before without losing that
// spot's own styling.
export function RecoveryCtaButton({
  children,
  entryContext = "recovery-cta",
  className,
  variant,
}: {
  children: React.ReactNode;
  entryContext?: EntryContext;
  className?: string;
  variant?: React.ComponentProps<typeof CtaLink>["variant"];
}) {
  const { onClick } = useChatLaunch(entryContext);

  return (
    <CtaLink onClick={onClick} className={className} variant={variant}>
      {children}
    </CtaLink>
  );
}
