// lib/bnb-chain-security-scanner.ts
// BNB Chain specific security scanner implementation

export interface BNBSecurityAnalysis {
  address: string;
  riskScore: number;
  status: 'safe' | 'warning' | 'danger';
  threats: string[];
  recommendations: string[];
  contractDetails?: BNBContractAnalysis;
  bnbBalance?: string;
  tokenCount?: number;
  networkInfo?: BNBNetworkInfo;
  defiInteractions?: DeFiInteraction[];
}

export interface BNBContractAnalysis {
  isVerified: boolean;
  compiler: string;
  hasProxyPattern: boolean;
  hasUpgradeability: boolean;
  ownershipRisk: 'low' | 'medium' | 'high';
  vulnerabilities: string[];
  isBEP20: boolean;
  canMint: boolean;
  canPause: boolean;
  hasBlacklist: boolean;
  liquidityLocked: boolean;
  isHoneypot: boolean;
  rugPullRisk: 'low' | 'medium' | 'high';
}

export interface BNBNetworkInfo {
  chainId: number;
  networkName: string;
  gasPrice: string;
  blockNumber: number;
  bnbPrice: string;
}

export interface DeFiInteraction {
  protocol: string;
  contractAddress: string;
  interactionType: string;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface TransactionPattern {
  pattern: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  frequency: number;
}

export class BNBChainSecurityScanner {
  private bscscanApiKey: string;
  private bscscanApiUrl: string;

