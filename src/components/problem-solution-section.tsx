"use client";
import { HoverEffect } from "./ui/card-hover-effect";
import { motion } from "motion/react";

export function ProblemSolutionSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
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

      <HoverEffect items={problemSolutionItems} />

      <div className="text-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            We&apos;re the First AI-Powered Solution
          </h3>
          <p className="text-blue-100">
            Making Web3 security accessible to everyone, not just experts
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const problemSolutionItems = [
  {
    title: "🚨 Security Threats",
    description: "Problem",
    link: "#security-threats",
    details: "$3.8B+ lost to hacks, scams, and exploits. Users can't identify threats.",
    solution: "Our AI Security Scanner provides instant threat detection with 90% accuracy in under 3 seconds."
  },
  {
    title: "🤯 Too Complex",
    description: "Problem", 
    link: "#too-complex",
    details: "Crypto terminology is incomprehensible. 'Impermanent loss' means what exactly?",
    solution: "Smart Translator converts complex jargon into plain English that anyone can understand."
  },
  {
    title: "💸 Market Manipulation",
    description: "Problem",
    link: "#market-manipulation",
    details: "Pump and dump schemes, rug pulls, and fake projects prey on newcomers.",
    solution: "Contract Auditor grades smart contracts and identifies potential scams before you invest."
  },
];
