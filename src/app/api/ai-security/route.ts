import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { transactions, walletAddress, walletBalance } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: 'Gemini API key not configured'
      }, { status: 500 });
    }

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({
        recommendations: [],
        summary: "No recent transactions found for analysis.",
        riskScore: 0,
        aiAnalysis: "Unable to provide security recommendations without transaction data."
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare transaction data for AI analysis
    const transactionSummary = transactions.map((tx: any, index: number) => ({
      transaction: index + 1,
      hash: tx.hash.substring(0, 10) + '...',
      direction: tx.from === 'Your Wallet' ? 'Outgoing' : 'Incoming',
      amount: tx.value,
      timestamp: tx.timestamp,
      riskLevel: tx.riskLevel
    }));

    // Create AI prompt for security analysis
    const prompt = `
You are a cryptocurrency security expert analyzing wallet transactions for potential security risks and providing recommendations.

WALLET ANALYSIS:
- Wallet Address: ${walletAddress}
- Current Balance: ${walletBalance}
- Recent Transactions: ${transactions.length}

TRANSACTION DETAILS:
${JSON.stringify(transactionSummary, null, 2)}

Please analyze these transactions and provide:

1. **SECURITY RISK ASSESSMENT** (Rate 1-10):
   - Overall risk score
   - Specific risks identified

2. **AI SECURITY RECOMMENDATIONS** (3-5 actionable recommendations):
   - Prioritized security improvements
   - Specific actions to take
   - Best practices for wallet security

3. **TRANSACTION PATTERN ANALYSIS**:
   - Unusual patterns detected
   - Frequency analysis
   - Amount analysis

4. **IMMEDIATE ACTIONS** (if any high-risk issues):
   - Urgent security measures
   - Account protection steps

Respond in JSON format:
{
  "riskScore": number (1-10),
  "summary": "brief overall assessment",
  "recommendations": [
    {
      "priority": "high/medium/low",
      "title": "recommendation title",
      "description": "detailed description",
      "action": "specific action to take"
    }
  ],
  "patternAnalysis": {
    "unusualActivity": "description",
    "frequencyPattern": "description", 
    "amountPattern": "description"
  },
  "immediateActions": ["action1", "action2"],
  "aiInsights": "detailed AI analysis and insights"
}

Focus on practical, actionable security advice based on actual transaction patterns.
`;

    // Generate AI response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    let aiAnalysis;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      aiAnalysis = {
        riskScore: 5,
        summary: "Analysis completed but formatting error occurred.",
        recommendations: [
          {
            priority: "high",
            title: "Review Transaction Security",
            description: "Regularly monitor your wallet transactions for suspicious activity",
            action: "Set up transaction alerts and review wallet security settings"
          }
        ],
        patternAnalysis: {
          unusualActivity: "Unable to parse detailed analysis",
          frequencyPattern: "Manual review recommended",
          amountPattern: "Standard transaction amounts detected"
        },
        immediateActions: ["Enable additional security measures"],
        aiInsights: text
      };
    }

    return NextResponse.json(aiAnalysis);

  } catch (error) {
    console.error('AI Security Analysis Error:', error);
    return NextResponse.json({
      error: 'Failed to generate AI security analysis',
      fallback: {
        riskScore: 5,
        summary: "Analysis service temporarily unavailable",
        recommendations: [
          {
            priority: "high",
            title: "Use Hardware Wallet",
            description: "Store large amounts in hardware wallet for enhanced security",
            action: "Consider Ledger or Trezor for cold storage"
          },
          {
            priority: "medium", 
            title: "Enable 2FA",
            description: "Add two-factor authentication to all crypto accounts",
            action: "Use authenticator app for additional security layer"
          }
        ],
        patternAnalysis: {
          unusualActivity: "Service unavailable",
          frequencyPattern: "Manual analysis required",
          amountPattern: "Review recommended"
        },
        immediateActions: ["Review wallet security settings"],
        aiInsights: "AI analysis temporarily unavailable. Please try again later."
      }
    }, { status: 500 });
  }
}
