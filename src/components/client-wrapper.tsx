"use client";
import { useEffect, useState } from 'react';
import { WalletProvider } from '@/contexts/WalletContext';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2 mx-auto"></div>
          <div className="text-sm">Loading CryptoGuard AI...</div>
        </div>
      </div>
    );
  }

  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  );
}
