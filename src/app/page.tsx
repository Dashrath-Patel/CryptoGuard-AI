"use client";
import { CryptoGuardHero } from "@/components/cryptoguard-hero";
import { CryptoGuardFeatures } from "@/components/cryptoguard-features";
import { ProblemSolutionSection } from "@/components/problem-solution-section";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NoSSR } from "@/components/no-ssr";

export default function Home() {
  return (
    <main className="relative bg-black">
      <NoSSR fallback={<div className="h-20 bg-black" />}>
        <Header />
      </NoSSR>
      
      <NoSSR fallback={
        <div className="h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }>
        <CryptoGuardHero />
      </NoSSR>
      
      <NoSSR fallback={<div className="h-96 bg-black" />}>
        <ProblemSolutionSection />
      </NoSSR>
      
      <NoSSR fallback={<div className="h-96 bg-black" />}>
        <CryptoGuardFeatures />
      </NoSSR>
      
      <Footer />
    </main>
  );
}
