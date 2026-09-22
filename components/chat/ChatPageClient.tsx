"use client";

import { useCallback, useEffect, useState, useRef, useSyncExternalStore } from "react";
import {
  advanceToReveal,
  advanceUploadStatus,
  beginVerification,
  buildTranscript,
  completeVerification,
  createInitialState,
  openContactForm,
  recordUpload,
  removeUpload,
  selectPeriod,
  selectTopic,
  submitContact,
  submitSomethingElse,
} from "@/lib/chat/engine";
import { loadConversation, readPendingHandoff, saveConversation } from "@/lib/chat/storage";
import type { ConversationState } from "@/lib/chat/types";
import { ChatHeader } from "./ChatHeader";
import { Transcript, type TranscriptActions } from "./Transcript";

// localStorage (the "external system" here) genuinely differs between the server render and the
// client, so the initial load goes through useSyncExternalStore — same pattern this codebase
// already uses for locale/currency detection (see lib/chat/useCurrency.ts) — rather than an
// effect + setState, which would risk a hydration mismatch between the server's placeholder and
// whatever the client actually has stored.
const snapshotCache = new Map<string, ConversationState>();
const subscribeNever = () => () => {};
const getServerSnapshot = () => null;

function loadInitialSnapshot(conversationId: string): ConversationState {
  const cached = snapshotCache.get(conversationId);
  if (cached) return cached;
  const existing = loadConversation(conversationId);
  const pending = existing ? null : readPendingHandoff(conversationId);
  const initial = existing ?? createInitialState(conversationId, pending?.firstMessage ?? null);
  snapshotCache.set(conversationId, initial);
  return initial;
}

export function ChatPageClient({ conversationId }: { conversationId: string }) {
  const getSnapshot = useCallback(() => loadInitialSnapshot(conversationId), [conversationId]);
  const initialState = useSyncExternalStore(subscribeNever, getSnapshot, getServerSnapshot);

  // Once the conversation progresses, this component owns state locally; `initialState` (from
  // the store above) only supplies the hydration-safe starting point.
  const [override, setOverride] = useState<ConversationState | null>(null);
  const state = override ?? initialState;

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state) return;
    saveConversation(state);
  }, [state]);

  useEffect(() => {
    // "nearest" only scrolls as far as needed to bring the sentinel into view, rather than
    // snapping hard to the absolute bottom — so a tall new block (e.g. the file-upload cards)
    // doesn't yank the question that introduced it off-screen.
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [state?.phase, state?.selectedTopicId, state?.selectedPeriodId, state?.uploads]);

  const title = state?.title;
  useEffect(() => {
    if (title) document.title = `${title} — DataTwin`;
  }, [title]);

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-[13.5px] text-navy-faint">Loading your conversation…</p>
      </div>
    );
  }

  const update = (updater: (prev: ConversationState) => ConversationState) => {
    setOverride(updater(state));
  };

  const actions: TranscriptActions = {
    onSelectTopic: (id) => update((prev) => selectTopic(prev, id)),
    onSubmitSomethingElse: (text) => update((prev) => submitSomethingElse(prev, text)),
    onSelectPeriod: (id) => update((prev) => selectPeriod(prev, id)),
    onUpload: (fileId, fileName) => update((prev) => recordUpload(prev, fileId, fileName)),
    onAdvanceStatus: (fileId, status) => update((prev) => advanceUploadStatus(prev, fileId, status)),
    onRemoveUpload: (fileId) => update((prev) => removeUpload(prev, fileId)),
    onContinueFiles: () => update((prev) => beginVerification(prev)),
    onVerificationComplete: () => update((prev) => completeVerification(prev)),
    onConnect: () => update((prev) => openContactForm(prev)),
    onSubmitContact: (contact) => update((prev) => submitContact(prev, contact)),
    onPreviewReveal: () => update((prev) => advanceToReveal(prev)),
  };

  const items = buildTranscript(state);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ChatHeader title={state.title} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-8 sm:px-6 sm:py-10">
        <Transcript items={items} state={state} actions={actions} />
        <div ref={bottomRef} />
      </main>
    </div>
  );
}
