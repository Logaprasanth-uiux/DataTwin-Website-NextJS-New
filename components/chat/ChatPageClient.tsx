"use client";

import { useCallback, useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  advanceToReveal,
  advanceUploadStatus,
  agreePortalConsent,
  beginFileValidation,
  beginVerification,
  buildTranscript,
  cancelPortalConsent,
  chooseFileSource,
  completePortalFetch,
  completeVerification,
  continueWithFileIssue,
  createInitialState,
  flagFileIssue,
  getResolvedTopic,
  openContactForm,
  recordUpload,
  removeUpload,
  replaceFlaggedFile,
  selectDiscoveryOption,
  selectPeriod,
  submitChatMessage,
  submitContact,
  submitCustomPeriod,
  submitPortalGstin,
  submitSummaryContact,
  toggleFilePreview,
  verifySummaryOtp,
} from "@/lib/chat/engine";
import {
  getMostRecentConversationForContext,
  getOrCreateUserId,
  loadConversation,
  readPendingHandoff,
  saveConversation,
} from "@/lib/chat/storage";
import type { ConversationState, ConversationSummary } from "@/lib/chat/types";
import { ChatComposer } from "./ChatComposer";
import { ChatHeader } from "./ChatHeader";
import { ContinueConversationModal } from "./ContinueConversationModal";
import { ConversationsPanel } from "./ConversationsPanel";
import { FileContextPanel } from "./FileContextPanel";
import { PortalConsentModal } from "./PortalFetchFlow";
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

// The "Welcome back" prompt lives entirely inside the chat screen (not the website that launched
// it) and is keyed to the CTA's own `entryContext`, not "whichever conversation is most recent
// overall" — clicking the GST CTA must never surface a "Stop the Leakage" conversation. It only
// ever applies to a genuinely fresh CTA launch: `existing` being absent means this id has never
// been saved before, and `firstMessage === null` excludes the hero prompt (which always carries
// its own first message and resolves immediately — nothing to "welcome back" into).
const resumableCache = new Map<string, ConversationSummary | null>();
const getResumableServerSnapshot = () => null;

function loadInitialResumable(conversationId: string): ConversationSummary | null {
  const cached = resumableCache.get(conversationId);
  if (cached !== undefined) return cached;
  let resumable: ConversationSummary | null = null;
  if (!loadConversation(conversationId)) {
    const pending = readPendingHandoff(conversationId);
    if (pending && pending.firstMessage === null) {
      resumable = getMostRecentConversationForContext(pending.entryContext, conversationId);
    }
  }
  resumableCache.set(conversationId, resumable);
  return resumable;
}

const FILE_PANEL_PHASES = new Set<ConversationState["phase"]>([
  "files",
  "verifying",
  "result",
  "contact-form",
  "handoff",
  "reveal",
]);

// The composer stays available through the whole normal journey; it's hidden only for the
// intentional terminal states — the contact form is itself the input there, and handoff/reveal
// are read-only summary steps, not places to keep chatting. See engine.ts's `submitChatMessage`
// for how a message typed anywhere else is handled per-phase.
const COMPOSER_HIDDEN_PHASES = new Set<ConversationState["phase"]>(["contact-form", "handoff", "reveal"]);

