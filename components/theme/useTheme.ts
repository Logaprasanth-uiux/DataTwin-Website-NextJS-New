"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, isTheme, type Theme } from "@/lib/theme";

// The <html data-theme> attribute is the single source of truth; this hook only mirrors it into React
// (useSyncExternalStore), so components that need the theme in JS stay in step with the CSS that themes
// everything else. On the server, and on the first client render, the theme is the default; the value is
// corrected right after hydration, while the CSS (driven by the attribute) is already correct.

// Long enough for the colour fade in globals.css (.dt-theme-fade) to finish.
const FADE_MS = 500;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

let fadeTimer: number | undefined;

function readTheme(): Theme {
  const value = document.documentElement.getAttribute("data-theme");
  return isTheme(value) ? value : DEFAULT_THEME;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  // Another tab changed the theme: follow it.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY || !isTheme(event.newValue)) return;
    document.documentElement.setAttribute("data-theme", event.newValue);
    notify();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerTheme = (): Theme => DEFAULT_THEME;

function applyTheme(next: Theme) {
  const root = document.documentElement;

  // Fade colours across the whole page for the moment of the switch only. (The class is a no-op under
  // prefers-reduced-motion.)
  root.classList.add("dt-theme-fade");
  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => root.classList.remove("dt-theme-fade"), FADE_MS);

  root.setAttribute("data-theme", next);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage unavailable (private mode, blocked): the theme still applies for this visit.
  }
  notify();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerTheme);
  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  const toggleTheme = useCallback(() => applyTheme(readTheme() === "dark" ? "light" : "dark"), []);
  return { theme, setTheme, toggleTheme };
}
