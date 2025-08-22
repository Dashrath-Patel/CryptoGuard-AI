"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { 
  IconFileSearch, 
  IconShieldCheck, 
  IconAlertTriangle, 
  IconCode,
  IconBug,
  IconLock,
  IconGasStation,
  IconUsers
} from "@tabler/icons-react";

interface ContractAudit {
  address: string;
  grade: string;
  score: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  features: {
    verified: boolean;
    proxy: boolean;
    mintable: boolean;
    pausable: boolean;
    hasOwner: boolean;
  };
  analysis: {
    complexity: 'Low' | 'Medium' | 'High';
    gasOptimization: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    codeQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    security: 'Vulnerable' | 'Weak' | 'Good' | 'Excellent';
  };
  recommendations: string[];
}

export default function ContractAuditorPage() {
  const [contractAddress, setContractAddress] = useState("");
  const [auditResult, setAuditResult] = useState<ContractAudit | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAudit = async () => {
    if (!contractAddress.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auditor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: contractAddress }),
      });
      
      const data = await response.json();
      setAuditResult(data);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-400';
      case 'B+':
      case 'B': return 'text-blue-400';
      case 'C+':
      case 'C': return 'text-yellow-400';
      case 'D+':
      case 'D': return 'text-orange-400';
      case 'F': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const getGradeBg = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'bg-green-500/20 border-green-500/30';
      case 'B+':
      case 'B': return 'bg-blue-500/20 border-blue-500/30';
      case 'C+':
      case 'C': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'D+':
      case 'D': return 'bg-orange-500/20 border-orange-500/30';
      case 'F': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-neutral-500/20 border-neutral-500/30';
    }
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            BEP-20 Contract Auditor
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Get comprehensive security grades for any BNB Chain smart contract. Our AI analyzes code quality, vulnerabilities, and provides actionable recommendations.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <CardSpotlight className="p-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <IconFileSearch className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold">Contract Analysis</h2>
              </div>
              
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter BEP-20 contract address (0x...)"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="flex-1 p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleAudit}
                  disabled={isLoading || !contractAddress.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Auditing..." : "Audit Contract"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-neutral-500">Popular contracts:</span>
                {[
                  "0x55d398326f99059ff775485246999027b3197955", // USDT
                  "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
                  "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"  // USDC
                ].map((addr) => (
                  <button
                    key={addr}
                    onClick={() => setContractAddress(addr)}
                    className="text-xs px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-600"
                  >
                    {addr.slice(0, 8)}...{addr.slice(-4)}
                  </button>
                ))}
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Results Section */}
        {auditResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Grade Overview */}
            <CardSpotlight className="p-8">
              <div className="text-center mb-6">
                <div className={`inline-block p-6 rounded-full ${getGradeBg(auditResult.grade)} border-2`}>
                  <span className={`text-6xl font-bold ${getGradeColor(auditResult.grade)}`}>
                    {auditResult.grade}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mt-4">Contract Security Grade</h3>
                <p className="text-neutral-400">Overall Score: {auditResult.score}/100</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">{auditResult.vulnerabilities.critical}</div>
                  <div className="text-sm text-red-300">Critical</div>
                </div>
                <div className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">{auditResult.vulnerabilities.high}</div>
                  <div className="text-sm text-orange-300">High</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{auditResult.vulnerabilities.medium}</div>
                  <div className="text-sm text-yellow-300">Medium</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{auditResult.vulnerabilities.low}</div>
                  <div className="text-sm text-blue-300">Low</div>
                </div>
              </div>
            </CardSpotlight>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contract Features */}
              <CardSpotlight className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <IconCode className="h-5 w-5 text-blue-400" />
                  Contract Features
                </h3>
                <div className="space-y-3">
                  {Object.entries(auditResult.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={value ? "text-green-400" : "text-red-400"}>
                        {value ? "✓" : "✗"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardSpotlight>

              {/* Quality Analysis */}
              <CardSpotlight className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <IconBug className="h-5 w-5 text-purple-400" />
                  Quality Analysis
                </h3>
                <div className="space-y-3">
                  {Object.entries(auditResult.analysis).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={
                        value === 'Excellent' || value === 'Good' ? "text-green-400" :
                        value === 'Fair' ? "text-yellow-400" : "text-red-400"
                      }>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardSpotlight>
            </div>

            {/* Recommendations */}
            <CardSpotlight className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <IconShieldCheck className="h-5 w-5 text-green-400" />
                Security Recommendations
              </h3>
              <div className="space-y-3">
                {auditResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-neutral-900/50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <p className="text-neutral-300">{rec}</p>
                  </div>
                ))}
              </div>
            </CardSpotlight>
          </motion.div>
        )}
      </div>
    </div>
  );
}
