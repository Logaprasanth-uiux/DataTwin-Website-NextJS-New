import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  AiHero,
  ArchitectureSection,
  ChangesSection,
  EnginesSection,
  HitlSection,
  LineSection,
  LoopSection,
  PracticeSection,
} from "@/components/ai-page/AiPageSections";

export const metadata: Metadata = {
  title: "How AI is used — DataTwin",
  description:
    "Agents do the work, rules do the posting. A team of specialised agents, humans at the control gates, and deterministic, versioned rules wherever something becomes an entry in your books.",
};

export default function HowAiIsUsedPage() {
  return (
    <>
      <Navbar />
      <main className="dt-main pt-3 sm:pt-4 lg:pt-6">
        <AiHero />
        <ArchitectureSection />
        <EnginesSection />
        <PracticeSection />
        <LoopSection />
        <HitlSection />
        <LineSection />
        <ChangesSection />
      </main>
      <Footer>
        <FinalCta />
      </Footer>
    </>
  );
}
