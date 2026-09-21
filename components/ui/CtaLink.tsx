import type { ReactNode } from "react";

// The site's call-to-action link, in three treatments (all the same pill shape and arrow):
//
// - `dark` (the default): the in-content secondary CTA. Solid DataTwin navy (#1b2c46) with a white label
//   and arrow, the same in both themes (it is a fixed brand fill, not the theme's ink colour).
// - `outline`: the quiet hairline version: navy label, accent arrow, accent border on hover. It reads its
//   colours from the theme's ink tokens, so it also works on a dark canvas (e.g. "Email us instead").
// - `solid`: the one action on a page that leads (the final call to action). Navy in the Light Theme; on a
//   dark-theme canvas it becomes the accent orange with navy text.
const VARIANT_CLASSES = {
  dark: "h-11 border-canvas bg-canvas px-5 text-white hover:bg-canvas/90 focus-visible:bg-canvas/90 on-dark:border-white/30",
  outline:
    "h-11 border-navy-hairline px-5 text-navy hover:border-accent focus-visible:border-accent",
  solid:
    "h-12 border-navy bg-navy px-7 text-white hover:bg-navy/90 focus-visible:bg-navy/90 on-dark:border-accent on-dark:bg-accent on-dark:text-canvas on-dark:hover:bg-accent/90 on-dark:focus-visible:bg-accent/90",
} as const;

const ARROW_CLASSES = {
  dark: "text-white",
  outline: "text-accent",
  solid: "text-accent on-dark:text-canvas",
} as const;

export function CtaLink({
  href,
  children,
  className = "",
  variant = "dark",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof VARIANT_CLASSES;
}) {
  return (
    <a
      href={href}
      className={`dt-button group inline-flex items-center gap-2.5 rounded-full border text-[14px] transition-colors ${VARIANT_CLASSES[variant]} ${className}`.trim()}
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className={`h-3.5 w-3.5 flex-shrink-0 ${ARROW_CLASSES[variant]}`}
        aria-hidden="true"
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
