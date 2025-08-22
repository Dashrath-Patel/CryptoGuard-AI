"use client";
import { DashboardWelcome } from "@/components/dashboard-welcome";
import { WalletHealthWidget } from "@/components/wallet-health-widget";
import { LiveNetworkStatus } from "@/components/live-network-status";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { NoSSR } from "@/components/no-ssr";
import { 
  IconShieldCheck, 
  IconFileSearch, 
  IconLanguage, 
  IconChartBar,
  IconArrowRight
} from "@tabler/icons-react";

export default function DashboardPage() {
  return (
    <NoSSR>
      <DashboardContent />
    </NoSSR>
  );
}

function DashboardContent() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    const address = localStorage.getItem("walletAddress");
    if (address) {
      setWalletAddress(address);
    }
  }, []);


  const tools = [
    {
      title: "AI Security Scanner",
      description: "Real-time scam detection & risk scoring for wallets, transactions, and smart contracts",
      icon: IconShieldCheck,
      href: "/dashboard/scanner",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      status: "Live",
      impact: "Prevent 80%+ of crypto losses"
    },
    {
      title: "Contract Auditor", 
      description: "AI grades smart contracts A-F for safety with comprehensive vulnerability analysis",
      icon: IconFileSearch,
      href: "/dashboard/auditor",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      status: "Live",
      impact: "Identify vulnerabilities before investment"
    },
    {
      title: "Smart Translator",
      description: "Converts complex DeFi terms to plain English that anyone can understand",
      icon: IconLanguage,
      href: "/dashboard/translator", 
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      status: "Live", 
      impact: "Enable mainstream crypto adoption"
    },
    {
      title: "Market Guardian",
      description: "Detects manipulation & whale movements to protect retail investors",
      icon: IconChartBar,
      href: "/dashboard/guardian",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10", 
      borderColor: "border-orange-500/20",
      status: "Live",
      impact: "Protect against market manipulation"
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-8">
        <DashboardWelcome />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tools */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Security Tools</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => window.location.href = tool.href}
                  >
                    <CardSpotlight className="h-full">
                      <div className="relative z-20 h-full p-6">
                        <div className={`inline-flex items-center justify-between w-full mb-4`}>
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${tool.bgColor} ${tool.borderColor} border`}>
                            <tool.icon className={`h-6 w-6 ${tool.color}`} />
                          </div>
                          {tool.status && (
                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                              {tool.status}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {tool.title}
                        </h3>
                        
                        <p className="text-neutral-400 text-sm mb-3 leading-relaxed">
                          {tool.description}
                        </p>

                        {tool.impact && (
                          <p className="text-xs text-neutral-500 mb-4 italic">
                            💡 {tool.impact}
                          </p>
                        )}
                        
                        <div className="flex items-center text-sm font-medium text-white group">
                          <span>Launch Tool</span>
                          <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardSpotlight>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Exploit Translator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8"
              >
                <CardSpotlight className="w-full">
                  <div className="relative z-20 p-6 bg-gradient-to-br from-green-900/10 to-emerald-900/10 border border-green-500/20 rounded-2xl overflow-hidden">
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-grid-white/[0.02] opacity-50"></div>
                    
                    {/* Header Section */}
                    <div className="relative z-10 flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 mr-4">
                          <IconLanguage className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">Exploit Translator</h3>
                          <p className="text-green-400 text-sm font-medium">AI-Powered Security Analysis</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                        BETA
                      </div>
                    </div>

                    {/* Description and Features */}
                    <div className="relative z-10 mb-6">
                      <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                        Translate complex security exploits and vulnerabilities into human-readable explanations that anyone can understand.
                      </p>
                      
                      {/* Feature List */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Smart Contract Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Vulnerability Detection</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Plain English Output</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Risk Assessment</span>
                        </div>
                      </div>

                      {/* Example Preview */}
                      <div className="bg-black/40 rounded-lg p-4 border border-green-500/20">
                        <div className="text-xs text-neutral-500 mb-2">Example Translation:</div>
                        <div className="space-y-2">
                          <div className="text-xs text-red-300 bg-red-900/20 p-2 rounded border-l-2 border-red-400">
                            <span className="text-red-400 font-semibold">Technical:</span> "Reentrancy vulnerability in transfer function"
                          </div>
                          <div className="flex justify-center">
                            <svg className="h-3 w-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <div className="text-xs text-green-300 bg-green-900/20 p-2 rounded border-l-2 border-green-400">
                            <span className="text-green-400 font-semibold">Simple:</span> "Hackers can drain funds by calling the same function repeatedly"
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="relative z-10">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg shadow-green-600/20"
                        onClick={() => {
                          window.location.href = "/dashboard/translator";
                        }}
                      >
                        <span>Start Translation</span>
                        <IconArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </motion.button>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-neutral-400">
                        <div className="flex items-center gap-1">
                          <span className="text-green-400 font-semibold">98.5%</span>
                          <span>Accuracy</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-neutral-600"></div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-400 font-semibold">&lt;3s</span>
                          <span>Response</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-neutral-600"></div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-400 font-semibold">24/7</span>
                          <span>Available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardSpotlight>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Wallet Health */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Wallet Health</h2>
              <WalletHealthWidget walletAddress={walletAddress} />
            </motion.div>

            {/* Live Network Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <LiveNetworkStatus />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              
              <CardSpotlight>
                <div className="relative z-20 p-6 space-y-4">
                  <button 
                    onClick={() => window.location.href = '/dashboard/scanner'}
                    className="w-full flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-green-500/20 hover:bg-green-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <IconShieldCheck className="h-5 w-5 text-green-400" />
                      <span className="text-white font-medium">Quick Scan</span>
                    </div>
                    <IconArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-green-400 transition-colors" />
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/dashboard/translator'}
                    className="w-full flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <IconLanguage className="h-5 w-5 text-purple-400" />
                      <span className="text-white font-medium">Translate Text</span>
                    </div>
                    <IconArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-purple-400 transition-colors" />
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/dashboard/auditor'}
                    className="w-full flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <IconFileSearch className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-medium">Audit Contract</span>
                    </div>
                    <IconArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                  </button>
                </div>
              </CardSpotlight>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
