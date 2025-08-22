"use client";
import { motion } from "motion/react";
import { Spotlight } from "./ui/spotlight";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function CryptoGuardHero() {
  const words = "Making cryptocurrency as safe and easy as online banking through intelligent automation";
  
  return (
    <div className="relative h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] overflow-hidden">
      {/* Spotlight effects */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <Spotlight
        className="top-10 left-full h-[80vh] w-[50vw]"
        fill="#10B981"
      />
      <Spotlight
        className="top-28 left-80 h-[80vh] w-[50vw]"
        fill="#3B82F6"
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
          <p className="text-xl md:text-2xl text-green-400 font-semibold mt-4">
            AI-Powered Crypto Protection Platform
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
          className="mt-8 max-w-3xl text-center"
        >
          <p className="text-neutral-300 text-lg">
            With <span className="text-red-400 font-semibold">$3.8B+ lost annually</span> to crypto scams and 
            <span className="text-yellow-400 font-semibold"> 99% of people</span> finding crypto too complex, 
            we&apos;re building the first comprehensive AI protection platform.
          </p>
        </motion.div>

        {/* Key benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-400 max-w-4xl"
        >
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-center">AI Security Scanner</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-center">Contract Auditor</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            <span className="text-center">Smart Translator</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            <span className="text-center">Market Guardian</span>
          </div>
        </motion.div>

        {/* Impact metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex flex-wrap justify-center gap-8 text-center max-w-4xl"
        >
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-400">80%+</span>
            <span className="text-xs text-neutral-500">Losses Prevented</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-400">100M+</span>
            <span className="text-xs text-neutral-500">Target Users</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-purple-400">$2T+</span>
            <span className="text-xs text-neutral-500">Market Size</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-orange-400">&lt;3s</span>
            <span className="text-xs text-neutral-500">Threat Detection</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative group launch-app-button glow-on-hover">
            {/* Glow effect background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>
            
            <HoverBorderGradient
              containerClassName="rounded-full relative z-10"
              as="button"
              onClick={() => window.location.href = '/dashboard'}
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 text-lg px-8 py-3 group-hover:scale-105 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/25"
            >
              <span className="group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">Launch App</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </HoverBorderGradient>
          </div>
          
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
