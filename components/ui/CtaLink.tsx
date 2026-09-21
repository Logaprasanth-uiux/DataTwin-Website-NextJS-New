import type { ReactNode } from "react";

// Outlined, understated CTA in the same language as the header loss control:
// hairline navy border, navy label, accent arrow, accent border on hover.
//
// `variant="solid"` is the same shape and arrow in DataTwin navy, for the one action on a page that
// needs to lead (the final call to action). Default output is unchanged.
const VARIANT_CLASSES = {
  outline:
    "h-11 border-navy-hairline px-5 text-navy hover:border-accent focus-visible:border-accent",
  solid: "h-12 border-navy bg-navy px-7 text-white hover:bg-navy/90 focus-visible:bg-navy/90",
} as const;

export function CtaLink({
  href,
  children,
  className = "",
  variant = "outline",
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
        className="h-3.5 w-3.5 flex-shrink-0 text-accent"
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
