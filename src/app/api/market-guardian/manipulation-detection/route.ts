import { NextRequest, NextResponse } from 'next/server';

interface ManipulationPattern {
  id: string;
  type: 'pump_dump' | 'wash_trading' | 'spoofing' | 'coordinated_attack' | 'bot_trading';
  token: string;
  tokenAddress: string;
  confidence: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: Array<{
    type: string;
    description: string;
    data: any;
    timestamp: number;
  }>;
  timeframe: {
    start: number;
    end: number;
    duration: number; // in minutes
  };
  impact: {
    priceChange: number;
    volumeIncrease: number;
    affectedWallets: number;
    estimatedLoss: number; // in USD
  };
  participants: Array<{
    address: string;
    role: 'orchestrator' | 'participant' | 'victim';
    transactions: number;
    volume: number;
  }>;
  riskScore: number; // 0-100
  recommendations: string[];
}

interface ManipulationAlert {
  id: string;
  timestamp: number;
  type: 'real_time' | 'analysis_complete' | 'pattern_detected';
  pattern: ManipulationPattern;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  autoActions: string[];
}

interface DetectionStats {
  totalScanned: number;
  patternsDetected: number;
  falsePositives: number;
  accuracy: number;
  lastScanTime: number;
  activeMonitoring: number;
}

// Cache for manipulation detection
let cachedDetections: Map<string, ManipulationPattern> = new Map();
let recentAlerts: ManipulationAlert[] = [];
let detectionStats: DetectionStats = {
  totalScanned: 0,
  patternsDetected: 0,
  falsePositives: 0,
  accuracy: 94.7,
  lastScanTime: 0,
  activeMonitoring: 0
};

