import { NextRequest, NextResponse } from 'next/server';

interface PriceAlert {
  id: string;
  token: string;
  tokenAddress: string;
  currentPrice: number;
  change1h: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  alerts: Array<{
    type: 'price_spike' | 'price_drop' | 'volume_spike' | 'market_cap_change';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: number;
    triggerValue: number;
  }>;
  technicalIndicators: {
    rsi: number;
    macd: number;
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
    };
    support: number;
    resistance: number;
  };
  sentiment: {
    score: number; // -100 to +100
    signals: string[];
  };
}

interface MarketOverview {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  fearGreedIndex: number;
  trendingTokens: string[];
  topGainers: Array<{
    token: string;
    change24h: number;
  }>;
  topLosers: Array<{
    token: string;
    change24h: number;
  }>;
}

const MAJOR_TOKENS = [
  { symbol: 'BNB', address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', binanceSymbol: 'BNBUSDT' },
  { symbol: 'CAKE', address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', binanceSymbol: 'CAKEUSDT' },
  { symbol: 'ADA', address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47', binanceSymbol: 'ADAUSDT' },
  { symbol: 'DOT', address: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402', binanceSymbol: 'DOTUSDT' },
  { symbol: 'LINK', address: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd', binanceSymbol: 'LINKUSDT' }
];

// Cache for price data
let cachedPriceData: Map<string, PriceAlert> = new Map();
let cachedMarketOverview: MarketOverview | null = null;
let lastPriceUpdate = 0;

const PRICE_CACHE_DURATION = 10000; // 10 seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const now = Date.now();

    // Check if we need to update price data
    if (now - lastPriceUpdate > PRICE_CACHE_DURATION) {
      await updatePriceData();
      lastPriceUpdate = now;
    }

    if (token) {
      // Return data for specific token
      const tokenData = cachedPriceData.get(token.toUpperCase());
      if (!tokenData) {
        return NextResponse.json(
          { error: `Price data not found for token: ${token}` },
          { status: 404 }
        );
      }
      return NextResponse.json(tokenData);
    } else {
      // Return market overview and all token data
      return NextResponse.json({
        marketOverview: cachedMarketOverview,
        tokens: Array.from(cachedPriceData.values()),
        lastUpdated: lastPriceUpdate
      });
    }
  } catch (error) {
    console.error('Price monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
}

async function updatePriceData() {
  try {
    // Fetch price data for all major tokens
    const pricePromises = MAJOR_TOKENS.map(token => fetchTokenPriceData(token));
    const priceResults = await Promise.allSettled(pricePromises);

    // Update cached data
    priceResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const token = MAJOR_TOKENS[index];
        cachedPriceData.set(token.symbol, result.value);
      }
    });

    // Update market overview
    await updateMarketOverview();

  } catch (error) {
    console.error('Error updating price data:', error);
    
    // Generate mock data if API fails
    generateMockPriceData();
  }
}

async function fetchTokenPriceData(token: { symbol: string; address: string; binanceSymbol: string }): Promise<PriceAlert> {
  try {
    // Fetch 24hr ticker data from Binance
    const tickerResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${token.binanceSymbol}`);
    const tickerData = await tickerResponse.json();

    // Fetch recent klines for technical analysis
    const klinesResponse = await fetch(`https://api.binance.com/api/v3/klines?symbol=${token.binanceSymbol}&interval=1h&limit=24`);
    const klinesData = await klinesResponse.json();

    const currentPrice = parseFloat(tickerData.lastPrice);
    const change24h = parseFloat(tickerData.priceChangePercent);
    const volume24h = parseFloat(tickerData.volume) * currentPrice;

    // Calculate technical indicators
    const technicalIndicators = calculateTechnicalIndicators(klinesData);
    
    // Generate alerts based on price movement
    const alerts = generatePriceAlerts(token.symbol, currentPrice, change24h, volume24h);
    
    // Calculate sentiment
    const sentiment = calculateSentiment(change24h, volume24h, technicalIndicators);

    return {
      id: `${token.symbol}_${Date.now()}`,
      token: token.symbol,
      tokenAddress: token.address,
      currentPrice,
      change1h: calculateChange1h(klinesData),
      change24h,
      change7d: Math.random() * 20 - 10, // Mock 7d change
      volume24h,
      marketCap: currentPrice * getMockSupply(token.symbol),
      alerts,
      technicalIndicators,
      sentiment
    };
  } catch (error) {
    console.error(`Error fetching price data for ${token.symbol}:`, error);
    return generateMockTokenPriceData(token);
  }
}

function calculateTechnicalIndicators(klinesData: any[]) {
  if (!klinesData || klinesData.length < 14) {
    return generateMockTechnicalIndicators();
  }

  const prices = klinesData.map(kline => parseFloat(kline[4])); // Closing prices
  const volumes = klinesData.map(kline => parseFloat(kline[5]));

  // Simple RSI calculation (14 periods)
  const rsi = calculateRSI(prices);
  
  // Simple MACD calculation
  const macd = calculateMACD(prices);
  
  // Bollinger Bands
  const bollingerBands = calculateBollingerBands(prices);
  
  // Support and Resistance levels
  const support = Math.min(...prices.slice(-10));
  const resistance = Math.max(...prices.slice(-10));

  return {
    rsi,
    macd,
    bollingerBands,
    support,
    resistance
  };
}

function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50; // Neutral RSI
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateMACD(prices: number[]): number {
  if (prices.length < 26) return 0;
  
  // Simple EMA calculation
  const ema12 = calculateEMA(prices.slice(-12), 12);
  const ema26 = calculateEMA(prices.slice(-26), 26);
  
  return ema12 - ema26;
}

function calculateEMA(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  
  const multiplier = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
  }
  
  return ema;
}

function calculateBollingerBands(prices: number[], period: number = 20) {
  if (prices.length < period) {
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    return { upper: avg * 1.02, middle: avg, lower: avg * 0.98 };
  }
  
  const recentPrices = prices.slice(-period);
  const avg = recentPrices.reduce((sum, price) => sum + price, 0) / period;
  
  const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  
  return {
    upper: avg + (stdDev * 2),
    middle: avg,
    lower: avg - (stdDev * 2)
  };
}

function calculateChange1h(klinesData: any[]): number {
  if (!klinesData || klinesData.length < 2) return 0;
  
  const currentPrice = parseFloat(klinesData[klinesData.length - 1][4]);
  const price1hAgo = parseFloat(klinesData[klinesData.length - 2][4]);
  
  return ((currentPrice - price1hAgo) / price1hAgo) * 100;
}

function generatePriceAlerts(token: string, currentPrice: number, change24h: number, volume24h: number) {
  const alerts = [];
  const now = Date.now();

  // Price spike alert
  if (change24h > 15) {
    alerts.push({
      type: 'price_spike' as const,
      severity: change24h > 50 ? 'critical' as const : change24h > 30 ? 'high' as const : 'medium' as const,
      message: `${token} price spiked ${change24h.toFixed(2)}% in 24h`,
      timestamp: now,
      triggerValue: change24h
    });
  }

  // Price drop alert
  if (change24h < -15) {
    alerts.push({
      type: 'price_drop' as const,
      severity: change24h < -50 ? 'critical' as const : change24h < -30 ? 'high' as const : 'medium' as const,
      message: `${token} price dropped ${Math.abs(change24h).toFixed(2)}% in 24h`,
      timestamp: now,
      triggerValue: Math.abs(change24h)
    });
  }

  // Volume spike alert
  const normalVolume = getMockNormalVolume(token);
  if (volume24h > normalVolume * 3) {
    alerts.push({
      type: 'volume_spike' as const,
      severity: volume24h > normalVolume * 10 ? 'high' as const : 'medium' as const,
      message: `${token} volume increased ${((volume24h / normalVolume) * 100).toFixed(0)}% above normal`,
      timestamp: now,
      triggerValue: volume24h / normalVolume
    });
  }

  return alerts;
}

function calculateSentiment(change24h: number, volume24h: number, technicalIndicators: any) {
  let score = 0;
  const signals = [];

  // Price change sentiment
  if (change24h > 10) {
    score += 30;
    signals.push('Strong bullish momentum');
  } else if (change24h > 5) {
    score += 15;
    signals.push('Bullish trend');
  } else if (change24h < -10) {
    score -= 30;
    signals.push('Strong bearish momentum');
  } else if (change24h < -5) {
    score -= 15;
    signals.push('Bearish trend');
  }

  // RSI sentiment
  if (technicalIndicators.rsi > 70) {
    score -= 10;
    signals.push('Overbought (RSI > 70)');
  } else if (technicalIndicators.rsi < 30) {
    score += 10;
    signals.push('Oversold (RSI < 30)');
  }

  // MACD sentiment
  if (technicalIndicators.macd > 0) {
    score += 5;
    signals.push('MACD bullish');
  } else {
    score -= 5;
    signals.push('MACD bearish');
  }

  // Volume sentiment
  const normalVolume = 10000000; // Mock normal volume
  if (volume24h > normalVolume * 2) {
    score += 10;
    signals.push('High volume confirmation');
  }

  return {
    score: Math.max(-100, Math.min(100, score)),
    signals
  };
}

function getMockSupply(token: string): number {
  const supplies: { [key: string]: number } = {
    'BNB': 150000000,
    'CAKE': 300000000,
    'ADA': 35000000000,
    'DOT': 1200000000,
    'LINK': 1000000000
  };
  return supplies[token] || 1000000000;
}

function getMockNormalVolume(token: string): number {
  const volumes: { [key: string]: number } = {
    'BNB': 1000000000,
    'CAKE': 50000000,
    'ADA': 800000000,
    'DOT': 400000000,
    'LINK': 600000000
  };
  return volumes[token] || 100000000;
}

async function updateMarketOverview() {
  try {
    // Calculate market overview from cached token data
    const tokens = Array.from(cachedPriceData.values());
    
    const totalMarketCap = tokens.reduce((sum, token) => sum + token.marketCap, 0);
    const totalVolume24h = tokens.reduce((sum, token) => sum + token.volume24h, 0);
    
    const gainers = tokens
      .filter(token => token.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 5)
      .map(token => ({ token: token.token, change24h: token.change24h }));
    
    const losers = tokens
      .filter(token => token.change24h < 0)
      .sort((a, b) => a.change24h - b.change24h)
      .slice(0, 5)
      .map(token => ({ token: token.token, change24h: token.change24h }));

    cachedMarketOverview = {
      totalMarketCap,
      totalVolume24h,
      btcDominance: 42.5, // Mock BTC dominance
      fearGreedIndex: Math.floor(Math.random() * 100),
      trendingTokens: tokens.slice(0, 5).map(token => token.token),
      topGainers: gainers,
      topLosers: losers
    };
  } catch (error) {
    console.error('Error updating market overview:', error);
  }
}

function generateMockPriceData() {
  MAJOR_TOKENS.forEach(token => {
    cachedPriceData.set(token.symbol, generateMockTokenPriceData(token));
  });
}

function generateMockTokenPriceData(token: { symbol: string; address: string; binanceSymbol: string }): PriceAlert {
  const mockPrices: { [key: string]: number } = {
    'BNB': 300,
    'CAKE': 2.5,
    'ADA': 0.45,
    'DOT': 6.8,
    'LINK': 15.2
  };

  const currentPrice = mockPrices[token.symbol] || 1;
  const change24h = (Math.random() - 0.5) * 20; // -10% to +10%

  return {
    id: `${token.symbol}_${Date.now()}`,
    token: token.symbol,
    tokenAddress: token.address,
    currentPrice,
    change1h: (Math.random() - 0.5) * 5,
    change24h,
    change7d: (Math.random() - 0.5) * 30,
    volume24h: getMockNormalVolume(token.symbol) * (0.5 + Math.random()),
    marketCap: currentPrice * getMockSupply(token.symbol),
    alerts: generatePriceAlerts(token.symbol, currentPrice, change24h, getMockNormalVolume(token.symbol)),
    technicalIndicators: generateMockTechnicalIndicators(),
    sentiment: {
      score: Math.floor((Math.random() - 0.5) * 200),
      signals: ['Mock sentiment analysis']
    }
  };
}

function generateMockTechnicalIndicators() {
  return {
    rsi: 30 + Math.random() * 40, // 30-70 range
    macd: (Math.random() - 0.5) * 2,
    bollingerBands: {
      upper: 105,
      middle: 100,
      lower: 95
    },
    support: 95,
    resistance: 105
  };
}
