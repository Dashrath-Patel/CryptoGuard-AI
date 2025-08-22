import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
// Add rate limiting globals
declare global {
  var lastGeminiApiCall: number | undefined;
  var geminiCallCount: number | undefined;
  var dailyCallCount: number | undefined;
  var dailyCallDate: string | undefined;
}

// Track daily API usage
function trackDailyUsage() {
  const today = new Date().toDateString();
  
  if (global.dailyCallDate !== today) {
    global.dailyCallCount = 0;
    global.dailyCallDate = today;
  }
  
  global.dailyCallCount = (global.dailyCallCount || 0) + 1;
  console.log(`📊 Daily API calls: ${global.dailyCallCount}/50`);
  
  return {
    callsToday: global.dailyCallCount,
    remainingCalls: Math.max(0, 50 - global.dailyCallCount),
    willResetAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
  };
}

async function generateAIAnalysis(data: any): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  console.log('🤖 Starting AI analysis with Gemini...');
  
  // Track daily usage
  const dailyUsage = trackDailyUsage();
  
  if (dailyUsage.remainingCalls <= 0) {
    throw new Error(`Daily quota exceeded. ${dailyUsage.callsToday}/50 calls used today. Quota resets at ${dailyUsage.willResetAt}`);
  }
  
  // Check for recent API calls to prevent quota issues
  const lastApiCall = global.lastGeminiApiCall || 0;
  const timeSinceLastCall = Date.now() - lastApiCall;
  const minInterval = 2000; // 2 seconds between calls
  
  if (timeSinceLastCall < minInterval) {
    console.log(`⏳ Rate limiting: waiting ${minInterval - timeSinceLastCall}ms`);
    await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastCall));
  }
  
  global.lastGeminiApiCall = Date.now();
  global.geminiCallCount = (global.geminiCallCount || 0) + 1;
  
  console.log(`📊 API Call #${global.geminiCallCount} starting... (${dailyUsage.remainingCalls} calls remaining today)`);
  
  const prompt = `
You are CryptoGuard AI, an expert blockchain security analyst specializing in BSC (Binance Smart Chain) wallet security. 

Analyze the following COMPREHENSIVE wallet data and provide detailed security recommendations:

📊 WALLET OVERVIEW:
- Address: ${data.walletAddress}
- Current Balance: ${data.balance.bnb} BNB
- Security Score: ${data.securityIndicators.securityScore}/100

🔄 TRANSACTION ANALYSIS:
- Total Transactions: ${data.transactionAnalysis.totalTransactions}
- Recent Transactions: ${data.transactionAnalysis.recentCount}
- Failed Transactions: ${data.transactionAnalysis.failedTransactions}
- Average Gas Used: ${data.transactionAnalysis.averageGasUsed}
- High-Value Transactions: ${data.transactionAnalysis.highValueTransactions}
- Total Value Transferred: ${data.transactionAnalysis.totalValue.toFixed(4)} BNB
- Unique Contracts: ${data.transactionAnalysis.uniqueContracts.length}

🪙 TOKEN ACTIVITY:
- Token Transfers: ${data.tokenActivity.totalTokenTransfers}
- Unique Tokens: ${data.tokenActivity.uniqueTokens.length}
- Recent Token Activity: ${JSON.stringify(data.tokenActivity.recentTokenTransfers, null, 2)}

🔧 CONTRACT INTERACTIONS:
- Internal Transactions: ${data.internalActivity.totalInternalTransactions}
- Contract Calls: ${data.internalActivity.contractCalls}
- Contract Creates: ${data.internalActivity.creates}

⚠️ SECURITY INDICATORS:
- Risk Factors: ${JSON.stringify(data.securityIndicators.riskFactors, null, 2)}
- Suspicious Patterns: ${JSON.stringify(data.securityIndicators.suspiciousPatterns, null, 2)}

📋 RECENT ACTIVITY:
${JSON.stringify(data.recentActivity, null, 2)}

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

  try {
    console.log('🚀 Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ AI analysis completed successfully');
    return text;
  } catch (error: any) {
    console.error('❌ Gemini API error:', error);
    // Re-throw with additional context
    throw new Error(`Gemini API error: ${error.message} (Status: ${error.status || 'unknown'})`);
  }
}
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
  let transactions: any, tokenTransfers: any, internalTransactions: any, balance: any, riskFactors: any, walletAddress: any;
  
  try {
    ({ transactions, tokenTransfers, internalTransactions, balance, riskFactors, walletAddress } = await request.json());

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
    
    // Generate AI analysis with fallback
    let analysis: string;
    let recommendations: SecurityRecommendation[];
    let usingFallback = false;
    
    try {
      analysis = await generateAIAnalysis(comprehensiveData);
      recommendations = parseAIRecommendations(analysis);
      console.log('✅ AI analysis generated successfully');
    } catch (aiError: any) {
      console.error('❌ AI analysis failed:', aiError);
      usingFallback = true;
      
      // Check if it's a quota error
      if (aiError.status === 429 || aiError.message?.includes('quota') || aiError.message?.includes('Too Many Requests')) {
        console.log('🔄 Quota exceeded, using fallback analysis');
        // Use fallback analysis based on transaction patterns
        const fallbackResult = generateFallbackAnalysis(comprehensiveData);
        analysis = fallbackResult.analysis;
        recommendations = fallbackResult.recommendations;
      } else {
        // For other errors, still provide basic analysis
        console.log('🔄 AI error, using basic analysis');
        const fallbackResult = generateFallbackAnalysis(comprehensiveData);
        analysis = fallbackResult.analysis;
        recommendations = fallbackResult.recommendations;
      }
    }

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
        walletAddress,
        usingFallback,
        fallbackReason: usingFallback ? 'AI API quota exceeded - using pattern-based analysis' : null
      }
    });

  } catch (error: any) {
    console.error('💥 AI Security Analysis Error:', error);
    
    // Even if there's an error, try to provide fallback analysis
    try {
      console.log('🔄 Attempting emergency fallback analysis...');
      const fallbackResult = generateFallbackAnalysis({ transactions, tokenTransfers, internalTransactions, balance, riskFactors, walletAddress });
      
      return NextResponse.json({
        success: true,
        analysis: fallbackResult.analysis,
        recommendations: fallbackResult.recommendations,
        metadata: {
          totalTransactions: transactions?.length || 0,
          totalTokenTransfers: tokenTransfers?.length || 0,
          totalInternalTransactions: internalTransactions?.length || 0,
          walletBalance: balance,
          riskFactors: riskFactors?.length || 0,
          analysisTimestamp: new Date().toISOString(),
          walletAddress,
          usingFallback: true,
          fallbackReason: 'System error occurred - emergency fallback analysis provided'
        }
      });
    } catch (fallbackError) {
      console.error('❌ Even fallback analysis failed:', fallbackError);
      return NextResponse.json(
        { 
          error: 'Failed to generate AI security analysis',
          details: 'Both AI and fallback analysis failed. Please try again later.',
          suggestion: 'Try refreshing the page or contact support if the issue persists.'
        },
        { status: 500 }
      );
    }
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

}

// Fallback analysis when AI API is unavailable or quota exceeded
function generateFallbackAnalysis(data: any): { analysis: string; recommendations: SecurityRecommendation[] } {
  const { transactions, tokenTransfers, internalTransactions, balance, riskFactors, walletAddress } = data;
  
  console.log('🔄 Generating fallback analysis...');
  
  // Calculate basic metrics
  const totalTx = transactions?.length || 0;
  const totalTokenTransfers = tokenTransfers?.length || 0;
  const totalInternal = internalTransactions?.length || 0;
  const walletBalanceEth = balance?.raw ? parseFloat(balance.raw) / 1e18 : 0;
  const riskCount = riskFactors?.length || 0;
  
  // Analyze transaction patterns
  const recentTxs = transactions?.slice(0, 10) || [];
  const hasHighValueTxs = recentTxs.some((tx: any) => parseFloat(tx.value || '0') > 1e18); // > 1 ETH equivalent
  const hasFrequentTxs = totalTx > 50;
  const hasTokenActivity = totalTokenTransfers > 0;
  const hasInternalActivity = totalInternal > 0;
  
  // Generate risk-based analysis
  let riskLevel = 'LOW';
  let riskScore = 0;
  
  if (riskCount >= 5) {
    riskLevel = 'HIGH';
    riskScore = 8;
  } else if (riskCount >= 3) {
    riskLevel = 'MEDIUM';
    riskScore = 5;
  } else if (riskCount >= 1) {
    riskLevel = 'LOW-MEDIUM';
    riskScore = 3;
  }
  
  // Generate analysis text
  const analysis = `
