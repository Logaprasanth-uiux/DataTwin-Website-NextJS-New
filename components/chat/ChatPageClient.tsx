"use client";

import { useCallback, useEffect, useState, useRef, useSyncExternalStore } from "react";
import {
  advanceToReveal,
  advanceUploadStatus,
  beginVerification,
  buildTranscript,
  completeVerification,
  createInitialState,
  getResolvedTopic,
  openContactForm,
  recordUpload,
  removeUpload,
  selectDiscoveryOption,
  selectPeriod,
  submitContact,
  submitCustomPeriod,
  submitDiscoveryFreeText,
} from "@/lib/chat/engine";
import { getOrCreateUserId, loadConversation, readPendingHandoff, saveConversation } from "@/lib/chat/storage";
import type { ConversationState } from "@/lib/chat/types";
import { ChatHeader } from "./ChatHeader";
import { ConversationsPanel } from "./ConversationsPanel";
import { FileContextPanel } from "./FileContextPanel";
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
  const initial =
    existing ?? createInitialState(conversationId, pending?.firstMessage ?? null, pending?.entryContext);
  snapshotCache.set(conversationId, initial);
  return initial;
}

const FILE_PANEL_PHASES = new Set<ConversationState["phase"]>([
  "files",
  "verifying",
  "result",
  "contact-form",
  "handoff",
  "reveal",
]);

export function ChatPageClient({ conversationId }: { conversationId: string }) {
  const getSnapshot = useCallback(() => loadInitialSnapshot(conversationId), [conversationId]);
  const initialState = useSyncExternalStore(subscribeNever, getSnapshot, getServerSnapshot);

  // Once the conversation progresses, this component owns state locally; `initialState` (from
  // the store above) only supplies the hydration-safe starting point.
  const [override, setOverride] = useState<ConversationState | null>(null);
  const state = override ?? initialState;
  const hasState = Boolean(state);

  const [conversationsOpen, setConversationsOpen] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state) return;
    saveConversation(state);
  }, [state]);

  // A ResizeObserver — not a dependency list of state fields — is what actually keeps the latest
  // turn in view: this transcript reveals content progressively (a typing indicator, then the
  // message, then options, a file's validation checklist advancing frame by frame), so the DOM
  // keeps growing well after the React state change that started it. Watching real layout size
  // catches every one of those growth steps, not just the initial state transition.
  //
  // Keyed on `Boolean(state)` rather than `[]`: the very first commit happens while `state` is
  // still null (the hydration placeholder below, before useSyncExternalStore resolves), so the
  // transcript/anchor refs aren't attached to anything yet. An effect that only ever runs once,
  // at that first commit, would find both refs null, no-op forever, and never get another chance
  // — this was the actual root cause of "sometimes it just doesn't scroll": it wasn't inconsistent
  // at all, it simply never ran. `Boolean(state)` flips exactly once real content mounts and then
  // stays true, so this still only sets up a single long-lived observer.
  const phaseRef = useRef(state?.phase);
  useEffect(() => {
    phaseRef.current = state?.phase;
  }, [state?.phase]);

  useEffect(() => {
    const container = transcriptRef.current;
    const anchor = scrollAnchorRef.current;
    if (!container || !anchor) return;

    let debounceTimer = 0;
    let lastScrolledHeight = 0;
    let landedOnResult = false;
    let lastPhaseSeen: string | undefined;

    const performScroll = () => {
      const phase = phaseRef.current;
      if (phase !== lastPhaseSeen) {
        lastPhaseSeen = phase;
        landedOnResult = false;
      }

      // The recovery result deserves to land at the top of the viewport the moment it appears —
      // not wherever the ordinary "chase the bottom" anchor happens to leave it — so it's found
      // and scrolled to once, the first time this phase is seen. Later growth still within the
      // same "result" phase (the blurred preview fading in, the connect CTA) intentionally does
      // NOT re-chase the bottom afterwards — that would just drag the viewport straight back off
      // the number this scroll exists to keep in view.
      if (phase === "result") {
        if (landedOnResult) return;
        const target = container.querySelector<HTMLElement>('[data-scroll-target="result"]');
        if (target) {
          landedOnResult = true;
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      anchor.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    // A short debounce, not an immediate scroll on every callback: a single state change can fire
    // several resize events in quick succession (a transition starting, a checklist re-laying-out
    // frame by frame), and scrolling against a height that's mid-change is what caused both the
    // "scrolled too early" and the jittery repeated-scroll symptoms. Waiting a beat after the last
    // one settles it before measuring — a plain timer rather than requestAnimationFrame, since rAF
    // is throttled to a crawl for a backgrounded/off-screen tab and would otherwise delay this
    // indefinitely for anyone not actively looking at it at that exact moment.
    const SETTLE_MS = 80;
    const scheduleScroll = () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        const height = container.scrollHeight;
        if (height === lastScrolledHeight) return;
        lastScrolledHeight = height;
        performScroll();
      }, SETTLE_MS);
    };

    const observer = new ResizeObserver(scheduleScroll);
    observer.observe(container);
    scheduleScroll();
    return () => {
      window.clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [hasState]);

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
    onSelectDiscoveryOption: (turnId, optionId) => update((prev) => selectDiscoveryOption(prev, turnId, optionId)),
    onSubmitDiscoveryFreeText: (turnId, text) => update((prev) => submitDiscoveryFreeText(prev, turnId, text)),
    onSelectPeriod: (id) => update((prev) => selectPeriod(prev, id)),
    onSubmitCustomPeriod: (range) => update((prev) => submitCustomPeriod(prev, range)),
    onUpload: (fileId, fileName) => update((prev) => recordUpload(prev, fileId, fileName)),
    onAdvanceStatus: (fileId, status) => update((prev) => advanceUploadStatus(prev, fileId, status)),
    onRemoveUpload: (fileId) => update((prev) => removeUpload(prev, fileId)),
    onContinueFiles: () => update((prev) => beginVerification(prev)),
    onVerificationComplete: () => update((prev) => completeVerification(prev)),
    onConnect: () => update((prev) => openContactForm(prev)),
    onSubmitContact: (contact) => update((prev) => submitContact(prev, contact, getOrCreateUserId())),
    onPreviewReveal: () => update((prev) => advanceToReveal(prev)),
  };

  const items = buildTranscript(state);
  const topic = getResolvedTopic(state.discovery.resolvedId);
  const showFilePanel = topic !== null && FILE_PANEL_PHASES.has(state.phase);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ChatHeader onToggleConversations={() => setConversationsOpen(true)} />
      <div className="flex flex-1">
        <ConversationsPanel
          current={{ id: state.id, title: state.title, updatedAt: state.updatedAt }}
          open={conversationsOpen}
          onClose={() => setConversationsOpen(false)}
        />

        <div className="flex w-full flex-1 flex-col lg:flex-row">
          <main className="min-w-0 flex-1">
            <div ref={transcriptRef} className="mx-auto flex w-full max-w-3xl flex-col px-5 py-8 sm:px-6 sm:py-10">
              <Transcript items={items} state={state} actions={actions} />
              <div ref={scrollAnchorRef} />
            </div>
          </main>

          <FileContextPanel
            topic={showFilePanel ? topic : null}
            uploads={state.uploads}
            maxRevealed={state.maxRequiredFilesRevealed}
            onUpload={actions.onUpload}
            onAdvanceStatus={actions.onAdvanceStatus}
            onRemove={actions.onRemoveUpload}
          />
        </div>
      </div>
    </div>
  );
}
