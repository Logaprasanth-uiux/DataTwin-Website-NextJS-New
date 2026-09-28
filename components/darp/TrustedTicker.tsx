import { TRUSTED_BY } from "./darp-data";

function TickerSet({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className={`dp-ticker-set ${duplicate ? "dp-ticker-set-dup" : ""}`.trim()} aria-hidden={duplicate || undefined}>
      {TRUSTED_BY.map((name) => (
        <li key={name} className="flex items-center whitespace-nowrap">
          <span className="text-[1.15rem] font-bold tracking-[-0.005em] text-navy sm:text-xl">{name}</span>
          <span aria-hidden="true" className="mx-5 text-xl leading-none font-bold text-accent sm:mx-7">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

// Slow, seamless running text: two identical sets scroll left by exactly one set's width.
// With reduced motion the second set is hidden and the names simply wrap, centred.
// Lives in its own white <Section> (see TrustedBySection) rather than a dark one, so the names
// use the navy ink tokens; the caller controls the section's own top/bottom spacing.
export function TrustedTicker() {
  return (
    <div className="text-center">
      <p className="text-[13px] font-medium tracking-[0.04em] text-navy-muted">Trusted by finance teams at</p>
      <div className="dp-ticker mt-5 overflow-hidden">
        <div className="dp-ticker-track">
          <TickerSet />
          <TickerSet duplicate />
        </div>
      </div>
    </div>
  );
}
