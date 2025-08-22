import { CryptoGuardHero } from "@/components/cryptoguard-hero";
import { CryptoGuardFeatures } from "@/components/cryptoguard-features";
import { ProblemSolutionSection } from "@/components/problem-solution-section";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative bg-black">
      <Header />
      <CryptoGuardHero />
      <ProblemSolutionSection />
      <CryptoGuardFeatures />
      <Footer />
    </main>
  );
}