🛡️ **CRYPTOGUARD AI SECURITY ANALYSIS** (Fallback Mode)
⚠️ **Note**: Advanced AI analysis temporarily unavailable due to API quotas. Using pattern-based analysis.
📅 **AI Analysis Available**: Tomorrow after quota reset (50 requests per day limit)

**WALLET OVERVIEW**
• Address: ${walletAddress}
• Balance: ${walletBalanceEth.toFixed(4)} BNB
• Total Transactions: ${totalTx}
• Token Transfers: ${totalTokenTransfers}
• Internal Transactions: ${totalInternal}

**SECURITY ASSESSMENT**
• Risk Level: ${riskLevel}
• Risk Score: ${riskScore}/10
• Risk Factors Detected: ${riskCount}

**AUTOMATED PATTERN ANALYSIS**
Our automated systems have analyzed your transaction patterns:

${hasHighValueTxs ? '⚠️ **High-Value Transactions Detected**\n   Large transaction amounts identified - consider additional security measures like hardware wallets or multi-sig setups.' : '✅ **Transaction Values Normal**\n   Transaction amounts appear reasonable for typical usage.'}

${hasFrequentTxs ? '📊 **High Trading Activity**\n   Frequent transaction pattern suggests active trading. Consider:\n   • Using a dedicated trading wallet\n   • Implementing transaction limits\n   • Regular security audits' : '📊 **Moderate Activity Level**\n   Regular but not excessive transaction frequency detected.'}

