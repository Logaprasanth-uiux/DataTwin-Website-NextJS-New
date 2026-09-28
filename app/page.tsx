import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import { RecoverySection } from "@/components/sections/RecoverySection";
import { SituationSection } from "@/components/sections/SituationSection";
import { DarpSection } from "@/components/sections/DarpSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { NextStepsSection } from "@/components/sections/NextStepsSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        <Hero />
        <RecoverySection />
        <SituationSection />
        <DarpSection />
        <TrustedBySection />
        <SolutionsSection />
        <OutcomesSection />
        <NextStepsSection />
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}
