"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatRelativeTime } from "@/lib/chat/relativeTime";
import { listConversations } from "@/lib/chat/storage";
import type { ConversationSummary } from "@/lib/chat/types";

// Read once per page load (same "cache the snapshot" pattern ChatPageClient uses for the initial
// conversation load) — a stable reference across re-renders, which useSyncExternalStore needs to
// avoid re-render loops. The *current* conversation's live title/timestamp are merged in from
// props separately, so that entry never looks stale even though this list itself doesn't.
let cachedList: ConversationSummary[] | null = null;
function getConversationsSnapshot(): ConversationSummary[] {
  if (!cachedList) cachedList = listConversations();
  return cachedList;
}
const subscribeNever = () => () => {};
const getServerSnapshot = (): ConversationSummary[] => [];

function mergeCurrent(
  list: ConversationSummary[],
  current: ConversationSummary,
): ConversationSummary[] {
  const rest = list.filter((c) => c.id !== current.id);
  return [current, ...rest].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function ConversationsPanel({
  current,
  open,
  onClose,
}: {
  current: ConversationSummary;
  open: boolean;
  onClose: () => void;
}) {
  const stored = useSyncExternalStore(subscribeNever, getConversationsSnapshot, getServerSnapshot);
  const conversations = mergeCurrent(stored, current);

  if (conversations.length <= 1) return null;

  const list = (
    <>
      <p className="dt-eyebrow px-1">Conversations</p>
      <nav className="mt-3 flex flex-col gap-1">
        {conversations.map((c) => {
          const active = c.id === current.id;
          return (
            <Link
              key={c.id}
              href={`/chat?cid=${c.id}`}
              onClick={onClose}
              className={`rounded-xl px-3 py-2.5 transition-colors ${active ? "bg-navy/[0.06]" : "hover:bg-navy/[0.04]"}`}
            >
              <span
                className={`block truncate text-[13px] ${active ? "font-semibold text-navy" : "font-medium text-navy-muted"}`}
              >
                {c.title}
              </span>
              <span className="mt-0.5 block text-[11px] text-navy-faint">{formatRelativeTime(c.updatedAt)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop: a persistent narrow column. */}
      <aside className="hidden w-60 flex-shrink-0 border-r border-navy-hairline bg-white/60 lg:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-4">{list}</div>
      </aside>

      {/* Mobile/tablet: a drawer, toggled from the header. */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy/30" onClick={onClose} aria-hidden="true" />
          <aside className="dt-fade-up absolute inset-y-0 left-0 w-72 max-w-[80vw] overflow-y-auto bg-white p-4 shadow-soft">
            {list}
          </aside>
        </div>
      )}
    </>
  );
}
