"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { 
  IconLanguage, 
  IconBulb, 
  IconSearch,
  IconBookmark,
  IconSparkles,
  IconArrowRight
} from "@tabler/icons-react";

interface Translation {
  term: string;
  simpleDef: string;
  technicalDef: string;
  example: string;
  category: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  relatedTerms: string[];
}

export default function TranslatorPage() {
  const [inputText, setInputText] = useState("");
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'term'>('text');

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/translator/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: inputText,
          mode: searchMode 
        }),
      });
      
      const data = await response.json();
      setTranslations(data.translations || []);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'DeFi': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      'Trading': 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      'Security': 'bg-red-500/10 border-red-500/20 text-red-400',
      'Technical': 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      'Governance': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      'Gaming': 'bg-pink-500/10 border-pink-500/20 text-pink-400'
    };
    return colors[category] || 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400';
  };

  const popularTerms = [
    "impermanent loss",
    "yield farming", 
    "liquidity mining",
    "rug pull",
    "smart contract",
    "slippage",
    "flash loan",
    "arbitrage"
  ];

  const complexExamples = [
    "I want to provide liquidity to the USDT-BNB pool on PancakeSwap but I'm worried about impermanent loss.",
    "The project has high APY but I need to understand the tokenomics and vesting schedule.",
    "Should I bridge my tokens or use a CEX for cross-chain transfers?"
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            BSC Smart Translator
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Convert complex DeFi and crypto terminology into plain English. Make BNB Chain accessible to everyone.
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
                <IconLanguage className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold">Crypto to English Translator</h2>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSearchMode('text')}
                  className={`px-4 py-2 rounded-lg transition ${
                    searchMode === 'text' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  <IconSparkles className="h-4 w-4 inline mr-2" />
                  Translate Text
                </button>
                <button
                  onClick={() => setSearchMode('term')}
                  className={`px-4 py-2 rounded-lg transition ${
                    searchMode === 'term' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  <IconSearch className="h-4 w-4 inline mr-2" />
                  Look Up Term
                </button>
              </div>
              
              <div className="flex gap-4">
                <textarea
                  placeholder={
                    searchMode === 'text' 
                      ? "Paste any crypto text here and we'll explain all the complex terms..." 
                      : "Enter a specific crypto term to get a detailed explanation..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={4}
                  className="flex-1 p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                />
                <button
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-start"
                >
                  {isLoading ? "Translating..." : "Translate"}
                </button>
              </div>

              {/* Quick Examples */}
              <div className="mt-4">
                <div className="mb-2">
                  <span className="text-sm text-neutral-500">Popular terms:</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {popularTerms.map((term) => (
                    <button
                      key={term}
                      onClick={() => setInputText(term)}
                      className="text-xs px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-full border border-neutral-600 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <div className="mb-2">
                  <span className="text-sm text-neutral-500">Complex examples:</span>
                </div>
                <div className="space-y-2">
                  {complexExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setInputText(example)}
                      className="block w-full text-left text-xs p-2 bg-neutral-800/50 hover:bg-neutral-700/50 rounded border border-neutral-600 transition text-neutral-300"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Results Section */}
        {translations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-center mb-6">
              📖 Plain English Explanations
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {translations.map((translation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CardSpotlight className="p-6 h-full">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <h4 className="text-xl font-bold text-purple-400">
                          {translation.term}
                        </h4>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(translation.category)}`}>
                            {translation.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(translation.riskLevel)}`}>
                            {translation.riskLevel} Risk
                          </span>
                        </div>
                      </div>

                      {/* Simple Definition */}
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <IconBulb className="h-4 w-4 text-green-400" />
                          <span className="text-sm font-semibold text-green-400">Simple Explanation</span>
                        </div>
                        <p className="text-neutral-200">{translation.simpleDef}</p>
                      </div>

                      {/* Technical Definition */}
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <IconBookmark className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-semibold text-blue-400">Technical Definition</span>
                        </div>
                        <p className="text-neutral-300 text-sm">{translation.technicalDef}</p>
                      </div>

                      {/* Example */}
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <IconSparkles className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-semibold text-yellow-400">Real Example</span>
                        </div>
                        <p className="text-neutral-300 text-sm italic">"{translation.example}"</p>
                      </div>

                      {/* Related Terms */}
                      {translation.relatedTerms.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <IconArrowRight className="h-4 w-4 text-neutral-400" />
                            <span className="text-sm font-semibold text-neutral-400">Related Terms</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {translation.relatedTerms.map((relatedTerm, idx) => (
                              <button
                                key={idx}
                                onClick={() => setInputText(relatedTerm)}
                                className="text-xs px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-600 transition"
                              >
                                {relatedTerm}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardSpotlight>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <CardSpotlight className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-400 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold">Input Complex Text</h4>
                  <p className="text-sm text-neutral-400">
                    Paste any crypto content or search for specific terms
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-400 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold">AI Analysis</h4>
                  <p className="text-sm text-neutral-400">
                    Our AI identifies complex terms and provides context
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-400 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold">Plain English</h4>
                  <p className="text-sm text-neutral-400">
                    Get simple explanations anyone can understand
                  </p>
                </div>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>
      </div>
    </div>
  );
}
