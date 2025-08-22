"use client";
import { CardSpotlight } from "./ui/card-spotlight";
import { Meteors } from "./ui/meteors";
import { motion } from "motion/react";

interface WalletHealthProps {
  walletAddress?: string;
}

export function WalletHealthWidget({ walletAddress }: WalletHealthProps) {
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
      <CardSpotlight className="h-64 w-full">
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center p-6">
          <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-neutral-400 text-sm">
            Connect your wallet to see your security health score
          </p>
        </div>
      </CardSpotlight>
    );
  }

  return (
    <CardSpotlight className="h-96 w-full">
      <div className="relative z-20 h-full p-6">
        <Meteors number={20} />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Wallet Health</h3>
          <div className={`px-3 py-1 rounded-full border ${getRiskBadgeColor(healthData.riskLevel)}`}>
            <span className="text-sm font-medium">{healthData.riskLevel} Risk</span>
          </div>
        </div>

        {/* Health Score Circle */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-gray-800"
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
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-white">{healthData.threats}</div>
            <div className="text-xs text-neutral-400">Active Threats</div>
          </motion.div>
          
          <motion.div 
            className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-white">{healthData.totalTransactions}</div>
            <div className="text-xs text-neutral-400">Total Transactions</div>
          </motion.div>
          
          <motion.div 
            className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-yellow-400">{healthData.suspiciousTransactions}</div>
            <div className="text-xs text-neutral-400">Flagged Items</div>
          </motion.div>
          
          <motion.div 
            className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm font-bold text-green-400">✓ Secure</div>
            <div className="text-xs text-neutral-400">Last Scan: {healthData.lastScan}</div>
          </motion.div>
        </div>
      </div>
    </CardSpotlight>
  );
}
