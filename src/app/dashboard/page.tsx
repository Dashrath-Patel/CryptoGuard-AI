"use client";
import { DashboardWelcome } from "@/components/dashboard-welcome";
import { WalletHealthWidget } from "@/components/wallet-health-widget";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { 
  IconShieldCheck, 
  IconFileSearch, 
  IconLanguage, 
  IconChartBar,
  IconArrowRight
} from "@tabler/icons-react";

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    const address = localStorage.getItem("walletAddress");
    if (address) {
      setWalletAddress(address);
    }
  }, []);

  const tools = [
    {
      title: "BNB Chain AI Security Scanner",
      description: "Analyze BNB wallets, BSC transactions, and BEP-20 smart contracts for threats",
      icon: IconShieldCheck,
      href: "/dashboard/scanner",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      title: "BEP-20 Contract Auditor", 
      description: "Get comprehensive security grades for any BNB Chain BEP-20 contract",
      icon: IconFileSearch,
      href: "/dashboard/auditor",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "BSC Transaction Translator",
      description: "Convert complex BNB Chain transaction data into plain English",
      icon: IconLanguage,
      href: "/dashboard/translator", 
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "BNB Portfolio Insights",
      description: "Get AI-powered recommendations for your BNB Chain DeFi investments",
      icon: IconChartBar,
      href: "/dashboard/insights",
      color: "text-yellow-400", 
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
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
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${tool.bgColor} ${tool.borderColor} border mb-4`}>
                          <tool.icon className={`h-6 w-6 ${tool.color}`} />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {tool.title}
                        </h3>
                        
                        <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                          {tool.description}
                        </p>
                        
                        <div className="flex items-center text-sm font-medium text-white group">
                          <span>Launch Tool</span>
                          <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardSpotlight>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              
              <CardSpotlight>
                <div className="relative z-20 p-6">
                  {walletAddress ? (
                    <div className="space-y-4">
                      {[
                        { action: "Security scan completed", time: "2 hours ago", status: "✅ Safe" },
                        { action: "Contract audit requested", time: "1 day ago", status: "📊 Grade: B+" },
                        { action: "Translation completed", time: "2 days ago", status: "📝 Simplified" },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-b-0">
                          <div>
                            <div className="text-white font-medium">{activity.action}</div>
                            <div className="text-neutral-400 text-sm">{activity.time}</div>
                          </div>
                          <div className="text-sm font-medium text-green-400">
                            {activity.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-neutral-400 mb-4">
                        Connect your wallet to see your activity history
                      </div>
                      <div className="text-sm text-neutral-500">
                        Once connected, you&apos;ll see scans, audits, and translations here
                      </div>
                    </div>
                  )}
                </div>
              </CardSpotlight>
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
