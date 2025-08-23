import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Rate limiting
let dailyApiCalls = 0;
const MAX_DAILY_CALLS = 25;
const RATE_LIMIT_RESET = 24 * 60 * 60 * 1000;
let lastResetTime = Date.now();

// Transaction type detection patterns
const transactionPatterns = {
  'uniswap_swap': {
    patterns: ['0x7ff36ab5', '0x38ed1739', '0x8803dbee'],
    description: 'Token swap on Uniswap',
    explanation: 'Exchange one token for another using Uniswap\'s automated market maker',
    riskLevel: 'Low-Medium'
  },
  'aave_deposit': {
    patterns: ['0xe8eda9df', '0x617ba037'],
    description: 'Deposit to Aave lending pool',
    explanation: 'Deposit cryptocurrency to earn interest in Aave protocol',
    riskLevel: 'Medium'
  },
  'aave_borrow': {
    patterns: ['0xa415bcad', '0xc858f5f9'],
    description: 'Borrow from Aave',
    explanation: 'Borrow cryptocurrency using collateral in Aave protocol',
    riskLevel: 'Medium-High'
  },
  'compound_supply': {
    patterns: ['0x1249c58b', '0xa0712d68'],
    description: 'Supply to Compound',
    explanation: 'Supply cryptocurrency to Compound protocol to earn interest',
    riskLevel: 'Medium'
  },
  'yield_farming': {
    patterns: ['0x2e1a7d4d', '0xf305d719'],
    description: 'Yield farming operation',
    explanation: 'Participating in yield farming to earn additional tokens',
    riskLevel: 'Medium-High'
  },
  'liquidity_provision': {
    patterns: ['0xe8e33700', '0xf305d719'],
    description: 'Liquidity provision',
    explanation: 'Adding liquidity to a trading pair to earn fees',
    riskLevel: 'Medium'
  },
  'nft_purchase': {
    patterns: ['0x96b5a755', '0xfb0f3ee1'],
    description: 'NFT purchase',
    explanation: 'Buying a non-fungible token',
    riskLevel: 'High'
  },
  'flash_loan': {
    patterns: ['0x5cffe9de', '0xab9c4b5d'],
    description: 'Flash loan execution',
    explanation: 'Borrowing and repaying funds within a single transaction',
    riskLevel: 'High'
  }
};

// Contract address database
const knownContracts: { [key: string]: string } = {
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'Uniswap Token (UNI)',
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'Polygon Matic Token',
  '0xa0b86a33e6776c8e9e49b0f7d5b72c7c2cb7d38e': 'Aave Protocol',
  '0x5d3a536e4d6dbd6114cc1ead35777bab161c2115': 'Compound cDAI',
  '0x39aa39c021dfbae8fac545936693ac917d5e7563': 'Compound cUSDC',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'Wrapped Ether (WETH)',
  '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b': 'Cronos Token (CRO)',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'Wrapped Bitcoin (WBTC)'
};

// Gas fee analysis
function analyzeGasFees(gasUsed: number, gasPrice: number) {
  const gasCostWei = gasUsed * gasPrice;
  const gasCostEth = gasCostWei / 1e18;
  
  let efficiency = 'Unknown';
  if (gasUsed < 50000) efficiency = 'Very Efficient';
  else if (gasUsed < 100000) efficiency = 'Efficient';
  else if (gasUsed < 200000) efficiency = 'Moderate';
  else if (gasUsed < 500000) efficiency = 'High';
  else efficiency = 'Very High';
  
  return {
    gasCostEth,
    gasCostWei,
    gasUsed,
    gasPrice,
    efficiency,
    recommendations: gasCostEth > 0.01 ? 
      ['Consider using Layer 2 solutions', 'Use gas optimization techniques', 'Time transactions during low network activity'] :
      ['Gas cost is reasonable', 'Transaction was efficient']
  };
}

