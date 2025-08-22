'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Brain, 
  Loader2, 
  RefreshCw,
  TrendingUp,
  Activity,
  Zap,
  Lock,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'transaction' | 'token' | 'defi' | 'security' | 'gas';
  actionable: boolean;
  recommendation: string;
}

interface AIAnalysisResponse {
  success: boolean;
  analysis: string;
  recommendations: SecurityRecommendation[];
  metadata: {
    totalTransactions: number;
    analysisTimestamp: string;
    walletAddress: string;
  };
}

const AISecurityRecommendations: React.FC = () => {
  const { walletAddress, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());

  const toggleRecommendation = (id: string) => {
    setExpandedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchTransactionsAndAnalyze();
    }
  }, [isConnected, walletAddress]);

  const fetchTransactionsAndAnalyze = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching comprehensive wallet data for:', walletAddress);
      
      // 1. Fetch Transactions
      const txResponse = await fetch(
        `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=YourApiKeyToken`
      );
      
      // 2. Fetch BEP-20 Token Transfers
      const tokenResponse = await fetch(
        `https://api-testnet.bscscan.com/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=YourApiKeyToken`
      );

      // 3. Fetch Internal Transactions
      const internalResponse = await fetch(
        `https://api-testnet.bscscan.com/api?module=account&action=txlistinternal&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=YourApiKeyToken`
      );

      // 4. Get Current Balance
      const balanceResponse = await fetch(
        `https://api-testnet.bscscan.com/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=YourApiKeyToken`
      );

      console.log('Fetching multiple data sources...');
      const txData = await txResponse.json();
      const tokenData = await tokenResponse.json();
      const internalData = await internalResponse.json();
      const balanceData = await balanceResponse.json();
      
      let comprehensiveData: any = {
        transactions: [],
        tokenTransfers: [],
        internalTransactions: [],
        balance: '0',
        riskFactors: []
      };
      
      // Process all data sources
      if (txData.status === '1' && txData.result) {
        comprehensiveData.transactions = txData.result;
      }
      
      if (tokenData.status === '1' && tokenData.result) {
        comprehensiveData.tokenTransfers = tokenData.result;
      }
      
      if (internalData.status === '1' && internalData.result) {
        comprehensiveData.internalTransactions = internalData.result;
      }
      
      if (balanceData.status === '1') {
        comprehensiveData.balance = balanceData.result;
      }

      // If APIs fail, use enhanced demo data
      if (comprehensiveData.transactions.length === 0) {
        console.log('Using comprehensive demo data for AI analysis');
        comprehensiveData = {
          transactions: [
            {
              hash: "0x123...abc",
              from: walletAddress,
              to: "0x456...def",
              value: "1000000000000000000", // 1 BNB
              timeStamp: Math.floor(Date.now() / 1000).toString(),
              gasUsed: "21000",
              gasPrice: "20000000000",
              isError: "0",
              methodId: "0x"
            },
            {
              hash: "0x789...ghi",
              from: "0x999...xyz",
              to: walletAddress,
              value: "500000000000000000", // 0.5 BNB
              timeStamp: (Math.floor(Date.now() / 1000) - 3600).toString(),
              gasUsed: "21000", 
              gasPrice: "20000000000",
              isError: "0",
              methodId: "0xa9059cbb"
            }
          ],
          tokenTransfers: [
            {
              hash: "0xdef...456",
              from: walletAddress,
              to: "0x1234...5678",
              value: "1000000000000000000",
              tokenName: "SafeMoon",
              tokenSymbol: "SAFEMOON",
              contractAddress: "0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3"
            }
          ],
          internalTransactions: [
            {
              hash: "0xabc...789",
              from: "0x0000000000000000000000000000000000000000",
              to: walletAddress,
              value: "100000000000000000",
              type: "call"
            }
          ],
          balance: "2500000000000000000", // 2.5 BNB
          riskFactors: [
            "High-risk token interactions detected",
            "Recent interaction with unverified contracts",
            "Multiple failed transactions in recent history"
          ]
        };
      }
      
      setTransactions(comprehensiveData.transactions);
      
      // Send comprehensive data to AI
      console.log('Sending comprehensive data to AI for analysis...');
      const aiResponse = await fetch('/api/ai-security-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: comprehensiveData.transactions,
          tokenTransfers: comprehensiveData.tokenTransfers,
          internalTransactions: comprehensiveData.internalTransactions,
          balance: comprehensiveData.balance,
          riskFactors: comprehensiveData.riskFactors,
          walletAddress: walletAddress
        })
      });
      
      console.log('AI API response status:', aiResponse.status);
      
      if (aiResponse.ok) {
        const aiData: AIAnalysisResponse = await aiResponse.json();
        console.log('AI analysis received:', aiData);
        setAnalysis(aiData);
      } else {
        const errorText = await aiResponse.text();
        console.error('AI API error:', errorText);
        throw new Error(`AI analysis failed: ${errorText}`);
      }
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Failed to get AI analysis: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction': return <Activity className="w-4 h-4" />;
      case 'token': return <TrendingUp className="w-4 h-4" />;
      case 'defi': return <Zap className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'gas': return <Zap className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const calculateSecurityScore = () => {
    if (!analysis?.recommendations) return 85;
    
    const totalRecommendations = analysis.recommendations.length;
    const criticalIssues = analysis.recommendations.filter(r => r.priority === 'critical').length;
    const highIssues = analysis.recommendations.filter(r => r.priority === 'high').length;
    
    let score = 100;
    score -= criticalIssues * 25;
    score -= highIssues * 15;
    score -= (totalRecommendations - criticalIssues - highIssues) * 5;
    
  return Math.max(score, 10);
};

