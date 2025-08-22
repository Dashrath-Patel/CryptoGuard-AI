"use client";
import React, { useState, useEffect } from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Simulate wallet connection (replace with actual Web3 integration)
  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock wallet address (replace with actual wallet connection)
      const mockAddress = "0x742d35Cc6634C0532925a3b8D55d8dd6D8cE1a23";
      setWalletAddress(mockAddress);
      setIsConnected(true);
      
      // Store in localStorage for persistence
      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletAddress", mockAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
  };

  // Check for existing connection on component mount
  useEffect(() => {
    setIsClient(true);
    
    const connected = localStorage.getItem("walletConnected");
    const address = localStorage.getItem("walletAddress");
    
    if (connected === "true" && address) {
      setIsConnected(true);
      setWalletAddress(address);
    }
  }, []);

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Prevent hydration mismatch by not rendering connected state until client-side
  if (!isClient) {
    return (
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 opacity-50"
      >
        <span>Loading...</span>
      </HoverBorderGradient>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 bg-green-900/20 border border-green-500/20 rounded-lg">
          <span className="text-green-400 text-sm font-mono">
            {truncateAddress(walletAddress)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="px-3 py-2 text-red-400 hover:text-red-300 text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <HoverBorderGradient
      containerClassName="rounded-full"
      as="button"
      onClick={isConnecting ? undefined : connectWallet}
      className={`dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 ${
        isConnecting ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isConnecting ? (
        <>
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span>Connect Wallet</span>
        </>
      )}
    </HoverBorderGradient>
  );
}
