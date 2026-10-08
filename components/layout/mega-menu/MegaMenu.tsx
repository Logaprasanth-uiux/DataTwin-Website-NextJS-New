"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatLaunch } from "@/components/chat/useChatLaunch";
import { LearningPanel, PlatformPanel, ProductsPanel } from "./MegaPanels";
import { MENU_TRIGGERS, type MenuKey } from "./menu-data";
import { ChevronIcon } from "./menu-icons";

const PANELS = { platform: PlatformPanel, products: ProductsPanel, learning: LearningPanel } as const;
const HOVER_INTENT_MS = 110;
const PANEL_ID = "dt-mega-panel";

// Estimate CTAs inside the menus open the same fresh chat flow as the site's other recovery CTAs.
export function useEstimateLaunch() {
  return useChatLaunch("recovery-cta").onClick;
}

// Desktop mega menu: the three triggers plus the one shared panel that hangs beneath the header. Opens on
// hover (with a short intent delay) or click; Esc / outside click / leaving the header close it. The
// page dimming behind it is <MegaScrim />, rendered by the Navbar outside the header (the header's
// backdrop-filter would otherwise trap a fixed-position scrim).
export function MegaMenu({
  openMenu,
  setOpenMenu,
}: {
  openMenu: MenuKey | null;
  setOpenMenu: (key: MenuKey | null) => void;
}) {
  const onEstimate = useEstimateLaunch();
  const timer = useRef<number | null>(null);
  const triggerRefs = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});

  const clearTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };
  const close = useCallback(() => setOpenMenu(null), [setOpenMenu]);

  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      triggerRefs.current[openMenu]?.focus();
      close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu, close]);

  const Panel = openMenu ? PANELS[openMenu] : null;

  return (
    <>
      {MENU_TRIGGERS.map(({ key, label }) => {
        const active = openMenu === key;
        return (
          <button
            key={key}
            ref={(el) => {
              triggerRefs.current[key] = el;
            }}
            type="button"
            aria-expanded={active}
            aria-controls={active ? PANEL_ID : undefined}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              clearTimer();
              if (openMenu) setOpenMenu(key);
              else timer.current = window.setTimeout(() => setOpenMenu(key), HOVER_INTENT_MS);
            }}
            onPointerLeave={clearTimer}
            onClick={() => setOpenMenu(active ? null : key)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowDown") return;
              e.preventDefault();
              setOpenMenu(key);
              requestAnimationFrame(() =>
                document.querySelector<HTMLElement>(`#${PANEL_ID} a, #${PANEL_ID} button`)?.focus(),
              );
            }}
            className={`dt-nav-link relative inline-flex items-center gap-1 transition-colors hover:text-navy ${
              active ? "!text-navy" : ""
            }`}
          >
            {label}
            <ChevronIcon
              className={`h-3.5 w-3.5 transition-transform duration-200 ${active ? "rotate-180 text-accent" : ""}`}
            />
            <span
              aria-hidden="true"
              className={`absolute -bottom-2 left-0 right-0 h-px origin-left bg-accent transition-transform duration-300 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}

      {Panel && openMenu && (
        <div className="pointer-events-none absolute inset-x-0 top-full px-[var(--dt-inset)] pt-2">
          {/* Full-width bridge across the gap between the header and the panel, so the pointer never leaves
              the header's hit area on the way down, whichever trigger it came from. */}
          <span aria-hidden="true" className="pointer-events-auto absolute inset-x-0 top-0 h-3" />
          <div className="dt-container">
            <div
              id={PANEL_ID}
              role="region"
              aria-label={MENU_TRIGGERS.find((t) => t.key === openMenu)?.label}
              className="dt-mega dt-mega-panel pointer-events-auto relative max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[28px] border border-navy-hairline p-6 lg:p-8"
            >
              <span aria-hidden="true" className="absolute inset-x-0 -top-3 h-3" />
              <div key={openMenu}>
                <Panel onNavigate={close} onEstimate={onEstimate} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function MegaScrim({ onClose }: { onClose: () => void }) {
  return <div aria-hidden="true" onClick={onClose} className="dt-mega-scrim fixed inset-0 z-40 hidden lg:block" />;
}
