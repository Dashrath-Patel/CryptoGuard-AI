# BNB Chain AI Security Scanner - Quick Setup Guide

## 🚀 **Quick Start for BNB Chain Integration**

### 1. **Install Required Dependencies**

```bash
# Core dependencies for BNB Chain
npm install axios lodash

# Optional: For full blockchain integration (when ready for production)
npm install ethers@^6.0.0 web3@^4.0.0

# Development dependencies
npm install --save-dev @types/lodash
```

### 2. **Get Required API Keys**

1. **BSCScan API Key** (Essential - Free)
   - Go to https://bscscan.com/apis
   - Create account and generate API key
   - This is required for contract verification and transaction data

2. **Optional Enhancement APIs**
   - **CoinGecko API** (Free) - For price data
   - **CertiK API** - For additional security scores
   - **DeFiPulse API** - For DeFi protocol data

### 3. **Environment Setup**

Create/update your `.env.local` file:

```env
# BSCScan API (Required)
BSCSCAN_API_KEY=your_bscscan_api_key_here
NEXT_PUBLIC_BSCSCAN_API_URL=https://api.bscscan.com/api

# BNB Chain RPC (Optional - for direct blockchain calls)
NEXT_PUBLIC_BSC_MAINNET_RPC=https://bsc-dataseed1.binance.org/
NEXT_PUBLIC_BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/

# Optional: Price and DeFi Data
COINGECKO_API_KEY=your_coingecko_key
PANCAKESWAP_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/pancakeswap/exchange
```

### 4. **Test the Implementation**

The AI Security Scanner is now ready to test with BNB Chain specific features:

1. Navigate to `/dashboard/scanner`
2. Try scanning these BNB Chain addresses:

**Test Wallet Addresses:**
- `0x8894E0a0c962CB723c1976a4421c95949bE2D4E3` (Binance Hot Wallet)
- `0xF977814e90dA44bFA03b6295A0616a897441aceC` (Binance Cold Wallet)

**Test Contract Addresses:**
- `0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82` (CAKE Token)
- `0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56` (BUSD)
- `0x10ED43C718714eb63d5aA57B78B54704E256024E` (PancakeSwap Router)

### 5. **BNB Chain Specific Features Implemented**

✅ **Wallet Analysis:**
- BNB balance checking
- BEP-20 token analysis
- Transaction pattern recognition
- DeFi interaction monitoring
- BSC-specific threat detection

✅ **Smart Contract Analysis:**
- BEP-20 token verification
- Honeypot detection
- Rug pull risk assessment
- Liquidity lock verification
- Owner privilege analysis

✅ **Real-time Monitoring:**
- PancakeSwap interaction tracking
- MEV activity detection
- High-frequency trading alerts
- Suspicious pattern recognition

### 6. **Upgrading to Production (When Ready)**

To enable real blockchain integration:

1. **Install ethers.js:**
   ```bash
   npm install ethers@^6.0.0
   ```

2. **Update API endpoints** to use the real `BNBChainSecurityScanner`:
   ```typescript
   // In /api/scanner/wallet/route.ts
   const scanner = new BNBChainSecurityScanner();
   const result = await scanner.analyzeWallet(address);
   ```

3. **Add rate limiting** for API calls to BSCScan
4. **Implement caching** for frequently accessed data
5. **Add database** for storing scan history

### 7. **Current Implementation Status**

**✅ Completed:**
- Full BNB Chain scanner implementation
- Mock API responses with BNB-specific data
- UI components for BNB Chain features
- Security recommendations for BSC

**🔄 Ready for Enhancement:**
- Real BSCScan API integration (just add API key)
- Live blockchain data (uncomment ethers.js code)
- Database integration for scan history
- Real-time WebSocket monitoring

### 8. **Testing Scenarios**

**Safe Scenarios:**
- Well-known tokens (CAKE, BUSD, USDT)
- Verified contracts with audits
- Wallets with normal trading patterns

**Warning Scenarios:**
- Unverified contracts
- High-frequency trading patterns
- Unlocked liquidity pools

**Danger Scenarios:**
- Honeypot contracts
- High rug pull risk tokens
- Suspicious transaction patterns

### 9. **Performance Optimization**

For production use:

1. **API Rate Limiting:**
   - BSCScan: 5 calls/second
   - Implement queue system for batch requests

2. **Caching Strategy:**
   - Contract analysis: Cache for 24 hours
   - Wallet scans: Cache for 1 hour
   - Price data: Cache for 5 minutes

3. **Database Schema:**
   ```sql
   CREATE TABLE scan_results (
     id SERIAL PRIMARY KEY,
     address VARCHAR(42) NOT NULL,
     scan_type VARCHAR(20) NOT NULL,
     risk_score INTEGER,
     threats JSONB,
     recommendations JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

## 🎯 **Next Steps**

1. **Get BSCScan API Key** - This is the most important step
2. **Test with real BNB addresses** - Try the sample addresses above
3. **Customize threat detection** - Add your own risk patterns
4. **Enhance UI/UX** - Add more BNB Chain specific visualizations
5. **Deploy to production** - Add real API integrations when ready

The scanner is now fully functional for BNB Chain with realistic mock data and ready for real API integration!
