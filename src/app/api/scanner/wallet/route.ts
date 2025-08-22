// app/api/scanner/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BNBChainSecurityScanner } from '@/lib/bnb-chain-security-scanner';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // For development, use mock analysis with BNB Chain specifics
    // In production, replace with: const scanner = new BNBChainSecurityScanner();
    // const result = await scanner.analyzeWallet(address);

    const mockAnalysis = {
      address,
      riskScore: Math.floor(Math.random() * 30) + 5, // 5-35 (low risk)
      status: 'safe' as 'safe' | 'warning' | 'danger',
      threats: [] as string[],
      recommendations: [
        'Use a hardware wallet for large BNB amounts',
        'Regularly review and revoke BEP-20 token approvals',
        'Be cautious with new DeFi protocols on BSC',
        'Monitor for unusual transaction patterns on BNB Chain'
      ],
      bnbBalance: (Math.random() * 10).toFixed(4),
      tokenCount: Math.floor(Math.random() * 15),
      networkInfo: {
        chainId: 56,
        networkName: 'BNB Smart Chain',
        gasPrice: '5 gwei',
        blockNumber: 12345678,
        bnbPrice: '$300.50'
      },
      lastScanned: new Date().toISOString()
    };

    // Add some random BNB-specific risk factors for demo
    if (Math.random() > 0.8) {
      mockAnalysis.threats.push('High-frequency PancakeSwap interactions detected');
      mockAnalysis.riskScore += 20;
    }

    if (Math.random() > 0.9) {
      mockAnalysis.threats.push('Interaction with unverified BEP-20 contracts');
      mockAnalysis.riskScore += 15;
    }

    if (Math.random() > 0.85) {
      mockAnalysis.threats.push('Multiple DeFi yield farming activities');
      mockAnalysis.riskScore += 10;
    }

    // Adjust status based on risk score
    if (mockAnalysis.riskScore > 60) {
      mockAnalysis.status = 'danger';
    } else if (mockAnalysis.riskScore > 30) {
      mockAnalysis.status = 'warning';
    }

    return NextResponse.json(mockAnalysis);

  } catch (error) {
    console.error('BNB wallet analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze BNB Chain wallet' },
      { status: 500 }
    );
  }
}
