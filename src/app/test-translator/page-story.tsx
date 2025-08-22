"use client";

import { useState } from 'react';

interface StorySection {
  id: number;
  title: string;
  content: string;
  type: 'intro' | 'definition' | 'example' | 'risk' | 'summary';
}

export default function TranslatorTestPage() {
  const [customText, setCustomText] = useState('');
  const [customMode, setCustomMode] = useState<'text' | 'term'>('text');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyMode, setStoryMode] = useState(false);
  const [storySections, setStorySections] = useState<StorySection[]>([]);

  const generateStoryFromTranslations = (translations: any[]) => {
    const sections: StorySection[] = [];
    let sectionId = 0;

    // Intro section
    sections.push({
      id: sectionId++,
      title: "🌟 Your Crypto Journey Begins",
      content: `Welcome to the world of cryptocurrency! You've entered a realm filled with exciting opportunities and complex terminology. Let's break down these concepts together, step by step.`,
      type: 'intro'
    });

    // Process each translation as story chapters
    translations.forEach((translation, index) => {
      // Definition chapter
      sections.push({
        id: sectionId++,
        title: `📖 Chapter ${index + 1}: Understanding "${translation.term}"`,
        content: `Imagine you're exploring a new digital frontier. You encounter something called "${translation.term}". ${translation.simpleDef}`,
        type: 'definition'
      });

      // Technical deep dive
      sections.push({
        id: sectionId++,
        title: `🔍 The Technical Side`,
        content: `For those who want to dig deeper: ${translation.technicalDef}`,
        type: 'definition'
      });

      // Real-world example
      sections.push({
        id: sectionId++,
        title: `💡 A Real Story`,
        content: `Here's how this plays out in the real world: ${translation.example}`,
        type: 'example'
      });

      // Risk assessment
      sections.push({
        id: sectionId++,
        title: `⚠️ What You Should Know`,
        content: `This concept carries a ${translation.riskLevel.toLowerCase()} risk level. ${
          translation.riskLevel === 'High' ? 'Proceed with extra caution and do thorough research.' :
          translation.riskLevel === 'Medium' ? 'Be aware of the risks and understand what you\'re getting into.' :
          'This is generally considered safer, but always stay informed.'
        }`,
        type: 'risk'
      });
    });

    // Summary section
    const allTerms = translations.map(t => t.term).join(', ');
    sections.push({
      id: sectionId++,
      title: "📋 Your Learning Summary",
      content: `Congratulations! You've learned about: ${allTerms}. Each of these concepts is a building block in your crypto education. Remember, knowledge is your best protection in this space.`,
      type: 'summary'
    });

    return sections;
  };

  const runTest = async () => {
    if (!customText.trim()) return;
    
    setLoading(true);
    setResults(null);
    setStoryMode(false);
    
    try {
      const response = await fetch('/api/translator/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customText,
          mode: customMode
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
      
      if (data.translations && data.translations.length > 0) {
        const story = generateStoryFromTranslations(data.translations);
        setStorySections(story);
        setCurrentStoryIndex(0);
        setStoryMode(true);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setResults({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    } finally {
      setLoading(false);
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

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'intro': return '🌟';
      case 'definition': return '📖';
      case 'example': return '💡';
      case 'risk': return '⚠️';
      case 'summary': return '📋';
      default: return '📄';
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'intro': return 'border-neutral-500/20 bg-neutral-700/20';
      case 'definition': return 'border-neutral-500/20 bg-neutral-700/20';
      case 'example': return 'border-neutral-500/20 bg-neutral-700/20';
      case 'risk': return 'border-neutral-500/20 bg-neutral-700/20';
      case 'summary': return 'border-neutral-500/20 bg-neutral-700/20';
      default: return 'border-neutral-500/20 bg-neutral-700/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Smart Translator
        </h1>

        {/* Input Section - Hidden when story mode is active */}
        {!storyMode && (
          <>
            <div className="mb-8">
              <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-600">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold">Crypto to English Translator</h2>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setCustomMode('text')}
                    className={`px-4 py-2 rounded transition cursor-pointer ${
                      customMode === 'text' 
                        ? 'bg-neutral-600 text-white' 
                        : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                    }`}
                  >
                    Text Analysis
                  </button>
                  <button
                    onClick={() => setCustomMode('term')}
                    className={`px-4 py-2 rounded transition cursor-pointer ${
                      customMode === 'term' 
                        ? 'bg-neutral-600 text-white' 
                        : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                    }`}
                  >
                    Term Lookup
                  </button>
                </div>
                
                <div className="flex gap-4">
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={
                      customMode === 'text' 
                        ? "Enter complex crypto text to analyze..."
                        : "Enter a specific crypto term..."
                    }
                    className="flex-1 p-3 bg-neutral-700 border border-neutral-600 rounded focus:border-neutral-500 focus:outline-none resize-none min-h-[120px]"
                  />
                  <button
                    onClick={runTest}
                    disabled={loading || !customText.trim()}
                    className="px-6 py-3 bg-neutral-600 hover:bg-neutral-500 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed self-start transition cursor-pointer"
                  >
                    {loading ? 'Translating...' : 'Translate'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Examples */}
            <div className="mb-8 bg-neutral-800 p-6 rounded-lg border border-neutral-600">
              <h2 className="text-xl font-semibold mb-4">Quick Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "impermanent loss",
                  "yield farming",
                  "liquidity mining",
                  "rug pull",
                  "What is PancakeSwap and how does it work?",
                  "I want to provide liquidity but I'm worried about smart contract risks"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCustomText(example);
                      setCustomMode(example.includes(' ') && example.length > 20 ? 'text' : 'term');
                    }}
                    className="text-left p-3 bg-neutral-700 hover:bg-neutral-600 rounded border border-neutral-600 transition cursor-pointer text-sm"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Story Mode Display */}
        {storyMode && storySections.length > 0 && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-400">Story Progress</span>
                <span className="text-sm text-neutral-400">
                  {currentStoryIndex + 1} of {storySections.length}
                </span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div 
                  className="bg-neutral-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStoryIndex + 1) / storySections.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Story Section */}
            <div className={`p-6 rounded-lg border ${getSectionColor(storySections[currentStoryIndex].type)}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{getSectionIcon(storySections[currentStoryIndex].type)}</span>
                <h2 className="text-xl font-semibold">{storySections[currentStoryIndex].title}</h2>
              </div>
              <p className="text-neutral-200 leading-relaxed text-lg">
                {storySections[currentStoryIndex].content}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between bg-neutral-800 p-4 rounded-lg border border-neutral-600">
              <button
                onClick={prevStorySection}
                disabled={currentStoryIndex === 0}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                ← Previous
              </button>
              
              <div className="flex gap-2">
                {storySections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStoryIndex(index)}
                    className={`w-3 h-3 rounded-full transition cursor-pointer ${
                      index === currentStoryIndex ? 'bg-neutral-400' : 'bg-neutral-600 hover:bg-neutral-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStorySection}
                disabled={currentStoryIndex === storySections.length - 1}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Next →
              </button>
            </div>

            {/* Summary Box - Show when at the end */}
            {currentStoryIndex === storySections.length - 1 && results?.translations && (
              <div className="mt-8 bg-neutral-800 p-6 rounded-lg border border-neutral-600">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  📚 Complete Summary
                </h3>
                <div className="space-y-4">
                  {results.translations.map((translation: any, index: number) => (
                    <div key={index} className="bg-neutral-700 p-4 rounded border border-neutral-600">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-neutral-200">{translation.term}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          translation.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                          translation.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {translation.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400">{translation.simpleDef}</p>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    setStoryMode(false);
                    setCurrentStoryIndex(0);
                    setCustomText('');
                  }}
                  className="mt-4 px-6 py-2 bg-neutral-600 hover:bg-neutral-500 rounded font-semibold transition cursor-pointer"
                >
                  Start New Translation
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {results?.error && !storyMode && (
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-600">
            <div className="text-red-400 bg-red-500/10 p-4 rounded border border-red-500/20">
              <strong>Error:</strong> {results.error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
