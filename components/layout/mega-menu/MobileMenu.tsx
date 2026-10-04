"use client";

import { useState } from "react";
import { useEstimateLaunch } from "./MegaMenu";
import { LearningPanel, PlatformPanel, ProductsPanel } from "./MegaPanels";
import { MENU_TRIGGERS, type MenuKey } from "./menu-data";
import { ChevronIcon } from "./menu-icons";

const PANELS = { platform: PlatformPanel, products: ProductsPanel, learning: LearningPanel } as const;

// Below `lg`: the same three menus as an accordion sheet on the light surface, plus the plain links.
export function MobileMenu({
  links,
  onClose,
}: {
  links: readonly { label: string; href: string }[];
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<MenuKey | null>(null);
  const onEstimate = useEstimateLaunch();

  return (
    <nav className="dt-mega max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-navy-hairline lg:hidden">
      <div className="mx-auto flex max-w-[1200px] flex-col px-6 py-2 sm:px-8">
        {MENU_TRIGGERS.map(({ key, label }) => {
          const isOpen = expanded === key;
          const Panel = PANELS[key];
          return (
            <div key={key} className="border-b border-navy-divider">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : key)}
                className="flex w-full items-center justify-between py-3.5 text-[15px] font-semibold text-navy"
              >
                {label}
                <ChevronIcon
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : "text-navy-muted"}`}
                />
              </button>
              {isOpen && (
                <div className="pb-5">
                  <Panel onNavigate={onClose} onEstimate={onEstimate} />
                </div>
              )}
            </div>
          );
        })}
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="border-b border-navy-divider py-3.5 text-[15px] font-semibold text-navy last:border-b-0"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
