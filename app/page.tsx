import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import { RecoverySection } from "@/components/sections/RecoverySection";
import { DarpSection } from "@/components/sections/DarpSection";
import { SituationSection } from "@/components/sections/SituationSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { NextStepsSection } from "@/components/sections/NextStepsSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        <Hero />
        <RecoverySection />
        <DarpSection />
        <SituationSection />
        <SolutionsSection />
        <NextStepsSection />
        <OutcomesSection />
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}
