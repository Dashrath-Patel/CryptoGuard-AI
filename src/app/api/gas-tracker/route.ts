// app/api/gas-tracker/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.BSCSCAN_API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === '1') {
      return NextResponse.json({
        gasPrice: `${data.result.SafeGasPrice} gwei`,
        fastGasPrice: `${data.result.FastGasPrice} gwei`,
        standardGasPrice: `${data.result.StandardGasPrice} gwei`,
        safeGasPrice: `${data.result.SafeGasPrice} gwei`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Fallback data
    return NextResponse.json({
      gasPrice: '5 gwei',
      fastGasPrice: '6 gwei',
      standardGasPrice: '5 gwei',
      safeGasPrice: '4 gwei',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gas tracker API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gas prices' },
      { status: 500 }
    );
  }
}
