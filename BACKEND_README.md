# CryptoGuard AI Backend System

A comprehensive backend application built with Next.js API routes and Google Gemini AI for answering crypto queries and translating complex DeFi terminology into plain English.

## 🚀 Features

### 1. Smart Crypto Translator (`/api/smart-translator`)
- **Purpose**: Translates blockchain and DeFi terminology into understandable English
- **AI Integration**: Google Gemini AI with intelligent fallback to comprehensive dictionary
- **Modes**: 
  - `text`: Analyze full text for crypto terms
  - `term`: Look up specific terms
- **Dictionary**: 200+ crypto/DeFi terms with detailed explanations

### 2. Crypto Query System (`/api/crypto-query`)
- **Purpose**: Answer user questions about cryptocurrency and DeFi
- **Categories**: DeFi, Trading, Security, Technical, Investment, Beginner
- **AI Features**: Intelligent query categorization and contextual responses
- **Fallback**: Predefined responses for common questions

### 3. DeFi Analysis Engine (`/api/defi-analysis`)
- **Purpose**: Deep analysis of DeFi protocols, strategies, and risks
- **Analysis Types**: Protocol, Strategy, Transaction, Risk, Yield
- **Protocol Database**: Built-in information for major DeFi protocols
- **Risk Assessment**: Comprehensive risk evaluation framework

### 4. Transaction Analysis (`/api/transaction-analysis`)
- **Purpose**: Decode and explain complex DeFi transactions
- **Features**: Method signature detection, gas analysis, contract identification
- **Pattern Recognition**: Identify common DeFi transaction patterns
- **Contract Database**: Known contract addresses with descriptions

## 🔧 API Endpoints

### Smart Translator

#### POST `/api/smart-translator`
```json
{
  "text": "DeFi yield farming with liquidity pools",
  "mode": "text" // or "term"
}
```

**Response:**
```json
{
  "success": true,
  "translations": [
    {
      "original": "defi",
      "simplified": "Decentralized Finance - Financial services built on blockchain",
      "explanation": "DeFi is a key concept in Decentralized Finance",
      "context": "DeFi yield farming with liquidity pools",
      "riskLevel": "medium"
    }
  ],
  "summary": "Found 3 crypto/DeFi terms",
  "aiUsed": false,
  "metadata": {
    "mode": "text",
    "apiCallsRemaining": 45,
    "version": "2.0"
  }
}
```

#### GET `/api/smart-translator?term=defi`
Quick term lookup without AI analysis.

### Crypto Query System

#### POST `/api/crypto-query`
```json
{
  "query": "What is yield farming and how does it work?",
  "context": "beginner" // optional
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Yield farming is the practice of lending or staking...",
  "explanation": "Detailed explanation...",
  "risks": ["Impermanent loss", "Smart contract risks"],
  "benefits": ["High returns", "Token rewards"],
  "gettingStarted": ["Research protocols", "Start small"],
  "riskLevel": "medium-high",
  "complexity": "intermediate",
  "metadata": {
    "category": "DeFi",
    "confidence": 0.9,
    "keywords": ["yield farming", "defi"]
  }
}
```

#### GET `/api/crypto-query?action=status`
Check API usage and quota status.

#### GET `/api/crypto-query?action=categories`
Get available query categories and sample questions.

### DeFi Analysis Engine

#### POST `/api/defi-analysis`
```json
{
  "input": "Uniswap V3 liquidity provision",
  "analysisType": "protocol", // protocol|strategy|transaction|risk|yield
  "userLevel": "intermediate", // beginner|intermediate|advanced
  "amount": "1000" // optional, for risk assessment
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "summary": "High-level overview",
    "detailed_explanation": "In-depth analysis",
    "mechanism": "How it works technically",
    "tokenomics": "Token economics"
  },
  "risks": {
    "high": ["Critical risks"],
    "medium": ["Moderate risks"],
    "low": ["Minor considerations"]
  },
  "opportunities": {
    "yield_potential": "Expected returns",
    "growth_prospects": "Long-term potential"
  },
  "recommendations": {
    "beginner": ["Advice for new users"],
    "intermediate": ["Advice for experienced users"]
  }
}
```

#### GET `/api/defi-analysis?action=protocols`
Get list of supported DeFi protocols.

### Transaction Analysis

