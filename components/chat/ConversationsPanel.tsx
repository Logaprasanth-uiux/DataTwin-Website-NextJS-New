"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { createConversationId, deleteConversation, listConversations } from "@/lib/chat/storage";
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
  // `null` while the conversation being viewed hasn't become meaningful yet (still in discovery —
  // see ChatPageClient) — it's left out of the list entirely rather than showing up as a
  // placeholder "New conversation" entry, but previously-saved conversations still appear as
  // normal underneath it.
  current: ConversationSummary | null;
  open: boolean;
  onClose: () => void;
}) {
  const stored = useSyncExternalStore(subscribeNever, getConversationsSnapshot, getServerSnapshot);
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const merged = current ? mergeCurrent(stored, current) : stored;
  const conversations = merged.filter((c) => !deletedIds.includes(c.id));

  const newChatHref = () => `/chat?cid=${createConversationId()}`;

  const handleDelete = (id: string) => {
    deleteConversation(id);
    setConfirmingId(null);
    // Deleting the one being viewed would otherwise re-save it on the next state change, so start
    // a clean chat instead.
    if (id === current?.id) {
      router.push(newChatHref());
      return;
    }
    setDeletedIds((prev) => [...prev, id]);
  };

  if (conversations.length === 0) return null;

  const list = (
    <>
      <button
        type="button"
        onClick={() => {
          onClose();
          router.push(newChatHref());
        }}
        className="flex w-full items-center gap-2 rounded-xl border border-navy-hairline bg-white px-3 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:bg-navy/[0.04]"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M8 3v10M3 8h10" />
        </svg>
        New conversation
      </button>
      <p className="dt-eyebrow mt-5 px-1">Conversations</p>
      <nav className="mt-3 flex flex-col gap-1">
        {conversations.map((c) => {
          const active = c.id === current?.id;
          const confirming = confirmingId === c.id;
          return (
            <div
              key={c.id}
              className={`group relative flex items-center rounded-xl transition-colors ${confirming ? "bg-navy/[0.07] ring-1 ring-navy-hairline" : active ? "bg-navy/[0.06]" : "hover:bg-navy/[0.04]"}`}
            >
              {confirming ? (
                <div className="flex w-full flex-col gap-2.5 px-3 py-3">
                  <span className="text-[12.5px] font-medium text-navy">Delete this chat?</span>
                  <span className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="flex-1 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-white"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      className="flex-1 whitespace-nowrap rounded-lg border border-navy-hairline bg-white px-3 py-1.5 text-[12px] font-medium text-navy-muted hover:bg-navy/[0.04]"
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              ) : (
                <>
                  <Link href={`/chat?cid=${c.id}`} onClick={onClose} className="min-w-0 flex-1 px-3 py-3">
                    <span
                      className={`block truncate text-[13px] ${active ? "font-semibold text-navy" : "font-medium text-navy-muted"}`}
                    >
                      {c.title}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(c.id)}
                    aria-label={`Delete conversation: ${c.title}`}
                    className="mr-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-navy-faint opacity-100 transition-opacity hover:bg-navy/[0.08] hover:text-navy focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.6 9h6.8l.6-9M6.7 6.8v3.7M9.3 6.8v3.7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop: a persistent narrow column. */}
      <aside className="hidden w-60 flex-shrink-0 border-r border-navy-hairline bg-white/60 lg:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] dt-thin-scroll overflow-y-auto p-4">{list}</div>
      </aside>

      {/* Mobile/tablet: a drawer, toggled from the header. */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy/30" onClick={onClose} aria-hidden="true" />
          <aside className="dt-fade-up absolute inset-y-0 left-0 dt-thin-scroll w-72 max-w-[80vw] overflow-y-auto bg-white p-4 shadow-soft">
            {list}
          </aside>
        </div>
      )}
    </>
  );
}
