import { NextRequest, NextResponse } from 'next/server';

interface Translation {
  term: string;
  simpleDef: string;
  technicalDef: string;
  example: string;
  category: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  relatedTerms: string[];
}

// Crypto dictionary with simple explanations
const cryptoDictionary: { [key: string]: Translation } = {
  'impermanent loss': {
    term: 'Impermanent Loss',
    simpleDef: 'When you provide liquidity to a trading pool, you might end up with less money than if you just held your tokens. It\'s called "impermanent" because it only becomes real when you withdraw.',
    technicalDef: 'The difference between holding tokens versus providing them as liquidity in an AMM pool, caused by price divergence between the paired assets.',
    example: 'You put $1000 of BNB and USDT into PancakeSwap. If BNB\'s price doubles, you\'ll have less total value than if you just kept the original BNB and USDT separately.',
    category: 'DeFi',
    riskLevel: 'Medium',
    relatedTerms: ['liquidity provider', 'AMM', 'yield farming', 'slippage']
  },
  'yield farming': {
    term: 'Yield Farming',
    simpleDef: 'Lending your crypto to earn interest, like putting money in a high-interest savings account. But with higher rewards comes higher risk.',
    technicalDef: 'The practice of staking or lending crypto assets to generate high returns or rewards in the form of additional cryptocurrency.',
    example: 'You lend your USDT to Venus Protocol and earn 8% APY, plus some additional Venus tokens as rewards.',
    category: 'DeFi',
    riskLevel: 'High',
    relatedTerms: ['liquidity mining', 'staking', 'APY', 'smart contract risk']
  },
  'rug pull': {
    term: 'Rug Pull',
    simpleDef: 'When project creators suddenly disappear with investors\' money, like pulling a rug out from under someone.',
    technicalDef: 'A malicious maneuver where cryptocurrency developers abandon a project and run away with investors\' funds.',
    example: 'A new BSC token promises huge returns, gets $1M in investments, then the team drains all the money and disappears.',
    category: 'Security',
    riskLevel: 'High',
    relatedTerms: ['exit scam', 'smart contract', 'liquidity lock', 'audit']
  },
  'slippage': {
    term: 'Slippage',
    simpleDef: 'The difference between the price you expect to pay and what you actually pay when trading. Like getting a different price at checkout than what was listed.',
    technicalDef: 'The difference between the expected price of a trade and the executed price, usually due to market volatility or low liquidity.',
    example: 'You try to buy BNB at $300, but by the time your transaction processes, you pay $302 due to slippage.',
    category: 'Trading',
    riskLevel: 'Low',
    relatedTerms: ['liquidity', 'market order', 'MEV', 'frontrunning']
  },
  'smart contract': {
    term: 'Smart Contract',
    simpleDef: 'A computer program that automatically executes when certain conditions are met, like a digital vending machine.',
    technicalDef: 'Self-executing contracts with the terms directly written into code, running on blockchain networks.',
    example: 'A PancakeSwap smart contract automatically swaps your BNB for CAKE when you click trade, no human needed.',
    category: 'Technical',
    riskLevel: 'Medium',
    relatedTerms: ['DeFi', 'audit', 'vulnerability', 'gas fee']
  },
  'liquidity mining': {
    term: 'Liquidity Mining',
    simpleDef: 'Getting rewarded with tokens for providing your crypto to trading pools, like earning points for helping a store stay stocked.',
    technicalDef: 'A DeFi mechanism where users provide liquidity to protocols in exchange for token rewards.',
    example: 'You provide BNB-USDT to PancakeSwap\'s pool and earn CAKE tokens as rewards for helping facilitate trades.',
    category: 'DeFi',
    riskLevel: 'Medium',
    relatedTerms: ['yield farming', 'liquidity provider', 'AMM', 'impermanent loss']
  },
  'flash loan': {
    term: 'Flash Loan',
    simpleDef: 'Borrowing a huge amount of money for a few seconds to make instant profits, all within one transaction.',
    technicalDef: 'Uncollateralized loans that must be borrowed and repaid within the same blockchain transaction.',
    example: 'Borrow $1M, use it to exploit a price difference between exchanges, repay the loan, and keep the profit - all in one transaction.',
    category: 'DeFi',
    riskLevel: 'High',
    relatedTerms: ['arbitrage', 'MEV', 'exploit', 'liquidation']
  },
  'arbitrage': {
    term: 'Arbitrage',
    simpleDef: 'Buying something cheap on one exchange and selling it for more on another exchange to make instant profit.',
    technicalDef: 'The practice of taking advantage of price differences between different markets or exchanges.',
    example: 'BNB costs $300 on PancakeSwap but $305 on Binance, so you buy on PancakeSwap and sell on Binance for $5 profit.',
    category: 'Trading',
    riskLevel: 'Low',
    relatedTerms: ['flash loan', 'MEV', 'slippage', 'bridge']
  },
  'apy': {
    term: 'APY (Annual Percentage Yield)',
    simpleDef: 'How much money you\'ll earn in a year, shown as a percentage. Like interest on a savings account but usually much higher (and riskier).',
    technicalDef: 'The real rate of return earned on an investment, taking into account the effect of compounding interest.',
    example: 'A 100% APY means if you invest $1000, you\'ll have $2000 after one year (if the rate stays the same).',
    category: 'DeFi',
    riskLevel: 'Medium',
    relatedTerms: ['yield farming', 'staking', 'compound interest', 'rewards']
  },
  'tokenomics': {
    term: 'Tokenomics',
    simpleDef: 'The economics of a cryptocurrency - how many tokens exist, how they\'re distributed, and what drives their value.',
    technicalDef: 'The study of the economic model behind a cryptocurrency, including supply, distribution, and utility.',
    example: 'Bitcoin has 21 million max tokens and is deflationary, while some DeFi tokens have unlimited supply and high inflation.',
    category: 'Technical',
    riskLevel: 'Medium',
    relatedTerms: ['supply cap', 'inflation', 'burning', 'vesting']
  }
};