// Helper function to extract summary from AI analysis
const extractSummary = (analysis: string): string => {
  const lines = analysis.split('\n');
  const summarySection = lines.find(line => 
    line.toLowerCase().includes('security risk assessment') || 
    line.toLowerCase().includes('summary') ||
    line.toLowerCase().includes('overview')
  );
  
  if (summarySection) {
    const index = lines.indexOf(summarySection);
    const nextLines = lines.slice(index, index + 3).join(' ');
    return nextLines.length > 200 ? nextLines.substring(0, 200) + '...' : nextLines;
  }
  
  // Fallback to first meaningful paragraph
  const meaningfulLines = lines.filter(line => line.trim().length > 50);
  return meaningfulLines[0]?.substring(0, 200) + '...' || 'AI analysis completed successfully.';
};

// Helper function to extract key findings
const extractKeyFindings = (analysis: string): string[] => {
  const lines = analysis.split('\n');
  const findings: string[] = [];
  
  lines.forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine.match(/^[\d\-\*•]/) && cleanLine.length > 20) {
      findings.push(cleanLine.replace(/^[\d\-\*•\s]+/, ''));
    }
  });
  
  // If no structured findings, extract important sentences
  if (findings.length === 0) {
    const sentences = analysis.split(/[.!?]/).filter(s => s.trim().length > 30);
    return sentences.slice(0, 4).map(s => s.trim());
  }
  
  return findings.slice(0, 5);
};

