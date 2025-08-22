"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useWallet } from "@/contexts/WalletContext";
import { 
  IconAlertTriangle, 
  IconCircleCheck, 
  IconClock,
  IconActivity,
  IconWallet
} from "@tabler/icons-react";

interface MonitoredTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'confirmed' | 'failed';
}

export function TransactionMonitor() {
  const { isConnected, walletAddress } = useWallet();
  const [transactions, setTransactions] = useState<MonitoredTransaction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // Auto-start monitoring when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      setIsMonitoring(true);
    } else {
      setIsMonitoring(false);
      setTransactions([]);
      setAlertCount(0);
    }
  }, [isConnected, walletAddress]);

  useEffect(() => {
    if (walletAddress && isMonitoring) {
      const fetchRealTransactions = async () => {
        try {
          const response = await fetch(`/api/market-guardian/data?wallet=${walletAddress}`);
          const data = await response.json();
          
          // Check for API errors
          if (data.userWallet && data.userWallet.error) {
            setApiError(data.userWallet.error);
            setTransactions([]);
            setAlertCount(0);
            return;
          } else {
            setApiError(null);
          }
          
          // Get user transactions from the correct data structure
          if (data.userWallet && data.userWallet.recentTransactions && data.userWallet.recentTransactions.length > 0) {
            const userTransactions = data.userWallet.recentTransactions
              .map((tx: any) => ({
                hash: tx.hash,
                from: tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'Your Wallet' : tx.from,
                to: tx.to.toLowerCase() === walletAddress.toLowerCase() ? 'Your Wallet' : tx.to,
                value: `${tx.value.toFixed(6)} BNB`,
                timestamp: new Date(tx.timestamp),
                riskLevel: tx.valueUSD > 50000 ? 'high' : tx.valueUSD > 10000 ? 'medium' : 'low',
                status: tx.status === 'success' ? 'confirmed' as const : 'failed' as const
              }));

            if (userTransactions.length > 0) {
              setTransactions(userTransactions);
              const highRiskCount = userTransactions.filter((tx: any) => tx.riskLevel === 'high').length;
              setAlertCount(highRiskCount);
            }
          } else {
            // No transactions found - clear the list
            setTransactions([]);
            setAlertCount(0);
          }
        } catch (error) {
          console.error('Error fetching real transactions:', error);
          setTransactions([]);
          setAlertCount(0);
        }
      };

      // Fetch immediately
      fetchRealTransactions();
      
      // Then fetch every 15 seconds for real-time updates
      const interval = setInterval(fetchRealTransactions, 15000);

      return () => clearInterval(interval);
    }
  }, [walletAddress, isMonitoring]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      setAlertCount(0);
      setTransactions([]); // Clear any existing transactions when starting
    } else {
      // Clear transactions when stopping monitoring
      setTransactions([]);
      setAlertCount(0);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/10 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/20';
      default: return 'bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <CardSpotlight className="h-full">
      <div className="relative z-20 h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <IconActivity className="h-6 w-6 text-blue-400" />
            Transaction Monitor
          </h2>
          
          <div className="flex items-center gap-4">
            {alertCount > 0 && (
              <div className="flex items-center gap-2 text-red-400">
                <IconAlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">{alertCount} alerts</span>
              </div>
            )}
            
            <button
              onClick={toggleMonitoring}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isMonitoring 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isMonitoring ? 'Stop Monitor' : 'Start Monitor'}
            </button>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center text-neutral-400 py-8">
            <IconWallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Connect your wallet to start transaction monitoring</p>
            <p className="text-xs text-neutral-500 mt-2">Real-time analysis of your wallet transactions</p>
          </div>
        ) : !isMonitoring ? (
          <div className="text-center text-neutral-400 py-8">
            <IconClock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Connect a wallet to start transaction monitoring</p>
          </div>
        ) : !isMonitoring ? (
          <div className="text-center text-neutral-400 py-8">
            <IconActivity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Start Monitor" to begin real-time transaction analysis</p>
          </div>
        ) : apiError ? (
          <div className="text-center text-orange-400 py-8">
            <IconAlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <p className="text-sm mb-2">Demo Mode Active</p>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">{apiError}</p>
            <div className="mt-4 text-xs text-neutral-500">
              <p>🔗 Get your free BSC API key:</p>
              <p>1. Visit https://bscscan.com/apis</p>
              <p>2. Create account & get API key</p>
              <p>3. Add BSCSCAN_API_KEY to .env.local file</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-400 mb-4">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Monitoring active for {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center text-neutral-400 py-8">
                <IconClock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Waiting for transactions...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map((tx, index) => (
                  <motion.div
                    key={tx.hash}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg border ${getRiskBg(tx.riskLevel)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono text-blue-400">{tx.hash}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getRiskColor(tx.riskLevel)} bg-opacity-20`}>
                          {tx.riskLevel} risk
                        </span>
                        {tx.status === 'pending' && (
                          <IconClock className="h-3 w-3 text-yellow-400" />
                        )}
                        {tx.status === 'confirmed' && (
                          <IconCircleCheck className="h-3 w-3 text-green-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-neutral-400 space-y-1">
                      <div>From: {tx.from === walletAddress ? 'Your Wallet' : `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}</div>
                      <div>To: {tx.to === walletAddress ? 'Your Wallet' : `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}</div>
                      <div className="flex items-center justify-between">
                        <span>Value: {tx.value}</span>
                        <span>{tx.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {tx.riskLevel === 'high' && (
                      <div className="mt-2 text-xs text-red-400 bg-red-500/10 rounded p-2">
                        ⚠️ High-risk transaction detected - Review carefully
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CardSpotlight>
  );
}
