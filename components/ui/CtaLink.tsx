import type { ReactNode } from "react";

// Outlined, understated CTA in the same language as the header loss control:
// hairline navy border, navy label, accent arrow, accent border on hover.
export function CtaLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`dt-button group inline-flex h-11 items-center gap-2.5 rounded-full border border-navy-hairline px-5 text-[14px] text-navy transition-colors hover:border-accent focus-visible:border-accent ${className}`.trim()}
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
