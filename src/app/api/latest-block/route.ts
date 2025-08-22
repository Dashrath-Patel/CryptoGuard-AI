// app/api/latest-block/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `https://api.bscscan.com/api?module=proxy&action=eth_blockNumber&apikey=${process.env.BSCSCAN_API_KEY}`
    );
    const data = await response.json();
    
    if (data.result) {
      const blockNumber = parseInt(data.result, 16);
      return NextResponse.json({
        blockNumber,
        timestamp: new Date().toISOString(),
        chainId: 56,
        network: 'BNB Smart Chain'
      });
    }
    
    // Fallback data
    return NextResponse.json({
      blockNumber: 45000000,
      timestamp: new Date().toISOString(),
      chainId: 56,
      network: 'BNB Smart Chain (Fallback)'
    });

  } catch (error) {
    console.error('Latest block API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest block' },
      { status: 500 }
    );
  }
}
