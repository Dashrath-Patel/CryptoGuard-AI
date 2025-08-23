import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Rate limiting
let dailyApiCalls = 0;
const MAX_DAILY_CALLS = 30; // Conservative for detailed analysis
const RATE_LIMIT_RESET = 24 * 60 * 60 * 1000;
let lastResetTime = Date.now();

function canMakeApiCall(): boolean {
  const now = Date.now();
  if (now - lastResetTime > RATE_LIMIT_RESET) {
    dailyApiCalls = 0;
    lastResetTime = now;
  }
  return dailyApiCalls < MAX_DAILY_CALLS;
}

// DeFi Protocol Information Database
const defiProtocols = {
  'uniswap': {
    name: 'Uniswap',
    type: 'Decentralized Exchange (DEX)',
    blockchain: 'Ethereum, Polygon, Arbitrum',
    description: 'Automated market maker (AMM) allowing users to swap tokens and provide liquidity',
    riskLevel: 'Medium',
    tvl: '$4.2B+',
    features: ['Token swapping', 'Liquidity provision', 'Yield farming', 'Governance'],
    risks: ['Impermanent loss', 'Smart contract risk', 'Front-running'],
    howItWorks: 'Users provide liquidity to trading pairs and earn fees from trades'
  },
  'aave': {
    name: 'Aave',
    type: 'Lending Protocol',
    blockchain: 'Ethereum, Polygon, Avalanche',
    description: 'Decentralized lending platform for borrowing and lending cryptocurrencies',
    riskLevel: 'Medium-High',
    tvl: '$6.8B+',
    features: ['Lending', 'Borrowing', 'Flash loans', 'Collateral swapping'],
    risks: ['Liquidation risk', 'Interest rate volatility', 'Smart contract risk'],
    howItWorks: 'Users deposit crypto to earn interest or use it as collateral to borrow other assets'
  },
  'compound': {
    name: 'Compound',
    type: 'Lending Protocol',
    blockchain: 'Ethereum',
    description: 'Algorithmic money market protocol for lending and borrowing',
    riskLevel: 'Medium',
    tvl: '$2.1B+',
    features: ['Lending', 'Borrowing', 'Algorithmic interest rates', 'Governance'],
    risks: ['Liquidation risk', 'Governance attacks', 'Smart contract risk'],
    howItWorks: 'Interest rates are determined algorithmically based on supply and demand'
  },
  'makerdao': {
    name: 'MakerDAO',
    type: 'CDP Platform',
    blockchain: 'Ethereum',
    description: 'Decentralized protocol for generating DAI stablecoin through collateralized debt positions',
    riskLevel: 'Medium-High',
    tvl: '$8.5B+',
    features: ['DAI stablecoin', 'Collateralized debt positions', 'Governance', 'Stability fee'],
    risks: ['Liquidation risk', 'Governance risk', 'Black swan events'],
    howItWorks: 'Users lock collateral to mint DAI stablecoin, maintaining overcollateralization'
  },
  'curve': {
    name: 'Curve Finance',
    type: 'Stableswap DEX',
    blockchain: 'Ethereum, Polygon, Arbitrum',
    description: 'DEX optimized for stablecoin and similar asset trading with low slippage',
    riskLevel: 'Medium',
    tvl: '$3.8B+',
    features: ['Stablecoin swapping', 'Liquidity provision', 'Yield farming', 'Vote-locked governance'],
    risks: ['Impermanent loss', 'Smart contract risk', 'Governance manipulation'],
    howItWorks: 'Uses specialized bonding curves for efficient stablecoin and similar asset trading'
  }
};

