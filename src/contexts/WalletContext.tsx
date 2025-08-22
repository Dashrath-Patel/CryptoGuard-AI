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
  diagnoseWallet: () => void;
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
    console.log('🔍 Checking if wallet is already connected...');
    
    try {
      // Enhanced wallet detection for initialization
      const detectWallet = () => {
        if (typeof window === 'undefined') {
          console.log('❌ Window is undefined (SSR)');
          return null;
        }

        console.log('🔍 Initial wallet detection...');
        console.log('window.ethereum exists:', !!window.ethereum);
        
        if (window.ethereum?.providers && window.ethereum.providers.length > 0) {
          console.log('📦 Multiple providers found:', window.ethereum.providers.length);
          const metaMaskProvider = window.ethereum.providers.find((p: any) => p.isMetaMask);
          return metaMaskProvider || window.ethereum.providers[0];
        }

        if (window.ethereum) {
          console.log('✅ Single provider found');
          return window.ethereum;
        }

        return null;
      };

      const wallet = detectWallet();
      
      if (wallet) {
        console.log('📋 Checking for existing accounts...');
        const accounts = await wallet.request({ method: 'eth_accounts' });
        console.log('Found accounts:', accounts.length);
        
        if (accounts.length > 0) {
          console.log('✅ Wallet already connected:', `${accounts[0].substring(0, 8)}...`);
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await getChainId();
          await getBalance(accounts[0]);
          // Store in localStorage
          localStorage.setItem('walletAddress', accounts[0]);
          localStorage.setItem('walletConnected', 'true');
        } else {
          console.log('📭 No accounts found, wallet not connected');
        }
      } else {
        console.log('❌ No wallet provider detected during initialization');
      }
    } catch (error) {
      console.error('💥 Error checking wallet connection:', error);
    }
  };

  const setupEventListeners = () => {
    console.log('🎧 Setting up wallet event listeners...');
    
    const detectWallet = () => {
      if (window.ethereum?.providers && window.ethereum.providers.length > 0) {
        const metaMaskProvider = window.ethereum.providers.find((p: any) => p.isMetaMask);
        return metaMaskProvider || window.ethereum.providers[0];
      }
      return window.ethereum;
    };

    const wallet = detectWallet();
    
    if (wallet) {
      console.log('✅ Event listeners attached to wallet provider');
      wallet.on('accountsChanged', handleAccountsChanged);
      wallet.on('chainChanged', handleChainChanged);
    } else {
      console.log('❌ No wallet provider found for event listeners');
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

  // Diagnostic function to help debug wallet issues
  const diagnoseWallet = () => {
    console.log('🔍 === WALLET DIAGNOSTIC REPORT ===');
    console.log('Browser environment:', typeof window !== 'undefined');
    console.log('window.ethereum exists:', !!window.ethereum);
    
    if (window.ethereum) {
      console.log('window.ethereum.isMetaMask:', window.ethereum.isMetaMask);
      console.log('window.ethereum.isTrustWallet:', window.ethereum.isTrustWallet);
      console.log('window.ethereum.isConnected():', window.ethereum.isConnected?.());
      console.log('window.ethereum.providers:', window.ethereum.providers?.length || 'none');
      
      if (window.ethereum.providers) {
        window.ethereum.providers.forEach((provider: any, index: number) => {
          console.log(`Provider ${index}:`, {
            isMetaMask: provider.isMetaMask,
            isTrustWallet: provider.isTrustWallet,
            isConnected: provider.isConnected?.()
          });
        });
      }
    }
    
    console.log('localStorage walletConnected:', localStorage.getItem('walletConnected'));
    console.log('localStorage walletAddress:', localStorage.getItem('walletAddress'));
    console.log('Current state - isConnected:', isConnected);
    console.log('Current state - walletAddress:', walletAddress ? `${walletAddress.substring(0, 8)}...` : 'none');
    console.log('=== END DIAGNOSTIC REPORT ===');
  };

  const connectWallet = async () => {
    console.log('🔍 Starting wallet connection process...');
    
    // Enhanced wallet detection
    const detectWallet = () => {
      if (typeof window === 'undefined') {
        console.log('❌ Window is undefined (SSR)');
        return null;
      }

      console.log('🔍 Checking for wallet providers...');
      console.log('window.ethereum:', !!window.ethereum);
      console.log('window.ethereum.isMetaMask:', window.ethereum?.isMetaMask);
      console.log('window.ethereum.isTrustWallet:', window.ethereum?.isTrustWallet);
      console.log('window.ethereum.providers:', window.ethereum?.providers?.length || 'none');

      // Check for multiple wallet providers
      if (window.ethereum?.providers && window.ethereum.providers.length > 0) {
        console.log('📦 Multiple wallet providers detected:', window.ethereum.providers.length);
        // Find MetaMask or first available provider
        const metaMaskProvider = window.ethereum.providers.find((p: any) => p.isMetaMask);
        const provider = metaMaskProvider || window.ethereum.providers[0];
        console.log('✅ Selected provider:', provider.isMetaMask ? 'MetaMask' : 'Other wallet');
        return provider;
      }

      // Single wallet provider
      if (window.ethereum) {
        console.log('✅ Single wallet provider detected');
        return window.ethereum;
      }

      console.log('❌ No wallet provider found');
      return null;
    };

    const wallet = detectWallet();
    
    if (!wallet) {
      const errorMsg = 'No Web3 wallet detected. Please install MetaMask, Trust Wallet, or another Web3 wallet extension.';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('🔐 Requesting wallet accounts...');
      
      // Request account access with the detected wallet
      const accounts = await wallet.request({ 
        method: 'eth_requestAccounts' 
      });
      
      console.log('📋 Received accounts:', accounts.length, accounts[0] ? `${accounts[0].substring(0, 8)}...` : 'none');
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        console.log('✅ Wallet connected successfully:', `${address.substring(0, 8)}...`);
        
        setWalletAddress(address);
        setIsConnected(true);
        
        // Get chain ID and switch to BSC if needed
        console.log('🔗 Checking network...');
        const currentChainId = await getChainId();
        console.log('🌐 Current chain ID:', currentChainId);
        
        // Switch to BSC Testnet by default for development
        if (currentChainId !== 97 && currentChainId !== 56) {
          console.log('🔄 Switching to BSC network...');
          await switchToBSCNetwork(true); // true for testnet
        }
        
        console.log('💰 Getting wallet balance...');
        await getBalance(address);
        
        // Store in localStorage
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletConnected', 'true');
        
        console.log('🎉 Wallet connection process completed successfully!');
      } else {
        console.log('❌ No accounts returned from wallet');
        setError('No accounts found in wallet. Please make sure your wallet is unlocked.');
      }
    } catch (error: any) {
      console.error('💥 Error connecting wallet:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      
      let errorMessage = 'Failed to connect wallet';
      
      // Enhanced error handling
      if (error.code === 4001) {
        errorMessage = 'Connection request was rejected. Please try again and approve the connection.';
      } else if (error.code === -32603) {
        errorMessage = 'Internal wallet error. Please try refreshing the page and ensure your wallet is unlocked.';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request is pending. Please check your wallet for a pending connection request.';
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Connection request was rejected. Please approve the connection request in your wallet.';
      } else if (error.message?.includes('No active wallet')) {
        errorMessage = 'Wallet is not active. Please unlock your wallet and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
      console.log('🏁 Wallet connection attempt finished');
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
    diagnoseWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