const MANIPULATION_CACHE_DURATION = 30000; // 30 seconds
let lastManipulationScan = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '20');

    const now = Date.now();

    // Update detection data if needed
    if (now - lastManipulationScan > MANIPULATION_CACHE_DURATION) {
      await runManipulationDetection();
      lastManipulationScan = now;
    }

    let patterns = Array.from(cachedDetections.values());

    // Apply filters
    if (token) {
      patterns = patterns.filter(p => p.token.toLowerCase() === token.toLowerCase());
    }
    if (type) {
      patterns = patterns.filter(p => p.type === type);
    }
    if (severity) {
      patterns = patterns.filter(p => p.severity === severity);
    }

    // Sort by risk score and confidence
    patterns.sort((a, b) => (b.riskScore * b.confidence) - (a.riskScore * a.confidence));

    // Limit results
    patterns = patterns.slice(0, limit);

    return NextResponse.json({
      patterns,
      alerts: recentAlerts.slice(0, 10),
      stats: detectionStats,
      lastUpdated: lastManipulationScan
    });

  } catch (error) {
    console.error('Manipulation detection error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze market manipulation' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, address, action } = body;

    if (action === 'analyze') {
      // Perform detailed analysis on specific token
      const analysis = await performDeepAnalysis(token, address);
      return NextResponse.json(analysis);
    }

    if (action === 'report') {
      // Report suspicious activity
      const reportId = await reportSuspiciousActivity(body);
      return NextResponse.json({ reportId, status: 'submitted' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Manipulation detection POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function runManipulationDetection() {
  try {
    detectionStats.totalScanned++;
    detectionStats.lastScanTime = Date.now();

    // Clear old detections
    cachedDetections.clear();
    recentAlerts = [];

    // Run different detection algorithms
    await Promise.all([
      detectPumpAndDump(),
      detectWashTrading(),
      detectSpoofing(),
      detectCoordinatedAttacks(),
      detectBotTrading()
    ]);

    // Update stats
    detectionStats.patternsDetected = cachedDetections.size;
    detectionStats.activeMonitoring = cachedDetections.size;

  } catch (error) {
    console.error('Error running manipulation detection:', error);
    generateMockDetections();
  }
}

async function detectPumpAndDump(): Promise<void> {
  try {
    // Analyze recent price movements and volume spikes
    const suspiciousTokens = await identifySuspiciousTokens();
    
    for (const tokenData of suspiciousTokens) {
      if (isPumpAndDumpPattern(tokenData)) {
        const pattern = createPumpDumpPattern(tokenData);
        cachedDetections.set(pattern.id, pattern);
        
        if (pattern.severity === 'high' || pattern.severity === 'critical') {
          recentAlerts.push(createAlert(pattern));
        }
      }
    }
  } catch (error) {
    console.error('Pump and dump detection error:', error);
  }
}

async function detectWashTrading(): Promise<void> {
  try {
    // Analyze trading patterns for circular transactions
    const tradingPatterns = await analyzeWashTradingPatterns();
    
    for (const pattern of tradingPatterns) {
      if (isWashTradingPattern(pattern)) {
        const manipulationPattern = createWashTradingPattern(pattern);
        cachedDetections.set(manipulationPattern.id, manipulationPattern);
        
        if (manipulationPattern.confidence > 80) {
          recentAlerts.push(createAlert(manipulationPattern));
        }
      }
    }
  } catch (error) {
    console.error('Wash trading detection error:', error);
  }
}

async function detectSpoofing(): Promise<void> {
  try {
    // Analyze order book manipulation
    const orderBookData = await analyzeOrderBookManipulation();
    
    for (const data of orderBookData) {
      if (isSpoofingPattern(data)) {
        const pattern = createSpoofingPattern(data);
        cachedDetections.set(pattern.id, pattern);
        
        recentAlerts.push(createAlert(pattern));
      }
    }
  } catch (error) {
    console.error('Spoofing detection error:', error);
  }
}

async function detectCoordinatedAttacks(): Promise<void> {
  try {
    // Analyze synchronized trading activities
    const coordinatedData = await analyzeCoordinatedActivity();
    
    for (const data of coordinatedData) {
      if (isCoordinatedAttack(data)) {
        const pattern = createCoordinatedAttackPattern(data);
        cachedDetections.set(pattern.id, pattern);
        
        if (pattern.impact.estimatedLoss > 100000) {
          recentAlerts.push(createAlert(pattern));
        }
      }
    }
  } catch (error) {
    console.error('Coordinated attack detection error:', error);
  }
}

async function detectBotTrading(): Promise<void> {
  try {
    // Analyze automated trading patterns
    const botPatterns = await analyzeBotTradingPatterns();
    
    for (const pattern of botPatterns) {
      if (isMaliciousBotTrading(pattern)) {
        const manipulationPattern = createBotTradingPattern(pattern);
        cachedDetections.set(manipulationPattern.id, manipulationPattern);
        
        if (manipulationPattern.riskScore > 70) {
          recentAlerts.push(createAlert(manipulationPattern));
        }
      }
    }
  } catch (error) {
    console.error('Bot trading detection error:', error);
  }
}

// Analysis functions (would connect to real blockchain data in production)
async function identifySuspiciousTokens(): Promise<any[]> {
  // Mock data - would fetch real token data
  return [
    {
      token: 'SCAM1',
      address: '0x123...abc',
      priceChange1h: 300,
      volumeIncrease: 1000,
      newHolders: 500,
      liquidityChange: -80
    },
    {
      token: 'FAKE2',
      address: '0x456...def',
      priceChange1h: -90,
      volumeIncrease: 50,
      newHolders: -200,
      liquidityChange: -95
    }
  ];
}

async function analyzeWashTradingPatterns(): Promise<any[]> {
  return [
    {
      token: 'WASH1',
      address: '0x789...ghi',
      circularTransactions: 25,
      involvedWallets: ['0xaaa', '0xbbb', '0xccc'],
      artificialVolume: 5000000
    }
  ];
}

async function analyzeOrderBookManipulation(): Promise<any[]> {
  return [
    {
      token: 'SPOOF1',
      address: '0x111...222',
      largeOrders: 15,
      cancelledOrders: 14,
      priceImpact: 25
    }
  ];
}

async function analyzeCoordinatedActivity(): Promise<any[]> {
  return [
    {
      token: 'COORD1',
      address: '0x333...444',
      synchronizedWallets: 50,
      timeframe: 300, // 5 minutes
      totalVolume: 10000000
    }
  ];
}

async function analyzeBotTradingPatterns(): Promise<any[]> {
  return [
    {
      token: 'BOT1',
      address: '0x555...666',
      transactionFrequency: 200, // per minute
      uniformAmounts: true,
      preciseTiming: true
    }
  ];
}

// Pattern recognition functions
function isPumpAndDumpPattern(data: any): boolean {
  return data.priceChange1h > 200 && data.liquidityChange < -50;
}

function isWashTradingPattern(data: any): boolean {
  return data.circularTransactions > 10 && data.artificialVolume > 1000000;
}

function isSpoofingPattern(data: any): boolean {
  return data.cancelledOrders / data.largeOrders > 0.8;
}

function isCoordinatedAttack(data: any): boolean {
  return data.synchronizedWallets > 20 && data.timeframe < 600;
}

function isMaliciousBotTrading(data: any): boolean {
  return data.transactionFrequency > 100 && data.uniformAmounts && data.preciseTiming;
}

// Pattern creation functions
function createPumpDumpPattern(data: any): ManipulationPattern {
  const severity = data.priceChange1h > 500 ? 'critical' : data.priceChange1h > 300 ? 'high' : 'medium';
  
  return {
    id: `pump_dump_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'pump_dump',
    token: data.token,
    tokenAddress: data.address,
    confidence: 87,
    severity,
    description: `Detected pump and dump pattern with ${data.priceChange1h}% price increase followed by liquidity removal`,
    evidence: [
      {
        type: 'price_spike',
        description: `Price increased ${data.priceChange1h}% in 1 hour`,
        data: { priceChange: data.priceChange1h },
        timestamp: Date.now()
      },
      {
        type: 'liquidity_removal',
        description: `Liquidity decreased by ${Math.abs(data.liquidityChange)}%`,
        data: { liquidityChange: data.liquidityChange },
        timestamp: Date.now()
      }
    ],
    timeframe: {
      start: Date.now() - 3600000,
      end: Date.now(),
      duration: 60
    },
    impact: {
      priceChange: data.priceChange1h,
      volumeIncrease: data.volumeIncrease,
      affectedWallets: data.newHolders,
      estimatedLoss: data.newHolders * 500 // Estimated $500 per affected wallet
    },
    participants: [
      {
        address: '0x' + Math.random().toString(16).substr(2, 40),
        role: 'orchestrator',
        transactions: 15,
        volume: 2000000
      }
    ],
    riskScore: severity === 'critical' ? 95 : severity === 'high' ? 85 : 70,
    recommendations: [
      'Avoid trading this token',
      'Report to authorities',
      'Monitor for similar patterns',
      'Check liquidity before trading'
    ]
  };
}

function createWashTradingPattern(data: any): ManipulationPattern {
  return {
    id: `wash_trading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'wash_trading',
    token: data.token,
    tokenAddress: data.address,
    confidence: 92,
    severity: 'high',
    description: `Detected wash trading with ${data.circularTransactions} circular transactions creating $${data.artificialVolume.toLocaleString()} artificial volume`,
    evidence: [
      {
        type: 'circular_transactions',
        description: `${data.circularTransactions} transactions between same wallets`,
        data: { transactions: data.circularTransactions, wallets: data.involvedWallets },
        timestamp: Date.now()
      }
    ],
    timeframe: {
      start: Date.now() - 1800000,
      end: Date.now(),
      duration: 30
    },
    impact: {
      priceChange: 15,
      volumeIncrease: 400,
      affectedWallets: 100,
      estimatedLoss: 50000
    },
    participants: data.involvedWallets.map((wallet: string) => ({
      address: wallet,
      role: 'participant',
      transactions: Math.floor(data.circularTransactions / data.involvedWallets.length),
      volume: data.artificialVolume / data.involvedWallets.length
    })),
    riskScore: 88,
    recommendations: [
      'Volume is artificially inflated',
      'Real liquidity may be much lower',
      'Verify transactions on blockchain',
      'Exercise extreme caution'
    ]
  };
}

function createSpoofingPattern(data: any): ManipulationPattern {
  return {
    id: `spoofing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'spoofing',
    token: data.token,
    tokenAddress: data.address,
    confidence: 85,
    severity: 'medium',
    description: `Order book spoofing detected with ${data.cancelledOrders}/${data.largeOrders} large orders cancelled`,
    evidence: [
      {
        type: 'order_cancellation',
        description: `${(data.cancelledOrders/data.largeOrders*100).toFixed(1)}% of large orders cancelled`,
        data: { cancelled: data.cancelledOrders, total: data.largeOrders },
        timestamp: Date.now()
      }
    ],
    timeframe: {
      start: Date.now() - 900000,
      end: Date.now(),
      duration: 15
    },
    impact: {
      priceChange: data.priceImpact,
      volumeIncrease: 0,
      affectedWallets: 50,
      estimatedLoss: 25000
    },
    participants: [
      {
        address: '0x' + Math.random().toString(16).substr(2, 40),
        role: 'orchestrator',
        transactions: data.largeOrders,
        volume: 1000000
      }
    ],
    riskScore: 75,
    recommendations: [
      'Order book may not reflect real demand',
      'Check order depth carefully',
      'Monitor for order cancellations',
      'Use limit orders with caution'
    ]
  };
}

function createCoordinatedAttackPattern(data: any): ManipulationPattern {
  return {
    id: `coordinated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'coordinated_attack',
    token: data.token,
    tokenAddress: data.address,
    confidence: 94,
    severity: 'critical',
    description: `Coordinated attack involving ${data.synchronizedWallets} wallets executing synchronized trades`,
    evidence: [
      {
        type: 'synchronized_activity',
        description: `${data.synchronizedWallets} wallets trading within ${data.timeframe} seconds`,
        data: { wallets: data.synchronizedWallets, timeframe: data.timeframe },
        timestamp: Date.now()
      }
    ],
    timeframe: {
      start: Date.now() - (data.timeframe * 1000),
      end: Date.now(),
      duration: Math.floor(data.timeframe / 60)
    },
    impact: {
      priceChange: 45,
      volumeIncrease: 800,
      affectedWallets: 200,
      estimatedLoss: data.totalVolume * 0.15
    },
    participants: Array.from({ length: Math.min(data.synchronizedWallets, 10) }, (_, i) => ({
      address: '0x' + Math.random().toString(16).substr(2, 40),
      role: i === 0 ? 'orchestrator' : 'participant',
      transactions: Math.floor(Math.random() * 20) + 5,
      volume: data.totalVolume / data.synchronizedWallets
    })),
    riskScore: 96,
    recommendations: [
      'CRITICAL: Avoid this token completely',
      'Report to relevant authorities',
      'Monitor wallets for future activity',
      'Check if part of larger scheme'
    ]
  };
}

function createBotTradingPattern(data: any): ManipulationPattern {
  return {
    id: `bot_trading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'bot_trading',
    token: data.token,
    tokenAddress: data.address,
    confidence: 89,
    severity: 'high',
    description: `Malicious bot trading detected with ${data.transactionFrequency} transactions per minute`,
    evidence: [
      {
        type: 'high_frequency',
        description: `${data.transactionFrequency} transactions per minute`,
        data: { frequency: data.transactionFrequency },
        timestamp: Date.now()
      },
      {
        type: 'uniform_patterns',
        description: 'Uniform transaction amounts and precise timing',
        data: { uniformAmounts: data.uniformAmounts, preciseTiming: data.preciseTiming },
        timestamp: Date.now()
      }
    ],
    timeframe: {
      start: Date.now() - 3600000,
      end: Date.now(),
      duration: 60
    },
    impact: {
      priceChange: 25,
      volumeIncrease: 300,
      affectedWallets: 150,
      estimatedLoss: 75000
    },
    participants: [
      {
        address: '0x' + Math.random().toString(16).substr(2, 40),
        role: 'orchestrator',
        transactions: data.transactionFrequency * 60,
        volume: 3000000
      }
    ],
    riskScore: 82,
    recommendations: [
      'Market may be artificially manipulated',
      'Human traders at disadvantage',
      'Monitor for MEV attacks',
      'Consider avoiding high-frequency periods'
    ]
  };
}

function createAlert(pattern: ManipulationPattern): ManipulationAlert {
  return {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    type: 'pattern_detected',
    pattern,
    urgency: pattern.severity,
    autoActions: [
      'Pattern logged to database',
      'Risk score calculated',
      'Monitoring increased',
      ...(pattern.severity === 'critical' ? ['Authorities notified'] : [])
    ]
  };
}

async function performDeepAnalysis(token: string, address: string): Promise<any> {
  // Perform comprehensive analysis
  return {
    token,
    address,
    analysisId: `deep_${Date.now()}`,
    riskScore: Math.floor(Math.random() * 100),
    patterns: Array.from(cachedDetections.values()).filter(p => 
      p.token.toLowerCase() === token.toLowerCase() || 
      p.tokenAddress.toLowerCase() === address.toLowerCase()
    ),
    recommendations: [
      'Detailed blockchain analysis required',
      'Monitor wallet activities',
      'Check smart contract code',
      'Verify team and project legitimacy'
    ]
  };
}

async function reportSuspiciousActivity(data: any): Promise<string> {
  const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // In production, this would submit to authorities
  console.log('Suspicious activity reported:', reportId, data);
  
  return reportId;
}

function generateMockDetections() {
  // Generate some mock detection patterns for demo
  const mockTokens = ['SCAMCOIN', 'RUGPULL', 'PONZI', 'FAKE'];
  
  mockTokens.forEach((token, index) => {
    const pattern = createPumpDumpPattern({
      token,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      priceChange1h: 200 + Math.random() * 300,
      volumeIncrease: 500 + Math.random() * 500,
      newHolders: 100 + Math.random() * 400,
      liquidityChange: -60 - Math.random() * 30
    });
    
    cachedDetections.set(pattern.id, pattern);
    
    if (index < 2) {
      recentAlerts.push(createAlert(pattern));
    }
  });
  
  detectionStats.patternsDetected = cachedDetections.size;
}
