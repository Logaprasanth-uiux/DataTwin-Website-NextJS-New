import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-3 sm:pt-4 lg:pt-6">
        <Hero />
      </main>
    </>
  );
}
