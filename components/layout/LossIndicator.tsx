"use client";

import { useChatLaunch } from "@/components/chat/useChatLaunch";

// A persistent CTA button: "Stop the leakage" with an arrow, opening the chat. It used to carry a ticking
// illustrative loss figure; that is gone, so it is now just the button.
// `variant="menu"` is the phone version: the header no longer carries it below `lg`, so the mobile menu
// shows it as a full-width card at the top of the sheet.
export function LossIndicator({
  variant = "header",
  onNavigate,
}: {
  variant?: "header" | "menu";
  onNavigate?: () => void;
}) {
  const { onClick } = useChatLaunch("leakage");

  const handleClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    onNavigate?.();
    onClick();
  };

  if (variant === "menu") {
    return (
      <a
        href="#contact"
        onClick={handleClick}
        className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-navy-hairline bg-accent/[0.05] px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="text-[14px] leading-none font-semibold text-navy">Stop the leakage</span>
        <ArrowIcon className="h-4 w-4 flex-shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className="group hidden h-9 flex-shrink-0 items-center gap-2 rounded-full border border-navy-hairline px-4 text-[13px] leading-none font-semibold whitespace-nowrap text-navy transition-colors duration-200 hover:border-accent hover:bg-accent/[0.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:flex"
    >
      Stop the leakage
      <ArrowIcon className="h-3.5 w-3.5 flex-shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
