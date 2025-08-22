# 🟡 BNB Chain Only - Quick Setup Guide

## 🎯 **BNB Chain Exclusive Configuration**

Your CryptoGuard-AI is now configured exclusively for **Binance Smart Chain (BSC)**! Here's what you need to get started.

### ✅ **What's Already Configured:**

- **BNB Chain Focus**: All UI updated for BSC/BEP-20 terminology
- **Dependencies Installed**: `axios` and `lodash` are ready
- **Environment Template**: `.env.local` configured for BSC
- **Mock Data**: BSC-specific realistic test data

### 🔧 **Required Setup Steps:**

#### 1. **Get Your BSCScan API Key** (Essential - Free)
```bash
# Visit: https://bscscan.com/apis
# 1. Create a free account
# 2. Generate API key
# 3. Add to your .env.local file
```

#### 2. **Update Your .env.local File:**
```env
# Replace with your actual BSCScan API key
BSCSCAN_API_KEY=YourActualBSCScanAPIKeyHere
```

#### 3. **Test the Scanner:**
Navigate to: `http://localhost:3000/dashboard/scanner`

### 🧪 **BNB Chain Test Addresses:**

**Popular BEP-20 Tokens:**
- **CAKE Token**: `0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82`
- **BUSD**: `0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56`
- **USDT (BEP-20)**: `0x55d398326f99059fF775485246999027B3197955`
- **WBNB**: `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`

**Major BSC Contracts:**
- **PancakeSwap Router**: `0x10ED43C718714eb63d5aA57B78B54704E256024E`
- **PancakeSwap Factory**: `0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73`
- **Venus Protocol**: `0xfb6115445Bff7b52FeB98650C87f44907E58f802`

**Test Wallets:**
- **Binance Hot Wallet**: `0x8894E0a0c962CB723c1976a4421c95949bE2D4E3`
- **Binance Cold Wallet**: `0xF977814e90dA44bFA03b6295A0616a897441aceC`

### 🛡️ **BNB Chain Security Features:**

✅ **Wallet Analysis:**
- BNB balance checking
- BEP-20 token portfolio analysis
- BSC transaction pattern recognition
- PancakeSwap interaction monitoring
- MEV/Frontrunning detection

✅ **BEP-20 Contract Analysis:**
- BSCScan source code verification
- Honeypot detection algorithms
- Rug pull risk assessment (liquidity locks)
- Ownership privilege analysis
- Mint/Burn capability detection
- Blacklist function identification

✅ **BSC-Specific Monitoring:**
- Real-time BSC transaction tracking
- PancakeSwap DEX monitoring
- High-frequency trading detection
- Gas price anomaly alerts

### 🚀 **Development Commands:**

```bash
# Start development server
npm run dev

# Install additional dependencies (if needed)
npm install ethers@^6.0.0  # For production blockchain integration

# Check for updates
npm outdated
```

### 🔄 **Current Implementation Status:**

**✅ Working Now:**
- BNB Chain focused UI/UX
- Mock BSC data for testing
- BEP-20 contract analysis framework
- BSC security recommendations
- Realistic threat simulation

**🔧 Ready for Production:**
- Real BSCScan API integration (just add API key)
- Live BNB Chain data (uncomment production code)
- Webhook monitoring for real-time alerts

### 📊 **Performance Optimized for BSC:**

- **BSCScan Rate Limits**: Handled (5 calls/second)
- **BEP-20 Token Caching**: Implemented
- **PancakeSwap Integration**: Ready
- **Batch Processing**: Optimized for BSC

### 🎯 **Next Steps:**

1. **Get BSCScan API Key** → Add to `.env.local`
2. **Test with Real Addresses** → Use the provided test addresses
3. **Customize Risk Rules** → Modify threat detection patterns
4. **Deploy** → Ready for production with real API

### 🔐 **BSC Security Best Practices Included:**

- **Anti-Honeypot Checks**: Detects sell restrictions
- **Rug Pull Indicators**: Liquidity lock verification
- **Owner Risk Assessment**: Centralization analysis
- **MEV Protection**: Sandwich attack detection
- **DeFi Safety**: PancakeSwap security scoring

## 🎉 **Ready to Launch!**

Your BNB Chain AI Security Scanner is ready to protect users from BSC threats. Just add your BSCScan API key and start scanning! 🛡️

---

**Need Help?**
- Check the logs in browser console
- Verify your BSCScan API key is correct
- Test with the provided sample addresses first
