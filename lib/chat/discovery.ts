import type { CatalogEntry } from "./data/catalog";
import { classifyOpener, resolveIntent } from "./resolver";
import type { DiscoveryState, DiscoveryTurn, EntryContext } from "./types";

// Progressive, free-form reconciliation discovery: "Something else" (and generic/casual openers)
// keep the conversation going — asking a contextual follow-up and narrowing toward a specific
// reconciliation — instead of dropping straight to the contact form. After a bounded number of
// clarification rounds with no confident match, it gracefully hands off to the DataTwin Team
// instead of asking forever.

export const SOMETHING_ELSE_ID = "something-else";
const MAX_ATTEMPTS = 3;

const LEAKAGE_GREETING =
  "Let's find out where your organisation may be losing money and what could be recovered.";
const GENERIC_GREETING = "Hi, I'm here to help you find what's recoverable.";
const FREE_TEXT_INVITE =
  "Tell me a little about what you're trying to recover, reconcile, or investigate, and I'll help narrow it down.";
const FALLBACK_TEXT =
  "Let's get you connected with the DataTwin Team so they can help pin down the right reconciliation and next steps.";

// A reply for every message that isn't a description of a problem yet, varied so a repeat "Hi" or
// a second vague answer doesn't get the exact same line back.
const GREETING_REPLIES = [
  "Hi — what are you looking into? I can help you spot potential leakage, unrecovered amounts or reconciliation differences.",
  "Hey — tell me a bit about what you're trying to recover or reconcile and I'll help narrow it down.",
];

const CAPABILITY_REPLIES = [
  "I can help you look for unrecovered amounts, reconciliation differences and areas where money may be leaking across your finance and GST processes. What are you looking into?",
];

const CLARIFY_PROMPTS = [
  "I'm focused on helping you find financial leakage and recovery opportunities — if something's not reconciling, or you think there's unrecovered value somewhere, describe it and I'll help narrow it down.",
  "Let's try a different angle — what kind of records or numbers aren't lining up for you?",
];

const SOMETHING_ELSE_PROMPTS = [
  "No problem — tell me a little more about what you're trying to reconcile or where you're seeing the difference.",
  "Sure — let's dig a bit deeper. What exactly are you noticing?",
];

const CANDIDATE_PROMPTS = [
  "Got it. Which of these is closest to what you're trying to check?",
  "Here's another possibility based on what you've described — does one of these fit?",
];

function pickRound<T>(items: readonly T[], round: number): T {
  return items[Math.min(round, items.length - 1)];
}

function makeMessage(turns: DiscoveryTurn[], text: string): DiscoveryTurn {
  return { kind: "message", id: `d${turns.length}`, text };
}

function makeOptions(turns: DiscoveryTurn[], prompt: string, candidates: readonly CatalogEntry[]): DiscoveryTurn {
  return {
    kind: "options",
    id: `d${turns.length}`,
    prompt,
    options: [
      ...candidates.map((c) => ({ id: c.id, label: c.name })),
      { id: SOMETHING_ELSE_ID, label: "Something else" },
    ],
    selectedId: null,
  };
}

function makeFreeText(turns: DiscoveryTurn[], prompt: string): DiscoveryTurn {
  return { kind: "freetext", id: `d${turns.length}`, prompt, value: null };
}

export interface DiscoveryOutcome {
  discovery: DiscoveryState;
  /** "resolved" -> caller moves to period-select; "fallback" -> caller moves to contact-form;
   * "continue" -> stay in discovery. */
  status: "continue" | "resolved" | "fallback";
}

/** Scores free text (from the hero message or any later discovery round) and decides what happens
 * next. `discovery` is the state *before* this submission is counted. */