export async function POST(request: NextRequest) {
  try {
    const { text, mode } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Text input required' },
        { status: 400 }
      );
    }

    let translations: Translation[] = [];

    if (mode === 'term') {
      // Single term lookup
      const term = text.toLowerCase().trim();
      const translation = cryptoDictionary[term];
      
      if (translation) {
        translations = [translation];
      } else {
        // Fuzzy search for similar terms
        const similarTerms = findSimilarTerms(term);
        translations = similarTerms.map(t => cryptoDictionary[t]);
      }
    } else {
      // Text analysis mode
      translations = analyzeText(text);
    }

    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate' },
      { status: 500 }
    );
  }
}

function findSimilarTerms(searchTerm: string): string[] {
  const terms = Object.keys(cryptoDictionary);
  const matches: { term: string; score: number }[] = [];

  for (const term of terms) {
    // Simple similarity scoring
    if (term.includes(searchTerm) || searchTerm.includes(term)) {
      matches.push({ term, score: 2 });
    } else if (term.split(' ').some(word => searchTerm.includes(word))) {
      matches.push({ term, score: 1 });
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(m => m.term);
}

function analyzeText(text: string): Translation[] {
  const foundTerms: Translation[] = [];
  const textLower = text.toLowerCase();

  // Look for known terms in the text
  for (const [term, translation] of Object.entries(cryptoDictionary)) {
    if (textLower.includes(term.toLowerCase())) {
      foundTerms.push(translation);
    }
  }

  // If no exact matches, try to identify potential crypto terms
  if (foundTerms.length === 0) {
    const cryptoPatterns = [
      /\b(defi|yield|farming|staking|liquidity|pool|swap|bridge|dex|cex)\b/gi,
      /\b(token|coin|nft|dao|governance|voting|proposal)\b/gi,
      /\b(wallet|metamask|trustwallet|seed|phrase|private|key)\b/gi,
      /\b(bull|bear|market|pump|dump|moon|whale|hodl)\b/gi,
      /\b(gas|fee|transaction|block|confirmation|miner)\b/gi
    ];

    const matches = new Set<string>();
    for (const pattern of cryptoPatterns) {
      const found = text.match(pattern);
      if (found) {
        found.forEach(match => matches.add(match.toLowerCase()));
      }
    }

    // Generate explanations for common patterns
    if (matches.size > 0) {
      foundTerms.push(generateGenericExplanation(Array.from(matches), text));
    }
  }

  return foundTerms.slice(0, 5); // Limit results
}

function generateGenericExplanation(terms: string[], originalText: string): Translation {
  const category = determineCategory(terms);
  const riskLevel = determineRiskLevel(terms);

  return {
    term: 'Crypto Terms Detected',
    simpleDef: `Your text contains crypto terminology. The main concepts involve ${terms.slice(0, 3).join(', ')}. These terms are related to ${category.toLowerCase()} in the cryptocurrency space.`,
    technicalDef: `Analysis of the provided text reveals multiple cryptocurrency and blockchain-related terms indicating discussion of ${category.toLowerCase()} concepts.`,
    example: `Example context: "${originalText.slice(0, 100)}${originalText.length > 100 ? '...' : ''}"`,
    category,
    riskLevel,
    relatedTerms: terms.slice(0, 5)
  };
}

function determineCategory(terms: string[]): string {
  const categoryKeywords = {
    'DeFi': ['defi', 'yield', 'farming', 'liquidity', 'pool', 'swap', 'staking'],
    'Trading': ['bull', 'bear', 'pump', 'dump', 'market', 'whale'],
    'Technical': ['gas', 'fee', 'block', 'transaction', 'wallet', 'key'],
    'Governance': ['dao', 'governance', 'voting', 'proposal'],
    'Security': ['private', 'seed', 'phrase', 'scam', 'hack']
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (terms.some(term => keywords.includes(term))) {
      return category;
    }
  }

  return 'Technical';
}

function determineRiskLevel(terms: string[]): 'Low' | 'Medium' | 'High' {
  const highRiskTerms = ['yield', 'farming', 'pump', 'dump', 'private', 'seed'];
  const mediumRiskTerms = ['defi', 'staking', 'swap', 'liquidity'];

  if (terms.some(term => highRiskTerms.includes(term))) {
    return 'High';
  } else if (terms.some(term => mediumRiskTerms.includes(term))) {
    return 'Medium';
  }

  return 'Low';
}
