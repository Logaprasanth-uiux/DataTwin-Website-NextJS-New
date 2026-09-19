import type { ReactNode } from "react";

type SectionBackground = "white" | "cream-gradient";

const BACKGROUND_CLASSES: Record<SectionBackground, string> = {
  white: "bg-background",
  "cream-gradient": "dt-hero-gradient",
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
        className={`overflow-hidden rounded-section ${backgroundClass} ${className}`.trim()}
      >
        {children}
      </div>
    </section>
  );
}