// DeFi Risk Assessment Framework
function assessDefiRisk(protocol: string, amount: string, userLevel: string): any {
  const protocolData = defiProtocols[protocol.toLowerCase() as keyof typeof defiProtocols];
  
  if (!protocolData) {
    return {
      overall: 'Unknown',
      factors: ['Protocol not in database - exercise extreme caution'],
      recommendations: ['Research thoroughly before proceeding', 'Start with very small amounts', 'Verify contract addresses']
    };
  }
  
  const amountNum = parseFloat(amount);
  let riskScore = 0;
  
  // Protocol base risk
  switch (protocolData.riskLevel) {
    case 'Low': riskScore += 1; break;
    case 'Medium': riskScore += 2; break;
    case 'Medium-High': riskScore += 3; break;
    case 'High': riskScore += 4; break;
  }
  
  // Amount risk
  if (amountNum > 10000) riskScore += 2;
  else if (amountNum > 1000) riskScore += 1;
  
  // User level risk
  if (userLevel === 'beginner') riskScore += 1;
  
  const overallRisk = riskScore <= 2 ? 'Low' : riskScore <= 4 ? 'Medium' : 'High';
  
  return {
    overall: overallRisk,
    score: riskScore,
    factors: protocolData.risks,
    recommendations: [
      'Start with small amounts',
      'Understand the protocol mechanics',
      'Monitor positions regularly',
      'Have an exit strategy'
    ]
  };
}

// Fallback DeFi analysis
function getFallbackDefiAnalysis(input: string, analysisType: string) {
  const inputLower = input.toLowerCase();
  
  // Check if it's a known protocol
  for (const [key, protocol] of Object.entries(defiProtocols)) {
    if (inputLower.includes(key)) {
      return {
        success: true,
        analysis: {
          protocol: protocol.name,
          type: protocol.type,
          description: protocol.description,
          blockchain: protocol.blockchain,
          tvl: protocol.tvl,
          riskLevel: protocol.riskLevel,
          features: protocol.features,
          risks: protocol.risks,
          howItWorks: protocol.howItWorks
        },
        recommendations: [
          'Research the protocol documentation thoroughly',
          'Start with small amounts to test',
          'Understand the tokenomics and governance',
          'Monitor for security audits and updates'
        ],
        aiUsed: false,
        fallbackReason: 'Using protocol database'
      };
    }
  }
  
  // Generic DeFi guidance based on analysis type
  const genericGuidance = {
    'protocol': {
      analysis: 'DeFi protocols are smart contract-based financial applications that automate traditional financial services without intermediaries.',
      risks: ['Smart contract vulnerabilities', 'Governance attacks', 'Economic exploits', 'Regulatory uncertainty'],
      recommendations: ['Use established protocols with good track records', 'Diversify across multiple protocols', 'Keep up with security audits']
    },
    'strategy': {
      analysis: 'DeFi strategies involve various ways to earn yield through lending, providing liquidity, staking, and farming.',
      risks: ['Impermanent loss', 'Protocol risks', 'Market volatility', 'Gas fee optimization'],
      recommendations: ['Understand all risks before investing', 'Calculate potential returns vs risks', 'Have clear entry and exit strategies']
    },
    'transaction': {
      analysis: 'DeFi transactions interact with smart contracts and can be complex, involving multiple steps and protocols.',
      risks: ['Failed transactions', 'Front-running', 'MEV attacks', 'High gas fees'],
      recommendations: ['Check transaction details carefully', 'Use appropriate gas fees', 'Consider transaction timing']
    }
  };
  
  const guidance = genericGuidance[analysisType as keyof typeof genericGuidance] || genericGuidance.protocol;
  
  return {
    success: true,
    analysis: guidance.analysis,
    risks: guidance.risks,
    recommendations: guidance.recommendations,
    aiUsed: false,
    fallbackReason: 'Generic DeFi guidance'
  };
}

