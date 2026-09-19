"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Keeps its illustration gently looping while it is on screen. It sets `data-anim` straight on
// the DOM node: "ready" = starting pose, "play" = looping, "paused" = frozen while scrolled
// out of view. With reduced motion it never sets it, so the illustration stays in its final
// static state.
export function InViewPlay({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.dataset.anim = "ready";
    const observer = new IntersectionObserver(
      ([entry]) => {
        node.dataset.anim = entry.intersectionRatio >= 0.5 ? "play" : "paused";
      },
      { threshold: [0.5] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className} style={style}>
      {children}
    </span>
  );
}
