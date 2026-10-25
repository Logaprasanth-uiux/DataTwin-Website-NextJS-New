"use client";

import { useEffect, useRef } from "react";

// A form that opens in the middle of the optional-documents grid (SAP connect, GST Portal fetch) can
// land below the fold, because the chat holds its scroll position while that grid is on screen
// (see ChatPageClient). This brings it into view once, when it appears.
export function useScrollIntoViewOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const id = window.setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
    return () => window.clearTimeout(id);
  }, []);
  return ref;
}