#### POST `/api/transaction-analysis`
```json
{
  "transactionHash": "0x123...",
  "transactionData": {
    "from": "0xabc...",
    "to": "0xdef...",
    "value": "1000000000000000000",
    "input": "0x7ff36ab5...",
    "gasUsed": "150000",
    "gasPrice": "20000000000"
  },
  "analysisType": "full" // full|quick|security
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "type": "Uniswap Token Swap",
    "protocol": "Uniswap V2",
    "description": "Exchange ETH for tokens",
    "explanation": "This transaction swaps ETH for tokens using Uniswap",
    "mechanism": "Uses automated market maker algorithm"
  },
  "breakdown": {
    "from": "User wallet",
    "to": "Uniswap Router Contract",
    "tokens_involved": ["ETH", "USDC"],
    "fees": "Gas fee analysis"
  },
  "decodedInput": {
    "methodName": "swapExactETHForTokens",
    "methodId": "0x7ff36ab5"
  },
  "gasAnalysis": {
    "gasCostEth": 0.003,
    "efficiency": "Efficient"
  }
}
```

## 🛡️ Quota Management

The system implements intelligent quota management for the Gemini AI API:

- **Daily Limits**: Conservative limits to prevent quota exhaustion
- **Rate Limiting**: Built-in delays between API calls
- **Fallback Systems**: Comprehensive fallback responses when quota is reached
- **Usage Tracking**: Real-time tracking of API usage

### Current Limits:
- Smart Translator: 45 calls/day
- Crypto Query: 40 calls/day  
- DeFi Analysis: 30 calls/day
- Transaction Analysis: 25 calls/day

## 📚 Built-in Knowledge Base

### Crypto Dictionary
200+ terms including:
- **Basic Crypto**: Bitcoin, Ethereum, Wallet, Private Key
- **DeFi Terms**: Yield Farming, Liquidity Pool, AMM, Flash Loan
- **Trading**: DEX, CEX, Slippage, Arbitrage
- **Security**: Multi-sig, Cold Storage, Audit
- **Technical**: Smart Contract, Gas, Consensus, Layer 2

### DeFi Protocols Database
- **Uniswap**: DEX with AMM mechanism
- **Aave**: Lending and borrowing protocol
- **Compound**: Algorithmic money market
- **MakerDAO**: CDP platform for DAI stablecoin
- **Curve**: Stableswap DEX

### Transaction Patterns
- Token swaps (Uniswap, SushiSwap)
- Lending operations (Aave, Compound)
- Yield farming activities
- NFT transactions
- Flash loans

## 🔄 Error Handling

The system provides comprehensive error handling:

1. **API Quota Exhausted**: Automatic fallback to dictionary/knowledge base
2. **Invalid Requests**: Clear error messages with suggestions
3. **Network Issues**: Graceful degradation with helpful responses
4. **Parse Errors**: Fallback to text-based responses

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini AI API key
- Environment variables configured

### Environment Setup
```bash
# .env.local
GOOGLE_AI_API_KEY=your_gemini_api_key_here
```

### Installation
```bash
npm install
npm run dev
```

### Testing the APIs
```bash
# Test Smart Translator
curl -X POST http://localhost:3000/api/smart-translator \
  -H "Content-Type: application/json" \
  -d '{"text":"DeFi yield farming","mode":"text"}'

# Test Crypto Query
curl -X POST http://localhost:3000/api/crypto-query \
  -H "Content-Type: application/json" \
  -d '{"query":"What is yield farming?"}'

# Test DeFi Analysis
curl -X POST http://localhost:3000/api/defi-analysis \
  -H "Content-Type: application/json" \
  -d '{"input":"Uniswap","analysisType":"protocol"}'
```

## 📈 Performance Optimization

- **Caching**: Responses cached for common queries
- **Rate Limiting**: Prevents API quota exhaustion
- **Efficient Fallbacks**: Fast dictionary lookups when AI unavailable
- **Streaming**: Large responses streamed when possible

## 🔐 Security Features

- **Input Validation**: All inputs validated and sanitized
- **Rate Limiting**: Prevents abuse and quota exhaustion
- **Error Sanitization**: No sensitive information in error responses
- **Type Safety**: Full TypeScript implementation

## 🎯 Use Cases

1. **Beginners**: Learning crypto and DeFi terminology
2. **Traders**: Understanding complex DeFi strategies
3. **Developers**: Analyzing transaction patterns
4. **Researchers**: Deep-diving into protocol mechanics
5. **Security Analysts**: Assessing DeFi risks

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Real-time protocol data integration
- [ ] Advanced risk scoring algorithms
- [ ] Custom protocol analysis
- [ ] Historical trend analysis
- [ ] Integration with major blockchain explorers

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests for any improvements.

---

**Built with ❤️ for the crypto community**
