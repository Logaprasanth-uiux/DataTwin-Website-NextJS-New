import Image from "next/image";

// The DataTwin wordmark in both colourways, stacked. Which one shows is decided by CSS (globals.css,
// "Theme"): the inverted mark on a dark canvas, the standard mark everywhere else, cross-faded.
export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className="dt-logo">
      <Image
        src="/logo/datatwin-logo.svg"
        alt="DataTwin"
        width={140}
        height={26}
        priority={priority}
        className={`dt-logo-base ${className}`.trim()}
      />
      <Image
        src="/logo/datatwin-logo-inv.svg"
        alt=""
        width={140}
        height={26}
        priority={priority}
        aria-hidden="true"
        className={`dt-logo-inv ${className}`.trim()}
      />
    </span>
  );
}
