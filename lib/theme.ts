// Site-wide visual theme. Dark is the default on first visit; Light is the original approved design and
// stays one click away (a saved choice wins over the default).
//
// The active theme is one attribute on <html>: `data-theme="light" | "dark"`. Everything else is CSS
// (see the "Theme" block in app/globals.css), so switching never re-renders the page or touches layout.
// The choice is persisted in localStorage and applied by an inline script before first paint, so a
// refresh never flashes the wrong theme.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dt-theme";
export const DEFAULT_THEME: Theme = "dark";

export const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

// Runs synchronously in <head>, before the first paint.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
