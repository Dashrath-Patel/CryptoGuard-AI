"use client";
import { motion } from "motion/react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { useEffect, useState } from "react";

export function DashboardWelcome() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Hello");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to true after component mounts
    setIsClient(true);

    // Get wallet address from localStorage
    const address = localStorage.getItem("walletAddress");
    if (address) {
      setWalletAddress(address);
    }

    // Update time and greeting
    const updateTimeAndGreeting = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString());
      
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const teamMembers = [
    {
      id: 1,
      name: "AI Security Scanner",
      designation: "Threat Detection",
      image: "🛡️",
      color: "bg-green-500",
      icon: "🔍"
    },
    {
      id: 2,
      name: "Contract Auditor", 
      designation: "Smart Contract Analysis",
      image: "📋",
      color: "bg-blue-500",
      icon: "⚡"
    },
    {
      id: 3,
      name: "Smart Translator",
      designation: "Plain English Conversion", 
      image: "🔤",
      color: "bg-purple-500",
      icon: "💬"
    },
    {
      id: 4,
      name: "Portfolio Insights",
      designation: "Investment Analysis",
      image: "📊",
      color: "bg-orange-500", 
      icon: "💡"
    },
  ];

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="bg-gradient-to-r from-neutral-900/90 to-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-300 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Welcome Message */}
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" suppressHydrationWarning>
                {isClient ? `${greeting}! 👋` : "Welcome! 👋"}
              </h1>
              
              {walletAddress ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-neutral-300">
                    Welcome back to your secure crypto dashboard
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-mono text-sm px-2 py-1 bg-green-500/10 rounded-md border border-green-500/20">
                      {truncateAddress(walletAddress)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-300">
                  Connect your wallet to get started with personalized security insights
                </p>
              )}
            </div>

            {/* Time and Status */}
            <div className="flex flex-col items-end">
              <div className="text-neutral-400 text-sm mb-1" suppressHydrationWarning>
                {isClient ? `${currentDate} • ${currentTime}` : ""}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-sm px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">
                  System Online
                </span>
              </div>
            </div>
          </div>

          {/* AI Tools Preview */}
          <div className="mt-6 pt-6 border-t border-neutral-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Your AI Security Suite
                </h3>
                <p className="text-neutral-400 text-sm">
                  Four powerful tools working together to keep you safe
                </p>
              </div>

              <div className="flex flex-row items-center">
                <AnimatedTooltip items={teamMembers} />
                <div className="ml-4 text-right">
                  <div className="text-green-400 text-sm font-semibold px-3 py-1 bg-green-500/10 rounded-md border border-green-500/20">
                    All Systems Active
                  </div>
                  <div className="text-neutral-500 text-xs mt-1">Ready to protect you</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 transition-all duration-200"
            >
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-xs text-neutral-400">Protection</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200"
            >
              <div className="text-2xl font-bold text-blue-400 mb-1">90%</div>
              <div className="text-xs text-neutral-400">Accuracy</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-200"
            >
              <div className="text-2xl font-bold text-green-400 mb-1">&lt;3s</div>
              <div className="text-xs text-neutral-400">Scan Time</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
            >
              <div className="text-2xl font-bold text-purple-400 mb-1">$3.8B</div>
              <div className="text-xs text-neutral-400">Protected</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
