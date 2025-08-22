"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  IconLanguage, 
  IconBulb, 
  IconSearch,
  IconBookmark,
  IconSparkles,
  IconArrowRight,
  IconArrowLeft,
  IconBook
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

interface StorySection {
  id: number;
  title: string;
  content: string;
  type: 'intro' | 'definition' | 'technical' | 'example' | 'risk' | 'summary';
  term?: string;
  category?: string;
  riskLevel?: string;
}

export default function TranslatorPage() {
  const [inputText, setInputText] = useState("");
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'term'>('text');
  const [storyMode, setStoryMode] = useState(false);
  const [storySections, setStorySections] = useState<StorySection[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const generateStoryFromTranslations = (translations: Translation[]) => {
    const sections: StorySection[] = [];
    let sectionId = 0;

    // Intro section
    sections.push({
      id: sectionId++,
      title: "🌟 Welcome to Your Crypto Learning Journey",
      content: `Great choice! You've taken the first step toward understanding the complex world of cryptocurrency. Let's break down these concepts in a way that's easy to understand and remember.`,
      type: 'intro'
    });

    // Process each translation as story sections
    translations.forEach((translation, index) => {
      // Definition section
      sections.push({
        id: sectionId++,
        title: `📖 Understanding "${translation.term}"`,
        content: `Let's start with "${translation.term}" - a ${translation.category.toLowerCase()} concept. In simple terms: ${translation.simpleDef}`,
        type: 'definition',
        term: translation.term,
        category: translation.category,
        riskLevel: translation.riskLevel
      });

      // Technical deep dive
      sections.push({
        id: sectionId++,
        title: `🔍 The Technical Details`,
        content: `Now for the technical side: ${translation.technicalDef}`,
        type: 'technical',
        term: translation.term
      });

      // Real-world example
      sections.push({
        id: sectionId++,
        title: `💡 Real-World Application`,
        content: `Here's how "${translation.term}" works in practice: ${translation.example}`,
        type: 'example',
        term: translation.term
      });

      // Risk assessment
      sections.push({
        id: sectionId++,
        title: `⚠️ Risk Assessment`,
        content: `Important: "${translation.term}" carries a ${translation.riskLevel.toLowerCase()} risk level. ${
          translation.riskLevel === 'High' ? 'Exercise extreme caution and conduct thorough research before proceeding.' :
          translation.riskLevel === 'Medium' ? 'Be aware of potential risks and ensure you understand the implications.' :
          'Generally considered safer, but always stay informed and vigilant.'
        }`,
        type: 'risk',
        term: translation.term,
        riskLevel: translation.riskLevel
      });
    });

    // Summary section
    if (translations.length > 0) {
      const allTerms = translations.map(t => t.term).join(', ');
      sections.push({
        id: sectionId++,
        title: "🎯 Learning Complete!",
        content: `Congratulations! You've successfully learned about: ${allTerms}. These concepts are essential building blocks for navigating the crypto space safely and effectively. Remember, continuous learning is key to success in this rapidly evolving field.`,
        type: 'summary'
      });
    }

    return sections;
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setStoryMode(false);
    setTranslations([]);
    
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
      if (data.translations && data.translations.length > 0) {
        setTranslations(data.translations);
        const story = generateStoryFromTranslations(data.translations);
        setStorySections(story);
        setCurrentStoryIndex(0);
        setStoryMode(true);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStorySection = () => {
    if (currentStoryIndex < storySections.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const prevStorySection = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const exitStoryMode = () => {
    setStoryMode(false);
    setCurrentStoryIndex(0);
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
            🔍 Crypto to English Translator
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Turn complex crypto jargon into plain English with our AI-powered translator
          </p>
        </motion.div>

        {/* Main Translator Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="p-8 bg-neutral-800 rounded-lg border border-neutral-600">
            {!storyMode ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <IconLanguage className="h-6 w-6 text-purple-400" />
                  <h2 className="text-xl font-semibold">Crypto to English Translator</h2>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSearchMode('text')}
                    className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                      searchMode === 'text' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                    }`}
                  >
                    <IconSparkles className="h-4 w-4 inline mr-2" />
                    Translate Text
                  </button>
                  <button
                    onClick={() => setSearchMode('term')}
                    className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                      searchMode === 'term' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
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
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-start cursor-pointer"
                  >
                    {isLoading ? "Translating..." : "Translate"}
                  </button>
                </div>

                {/* Quick Examples - Hidden when in story mode */}
                <div className="mt-4">
                  <div className="mb-2">
                    <span className="text-sm text-neutral-500">Popular terms:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {popularTerms.map((term) => (
                      <button
                        key={term}
                        onClick={() => setInputText(term)}
                        className="text-xs px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-full border border-neutral-600 transition cursor-pointer"
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
                        className="block w-full text-left text-xs p-2 bg-neutral-700/50 hover:bg-neutral-600/50 rounded border border-neutral-600 transition text-neutral-300 cursor-pointer"
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Story Mode Interface - Displayed in same box */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={exitStoryMode}
                      className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded transition cursor-pointer"
                    >
                      <IconArrowLeft className="h-4 w-4 inline mr-2" />
                      Back
                    </button>
                    <div className="flex items-center gap-2">
                      <IconBook className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold">Learning Story</h2>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400">
                    Part {currentStoryIndex + 1} of {storySections.length}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-neutral-400">Progress:</span>
                    <span className="text-sm text-purple-400">
                      {Math.round(((currentStoryIndex + 1) / storySections.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStoryIndex + 1) / storySections.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Story Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStoryIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <h3 className="text-2xl font-bold mb-4 text-purple-400">
                      {storySections[currentStoryIndex]?.title}
                    </h3>
                    
                    {/* Category and Risk badges for relevant sections */}
                    {storySections[currentStoryIndex]?.category && (
                      <div className="flex gap-2 mb-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(storySections[currentStoryIndex].category!)}`}>
                          {storySections[currentStoryIndex].category}
                        </span>
                        {storySections[currentStoryIndex]?.riskLevel && (
                          <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(storySections[currentStoryIndex].riskLevel!)}`}>
                            {storySections[currentStoryIndex].riskLevel} Risk
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-neutral-200 leading-relaxed text-lg whitespace-pre-line">
                        {storySections[currentStoryIndex]?.content}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStorySection}
                    disabled={currentStoryIndex === 0}
                    className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition cursor-pointer"
                  >
                    <IconArrowLeft className="h-4 w-4 inline mr-2" />
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {storySections.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStoryIndex(index)}
                        className={`w-3 h-3 rounded-full transition cursor-pointer ${
                          index === currentStoryIndex 
                            ? 'bg-purple-500' 
                            : index < currentStoryIndex 
                            ? 'bg-green-500' 
                            : 'bg-neutral-600'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextStorySection}
                    disabled={currentStoryIndex === storySections.length - 1}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded transition cursor-pointer"
                  >
                    {currentStoryIndex === storySections.length - 1 ? 'Complete!' : 'Next'}
                    <IconArrowRight className="h-4 w-4 inline ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="p-8 bg-neutral-800 rounded-lg border border-neutral-600">
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
                  <h4 className="font-semibold">Learn as a Story</h4>
                  <p className="text-sm text-neutral-400">
                    Get explanations in an engaging step-by-step story format
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
