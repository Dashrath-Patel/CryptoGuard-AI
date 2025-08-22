// app/api/scanner/wallet-transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface BSCTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  gasPrice: string;
  gasUsed: string;
  input: string;
  methodId?: string;
  functionName?: string;
  isError: string;
}

interface FormattedTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high';
  type: string;
  status: 'success' | 'failed';
}

// Get function name from method ID
function getFunctionName(input: string): string {
  if (!input || input === '0x') return 'Transfer';
  
  const methodId = input.slice(0, 10);
  const commonMethods: { [key: string]: string } = {
    '0xa9059cbb': 'Transfer',
    '0x23b872dd': 'Transfer From',
    '0x095ea7b3': 'Approve',
    '0x38ed1739': 'Swap Tokens',
    '0x7ff36ab5': 'Swap ETH for Tokens',
    '0x18cbafe5': 'Swap Tokens for ETH',
    '0xd0e30db0': 'Deposit',
    '0x2e1a7d4d': 'Withdraw'
  };
  
  return commonMethods[methodId] || 'Contract Call';
}

// Analyze transaction for risk level
function analyzeTransactionRisk(tx: BSCTransaction): 'low' | 'medium' | 'high' {
  let riskScore = 0;
  
  // Failed transaction
  if (tx.isError === '1') {
    riskScore += 30;
  }
  
  // High gas price (>20 gwei is high for BSC)
  const gasPriceGwei = parseInt(tx.gasPrice, 10) / 1e9;
  if (gasPriceGwei > 20) {
    riskScore += 20;
  }
  
  // Large value transfer (>10 BNB)
  const valueInBNB = parseInt(tx.value, 10) / 1e18;
  if (valueInBNB > 10) {
    riskScore += 15;
  }
  
  // Very large value (>100 BNB)
  if (valueInBNB > 100) {
    riskScore += 25;
  }
  
  if (riskScore > 40) return 'high';
  if (riskScore > 20) return 'medium';
  return 'low';
}

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    try {
      // Fetch real transactions from BSCScan
      const response = await fetch(
        `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${process.env.BSCSCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        const formattedTransactions: FormattedTransaction[] = data.result.map((tx: BSCTransaction) => {
          const valueInBNB = parseInt(tx.value, 10) / 1e18;
          const functionName = getFunctionName(tx.input);
          
          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: valueInBNB > 0 ? `${valueInBNB.toFixed(4)} BNB` : '0 BNB',
            timestamp: new Date(parseInt(tx.timeStamp) * 1000),
            riskLevel: analyzeTransactionRisk(tx),
            type: functionName,
            status: tx.isError === '0' ? 'success' : 'failed'
          };
        });

        return NextResponse.json({
          success: true,
          transactions: formattedTransactions,
          count: formattedTransactions.length
        });
      }
      
      // No transactions found
      return NextResponse.json({
        success: true,
        transactions: [],
        count: 0
      });
      
    } catch (apiError) {
      console.error('BSCScan API error:', apiError);
      
      // Fallback to mock transactions
      const mockTransactions: FormattedTransaction[] = [
        {
          hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          from: address,
          to: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
          value: "0.5000 BNB",
          timestamp: new Date(Date.now() - 3600000),
          riskLevel: 'low',
          type: 'Swap Tokens',
          status: 'success'
        },
        {
          hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          from: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
          to: address,
          value: "0.0000 BNB",
          timestamp: new Date(Date.now() - 7200000),
          riskLevel: 'low',
          type: 'Transfer',
          status: 'success'
        }
      ];

      return NextResponse.json({
        success: true,
        transactions: mockTransactions,
        count: mockTransactions.length,
        fallback: true
      });
    }

  } catch (error) {
    console.error('Wallet transactions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet transactions' },
      { status: 500 }
    );
  }
}
