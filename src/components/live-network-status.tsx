"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { RealTimeBNBMonitor } from "@/lib/realtime-bnb-monitor";
import { 
  IconCurrencyDollar, 
  IconGasStation, 
  IconCube,
  IconActivity,
  IconTrendingUp,
  IconShieldCheck
} from "@tabler/icons-react";

interface LiveNetworkData {
  bnbPrice: string;
  gasPrice: string;
  blockNumber: number;
  isLive: boolean;
}

export function LiveNetworkStatus() {
  const [networkData, setNetworkData] = useState<LiveNetworkData>({
    bnbPrice: '$300.50',
    gasPrice: '5 gwei',
    blockNumber: 45000000,
    isLive: false
  });

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const monitor = RealTimeBNBMonitor.getInstance();
    const unsubscribers: (() => void)[] = [];

    // Subscribe to live BNB price
    const unsubBNBPrice = monitor.subscribeToBNBPrice((price: string) => {
      setNetworkData(prev => ({ ...prev, bnbPrice: price, isLive: true }));
      setLastUpdated(new Date());
    });
    unsubscribers.push(unsubBNBPrice);

    // Subscribe to live gas prices
    const unsubGasPrice = monitor.subscribeToGasPrice((gasPrice: string) => {
      setNetworkData(prev => ({ ...prev, gasPrice, isLive: true }));
      setLastUpdated(new Date());
    });
    unsubscribers.push(unsubGasPrice);

    // Subscribe to live blocks
    const unsubBlocks = monitor.subscribeToBlocks((blockNumber: number) => {
      setNetworkData(prev => ({ ...prev, blockNumber, isLive: true }));
      setLastUpdated(new Date());
    });
    unsubscribers.push(unsubBlocks);

    // Cleanup subscriptions
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return (
    <CardSpotlight className="w-full">
      <div className="relative z-20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <IconActivity className="h-6 w-6 text-green-400" />
            Live BNB Chain Data
          </h3>
          
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${networkData.isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`text-xs ${networkData.isLive ? 'text-green-400' : 'text-gray-400'}`}>
              {networkData.isLive ? 'LIVE' : 'CONNECTING'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* BNB Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <IconCurrencyDollar className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-yellow-400">BNB Price</span>
            </div>
            <div className="text-2xl font-bold text-white">{networkData.bnbPrice}</div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <IconTrendingUp className="h-3 w-3" />
              <span>Live from Binance</span>
            </div>
          </motion.div>

          {/* Gas Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <IconGasStation className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-blue-400">Gas Price</span>
            </div>
            <div className="text-2xl font-bold text-white">{networkData.gasPrice}</div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <IconActivity className="h-3 w-3" />
              <span>BSCScan Oracle</span>
            </div>
          </motion.div>

          {/* Latest Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <IconCube className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-purple-400">Latest Block</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {networkData.blockNumber.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <IconShieldCheck className="h-3 w-3" />
              <span>BSC Mainnet</span>
            </div>
          </motion.div>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-xs text-neutral-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time data from BNB Smart Chain • Updates every 10-30 seconds
          </p>
        </div>
      </div>
    </CardSpotlight>
  );
}
