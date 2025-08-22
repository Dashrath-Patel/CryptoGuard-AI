"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { 
  IconChartBar, 
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconWheel,
  IconEye,
  IconShield,
  IconClock
} from "@tabler/icons-react";

interface WhaleTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  token: string;
  timestamp: number;
  usdValue: number;
  type: 'buy' | 'sell' | 'transfer';
}

interface MarketAlert {
  id: string;
  type: 'pump' | 'dump' | 'whale_activity' | 'unusual_volume' | 'new_listing';
  severity: 'low' | 'medium' | 'high';
  token: string;
  message: string;
  timestamp: number;
  details: any;
}

interface MarketData {
  token: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  whaleActivity: number;
  suspiciousScore: number;
}

export default function MarketGuardianPage() {
  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [topTokens, setTopTokens] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'alerts' | 'whales' | 'analysis'>('alerts');

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market-guardian/data');
      const data = await response.json();
      
      setWhaleTransactions(data.whaleTransactions || []);
      setAlerts(data.alerts || []);
      setTopTokens(data.topTokens || []);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'pump': return <IconTrendingUp className="h-4 w-4 text-green-400" />;
      case 'dump': return <IconTrendingDown className="h-4 w-4 text-red-400" />;
      case 'whale_activity': return <IconWheel className="h-4 w-4 text-blue-400" />;
      case 'unusual_volume': return <IconChartBar className="h-4 w-4 text-purple-400" />;
      case 'new_listing': return <IconEye className="h-4 w-4 text-yellow-400" />;
      default: return <IconAlertTriangle className="h-4 w-4 text-neutral-400" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent mb-4">
            BNB Chain Market Guardian
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Real-time monitoring of whale movements, pump & dump schemes, and market manipulation on BSC.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <CardSpotlight className="p-6">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-red-400">{alerts.length}</div>
                <div className="text-sm text-neutral-400">Active Alerts</div>
              </div>
            </div>
          </CardSpotlight>

          <CardSpotlight className="p-6">
            <div className="flex items-center gap-3">
              <IconWheel className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">{whaleTransactions.length}</div>
                <div className="text-sm text-neutral-400">Whale Moves (24h)</div>
              </div>
            </div>
          </CardSpotlight>

          <CardSpotlight className="p-6">
            <div className="flex items-center gap-3">
              <IconEye className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">{topTokens.length}</div>
                <div className="text-sm text-neutral-400">Monitored Tokens</div>
              </div>
            </div>
          </CardSpotlight>

          <CardSpotlight className="p-6">
            <div className="flex items-center gap-3">
              <IconShield className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {alerts.filter(a => a.severity === 'high').length}
                </div>
                <div className="text-sm text-neutral-400">High Risk</div>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-8"
        >
          {[
            { id: 'alerts', label: 'Market Alerts', icon: IconAlertTriangle },
            { id: 'whales', label: 'Whale Tracker', icon: IconWheel },
            { id: 'analysis', label: 'Risk Analysis', icon: IconChartBar }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
                selectedTab === id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {selectedTab === 'alerts' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">🚨 Live Market Alerts</h2>
              {alerts.length === 0 ? (
                <CardSpotlight className="p-8 text-center">
                  <IconShield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">All Clear!</h3>
                  <p className="text-neutral-400">No suspicious activity detected in the last 24 hours.</p>
                </CardSpotlight>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <CardSpotlight key={alert.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold">{alert.token}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                              <IconClock className="h-3 w-3" />
                              {timeAgo(alert.timestamp)}
                            </span>
                          </div>
                          <p className="text-neutral-300">{alert.message}</p>
                        </div>
                      </div>
                    </CardSpotlight>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'whales' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">🐋 Whale Movement Tracker</h2>
              {whaleTransactions.length === 0 ? (
                <CardSpotlight className="p-8 text-center">
                  <IconWheel className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Calm Waters</h3>
                  <p className="text-neutral-400">No significant whale activity detected recently.</p>
                </CardSpotlight>
              ) : (
                <div className="space-y-4">
                  {whaleTransactions.map((tx) => (
                    <CardSpotlight key={tx.hash} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            tx.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                            tx.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {tx.type === 'buy' ? <IconTrendingUp className="h-4 w-4" /> :
                             tx.type === 'sell' ? <IconTrendingDown className="h-4 w-4" /> :
                             <IconEye className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-bold">{tx.token}</div>
                            <div className="text-sm text-neutral-400">
                              {formatAddress(tx.from)} → {formatAddress(tx.to)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatNumber(tx.usdValue)}</div>
                          <div className="text-sm text-neutral-400">{timeAgo(tx.timestamp)}</div>
                        </div>
                      </div>
                    </CardSpotlight>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'analysis' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">📊 Risk Analysis Dashboard</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {topTokens.map((token) => (
                  <CardSpotlight key={token.token} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{token.token}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs border ${
                          token.suspiciousScore > 70 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          token.suspiciousScore > 40 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                          'bg-green-500/10 border-green-500/20 text-green-400'
                        }`}>
                          Risk: {token.suspiciousScore > 70 ? 'High' : token.suspiciousScore > 40 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-neutral-400">Price</div>
                          <div className="font-bold">{formatNumber(token.price)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-400">24h Change</div>
                          <div className={`font-bold ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-400">Volume</div>
                          <div className="font-bold">{formatNumber(token.volume24h)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-400">Whale Activity</div>
                          <div className="font-bold">{token.whaleActivity}</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            token.suspiciousScore > 70 ? 'bg-red-500' :
                            token.suspiciousScore > 40 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${token.suspiciousScore}%` }}
                        />
                      </div>
                    </div>
                  </CardSpotlight>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
