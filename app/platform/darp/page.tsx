import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  AppliesSection,
  AuditSection,
  CostSection,
  DarpHero,
  EngineSection,
  FaqSection,
  FindsSection,
  HowSection,
  PaidSection,
  WhySection,
} from "@/components/darp-page/DarpPageSections";

export const metadata: Metadata = {
  title: "DARP Framework — DataTwin",
  description:
    "Discover, Assess, Recover, Prevent. Read-only to start, full population rather than a sample, and a recoverable number in about two minutes, before anything is signed.",
};

export default function DarpPage() {
  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        <DarpHero />
        <HowSection />
        <WhySection />
        <EngineSection />
        <FindsSection />
        <AuditSection />
        <PaidSection />
        <CostSection />
        <AppliesSection />
        <FaqSection />
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}
