import type { ReactNode } from "react";

// "canvas" is the themable surface: the warm gradient in the Light Theme, the DataTwin navy in the Dark
// Theme (Hero, closing CTA + footer). "cream-gradient" is the fixed warm gradient in both themes.
type SectionBackground = "white" | "cream-gradient" | "canvas" | "navy";

const BACKGROUND_CLASSES: Record<SectionBackground, string> = {
  white: "bg-background",
  "cream-gradient": "dt-hero-gradient",
  canvas: "dt-canvas",
  navy: "bg-navy",
};

export function Section({
  id,
  background = "white",
  contained = true,
  className = "",
  children,
}: {
  id?: string;
  background?: SectionBackground;
  contained?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const backgroundClass = BACKGROUND_CLASSES[background];

  if (!contained) {
    return (
      <section id={id} className={`w-full ${backgroundClass} ${className}`.trim()}>
        {children}
      </section>
    );
  }

  return (
    <section id={id} className="w-full px-3 sm:px-5 lg:px-8">
      <div
        className={`dt-section-clip rounded-section ${backgroundClass} ${className}`.trim()}
      >
        {children}
      </div>
    </section>
  );
}
