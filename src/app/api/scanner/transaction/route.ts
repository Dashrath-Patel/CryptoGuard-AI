// app/api/scanner/transaction/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { txHash } = await request.json();

    if (!txHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      );
    }

    // Mock transaction analysis for development
    const suspiciousPatterns = [] as string[];
    
    // Add random suspicious patterns for demo
    if (Math.random() > 0.8) {
      suspiciousPatterns.push('Unusually high gas price');
    }
    
    if (Math.random() > 0.9) {
      suspiciousPatterns.push('Transaction failed');
    }
    
    if (Math.random() > 0.85) {
      suspiciousPatterns.push('Interaction with unverified contract');
    }

    const mockAnalysis = {
      hash: txHash,
      riskLevel: suspiciousPatterns.length === 0 ? 'low' : 
                 suspiciousPatterns.length <= 2 ? 'medium' : 'high' as 'low' | 'medium' | 'high',
      suspiciousPatterns,
      gasUsage: (Math.floor(Math.random() * 500000) + 21000).toString(),
      contractInteractions: [
        '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
        '0xA0b86a33E6441E75976C327d2B9C19c3D3d0a90F'  // Mock contract
      ].slice(0, Math.floor(Math.random() * 3)),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(mockAnalysis);

  } catch (error) {
    console.error('Transaction analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze transaction' },
      { status: 500 }
    );
  }
}
