import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  ApHero,
  ChangesSection,
  GatesSection,
  HoodSection,
  LifecycleSection,
  MonthSection,
  PaySection,
  PortalSection,
  StartSection,
} from "@/components/ap-page/ApPageSections";

export const metadata: Metadata = {
  title: "Accounts Payable — DataTwin",
  description:
    "Invoices arrive as documents; they should land as correct entries. Read, matched, checked against your own rules, approved, posted and verified against the ERP, then paid on your terms.",
};

export default function AccountsPayablePage() {
  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        <ApHero />
        <LifecycleSection />
        <GatesSection />
        <PaySection />
        <MonthSection />
        <PortalSection />
        <HoodSection />
        <ChangesSection />
        <StartSection />
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}
