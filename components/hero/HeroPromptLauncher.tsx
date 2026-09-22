"use client";

import { launchChatFromHero } from "@/lib/chat/launch";
import { HeroPrompt } from "./HeroPrompt";

// Thin client wrapper so `Hero` (a server component) can still render `HeroPrompt` without
// needing to own any browser-only logic itself — pressing Enter opens the chat experience in a
// new tab with the exact typed message carried over.
export function HeroPromptLauncher({ className }: { className?: string }) {
  return <HeroPrompt className={className} onSubmit={launchChatFromHero} />;
}
