// app/api/scanner/transaction/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface TransactionDetail {
  hash: string;
  blockNumber: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  status: string;
  methodId: string;
  functionName: string;
  timestamp: string;
}

interface TransactionAnalysis {
  hash: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  suspiciousPatterns: string[];
  gasAnalysis: {
    gasPrice: string;
    gasUsed: string;
    gasCost: string;
    isHighGas: boolean;
  };
  contractInteractions: string[];
  valueTransfer: {
    amount: string;
    usdValue?: string;
  };
  securityFlags: string[];
  timestamp: string;
  blockConfirmations: number;
}

// Fetch real transaction details from BSCScan
async function getTransactionDetails(txHash: string): Promise<TransactionDetail | null> {
  try {
    const response = await fetch(
      `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${process.env.BSCSCAN_API_KEY}`
    );
    const data = await response.json();
    
    if (data.result) {
      const tx = data.result;
      
      // Get transaction receipt for gas used and status
      const receiptResponse = await fetch(
        `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${process.env.BSCSCAN_API_KEY}`
      );
      const receiptData = await receiptResponse.json();
      const receipt = receiptData.result;
      
      return {
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        from: tx.from,
        to: tx.to || '',
        value: tx.value,
        gasPrice: tx.gasPrice,
        gasUsed: receipt?.gasUsed || '0',
        status: receipt?.status || '1',
        methodId: tx.input?.slice(0, 10) || '0x',
        functionName: await getFunctionName(tx.input?.slice(0, 10) || '0x'),
        timestamp: await getBlockTimestamp(tx.blockNumber)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
}

// Get block timestamp
async function getBlockTimestamp(blockNumber: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bscscan.com/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=false&apikey=${process.env.BSCSCAN_API_KEY}`
    );
    const data = await response.json();
    
    if (data.result?.timestamp) {
      return new Date(parseInt(data.result.timestamp, 16) * 1000).toISOString();
    }
  } catch (error) {
    console.error('Error fetching block timestamp:', error);
  }
  
  return new Date().toISOString();
}

// Get function name from method ID
async function getFunctionName(methodId: string): Promise<string> {
  const commonMethods: { [key: string]: string } = {
    '0xa9059cbb': 'transfer',
    '0x23b872dd': 'transferFrom',
    '0x095ea7b3': 'approve',
    '0x18160ddd': 'totalSupply',
    '0x70a08231': 'balanceOf',
    '0x38ed1739': 'swapExactTokensForTokens',
    '0x7ff36ab5': 'swapExactETHForTokens',
    '0x18cbafe5': 'swapExactTokensForETH',
    '0xd0e30db0': 'deposit',
    '0x2e1a7d4d': 'withdraw'
  };
  
  return commonMethods[methodId] || 'Unknown';
}

// Analyze transaction for security risks
function analyzeTransactionSecurity(tx: TransactionDetail): TransactionAnalysis {
  const suspiciousPatterns: string[] = [];
  const securityFlags: string[] = [];
  let riskScore = 0;
  
  // Gas price analysis
  const gasPriceGwei = parseInt(tx.gasPrice, 16) / 1e9;
  const isHighGas = gasPriceGwei > 20; // High if > 20 gwei on BSC
  
  if (isHighGas) {
    suspiciousPatterns.push('Unusually high gas price detected');
    riskScore += 15;
  }
  
  // Transaction status analysis
  if (tx.status === '0') {
    suspiciousPatterns.push('Transaction failed');
    securityFlags.push('FAILED_TRANSACTION');
    riskScore += 25;
  }
  
  // Value transfer analysis
  const valueInBNB = parseInt(tx.value, 16) / 1e18;
  if (valueInBNB > 100) {
    suspiciousPatterns.push('Large BNB value transfer');
    riskScore += 20;
  }
  
  // Contract interaction analysis
  const contractInteractions: string[] = [];
  if (tx.to && tx.to !== '0x0000000000000000000000000000000000000000') {
    contractInteractions.push(tx.to);
    
    // Check if interacting with known risky patterns
    if (tx.methodId && ['0x', '0x0'].includes(tx.methodId)) {
      suspiciousPatterns.push('Direct contract call without function');
      riskScore += 10;
    }
  }
  
  // Function analysis
  if (tx.functionName === 'Unknown' && tx.methodId !== '0x') {
    suspiciousPatterns.push('Interaction with unknown function');
    securityFlags.push('UNKNOWN_FUNCTION');
    riskScore += 15;
  }
  
  // MEV/Frontrunning indicators
  if (gasPriceGwei > 50) {
    suspiciousPatterns.push('Potential MEV/Frontrunning attempt');
    securityFlags.push('HIGH_GAS_MEV');
    riskScore += 30;
  }
  
  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore > 50) {
    riskLevel = 'high';
  } else if (riskScore > 25) {
    riskLevel = 'medium';
  }
  
  // Calculate gas cost in BNB
  const gasCostWei = BigInt(tx.gasUsed) * BigInt(tx.gasPrice);
  const gasCostBNB = Number(gasCostWei) / 1e18;
  
  return {
    hash: tx.hash,
    riskLevel,
    riskScore,
    suspiciousPatterns,
    gasAnalysis: {
      gasPrice: `${gasPriceGwei.toFixed(2)} gwei`,
      gasUsed: parseInt(tx.gasUsed, 16).toLocaleString(),
      gasCost: `${gasCostBNB.toFixed(6)} BNB`,
      isHighGas
    },
    contractInteractions,
    valueTransfer: {
      amount: `${valueInBNB.toFixed(4)} BNB`,
      usdValue: valueInBNB > 0 ? `~$${(valueInBNB * 300).toFixed(2)}` : undefined
    },
    securityFlags,
    timestamp: tx.timestamp,
    blockConfirmations: 0 // Will be calculated based on current block
  };
}

export async function POST(request: NextRequest) {
  try {
    const { txHash } = await request.json();

    if (!txHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      );
    }

    // Validate transaction hash format
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return NextResponse.json(
        { error: 'Invalid transaction hash format' },
        { status: 400 }
      );
    }

    try {
      // Fetch real transaction details from BSCScan
      const transactionDetails = await getTransactionDetails(txHash);
      
      if (!transactionDetails) {
        return NextResponse.json(
          { error: 'Transaction not found on BNB Chain' },
          { status: 404 }
        );
      }
      
      // Analyze transaction for security risks
      const analysis = analyzeTransactionSecurity(transactionDetails);
      
      return NextResponse.json(analysis);
      
    } catch (apiError) {
      console.error('BSCScan API error:', apiError);
      
      // Fallback to mock analysis if API fails
      const mockAnalysis = {
        hash: txHash,
        riskLevel: 'medium' as 'low' | 'medium' | 'high',
        riskScore: 35,
        suspiciousPatterns: ['API unavailable - using fallback analysis'],
        gasAnalysis: {
          gasPrice: '5.0 gwei',
          gasUsed: '21,000',
          gasCost: '0.000105 BNB',
          isHighGas: false
        },
        contractInteractions: [],
        valueTransfer: {
          amount: '0.0000 BNB'
        },
        securityFlags: ['FALLBACK_MODE'],
        timestamp: new Date().toISOString(),
        blockConfirmations: 0
      };
      
      return NextResponse.json(mockAnalysis);
    }

  } catch (error) {
    console.error('Transaction analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze transaction' },
      { status: 500 }
    );
  }
}
