import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet') || '0x546da0a471af360f3dedf52b74408f2aa6c9d116';
    
    const BSC_API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY;
    const BSC_API_BASE = 'https://api.etherscan.io/v2/api'; // Etherscan V2 unified endpoint
    const BSC_CHAIN_ID = '97'; // BSC Testnet Chain ID
    
    console.log('🔍 Testing Etherscan V2 API for BSC Testnet with wallet:', walletAddress);
    console.log('🔑 API Key:', BSC_API_KEY?.substring(0, 8) + '...');
    console.log('🌐 Chain ID:', BSC_CHAIN_ID, '(BSC Testnet)');
    console.log('📡 Endpoint:', BSC_API_BASE);
    
    // Test 1: Balance check (V2 with chainid=97)
    const balanceURL = `${BSC_API_BASE}?module=account&action=balance&address=${walletAddress}&tag=latest&chainid=${BSC_CHAIN_ID}&apikey=${BSC_API_KEY}`;
    console.log('Making balance API call:', balanceURL);
    const balanceResponse = await fetch(balanceURL);
    const balanceData = await balanceResponse.json();
    console.log('Balance API Response:', JSON.stringify(balanceData, null, 2));
    
    // Test 2: Transaction list (V2 with chainid=97, limited to 5)
    const txURL = `${BSC_API_BASE}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&chainid=${BSC_CHAIN_ID}&apikey=${BSC_API_KEY}`;
    console.log('Making transaction API call:', txURL);
    const txResponse = await fetch(txURL);
    const txData = await txResponse.json();
    console.log('Transaction API Response:', JSON.stringify(txData, null, 2));
    
    // Test 3: Token transfers (V2 with chainid=97)
    const tokenURL = `${BSC_API_BASE}?module=account&action=tokentx&address=${walletAddress}&page=1&offset=5&sort=desc&chainid=${BSC_CHAIN_ID}&apikey=${BSC_API_KEY}`;
    console.log('Making token transfer API call:', tokenURL);
    const tokenResponse = await fetch(tokenURL);
    const tokenData = await tokenResponse.json();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      walletAddress,
      apiKey: BSC_API_KEY?.substring(0, 8) + '...',
      tests: {
        balance: {
          status: balanceData.status,
          message: balanceData.message,
          result: balanceData.result,
          bnb: balanceData.result ? (parseFloat(balanceData.result) / 1e18).toFixed(6) : '0'
        },
        transactions: {
          status: txData.status,
          message: txData.message,
          count: Array.isArray(txData.result) ? txData.result.length : 0,
          sample: Array.isArray(txData.result) && txData.result.length > 0 ? {
            hash: txData.result[0].hash?.substring(0, 16) + '...',
            from: txData.result[0].from?.substring(0, 8) + '...',
            to: txData.result[0].to?.substring(0, 8) + '...',
            value: txData.result[0].value,
            timeStamp: txData.result[0].timeStamp
          } : null
        },
        tokenTransfers: {
          status: tokenData.status,
          message: tokenData.message,
          count: Array.isArray(tokenData.result) ? tokenData.result.length : 0,
          sample: Array.isArray(tokenData.result) && tokenData.result.length > 0 ? {
            tokenSymbol: tokenData.result[0].tokenSymbol,
            tokenName: tokenData.result[0].tokenName,
            value: tokenData.result[0].value,
            from: tokenData.result[0].from?.substring(0, 8) + '...'
          } : null
        }
      },
      recommendations: [
        balanceData.status === '0' ? '❌ Balance API failed - Check API key validity' : '✅ Balance API working',
        txData.status === '0' ? '❌ Transaction API failed - Check API key and wallet activity' : '✅ Transaction API working',
        tokenData.status === '0' ? '❌ Token API failed - Check API key and token activity' : '✅ Token API working'
      ]
    });
    
  } catch (error: any) {
    console.error('BSC API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
