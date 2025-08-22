'use client';

import AISecurityRecommendations from '@/components/ai-security-recommendations';
import { useWallet } from '@/contexts/WalletContext';

export default function AITestPage() {
  const { isConnected, walletAddress } = useWallet();

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            AI Security Analysis Test
          </h1>
          <p className="text-gray-400">
            Connect your wallet to test the AI-powered security recommendations powered by Gemini AI.
          </p>
          {isConnected && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">
                ✅ Wallet Connected: {walletAddress?.substring(0, 6)}...{walletAddress?.substring(-4)}
              </p>
            </div>
          )}
        </div>
        
        <AISecurityRecommendations />
      </div>
    </div>
  );
}
