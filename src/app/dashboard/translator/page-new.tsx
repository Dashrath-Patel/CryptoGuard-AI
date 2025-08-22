"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconSearch, IconBulb, IconSparkles, IconRocket, IconShield, IconTrendingUp, IconAlertTriangle } from "@tabler/icons-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

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
        body: JSON.stringify({ term: term.trim() })
      });
      
      if (!response.ok) throw new Error('Translation failed');
      
      const data = await response.json();
      setResult(data.translation);
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
                <HoverBorderGradient
                  containerClassName="rounded-xl"
                  as="button"
                  onClick={handleTranslate}
                  disabled={loading || !term.trim()}
                  className="bg-black text-white flex items-center space-x-2 px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Simplified Explanation Card */}
            <CardContainer className="inter-var">
              <CardBody className="bg-gray-950/50 relative group/card border-gray-700 w-full h-auto rounded-xl p-6 border backdrop-blur-sm">
                <CardItem translateZ="50" className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <IconBulb className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Simple Explanation</h3>
                </CardItem>
                <CardItem translateZ="60" className="text-gray-300 text-lg leading-relaxed mb-6">
                  {result.simplified}
                </CardItem>
                <CardItem translateZ="70" className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getRiskColor(result.riskLevel)}`}>
                  {getRiskIcon(result.riskLevel)}
                  <span className="capitalize">{result.riskLevel} Risk</span>
                </CardItem>
              </CardBody>
            </CardContainer>

            {/* Technical Details Card */}
            <CardContainer className="inter-var">
              <CardBody className="bg-gray-950/50 relative group/card border-gray-700 w-full h-auto rounded-xl p-6 border backdrop-blur-sm">
                <CardItem translateZ="50" className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <IconRocket className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Technical Details</h3>
                </CardItem>
                <CardItem translateZ="60" className="text-gray-300 text-lg leading-relaxed">
                  {result.technical}
                </CardItem>
              </CardBody>
            </CardContainer>

            {/* Examples Card */}
            <CardContainer className="inter-var">
              <CardBody className="bg-gray-950/50 relative group/card border-gray-700 w-full h-auto rounded-xl p-6 border backdrop-blur-sm">
                <CardItem translateZ="50" className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <IconSparkles className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Real Examples</h3>
                </CardItem>
                <CardItem translateZ="60" className="space-y-3">
                  {result.examples.map((example, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-gray-300">{example}</p>
                    </div>
                  ))}
                </CardItem>
              </CardBody>
            </CardContainer>

            {/* Trading Tips Card */}
            {result.tradingTips && result.tradingTips.length > 0 && (
              <CardContainer className="inter-var">
                <CardBody className="bg-gray-950/50 relative group/card border-gray-700 w-full h-auto rounded-xl p-6 border backdrop-blur-sm">
                  <CardItem translateZ="50" className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <IconTrendingUp className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Trading Tips</h3>
                  </CardItem>
                  <CardItem translateZ="60" className="space-y-3">
                    {result.tradingTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-300">{tip}</p>
                      </div>
                    ))}
                  </CardItem>
                </CardBody>
              </CardContainer>
            )}
          </motion.div>
        )}

        {/* Detailed Explanation Section */}
        {result && result.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <BackgroundGradient className="rounded-2xl p-1">
              <div className="bg-black rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                    <IconShield className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Deep Dive Explanation</h3>
                </div>
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {result.explanation}
                  </p>
                </div>
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
