import { NextRequest, NextResponse } from 'next/server';

interface WhaleTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  token: string;
  timestamp: number;
  usdValue: number;
  type: 'buy' | 'sell' | 'transfer';
}

interface MarketAlert {
  id: string;
  type: 'pump' | 'dump' | 'whale_activity' | 'unusual_volume' | 'new_listing';
  severity: 'low' | 'medium' | 'high';
  token: string;
  message: string;
  timestamp: number;
  details: any;
}

interface MarketData {
  token: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  whaleActivity: number;
  suspiciousScore: number;
}

const BSCSCAN_API_KEY = 'Q9PMT4R2E15FT8KHA5X3PV92R779ABQG8H';

// Known whale addresses on BSC
const WHALE_ADDRESSES = [
  '0x8894e0a0c962cb723c1976a4421c95949be2d4e3', // Binance Hot Wallet
  '0x0681d8db095565fe8a346fa0277bffde9c0edbbf', // DeFi Whale
  '0x4b0bb1b6c0c4394eafc80accd1c0e4d8c0c0c0c0', // Example whale
];

// Mock data for demonstration - in production, connect to real data sources
let cachedWhaleTransactions: WhaleTransaction[] = [];
let cachedAlerts: MarketAlert[] = [];
let cachedTopTokens: MarketData[] = [];

