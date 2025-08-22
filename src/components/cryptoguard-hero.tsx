"use client";
import { motion } from "motion/react";
import { Spotlight } from "./ui/spotlight";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function CryptoGuardHero() {
  const words = "Transform BNB Chain from 'scary and complex' to 'safe and simple'";
  
  return (
    <div className="relative h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] overflow-hidden">
      {/* Spotlight effects */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <Spotlight
        className="top-10 left-full h-[80vh] w-[50vw]"
        fill="#F0B90B"
      />
      <Spotlight
        className="top-28 left-80 h-[80vh] w-[50vw]"
        fill="#F0B90B"
      />
      
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4">
        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            CryptoGuard AI
          </h1>
          <p className="text-xl md:text-2xl text-yellow-400 font-semibold mt-4">
            BNB Chain Security Platform
          </p>
          <div className="mt-8 max-w-4xl">
            <TextGenerateEffect words={words} className="text-lg md:text-xl" />
          </div>
        </motion.div>

        {/* Problem statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 max-w-2xl text-center"
        >
          <p className="text-neutral-300 text-lg">
            With <span className="text-red-400 font-semibold">$3.8B+ lost</span> to crypto scams and hacks on BSC, 
            we&apos;re building the first AI-powered platform specifically for <span className="text-yellow-400 font-semibold">BNB Chain security</span>.
          </p>
        </motion.div>

        {/* Key benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-neutral-400"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>BNB Chain AI Security Scanning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
            <span>BEP-20 Contract Auditing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>BSC Transaction Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span>PancakeSwap Safety Analysis</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => window.location.href = '/dashboard'}
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 text-lg px-8 py-3"
          >
            <span>Launch App</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </HoverBorderGradient>
          
          <button 
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 text-lg border border-neutral-600 text-neutral-300 hover:text-white hover:border-neutral-400 transition-colors rounded-full"
          >
            Learn More
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-white">$3.8B+</div>
            <div className="text-sm text-neutral-400">Lost to crypto scams</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">90%</div>
            <div className="text-sm text-neutral-400">Accuracy rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">&lt;3s</div>
            <div className="text-sm text-neutral-400">Analysis time</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
