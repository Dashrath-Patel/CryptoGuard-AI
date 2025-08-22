"use client";
import React from 'react';
import { motion } from 'motion/react';
import { useWallet } from '@/contexts/WalletContext';
import { 
  IconWallet, 
  IconPlugConnected, 
  IconLogout, 
  IconAlertTriangle,
  IconLoader2
} from '@tabler/icons-react';

export function ConnectWalletButton() {
  const { 
    isConnected, 
    walletAddress, 
    balance, 
    chainId, 
    connectWallet, 
    disconnectWallet, 
    isConnecting, 
    error,
    diagnoseWallet
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 56:
        return 'BSC Mainnet';
      case 97:
        return 'BSC Testnet';
      default:
        return 'Unknown Network';
    }
  };

  if (isConnected && walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        {/* Wallet Info Card */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <IconPlugConnected className="h-5 w-5 text-green-400" />
              <div className="text-left">
                <div className="text-sm font-medium text-white">
                  {formatAddress(walletAddress)}
                </div>
                <div className="text-xs text-neutral-400">
                  {balance} BNB • {getNetworkName(chainId)}
                </div>
              </div>
            </div>
            
            <button
              onClick={disconnectWallet}
              className="ml-3 p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
              title="Disconnect Wallet"
            >
              <IconLogout className="h-4 w-4 text-red-400 group-hover:text-red-300" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Connect Button */}
      <motion.button
        onClick={connectWallet}
        disabled={isConnecting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <>
            <IconLoader2 className="h-5 w-5 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <IconWallet className="h-5 w-5" />
            <span>Connect Wallet</span>
          </>
        )}
        
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 hover:opacity-20 transition-opacity"
          layoutId="wallet-button-bg"
        />
      </motion.button>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 max-w-md"
        >
          <IconAlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Diagnostic Button (for debugging) */}
      {error && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={diagnoseWallet}
          className="text-xs text-neutral-400 hover:text-neutral-200 underline"
        >
          🔍 Run Wallet Diagnostic (Check Console)
        </motion.button>
      )}
    </div>
  );
}
