import Image from "next/image";

// The Veroxle | A DataTwin Product lockup in both colourways, stacked. Which one shows is decided by CSS (globals.css,
// "Theme"): the inverted mark on a dark canvas, the standard mark everywhere else, cross-faded.
export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className="dt-logo">
      <Image
        src="/logo/veroxle-logo.svg"
        alt="Veroxle | A DataTwin Product"
        width={250}
        height={28}
        priority={priority}
        className={`dt-logo-base ${className}`.trim()}
      />
      <Image
        src="/logo/veroxle-logo-inv.svg"
        alt=""
        width={250}
        height={28}
        priority={priority}
        aria-hidden="true"
        className={`dt-logo-inv ${className}`.trim()}
      />
    </span>
  );
}