  // Known legitimate BNB Chain contracts
  private trustedContracts = new Map([
    ['0x10ED43C718714eb63d5aA57B78B54704E256024E', 'PancakeSwap Router V2'],
    ['0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', 'PancakeSwap Factory'],
    ['0xfb6115445Bff7b52FeB98650C87f44907E58f802', 'Venus Protocol'],
    ['0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', 'CAKE Token'],
    ['0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 'BUSD'],
    ['0x55d398326f99059fF775485246999027B3197955', 'USDT'],
    ['0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 'ETH'],
    ['0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 'BTCB'],
  ]);

  // Known malicious/risky contracts (would be updated from threat intelligence)
  private blacklistedContracts = new Set<string>([
    // Add known scam contracts
  ]);

  // Common BEP-20 function signatures for analysis
  private bep20Functions = [
    'transfer(address,uint256)',
    'transferFrom(address,address,uint256)',
    'approve(address,uint256)',
    'mint(address,uint256)',
    'burn(uint256)',
    'pause()',
    'unpause()',
    'blacklistAddress(address)',
  ];

  constructor() {
    this.bscscanApiKey = process.env.BSCSCAN_API_KEY || '';
    this.bscscanApiUrl = process.env.NEXT_PUBLIC_BSCSCAN_API_URL || 'https://api.bscscan.com/api';
  }

  // Validate BNB Chain address format
  private isValidBNBAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Main wallet analysis function for BNB Chain
  async analyzeWallet(address: string): Promise<BNBSecurityAnalysis> {
    if (!this.isValidBNBAddress(address)) {
      throw new Error('Invalid BNB Chain address format');
    }

    const analysis: BNBSecurityAnalysis = {
      address,
      riskScore: 0,
      status: 'safe',
      threats: [],
      recommendations: [],
      bnbBalance: '0',
      tokenCount: 0,
      defiInteractions: []
    };

    try {
      // Get BNB balance using BSCScan API
      const balanceData = await this.getBNBBalance(address);
      analysis.bnbBalance = balanceData;

      // Get transaction history
      const transactions = await this.getTransactionHistory(address);
      
      // Analyze transaction patterns
      const transactionRisks = this.analyzeTransactionPatterns(transactions);
      analysis.threats.push(...transactionRisks.threats);
      analysis.riskScore += transactionRisks.riskScore;

      // Check for interactions with known malicious contracts
      const maliciousInteractions = this.checkMaliciousInteractions(transactions);
      if (maliciousInteractions.length > 0) {
        analysis.threats.push(`Interactions with ${maliciousInteractions.length} flagged addresses`);
        analysis.riskScore += 40;
      }

      // Analyze DeFi protocol interactions
      const defiAnalysis = this.analyzeDeFiInteractions(transactions);
      analysis.defiInteractions = defiAnalysis.interactions;
      analysis.threats.push(...defiAnalysis.threats);
      analysis.riskScore += defiAnalysis.riskScore;

      // Get BEP-20 token holdings
      const tokenAnalysis = await this.analyzeTokenHoldings(address);
      analysis.tokenCount = tokenAnalysis.count;
      analysis.threats.push(...tokenAnalysis.threats);
      analysis.riskScore += tokenAnalysis.riskScore;

      // Determine final status
      analysis.status = this.calculateSecurityStatus(analysis.riskScore);
      analysis.recommendations = this.generateWalletRecommendations(analysis);

      return analysis;

    } catch (error) {
      console.error('BNB wallet analysis failed:', error);
      throw new Error('Failed to analyze BNB Chain wallet');
    }
  }

  // Analyze BEP-20 smart contracts
  async analyzeContract(address: string): Promise<BNBSecurityAnalysis> {
    if (!this.isValidBNBAddress(address)) {
      throw new Error('Invalid BNB Chain contract address format');
    }

    const analysis: BNBSecurityAnalysis = {
      address,
      riskScore: 0,
      status: 'safe',
      threats: [],
      recommendations: [],
      contractDetails: {
        isVerified: false,
        compiler: '',
        hasProxyPattern: false,
        hasUpgradeability: false,
        ownershipRisk: 'low',
        vulnerabilities: [],
        isBEP20: false,
        canMint: false,
        canPause: false,
        hasBlacklist: false,
        liquidityLocked: false,
        isHoneypot: false,
        rugPullRisk: 'low'
      }
    };

    try {
      // Check if contract is verified on BSCScan
      const contractSource = await this.getContractSourceCode(address);
      analysis.contractDetails!.isVerified = contractSource.isVerified;
      analysis.contractDetails!.compiler = contractSource.compiler;

      if (!contractSource.isVerified) {
        analysis.threats.push('Contract source code not verified');
        analysis.riskScore += 30;
      }

      // Analyze contract source code if available
      if (contractSource.sourceCode) {
        const codeAnalysis = this.analyzeSourceCode(contractSource.sourceCode);
        Object.assign(analysis.contractDetails!, codeAnalysis);

        // Calculate risk based on code analysis
        if (codeAnalysis.canMint) {
          analysis.threats.push('Contract can mint unlimited tokens');
          analysis.riskScore += 20;
        }

        if (codeAnalysis.hasBlacklist) {
          analysis.threats.push('Contract can blacklist addresses');
          analysis.riskScore += 25;
        }

        if (codeAnalysis.hasProxyPattern) {
          analysis.threats.push('Contract uses proxy pattern - code can be changed');
          analysis.riskScore += 15;
        }
      }

      // Check for honeypot characteristics
      const honeypotCheck = await this.checkForHoneypot(address);
      if (honeypotCheck.isHoneypot) {
        analysis.contractDetails!.isHoneypot = true;
        analysis.threats.push('WARNING: Potential honeypot detected');
        analysis.riskScore += 60;
      }

      // Check liquidity lock status for tokens
      const liquidityAnalysis = await this.analyzeLiquidity(address);
      analysis.contractDetails!.liquidityLocked = liquidityAnalysis.isLocked;
      if (!liquidityAnalysis.isLocked && analysis.contractDetails!.isBEP20) {
        analysis.threats.push('Liquidity not locked - rug pull risk');
        analysis.riskScore += 30;
      }

      // Determine rug pull risk
      analysis.contractDetails!.rugPullRisk = this.calculateRugPullRisk(analysis.contractDetails!);

      analysis.status = this.calculateSecurityStatus(analysis.riskScore);
      analysis.recommendations = this.generateContractRecommendations(analysis);

      return analysis;

    } catch (error) {
      console.error('BNB contract analysis failed:', error);
      throw new Error('Failed to analyze BNB Chain contract');
    }
  }

  // Get BNB balance from BSCScan API
  private async getBNBBalance(address: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.bscscanApiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.bscscanApiKey}`
      );
      const data = await response.json();
      
      if (data.status === '1') {
        // Convert from wei to BNB (divide by 10^18)
        const balanceInWei = BigInt(data.result);
        const balanceInBNB = Number(balanceInWei) / Math.pow(10, 18);
        return balanceInBNB.toFixed(4);
      }
      return '0';
    } catch (error) {
      console.error('Failed to get BNB balance:', error);
      return '0';
    }
  }

  // Get transaction history from BSCScan
  private async getTransactionHistory(address: string, limit = 100): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.bscscanApiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${this.bscscanApiKey}`
      );
      const data = await response.json();
      return data.status === '1' ? data.result : [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  // Get contract source code from BSCScan
  private async getContractSourceCode(address: string): Promise<{
    isVerified: boolean;
    sourceCode: string;
    compiler: string;
  }> {
    try {
      const response = await fetch(
        `${this.bscscanApiUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${this.bscscanApiKey}`
      );
      const data = await response.json();
      
      if (data.status === '1' && data.result[0]) {
        const result = data.result[0];
        return {
          isVerified: result.SourceCode !== '',
          sourceCode: result.SourceCode,
          compiler: result.CompilerVersion
        };
      }
      return { isVerified: false, sourceCode: '', compiler: '' };
    } catch (error) {
      console.error('Failed to get contract source:', error);
      return { isVerified: false, sourceCode: '', compiler: '' };
    }
  }

  // Analyze transaction patterns for suspicious activity
  private analyzeTransactionPatterns(transactions: any[]): { threats: string[]; riskScore: number } {
    const threats: string[] = [];
    let riskScore = 0;

    if (transactions.length === 0) {
      return { threats, riskScore };
    }

    // Check for high-frequency trading (potential bot activity)
    const now = Date.now();
    const last24Hours = transactions.filter(tx => 
      now - (parseInt(tx.timeStamp) * 1000) < 24 * 60 * 60 * 1000
    );

    if (last24Hours.length > 50) {
      threats.push('High-frequency transaction activity detected');
      riskScore += 20;
    }

    // Check for failed transaction ratio
    const failedTxs = transactions.filter(tx => tx.isError === '1');
    if (failedTxs.length > transactions.length * 0.3) {
      threats.push('High failed transaction rate - possible failed attacks');
      riskScore += 15;
    }

    // Check for suspicious gas patterns
    const highGasTxs = transactions.filter(tx => 
      parseInt(tx.gasPrice) > 20000000000 // > 20 gwei
    );
    if (highGasTxs.length > transactions.length * 0.5) {
      threats.push('Frequent high gas price transactions - MEV activity possible');
      riskScore += 10;
    }

    // Check for identical transaction patterns
    const valuePatterns = new Map();
    transactions.forEach(tx => {
      const value = tx.value;
      valuePatterns.set(value, (valuePatterns.get(value) || 0) + 1);
    });

    for (const [value, count] of valuePatterns) {
      if (count > 10 && value !== '0') {
        threats.push('Repetitive transaction amounts detected');
        riskScore += 10;
        break;
      }
    }

    return { threats, riskScore };
  }

  // Check for interactions with known malicious contracts
  private checkMaliciousInteractions(transactions: any[]): string[] {
    const maliciousInteractions: string[] = [];
    
    transactions.forEach(tx => {
      if (this.blacklistedContracts.has(tx.to?.toLowerCase()) || 
          this.blacklistedContracts.has(tx.from?.toLowerCase())) {
        maliciousInteractions.push(tx.to || tx.from);
      }
    });

    return [...new Set(maliciousInteractions)];
  }

  // Analyze DeFi protocol interactions
  private analyzeDeFiInteractions(transactions: any[]): {
    interactions: DeFiInteraction[];
    threats: string[];
    riskScore: number;
  } {
    const interactions: DeFiInteraction[] = [];
    const threats: string[] = [];
    let riskScore = 0;

    transactions.forEach(tx => {
      if (tx.value === '0' && tx.input !== '0x') {
        // Likely a contract interaction
        const protocolName = this.trustedContracts.get(tx.to?.toLowerCase()) || 'Unknown';
        
        interactions.push({
          protocol: protocolName,
          contractAddress: tx.to,
          interactionType: 'contract_call',
          riskLevel: protocolName === 'Unknown' ? 'medium' : 'low',
          timestamp: new Date(parseInt(tx.timeStamp) * 1000)
        });

        if (protocolName === 'Unknown') {
          riskScore += 5;
        }
      }
    });

    // Check for interactions with too many unknown protocols
    const unknownInteractions = interactions.filter(i => i.protocol === 'Unknown');
    if (unknownInteractions.length > 10) {
      threats.push('Multiple interactions with unverified DeFi protocols');
      riskScore += 15;
    }

    return { interactions, threats, riskScore };
  }

  // Analyze token holdings
  private async analyzeTokenHoldings(address: string): Promise<{
    count: number;
    threats: string[];
    riskScore: number;
  }> {
    try {
      const response = await fetch(
        `${this.bscscanApiUrl}?module=account&action=tokentx&address=${address}&page=1&offset=100&sort=desc&apikey=${this.bscscanApiKey}`
      );
      const data = await response.json();
      
      const threats: string[] = [];
      let riskScore = 0;
      
      if (data.status === '1' && data.result) {
        const uniqueTokens = new Set(data.result.map((tx: any) => tx.contractAddress));
        const tokenCount = uniqueTokens.size;

        // Check if holding too many different tokens (possible airdrop farming)
        if (tokenCount > 50) {
          threats.push('Holding unusually large number of different tokens');
          riskScore += 10;
        }

        return { count: tokenCount, threats, riskScore };
      }

      return { count: 0, threats, riskScore };
    } catch (error) {
      console.error('Failed to analyze token holdings:', error);
      return { count: 0, threats: [], riskScore: 0 };
    }
  }

  // Analyze contract source code for vulnerabilities
  private analyzeSourceCode(sourceCode: string): Partial<BNBContractAnalysis> {
    const analysis: Partial<BNBContractAnalysis> = {
      isBEP20: false,
      canMint: false,
      canPause: false,
      hasBlacklist: false,
      hasProxyPattern: false,
      hasUpgradeability: false,
      vulnerabilities: []
    };

    // Check if it's a BEP-20 token
    if (sourceCode.includes('IBEP20') || sourceCode.includes('BEP20') || 
        (sourceCode.includes('totalSupply') && sourceCode.includes('transfer'))) {
      analysis.isBEP20 = true;
    }

    // Check for minting capability
    if (sourceCode.includes('function mint') || sourceCode.includes('_mint')) {
      analysis.canMint = true;
    }

    // Check for pause functionality
    if (sourceCode.includes('Pausable') || sourceCode.includes('function pause')) {
      analysis.canPause = true;
    }

    // Check for blacklist functionality
    if (sourceCode.includes('blacklist') || sourceCode.includes('blocked') || 
        sourceCode.includes('banned')) {
      analysis.hasBlacklist = true;
    }

    // Check for proxy patterns
    if (sourceCode.includes('delegatecall') || sourceCode.includes('Proxy') || 
        sourceCode.includes('implementation')) {
      analysis.hasProxyPattern = true;
    }

    // Check for upgradeability
    if (sourceCode.includes('upgrade') || sourceCode.includes('Upgradeable')) {
      analysis.hasUpgradeability = true;
    }

    // Check for common vulnerabilities
    if (sourceCode.includes('selfdestruct')) {
      analysis.vulnerabilities!.push('Contract contains selfdestruct function');
    }

    if (sourceCode.includes('tx.origin')) {
      analysis.vulnerabilities!.push('Uses tx.origin instead of msg.sender');
    }

    return analysis;
  }

  // Check if contract is a honeypot
  private async checkForHoneypot(address: string): Promise<{ isHoneypot: boolean; reason?: string }> {
    // This is a simplified check - in production, integrate with honeypot detection services
    try {
      // Placeholder for honeypot detection logic
      // In reality, you would:
      // 1. Try to simulate buy/sell transactions
      // 2. Check for hidden fees or restrictions
      // 3. Analyze contract logic for trap mechanisms
      
      return { isHoneypot: false };
    } catch (error) {
      return { isHoneypot: false };
    }
  }

  // Analyze liquidity lock status
  private async analyzeLiquidity(address: string): Promise<{ isLocked: boolean; lockInfo?: any }> {
    // Placeholder for liquidity analysis
    // In production, you would check:
    // 1. PancakeSwap liquidity pools
    // 2. Lock contracts (e.g., DxSale, PinkSale)
    // 3. Team wallet holdings
    
    return { isLocked: Math.random() > 0.3 }; // Mock implementation
  }

  // Calculate rug pull risk
  private calculateRugPullRisk(contractDetails: BNBContractAnalysis): 'low' | 'medium' | 'high' {
    let riskFactors = 0;

    if (!contractDetails.isVerified) riskFactors += 2;
    if (contractDetails.canMint) riskFactors += 2;
    if (!contractDetails.liquidityLocked) riskFactors += 3;
    if (contractDetails.hasBlacklist) riskFactors += 1;
    if (contractDetails.ownershipRisk === 'high') riskFactors += 2;

    if (riskFactors >= 6) return 'high';
    if (riskFactors >= 3) return 'medium';
    return 'low';
  }

  // Calculate overall security status
  private calculateSecurityStatus(riskScore: number): 'safe' | 'warning' | 'danger' {
    if (riskScore <= 30) return 'safe';
    if (riskScore <= 60) return 'warning';
    return 'danger';
  }

  // Generate wallet-specific recommendations
  private generateWalletRecommendations(analysis: BNBSecurityAnalysis): string[] {
    const recommendations: string[] = [
      'Use a hardware wallet for large BNB amounts',
      'Regularly review and revoke token approvals',
      'Be cautious with new DeFi protocols on BSC',
      'Monitor transactions for unusual patterns'
    ];

    if (parseFloat(analysis.bnbBalance || '0') > 10) {
      recommendations.push('Consider using a multi-signature wallet for large holdings');
    }

    if (analysis.tokenCount! > 20) {
      recommendations.push('Review your token portfolio for unused/risky tokens');
    }

    if (analysis.riskScore > 50) {
      recommendations.unshift('URGENT: Review recent transactions for unauthorized activity');
    }

    return recommendations;
  }

  // Generate contract-specific recommendations
  private generateContractRecommendations(analysis: BNBSecurityAnalysis): string[] {
    const recommendations: string[] = [];

    if (!analysis.contractDetails?.isVerified) {
      recommendations.push('CRITICAL: Verify contract source code before interaction');
    }

    if (analysis.contractDetails?.isHoneypot) {
      recommendations.push('⚠️ AVOID: This appears to be a honeypot contract');
    }

    if (analysis.contractDetails?.rugPullRisk === 'high') {
      recommendations.push('HIGH RISK: Significant rug pull indicators detected');
    }

    if (analysis.contractDetails?.canMint) {
      recommendations.push('Be aware of unlimited minting capability');
    }

    if (!analysis.contractDetails?.liquidityLocked) {
      recommendations.push('Liquidity not locked - verify team commitment');
    }

    recommendations.push('Check for recent security audits');
    recommendations.push('Start with small test transactions');
    recommendations.push('Research the project team and community');

    return recommendations;
  }
}
