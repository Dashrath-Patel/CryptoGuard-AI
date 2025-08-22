"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconSearch, IconBulb, IconSparkles, IconRocket, IconShield, IconTrendingUp, IconAlertTriangle } from "@tabler/icons-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface TranslationResult {
  simplified: string;
  technical: string;
  examples: string[];
  riskLevel: "low" | "medium" | "high";
  explanation: string;
  tradingTips?: string[];
}

export default function SmartTranslator() {
  const [term, setTerm] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/translator/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: term.trim(), mode: 'term' })
      });
      
      if (!response.ok) throw new Error('Translation failed');
      
      const data = await response.json();
      const firstTranslation = data.translations?.[0];
      if (firstTranslation) {
        // Convert API response format to component format
        setResult({
          simplified: firstTranslation.simpleDef,
          technical: firstTranslation.technicalDef,
          examples: [firstTranslation.example],
          riskLevel: firstTranslation.riskLevel.toLowerCase() as "low" | "medium" | "high",
          explanation: `${firstTranslation.simpleDef} ${firstTranslation.technicalDef}`,
          tradingTips: firstTranslation.relatedTerms?.map(term => `Learn about: ${term}`)
        });
      } else {
        throw new Error('No translation found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <IconAlertTriangle className="w-5 h-5" />;
      case 'medium': return <IconShield className="w-5 h-5" />;
      case 'low': return <IconTrendingUp className="w-5 h-5" />;
      default: return <IconBulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Smart Crypto Translator
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Decode complex crypto terminology with AI-powered translations. 
            Get simplified explanations, technical details, and real-world examples.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <BackgroundGradient className="rounded-2xl p-1">
            <div className="bg-black rounded-2xl p-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTranslate()}
                    placeholder="Enter crypto term (e.g., 'yield farming', 'liquidity pool')"
                    className="w-full pl-14 pr-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
                <div className={`${loading || !term.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <HoverBorderGradient
                    containerClassName="rounded-xl"
                    as="button"
                    onClick={loading || !term.trim() ? undefined : handleTranslate}
                    className="bg-black text-white flex items-center space-x-2 px-8 py-4"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Translating...</span>
                      </>
                    ) : (
                      <>
                        <IconSparkles className="w-5 h-5" />
                        <span>Translate</span>
                      </>
                    )}
                  </HoverBorderGradient>
                </div>
              </div>
            </div>
          </BackgroundGradient>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
              {error}
            </div>
          </motion.div>
        )}

        {/* Results Section - Single Comprehensive Card */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-5xl mx-auto"
          >
            <BackgroundGradient className="rounded-3xl p-1">
              <div className="bg-black relative w-full h-auto rounded-3xl p-8 border border-gray-800">
                
                {/* Header with Risk Level */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                      <IconSparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">Translation Complete</h3>
                      <p className="text-gray-400">AI-powered crypto terminology breakdown</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${getRiskColor(result.riskLevel)}`}>
                    {getRiskIcon(result.riskLevel)}
                    <span className="capitalize font-medium">{result.riskLevel} Risk</span>
                  </div>
                </div>

                {/* Simple Explanation Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <IconBulb className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Simple Explanation</h4>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                    <p className="text-gray-300 text-lg leading-relaxed">{result.simplified}</p>
                  </div>
                </div>

                {/* Technical Details Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <IconRocket className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Technical Details</h4>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                    <p className="text-gray-300 text-lg leading-relaxed">{result.technical}</p>
                  </div>
                </div>

                {/* Examples Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <IconSparkles className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Real Examples</h4>
                  </div>
                  <div className="space-y-3">
                    {result.examples.map((example, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                        <p className="text-gray-300 leading-relaxed">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trading Tips Section */}
                {result.tradingTips && result.tradingTips.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <IconTrendingUp className="w-6 h-6 text-yellow-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Trading Tips</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.tradingTips.map((tip, index) => (
                        <div key={index} className="flex items-center gap-3 bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/20">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                          <p className="text-gray-300 text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Explanation Section */}
                {result.explanation && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <IconShield className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Deep Dive</h4>
                    </div>
                    <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <p className="text-gray-300 text-lg leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                )}

              </div>
            </BackgroundGradient>
          </motion.div>
        )}

        {/* Quick Examples Section */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Try These Popular Terms</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Yield Farming', 'Liquidity Pool', 'Impermanent Loss', 'DeFi', 'Staking', 'Flash Loan'].map((example) => (
                <button
                  key={example}
                  onClick={() => setTerm(example)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-300 hover:border-purple-500"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
