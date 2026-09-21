import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CtaLink } from "@/components/ui/CtaLink";
import { LongSectionContextLabel } from "@/components/ui/LongSectionContextLabel";

const PROBLEMS = [
  {
    title: "The ERP is incomplete.",
    description:
      "It records the transaction as it happens. It does not see the data outside the system that affects it & so it cannot reconcile it.",
  },
  {
    title: "Your auditor tests a sample.",
    description:
      "Sampling helps to form an opinion and does not find all issues. The full population audit finds thousands of items below materiality that add up.",
  },
  {
    title: "The proof lives outside the system.",
    description:
      "Contracts, POS files, gateway reports, bank lines, vendor-filed returns. Nobody reconciles all of it, so nobody can prove the entry was right.",
  },
  {
    title: "Fixing it normally means a project.",
    description:
      "Which is why it doesn't get fixed. The cost lands up front, the business case is a projection, and the benefit arrives long after.",
  },
] as const;

// Row/column dividers for a 2×2 grid that collapses to one column. The divider between rows is a
// bottom border on the upper cells, so every cell has the same padding above and below its content.
// Left-column cells carry no left padding so their text lines up with the section heading;
// right-column cells sit past the divider.
const CELL_CLASSES = [
  "border-b md:pr-10 lg:pr-14",
  "border-b md:border-l md:pl-10 lg:pl-14",
  "border-b md:border-b-0 md:pr-10 lg:pr-14",
  "md:border-l md:pl-10 lg:pl-14",
];

export function SituationSection() {
  return (
    <div className="pb-3 sm:pb-5 lg:pb-8">
      <Section
        id="situation"
        background="cream-gradient"
        className="py-20 sm:py-24 lg:py-32"
      >
        <LongSectionContextLabel label="The situation" headingId="situation-title" />
        <Container className="px-6 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-x-12 lg:pb-11">
            <div className="dt-reveal lg:col-span-8">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-accent" />
                <p className="dt-eyebrow dt-eyebrow-accent">The situation</p>
              </div>
              <h2 id="situation-title" className="dt-display mt-6 text-4xl leading-[1.04] font-semibold tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
                <span className="block text-navy">The ERP records the transaction.</span>
                <span className="block text-accent">The leakage happens around it.</span>
              </h2>
            </div>
            <p className="dt-body dt-reveal max-w-md lg:col-span-4 lg:-mt-[3px] lg:justify-self-end">
              Your system records transactions as they come. It cannot reconcile the differences as
              the evidence that would settle them sits outside it. So reconciliation is manual or
              outside the system. That&apos;s where the money leaks.
            </p>
          </div>

          <div className="mt-14 grid border-y border-navy-hairline sm:mt-16 md:grid-cols-2 lg:mt-20">
            {PROBLEMS.map((problem, index) => (
              <article
                key={problem.title}
                className={`dt-reveal group border-navy-divider py-10 md:row-span-4 md:grid md:grid-rows-subgrid md:py-12 lg:py-14 ${CELL_CLASSES[index]}`}
              >
                <span className="text-[12px] font-semibold tracking-[0.14em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="dt-display mt-4 text-[1.75rem] leading-tight font-semibold tracking-[-0.01em] text-navy sm:text-[2rem] md:text-[1.625rem] lg:text-[2rem]">
                  {problem.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-5 block h-px w-6 bg-accent transition-[width] duration-300 group-hover:w-10"
                />
                <p className="mt-5 max-w-md text-[16px] leading-[1.65] text-navy-body">
                  {problem.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-8 sm:mt-20 lg:mt-24 lg:grid-cols-12 lg:items-start lg:gap-x-12">
            <h3 className="dt-display dt-reveal text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.02em] sm:text-6xl lg:col-span-7 lg:text-[4.5rem]">
              <span className="block text-navy">Analyse first.</span>
              <span className="block text-accent">Record later.</span>
            </h3>
            <div className="dt-reveal lg:col-span-5 lg:justify-self-end lg:pt-[15px]">
              <p className="dt-body max-w-md">
                The order most systems get backwards. Every transaction is checked against
                everything that should agree with it <em className="font-semibold text-navy not-italic">before</em>{" "}
                it becomes a number you have to defend.
              </p>
              <CtaLink href="#contact" className="mt-6">
                See how analysis comes first
              </CtaLink>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
