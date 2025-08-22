import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Rate limiting
let dailyApiCalls = 0;
const MAX_DAILY_CALLS = 40; // Conservative limit
const RATE_LIMIT_RESET = 24 * 60 * 60 * 1000;
let lastResetTime = Date.now();

function resetDailyLimitIfNeeded() {
  const now = Date.now();
  if (now - lastResetTime > RATE_LIMIT_RESET) {
    dailyApiCalls = 0;
    lastResetTime = now;
  }
}

function canMakeApiCall(): boolean {
  resetDailyLimitIfNeeded();
  return dailyApiCalls < MAX_DAILY_CALLS;
}

// Query categorization
function categorizeQuery(query: string): {
  category: string;
  confidence: number;
  keywords: string[];
} {
  const categories: { [key: string]: string[] } = {
    'DeFi': [
      'defi', 'yield farming', 'liquidity pool', 'amm', 'automated market maker',
      'staking', 'governance', 'dao', 'flash loan', 'impermanent loss',
      'liquidity provider', 'farming', 'compound', 'aave', 'uniswap', 'sushiswap'
    ],
    'Trading': [
      'buy', 'sell', 'trade', 'exchange', 'price', 'market', 'order',
      'arbitrage', 'slippage', 'volume', 'chart', 'analysis', 'strategy'
    ],
    'Security': [
      'safe', 'secure', 'risk', 'scam', 'audit', 'vulnerability', 'hack',
      'private key', 'seed phrase', 'wallet', 'cold storage', 'multi-sig'
    ],
    'Technical': [
      'blockchain', 'smart contract', 'gas', 'transaction', 'mining',
      'consensus', 'node', 'validator', 'fork', 'layer 2', 'rollup'
    ],
    'Investment': [
      'invest', 'portfolio', 'returns', 'profit', 'loss', 'hodl',
      'diversify', 'allocation', 'market cap', 'valuation'
    ],
    'Beginner': [
      'what is', 'how to', 'explain', 'beginner', 'start', 'learn',
      'basics', 'introduction', 'simple', 'understand'
    ]
  };

  const queryLower = query.toLowerCase();
  const scores: { [key: string]: number } = {};
  const foundKeywords: { [key: string]: string[] } = {};

  Object.entries(categories).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => queryLower.includes(keyword));
    scores[category] = matches.length;
    foundKeywords[category] = matches;
  });

  const topCategory = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  );

  return {
    category: topCategory[0],
    confidence: topCategory[1] / (categories[topCategory[0]]?.length || 1),
    keywords: foundKeywords[topCategory[0]] || []
  };
}

// Fallback responses for common queries
const fallbackResponses = {
  'what is defi': {
    answer: 'DeFi (Decentralized Finance) is a blockchain-based form of finance that does not rely on central financial intermediaries like banks or exchanges. Instead, it uses smart contracts on blockchains to provide financial services.',
    explanation: 'DeFi applications allow you to lend, borrow, trade, and earn interest on your cryptocurrency without going through traditional banks.',
    risks: ['Smart contract vulnerabilities', 'Impermanent loss in liquidity pools', 'Regulatory uncertainty'],
    gettingStarted: ['Start with small amounts', 'Use reputable protocols', 'Understand the risks before investing']
  },
  'what is yield farming': {
    answer: 'Yield farming is the practice of lending or staking cryptocurrency tokens to generate high returns or rewards in the form of additional cryptocurrency.',
    explanation: 'Users provide liquidity to DeFi protocols and earn rewards, often in the form of the protocol\'s native tokens.',
    risks: ['Impermanent loss', 'Smart contract risks', 'Token price volatility', 'Rug pulls'],
    gettingStarted: ['Research the protocol thoroughly', 'Start with established platforms', 'Diversify across multiple pools']
  },
  'how to start crypto': {
    answer: 'To start with cryptocurrency: 1) Choose a reputable exchange, 2) Verify your identity, 3) Start with small amounts, 4) Learn about wallet security, 5) Understand the risks.',
    explanation: 'Cryptocurrency investing requires understanding both the technology and financial risks involved.',
    risks: ['Price volatility', 'Regulatory changes', 'Security breaches', 'Loss of private keys'],
    gettingStarted: ['Use dollar-cost averaging', 'Only invest what you can afford to lose', 'Keep most funds in cold storage']
  }
};

