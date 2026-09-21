"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Container } from "./Container";
import { LossIndicator } from "./LossIndicator";
import { Logo } from "./Logo";

const SCROLL_THRESHOLD = 8;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getScrolled = () => window.scrollY > SCROLL_THRESHOLD;
const getScrolledOnServer = () => false;

// True while the Hero is still behind the header. In the Dark Theme the header is dark for exactly that
// long (so it reads as part of the Hero) and turns to the standard frosted white once the Hero has gone.
// Pages without a #hero are never "over the hero". The server renders the top-of-page state.
const getOverHero = () => {
  const hero = document.getElementById("hero");
  if (!hero) return false;
  const headerHeight = document.querySelector<HTMLElement>(".dt-header")?.offsetHeight ?? 0;
  return hero.getBoundingClientRect().bottom > headerHeight;
};
const getOverHeroOnServer = () => true;

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Products", href: "#products" },
  { label: "Learning Center", href: "#learning-center" },
  { label: "Customers", href: "#customers" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getScrolledOnServer);
  const overHero = useSyncExternalStore(subscribeToScroll, getOverHero, getOverHeroOnServer);

  return (
    <header
      data-over-hero={overHero}
      className={`dt-header sticky top-0 z-50 w-full bg-white/85 backdrop-blur-[16px] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:content-[''] after:transition-colors after:duration-300 ${
        scrolled ? "after:bg-[rgba(27,44,70,0.03)]" : "after:bg-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center" aria-label="DataTwin home">
          <Logo priority className="h-6 w-auto sm:h-7" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="dt-nav-link transition-colors hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-6">
          <LossIndicator />

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <MenuGlyph open={open} />
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-navy-hairline lg:hidden">
          <Container className="flex flex-col gap-1 px-6 py-4 sm:px-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="dt-nav-link py-2 transition-colors hover:text-navy"
              >
                {link.label}
              </a>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-navy transition-colors" aria-hidden="true">
      {open ? (
        <path
          d="M5 5l10 10M15 5L5 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 6h14M3 10h14M3 14h14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