function applyFreeText(discovery: DiscoveryState, text: string): DiscoveryOutcome {
  const turns = [...discovery.turns];
  const round = discovery.attempts; // rounds already completed before this one
  const attempts = discovery.attempts + 1;

  const askAgainOrFallback = (prompts: readonly string[]): DiscoveryOutcome => {
    if (attempts >= MAX_ATTEMPTS) {
      turns.push(makeMessage(turns, FALLBACK_TEXT));
      return { discovery: { ...discovery, turns, attempts }, status: "fallback" };
    }
    turns.push(makeFreeText(turns, pickRound(prompts, round)));
    return { discovery: { ...discovery, turns, attempts }, status: "continue" };
  };

  // A greeting or "what can you do" question isn't a failed match — it's a different kind of
  // message, and answering it directly (rather than reusing the reconciliation clarifying prompt)
  // is what keeps this from feeling like every input gets forced into the same category.
  const opener = classifyOpener(text);
  if (opener === "greeting") return askAgainOrFallback(GREETING_REPLIES);
  if (opener === "capability") return askAgainOrFallback(CAPABILITY_REPLIES);

  const result = resolveIntent(text, discovery.shownIds);

  if (result.confidence === "high" && result.top) {
    turns.push(makeMessage(turns, `Got it — that's ${result.top.name}. Let's get the details we need.`));
    return {
      discovery: {
        ...discovery,
        turns,
        attempts,
        resolvedId: result.top.id,
        shownIds: [...discovery.shownIds, result.top.id],
      },
      status: "resolved",
    };
  }

  if (result.confidence === "medium" && result.candidates.length > 0) {
    turns.push(makeOptions(turns, pickRound(CANDIDATE_PROMPTS, round), result.candidates));
    return {
      discovery: {
        ...discovery,
        turns,
        attempts,
        shownIds: [...discovery.shownIds, ...result.candidates.map((c) => c.id)],
      },
      status: "continue",
    };
  }

  // Nothing matched — could be a genuinely unrelated message or just too vague to place yet;
  // either way, ask rather than guess.
  return askAgainOrFallback(CLARIFY_PROMPTS);
}

/** Builds the opening turn(s) for a brand-new conversation, shaped by how the user entered. */
export function createInitialDiscovery(firstMessage: string | null, entryContext: EntryContext): DiscoveryOutcome {
  const empty: DiscoveryState = { turns: [], resolvedId: null, attempts: 0, shownIds: [] };

  if (firstMessage) {
    // No generic lead-in here — the very first reply already comes from resolving the message
    // itself (a specific match, a short list of candidates, or a natural clarifying question), so
    // there's nothing to say beforehand that wouldn't just be filler.
    return applyFreeText(empty, firstMessage);
  }

  const greeting = entryContext === "leakage" ? LEAKAGE_GREETING : GENERIC_GREETING;
  const turns = [makeMessage(empty.turns, greeting)];
  turns.push(makeFreeText(turns, FREE_TEXT_INVITE));
  return { discovery: { ...empty, turns }, status: "continue" };
}

/** The user picked one of the presented candidates, or "Something else". */
export function selectDiscoveryOption(discovery: DiscoveryState, turnId: string, optionId: string): DiscoveryOutcome {
  const turns = discovery.turns.map((turn) =>
    turn.id === turnId && turn.kind === "options" ? { ...turn, selectedId: optionId } : turn,
  );

  if (optionId !== SOMETHING_ELSE_ID) {
    turns.push(makeMessage(turns, "Got it — let's get the details we need."));
    return {
      discovery: { ...discovery, turns, resolvedId: optionId, shownIds: [...discovery.shownIds, optionId] },
      status: "resolved",
    };
  }

  const round = discovery.attempts;
  if (discovery.attempts >= MAX_ATTEMPTS) {
    turns.push(makeMessage(turns, FALLBACK_TEXT));
    return { discovery: { ...discovery, turns }, status: "fallback" };
  }
  turns.push(makeFreeText(turns, pickRound(SOMETHING_ELSE_PROMPTS, round)));
  return { discovery: { ...discovery, turns }, status: "continue" };
}

/** The user submitted free text for an existing "freetext" turn. */
export function submitDiscoveryFreeText(discovery: DiscoveryState, turnId: string, text: string): DiscoveryOutcome {
  const trimmed = text.trim();
  const turns = discovery.turns.map((turn) =>
    turn.id === turnId && turn.kind === "freetext" ? { ...turn, value: trimmed } : turn,
  );
  return applyFreeText({ ...discovery, turns }, trimmed);
}