${hasTokenActivity ? '🪙 **Token Activity Detected**\n   Token transfers found in your history:\n   • Monitor token approvals regularly\n   • Use tools like Revoke.cash to manage permissions\n   • Be cautious of unknown token contracts' : '🪙 **Limited Token Activity**\n   Primarily BNB transactions with minimal token interaction.'}

${hasInternalActivity ? '🔄 **Smart Contract Interactions**\n   Multiple contract interactions detected:\n   • Review contract permissions\n   • Monitor for suspicious contract calls\n   • Consider contract interaction limits' : '🔄 **Direct Transfers Only**\n   Transactions appear to be direct wallet-to-wallet transfers.'}

**RISK-BASED RECOMMENDATIONS**
Based on transaction patterns, we recommend:
• ${walletBalanceEth > 10 ? 'Consider using a hardware wallet for large holdings' : 'Current balance suitable for software wallet'}
• ${hasTokenActivity ? 'Regularly review and revoke unused token approvals' : 'Monitor for future token approvals'}
• ${riskCount > 0 ? 'Address identified risk factors immediately' : 'Maintain current security practices'}
• Enable wallet notifications for large transactions
• Use a separate wallet for DeFi activities if trading frequently

**NEXT STEPS**
1. Review all identified risk factors
2. Update wallet security settings
3. Consider multi-signature setup for large holdings
4. Monitor wallet activity regularly

*This analysis was generated using pattern-based rules. For detailed AI insights, please try again when API quota resets.*
  `.trim();
  
  // Generate basic recommendations
  const recommendations: SecurityRecommendation[] = [
    {
      id: '1',
      title: 'Review Risk Factors',
      description: `${riskCount} risk factors detected in your wallet activity. Review and address these security concerns.`,
      priority: riskCount > 3 ? 'high' : riskCount > 1 ? 'medium' : 'low',
      category: 'security',
      actionable: true,
      recommendation: 'Check the risk factors section and take recommended actions'
    },
    {
      id: '2',
      title: 'Hardware Wallet Recommendation',
      description: walletBalanceEth > 10 
        ? 'Your wallet holds significant funds. Consider using a hardware wallet for enhanced security.'
        : 'As your holdings grow, consider upgrading to a hardware wallet.',
      priority: walletBalanceEth > 10 ? 'high' : 'medium',
      category: 'security',
      actionable: true,
      recommendation: 'Research Ledger or Trezor hardware wallets'
    },
    {
      id: '3',
      title: 'Enable Transaction Monitoring',
      description: 'Set up alerts for large transactions and suspicious activities.',
      priority: 'medium',
      category: 'security',
      actionable: true,
      recommendation: 'Configure wallet notifications and monitoring tools'
    }
  ];
  
  if (hasTokenActivity) {
    recommendations.push({
      id: '4',
      title: 'Token Approval Management',
      description: 'Token transfer activity detected. Regularly review and revoke unused token approvals.',
      priority: 'medium',
      category: 'token',
      actionable: true,
      recommendation: 'Use tools like Revoke.cash to manage token approvals'
    });
  }
  
  if (hasFrequentTxs) {
    recommendations.push({
      id: '5',
      title: 'Separate Trading Wallet',
      description: 'High transaction frequency detected. Consider using a separate wallet for trading activities.',
      priority: 'low',
      category: 'security',
      actionable: true,
      recommendation: 'Create dedicated wallets for different activities (trading, holding, DeFi)'
    });
  }
  
  console.log('✅ Fallback analysis generated successfully');
  
  return {
    analysis,
    recommendations
  };
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
