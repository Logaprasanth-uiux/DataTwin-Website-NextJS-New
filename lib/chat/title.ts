// Simple client-side conversation title generation from the user's first message — no AI call,
// just a heuristic (strip a leading filler phrase, trim, cap length), similar in spirit to how
// ChatGPT derives a short title from the first message.

const LEADING_FILLERS = [
  /^i (?:have|'ve got) an? issue with /i,
  /^i(?:'m| am) having (?:an? )?(?:issue|trouble|problem)s? with /i,
  /^i(?:'m| am) facing (?:an? )?(?:issue|problem)s? with /i,
  /^we(?:'re| are) unable to /i,
  /^we (?:can't|cannot) /i,
  /^i (?:can't|cannot) /i,
  /^there(?:'s| is) an? (?:issue|problem) with /i,
  /^we(?:'ve| have) got an? issue with /i,
  /^we(?:'re| are) having (?:an? )?(?:issue|trouble|problem)s? with /i,
];

const NOUN_ENDING = /\b(issue|problem|mismatch|gap|reconciliation|difference)s?$/i;

const MAX_TITLE_LENGTH = 48;

// The placeholder title a conversation starts with until there's something real to call it —
// used elsewhere (engine.ts) to know whether a title still needs deriving from an identified
// topic, so it's exported rather than duplicated as a string literal.
export const PLACEHOLDER_TITLE = "New conversation";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function generateConversationTitle(firstMessage: string | null | undefined): string {
  const trimmed = firstMessage?.trim();
  if (!trimmed) return PLACEHOLDER_TITLE;

  let text = trimmed.replace(/[.?!]+$/, "");
  for (const pattern of LEADING_FILLERS) {
    if (pattern.test(text)) {
      text = text.replace(pattern, "");
      break;
    }
  }

  text = text.trim();
  if (!text) return PLACEHOLDER_TITLE;

  const words = text.split(/\s+/);
  if (words.length > 8) {
    text = words.slice(0, 8).join(" ");
  }

  if (!NOUN_ENDING.test(text)) {
    text = `${text} issue`;
  }

  text = capitalize(text);
  if (text.length > MAX_TITLE_LENGTH) {
    text = `${text.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`;
  }

  return text;
}
