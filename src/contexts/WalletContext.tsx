"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  chainId: number | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // BSC Mainnet and Testnet chain IDs
  const BSC_MAINNET_CHAIN_ID = '0x38'; // 56 in decimal
  const BSC_TESTNET_CHAIN_ID = '0x61'; // 97 in decimal

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkIfWalletIsConnected();
    setupEventListeners();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await getChainId();
          await getBalance(accounts[0]);
          // Store in localStorage
          localStorage.setItem('walletAddress', accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
      localStorage.setItem('walletAddress', accounts[0]);
      getBalance(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId: string) => {
    setChainId(parseInt(newChainId, 16));
    window.location.reload(); // Reload to ensure clean state
  };

  const getChainId = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainId, 16));
      return parseInt(chainId, 16);
    } catch (error) {
      console.error('Error getting chain ID:', error);
      return null;
    }
  };

  const getBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      const balanceInBNB = (parseInt(balance, 16) / 1e18).toFixed(4);
      setBalance(balanceInBNB);
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const switchToBSCNetwork = async (isTestnet = false) => {
    try {
      const targetChainId = isTestnet ? BSC_TESTNET_CHAIN_ID : BSC_MAINNET_CHAIN_ID;
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (switchError: any) {
      // If the chain is not added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: isTestnet ? BSC_TESTNET_CHAIN_ID : BSC_MAINNET_CHAIN_ID,
                chainName: isTestnet ? 'BSC Testnet' : 'BSC Mainnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: [
                  isTestnet 
                    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
                    : 'https://bsc-dataseed1.binance.org/'
                ],
                blockExplorerUrls: [
                  isTestnet 
                    ? 'https://testnet.bscscan.com/'
                    : 'https://bscscan.com/'
                ],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        
        // Get chain ID and switch to BSC if needed
        const currentChainId = await getChainId();
        
        // Switch to BSC Testnet by default for development
        if (currentChainId !== 97 && currentChainId !== 56) {
          await switchToBSCNetwork(true); // true for testnet
        }
        
        await getBalance(accounts[0]);
        
        // Store in localStorage
        localStorage.setItem('walletAddress', accounts[0]);
        localStorage.setItem('walletConnected', 'true');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setChainId(null);
    setBalance(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
  };

  const value: WalletContextType = {
    isConnected,
    walletAddress,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
