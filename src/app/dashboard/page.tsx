"use client";
import { DashboardWelcome } from "@/components/dashboard-welcome";
import { WalletHealthWidget } from "@/components/wallet-health-widget";
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-8">
        <DashboardWelcome />
        
        {/* Wallet Health Widget */}
        <div className="mt-8">
          <WalletHealthWidget />
        </div>

        {/* Quick Actions Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Security Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Smart Contract Scanner */}
            <CardSpotlight className="h-80 w-full">
              <div className="text-white relative z-20 p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <IconShieldCheck className="h-8 w-8 text-blue-400 mr-3" />
                    <h3 className="text-xl font-bold">Contract Scanner</h3>
                  </div>
                  <p className="text-neutral-300">
                    Analyze smart contracts for security vulnerabilities and potential risks.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold flex items-center"
                  onClick={() => {
                    // Navigate to scanner tool
                    console.log("Navigate to Contract Scanner");
                  }}
                >
                  Start Scan
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </CardSpotlight>

            {/* Vulnerability Auditor */}
            <CardSpotlight className="h-80 w-full">
              <div className="text-white relative z-20 p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <IconFileSearch className="h-8 w-8 text-red-400 mr-3" />
                    <h3 className="text-xl font-bold">Vulnerability Auditor</h3>
                  </div>
                  <p className="text-neutral-300">
                    Deep audit of your contracts and transactions for security issues.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold flex items-center"
                  onClick={() => {
                    // Navigate to auditor tool
                    console.log("Navigate to Vulnerability Auditor");
                  }}
                >
                  Start Audit
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </CardSpotlight>

            {/* Exploit Translator */}
            <CardSpotlight className="h-80 w-full">
              <div className="text-white relative z-20 p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <IconLanguage className="h-8 w-8 text-green-400 mr-3" />
                    <h3 className="text-xl font-bold">Exploit Translator</h3>
                  </div>
                  <p className="text-neutral-300">
                    Translate complex security exploits into human-readable explanations.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold flex items-center"
                  onClick={() => {
                    // Navigate to translator tool
                    console.log("Navigate to Exploit Translator");
                  }}
                >
                  Translate
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </CardSpotlight>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="bg-neutral-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <IconChartBar className="h-5 w-5 text-blue-400 mr-2" />
                <span className="font-semibold">Security Scan Complete</span>
              </div>
              <span className="text-neutral-400 text-sm">2 minutes ago</span>
            </div>
            <p className="text-neutral-300 text-sm mb-2">
              Contract 0x742...4b2 scanned successfully. No critical vulnerabilities found.
            </p>
            <div className="text-green-400 text-sm">✓ Secure</div>
          </div>

          <div className="bg-neutral-900 rounded-lg p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <IconFileSearch className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="font-semibold">Audit in Progress</span>
              </div>
              <span className="text-neutral-400 text-sm">15 minutes ago</span>
            </div>
            <p className="text-neutral-300 text-sm mb-2">
              Deep audit of DeFi protocol initiated. Analyzing 12 contracts...
            </p>
            <div className="text-yellow-400 text-sm">⏳ In Progress (67%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
