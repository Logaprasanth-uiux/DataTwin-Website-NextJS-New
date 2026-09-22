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

  return <ChatPageClient conversationId={cid ?? fallbackId} />;
}
