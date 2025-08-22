# 🛡️ CryptoGuard-AI

**Making cryptocurrency as safe and easy as online banking through intelligent automation.**

## 🎯 Vision

Transform crypto from "scary and complex" to "safe and simple" - enabling the next 100 million people to safely use DeFi.

## 🚨 The Problem

- **$3.8B+** lost annually to crypto hacks and scams
- **99%** of people find crypto too complex to use safely  
- **No protection** from market manipulation

## ✨ Our Solution

AI-powered platform that makes crypto safe and simple through four core features:

### 🔍 AI Security Scanner
Real-time scam detection & risk scoring for wallets, transactions, and smart contracts

### 📖 Smart Translator  
Converts complex DeFi terms to plain English that anyone can understand

### 📊 Market Guardian
Detects manipulation & whale movements to protect retail investors

### 🔐 Contract Auditor
AI grades smart contracts A-F for safety with comprehensive vulnerability analysis

## 🎯 Impact Goals

- **Prevent 80%+** of crypto losses
- **Enable mainstream** crypto adoption
- **Protect retail investors** from scams

## 🏗️ Tech Stack

- **Frontend**: Next.js 15.5.0, React 19, TypeScript, Tailwind CSS
- **Blockchain**: BNB Chain (BSC) integration with real-time data
- **APIs**: BSCScan, Binance, Custom AI endpoints
- **UI/UX**: Framer Motion, Aceternity UI components

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/kanishkmandrelia/CryptoGuard-AI.git
cd CryptoGuard-AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env.local file with:
BSCSCAN_API_KEY=your_bscscan_api_key
NEXT_PUBLIC_BINANCE_API_URL=https://api.binance.com

# For Smart Translator AI features (optional):
GEMINI_API_KEY=your_gemini_api_key_here
```

> 💡 **Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) for free access to the Gemini 1.5 Flash model.

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Core Features Status

| Feature | Status | Description |
|---------|--------|-------------|
| ✅ AI Security Scanner | **Live** | Real-time BNB Chain analysis with BSCScan integration |
| ✅ Smart Translator | **Live** | AI-powered DeFi terminology translation with Gemini AI |
| 🔄 Contract Auditor | **In Progress** | Smart contract grading system |
| 🔄 Market Guardian | **In Progress** | Whale movement & manipulation detection |

## 📊 Market Opportunity

- **$2T+** crypto market needs better security
- **100M+** potential users blocked by complexity
- **Clear revenue**: Freemium + B2B partnerships

## 🎯 Why It Wins

- Solves **#1 barrier** to crypto adoption (safety + complexity)
- **First AI-powered** crypto protection platform
- **Network effects** make it stronger over time

## 🏆 Track: AI + DeFi + Analytics

**Bottom Line**: Makes cryptocurrency as safe and easy as online banking through intelligent automation.

## 📱 Current Features

### 🔴 Live Dashboard
- Real-time BNB price monitoring
- Live gas price tracking  
- Current block number updates
- Network health status

### 🔍 Security Scanner
- Wallet risk analysis
- Transaction threat detection
- Smart contract vulnerability assessment
- Real-time scam database integration

### 📖 Smart Translator  
- **AI-Powered**: Uses Google Gemini API for intelligent translations
- **Dual Modes**: Text analysis and single term lookup
- **BSC-Focused**: Specialized examples from BNB Chain ecosystem
- **Risk Assessment**: Categorizes terms by risk level and category
- **Fallback System**: Works offline with comprehensive crypto dictionary
- **Real-time**: Instant translations of complex DeFi terminology

> **Test the Translator**: Visit `/test-translator` to try different scenarios

## 🛣️ Roadmap

### Phase 1: Core Security (Current)
- [x] AI Security Scanner with real-time data
- [x] BNB Chain integration
- [x] Live network monitoring
- [x] Smart Translator with Gemini AI integration
- [ ] Complete contract auditor implementation

### Phase 2: User Experience
- [x] Smart Translator for DeFi terms
- [ ] Mobile-responsive optimization
- [ ] User onboarding flow

### Phase 3: Advanced Protection  
- [ ] Market Guardian with whale tracking
- [ ] Predictive threat analysis
- [ ] Multi-chain expansion

### Phase 4: Monetization
- [ ] Freemium tier implementation
- [ ] B2B partnership integrations
- [ ] Premium analytics dashboard

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [Smart Translator Backend Guide](SMART_TRANSLATOR_BACKEND.md)
- **API Reference**: [Coming Soon]

## 📚 API Endpoints

### Smart Translator API
**Endpoint**: `POST /api/translator/analyze`

**Request**:
```json
{
  "text": "I want to provide liquidity but worried about impermanent loss",
  "mode": "text" // or "term"
}
```

**Response**:
```json
{
  "translations": [
    {
      "term": "Impermanent Loss",
      "simpleDef": "Easy explanation...",
      "technicalDef": "Technical definition...",
      "example": "Real BSC example...",
      "category": "DeFi",
      "riskLevel": "Medium",
      "relatedTerms": ["yield farming", "liquidity provider"]
    }
  ],
  "source": "AI-powered"
}
```

---

**🚀 Join us in making crypto safe for everyone!**
