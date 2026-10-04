import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  AcquisitionSection,
  AcrossSection,
  AiNativeSection,
  DashboardsSection,
  EngineSection,
  PlatformHero,
  ProcessingSection,
} from "@/components/platform/PlatformSections";

export const metadata: Metadata = {
  title: "Platform Overview — DataTwin",
  description:
    "One engine, every solution. DataTwin wraps the systems you already run and models new sources itself, with your rules configured, not coded. Nothing migrated, nothing switched off.",
};

export default function PlatformPage() {
  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        <PlatformHero />
        <EngineSection />
        <AcquisitionSection />
        <ProcessingSection />
        <DashboardsSection />
        <AiNativeSection />
        <AcrossSection />
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}
