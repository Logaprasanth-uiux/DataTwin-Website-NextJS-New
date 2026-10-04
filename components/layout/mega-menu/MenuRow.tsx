import type { CSSProperties } from "react";
import type { MenuItem } from "./menu-data";
import { ArrowIcon, MenuIcon } from "./menu-icons";

type Handlers = { onNavigate: () => void; onEstimate: () => void };

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-accent/25 px-2 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-navy">
      {children}
    </span>
  );
}

// One selectable entry of the mega menu (desktop panel and mobile sheet). Renders a link, or a button for
// the estimate action; children (e.g. Channel Rebates' two sides) hang beneath it on a connector line.
export function MenuRow({
  item,
  onNavigate,
  onEstimate,
  compact = false,
}: { item: MenuItem; compact?: boolean } & Handlers) {
  const inner = (
    <>
      <span
        className={`flex flex-shrink-0 items-center justify-center rounded-full border border-navy-hairline text-navy transition-colors group-hover:border-accent group-hover:bg-cream-100 group-focus-visible:border-accent ${
          compact ? "h-8 w-8" : "h-9 w-9"
        }`}
      >
        <MenuIcon name={item.icon} className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14.5px] font-semibold leading-tight text-navy">
          {item.title}
          {item.badge && <Badge>{item.badge}</Badge>}
        </span>
        <span className="mt-1 block text-[13px] leading-snug text-navy-muted">{item.desc}</span>
      </span>
      <ArrowIcon className="mt-1 h-3.5 w-3.5 flex-shrink-0 -translate-x-1 text-accent opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
    </>
  );
  const cls =
    "group flex w-full items-start gap-3 rounded-[14px] p-2.5 text-left transition-colors hover:bg-navy/[0.04] focus-visible:bg-navy/[0.04] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent";

  return (
    <li>
      {item.action === "estimate" ? (
        <button
          type="button"
          onClick={() => {
            onNavigate();
            onEstimate();
          }}
          className={cls}
        >
          {inner}
        </button>
      ) : (
        <a href={item.href} onClick={onNavigate} className={cls}>
          {inner}
        </a>
      )}
      {item.children && (
        <ul className="ml-[27px] border-l border-navy-hairline pl-2">
          {item.children.map((child) => (
            <MenuRow key={child.title} item={child} compact onNavigate={onNavigate} onEstimate={onEstimate} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function MenuGroupList({
  label,
  items,
  index = 0,
  ...handlers
}: { label: string; items: readonly MenuItem[]; index?: number } & Handlers) {
  return (
    <div className="dt-mega-item min-w-0" style={{ "--i": index } as CSSProperties}>
      <p className="dt-eyebrow dt-eyebrow-accent mb-2 px-2.5">{label}</p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <MenuRow key={item.title} item={item} {...handlers} />
        ))}
      </ul>
    </div>
  );
}
