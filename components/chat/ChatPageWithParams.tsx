"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { createConversationId } from "@/lib/chat/storage";
import { ChatPageClient } from "./ChatPageClient";

export function ChatPageWithParams() {
  const searchParams = useSearchParams();
  const cid = searchParams.get("cid");
  // Only used if someone opens /chat directly with no id — keeps the page usable on its own.
  const fallbackId = useMemo(() => createConversationId(), []);

  const conversationId = cid ?? fallbackId;
  // `key` forces a full remount on switching conversations (e.g. via the conversations panel) —
  // otherwise ChatPageClient's local `override` state would keep showing the previous
  // conversation's messages/files under the new id until something else happened to update it.
  return <ChatPageClient key={conversationId} conversationId={conversationId} />;
}