// Generate AI response
async function getAIResponse(query: string, category: string) {
  if (!canMakeApiCall()) {
    console.log('⚠️ API limit reached, using fallback');
    
    // Try to find a relevant fallback response
    const queryKey = query.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (queryKey.includes(key) || key.split(' ').some(word => queryKey.includes(word))) {
        return {
          success: true,
          answer: response.answer,
          explanation: response.explanation,
          risks: response.risks,
          gettingStarted: response.gettingStarted,
          aiUsed: false,
          fallbackReason: 'API quota exhausted'
        };
      }
    }
    
    return {
      success: false,
      error: 'API quota exhausted and no suitable fallback found',
      suggestion: 'Please try again tomorrow or rephrase your question'
    };
  }

  dailyApiCalls++;
  console.log(`📊 API calls today: ${dailyApiCalls}/${MAX_DAILY_CALLS}`);

  const systemPrompt = `You are CryptoGuard AI, an expert blockchain and DeFi consultant. Your role is to:

1. Provide accurate, beginner-friendly explanations of cryptocurrency and DeFi concepts
2. Always highlight potential risks and security considerations
3. Give practical, actionable advice
4. Stay current with DeFi trends and protocols
5. Prioritize user safety and education

Query Category: ${category}

Please provide a comprehensive response in JSON format:
{
  "success": true,
  "answer": "Direct answer to the user's question",
  "explanation": "Detailed explanation with context",
  "risks": ["risk1", "risk2", "risk3"],
  "benefits": ["benefit1", "benefit2"],
  "gettingStarted": ["step1", "step2", "step3"],
  "relatedConcepts": ["concept1", "concept2"],
  "recommendedReading": ["resource1", "resource2"],
  "riskLevel": "low/medium/high",
  "complexity": "beginner/intermediate/advanced"
}

Focus on being educational, practical, and safety-conscious.`;

  try {
    console.log('🤖 Generating AI response...');
    const result = await model.generateContent([
      systemPrompt,
      `User Question: ${query}`
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
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.log('⚠️ Failed to parse AI response, using text fallback');
      return {
        success: true,
        answer: responseText,
        explanation: 'AI response could not be parsed into structured format',
        aiUsed: true,
        rawResponse: true
      };
    }
    
  } catch (error: any) {
    console.error('❌ AI API error:', error);
    
    if (error.status === 429) {
      dailyApiCalls = MAX_DAILY_CALLS;
    }
    
    // Fallback to predefined responses
    const queryKey = query.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (queryKey.includes(key)) {
        return {
          ...response,
          success: true,
          aiUsed: false,
          fallbackReason: 'AI API error'
        };
      }
    }
    
    return {
      success: false,
      error: 'Unable to process query at this time',
      suggestion: 'Please try a simpler question or check back later'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context } = body;
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Query is required and must be a non-empty string'
      }, { status: 400 });
    }
    
    if (query.length > 1000) {
      return NextResponse.json({
        success: false,
        error: 'Query is too long. Maximum 1000 characters allowed.'
      }, { status: 400 });
    }
    
    console.log(`❓ Processing query: "${query.substring(0, 100)}${query.length > 100 ? '...' : ''}"`);
    
    // Categorize the query
    const categorization = categorizeQuery(query);
    console.log(`📂 Query categorized as: ${categorization.category} (confidence: ${categorization.confidence})`);
    
    // Get AI response
    const result = await getAIResponse(query, categorization.category);
    
    // Add metadata
    const response = {
      ...result,
      metadata: {
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        category: categorization.category,
        confidence: categorization.confidence,
        keywords: categorization.keywords,
        timestamp: new Date().toISOString(),
        apiCallsUsed: dailyApiCalls,
        apiCallsRemaining: MAX_DAILY_CALLS - dailyApiCalls,
        context: context || 'general',
        version: '1.0'
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Query processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process query'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'status') {
    resetDailyLimitIfNeeded();
    return NextResponse.json({
      success: true,
      status: {
        apiCallsUsed: dailyApiCalls,
        apiCallsRemaining: MAX_DAILY_CALLS - dailyApiCalls,
        canMakeApiCall: canMakeApiCall(),
        lastResetTime: new Date(lastResetTime).toISOString(),
        nextResetTime: new Date(lastResetTime + RATE_LIMIT_RESET).toISOString()
      }
    });
  }
  
  if (action === 'categories') {
    return NextResponse.json({
      success: true,
      categories: ['DeFi', 'Trading', 'Security', 'Technical', 'Investment', 'Beginner'],
      sampleQueries: [
        'What is yield farming and how does it work?',
        'How to safely store cryptocurrency?',
        'Explain smart contracts in simple terms',
        'What are the risks of DeFi investing?',
        'How to start investing in cryptocurrency?'
      ]
    });
  }
  
  return NextResponse.json({
    success: true,
    message: 'CryptoGuard AI Query System',
    usage: {
      endpoint: '/api/crypto-query',
      method: 'POST',
      body: '{ "query": "your question here", "context": "optional context" }',
      actions: [
        'GET ?action=status - Check API usage status',
        'GET ?action=categories - Get available query categories'
      ]
    }
  });
}
