// The Chat Flow playground keeps an in-progress edit ("draft") as a JSON string, mirrored to localStorage and
// exposed as an external store so React can read it with useSyncExternalStore (null on the server and on first
// paint, so the committed flow always renders first and there is no hydration mismatch).
const KEY = "dt-playground-chatflow-draft";
const listeners = new Set<() => void>();
// undefined = not read from storage yet. Kept in memory so edits still work if storage is blocked.
let memory: string | null | undefined;

function notify() {
  listeners.forEach((l) => l());
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== KEY) return;
  memory = undefined;
  notify();
}

export function subscribeDraft(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getDraftSnapshot(): string | null {
  if (memory === undefined) {
    try {
      memory = window.localStorage.getItem(KEY);
    } catch {
      memory = null;
    }
  }
  return memory;
}

export function getDraftServerSnapshot(): string | null {
  return null;
}

export function setDraft(value: string | null): void {
  memory = value;
  try {
    if (value === null) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: the draft lives in memory for this session only.
  }
  notify();
}
