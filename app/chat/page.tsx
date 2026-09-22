import { Suspense } from "react";
import { ChatPageWithParams } from "@/components/chat/ChatPageWithParams";

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageWithParams />
    </Suspense>
  );
}
