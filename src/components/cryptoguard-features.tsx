"use client";
import { motion } from "motion/react";
import { useState } from "react";
import {
  IconShieldCheck,
  IconFileSearch,
  IconLanguage,
  IconChartBar,
} from "@tabler/icons-react";

export function CryptoGuardFeatures() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 py-20 bg-gradient-to-b from-black/50 to-transparent">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-4"
        >
          Four Tools to Rule Them All
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-neutral-400 text-lg max-w-2xl mx-auto"
        >
          Our AI-powered suite addresses the biggest barriers in crypto adoption
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {topFeatures.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>

      {/* Portfolio Insights - Full width bottom card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <PortfolioInsightsCard />
      </motion.div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof topFeatures[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-80 rounded-2xl border p-6 transition-all duration-300 overflow-hidden ${
        feature.borderColor
      } ${feature.bgGradient} ${isHovered ? 'transform -translate-y-2 shadow-2xl' : 'shadow-lg'}`}>
        
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] opacity-50"></div>
        
        {/* Icon and status header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className={`p-3 rounded-xl ${feature.iconBg}`}>
            <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${feature.statusBg} ${feature.statusColor}`}>
            {feature.status}
          </div>
        </div>

        {/* Feature demo */}
        <div className="relative z-10 mb-6 h-32 flex items-center justify-center">
          {feature.demo}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
          <p className="text-neutral-300 text-sm leading-relaxed">{feature.description}</p>
        </div>

        {/* Performance metrics */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between text-xs">
          <div className="text-neutral-400">
            <span className="text-white font-semibold">{feature.accuracy}</span> accuracy
          </div>
          <div className="text-neutral-400">
            <span className="text-white font-semibold">{feature.speed}</span> response
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PortfolioInsightsCard() {
  return (
    <div className="relative h-48 rounded-2xl border border-orange-500/30 p-6 bg-gradient-to-br from-orange-900/10 to-yellow-900/10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] opacity-50"></div>
      
      <div className="relative z-10 flex items-center justify-between h-full">
        
        {/* Left side - Title and description */}
        <div className="flex-1 pr-8">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-xl bg-orange-500/20">
              <IconChartBar className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white ml-4">Portfolio Insights</h3>
          </div>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Get personalized AI-driven recommendations and comprehensive risk analysis for your entire crypto portfolio with actionable insights and real-time monitoring.
          </p>
        </div>

        {/* Right side - Metrics dashboard */}
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="h-12 w-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-2">
              <IconChartBar className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="text-xs text-neutral-400 mb-1">Portfolio Health</div>
            <div className="text-xl font-bold text-yellow-400">75%</div>
          </div>
          
          <div className="text-center">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="text-xs text-neutral-400 mb-1">AI Recommendations</div>
            <div className="text-xl font-bold text-cyan-400">5</div>
          </div>
          
          <div className="text-center">
            <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-xs text-neutral-400 mb-1">Risk Level</div>
            <div className="text-xl font-bold text-green-400">Low</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const topFeatures = [
  {
    title: "AI Security Scanner",
    description: "Instantly detect threats in wallets, transactions, and smart contracts. Our advanced AI analyzes patterns, identifies scams, and protects your assets in real-time with 99.2% accuracy.",
    icon: IconShieldCheck,
    status: "ACTIVE",
    accuracy: "99.2%",
    speed: "<2s",
    borderColor: "border-green-500/30",
    bgGradient: "bg-gradient-to-br from-green-900/10 to-emerald-900/10",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
    statusBg: "bg-green-500/20",
    statusColor: "text-green-300",
    demo: (
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-black/40 rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <IconShieldCheck className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">SECURE</span>
          </div>
          <div className="text-center text-xs text-neutral-400">Risk Score: Very Low</div>
          <div className="text-center text-xs text-green-400 mt-1">✓ No threats detected</div>
        </div>
      </div>
    ),
  },
  {
    title: "Smart Contract Auditor",
    description: "Get comprehensive contract analysis with letter grades and detailed vulnerability reports. Our AI examines code quality, security flaws, and potential exploits before you invest.",
    icon: IconFileSearch,
    status: "ANALYZING",
    accuracy: "96.8%",
    speed: "<5s",
    borderColor: "border-blue-500/30",
    bgGradient: "bg-gradient-to-br from-blue-900/10 to-indigo-900/10",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    statusBg: "bg-blue-500/20",
    statusColor: "text-blue-300",
    demo: (
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-black/40 rounded-lg p-4 border border-blue-500/30">
          <div className="text-center mb-2">
            <div className="text-2xl font-bold text-blue-400">Grade: A-</div>
          </div>
          <div className="text-center text-xs text-neutral-400 mb-1">Security Analysis Complete</div>
          <div className="text-center text-xs text-yellow-400">⚠ 2 minor optimizations suggested</div>
        </div>
      </div>
    ),
  },
  {
    title: "Smart Translator",
    description: "Convert complex crypto jargon into plain English instantly. Understand DeFi terms, trading concepts, and blockchain terminology without the confusion or intimidation factor.",
    icon: IconLanguage,
    status: "READY",
    accuracy: "98.5%",
    speed: "Instant",
    borderColor: "border-purple-500/30",
    bgGradient: "bg-gradient-to-br from-purple-900/10 to-violet-900/10",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    statusBg: "bg-purple-500/20",
    statusColor: "text-purple-300",
    demo: (
      <div className="w-full max-w-sm mx-auto space-y-2">
        <div className="bg-black/40 rounded-lg p-3 border border-red-500/30">
          <div className="text-xs text-neutral-400 mb-1">Complex:</div>
          <div className="text-xs text-red-300">"Impermanent loss"</div>
        </div>
        <div className="flex justify-center">
          <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="bg-black/40 rounded-lg p-3 border border-green-500/30">
          <div className="text-xs text-neutral-400 mb-1">Simple:</div>
          <div className="text-xs text-green-300">"Temporary loss when providing liquidity"</div>
        </div>
      </div>
    ),
  },
];
