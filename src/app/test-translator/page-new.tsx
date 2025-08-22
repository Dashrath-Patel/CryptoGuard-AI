"use client";

import { useState, useEffect } from 'react';

export default function TranslatorTestPage() {
  const [customText, setCustomText] = useState('');
  const [customMode, setCustomMode] = useState<'text' | 'term'>('text');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const runTest = async () => {
    if (!customText.trim()) return;
    
    setLoading(true);
    setResults(null);
    
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
    } catch (error) {
      console.error('Translation error:', error);
      setResults({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Very subtle cursor glow effect with extremely low opacity */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.015), transparent 60%)`,
        }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Smart Translator
        </h1>

        {/* Input Section */}
        <div className="mb-8">
          <div className="bg-neutral-800/98 backdrop-blur-sm p-6 rounded-lg border border-neutral-600 relative z-20 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold">Crypto to English Translator</h2>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCustomMode('text')}
                className={`px-4 py-2 rounded transition cursor-pointer relative z-30 ${
                  customMode === 'text' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                }`}
              >
                Text Analysis
              </button>
              <button
                onClick={() => setCustomMode('term')}
                className={`px-4 py-2 rounded transition cursor-pointer relative z-30 ${
                  customMode === 'term' 
                    ? 'bg-purple-600 text-white' 
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
                className="flex-1 p-3 bg-neutral-700/98 backdrop-blur-sm border border-neutral-600 rounded focus:border-purple-500 focus:outline-none resize-none min-h-[120px] relative z-30"
              />
              <button
                onClick={runTest}
                disabled={loading || !customText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-start transition cursor-pointer relative z-30"
              >
                {loading ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-neutral-800/98 backdrop-blur-sm p-6 rounded-lg border border-neutral-600 relative z-20 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            {results.error ? (
              <div className="text-red-400 bg-red-500/10 p-4 rounded border border-red-500/20">
                <strong>Error:</strong> {results.error}
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-green-400">✅ Success!</span>
                  <span className="text-sm text-neutral-400">
                    Found {results.translations?.length || 0} translations
                  </span>
                  <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {results.source}
                  </span>
                </div>

                <div className="space-y-4">
                  {results.translations?.map((translation: any, index: number) => (
                    <div key={index} className="bg-neutral-700/98 backdrop-blur-sm p-4 rounded border border-neutral-600 relative z-30 shadow-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-purple-400">
                          {translation.term}
                        </h3>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                            {translation.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            translation.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                            translation.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {translation.riskLevel} Risk
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                          <div className="text-sm font-semibold text-green-400 mb-1">Simple Definition</div>
                          <p className="text-neutral-200">{translation.simpleDef}</p>
                        </div>

                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                          <div className="text-sm font-semibold text-blue-400 mb-1">Technical Definition</div>
                          <p className="text-neutral-300 text-sm">{translation.technicalDef}</p>
                        </div>

                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                          <div className="text-sm font-semibold text-yellow-400 mb-1">Example</div>
                          <p className="text-neutral-300 text-sm italic">"{translation.example}"</p>
                        </div>

                        {translation.relatedTerms?.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-neutral-400 mb-2">Related Terms</div>
                            <div className="flex flex-wrap gap-2">
                              {translation.relatedTerms.map((term: string, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => setCustomText(term)}
                                  className="text-xs px-2 py-1 bg-neutral-600/80 hover:bg-neutral-500 rounded border border-neutral-500 transition cursor-pointer relative z-40"
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Examples */}
        <div className="mt-8 bg-neutral-800/98 backdrop-blur-sm p-6 rounded-lg border border-neutral-600 relative z-20 shadow-xl">
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
                className="text-left p-3 bg-neutral-700/80 hover:bg-neutral-600 rounded border border-neutral-600 transition cursor-pointer text-sm relative z-30"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* API Information */}
        <div className="mt-8 bg-neutral-800/98 backdrop-blur-sm p-6 rounded-lg border border-neutral-600 relative z-20 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">API Information</h2>
          <div className="text-sm text-neutral-300 space-y-2">
            <p><strong>Endpoint:</strong> <code className="bg-neutral-700 px-2 py-1 rounded">/api/translator/analyze</code></p>
            <p><strong>Method:</strong> POST</p>
            <p><strong>Modes:</strong> "text" (analyze full text) | "term" (single term lookup)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
