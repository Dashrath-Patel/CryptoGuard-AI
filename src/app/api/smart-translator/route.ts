import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Enhanced DeFi and Crypto Dictionary
const cryptoDictionary = {
  // Basic Crypto Terms
  'crypto': 'Cryptocurrency - Digital or virtual currency secured by cryptography',
  'cryptocurrency': 'Digital or virtual currency secured by cryptography',
  'bitcoin': 'The first and most well-known cryptocurrency, created by Satoshi Nakamoto',
  'ethereum': 'A decentralized platform that runs smart contracts and hosts the Ether cryptocurrency',
  'blockchain': 'A distributed ledger technology that maintains a continuously growing list of records',
  'wallet': 'A digital tool that allows users to store, send, and receive cryptocurrencies',
  'address': 'A unique identifier used to send and receive cryptocurrency transactions',
  'private key': 'A secret number that allows cryptocurrency to be spent from a wallet',
  'public key': 'A cryptographic key that can be shared publicly and is used to receive funds',
  
  // DeFi Terms
  'defi': 'Decentralized Finance - Financial services built on blockchain technology without traditional intermediaries',
  'yield farming': 'A DeFi strategy where users provide liquidity to earn rewards in the form of additional cryptocurrency',
  'liquidity pool': 'A pool of tokens locked in a smart contract used to facilitate trading and lending',
  'liquidity provider': 'Users who deposit tokens into liquidity pools to earn fees and rewards',
  'automated market maker': 'AMM - A type of decentralized exchange protocol that uses mathematical formulas to price assets',
  'amm': 'Automated Market Maker - A protocol that uses algorithms to price assets and facilitate trading',
  'smart contract': 'Self-executing contracts with terms directly written into code',
  'dapp': 'Decentralized Application - An application that runs on a decentralized network',
  'dao': 'Decentralized Autonomous Organization - An organization governed by smart contracts and token holders',
  'governance token': 'A token that gives holders voting rights in protocol decisions',
  'staking': 'The process of holding and locking cryptocurrency to support network operations and earn rewards',
  'slippage': 'The difference between expected and actual transaction prices due to market movement',
  'impermanent loss': 'Temporary loss experienced by liquidity providers when token prices diverge',
  'flash loan': 'An uncollateralized loan that must be borrowed and repaid within the same transaction',
  'oracle': 'A service that provides external data to blockchain smart contracts',
  'bridge': 'A protocol that allows tokens to be transferred between different blockchains',
  'cross-chain': 'Technology that enables interaction between different blockchain networks',
  
  // Trading Terms
  'dex': 'Decentralized Exchange - A peer-to-peer marketplace for cryptocurrency trading',
  'cex': 'Centralized Exchange - A traditional cryptocurrency exchange operated by a company',
  'orderbook': 'A list of buy and sell orders for a particular asset',
  'market maker': 'An entity that provides liquidity by placing buy and sell orders',
  'arbitrage': 'The practice of buying and selling identical assets in different markets to profit from price differences',
  'hodl': 'A strategy of holding cryptocurrency long-term instead of trading',
  'fomo': 'Fear Of Missing Out - The anxiety of missing potential profits',
  'fud': 'Fear, Uncertainty, and Doubt - Negative sentiment spread to influence market prices',
  'pump and dump': 'A fraudulent scheme to inflate asset prices before selling for profit',
  
  // Technical Terms
  'gas': 'The fee required to execute transactions and smart contracts on Ethereum',
  'gas limit': 'The maximum amount of gas a user is willing to spend on a transaction',
  'gas price': 'The amount of Ether paid per unit of gas',
  'nonce': 'A number used once in cryptographic communications',
  'consensus': 'The process by which network participants agree on the state of the blockchain',
  'mining': 'The process of validating transactions and adding them to the blockchain',
  'proof of work': 'A consensus mechanism where miners compete to solve mathematical puzzles',
  'proof of stake': 'A consensus mechanism where validators are chosen based on their stake',
  'validator': 'A network participant responsible for verifying transactions in proof-of-stake systems',
  'node': 'A computer that maintains a copy of the blockchain and validates transactions',
  'fork': 'A change to blockchain protocol rules, creating a new version',
  'hard fork': 'A permanent divergence from the previous version of the blockchain',
  'soft fork': 'A backward-compatible upgrade to the blockchain protocol',
  
  // Token Standards
  'erc-20': 'A technical standard for fungible tokens on the Ethereum blockchain',
  'erc-721': 'A technical standard for non-fungible tokens (NFTs) on Ethereum',
  'erc-1155': 'A multi-token standard allowing both fungible and non-fungible tokens',
  'nft': 'Non-Fungible Token - A unique digital asset that cannot be replicated',
  'fungible': 'Interchangeable tokens where each unit is identical to every other unit',
  'non-fungible': 'Unique tokens that cannot be exchanged on a one-to-one basis',
  
  // Layer 2 Solutions
  'layer 2': 'Scaling solutions built on top of existing blockchains to improve speed and reduce costs',
  'rollup': 'A scaling solution that bundles multiple transactions into a single transaction',
  'optimistic rollup': 'A layer 2 solution that assumes transactions are valid unless proven otherwise',
  'zk-rollup': 'Zero-Knowledge Rollup - A layer 2 solution using cryptographic proofs for validation',
  'sidechain': 'A separate blockchain that runs parallel to the main blockchain',
  'state channel': 'A two-way communication channel between users that enables off-chain transactions',
  
  // Yield and Rewards
  'apy': 'Annual Percentage Yield - The real rate of return earned on an investment over one year',
  'apr': 'Annual Percentage Rate - The yearly interest rate without compounding',
  'compound interest': 'Interest calculated on both principal and previously earned interest',
  'rewards': 'Tokens earned for participating in network activities like staking or providing liquidity',
  'farming': 'The practice of earning cryptocurrency rewards by providing liquidity or staking tokens',
  'pool': 'A collection of funds locked in a smart contract for various DeFi purposes',
  
  // Security Terms
  'multi-signature': 'A security feature requiring multiple private keys to authorize a transaction',
  'cold storage': 'Storing cryptocurrency offline for enhanced security',
  'hot wallet': 'A cryptocurrency wallet connected to the internet',
  'seed phrase': 'A series of words used to recover a cryptocurrency wallet',
  'rug pull': 'A scam where developers abandon a project and steal investor funds',
  'smart contract audit': 'A thorough examination of smart contract code for security vulnerabilities',
  'honeypot': 'A smart contract designed to trap funds and prevent withdrawals',
  
  // Market Terms
  'market cap': 'Market Capitalization - The total value of all tokens in circulation',
  'total value locked': 'TVL - The total amount of assets locked in DeFi protocols',
  'tvl': 'Total Value Locked - The total amount of assets locked in DeFi protocols',
  'liquidity': 'The ease with which an asset can be bought or sold without affecting its price',
  'volume': 'The total amount of cryptocurrency traded over a specific period',
  'whale': 'An individual or entity that holds a large amount of cryptocurrency',
  'bull market': 'A period of rising cryptocurrency prices',
  'bear market': 'A period of falling cryptocurrency prices',
  'altcoin': 'Any cryptocurrency other than Bitcoin',
  'stablecoin': 'A cryptocurrency designed to maintain a stable value relative to a reference asset',
  
  // Governance and Community
  'proposal': 'A suggested change or addition to a protocol submitted for community voting',
  'voting power': 'The influence a token holder has in governance decisions',
  'quorum': 'The minimum number of votes required for a governance proposal to be valid',
  'treasury': 'A pool of funds controlled by a DAO or protocol for development and operations',
  'tokenomics': 'The economic model and distribution mechanism of a cryptocurrency token'
};

