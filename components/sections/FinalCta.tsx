import { CtaLink } from "@/components/ui/CtaLink";
import { RecoveryCtaButton } from "@/components/chat/RecoveryCtaButton";
import { CONTACT_MAILTO } from "@/components/layout/footer-data";

// The homepage's closing call to action. It is passed to <Footer> as its children, so it sits at the
// top of the same continuous gradient canvas as the footer beneath it, set off from that canvas as its
// own outlined, lightly-shaded panel rather than sitting flush on the bare background.
// (`id="contact"` is where the header's and footer's "Contact" links land.)

export function FinalCta() {
  return (
    <div
      id="contact"
      className="scroll-mt-28 rounded-[28px] border border-navy-hairline bg-white/[0.04] px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20"
    >
      <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">Get started</p>
      <h2 className="dt-display dt-reveal mt-5 text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.02em] text-balance sm:text-6xl lg:text-[4.5rem]">
        <span className="block text-navy">Start with one process.</span>
        <span className="block text-accent">We&apos;ll come back with a number.</span>
      </h2>
      <p className="dt-body dt-reveal mx-auto mt-8 max-w-3xl text-[17px] text-balance sm:text-lg">
        Working from the transaction history your systems already hold, we run our discovery. Nothing
        changes in your systems, nobody in your team changes how they work, and you see what&apos;s
        recoverable before there&apos;s anything to sign. If the number isn’t worth acting on, at least
        you know you’re safe.
      </p>
      <div className="dt-reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <RecoveryCtaButton entryContext="final-cta" variant="solid">
          Discover your number
        </RecoveryCtaButton>
        <CtaLink href={CONTACT_MAILTO} variant="outline">
          Email us instead
        </CtaLink>
      </div>
    </div>
  );
}
