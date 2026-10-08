import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  ControlsSection,
  DataSection,
  PostureSection,
  RbacSection,
  SecurityFaqSection,
  SecurityHero,
} from "@/components/security-page/SecuritySections";

export const metadata: Metadata = {
  title: "Security — DataTwin",
  description:
    "Read access and nothing more. ISO 27001 certified and SOC 2 attested, with role-based access, encryption, an immutable audit trail and deployment on the cloud you choose.",
};

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        <SecurityHero />
        <PostureSection />
        <ControlsSection />
        <RbacSection />
        <DataSection />
        <SecurityFaqSection />
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}
