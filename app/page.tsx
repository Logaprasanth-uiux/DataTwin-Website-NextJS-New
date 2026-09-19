import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import { RecoverySection } from "@/components/sections/RecoverySection";
import { DarpSection } from "@/components/sections/DarpSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-3 sm:pt-4 lg:pt-6">
        <Hero />
        <RecoverySection />
        <DarpSection />
      </main>
    </>
  );
}
