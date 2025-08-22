"use client";
import { CardSpotlight } from "./ui/card-spotlight";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface WalletHealthProps {
  walletAddress?: string;
}

export function WalletHealthWidget({ walletAddress }: WalletHealthProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  // Mock data - replace with real data from your API
  const healthData = {
    overallScore: 85,
    riskLevel: "Low",
    riskColor: "text-green-400",
    threats: 0,
    lastScan: "2 hours ago",
    totalTransactions: 247,
    suspiciousTransactions: 2
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-900/20 border-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-900/20 border-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-red-900/20 border-red-500/20 text-red-400';
      default: return 'bg-gray-900/20 border-gray-500/20 text-gray-400';
    }
  };

  if (!walletAddress) {
    return (
      <CardContainer className="inter-var h-64 w-full">
        <CardBody className="bg-black/80 relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.1] border-white/[0.1] w-full h-full rounded-xl border backdrop-blur-sm">
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center p-6">
            <CardItem translateZ="50" className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </CardItem>
            <CardItem translateZ="60" as="h3" className="text-xl font-bold text-white mb-2">Connect Your Wallet</CardItem>
            <CardItem translateZ="40" as="p" className="text-neutral-400 text-sm mb-6">
              Connect your wallet to see your security health score
            </CardItem>
          
            {/* Enhanced Connect Button */}
            <CardItem translateZ="80" className="w-full max-w-xs">
              <button 
                onClick={() => {
                  // This would trigger the wallet connection
                  console.log("Connect wallet clicked");
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Connect Wallet</span>
              </button>
              
              {/* Supported Wallets */}
              <div className="mt-4 flex items-center justify-center space-x-3">
                <div className="text-xs text-neutral-500">Supports:</div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                    <span className="text-orange-400 text-xs font-bold">M</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-400 text-xs font-bold">T</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-purple-400 text-xs font-bold">W</span>
                  </div>
                </div>
              </div>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    );
  }

  return (
    <CardContainer className="inter-var h-96 w-full">
      <CardBody className="bg-black/80 relative group/card hover:shadow-2xl hover:shadow-green-500/[0.1] border-white/[0.1] w-full h-full rounded-xl p-6 border backdrop-blur-sm">
        <div className="relative z-20 h-full">
        
        {/* Header */}
        <CardItem translateZ="50" className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Wallet Health</h3>
          <div className={`px-3 py-1 rounded-full border ${getRiskBadgeColor(healthData.riskLevel)}`}>
            <span className="text-sm font-medium">{healthData.riskLevel} Risk</span>
          </div>
        </CardItem>

        {/* Health Score Circle */}
        <CardItem translateZ="80" className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-gray-700"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Health score arc */}
              <path
                className="text-green-400"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${healthData.overallScore}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{healthData.overallScore}</div>
                <div className="text-xs text-neutral-400">Health Score</div>
              </div>
            </div>
          </div>
        </CardItem>

        {/* Stats Grid */}
        <CardItem translateZ="60" className="grid grid-cols-2 gap-4">
          <motion.div 
            className="bg-neutral-900/70 rounded-lg p-4 border border-neutral-700/50 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-white">{healthData.threats}</div>
            <div className="text-xs text-neutral-400">Active Threats</div>
          </motion.div>
          
          <motion.div 
            className="bg-neutral-900/70 rounded-lg p-4 border border-neutral-700/50 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-white">{healthData.totalTransactions}</div>
            <div className="text-xs text-neutral-400">Total Transactions</div>
          </motion.div>
          
          <motion.div 
            className="bg-neutral-900/70 rounded-lg p-4 border border-neutral-700/50 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-yellow-400">{healthData.suspiciousTransactions}</div>
            <div className="text-xs text-neutral-400">Flagged Items</div>
          </motion.div>
          
          <motion.div 
            className="bg-neutral-900/70 rounded-lg p-4 border border-neutral-700/50 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm font-bold text-green-400">✓ Secure</div>
            <div className="text-xs text-neutral-400" suppressHydrationWarning>
              Last Scan: {isClient ? healthData.lastScan : "Loading..."}
            </div>
          </motion.div>
        </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
