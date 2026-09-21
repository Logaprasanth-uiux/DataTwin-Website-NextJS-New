"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { Container } from "@/components/layout/Container";

// A quiet "where am I" label for long sections. Once the section's own heading has fully scrolled out of
// the top of the viewport it appears just below the sticky header, and it stays while the reader is still
// inside the section, then fades away before the section ends.
//
// Enable it only on sections long enough for the heading to leave the screen while the reader is still
// well inside them. Render it as the FIRST direct child of the section and pass the section's heading id:
//
//   <Section id="solutions" contained={false}>
//     <LongSectionContextLabel label="Solutions & use cases" headingId="solutions-title" />
//     <Container>… <h2 id="solutions-title">…</h2> …</Container>
//   </Section>
//
// It works in both plain and `contained` (rounded card) sections. In a card, the strip spans the card.
//
// The marker is the same DataTwin amber with navy text in every section and both themes (see
// `.dt-context-marker` in globals.css): it is as wide as its text and fades out to the right.
//
// It takes no space in the layout (the sticky wrapper is zero-height and the marker is drawn inside it) and
// is decorative, since the heading already names the section, so it is hidden from assistive technology.

// Header height (h-20 in Navbar). The label sticks directly beneath it.
const HEADER_OFFSET = 80;
// The label hides once the section's bottom edge is this close to it, so it fades out before the section
// finishes rather than sliding away with it.
const END_OFFSET = 56;

export function LongSectionContextLabel({ label, headingId }: { label: string; headingId: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const store = useMemo(
    () => ({
      subscribe(onChange: () => void) {
        window.addEventListener("scroll", onChange, { passive: true });
        window.addEventListener("resize", onChange);
        return () => {
          window.removeEventListener("scroll", onChange);
          window.removeEventListener("resize", onChange);
        };
      },
      getSnapshot() {
        const heading = document.getElementById(headingId);
        const section = wrapperRef.current?.closest("section");
        if (!heading || !section) return false;
        const headingGone = heading.getBoundingClientRect().bottom <= 0;
        const stillInside = section.getBoundingClientRect().bottom > HEADER_OFFSET + END_OFFSET;
        return headingGone && stillInside;
      },
    }),
    [headingId],
  );

  const visible = useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none sticky z-30 h-0"
      style={{ top: HEADER_OFFSET }}
    >
      <div
        className={`absolute inset-x-0 top-0 overflow-hidden transition-[opacity,transform] duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        <Container className="px-6 sm:px-8 lg:px-10">
          <p className="dt-context-marker">{label}</p>
        </Container>
      </div>
    </div>
  );
}