// Fallback transaction analysis
function getFallbackTransactionAnalysis(txHash: string, txData: any) {
  const analysis = {
    hash: txHash,
    type: 'Unknown Transaction',
    description: 'Transaction details could not be fully analyzed',
    explanation: 'This appears to be a blockchain transaction. Without API access, detailed analysis is limited.',
    riskLevel: 'Medium',
    breakdown: {
      from: txData?.from || 'Unknown',
      to: txData?.to || 'Unknown',
      value: txData?.value || '0',
      gasUsed: txData?.gasUsed || 0,
      status: txData?.status || 'Unknown'
    },
    recommendations: [
      'Verify transaction details on a blockchain explorer',
      'Ensure the transaction achieved its intended purpose',
      'Check for any unexpected token transfers',
      'Monitor wallet balance changes'
    ],
    warnings: [
      'Always verify transaction details independently',
      'Be cautious of unexpected transactions',
      'Keep records of all DeFi interactions'
    ]
  };
  
  // Try to identify transaction type from input data
  if (txData?.input) {
    const methodId = txData.input.substring(0, 10);
    for (const [type, pattern] of Object.entries(transactionPatterns)) {
      if (pattern.patterns.includes(methodId)) {
        analysis.type = pattern.description;
        analysis.explanation = pattern.explanation;
        analysis.riskLevel = pattern.riskLevel;
        break;
      }
    }
  }
  
  // Check if interacting with known contracts
  if (txData?.to && knownContracts[txData.to.toLowerCase()]) {
    analysis.breakdown.to = knownContracts[txData.to.toLowerCase()];
  }
  
  return {
    success: true,
    analysis,
    aiUsed: false,
    fallbackReason: 'Limited transaction data available'
  };
}

// AI-powered transaction analysis
async function getAITransactionAnalysis(txHash: string, txData: any) {
  if (!dailyApiCalls || dailyApiCalls >= MAX_DAILY_CALLS) {
    return getFallbackTransactionAnalysis(txHash, txData);
  }
  
  dailyApiCalls++;
  console.log(`📊 Transaction analysis API calls: ${dailyApiCalls}/${MAX_DAILY_CALLS}`);
  
  const systemPrompt = `You are an expert blockchain transaction analyst specializing in DeFi protocols. Analyze the provided transaction data and explain it in simple terms.

Provide analysis in JSON format:
{
  "success": true,
  "analysis": {
    "type": "Transaction type (swap, deposit, borrow, etc.)",
    "protocol": "DeFi protocol involved",
    "description": "What this transaction does",
    "explanation": "Detailed explanation in simple terms",
    "purpose": "Why someone would make this transaction",
    "mechanism": "How the transaction works technically"
  },
  "breakdown": {
    "from": "Sender address analysis",
    "to": "Receiver/contract analysis", 
    "value": "Value transferred",
    "tokens_involved": ["list of tokens"],
    "fees": "Transaction fees analysis"
  },
  "risks": {
    "immediate": ["immediate risks"],
    "ongoing": ["ongoing risks"],
    "mitigation": ["risk mitigation strategies"]
  },
  "impact": {
    "wallet_changes": "How this affects the wallet",
    "position_changes": "Changes to DeFi positions",
    "future_obligations": "Any ongoing commitments"
  },
  "recommendations": {
    "monitoring": "What to monitor after this transaction",
    "next_steps": "Suggested next steps",
    "optimization": "How to optimize similar transactions"
  },
  "red_flags": "Any concerning aspects",
  "educational_notes": "Key concepts for beginners"
}

Focus on making complex DeFi transactions understandable.`;

  try {
    const txDataString = JSON.stringify(txData, null, 2);
    console.log('🔍 Analyzing transaction with AI...');
    
    const result = await model.generateContent([
      systemPrompt,
      `Transaction Hash: ${txHash}
      Transaction Data: ${txDataString}
      
      Please provide a comprehensive analysis of this transaction.`
    ]);
    
    const response = await result.response;
    const responseText = response.text();
    
    // Parse JSON response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          ...parsedResponse,
          aiUsed: true,
          apiCallsRemaining: MAX_DAILY_CALLS - dailyApiCalls
        };
      }
    } catch (parseError) {
      console.log('⚠️ Failed to parse transaction analysis');
    }
    
    return {
      success: true,
      analysis: responseText,
      aiUsed: true,
      rawResponse: true
    };
    
  } catch (error: any) {
    console.error('❌ Transaction analysis error:', error);
    
    if (error.status === 429) {
      dailyApiCalls = MAX_DAILY_CALLS;
    }
    
    return getFallbackTransactionAnalysis(txHash, txData);
  }
}

