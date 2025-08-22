import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  functionName?: string;
  methodId?: string;
  gasUsed: string;
  gasPrice: string;
  isError: string;
}

interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'transaction' | 'token' | 'defi' | 'security' | 'gas';
  actionable: boolean;
  recommendation: string;
}

export async function POST(request: NextRequest) {
  try {
    const { transactions, tokenTransfers, internalTransactions, balance, riskFactors, walletAddress } = await request.json();

    console.log('=== AI Security Analysis Debug ===');
    console.log('Transactions received:', transactions?.length || 0);
    console.log('Token transfers received:', tokenTransfers?.length || 0);
    console.log('Internal transactions received:', internalTransactions?.length || 0);
    console.log('Wallet balance:', balance);
    console.log('Risk factors:', riskFactors?.length || 0);
    console.log('Wallet address:', walletAddress);
    console.log('Gemini API Key present:', !!process.env.GOOGLE_AI_API_KEY);
    console.log('Gemini API Key first 10 chars:', process.env.GOOGLE_AI_API_KEY?.substring(0, 10));

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: 'Invalid transactions data' }, { status: 400 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('MISSING: Gemini API key not found in environment variables');
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Prepare comprehensive data for AI analysis
    const comprehensiveData = prepareComprehensiveAnalysis({
      transactions,
      tokenTransfers: tokenTransfers || [],
      internalTransactions: internalTransactions || [],
      balance: balance || '0',
      riskFactors: riskFactors || [],
      walletAddress
    });
    
    // Generate AI analysis
    const analysis = await generateAIAnalysis(comprehensiveData);
    
    // Parse AI response into structured recommendations
    const recommendations = parseAIRecommendations(analysis);

    return NextResponse.json({
      success: true,
      analysis,
      recommendations,
      metadata: {
        totalTransactions: transactions.length,
        totalTokenTransfers: tokenTransfers?.length || 0,
        totalInternalTransactions: internalTransactions?.length || 0,
        walletBalance: balance,
        riskFactors: riskFactors?.length || 0,
        analysisTimestamp: new Date().toISOString(),
        walletAddress
      }
    });

  } catch (error) {
    console.error('AI Security Analysis Error:', error);
    
    // Check for specific API key errors
    if (error instanceof Error && error.message.includes('API key not valid')) {
      return NextResponse.json(
        { 
          error: 'Invalid Gemini API Key',
          details: 'Please get a valid API key from https://makersuite.google.com/app/apikey and add it to your .env file as GOOGLE_AI_API_KEY',
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to generate AI security analysis',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function prepareComprehensiveAnalysis(data: any) {
  const { transactions, tokenTransfers, internalTransactions, balance, riskFactors, walletAddress } = data;
  const recentTransactions = transactions.slice(0, 20);
  
  return {
    walletAddress,
    balance: {
      bnb: (parseFloat(balance) / 1e18).toFixed(4),
      raw: balance
    },
    transactionAnalysis: {
      totalTransactions: transactions.length,
      recentCount: recentTransactions.length,
      failedTransactions: recentTransactions.filter((tx: any) => tx.isError === '1').length,
      averageGasUsed: recentTransactions.reduce((sum: number, tx: any) => sum + parseInt(tx.gasUsed || '0'), 0) / recentTransactions.length,
      uniqueContracts: [...new Set(recentTransactions.map((tx: any) => tx.to))],
      highValueTransactions: recentTransactions.filter((tx: any) => parseFloat(tx.value || '0') > 0.1).length,
      totalValue: recentTransactions.reduce((sum: number, tx: any) => sum + parseFloat(tx.value || '0'), 0) / 1e18
    },
    tokenActivity: {
      totalTokenTransfers: tokenTransfers.length,
      uniqueTokens: [...new Set(tokenTransfers.map((tx: any) => tx.contractAddress))],
      recentTokenTransfers: tokenTransfers.slice(0, 10).map((tx: any) => ({
        token: tx.tokenSymbol || 'Unknown',
        value: tx.value,
        from: tx.from === walletAddress ? 'YOU' : tx.from.substring(0, 6) + '...',
        to: tx.to === walletAddress ? 'YOU' : tx.to.substring(0, 6) + '...'
      }))
    },
    internalActivity: {
      totalInternalTransactions: internalTransactions.length,
      contractCalls: internalTransactions.filter((tx: any) => tx.type === 'call').length,
      creates: internalTransactions.filter((tx: any) => tx.type === 'create').length
    },
    securityIndicators: {
      riskFactors: riskFactors,
      suspiciousPatterns: analyzeSuspiciousPatterns(recentTransactions, tokenTransfers),
      securityScore: calculateBaseSecurityScore(recentTransactions, tokenTransfers, riskFactors)
    },
    recentActivity: recentTransactions.slice(0, 5).map((tx: any) => ({
      hash: tx.hash.substring(0, 10) + '...',
      type: tx.methodId === '0x' ? 'Transfer' : 'Contract Call',
      value: (parseFloat(tx.value || '0') / 1e18).toFixed(4) + ' BNB',
      status: tx.isError === '1' ? 'FAILED' : 'SUCCESS',
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()
    }))
  };
}

function analyzeSuspiciousPatterns(transactions: any[], tokenTransfers: any[]) {
  const patterns = [];
  
  // Check for rapid transactions
  const recentTxs = transactions.slice(0, 10);
  const rapidTxs = recentTxs.filter((tx, index) => {
    if (index === 0) return false;
    const timeDiff = parseInt(recentTxs[index - 1].timeStamp) - parseInt(tx.timeStamp);
    return timeDiff < 60; // Less than 1 minute apart
  });
  
  if (rapidTxs.length > 3) {
    patterns.push('Rapid transaction pattern detected (potential bot activity)');
  }
  
  // Check for failed transactions
  const failedTxs = transactions.filter(tx => tx.isError === '1');
  if (failedTxs.length > transactions.length * 0.1) {
    patterns.push('High failure rate detected (>10% of transactions failed)');
  }
  
  // Check for high gas usage
  const avgGas = transactions.reduce((sum, tx) => sum + parseInt(tx.gasUsed || '0'), 0) / transactions.length;
  if (avgGas > 100000) {
    patterns.push('High average gas usage detected (complex contract interactions)');
  }
  
  return patterns;
}

function calculateBaseSecurityScore(transactions: any[], tokenTransfers: any[], riskFactors: string[]) {
  let score = 100;
  
  // Deduct for risk factors
  score -= riskFactors.length * 15;
  
  // Deduct for failed transactions
  const failureRate = transactions.filter(tx => tx.isError === '1').length / transactions.length;
  score -= failureRate * 30;
  
  // Deduct for high-risk token interactions
  const riskTokens = tokenTransfers.filter(tx => 
    tx.tokenSymbol && (
      tx.tokenSymbol.toLowerCase().includes('safe') ||
      tx.tokenSymbol.toLowerCase().includes('moon') ||
      tx.tokenSymbol.toLowerCase().includes('doge')
    )
  );
  score -= riskTokens.length * 10;
  
  return Math.max(score, 10);
}

function prepareTransactionSummary(transactions: Transaction[], walletAddress: string) {
  const recentTransactions = transactions.slice(0, 20); // Analyze last 20 transactions
  
  const summary = {
    walletAddress,
    totalTransactions: transactions.length,
    recentTransactionCount: recentTransactions.length,
    timeRange: {
      earliest: new Date(parseInt(recentTransactions[recentTransactions.length - 1]?.timeStamp) * 1000).toISOString(),
      latest: new Date(parseInt(recentTransactions[0]?.timeStamp) * 1000).toISOString()
    },
    transactionPatterns: {
      totalValue: recentTransactions.reduce((sum, tx) => sum + parseFloat(tx.value || '0'), 0),
      averageGasUsed: recentTransactions.reduce((sum, tx) => sum + parseInt(tx.gasUsed || '0'), 0) / recentTransactions.length,
      uniqueContracts: [...new Set(recentTransactions.map(tx => tx.to))],
      failedTransactions: recentTransactions.filter(tx => tx.isError === '1').length,
      highValueTransactions: recentTransactions.filter(tx => parseFloat(tx.value || '0') > 0.1).length
    },
    recentTransactions: recentTransactions.map(tx => ({
      hash: tx.hash.substring(0, 10) + '...',
      from: tx.from === walletAddress ? 'YOU' : tx.from.substring(0, 6) + '...',
      to: tx.to === walletAddress ? 'YOU' : tx.to.substring(0, 6) + '...',
      valueInBNB: (parseFloat(tx.value || '0') / 1e18).toFixed(4),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
      gasUsed: tx.gasUsed,
      status: tx.isError === '1' ? 'FAILED' : 'SUCCESS',
      methodId: tx.methodId
    }))
  };

  return summary;
}

async function generateAIAnalysis(comprehensiveData: any) {
  try {
    const prompt = `
You are CryptoGuard AI, an expert blockchain security analyst specializing in BSC (Binance Smart Chain) wallet security. 

Analyze the following COMPREHENSIVE wallet data and provide detailed security recommendations:

📊 WALLET OVERVIEW:
- Address: ${comprehensiveData.walletAddress}
- Current Balance: ${comprehensiveData.balance.bnb} BNB
- Security Score: ${comprehensiveData.securityIndicators.securityScore}/100

🔄 TRANSACTION ANALYSIS:
- Total Transactions: ${comprehensiveData.transactionAnalysis.totalTransactions}
- Recent Transactions: ${comprehensiveData.transactionAnalysis.recentCount}
- Failed Transactions: ${comprehensiveData.transactionAnalysis.failedTransactions}
- Average Gas Used: ${comprehensiveData.transactionAnalysis.averageGasUsed}
- High-Value Transactions: ${comprehensiveData.transactionAnalysis.highValueTransactions}
- Total Value Transferred: ${comprehensiveData.transactionAnalysis.totalValue.toFixed(4)} BNB
- Unique Contracts: ${comprehensiveData.transactionAnalysis.uniqueContracts.length}

🪙 TOKEN ACTIVITY:
- Token Transfers: ${comprehensiveData.tokenActivity.totalTokenTransfers}
- Unique Tokens: ${comprehensiveData.tokenActivity.uniqueTokens.length}
- Recent Token Activity: ${JSON.stringify(comprehensiveData.tokenActivity.recentTokenTransfers, null, 2)}

🔧 CONTRACT INTERACTIONS:
- Internal Transactions: ${comprehensiveData.internalActivity.totalInternalTransactions}
- Contract Calls: ${comprehensiveData.internalActivity.contractCalls}
- Contract Creates: ${comprehensiveData.internalActivity.creates}

⚠️ SECURITY INDICATORS:
- Risk Factors: ${JSON.stringify(comprehensiveData.securityIndicators.riskFactors, null, 2)}
- Suspicious Patterns: ${JSON.stringify(comprehensiveData.securityIndicators.suspiciousPatterns, null, 2)}

📋 RECENT ACTIVITY:
${JSON.stringify(comprehensiveData.recentActivity, null, 2)}

Please provide a COMPREHENSIVE SECURITY ANALYSIS with:

1. **SECURITY RISK ASSESSMENT** (Critical/High/Medium/Low) - Based on ALL data sources
2. **KEY FINDINGS** - Multi-dimensional analysis covering:
   - Transaction behavior patterns
   - Token interaction risks
   - Contract security concerns
   - Balance management issues
3. **SECURITY RECOMMENDATIONS** - Specific actionable advice
4. **DEFI PROTOCOL ANALYSIS** - Safety assessment of interacted protocols
5. **TOKEN PORTFOLIO SECURITY** - Assessment of held/transferred tokens
6. **BEST PRACTICES** - Tailored BSC wallet security recommendations

Focus on:
- Cross-referencing transaction patterns with token activities
- Identifying high-risk DeFi protocol interactions
- Detecting potential MEV attacks or sandwich attacks
- Analyzing gas optimization opportunities
- Token approval security risks
- Multi-signature wallet recommendations
- Hardware wallet security advice
- Smart contract interaction safety

Provide specific, actionable recommendations that address the unique risk profile of this wallet.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI API Error:', error);
    throw new Error(`Failed to generate AI analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseAIRecommendations(analysis: string): SecurityRecommendation[] {
  // This is a simplified parser - you could make this more sophisticated
  const recommendations: SecurityRecommendation[] = [];
  
  // Extract key recommendations from AI response
  const lines = analysis.split('\n').filter(line => line.trim());
  
  let currentRecommendation: Partial<SecurityRecommendation> = {};
  let idCounter = 1;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Look for recommendation indicators
    if (trimmedLine.includes('RECOMMENDATION') || 
        trimmedLine.includes('•') || 
        trimmedLine.includes('-') && trimmedLine.length > 20) {
      
      if (currentRecommendation.title) {
        // Save previous recommendation
        recommendations.push({
          id: `ai-rec-${idCounter++}`,
          title: currentRecommendation.title || 'Security Recommendation',
          description: currentRecommendation.description || '',
          priority: determinePriority(currentRecommendation.title || ''),
          category: determineCategory(currentRecommendation.title || ''),
          actionable: true,
          recommendation: currentRecommendation.description || ''
        });
      }
      
      // Start new recommendation
      currentRecommendation = {
        title: trimmedLine.replace(/^[-•*]\s*/, '').substring(0, 80),
        description: trimmedLine
      };
    } else if (currentRecommendation.title && trimmedLine.length > 10) {
      // Continue building description
      currentRecommendation.description += ' ' + trimmedLine;
    }
  }
  
  // Add final recommendation
  if (currentRecommendation.title) {
    recommendations.push({
      id: `ai-rec-${idCounter++}`,
      title: currentRecommendation.title || 'Security Recommendation',
      description: currentRecommendation.description || '',
      priority: determinePriority(currentRecommendation.title || ''),
      category: determineCategory(currentRecommendation.title || ''),
      actionable: true,
      recommendation: currentRecommendation.description || ''
    });
  }
  
  return recommendations.slice(0, 8); // Limit to top 8 recommendations
}

function determinePriority(text: string): 'low' | 'medium' | 'high' | 'critical' {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('critical') || lowerText.includes('urgent') || lowerText.includes('immediate')) {
    return 'critical';
  } else if (lowerText.includes('high') || lowerText.includes('important') || lowerText.includes('security')) {
    return 'high';
  } else if (lowerText.includes('medium') || lowerText.includes('consider') || lowerText.includes('optimize')) {
    return 'medium';
  }
  return 'low';
}

function determineCategory(text: string): 'transaction' | 'token' | 'defi' | 'security' | 'gas' {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('gas') || lowerText.includes('fee')) {
    return 'gas';
  } else if (lowerText.includes('token') || lowerText.includes('approval')) {
    return 'token';
  } else if (lowerText.includes('defi') || lowerText.includes('protocol') || lowerText.includes('liquidity')) {
    return 'defi';
  } else if (lowerText.includes('transaction') || lowerText.includes('transfer')) {
    return 'transaction';
  }
  return 'security';
}
