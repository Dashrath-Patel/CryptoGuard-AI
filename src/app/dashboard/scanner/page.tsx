"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { TransactionMonitor } from "@/components/transaction-monitor";
import { SecurityRecommendations } from "@/components/security-recommendations";
import { 
  IconShieldCheck, 
  IconScan, 
  IconWallet, 
  IconFileSearch,
  IconAlertTriangle,
  IconCircleCheck,
  IconX
} from "@tabler/icons-react";

interface ScanResult {
  address: string;
  riskScore: number;
  status: 'safe' | 'warning' | 'danger';
  threats: string[];
  recommendations: string[];
  lastScanned: Date;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function SecurityScannerPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'wallet' | 'contract' | 'transaction'>('wallet');

  useEffect(() => {
    // Load connected wallet address
    const address = localStorage.getItem("walletAddress");
    if (address) {
      setWalletAddress(address);
    }
  }, []);

  const performWalletScan = async () => {
    if (!walletAddress) return;

    setIsScanning(true);
    try {
      const response = await fetch('/api/scanner/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze wallet');
      }

      const result = await response.json();
      setScanResults(result);

      // Mock recent transactions for demo
      const mockTransactions: Transaction[] = [
        {
          hash: "0x1234...5678",
          from: walletAddress,
          to: "0xabcd...efgh",
          value: "0.5 BNB",
          timestamp: new Date(Date.now() - 3600000),
          riskLevel: 'low'
        },
        {
          hash: "0x9876...5432",
          from: "0xdef0...1234",
          to: walletAddress,
          value: "100 USDT",
          timestamp: new Date(Date.now() - 7200000),
          riskLevel: 'low'
        }
      ];

      setRecentTransactions(mockTransactions);
    } catch (error) {
      console.error("Scan failed:", error);
      // Handle error state
    } finally {
      setIsScanning(false);
    }
  };

  const performContractScan = async () => {
    if (!contractAddress) return;

    setIsScanning(true);
    try {
      const response = await fetch('/api/scanner/contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: contractAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze contract');
      }

      const result = await response.json();
      setScanResults(result);
    } catch (error) {
      console.error("Contract scan failed:", error);
      // Handle error state
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score <= 30) return 'bg-green-500/10';
    if (score <= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <IconShieldCheck className="h-10 w-10 text-green-400" />
            BNB Chain AI Security Scanner
          </h1>
          <p className="text-neutral-400 text-lg">
            Analyze wallets, transactions, and BEP-20 smart contracts on Binance Smart Chain for security threats
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
              <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-400">BNB Chain (BSC) Network</span>
            </div>
            <div className="text-neutral-500">Chain ID: 56</div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex border-b border-neutral-800">
            {[
              { id: 'wallet', label: 'BNB Wallet Analysis', icon: IconWallet },
              { id: 'contract', label: 'BEP-20 Contract Audit', icon: IconFileSearch },
              { id: 'transaction', label: 'BSC Transaction Monitor', icon: IconScan }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-green-400 border-b-2 border-green-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scan Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardSpotlight className="h-full">
              <div className="relative z-20 h-full p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {activeTab === 'wallet' && 'BNB Wallet Security Analysis'}
                  {activeTab === 'contract' && 'BEP-20 Smart Contract Audit'}
                  {activeTab === 'transaction' && 'BSC Transaction Monitoring'}
                </h2>

                {activeTab === 'wallet' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        BNB Chain Wallet Address
                      </label>
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="0x... (BSC Address)"
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-400"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Enter a Binance Smart Chain (BEP-20) wallet address
                      </p>
                    </div>
                    <button
                      onClick={performWalletScan}
                      disabled={!walletAddress || isScanning}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Analyzing BNB Wallet...
                        </>
                      ) : (
                        <>
                          <IconScan className="h-4 w-4" />
                          Scan BNB Wallet
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeTab === 'contract' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        BEP-20 Contract Address
                      </label>
                      <input
                        type="text"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        placeholder="0x... (BEP-20 Contract)"
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Enter a BEP-20 token contract address on BSC
                      </p>
                    </div>
                    <button
                      onClick={performContractScan}
                      disabled={!contractAddress || isScanning}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Auditing BEP-20 Contract...
                        </>
                      ) : (
                        <>
                          <IconFileSearch className="h-4 w-4" />
                          Audit BEP-20 Contract
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeTab === 'transaction' && (
                  <TransactionMonitor walletAddress={walletAddress} />
                )}
              </div>
            </CardSpotlight>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CardSpotlight className="h-full">
              <div className="relative z-20 h-full p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Scan Results</h2>

                {scanResults ? (
                  <div className="space-y-6">
                    {/* Risk Score */}
                    <div className={`p-4 rounded-lg ${getRiskBgColor(scanResults.riskScore)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">Risk Score</span>
                        <span className={`text-2xl font-bold ${getRiskColor(scanResults.riskScore)}`}>
                          {scanResults.riskScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            scanResults.riskScore <= 30 ? 'bg-green-400' :
                            scanResults.riskScore <= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${scanResults.riskScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      {scanResults.status === 'safe' && (
                        <IconCircleCheck className="h-6 w-6 text-green-400" />
                      )}
                      {scanResults.status === 'warning' && (
                        <IconAlertTriangle className="h-6 w-6 text-yellow-400" />
                      )}
                      {scanResults.status === 'danger' && (
                        <IconX className="h-6 w-6 text-red-400" />
                      )}
                      <span className="text-lg font-medium text-white capitalize">
                        {scanResults.status}
                      </span>
                    </div>

                    {/* Threats */}
                    {scanResults.threats.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Detected Threats</h3>
                        <div className="space-y-2">
                          {scanResults.threats.map((threat, index) => (
                            <div key={index} className="flex items-center gap-2 text-red-400">
                              <IconAlertTriangle className="h-4 w-4" />
                              <span className="text-sm">{threat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Recommendations</h3>
                      <div className="space-y-2">
                        {scanResults.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center gap-2 text-green-400">
                            <IconCircleCheck className="h-4 w-4" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    {recentTransactions.length > 0 && activeTab === 'wallet' && (
                      <div>
                        <h3 className="text-lg font-medium text-white mb-3">Recent Transactions</h3>
                        <div className="space-y-2">
                          {recentTransactions.map((tx, index) => (
                            <div key={index} className="bg-neutral-900 rounded p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-mono text-blue-400">{tx.hash}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  tx.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                                  tx.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {tx.riskLevel} risk
                                </span>
                              </div>
                              <div className="text-sm text-neutral-400">
                                {tx.value} • {tx.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                    <IconShieldCheck className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg mb-2">No Scan Results</p>
                    <p className="text-sm text-center">
                      Enter an address and click scan to analyze for security threats
                    </p>
                  </div>
                )}
              </div>
            </CardSpotlight>
          </motion.div>
        </div>

        {/* Additional Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SecurityRecommendations />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <TransactionMonitor walletAddress={walletAddress} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