export async function GET(request: NextRequest) {
  try {
    // Generate or fetch real-time market data
    await updateMarketData();

    return NextResponse.json({
      whaleTransactions: cachedWhaleTransactions,
      alerts: cachedAlerts,
      topTokens: cachedTopTokens,
      lastUpdated: Date.now()
    });
  } catch (error) {
    console.error('Market guardian error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}

async function updateMarketData() {
  try {
    // Fetch whale transactions
    await updateWhaleTransactions();
    
    // Generate market alerts
    await updateMarketAlerts();
    
    // Update token analysis
    await updateTokenAnalysis();
    
  } catch (error) {
    console.error('Error updating market data:', error);
    
    // Fallback to mock data if APIs fail
    generateMockData();
  }
}

async function updateWhaleTransactions() {
  try {
    // Get latest blocks
    const latestBlockResponse = await fetch(
      `https://api.bscscan.com/api?module=proxy&action=eth_blockNumber&apikey=${BSCSCAN_API_KEY}`
    );
    const latestBlockData = await latestBlockResponse.json();
    const latestBlock = parseInt(latestBlockData.result, 16);

    const transactions: WhaleTransaction[] = [];

    // Check recent transactions for whale addresses
    for (const whaleAddress of WHALE_ADDRESSES.slice(0, 2)) { // Limit to avoid rate limits
      try {
        const txResponse = await fetch(
          `https://api.bscscan.com/api?module=account&action=txlist&address=${whaleAddress}&startblock=${latestBlock - 1000}&endblock=${latestBlock}&sort=desc&apikey=${BSCSCAN_API_KEY}`
        );
        const txData = await txResponse.json();

        if (txData.result && Array.isArray(txData.result)) {
          for (const tx of txData.result.slice(0, 5)) { // Limit transactions per address
            const valueInEth = parseFloat(tx.value) / 1e18;
            const usdValue = valueInEth * 300; // Approximate BNB price

            if (usdValue > 10000) { // Only track transactions > $10k
              transactions.push({
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                token: 'BNB',
                timestamp: parseInt(tx.timeStamp) * 1000,
                usdValue,
                type: determineTransactionType(tx.from, tx.to, whaleAddress)
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching transactions for ${whaleAddress}:`, error);
      }
    }

    cachedWhaleTransactions = transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

  } catch (error) {
    console.error('Error updating whale transactions:', error);
  }
}

async function updateMarketAlerts() {
  const alerts: MarketAlert[] = [];
  const now = Date.now();

  try {
    // Analyze whale transactions for alerts
    for (const tx of cachedWhaleTransactions) {
      if (tx.usdValue > 100000) { // Transactions > $100k
        alerts.push({
          id: `whale_${tx.hash}`,
          type: 'whale_activity',
          severity: tx.usdValue > 1000000 ? 'high' : 'medium',
          token: tx.token,
          message: `Large ${tx.type} transaction detected: ${formatNumber(tx.usdValue)} by whale ${tx.from.slice(0, 8)}...`,
          timestamp: tx.timestamp,
          details: { transaction: tx }
        });
      }
    }

    // Check for pump/dump patterns (mock analysis)
    const suspiciousPatterns = analyzePumpDumpPatterns();
    alerts.push(...suspiciousPatterns);

    // Check for unusual volume (mock data)
    const volumeAlerts = analyzeUnusualVolume();
    alerts.push(...volumeAlerts);

    cachedAlerts = alerts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);

  } catch (error) {
    console.error('Error updating market alerts:', error);
  }
}

async function updateTokenAnalysis() {
  try {
    // Get BNB price from Binance
    const bnbResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BNBUSDT');
    const bnbData = await bnbResponse.json();

    const tokens: MarketData[] = [
      {
        token: 'BNB',
        price: parseFloat(bnbData.price || '300'),
        change24h: parseFloat(bnbData.priceChangePercent || '0'),
        volume24h: parseFloat(bnbData.volume || '0') * parseFloat(bnbData.price || '300'),
        marketCap: parseFloat(bnbData.price || '300') * 150000000, // Approximate BNB supply
        whaleActivity: cachedWhaleTransactions.filter(tx => tx.token === 'BNB').length,
        suspiciousScore: calculateSuspiciousScore('BNB', parseFloat(bnbData.priceChangePercent || '0'))
      }
    ];

    // Add mock data for other popular BSC tokens
    const popularTokens = [
      { symbol: 'CAKE', price: 2.5, change: -1.2, volume: 15000000 },
      { symbol: 'USDT', price: 1.0, change: 0.1, volume: 45000000 },
      { symbol: 'BUSD', price: 1.0, change: 0.0, volume: 25000000 },
      { symbol: 'ADA', price: 0.45, change: 3.1, volume: 8000000 }
    ];

    for (const token of popularTokens) {
      tokens.push({
        token: token.symbol,
        price: token.price,
        change24h: token.change,
        volume24h: token.volume,
        marketCap: token.price * 1000000000, // Mock market cap
        whaleActivity: Math.floor(Math.random() * 5),
        suspiciousScore: calculateSuspiciousScore(token.symbol, token.change)
      });
    }

    cachedTopTokens = tokens;

  } catch (error) {
    console.error('Error updating token analysis:', error);
    generateMockTokenData();
  }
}

function determineTransactionType(from: string, to: string, whaleAddress: string): 'buy' | 'sell' | 'transfer' {
  const knownExchanges = [
    '0x10ed43c718714eb63d5aa57b78b54704e256024e', // PancakeSwap
    '0x13f4ea83d0bd40e75c8222255bc855a974568dd4', // PancakeSwap V2
  ];

  if (from.toLowerCase() === whaleAddress.toLowerCase()) {
    if (knownExchanges.includes(to.toLowerCase())) {
      return 'sell';
    }
    return 'transfer';
  } else if (to.toLowerCase() === whaleAddress.toLowerCase()) {
    if (knownExchanges.includes(from.toLowerCase())) {
      return 'buy';
    }
    return 'transfer';
  }
  
  return 'transfer';
}

function analyzePumpDumpPatterns(): MarketAlert[] {
  const alerts: MarketAlert[] = [];
  const now = Date.now();

  // Mock pump/dump detection
  if (Math.random() > 0.8) { // 20% chance of suspicious activity
    alerts.push({
      id: `pump_${now}`,
      type: 'pump',
      severity: 'medium',
      token: 'UNKNOWN_TOKEN',
      message: 'Potential pump detected: Token price increased 500% in 10 minutes with unusual volume',
      timestamp: now - Math.random() * 3600000, // Random time in last hour
      details: { priceChange: 500, timeframe: 10 }
    });
  }

  return alerts;
}

function analyzeUnusualVolume(): MarketAlert[] {
  const alerts: MarketAlert[] = [];
  const now = Date.now();

  // Mock unusual volume detection
  if (Math.random() > 0.7) { // 30% chance
    alerts.push({
      id: `volume_${now}`,
      type: 'unusual_volume',
      severity: 'low',
      token: 'CAKE',
      message: 'Unusual trading volume detected: 300% above normal levels',
      timestamp: now - Math.random() * 1800000, // Random time in last 30 minutes
      details: { volumeIncrease: 300 }
    });
  }

  return alerts;
}

function calculateSuspiciousScore(symbol: string, priceChange: number): number {
  let score = 10; // Base score

  // Price change factor
  const absChange = Math.abs(priceChange);
  if (absChange > 50) score += 40;
  else if (absChange > 20) score += 20;
  else if (absChange > 10) score += 10;

  // Volume factor (mock)
  const volumeMultiplier = Math.random() * 2;
  if (volumeMultiplier > 1.5) score += 20;

  // Whale activity factor
  const whaleCount = cachedWhaleTransactions.filter(tx => tx.token === symbol).length;
  score += whaleCount * 5;

  // Random market factors
  score += Math.random() * 20;

  return Math.min(100, Math.max(0, score));
}

function generateMockData() {
  // Generate mock whale transactions
  cachedWhaleTransactions = [
    {
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      from: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
      to: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
      value: '1000000000000000000000',
      token: 'BNB',
      timestamp: Date.now() - 300000,
      usdValue: 300000,
      type: 'sell'
    }
  ];

  // Generate mock alerts
  cachedAlerts = [
    {
      id: 'alert_1',
      type: 'whale_activity',
      severity: 'high',
      token: 'BNB',
      message: 'Large sell order detected: $300K by known whale',
      timestamp: Date.now() - 300000,
      details: {}
    }
  ];

  // Generate mock token data
  generateMockTokenData();
}

function generateMockTokenData() {
  cachedTopTokens = [
    {
      token: 'BNB',
      price: 300,
      change24h: -2.5,
      volume24h: 1200000000,
      marketCap: 45000000000,
      whaleActivity: 3,
      suspiciousScore: 25
    },
    {
      token: 'CAKE',
      price: 2.5,
      change24h: 1.8,
      volume24h: 15000000,
      marketCap: 500000000,
      whaleActivity: 1,
      suspiciousScore: 15
    }
  ];
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}
