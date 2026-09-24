"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/Logo";

// The conversation title now lives in the conversations panel (see ConversationsPanel), so the
// header is free to do what a header actually needs to: identify DataTwin and offer a clear way
// back to the website — navigation, not a "close" action.
export function ChatHeader({ onToggleConversations }: { onToggleConversations?: () => void }) {
  const router = useRouter();

  // Chat always opens in its own tab (see lib/chat/launch.ts's `window.open`), with the DataTwin
  // main-page tab left open behind it — so "back" means returning to that already-open tab, not
  // navigating this one to "/" (which would leave a second, now-redundant DataTwin tab sitting
  // next to the original). `window.opener` survives because launch.ts deliberately omits
  // `noopener`/`noreferrer` for this same-origin tab. If the opener is gone (closed, or this chat
  // tab was reached some other way — a bookmark, a refresh after the opener navigated away), fall
  // back to the safest previous behavior: navigate this same tab to the homepage, never opening a
  // duplicate.
  const handleBackToDataTwin = () => {
    const opener = window.opener as Window | null;
    if (opener && !opener.closed) {
      try {
        opener.focus();
      } catch {
        // Ignore — still attempt to close this tab below; falls through to the in-tab navigation
        // fallback if that doesn't succeed either.
      }
      window.close();
    }
    // Only reached if there was no usable opener, or `window.close()` was refused (e.g. a tab the
    // browser doesn't consider script-closable) — this tab is still alive, so land the user on the
    // homepage right here rather than leaving them stranded.
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-navy-hairline bg-white/90 backdrop-blur-[16px]">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-6">
        <div className="flex items-center gap-3">
          {onToggleConversations && (
            <button
              type="button"
              onClick={onToggleConversations}
              aria-label="Show conversations"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-navy-muted transition-colors hover:bg-navy/[0.05] lg:hidden"
            >
              <MenuIcon className="h-4 w-4" />
            </button>
          )}
          <Logo className="h-5 w-auto" />
        </div>

        <button
          type="button"
          onClick={handleBackToDataTwin}
          className="group flex flex-shrink-0 items-center gap-1.5 text-[13px] font-medium text-navy-muted transition-colors hover:text-navy"
        >
          <BackIcon className="h-3.5 w-3.5 text-accent transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to DataTwin
        </button>
      </div>
    </header>
  );
}

function BackIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M13 8H3M7 4L3 8l4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
