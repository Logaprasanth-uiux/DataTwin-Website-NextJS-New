import type { Metadata } from "next";
import { ChatFlowEditor } from "@/components/playground/chatflow/ChatFlowEditor";

export const metadata: Metadata = {
  title: "Chat Flow — DataTwin Playground",
  robots: { index: false, follow: false },
};

export default function ChatFlowPage() {
  return <ChatFlowEditor />;
}