// Decode transaction input data
function decodeTransactionInput(input: string) {
  if (!input || input === '0x') {
    return {
      type: 'Simple Transfer',
      description: 'Direct token or ETH transfer'
    };
  }
  
  const methodId = input.substring(0, 10);
  
  // Common DeFi function signatures
  const knownMethods: { [key: string]: string } = {
    '0xa9059cbb': 'transfer(address,uint256)',
    '0x23b872dd': 'transferFrom(address,address,uint256)',
    '0x095ea7b3': 'approve(address,uint256)',
    '0x7ff36ab5': 'swapExactETHForTokens',
    '0x38ed1739': 'swapExactTokensForTokens',
    '0x8803dbee': 'swapTokensForExactTokens',
    '0xe8eda9df': 'deposit(address,uint256,address,uint16)',
    '0xa415bcad': 'borrow(address,uint256,uint256,uint16,address)',
    '0x1249c58b': 'mint(uint256)',
    '0xdb006a75': 'redeem(uint256)',
    '0x2e1a7d4d': 'withdraw(uint256)',
    '0xf305d719': 'addLiquidity'
  };
  
  const methodName = knownMethods[methodId];
  
  if (methodName) {
    return {
      methodId,
      methodName,
      inputData: input,
      decodedPartially: true
    };
  }
  
  return {
    methodId,
    methodName: 'Unknown Method',
    inputData: input,
    decodedPartially: false
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionHash, transactionData, analysisType = 'full' } = body;
    
    if (!transactionHash && !transactionData) {
      return NextResponse.json({
        success: false,
        error: 'Either transaction hash or transaction data is required'
      }, { status: 400 });
    }
    
    console.log(`🔍 Analyzing transaction: ${transactionHash || 'Custom data'}`);
    
    let txData = transactionData;
    
    // If only hash provided, we'll work with what we have
    if (transactionHash && !transactionData) {
      txData = {
        hash: transactionHash,
        note: 'Limited data - hash only provided'
      };
    }
    
    // Decode input data if available
    let decodedInput = null;
    if (txData?.input) {
      decodedInput = decodeTransactionInput(txData.input);
    }
    
    // Analyze gas fees if available
    let gasAnalysis = null;
    if (txData?.gasUsed && txData?.gasPrice) {
      gasAnalysis = analyzeGasFees(parseInt(txData.gasUsed), parseInt(txData.gasPrice));
    }
    
    // Get AI analysis
    const result = await getAITransactionAnalysis(transactionHash || 'custom', txData);
    
    const response = {
      ...result,
      decodedInput,
      gasAnalysis,
      metadata: {
        transactionHash: transactionHash || null,
        analysisType,
        timestamp: new Date().toISOString(),
        apiCallsUsed: dailyApiCalls,
        apiCallsRemaining: MAX_DAILY_CALLS - dailyApiCalls,
        hasFullData: !!transactionData,
        version: '1.0'
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Transaction analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze transaction'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'patterns') {
    return NextResponse.json({
      success: true,
      transactionPatterns: Object.entries(transactionPatterns).map(([key, pattern]) => ({
        id: key,
        description: pattern.description,
        explanation: pattern.explanation,
        riskLevel: pattern.riskLevel
      }))
    });
  }
  
  if (action === 'contracts') {
    return NextResponse.json({
      success: true,
      knownContracts: Object.entries(knownContracts).map(([address, name]) => ({
        address,
        name
      }))
    });
  }
  
  if (action === 'status') {
    const now = Date.now();
    if (now - lastResetTime > RATE_LIMIT_RESET) {
      dailyApiCalls = 0;
      lastResetTime = now;
    }
    
    return NextResponse.json({
      success: true,
      status: {
        apiCallsUsed: dailyApiCalls,
        apiCallsRemaining: MAX_DAILY_CALLS - dailyApiCalls,
        canAnalyze: dailyApiCalls < MAX_DAILY_CALLS
      }
    });
  }
  
  return NextResponse.json({
    success: true,
    message: 'Transaction Analysis System',
    usage: {
      endpoint: '/api/transaction-analysis',
      method: 'POST',
      body: {
        transactionHash: 'Blockchain transaction hash',
        transactionData: 'Optional: Full transaction data object',
        analysisType: 'full|quick|security'
      },
      actions: [
        'GET ?action=patterns - Get known transaction patterns',
        'GET ?action=contracts - Get known contract addresses',
        'GET ?action=status - Check API usage status'
      ]
    }
  });
}
