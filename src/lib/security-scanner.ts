// lib/security-scanner.ts
// Note: Install ethers first: npm install ethers

export interface SecurityAnalysis {
  address: string;
  riskScore: number;
  status: 'safe' | 'warning' | 'danger';
  threats: string[];
  recommendations: string[];
  contractDetails?: ContractAnalysis;
  bnbBalance?: string;
  tokenCount?: number;
  networkInfo?: BNBNetworkInfo;
}

export interface ContractAnalysis {
  isVerified: boolean;
  compiler: string;
  hasProxyPattern: boolean;
  hasUpgradeability: boolean;
  ownershipRisk: 'low' | 'medium' | 'high';
  vulnerabilities: string[];
  isBEP20?: boolean;
  canMint?: boolean;
  canPause?: boolean;
  hasBlacklist?: boolean;
  liquidityLocked?: boolean;
}

export interface BNBNetworkInfo {
  chainId: number;
  networkName: string;
  gasPrice: string;
  blockNumber: number;
  bnbPrice: string;
}

export interface TransactionAnalysis {
  hash: string;
  riskLevel: 'low' | 'medium' | 'high';
  suspiciousPatterns: string[];
  gasUsage: string;
  contractInteractions: string[];
}

export class SecurityScanner {
  private bnbRpcUrl: string;
  private bscscanApiKey: string;
  private bscscanApiUrl: string;

  // Known BNB Chain addresses
  private trustedContracts = new Set([
    '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap Router V2
    '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // PancakeSwap Factory
    '0xfb6115445Bff7b52FeB98650C87f44907E58f802', // Venus Protocol
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', // CAKE Token
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // BUSD
    '0x55d398326f99059fF775485246999027B3197955', // USDT
  ]);

  private blacklistedContracts = new Set([
    // Add known scam/malicious contracts on BSC
    // These would be populated from threat intelligence feeds
  ]);

  constructor() {
    this.bnbRpcUrl = process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed1.binance.org/';
    this.bscscanApiKey = process.env.BSCSCAN_API_KEY || '';
    this.bscscanApiUrl = process.env.NEXT_PUBLIC_BSCSCAN_API_URL || 'https://api.bscscan.com/api';
  }

