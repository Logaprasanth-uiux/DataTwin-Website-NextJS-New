import type { RefObject } from "react";

export function HeroPromptSuggestions({
  items,
  open,
  onSelect,
  onExpanded,
  listRef,
}: {
  items: readonly string[];
  open: boolean;
  onSelect: (item: string) => void;
  onExpanded?: () => void;
  listRef?: RefObject<HTMLUListElement | null>;
}) {
  return (
    <div
      inert={!open}
      aria-hidden={!open}
      onTransitionEnd={(event) => {
        if (open && event.target === event.currentTarget && event.propertyName === "grid-template-rows") {
          onExpanded?.();
        }
      }}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <p className="px-4 pt-6 text-[11px] font-medium tracking-[0.14em] text-navy-muted uppercase">
          Try an example
        </p>
        <ul ref={listRef} className="mt-2.5">
          {items.map((item) => (
            <li key={item} className="border-t border-navy-hairline last:border-b">
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(item)}
                className="group flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-[14px] text-navy-body transition-colors hover:text-navy focus-visible:text-navy"
              >
                <span>{item}</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="hidden h-3.5 w-3.5 flex-shrink-0 text-accent opacity-0 sm:block transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
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
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
