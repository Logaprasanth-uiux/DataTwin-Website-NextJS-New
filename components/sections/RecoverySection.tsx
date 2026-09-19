import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CtaLink } from "@/components/ui/CtaLink";
import {
  AuditReadyVisual,
  CreditRefundVisual,
  MoneyToBankVisual,
  RepeatLoopVisual,
} from "@/components/ui/RecoveryVisuals";

const RECOVERY_AREAS = [
  {
    title: "Cash recoverable",
    description: "Duplicate payments, paid above contract, discounts never taken, many more.",
    outcome: "Money back to the bank",
    Visual: MoneyToBankVisual,
  },
  {
    title: "Tax recoverable",
    description: "Unclaimed input credit, rate mismatches, sales return mismatches, many more.",
    outcome: "Credit or Refund",
    Visual: CreditRefundVisual,
  },
  {
    title: "Misstated",
    description: "GR not accrued, prepaids not amortised, provisions never released & so on.",
    outcome: "Audit readiness",
    Visual: AuditReadyVisual,
  },
  {
    title: "Control weakness",
    description: "Duplicate vendors, invoices just under approval limits, self-approval & others.",
    outcome: "Why failures repeat?",
    Visual: RepeatLoopVisual,
  },
] as const;

// Row/column dividers for a 2×2 grid that collapses to one column.
const CELL_DIVIDERS = [
  "",
  "border-t md:border-t-0 md:border-l",
  "border-t",
  "border-t md:border-l",
];

export function RecoverySection() {
  return (
    <Section id="recovery" background="white" contained={false} className="py-24 sm:py-28 lg:py-36">
      <Container className="px-6 sm:px-8 lg:px-10">
        <p className="dt-eyebrow dt-eyebrow-accent dt-reveal text-center">Quantified in about two minutes</p>
        <h2 className="dt-display dt-reveal mt-5 text-center text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-navy sm:text-5xl lg:text-[3.5rem]">
          What can be recovered?
        </h2>

        <div className="mt-14 grid border-y border-navy-divider sm:mt-16 md:grid-cols-2 lg:mt-20">
          {RECOVERY_AREAS.map((area, index) => (
            <article
              key={area.title}
              className={`dt-reveal group flex flex-col border-navy-divider py-10 md:px-10 md:py-14 lg:px-14 lg:py-16 ${CELL_DIVIDERS[index]}`.trim()}
            >
              <span className="text-[12px] font-semibold tracking-[0.14em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="dt-display mt-5 text-[1.75rem] leading-tight font-semibold tracking-[-0.01em] text-navy sm:text-[2rem]">
                {area.title}
              </h3>
              <p className="mt-3 max-w-md text-[16px] leading-[1.65] text-navy-body">{area.description}</p>
              <div className="mt-8 flex items-center justify-between gap-4 md:mt-auto md:pt-10">
                <p className="flex items-center gap-3 text-[13.5px] font-semibold text-navy">
                  <span
                    aria-hidden="true"
                    className="h-px w-6 bg-accent transition-[width] duration-300 group-hover:w-10"
                  />
                  {area.outcome}
                </p>
                <area.Visual />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex justify-center sm:mt-16">
          <CtaLink href="#contact">Find your recoverable number</CtaLink>
        </div>
      </Container>
    </Section>
  );
}