// Rate limiting for API calls
let dailyApiCalls = 0;
const MAX_DAILY_CALLS = 45; // Leave some buffer from 50 limit
const RATE_LIMIT_RESET = 24 * 60 * 60 * 1000; // 24 hours

// Simple in-memory rate limiting (in production, use Redis or database)
let lastResetTime = Date.now();

function resetDailyLimitIfNeeded() {
  const now = Date.now();
  if (now - lastResetTime > RATE_LIMIT_RESET) {
    dailyApiCalls = 0;
    lastResetTime = now;
    console.log('🔄 Daily API limit reset');
  }
}

function canMakeApiCall(): boolean {
  resetDailyLimitIfNeeded();
  return dailyApiCalls < MAX_DAILY_CALLS;
}

function incrementApiCall() {
  dailyApiCalls++;
  console.log(`📊 API calls today: ${dailyApiCalls}/${MAX_DAILY_CALLS}`);
}

// Enhanced text analysis function
function analyzeTextForCryptoTerms(text: string): string[] {
  const foundTerms: string[] = [];
  const lowercaseText = text.toLowerCase();
  
  // Direct dictionary lookups
  Object.keys(cryptoDictionary).forEach(term => {
    const regex = new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(lowercaseText)) {
      foundTerms.push(term);
    }
  });
  
  // Advanced pattern matching for compound terms
  const patterns = [
    /(?:yield|liquidity|farming|staking|defi|crypto|blockchain|smart\s+contract|dao|nft|dapp)/gi,
    /(?:bitcoin|ethereum|ether|btc|eth)/gi,
    /(?:wallet|address|private\s+key|public\s+key|seed\s+phrase)/gi,
    /(?:gas|fee|transaction|mining|validator)/gi,
    /(?:token|coin|currency|digital\s+asset)/gi,
    /(?:exchange|trading|market|price|volume)/gi,
    /(?:pool|liquidity|provider|automated\s+market\s+maker|amm)/gi,
    /(?:governance|voting|proposal|treasury)/gi,
    /(?:layer\s*2|rollup|sidechain|bridge|cross-chain)/gi,
    /(?:apy|apr|rewards|compound|interest)/gi
  ];
  
  patterns.forEach(pattern => {
    const matches = lowercaseText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const normalizedMatch = match.toLowerCase().trim();
        if (cryptoDictionary[normalizedMatch] && !foundTerms.includes(normalizedMatch)) {
          foundTerms.push(normalizedMatch);
        }
      });
    }
  });
  
  console.log(`Found ${foundTerms.length} crypto terms:`, foundTerms);
  return foundTerms;
}

