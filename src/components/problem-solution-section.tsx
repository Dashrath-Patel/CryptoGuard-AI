"use client";
import { motion } from "motion/react";
import { useState } from "react";

export function ProblemSolutionSection() {
  return (
    <section id="problems" className="max-w-7xl mx-auto px-4 py-20 bg-black/50">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-4"
        >
          The Problem is Real
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-neutral-400 text-lg max-w-2xl mx-auto"
        >
          Three critical barriers are keeping millions away from crypto
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {problemSolutionItems.map((item, index) => (
          <ProblemCard key={index} item={item} index={index} />
        ))}
      </div>

      <div className="text-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl max-w-2xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            We&apos;re the First AI-Powered Solution
          </h3>
          <p className="text-blue-100 text-lg">
            Making Web3 security accessible to everyone, not just experts
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemCard({ item, index }: { item: typeof problemSolutionItems[0], index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="relative h-80 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front of card - Problem */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-red-900/20 to-red-600/10 border border-red-500/20 p-6 flex flex-col justify-between">
          <div>
            <div className="text-4xl mb-4">{item.emoji}</div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <span className="inline-block px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full mb-4">
              {item.description}
            </span>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {item.details}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-red-400 font-semibold text-lg">
              ${item.impact}
            </div>
            <div className="text-xs text-neutral-500">
              Hover for solution →
            </div>
          </div>
        </div>

        {/* Back of card - Solution */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-green-900/20 to-green-600/10 border border-green-500/20 p-6 flex flex-col justify-between transform rotateY-180">
          <div>
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-2">✅</div>
              <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
                Our Solution
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{item.solutionTitle}</h3>
            <p className="text-neutral-300 text-sm leading-relaxed mb-4">
              {item.solution}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Accuracy:</span>
              <span className="text-green-400 font-semibold">{item.accuracy}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Speed:</span>
              <span className="text-green-400 font-semibold">{item.speed}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const problemSolutionItems = [
  {
    emoji: "🚨",
    title: "Security Threats",
    description: "Problem",
    details: "Hackers steal billions yearly through smart contract exploits, phishing attacks, and social engineering. Most users can't identify threats until it's too late.",
    impact: "3.8B+ lost",
    solutionTitle: "AI Security Scanner",
    solution: "Our advanced AI continuously monitors transactions, smart contracts, and wallet activities to detect threats in real-time before you become a victim.",
    accuracy: "90%+",
    speed: "<3s"
  },
  {
    emoji: "🤯",
    title: "Too Complex",
    description: "Problem", 
    details: "Crypto terminology is incomprehensible to newcomers. Technical jargon like 'impermanent loss' and 'slippage' creates barriers to entry.",
    impact: "99% confused",
    solutionTitle: "Smart Translator",
    solution: "Converts complex blockchain terminology into plain English explanations that anyone can understand, making crypto accessible to everyone.",
    accuracy: "95%+",
    speed: "Instant"
  },
  {
    emoji: "💸",
    title: "Market Manipulation",
    description: "Problem",
    details: "Pump and dump schemes, rug pulls, and fake projects specifically target newcomers who lack the expertise to identify warning signs.",
    impact: "2.1B+ stolen",
    solutionTitle: "Contract Auditor", 
    solution: "Automatically analyzes smart contracts and tokenomics to identify potential scams, rug pulls, and suspicious patterns before you invest.",
    accuracy: "85%+",
    speed: "<5s"
  },
];
