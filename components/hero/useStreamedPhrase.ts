import { useEffect, useState } from "react";

const THINK_MS = 450;
const EXIT_MS = 380;
const BETWEEN_MS = 300;
const HOLD_BASE_MS = 2000;
const HOLD_PER_CHAR_MS = 12;
const HOLD_MAX_MS = 3000;

const CHAR_BASE_MS = 26;
const CHAR_JITTER = 0.35;
const SPACE_EXTRA_MS = 14;

const holdDelay = (phrase: string) => Math.min(HOLD_MAX_MS, HOLD_BASE_MS + phrase.length * HOLD_PER_CHAR_MS);

// Cumulative animation delay for every character: a steady base pace with slight,
// uneven variation (a touch slower at word breaks) so it reads as generated, not typed.
function toCharDelays(phrase: string): number[] {
  const delays: number[] = [];
  let elapsed = 0;
  for (const char of phrase) {
    delays.push(Math.round(elapsed));
    const jitter = 1 + (Math.random() * 2 - 1) * CHAR_JITTER;
    elapsed += CHAR_BASE_MS * jitter + (char === " " ? SPACE_EXTRA_MS : 0);
  }
  return delays;
}

// Reveals each phrase character by character (the fade itself is CSS, driven by the returned
// per-character delays), holds the complete phrase, then lets it settle away before the next
// begins. Stops immediately when `active` turns false and restarts from the first phrase when
// it turns true again.
export function useStreamedPhrase(phrases: readonly string[], active: boolean) {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);
  const [delays, setDelays] = useState<number[]>([]);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!active || phrases.length === 0) return;

    let cancelled = false;
    let timer: number | undefined;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    (async () => {
      let position = 0;
      await sleep(THINK_MS);
      while (!cancelled) {
        const phrase = phrases[position];
        const charDelays = toCharDelays(phrase);
        setIndex(position);
        setDelays(charDelays);
        setCurrent(phrase);
        setExiting(false);
        await sleep(charDelays[charDelays.length - 1] + holdDelay(phrase));
        if (cancelled) return;
        setExiting(true);
        await sleep(EXIT_MS);
        if (cancelled) return;
        setCurrent(null);
        setExiting(false);
        await sleep(BETWEEN_MS);
        position = (position + 1) % phrases.length;
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      setIndex(0);
      setCurrent(null);
      setDelays([]);
      setExiting(false);
    };
  }, [active, phrases]);

  return { phrase: active ? current : null, delays, index, exiting };
}