// Fallback analysis using dictionary
function getDictionaryAnalysis(text: string, mode: 'term' | 'text' = 'text') {
  if (mode === 'term') {
    const term = text.toLowerCase().trim();
    const definition = cryptoDictionary[term];
    
    if (definition) {
      return {
        success: true,
        translations: [{
          original: text,
          simplified: definition,
          explanation: `This is a ${term.includes('defi') || term.includes('yield') || term.includes('liquidity') ? 'DeFi' : 'cryptocurrency'} term.`,
          context: 'Financial Technology',
          riskLevel: term.includes('flash loan') || term.includes('rug pull') || term.includes('honeypot') ? 'high' : 
                    term.includes('smart contract') || term.includes('defi') ? 'medium' : 'low'
        }]
      };
    } else {
      return {
        success: false,
        error: 'Term not found in crypto dictionary',
        suggestion: 'Try analyzing full text instead of individual terms'
      };
    }
  }
  
  // Text analysis mode
  const foundTerms = analyzeTextForCryptoTerms(text);
  
  if (foundTerms.length === 0) {
    return {
      success: false,
      error: 'No crypto terms found in the text',
      suggestion: 'Try using more specific blockchain or DeFi terminology'
    };
  }
  
  const translations = foundTerms.map(term => ({
    original: term,
    simplified: cryptoDictionary[term],
    explanation: `${term.charAt(0).toUpperCase() + term.slice(1)} is a key concept in ${
      term.includes('defi') || term.includes('yield') || term.includes('liquidity') || term.includes('farming') ? 'DeFi (Decentralized Finance)' :
      term.includes('nft') || term.includes('token') ? 'Digital Assets' :
      term.includes('mining') || term.includes('consensus') || term.includes('validator') ? 'Blockchain Consensus' :
      'Cryptocurrency Technology'
    }.`,
    context: text.substring(Math.max(0, text.toLowerCase().indexOf(term) - 50), 
                           Math.min(text.length, text.toLowerCase().indexOf(term) + term.length + 50)),
    riskLevel: term.includes('flash loan') || term.includes('rug pull') || term.includes('honeypot') ? 'high' : 
               term.includes('smart contract') || term.includes('defi') || term.includes('dao') ? 'medium' : 'low'
  }));
  
  return {
    success: true,
    translations,
    summary: `Found ${foundTerms.length} crypto/DeFi terms. ${foundTerms.filter(t => t.includes('defi') || t.includes('yield') || t.includes('liquidity')).length} DeFi-related terms detected.`,
    aiUsed: false,
    fallbackReason: 'Using enhanced dictionary analysis'
  };
}

