"use client";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { motion } from "motion/react";
import {
  IconShieldCheck,
  IconFileSearch,
  IconLanguage,
  IconChartBar,
  IconRobot,
  IconLock,
} from "@tabler/icons-react";

export function CryptoGuardFeatures() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 py-20">
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

      <BentoGrid className="max-w-6xl mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </section>
  );
}

const Skeleton = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
    <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
    <div className="relative z-10 flex items-center justify-center w-full h-full">
      {children}
    </div>
  </div>
);

const items = [
  {
    title: "AI Security Scanner",
    description: "Instant threat detection for wallets, transactions, and smart contracts using advanced AI analysis.",
    header: (
      <Skeleton>
        <div className="flex flex-col items-center space-y-4">
          <IconShieldCheck className="h-12 w-12 text-green-500" />
          <div className="text-center">
            <div className="text-green-400 text-sm font-mono">✓ SAFE</div>
            <div className="text-xs text-neutral-400">Risk Score: Low</div>
          </div>
        </div>
      </Skeleton>
    ),
    icon: <IconShieldCheck className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Smart Contract Auditor",
    description: "Comprehensive contract analysis with letter grades and vulnerability detection.",
    header: (
      <Skeleton>
        <div className="flex flex-col items-center space-y-4">
          <IconFileSearch className="h-12 w-12 text-blue-500" />
          <div className="text-center">
            <div className="text-blue-400 text-lg font-bold">Grade: B+</div>
            <div className="text-xs text-neutral-400">3 minor issues found</div>
          </div>
        </div>
      </Skeleton>
    ),
    icon: <IconFileSearch className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Smart Translator",
    description: "Convert complex crypto jargon into plain English that anyone can understand.",
    header: (
      <Skeleton>
        <div className="flex flex-col items-center space-y-2">
          <IconLanguage className="h-12 w-12 text-purple-500" />
          <div className="text-center px-4">
            <div className="text-xs text-neutral-500 mb-1">Complex:</div>
            <div className="text-xs text-red-400 mb-2">&quot;Impermanent loss&quot;</div>
            <div className="text-xs text-neutral-500 mb-1">Simple:</div>
            <div className="text-xs text-green-400">&quot;Risk of losing money when providing liquidity&quot;</div>
          </div>
        </div>
      </Skeleton>
    ),
    icon: <IconLanguage className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Portfolio Insights",
    description: "Get personalized recommendations and risk analysis for your crypto portfolio with actionable insights.",
    header: (
      <Skeleton>
        <div className="flex items-center justify-around w-full px-8">
          <div className="text-center">
            <IconChartBar className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-xs text-neutral-400">Portfolio Health</div>
            <div className="text-sm text-yellow-400">75%</div>
          </div>
          <div className="text-center">
            <IconRobot className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
            <div className="text-xs text-neutral-400">AI Recommendations</div>
            <div className="text-sm text-cyan-400">5 Available</div>
          </div>
          <div className="text-center">
            <IconLock className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-xs text-neutral-400">Risk Level</div>
            <div className="text-sm text-green-400">Low</div>
          </div>
        </div>
      </Skeleton>
    ),
    icon: <IconChartBar className="h-4 w-4 text-neutral-500" />,
  },
];
