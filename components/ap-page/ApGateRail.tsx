"use client";

import { useEffect, useState } from "react";

// The sticky list of the five gates. It follows the reader: the gate nearest the middle of the screen is
// marked, and any gate can be jumped to. Hidden below `lg`, where the gates simply stack and carry their own
// numbers.
export function ApGateRail({ gates }: { gates: readonly { id: string; n: string; label: string }[] }) {
  const [active, setActive] = useState(gates[0]?.id ?? "");

  useEffect(() => {
    // The current gate is the last one whose top has passed a line 40% of the way down the screen.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = gates[0]?.id ?? "";
      for (const g of gates) {
        const el = document.getElementById(g.id);
        if (el && el.getBoundingClientRect().top <= line) current = g.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [gates]);

  return (
    <nav aria-label="The five gates" className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
      <ol className="relative space-y-1">
        <span aria-hidden="true" className="absolute top-5 bottom-5 left-[19px] w-px bg-navy-hairline" />
        {gates.map((g) => {
          const on = g.id === active;
          return (
            <li key={g.id}>
              <a
                href={`#${g.id}`}
                aria-current={on ? "step" : undefined}
                className={`relative flex items-center gap-4 rounded-full py-2 pr-4 transition-colors ${on ? "text-navy" : "text-navy-muted hover:text-navy"}`}
              >
                <span
                  className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold transition-colors ${
                    on ? "border-navy bg-navy text-accent" : "border-navy-hairline bg-white"
                  }`}
                >
                  {g.n}
                </span>
                <span className={`dt-display text-[1.0625rem] font-semibold ${on ? "" : "font-medium"}`}>{g.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
