import { CtaLink } from "@/components/ui/CtaLink";
import { CONTACT_MAILTO } from "@/components/layout/footer-data";

// The homepage's closing call to action. It has no background of its own: it is passed to <Footer> as
// its children, so it sits at the top of the same continuous gradient canvas as the footer beneath it.
// (`id="contact"` is where the header's and footer's "Contact" links land.)

export function FinalCta() {
  return (
    <div id="contact" className="scroll-mt-28 text-center">
      <p className="dt-eyebrow dt-eyebrow-accent dt-reveal">Get started</p>
      <h2 className="dt-display dt-reveal mt-5 text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.02em] text-balance sm:text-6xl lg:text-[4.5rem]">
        <span className="block text-navy">Tell us your problem.</span>
        <span className="block text-accent">We&apos;ll tell you what we can recover.</span>
      </h2>
      <p className="dt-body dt-reveal mx-auto mt-8 max-w-3xl text-[17px] text-balance sm:text-lg">
        Working from the transaction history your systems already hold, we run our discovery. Nothing
        changes in your systems, nobody in your team changes how they work, and you see what&apos;s
        recoverable before there&apos;s anything to sign. If the number isn’t worth acting on, at least
        you know you’re safe.
      </p>
      <div className="dt-reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <CtaLink href="#contact" variant="solid">
          Tell us your problem
        </CtaLink>
        <CtaLink href={CONTACT_MAILTO} variant="outline">
          Email us instead
        </CtaLink>
      </div>
    </div>
  );
}