// AI-powered DeFi analysis
async function getAIDefiAnalysis(input: string, analysisType: string) {
  if (!canMakeApiCall()) {
    return getFallbackDefiAnalysis(input, analysisType);
  }
  
  dailyApiCalls++;
  console.log(`📊 DeFi API calls today: ${dailyApiCalls}/${MAX_DAILY_CALLS}`);
  
  const systemPrompt = `You are a DeFi (Decentralized Finance) expert analyst with deep knowledge of:
- DeFi protocols, mechanisms, and risks
- Yield farming strategies and optimization
- Liquidity provision and impermanent loss
- Smart contract security and audits
- DeFi tokenomics and governance
- Cross-chain DeFi opportunities
- Risk management in DeFi

Analysis Type: ${analysisType}

Provide a comprehensive analysis in JSON format:
{
  "success": true,
  "analysis": {
    "summary": "High-level overview",
    "detailed_explanation": "In-depth technical explanation",
    "mechanism": "How it works technically",
    "tokenomics": "Token economics if applicable"
  },
  "risks": {
    "high": ["critical risks"],
    "medium": ["moderate risks"],
    "low": ["minor considerations"]
  },
  "opportunities": {
    "yield_potential": "Expected returns and mechanisms",
    "growth_prospects": "Long-term potential",
    "unique_features": "Distinctive advantages"
  },
  "recommendations": {
    "beginner": ["advice for new users"],
    "intermediate": ["advice for experienced users"],
    "advanced": ["advice for DeFi veterans"]
  },
  "market_context": {
    "current_trends": "Relevant market trends",
    "competitive_landscape": "How it compares to alternatives",
    "regulatory_considerations": "Regulatory implications"
  },
  "technical_details": {
    "smart_contracts": "Contract security and audits",
    "blockchain": "Blockchain and layer details",
    "gas_optimization": "Cost considerations"
  },
  "exit_strategy": "How to safely exit positions",
  "monitoring": "Key metrics to track",
  "red_flags": "Warning signs to watch for"
}

Be thorough, practical, and emphasize risk management.`;

  try {
    console.log('🔬 Generating DeFi analysis...');
    const result = await model.generateContent([
      systemPrompt,
      `Please analyze: ${input}`
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
      console.log('⚠️ Failed to parse DeFi analysis response');
    }
    
    // Fallback to text response
    return {
      success: true,
      analysis: responseText,
      aiUsed: true,
      rawResponse: true
    };
    
  } catch (error: any) {
    console.error('❌ DeFi analysis error:', error);
    
    if (error.status === 429) {
      dailyApiCalls = MAX_DAILY_CALLS;
    }
    
    return getFallbackDefiAnalysis(input, analysisType);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, analysisType = 'protocol', userLevel = 'intermediate', amount } = body;
    
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Input is required for DeFi analysis'
      }, { status: 400 });
    }
    
    if (!['protocol', 'strategy', 'transaction', 'risk', 'yield'].includes(analysisType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid analysis type. Use: protocol, strategy, transaction, risk, or yield'
      }, { status: 400 });
    }
    
    console.log(`🔬 DeFi Analysis - Type: ${analysisType}, Input: "${input.substring(0, 50)}..."`);
    
    // Get AI analysis
    const result = await getAIDefiAnalysis(input, analysisType);
    
    // Add risk assessment if amount provided
    let riskAssessment = null;
    if (amount && analysisType === 'risk') {
      riskAssessment = assessDefiRisk(input, amount, userLevel);
    }
    
    const response = {
      ...result,
      riskAssessment,
      metadata: {
        analysisType,
        userLevel,
        amount: amount || null,
        timestamp: new Date().toISOString(),
        apiCallsUsed: dailyApiCalls,
        apiCallsRemaining: MAX_DAILY_CALLS - dailyApiCalls,
        version: '1.0'
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ DeFi analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process DeFi analysis'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'protocols') {
    return NextResponse.json({
      success: true,
      protocols: Object.entries(defiProtocols).map(([key, protocol]) => ({
        id: key,
        name: protocol.name,
        type: protocol.type,
        blockchain: protocol.blockchain,
        tvl: protocol.tvl,
        riskLevel: protocol.riskLevel
      }))
    });
  }
  
  if (action === 'analysis-types') {
    return NextResponse.json({
      success: true,
      analysisTypes: [
        { id: 'protocol', name: 'Protocol Analysis', description: 'Analyze specific DeFi protocols' },
        { id: 'strategy', name: 'Strategy Analysis', description: 'Evaluate DeFi strategies' },
        { id: 'transaction', name: 'Transaction Analysis', description: 'Analyze DeFi transactions' },
        { id: 'risk', name: 'Risk Assessment', description: 'Assess risks and safety' },
        { id: 'yield', name: 'Yield Analysis', description: 'Analyze yield opportunities' }
      ]
    });
  }
  
  return NextResponse.json({
    success: true,
    message: 'DeFi Analysis System',
    usage: {
      endpoint: '/api/defi-analysis',
      method: 'POST',
      body: {
        input: 'Protocol name, strategy, or transaction to analyze',
        analysisType: 'protocol|strategy|transaction|risk|yield',
        userLevel: 'beginner|intermediate|advanced',
        amount: 'Optional: investment amount for risk assessment'
      }
    }
  });
}
