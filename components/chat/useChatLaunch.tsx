"use client";

import { launchFreshChat } from "@/lib/chat/launch";
import type { EntryContext } from "@/lib/chat/types";

// Shared "launch the chat" behaviour, kept as a hook (rather than baked into one button
// component) so different-looking CTAs — the plain pill CTA and the header's richer "Stop the
// leakage" indicator — can trigger the exact same flow without either one being forced into the
// other's markup.
//
// Always opens a fresh conversation directly — it does NOT check for (or prompt about) a
// resumable previous conversation itself. That decision belongs entirely to the chat screen (see
// ChatPageClient's own "Welcome back" prompt, keyed off this same `entryContext`), not the
// website: every CTA should land the user in chat first, and any prompt appears there.
export function useChatLaunch(entryContext: EntryContext) {
  const onClick = () => {
    launchFreshChat(entryContext);
  };

  return { onClick };
}
