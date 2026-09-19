// Below `xl` the callout stacks above the prompt with a short downward arrow.
// At `xl` and up it sits to the right of the prompt with a short arrow leading
// back into it; that needs ~260px of clear space right of the prompt, which
// narrower canvases lack.
export function HeroValueCallout({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex flex-col items-center text-center xl:absolute xl:top-[-18px] xl:left-[calc(100%+84px)] xl:w-[170px] xl:items-start xl:text-left ${className}`.trim()}
    >
      <div className="dt-fade-up">
        <p className="dt-display text-3xl leading-none font-semibold tracking-[-0.02em] text-accent sm:text-4xl xl:text-[44px]">
          2 min
        </p>
        <p className="mt-2 max-w-[15rem] text-[13.5px] leading-snug text-balance text-navy-muted">
          That&apos;s how fast you get a recoverable number.
        </p>
      </div>

      <svg
        viewBox="0 0 20 36"
        fill="none"
        className="mt-1 h-9 w-5 text-accent xl:hidden"
        aria-hidden="true"
      >
        <path
          className="dt-draw"
          pathLength={1}
          d="M10 3C8.5 12 9 22 11 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="dt-arrowhead"
          d="M13.2 22.3L11 30L5.4 24.3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg
        viewBox="0 0 96 48"
        fill="none"
        className="absolute top-[18px] right-[calc(100%+6px)] hidden h-9 w-[72px] -scale-x-100 text-accent xl:block"
        aria-hidden="true"
      >
        <path
          className="dt-draw"
          pathLength={1}
          d="M4 6C30 0 66 8 84 36"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="dt-arrowhead"
          d="M83.2 26.1L84 36L75.3 31.1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