// Enhanced Gemini API integration
async function getGeminiTranslation(text: string, mode: 'term' | 'text' = 'text') {
  if (!canMakeApiCall()) {
    console.log('⚠️ Daily API limit reached, using fallback');
    return getDictionaryAnalysis(text, mode);
  }
  
  incrementApiCall();
  
  const prompt = mode === 'term' 
    ? `You are a expert blockchain and DeFi educator. Please explain this cryptocurrency/DeFi term in simple English:

Term: "${text}"

Please provide a JSON response with:
{
  "success": true,
  "translations": [{
    "original": "${text}",
    "simplified": "Simple explanation in plain English",
    "explanation": "Detailed explanation with context",
    "context": "Where this term is commonly used",
    "riskLevel": "low/medium/high",
    "examples": ["practical example 1", "practical example 2"]
  }]
}

Focus on making it understandable for beginners while being accurate.`
    
    : `You are an expert blockchain and DeFi educator. Analyze this text and explain any cryptocurrency, blockchain, or DeFi terms in simple English:

Text: "${text}"

Please identify and explain all crypto/blockchain/DeFi terms found. Provide a JSON response with:
{
  "success": true,
  "translations": [
    {
      "original": "term found in text",
      "simplified": "Simple explanation in plain English",
      "explanation": "Detailed explanation with context",
      "context": "Surrounding text context",
      "riskLevel": "low/medium/high",
      "category": "DeFi/Trading/Security/Technical/etc"
    }
  ],
  "summary": "Overall explanation of what this text is about",
  "riskAssessment": "Overall risk level and important warnings"
}

Focus on:
1. DeFi protocols and mechanisms
2. Trading and investment terms
3. Security implications
4. Technical blockchain concepts
5. Risk factors users should be aware of

Make explanations beginner-friendly but comprehensive.`;

  try {
    console.log('🚀 Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    console.log('✅ Gemini API response received');
    
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
      console.log('⚠️ Failed to parse Gemini response, using fallback');
      return getDictionaryAnalysis(text, mode);
    }
    
  } catch (error: any) {
    console.error('❌ Gemini API error:', error);
    
    if (error.status === 429) {
      console.log('🔄 Rate limit reached, using fallback');
      dailyApiCalls = MAX_DAILY_CALLS; // Mark as exhausted
    }
    
    return getDictionaryAnalysis(text, mode);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, mode = 'text' } = body;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Text is required and must be a non-empty string'
      }, { status: 400 });
    }
    
    if (text.length > 5000) {
      return NextResponse.json({
        success: false,
        error: 'Text is too long. Maximum 5000 characters allowed.'
      }, { status: 400 });
    }
    
    if (!['term', 'text'].includes(mode)) {
      return NextResponse.json({
        success: false,
        error: 'Mode must be either "term" or "text"'
      }, { status: 400 });
    }
    
    console.log(`🔍 Analyzing ${mode} mode: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
    
    // Get translation
    const result = await getGeminiTranslation(text, mode);
    
    // Add metadata
    const response = {
      ...result,
      metadata: {
        mode,
        textLength: text.length,
        timestamp: new Date().toISOString(),
        apiCallsUsed: dailyApiCalls,
        apiCallsRemaining: MAX_DAILY_CALLS - dailyApiCalls,
        version: '2.0'
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Smart Translator error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process translation request'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  
  if (!term) {
    // Return available terms
    const availableTerms = Object.keys(cryptoDictionary).slice(0, 50); // First 50 terms
    return NextResponse.json({
      success: true,
      availableTerms,
      totalTerms: Object.keys(cryptoDictionary).length,
      message: 'Use POST method with text parameter for translation'
    });
  }
  
  // Quick term lookup
  const definition = cryptoDictionary[term.toLowerCase()];
  if (definition) {
    return NextResponse.json({
      success: true,
      term,
      definition,
      aiUsed: false
    });
  } else {
    return NextResponse.json({
      success: false,
      error: 'Term not found',
      suggestion: 'Use POST method for full text analysis'
    }, { status: 404 });
  }
}
