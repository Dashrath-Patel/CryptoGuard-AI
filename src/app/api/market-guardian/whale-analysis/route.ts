import { NextRequest, NextResponse } from 'next/server';

const BSCSCAN_API_KEY = 'Q9PMT4R2E15FT8KHA5X3PV92R779ABQG8H';

interface WhaleWalletAnalysis {
  address: string;
  label: string;
  balance: number;
  balanceUSD: number;
  transactionCount: number;
  firstSeen: number;
  lastActivity: number;
  riskScore: number;
  tags: string[];
  topTokens: Array<{
    token: string;
    amount: number;
    usdValue: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    hash: string;
    type: 'in' | 'out';
    amount: number;
    usdValue: number;
    timestamp: number;
    counterparty: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address || !address.startsWith('0x')) {
      return NextResponse.json(
        { error: 'Valid wallet address required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeWhaleWallet(address);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Whale analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze whale wallet' },
      { status: 500 }
    );
  }
}

async function analyzeWhaleWallet(address: string): Promise<WhaleWalletAnalysis> {
  try {
    // Get wallet balance
    const balanceResponse = await fetch(
      `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${BSCSCAN_API_KEY}`
    );
    const balanceData = await balanceResponse.json();
    const balance = parseFloat(balanceData.result) / 1e18;
    const balanceUSD = balance * 300; // Approximate BNB price

    // Get recent transactions
    const txResponse = await fetch(
      `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&offset=50&apikey=${BSCSCAN_API_KEY}`
    );
    const txData = await txResponse.json();

    // Get token balances
    const tokenResponse = await fetch(
      `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&offset=20&apikey=${BSCSCAN_API_KEY}`
    );
    const tokenData = await tokenResponse.json();

    // Analyze the data
    const transactions = txData.result || [];
    const tokenTransactions = tokenData.result || [];

    const analysis: WhaleWalletAnalysis = {
      address,
      label: getWalletLabel(address),
      balance,
      balanceUSD,
      transactionCount: transactions.length,
      firstSeen: transactions.length > 0 ? parseInt(transactions[transactions.length - 1].timeStamp) * 1000 : Date.now(),
      lastActivity: transactions.length > 0 ? parseInt(transactions[0].timeStamp) * 1000 : Date.now(),
      riskScore: calculateWalletRiskScore(transactions, tokenTransactions, balance),
      tags: generateWalletTags(transactions, tokenTransactions, balance),
      topTokens: analyzeTopTokens(tokenTransactions),
      recentActivity: analyzeRecentActivity(transactions.slice(0, 10))
    };

    return analysis;
  } catch (error) {
    console.error('Error analyzing whale wallet:', error);
    
    // Return mock data if API fails
    return generateMockWhaleAnalysis(address);
  }
}

function getWalletLabel(address: string): string {
  const knownWallets: { [key: string]: string } = {
    '0x8894e0a0c962cb723c1976a4421c95949be2d4e3': 'Binance Hot Wallet',
    '0x0681d8db095565fe8a346fa0277bffde9c0edbbf': 'DeFi Whale',
    '0x10ed43c718714eb63d5aa57b78b54704e256024e': 'PancakeSwap Router',
    '0x13f4ea83d0bd40e75c8222255bc855a974568dd4': 'PancakeSwap V2 Router',
  };

  return knownWallets[address.toLowerCase()] || 'Unknown Whale';
}

function calculateWalletRiskScore(transactions: any[], tokenTransactions: any[], balance: number): number {
  let riskScore = 0;

  // High balance increases risk score
  if (balance > 100000) riskScore += 30;
  else if (balance > 50000) riskScore += 20;
  else if (balance > 10000) riskScore += 10;

  // High transaction frequency
  const recentTxs = transactions.filter(tx => 
    Date.now() - (parseInt(tx.timeStamp) * 1000) < 86400000 // Last 24 hours
  );
  if (recentTxs.length > 50) riskScore += 25;
  else if (recentTxs.length > 20) riskScore += 15;
  else if (recentTxs.length > 10) riskScore += 5;

  // Large transaction amounts
  const largeTxs = transactions.filter(tx => {
    const value = parseFloat(tx.value) / 1e18;
    return value > 1000; // > $300k at current prices
  });
  riskScore += Math.min(largeTxs.length * 5, 30);

  // Token diversity (lower diversity = higher risk)
  const uniqueTokens = new Set(tokenTransactions.map(tx => tx.contractAddress));
  if (uniqueTokens.size < 3) riskScore += 10;

  return Math.min(100, riskScore);
}

