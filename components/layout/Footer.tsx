import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { SocialIcon, TrustShieldIcon } from "./footer-icons";
import { Section } from "./Section";
import {
  BRAND_STATEMENT,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  COPYRIGHT,
  FOOTER_GROUPS,
  LEGAL_LINKS,
  LOCATION,
  SOCIAL_LINKS,
  TRUST_LINE,
} from "./footer-data";

// The site-wide footer. Render it once, at the end of any page: `<Footer />`.
//
// It owns its whole closing canvas: the Hero's warm gradient, in the same rounded container the other
// contained sections use, and inside it the navigation, brand statement, trust line and legal row, on
// the same Container and gutters as the header. A page may pass `children` to put its own closing call
// to action at the top of that same canvas: the gradient then runs unbroken from the CTA through to the
// bottom of the page, and a hairline (not a change of background) marks where the footer proper begins.
// Everything the footer says lives in footer-data.ts, including the social accounts (icon slots until
// their URLs are supplied).

const LINK =
  "text-[15px] leading-snug text-navy-body transition-colors hover:text-navy focus-visible:text-navy";
const SMALL = "text-[12.5px] font-medium text-navy-muted";

export function Footer({ children }: { children?: ReactNode }) {
  return (
    <footer className="pb-3 sm:pb-5 lg:pb-8">
      <Section background="cream-gradient" className="pt-20 pb-10 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-14">
        <Container className="px-6 sm:px-8 lg:px-10">
          {children}

          <div
            className={
              children
                ? "mt-20 border-t border-navy-hairline pt-14 sm:mt-24 lg:mt-28 lg:pt-20"
                : ""
            }
          >
            <nav
              aria-label="Footer"
              className="grid gap-12 md:grid-cols-3 md:gap-x-6 lg:gap-x-16"
            >
              {FOOTER_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="dt-eyebrow">{group.title}</p>
                  <ul className="mt-6 space-y-3.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} className={LINK}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="mt-16 flex flex-col gap-8 border-t border-navy-divider pt-12 lg:mt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <div className="max-w-2xl">
                <Link href="/" aria-label="DataTwin home" className="inline-flex">
                  <Image
                    src="/logo/datatwin-logo.svg"
                    alt="DataTwin"
                    width={140}
                    height={26}
                    className="h-6 w-auto sm:h-7"
                  />
                </Link>
                <p className="mt-6 text-[15px] leading-[1.7] text-navy-body">{BRAND_STATEMENT}</p>
                <ul aria-label="DataTwin on social media" className="mt-6 flex items-center gap-5">
                  {SOCIAL_LINKS.map((social) => (
                    <li key={social.platform}>
                      {social.href ? (
                        <a
                          href={social.href}
                          aria-label={`DataTwin on ${social.label}`}
                          className="inline-flex text-navy-muted transition-colors hover:text-accent focus-visible:text-accent"
                        >
                          <SocialIcon platform={social.platform} />
                        </a>
                      ) : (
                        // No account URL yet: a visual slot only, not a link.
                        <span className="inline-flex text-navy-muted">
                          <SocialIcon platform={social.platform} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <p className={`${SMALL} flex items-center gap-2 lg:justify-end lg:text-right`}>
                <TrustShieldIcon />
                <span>{TRUST_LINE}</span>
              </p>
            </div>

            <div
              className={`mt-12 flex flex-col gap-3 border-t border-navy-divider pt-8 sm:flex-row sm:items-center sm:justify-between ${SMALL}`}
            >
              <p>{COPYRIGHT}</p>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <a
                  href={CONTACT_MAILTO}
                  className="transition-colors hover:text-navy focus-visible:text-navy"
                >
                  {CONTACT_EMAIL}
                </a>
                <span aria-hidden="true">·</span>
                <span>{LOCATION}</span>
                {LEGAL_LINKS.map((link) => (
                  <span key={link.label} className="flex items-center gap-x-2">
                    <span aria-hidden="true">·</span>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-navy focus-visible:text-navy"
                    >
                      {link.label}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </footer>
  );
}