export function ChatPageClient({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const getSnapshot = useCallback(() => loadInitialSnapshot(conversationId), [conversationId]);
  const initialState = useSyncExternalStore(subscribeNever, getSnapshot, getServerSnapshot);

  // Once the conversation progresses, this component owns state locally; `initialState` (from
  // the store above) only supplies the hydration-safe starting point.
  const [override, setOverride] = useState<ConversationState | null>(null);
  const state = override ?? initialState;
  const hasState = Boolean(state);

  const getResumableSnapshot = useCallback(() => loadInitialResumable(conversationId), [conversationId]);
  const resumable = useSyncExternalStore(subscribeNever, getResumableSnapshot, getResumableServerSnapshot);
  // Once the user has picked either option the prompt stays gone for the rest of this page's
  // life, even though `resumable` itself (cached per conversationId) would otherwise keep saying
  // "yes" — "Start a new conversation" means proceed with the fresh one already prepared here.
  const [welcomeBackDismissed, setWelcomeBackDismissed] = useState(false);
  const showWelcomeBack = Boolean(resumable) && !welcomeBackDismissed;

  const [conversationsOpen, setConversationsOpen] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLElement>(null);

  // The GST-portal consent decision (see PortalConsentModal) is the one place this app asks for an
  // explicit yes/no on sharing access — while it's up, the rest of the chat should read as
  // genuinely paused, not just visually dimmed behind it. At most one file is ever mid-consent at a
  // time, so a simple lookup is enough to know whether to freeze.
  const pendingConsentFileId = state
    ? (Object.keys(state.portalFetch).find((fileId) => state.portalFetch[fileId] === "consent") ?? null)
    : null;
  const frozen = Boolean(pendingConsentFileId);
  // Read inside the scroll effect below (set up once, see its own comment) — a plain boolean
  // dependency would be stale inside that closure, so the latest value lives in a ref instead.
  const frozenRef = useRef(frozen);
  useEffect(() => {
    frozenRef.current = frozen;
  }, [frozen]);

  // Not saved (and so not shown in the Conversations panel or offered by "Welcome back") until
  // there's something meaningful to save — an identified reconciliation, or discovery's own
  // graceful "connect with the team" fallback — so a CTA click or an abandoned first message never
  // litters the panel with an empty "New conversation" entry. `phase` only ever leaves "discovery"
  // once one of those has actually happened (see phaseForStatus in engine.ts).
  const isMeaningful = state?.phase !== "discovery";
  useEffect(() => {
    if (!state || !isMeaningful) return;
    saveConversation(state);
  }, [state, isMeaningful]);

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
      // Frozen (the GST-portal consent modal is up) — skip entirely, including the debounce
      // timer itself, so nothing moves behind the modal and no stale scroll fires the moment it
      // closes either; the next genuine content change once unfrozen schedules its own pass.
      if (frozenRef.current) return;
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        if (frozenRef.current) return;
        const height = container.scrollHeight;
        if (height === lastScrolledHeight) return;
        lastScrolledHeight = height;
        performScroll();
      }, SETTLE_MS);
    };

    const observer = new ResizeObserver(scheduleScroll);
    observer.observe(container);
    // Also watch the composer itself, not just the transcript above it: typing a multi-line
    // message grows the composer, which — inside the fixed-height `<main>` — shrinks the
    // conversation's own scrollable viewport by exactly that much (flex redistributing the space
    // between them), and shrinks back the moment the message is sent. That's a change to how much
    // of the *existing* content is visible, not a change in the transcript's own content height, so
    // it never reached this effect before: the transcript-only observer could stay completely
    // silent across an entire type-and-send round trip, leaving the newly sent message (and
    // whatever arrives after it) exactly as far below the fold as the composer's now-collapsed
    // height, with nothing left to trigger a re-chase.
    if (composerRef.current) observer.observe(composerRef.current);
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
    onSelectPeriod: (id) => update((prev) => selectPeriod(prev, id)),
    onSubmitCustomPeriod: (range) => update((prev) => submitCustomPeriod(prev, range)),
    onUpload: (fileId, fileName) => update((prev) => recordUpload(prev, fileId, fileName)),
    onAdvanceStatus: (fileId, status) => update((prev) => advanceUploadStatus(prev, fileId, status)),
    onRemoveUpload: (fileId) => update((prev) => removeUpload(prev, fileId)),
    onContinueFiles: () => update((prev) => beginVerification(prev)),
    onChooseFileSource: (fileId, source) => update((prev) => chooseFileSource(prev, fileId, source)),
    onSubmitPortalGstin: (fileId) => update((prev) => submitPortalGstin(prev, fileId)),
    onPortalFetchComplete: (fileId, fileName) => update((prev) => completePortalFetch(prev, fileId, fileName)),
    onBeginValidation: (fileId) => update((prev) => beginFileValidation(prev, fileId)),
    onFlagIssue: (fileId) => update((prev) => flagFileIssue(prev, fileId)),
    onContinueAnyway: (fileId) => update((prev) => continueWithFileIssue(prev, fileId)),
    onReplaceFlagged: (fileId) => update((prev) => replaceFlaggedFile(prev, fileId)),
    onTogglePreview: (fileId) => update((prev) => toggleFilePreview(prev, fileId)),
    onVerificationComplete: () => update((prev) => completeVerification(prev)),
    onConnect: () => update((prev) => openContactForm(prev)),
    onSubmitContact: (contact) => update((prev) => submitContact(prev, contact, getOrCreateUserId())),
    onPreviewReveal: () => update((prev) => advanceToReveal(prev)),
    onSubmitSummaryContact: (contact) => update((prev) => submitSummaryContact(prev, contact)),
    onVerifySummaryOtp: () => update((prev) => verifySummaryOtp(prev)),
  };

  // Not part of `TranscriptActions` — the composer is rendered directly here, not through
  // Transcript, since it's a persistent fixture of the page rather than a turn in the transcript.
  const handleSubmitChatMessage = (text: string) => update((prev) => submitChatMessage(prev, text));

  // Also not part of `TranscriptActions`: the consent modal itself now renders at this top level
  // (see `frozen`/`pendingConsentFileId` above), not nested inside the transcript.
  const handleAgreePortalConsent = () => {
    if (pendingConsentFileId) update((prev) => agreePortalConsent(prev, pendingConsentFileId));
  };
  const handleCancelPortalConsent = () => {
    if (pendingConsentFileId) update((prev) => cancelPortalConsent(prev, pendingConsentFileId));
  };

  const items = buildTranscript(state);
  const topic = getResolvedTopic(state.discovery.resolvedId);
  const showFilePanel = topic !== null && FILE_PANEL_PHASES.has(state.phase);
  const showComposer = !COMPOSER_HIDDEN_PHASES.has(state.phase);

  return (
    <>
      <div
        className="flex min-h-screen flex-col bg-background"
        // Freezes the entire chat — header, panels, transcript, composer — behind the GST-portal
        // consent modal: no focus, no clicks, no scroll-into-view targeting, and hidden from
        // assistive tech, all from one native attribute rather than threading a "disabled" flag
        // through every interactive element individually. Both modals render as true siblings
        // below, outside this wrapper, so neither is affected by its own or the other's freeze.
        inert={frozen}
      >
        <ChatHeader onToggleConversations={() => setConversationsOpen(true)} />
        <div className="flex flex-1">
          <ConversationsPanel
            current={
              isMeaningful
                ? { id: state.id, title: state.title, updatedAt: state.updatedAt, entryContext: state.entryContext }
                : null
            }
            open={conversationsOpen}
            onClose={() => setConversationsOpen(false)}
          />

          <div className="flex w-full flex-1 flex-col lg:flex-row">
            {/* The "main Chat panel": bounded to exactly one viewport's worth of height below the
                header (`h-[calc(100vh-4rem)]`, matching the Conversations/file panels' own existing
                `top-16`/`4rem`-header convention) and pinned there with the same `sticky top-16`
                those panels already use — not a new pattern. Only the conversation region inside it
                scrolls (`overflow-y-auto`); the composer is a separate, non-scrolling flex sibling
                below it, so it can never be scrolled past or trail off the bottom of a long
                conversation the way a `sticky bottom-0` element at the end of an ever-growing page
                would (that was the actual bug: such an element only "activates" once you scroll all
                the way to the document's end, so it just kept trailing the conversation downward). */}
            <main className="flex h-[calc(100vh-4rem)] min-h-0 min-w-0 flex-1 flex-col overflow-hidden sticky top-16">
              <div className="dt-thin-scroll min-h-0 flex-1 overflow-y-auto">
                <div ref={transcriptRef} className="mx-auto flex w-full max-w-3xl flex-col px-5 py-8 sm:px-6 sm:py-10">
                  <Transcript items={items} state={state} actions={actions} />
                  {/* `scroll-mb-8`, not a bigger bottom padding on the container above: padding at
                      the end of a scroll region sits *below* whatever scrollIntoView lands on, so it
                      doesn't actually show once scrolled all the way to this anchor. scroll-margin is
                      what scrollIntoView itself respects — it's what actually keeps the latest
                      response a comfortable distance above the composer instead of flush against it. */}
                  <div ref={scrollAnchorRef} className="scroll-mb-8" />
                </div>
              </div>
              {showComposer && <ChatComposer ref={composerRef} onSubmit={handleSubmitChatMessage} />}
            </main>

            <FileContextPanel
              topic={showFilePanel ? topic : null}
              uploads={state.uploads}
              maxRevealed={state.maxRequiredFilesRevealed}
              fileSource={state.fileSource}
              fileValidation={state.fileValidation}
              filePreviewOpen={state.filePreviewOpen}
              onUpload={actions.onUpload}
              onAdvanceStatus={actions.onAdvanceStatus}
              onRemove={actions.onRemoveUpload}
              onTogglePreview={actions.onTogglePreview}
            />
          </div>
        </div>
      </div>

      {showWelcomeBack && resumable && (
        <ContinueConversationModal
          conversation={resumable}
          onContinue={() => router.replace(`/chat?cid=${resumable.id}`)}
          onStartNew={() => setWelcomeBackDismissed(true)}
          onClose={() => setWelcomeBackDismissed(true)}
        />
      )}

      {pendingConsentFileId && (
        <PortalConsentModal onAgree={handleAgreePortalConsent} onCancel={handleCancelPortalConsent} />
      )}
    </>
  );
}
