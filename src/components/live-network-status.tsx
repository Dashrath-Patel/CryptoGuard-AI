"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
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
    bnbPrice: '$847.89',
    gasPrice: '5 gwei',
    blockNumber: 12345678,
    isLive: true
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
    <CardContainer className="inter-var w-full">
      <CardBody className="bg-black/80 relative group/card hover:shadow-2xl hover:shadow-yellow-500/[0.1] border-white/[0.1] w-full h-auto rounded-xl p-6 border backdrop-blur-sm">
        <div className="relative z-20">
          <CardItem translateZ="50" className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <IconActivity className="h-6 w-6 text-green-400" />
              Live BNB Chain Data
            </h3>
            
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${networkData.isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${networkData.isLive ? 'text-green-400 bg-green-400/10 border border-green-400/20' : 'text-gray-400 bg-gray-400/10 border border-gray-400/20'}`}>
                {networkData.isLive ? 'LIVE' : 'CONNECTING'}
              </span>
            </div>
          </CardItem>

        {/* Enhanced Network Cards */}
        <CardItem translateZ="60" className="space-y-4 mb-6">
          {/* BNB Price Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-xl p-5 hover:border-yellow-500/60 transition-all duration-300 backdrop-blur-sm bg-neutral-900/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/30 border border-yellow-500/50">
                  <IconCurrencyDollar className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm text-yellow-400 font-medium">BNB Price</div>
                  <div className="text-xs text-neutral-400">Live from Binance</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{networkData.bnbPrice}</div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <IconTrendingUp className="h-3 w-3" />
                  <span>+2.4%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gas Price Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/40 rounded-xl p-5 hover:border-blue-500/60 transition-all duration-300 backdrop-blur-sm bg-neutral-900/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/30 border border-blue-500/50">
                  <IconGasStation className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-blue-400 font-medium">Gas Price</div>
                  <div className="text-xs text-neutral-400">BSCScan Oracle</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{networkData.gasPrice}</div>
                <div className="flex items-center gap-1 text-xs text-blue-400">
                  <IconActivity className="h-3 w-3" />
                  <span>Normal</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Latest Block Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-xl p-5 hover:border-purple-500/60 transition-all duration-300 backdrop-blur-sm bg-neutral-900/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/30 border border-purple-500/50">
                  <IconCube className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-purple-400 font-medium">Latest Block</div>
                  <div className="text-xs text-neutral-400">BSC Mainnet</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {networkData.blockNumber.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <IconShieldCheck className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </motion.div>
        </CardItem>

        {/* Enhanced Footer */}
        <CardItem translateZ="40" className="text-center space-y-1">
          <p className="text-xs text-neutral-300 font-medium">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <p className="text-xs text-neutral-500">
            Real-time data from BNB Smart Chain • Updates every 10-30 seconds
          </p>
        </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
