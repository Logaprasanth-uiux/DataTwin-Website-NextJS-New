"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Wraps the whole network so its one shared animation clock (see solutions.css) only runs while
// the network is on screen. It sets `data-sv` straight on the DOM node: "play" while visible,
// "paused" when scrolled away. With reduced motion, or without IntersectionObserver, it never
// sets it, so every illustration stays in its complete static state.
export function ViewGate({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.dataset.sv = "paused";
    const observer = new IntersectionObserver(
      ([entry]) => {
        node.dataset.sv = entry.isIntersecting ? "play" : "paused";
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
