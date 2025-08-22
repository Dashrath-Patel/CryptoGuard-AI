// Test utilities for the Smart Translator API
// Use this file to test the translation functionality

interface TestCase {
  name: string;
  input: {
    text: string;
    mode: 'text' | 'term';
  };
  expectedTerms?: string[];
}

export const testCases: TestCase[] = [
  {
    name: 'Single Term Lookup',
    input: {
      text: 'impermanent loss',
      mode: 'term'
    },
    expectedTerms: ['Impermanent Loss']
  },
  {
    name: 'Complex DeFi Text',
    input: {
      text: 'I want to provide liquidity to the USDT-BNB pool on PancakeSwap to earn yield, but I\'m worried about impermanent loss and smart contract risks.',
      mode: 'text'
    },
    expectedTerms: ['liquidity', 'yield', 'impermanent loss', 'smart contract']
  },
  {
    name: 'BSC Ecosystem Terms',
    input: {
      text: 'Should I bridge my tokens from Ethereum to BNB Chain to use PancakeSwap and Venus Protocol?',
      mode: 'text'
    },
    expectedTerms: ['bridge', 'BNB Chain', 'PancakeSwap', 'Venus Protocol']
  },
  {
    name: 'Trading Terminology',
    input: {
      text: 'The whale dumped causing high slippage and triggering stop losses across the board.',
      mode: 'text'
    },
    expectedTerms: ['whale', 'slippage', 'stop loss']
  },
  {
    name: 'Security Focus',
    input: {
      text: 'Always check for contract audits and look out for rug pulls in new DeFi projects.',
      mode: 'text'
    },
    expectedTerms: ['audit', 'rug pull', 'DeFi']
  }
];

// Helper function to test the API locally
export async function testTranslatorAPI(testCase: TestCase) {
  try {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`Input: "${testCase.input.text}"`);
    console.log(`Mode: ${testCase.input.mode}`);
    
    const response = await fetch('http://localhost:3000/api/translator/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase.input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Success! Found ${data.translations.length} translations`);
    console.log(`Source: ${data.source}`);
    
    data.translations.forEach((translation: any, index: number) => {
      console.log(`\n${index + 1}. ${translation.term} (${translation.category}, ${translation.riskLevel} Risk)`);
      console.log(`   Simple: ${translation.simpleDef.substring(0, 100)}...`);
      console.log(`   Related: ${translation.relatedTerms.join(', ')}`);
    });

    return data;
  } catch (error) {
    console.error(`❌ Test failed:`, error);
    return null;
  }
}

// Run all test cases
export async function runAllTests() {
  console.log('🚀 Starting Smart Translator API Tests\n');
  
  for (const testCase of testCases) {
    await testTranslatorAPI(testCase);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
  
  console.log('\n✨ All tests completed!');
}

// Usage examples:
// 1. Test a specific case:
// testTranslatorAPI(testCases[0]);
//
// 2. Run all tests:
// runAllTests();
//
// 3. Test custom input:
// testTranslatorAPI({
//   name: 'Custom Test',
//   input: { text: 'your text here', mode: 'text' }
// });

export default { testCases, testTranslatorAPI, runAllTests };
