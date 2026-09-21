import type { SocialPlatform } from "./footer-data";

// Small line icons for the footer, in the same language as the rest of the site: thin strokes in
// currentColor, no fills. The social icons are drawn in a 24-unit box and shown at 20px, so a 1.5 stroke
// lands at about 1.25px: the weight of the Hero's trust icons.

const SOCIAL_PATHS: Record<SocialPlatform, React.ReactNode> = {
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M8 10.5V16M8 7.6h.01M12 16v-5.5M12 13a2.4 2.4 0 0 1 4.8 0V16" />
    </>
  ),
  x: (
    <>
      <path d="M4 4h4.2L20 20h-4.2L4 4z" />
      <path d="M19.5 4l-6.3 6.9M4.5 20l6.3-6.9" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.2 9.5v5l4.3-2.5-4.3-2.5z" />
    </>
  ),
};

export function SocialIcon({ platform }: { platform: SocialPlatform }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {SOCIAL_PATHS[platform]}
    </svg>
  );
}

// A small shield with a check, to give the trust line a quiet visual anchor. It is the same path the
// Hero's trust signals use, and is a plain line icon: not a badge, seal or certification mark.
export function TrustShieldIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 flex-shrink-0 text-navy-faint"
      aria-hidden="true"
    >
      <path d="M8 1.8 3 3.6v4c0 3 2.1 5 5 6.2 2.9-1.2 5-3.2 5-6.2v-4L8 1.8zM5.8 8l1.6 1.6 3-3" />
    </svg>
  );
}