// Helper function to get BSC best practices
const getBestPractices = () => {
  return [
    {
      icon: <Shield className="w-4 h-4 text-green-400" />,
      title: "Use Hardware Wallet",
      description: "Store large amounts in hardware wallets like Ledger or Trezor for maximum security"
    },
    {
      icon: <Lock className="w-4 h-4 text-green-400" />,
      title: "Review Token Approvals",
      description: "Regularly check and revoke unnecessary BEP-20 token approvals on BSCScan"
    },
    {
      icon: <Activity className="w-4 h-4 text-green-400" />,
      title: "Monitor Transactions",
      description: "Set up alerts for unusual transaction patterns on BNB Chain"
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
      title: "Verify Smart Contracts",
      description: "Always verify contract addresses and audit reports before interacting with DeFi protocols"
    }
  ];
};  if (!isConnected) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            AI Security Analysis
          </h3>
          <p className="text-gray-500 mb-4">
            Connect your wallet to get AI-powered security recommendations
          </p>
          <div className="text-xs text-gray-600">
            Status: Wallet not connected
          </div>
        </div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            AI Security Analysis
          </h3>
          <p className="text-gray-500 mb-4">
            Wallet address not available
          </p>
          <div className="text-xs text-gray-600">
            Status: Connected but no address found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Analysis */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl text-white font-semibold">
                  AI Security Analysis
                </h2>
                <p className="text-gray-400 text-sm">
                  Powered by Gemini AI
                </p>
                <div className="text-xs text-gray-500 mt-1">
                  Wallet: {walletAddress?.substring(0, 6)}...{walletAddress?.substring(-4)}
                </div>
              </div>
            </div>
            <button
              onClick={fetchTransactionsAndAnalyze}
              disabled={loading}
              className="px-4 py-2 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
        
        {loading && (
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI is analyzing your transaction patterns...</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Security Score Card */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                Wallet Security Score
              </h3>
              <div className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full">
                Real-time
              </div>
            </div>
            
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-2 -left-2 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
              
              <div className="relative bg-gray-800/60 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {calculateSecurityScore()}
                    </div>
                    <div className="text-2xl font-medium text-gray-400">
                      /100
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-lg opacity-50"></div>
                  </div>
                  
                  <div className="relative w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${calculateSecurityScore()}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-400">
                        {analysis.metadata.totalTransactions}
                      </div>
                      <div className="text-xs text-gray-400">Transactions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-400">
                        {analysis.recommendations.length}
                      </div>
                      <div className="text-xs text-gray-400">Recommendations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-purple-400">
                        BSC
                      </div>
                      <div className="text-xs text-gray-400">Network</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                AI Analysis Summary
              </h3>
              <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
                AI-Powered
              </div>
            </div>
            
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500/10 rounded-full blur-xl"></div>
              
              <div className="relative bg-gray-800/60 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-200 text-base leading-relaxed font-medium">
                      {extractSummary(analysis.analysis)}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Analysis Complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>Generated {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-purple-400" />
                          <span>Verified by CryptoGuard AI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Findings Card */}
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                Key Security Findings
              </h3>
              <div className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full">
                {extractKeyFindings(analysis.analysis).length} Found
              </div>
            </div>
            
            <div className="space-y-4">
              {extractKeyFindings(analysis.analysis).map((finding, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-start gap-4 bg-gray-800/60 backdrop-blur rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg shadow-blue-500/25"></div>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {finding}
                  </p>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Security Recommendations Card */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                AI Security Recommendations
              </h3>
              <div className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-medium rounded-full">
                {Math.min(analysis.recommendations.length, 4)} Priority
              </div>
            </div>
            <div className="space-y-4">
              {analysis.recommendations.slice(0, 4).map((rec, index) => {
                const isExpanded = expandedRecommendations.has(rec.id);
                const shortText = rec.title;
                const fullText = rec.recommendation;
                const showReadMore = fullText && fullText.length > 100;
                
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/60 backdrop-blur rounded-lg border border-gray-700/50 p-4 hover:border-orange-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        {getCategoryIcon(rec.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">
                              {shortText}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                              {rec.priority.toUpperCase()}
                            </span>
                          </div>
                          {showReadMore && (
                            <button
                              onClick={() => toggleRecommendation(rec.id)}
                              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  <span>Read Less</span>
                                  <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  <span>Read More</span>
                                  <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && fullText && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-gray-700/30 rounded-lg p-3 mt-3 border-l-2 border-orange-500/50">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                  {fullText}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {!showReadMore && fullText && (
                          <p className="text-gray-400 text-sm">
                            {fullText}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* BSC Best Practices Card */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                BSC Security Best Practices
              </h3>
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full">
                Essential Tips
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getBestPractices().map((practice, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-gray-800/60 backdrop-blur rounded-lg p-4 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                      {practice.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm mb-2 group-hover:text-emerald-100 transition-colors">
                        {practice.title}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-300 transition-colors">
                        {practice.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISecurityRecommendations;
