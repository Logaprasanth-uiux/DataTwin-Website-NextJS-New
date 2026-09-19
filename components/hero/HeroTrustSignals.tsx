import type { ReactNode } from "react";

const SIGNALS: { text: string; icon: ReactNode }[] = [
  {
    text: "Read-only. No process change.",
    icon: (
      <>
        <path d="M1.5 8s2.3-4.5 6.5-4.5S14.5 8 14.5 8s-2.3 4.5-6.5 4.5S1.5 8 1.5 8z" />
        <circle cx="8" cy="8" r="1.8" />
      </>
    ),
  },
  {
    text: "Runs above SAP, NetSuite and Tally — no migration.",
    icon: <path d="M8 2 2 5l6 3 6-3-6-3zM2 8l6 3 6-3M2 11l6 3 6-3" />,
  },
  {
    text: "ISO 27001 certified · SOC 2 attested.",
    icon: <path d="M8 1.8 3 3.6v4c0 3 2.1 5 5 6.2 2.9-1.2 5-3.2 5-6.2v-4L8 1.8zM5.8 8l1.6 1.6 3-3" />,
  },
];

export function HeroTrustSignals({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-2.5 ${className}`.trim()}
    >
      {SIGNALS.map(({ text, icon }) => (
        <li
          key={text}
          className="flex max-w-xs items-start gap-2 text-[12.5px] leading-snug font-medium text-navy-muted sm:max-w-none sm:items-center"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-px h-3.5 w-3.5 flex-shrink-0 text-navy-faint sm:mt-0"
            aria-hidden="true"
          >
            {icon}
          </svg>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