  async analyzeWallet(address: string): Promise<SecurityAnalysis> {
    try {
      // Validate address
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid wallet address');
      }

      // Get wallet balance and transaction count
      const balance = await this.provider.getBalance(address);
      const transactionCount = await this.provider.getTransactionCount(address);

      // Analyze recent transactions
      const recentTxs = await this.getRecentTransactions(address);
      const riskFactors = await this.analyzeTransactionPatterns(recentTxs);

      // Calculate risk score based on various factors
      const riskScore = this.calculateWalletRiskScore({
        balance: parseFloat(ethers.formatEther(balance)),
        transactionCount,
        riskFactors,
        recentActivity: recentTxs.length
      });

      // Generate recommendations
      const recommendations = this.generateWalletRecommendations(riskScore, riskFactors);

      return {
        address,
        riskScore,
        status: this.getRiskStatus(riskScore),
        threats: riskFactors,
        recommendations
      };

    } catch (error) {
      console.error('Wallet analysis failed:', error);
      throw new Error('Failed to analyze wallet');
    }
  }

  async analyzeContract(address: string): Promise<SecurityAnalysis> {
    try {
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid contract address');
      }

      // Check if address is a contract
      const code = await this.provider.getCode(address);
      if (code === '0x') {
        throw new Error('Address is not a contract');
      }

      // Get contract details from blockchain explorer
      const contractDetails = await this.getContractDetails(address);
      
      // Analyze contract code and patterns
      const vulnerabilities = await this.analyzeContractVulnerabilities(address, code);
      
      // Calculate contract risk score
      const riskScore = this.calculateContractRiskScore(contractDetails, vulnerabilities);

      return {
        address,
        riskScore,
        status: this.getRiskStatus(riskScore),
        threats: vulnerabilities,
        recommendations: this.generateContractRecommendations(contractDetails, vulnerabilities),
        contractDetails
      };

    } catch (error) {
      console.error('Contract analysis failed:', error);
      throw new Error('Failed to analyze contract');
    }
  }

  async analyzeTransaction(txHash: string): Promise<TransactionAnalysis> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) {
        throw new Error('Transaction not found');
      }

      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) {
        throw new Error('Transaction receipt not found');
      }

      // Analyze transaction patterns
      const suspiciousPatterns = await this.detectSuspiciousPatterns(tx, receipt);
      
      // Analyze gas usage
      const gasUsage = this.analyzeGasUsage(tx, receipt);
      
      // Get contract interactions
      const contractInteractions = await this.getContractInteractions(receipt);

      return {
        hash: txHash,
        riskLevel: this.calculateTransactionRisk(suspiciousPatterns, gasUsage),
        suspiciousPatterns,
        gasUsage: gasUsage.toString(),
        contractInteractions
      };

    } catch (error) {
      console.error('Transaction analysis failed:', error);
      throw new Error('Failed to analyze transaction');
    }
  }

  private async getRecentTransactions(address: string): Promise<any[]> {
    // In a real implementation, this would fetch from blockchain explorer API
    // For now, return mock data
    return [];
  }

  private async analyzeTransactionPatterns(transactions: any[]): Promise<string[]> {
    const patterns: string[] = [];
    
    // Analyze for suspicious patterns
    if (transactions.length > 100) {
      patterns.push('High transaction frequency detected');
    }
    
    // Check for known scam addresses (would use real database)
    // patterns.push('Interaction with flagged addresses');
    
    return patterns;
  }

  private calculateWalletRiskScore(factors: {
    balance: number;
    transactionCount: number;
    riskFactors: string[];
    recentActivity: number;
  }): number {
    let score = 10; // Base score
    
    // Higher balance = lower risk (up to a point)
    if (factors.balance < 0.01) score += 20;
    else if (factors.balance < 0.1) score += 10;
    
    // High transaction count can indicate bot activity
    if (factors.transactionCount > 1000) score += 15;
    
    // Risk factors from pattern analysis
    score += factors.riskFactors.length * 10;
    
    // High recent activity
    if (factors.recentActivity > 50) score += 10;
    
    return Math.min(score, 100);
  }

  private async getContractDetails(address: string): Promise<ContractAnalysis> {
    // In real implementation, fetch from blockchain explorer
    return {
      isVerified: Math.random() > 0.3,
      compiler: 'v0.8.19+commit.7dd6d404',
      hasProxyPattern: Math.random() > 0.7,
      hasUpgradeability: Math.random() > 0.8,
      ownershipRisk: Math.random() > 0.5 ? 'low' : 'medium',
      vulnerabilities: []
    };
  }

  private async analyzeContractVulnerabilities(address: string, code: string): Promise<string[]> {
    const vulnerabilities: string[] = [];
    
    // Simple pattern matching (in real implementation, use proper static analysis)
    if (code.includes('selfdestruct')) {
      vulnerabilities.push('Contract contains selfdestruct function');
    }
    
    if (code.includes('delegatecall')) {
      vulnerabilities.push('Contract uses delegatecall - potential proxy risk');
    }
    
    return vulnerabilities;
  }

  private calculateContractRiskScore(details: ContractAnalysis, vulnerabilities: string[]): number {
    let score = 20; // Base score for contracts
    
    if (!details.isVerified) score += 30;
    if (details.hasProxyPattern) score += 15;
    if (details.hasUpgradeability) score += 10;
    if (details.ownershipRisk === 'high') score += 20;
    else if (details.ownershipRisk === 'medium') score += 10;
    
    score += vulnerabilities.length * 15;
    
    return Math.min(score, 100);
  }

  private async detectSuspiciousPatterns(tx: any, receipt: any): Promise<string[]> {
    const patterns: string[] = [];
    
    // Check for high gas price (potential MEV or urgency)
    if (tx.gasPrice && BigInt(tx.gasPrice) > BigInt('50000000000')) {
      patterns.push('Unusually high gas price');
    }
    
    // Check for failed transaction
    if (receipt.status === 0) {
      patterns.push('Transaction failed');
    }
    
    return patterns;
  }

  private analyzeGasUsage(tx: any, receipt: any): bigint {
    return receipt.gasUsed || BigInt(0);
  }

  private async getContractInteractions(receipt: any): Promise<string[]> {
    // Analyze logs for contract interactions
    return receipt.logs?.map((log: any) => log.address) || [];
  }

  private calculateTransactionRisk(patterns: string[], gasUsage: bigint): 'low' | 'medium' | 'high' {
    if (patterns.length === 0) return 'low';
    if (patterns.length <= 2) return 'medium';
    return 'high';
  }

  private getRiskStatus(score: number): 'safe' | 'warning' | 'danger' {
    if (score <= 30) return 'safe';
    if (score <= 60) return 'warning';
    return 'danger';
  }

  private generateWalletRecommendations(riskScore: number, riskFactors: string[]): string[] {
    const recommendations: string[] = [
      'Enable 2FA on all connected dApps',
      'Review token approvals regularly',
      'Use hardware wallet for large amounts'
    ];

    if (riskScore > 60) {
      recommendations.unshift('Consider using a new wallet address');
      recommendations.push('Audit recent transactions carefully');
    }

    if (riskFactors.includes('High transaction frequency detected')) {
      recommendations.push('Monitor for automated/bot activity');
    }

    return recommendations;
  }

  private generateContractRecommendations(details: ContractAnalysis, vulnerabilities: string[]): string[] {
    const recommendations: string[] = [];

    if (!details.isVerified) {
      recommendations.push('Verify contract source code');
    }

    if (details.hasProxyPattern) {
      recommendations.push('Review proxy implementation carefully');
    }

    if (vulnerabilities.length > 0) {
      recommendations.push('Get professional security audit');
    }

    recommendations.push('Check for recent audit reports');
    recommendations.push('Review contract permissions and ownership');

    return recommendations;
  }
}
