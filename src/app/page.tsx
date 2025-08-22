"use client";
import { CryptoGuardHero } from "@/components/cryptoguard-hero";
import { CryptoGuardFeatures } from "@/components/cryptoguard-features";
import { ProblemSolutionSection } from "@/components/problem-solution-section";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NoSSR } from "@/components/no-ssr";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  return (
    <main className="relative">
      <NoSSR fallback={<div className="h-20 bg-black" />}>
        <Header />
      </NoSSR>
      
      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="relative">
        <NoSSR fallback={
          <div className="h-screen bg-black flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
        }>
          <CryptoGuardHero />
        </NoSSR>
      </AuroraBackground>
      
      {/* Problems Section with enhanced background */}
      <div className="relative bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
        <NoSSR fallback={<div className="h-96 bg-black" />}>
          <ProblemSolutionSection />
        </NoSSR>
      </div>
      
      {/* Features Section with enhanced background */}
      <div className="relative bg-gradient-to-b from-black via-blue-950/20 to-black">
        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <NoSSR fallback={<div className="h-96 bg-black" />}>
          <CryptoGuardFeatures />
        </NoSSR>
      </div>
      
      <Footer />
    </main>
  );
}
