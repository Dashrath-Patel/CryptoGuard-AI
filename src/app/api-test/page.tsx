'use client';

import { useState } from 'react';

interface ApiResponse {
  success: boolean;
  [key: string]: any;
}

// Simple Card components
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-400 text-sm mt-1">{children}</p>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

export default function ApiTestPage() {
  const [translatorResult, setTranslatorResult] = useState<ApiResponse | null>(null);
  const [queryResult, setQueryResult] = useState<ApiResponse | null>(null);
  const [defiResult, setDefiResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const testTranslator = async () => {
    setLoading(prev => ({ ...prev, translator: true }));
    try {
      const response = await fetch('/api/smart-translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'DeFi yield farming with automated market makers and liquidity pools',
          mode: 'text'
        })
      });
      const data = await response.json();
      setTranslatorResult(data);
    } catch (error) {
      setTranslatorResult({ success: false, error: 'Failed to test translator' });
    }
    setLoading(prev => ({ ...prev, translator: false }));
  };

  const testQuery = async () => {
    setLoading(prev => ({ ...prev, query: true }));
    try {
      const response = await fetch('/api/crypto-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'What is yield farming and how does it work?'
        })
      });
      const data = await response.json();
      setQueryResult(data);
    } catch (error) {
      setQueryResult({ success: false, error: 'Failed to test query system' });
    }
    setLoading(prev => ({ ...prev, query: false }));
  };

  const testDeFiAnalysis = async () => {
    setLoading(prev => ({ ...prev, defi: true }));
    try {
      const response = await fetch('/api/defi-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: 'Uniswap V3 concentrated liquidity',
          analysisType: 'protocol',
          userLevel: 'intermediate'
        })
      });
      const data = await response.json();
      setDefiResult(data);
    } catch (error) {
      setDefiResult({ success: false, error: 'Failed to test DeFi analysis' });
    }
    setLoading(prev => ({ ...prev, defi: false }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          CryptoGuard AI Backend APIs
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Test the comprehensive backend system for crypto query processing and DeFi terminology translation
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Smart Translator Test */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-blue-400">Smart Translator</CardTitle>
              <CardDescription>
                Translate complex DeFi terms into plain English
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={testTranslator}
                disabled={loading.translator}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg mb-4"
              >
                {loading.translator ? 'Testing...' : 'Test Translator API'}
              </button>
              
              {translatorResult && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Result:</h4>
                  <pre className="text-xs overflow-auto max-h-40">
                    {JSON.stringify(translatorResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Crypto Query Test */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400">Crypto Query</CardTitle>
              <CardDescription>
                AI-powered answers to crypto and DeFi questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={testQuery}
                disabled={loading.query}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg mb-4"
              >
                {loading.query ? 'Testing...' : 'Test Query API'}
              </button>
              
              {queryResult && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Result:</h4>
                  <pre className="text-xs overflow-auto max-h-40">
                    {JSON.stringify(queryResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* DeFi Analysis Test */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-purple-400">DeFi Analysis</CardTitle>
              <CardDescription>
                Deep analysis of DeFi protocols and strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={testDeFiAnalysis}
                disabled={loading.defi}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg mb-4"
              >
                {loading.defi ? 'Testing...' : 'Test DeFi Analysis'}
              </button>
              
              {defiResult && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Result:</h4>
                  <pre className="text-xs overflow-auto max-h-40">
                    {JSON.stringify(defiResult, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-yellow-400">API Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong className="text-blue-400">POST /api/smart-translator</strong>
                <br />
                <span className="text-gray-400">Translate crypto/DeFi terminology</span>
              </div>
              <div className="text-sm">
                <strong className="text-green-400">POST /api/crypto-query</strong>
                <br />
                <span className="text-gray-400">Answer crypto questions with AI</span>
              </div>
              <div className="text-sm">
                <strong className="text-purple-400">POST /api/defi-analysis</strong>
                <br />
                <span className="text-gray-400">Analyze DeFi protocols and strategies</span>
              </div>
              <div className="text-sm">
                <strong className="text-orange-400">POST /api/transaction-analysis</strong>
                <br />
                <span className="text-gray-400">Decode and explain transactions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-yellow-400">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>✅ <strong>AI Integration:</strong> Google Gemini AI with smart fallbacks</div>
              <div>✅ <strong>Quota Management:</strong> Intelligent rate limiting</div>
              <div>✅ <strong>200+ Terms:</strong> Comprehensive crypto dictionary</div>
              <div>✅ <strong>Protocol Database:</strong> Major DeFi protocols covered</div>
              <div>✅ <strong>Transaction Decoding:</strong> Method signature recognition</div>
              <div>✅ <strong>Risk Assessment:</strong> Built-in risk evaluation</div>
              <div>✅ <strong>Error Handling:</strong> Graceful degradation</div>
              <div>✅ <strong>TypeScript:</strong> Full type safety</div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="bg-gray-900 border-gray-800 mt-6">
          <CardHeader>
            <CardTitle className="text-yellow-400">Usage Examples</CardTitle>
            <CardDescription>
              Sample API calls you can make to test the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Smart Translator</h4>
                <pre className="bg-gray-800 p-3 rounded text-xs overflow-auto">
{`// Translate DeFi text
fetch('/api/smart-translator', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Yield farming with AMM',
    mode: 'text'
  })
})`}
                </pre>
              </div>
              
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Crypto Query</h4>
                <pre className="bg-gray-800 p-3 rounded text-xs overflow-auto">
{`// Ask crypto questions
fetch('/api/crypto-query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'How to safely use DeFi?'
  })
})`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