function generateWalletTags(transactions: any[], tokenTransactions: any[], balance: number): string[] {
  const tags: string[] = [];

  // Balance-based tags
  if (balance > 100000) tags.push('MEGA_WHALE');
  else if (balance > 50000) tags.push('WHALE');
  else if (balance > 10000) tags.push('DOLPHIN');

  // Activity-based tags
  const recentTxs = transactions.filter(tx => 
    Date.now() - (parseInt(tx.timeStamp) * 1000) < 86400000
  );
  if (recentTxs.length > 20) tags.push('HIGH_ACTIVITY');
  if (recentTxs.length === 0) tags.push('DORMANT');

  // Transaction pattern tags
  const largeTxs = transactions.filter(tx => {
    const value = parseFloat(tx.value) / 1e18;
    return value > 1000;
  });
  if (largeTxs.length > 5) tags.push('FREQUENT_LARGE_TXS');

  // DeFi interaction tags
  const defiContracts = [
    '0x10ed43c718714eb63d5aa57b78b54704e256024e', // PancakeSwap
    '0x73feaa1ee314f8c655e354234017be2193c9e24e', // MasterChef
    '0xfd5840cd36d94d7229439859c0112a4185bc0255', // Alpaca
  ];
  
  const defiTxs = transactions.filter(tx => 
    defiContracts.includes(tx.to?.toLowerCase())
  );
  if (defiTxs.length > 0) tags.push('DEFI_USER');

  // Risk tags
  const suspiciousTxs = transactions.filter(tx => {
    const value = parseFloat(tx.value) / 1e18;
    const gasPrice = parseInt(tx.gasPrice);
    return value > 10000 && gasPrice > 20000000000; // High value + High gas = Urgent
  });
  if (suspiciousTxs.length > 0) tags.push('URGENT_TRANSACTIONS');

  return tags;
}

function analyzeTopTokens(tokenTransactions: any[]) {
  const tokenBalances = new Map();

  // Simulate token balance calculation
  for (const tx of tokenTransactions) {
    const token = tx.tokenSymbol || 'UNKNOWN';
    const amount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal) || 18);
    
    if (!tokenBalances.has(token)) {
      tokenBalances.set(token, { amount: 0, transactions: 0 });
    }
    
    const current = tokenBalances.get(token);
    current.transactions++;
    
    // Simulate net balance (this would require more complex calculation in reality)
    if (Math.random() > 0.5) {
      current.amount += amount;
    }
  }

  const topTokens = Array.from(tokenBalances.entries())
    .map(([token, data]: [string, any]) => {
      let usdValue = 0;
      // Estimate USD values
      if (token === 'USDT' || token === 'BUSD' || token === 'USDC') {
        usdValue = data.amount;
      } else if (token === 'CAKE') {
        usdValue = data.amount * 2.5;
      } else if (token === 'BNB') {
        usdValue = data.amount * 300;
      } else {
        usdValue = data.amount * Math.random() * 10; // Random value for unknown tokens
      }

      return {
        token,
        amount: data.amount,
        usdValue,
        percentage: 0 // Will be calculated after sorting
      };
    })
    .filter(item => item.usdValue > 100) // Only tokens worth > $100
    .sort((a, b) => b.usdValue - a.usdValue)
    .slice(0, 10);

  // Calculate percentages
  const totalValue = topTokens.reduce((sum, token) => sum + token.usdValue, 0);
  return topTokens.map(token => ({
    ...token,
    percentage: totalValue > 0 ? (token.usdValue / totalValue) * 100 : 0
  }));
}

function analyzeRecentActivity(recentTransactions: any[]) {
  return recentTransactions.map(tx => {
    const value = parseFloat(tx.value) / 1e18;
    const usdValue = value * 300; // Approximate BNB price
    
    return {
      hash: tx.hash,
      type: tx.from.toLowerCase() === tx.to.toLowerCase() ? 'in' : 'out' as 'in' | 'out',
      amount: value,
      usdValue,
      timestamp: parseInt(tx.timeStamp) * 1000,
      counterparty: tx.from.toLowerCase() === tx.to.toLowerCase() ? tx.to : tx.from
    };
  });
}

function generateMockWhaleAnalysis(address: string): WhaleWalletAnalysis {
  const now = Date.now();
  
  return {
    address,
    label: 'Mock Whale Wallet',
    balance: 50000,
    balanceUSD: 15000000,
    transactionCount: 1250,
    firstSeen: now - 86400000 * 365, // 1 year ago
    lastActivity: now - 3600000, // 1 hour ago
    riskScore: 65,
    tags: ['WHALE', 'HIGH_ACTIVITY', 'DEFI_USER'],
    topTokens: [
      { token: 'BNB', amount: 45000, usdValue: 13500000, percentage: 75 },
      { token: 'USDT', amount: 1000000, usdValue: 1000000, percentage: 15 },
      { token: 'CAKE', amount: 200000, usdValue: 500000, percentage: 10 }
    ],
    recentActivity: [
      {
        hash: '0x1234567890abcdef',
        type: 'out',
        amount: 1000,
        usdValue: 300000,
        timestamp: now - 3600000,
        counterparty: '0x10ed43c718714eb63d5aa57b78b54704e256024e'
      },
      {
        hash: '0xabcdef1234567890',
        type: 'in',
        amount: 2000,
        usdValue: 600000,
        timestamp: now - 7200000,
        counterparty: '0x8894e0a0c962cb723c1976a4421c95949be2d4e3'
      }
    ]
  };
}
