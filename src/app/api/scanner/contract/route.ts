// app/api/scanner/contract/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BNBChainSecurityScanner } from '@/lib/bnb-chain-security-scanner';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 }
      );
    }

    // For development, use mock analysis with BNB Chain specifics
    // In production, replace with: const scanner = new BNBChainSecurityScanner();
    // const result = await scanner.analyzeContract(address);

    const mockAnalysis = {
      address,
      riskScore: Math.floor(Math.random() * 60) + 20, // 20-80 (varied risk)
      status: Math.random() > 0.7 ? 'warning' : 'safe' as 'safe' | 'warning' | 'danger',
      threats: [] as string[],
      recommendations: [
        'Verify BEP-20 contract source code on BSCScan',
        'Check for recent security audits',
        'Review contract ownership and permissions',
        'Verify liquidity lock status on PancakeSwap',
        'Check for honeypot characteristics'
      ],
      contractDetails: {
        isVerified: Math.random() > 0.3,
        compiler: 'v0.8.19+commit.7dd6d404',
        hasProxyPattern: Math.random() > 0.7,
        hasUpgradeability: Math.random() > 0.8,
        ownershipRisk: Math.random() > 0.5 ? 'low' as const : 'medium' as const,
        vulnerabilities: [] as string[],
        isBEP20: Math.random() > 0.2, // Most contracts on BSC are BEP-20
        canMint: Math.random() > 0.6,
        canPause: Math.random() > 0.8,
        hasBlacklist: Math.random() > 0.7,
        liquidityLocked: Math.random() > 0.4,
        isHoneypot: Math.random() > 0.9,
        rugPullRisk: Math.random() > 0.6 ? 'low' as const : 
                     Math.random() > 0.3 ? 'medium' as const : 'high' as const
      },
      lastScanned: new Date().toISOString()
    };

    // Add BNB-specific threats for demo
    if (!mockAnalysis.contractDetails.isVerified) {
      mockAnalysis.threats.push('BEP-20 contract source code not verified on BSCScan');
      mockAnalysis.riskScore += 25;
    }

    if (mockAnalysis.contractDetails.canMint) {
      mockAnalysis.threats.push('Contract can mint unlimited BEP-20 tokens');
      mockAnalysis.riskScore += 20;
    }

    if (!mockAnalysis.contractDetails.liquidityLocked) {
      mockAnalysis.threats.push('PancakeSwap liquidity not locked - rug pull risk');
      mockAnalysis.riskScore += 30;
    }

    if (mockAnalysis.contractDetails.hasBlacklist) {
      mockAnalysis.threats.push('Contract can blacklist addresses from trading');
      mockAnalysis.riskScore += 15;
    }

    if (mockAnalysis.contractDetails.isHoneypot) {
      mockAnalysis.threats.push('⚠️ HONEYPOT DETECTED - Cannot sell tokens');
      mockAnalysis.riskScore += 60;
    }

    if (Math.random() > 0.8) {
      mockAnalysis.threats.push('High gas consumption on BNB Chain detected');
      mockAnalysis.riskScore += 10;
    }

    // Adjust status based on risk score
    if (mockAnalysis.riskScore > 70) {
      mockAnalysis.status = 'danger';
    } else if (mockAnalysis.riskScore > 40) {
      mockAnalysis.status = 'warning';
    }

    return NextResponse.json(mockAnalysis);

  } catch (error) {
    console.error('BNB contract analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze BNB Chain contract' },
      { status: 500 }
    );
  }
}
