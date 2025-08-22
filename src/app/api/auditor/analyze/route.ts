import { NextRequest, NextResponse } from 'next/server';

interface ContractAnalysis {
  address: string;
  grade: string;
  score: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  features: {
    verified: boolean;
    proxy: boolean;
    mintable: boolean;
    pausable: boolean;
    hasOwner: boolean;
  };
  analysis: {
    complexity: 'Low' | 'Medium' | 'High';
    gasOptimization: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    codeQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    security: 'Vulnerable' | 'Weak' | 'Good' | 'Excellent';
  };
  recommendations: string[];
}

const BSCSCAN_API_KEY = 'Q9PMT4R2E15FT8KHA5X3PV92R779ABQG8H';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address || !address.startsWith('0x')) {
      return NextResponse.json(
        { error: 'Valid contract address required' },
        { status: 400 }
      );
    }

    // Get contract source code from BSCScan
    const sourceCodeResponse = await fetch(
      `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${address}&apikey=${BSCSCAN_API_KEY}`
    );
    const sourceCodeData = await sourceCodeResponse.json();

    // Get contract ABI
    const abiResponse = await fetch(
      `https://api.bscscan.com/api?module=contract&action=getabi&address=${address}&apikey=${BSCSCAN_API_KEY}`
    );
    const abiData = await abiResponse.json();

    // Analyze the contract
    const analysis = analyzeContract(sourceCodeData.result[0], abiData.result, address);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Contract analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze contract' },
      { status: 500 }
    );
  }
}

function analyzeContract(sourceCode: any, abi: string, address: string): ContractAnalysis {
  const isVerified = sourceCode.SourceCode !== '';
  const contractName = sourceCode.ContractName || 'Unknown';
  const sourceCodeText = sourceCode.SourceCode || '';
  
  // Parse ABI for function analysis
  let parsedABI: any[] = [];
  try {
    parsedABI = JSON.parse(abi || '[]');
  } catch (e) {
    parsedABI = [];
  }

  // Analyze contract features
  const features = analyzeFeatures(sourceCodeText, parsedABI);
  
  // Analyze vulnerabilities
  const vulnerabilities = analyzeVulnerabilities(sourceCodeText, parsedABI);
  
  // Calculate quality metrics
  const analysis = analyzeQuality(sourceCodeText, parsedABI, isVerified);
  
  // Calculate overall score and grade
  const score = calculateScore(vulnerabilities, features, analysis, isVerified);
  const grade = calculateGrade(score);
  
  // Generate recommendations
  const recommendations = generateRecommendations(vulnerabilities, features, analysis, isVerified);

  return {
    address,
    grade,
    score,
    vulnerabilities,
    features,
    analysis,
    recommendations
  };
}

function analyzeFeatures(sourceCode: string, abi: any[]) {
  const functions = abi.filter(item => item.type === 'function').map(f => f.name);
  
  return {
    verified: sourceCode !== '',
    proxy: sourceCode.includes('proxy') || sourceCode.includes('Proxy') || 
           functions.some(f => f?.includes('upgrade') || f?.includes('implementation')),
    mintable: functions.some(f => f?.includes('mint')) || sourceCode.includes('_mint'),
    pausable: functions.some(f => f?.includes('pause')) || sourceCode.includes('pause'),
    hasOwner: functions.some(f => f?.includes('owner') || f?.includes('Owner')) || 
             sourceCode.includes('onlyOwner') || sourceCode.includes('Ownable')
  };
}

function analyzeVulnerabilities(sourceCode: string, abi: any[]) {
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  // Critical vulnerabilities
  if (sourceCode.includes('selfdestruct')) critical++;
  if (sourceCode.includes('delegatecall') && !sourceCode.includes('require')) critical++;
  if (sourceCode.includes('tx.origin')) critical++;

  // High vulnerabilities  
  if (sourceCode.includes('send(') && !sourceCode.includes('require')) high++;
  if (sourceCode.includes('call.value') || sourceCode.includes('call{value:')) high++;
  if (!sourceCode.includes('ReentrancyGuard') && sourceCode.includes('external')) high++;

  // Medium vulnerabilities
  if (!sourceCode.includes('SafeMath') && sourceCode.includes('uint256')) medium++;
  if (sourceCode.includes('block.timestamp') || sourceCode.includes('now')) medium++;
  if (!sourceCode.includes('require') && sourceCode.includes('assert')) medium++;

  // Low vulnerabilities
  if (!sourceCode.includes('pragma solidity')) low++;
  if (sourceCode.includes('public') && !sourceCode.includes('view')) low++;

  return { critical, high, medium, low };
}

function analyzeQuality(sourceCode: string, abi: any[], isVerified: boolean) {
  // Code complexity
  const functionCount = abi.filter(item => item.type === 'function').length;
  const complexity = functionCount > 20 ? 'High' : functionCount > 10 ? 'Medium' : 'Low';

  // Gas optimization
  const hasOptimizations = sourceCode.includes('assembly') || 
                          sourceCode.includes('unchecked') ||
                          sourceCode.includes('calldata');
  const gasOptimization = hasOptimizations ? 'Good' : 'Fair';

  // Code quality  
  const hasComments = sourceCode.includes('//') || sourceCode.includes('/*');
  const hasEvents = sourceCode.includes('event ') || sourceCode.includes('emit ');
  const hasModifiers = sourceCode.includes('modifier ');
  
  let qualityScore = 0;
  if (hasComments) qualityScore++;
  if (hasEvents) qualityScore++;  
  if (hasModifiers) qualityScore++;
  if (isVerified) qualityScore++;

  const codeQuality = qualityScore >= 3 ? 'Good' : qualityScore >= 2 ? 'Fair' : 'Poor';

  // Security
  const hasSecurityFeatures = sourceCode.includes('require') && 
                             sourceCode.includes('modifier') &&
                             sourceCode.includes('onlyOwner');
  const security = hasSecurityFeatures ? 'Good' : 'Fair';

  return {
    complexity: complexity as 'Low' | 'Medium' | 'High',
    gasOptimization: gasOptimization as 'Poor' | 'Fair' | 'Good' | 'Excellent',
    codeQuality: codeQuality as 'Poor' | 'Fair' | 'Good' | 'Excellent',
    security: security as 'Vulnerable' | 'Weak' | 'Good' | 'Excellent'
  };
}

function calculateScore(vulnerabilities: any, features: any, analysis: any, isVerified: boolean): number {
  let score = 100;

  // Deduct for vulnerabilities
  score -= vulnerabilities.critical * 25;
  score -= vulnerabilities.high * 15;
  score -= vulnerabilities.medium * 10;
  score -= vulnerabilities.low * 5;

  // Bonus for good features
  if (features.verified) score += 10;
  if (analysis.security === 'Good') score += 10;
  if (analysis.codeQuality === 'Good') score += 5;

  return Math.max(0, Math.min(100, score));
}

function calculateGrade(score: number): string {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 65) return 'D+';
  if (score >= 60) return 'D';
  return 'F';
}

function generateRecommendations(vulnerabilities: any, features: any, analysis: any, isVerified: boolean): string[] {
  const recommendations: string[] = [];

  if (!isVerified) {
    recommendations.push("Verify the contract source code on BSCScan to increase transparency and trust.");
  }

  if (vulnerabilities.critical > 0) {
    recommendations.push("Address critical vulnerabilities immediately - these pose severe security risks.");
  }

  if (vulnerabilities.high > 0) {
    recommendations.push("Fix high-severity vulnerabilities to prevent potential exploits.");
  }

  if (!features.pausable && vulnerabilities.medium > 2) {
    recommendations.push("Consider implementing a pause mechanism for emergency situations.");
  }

  if (analysis.gasOptimization === 'Poor') {
    recommendations.push("Optimize gas usage by using more efficient code patterns and data structures.");
  }

  if (analysis.codeQuality === 'Poor') {
    recommendations.push("Improve code documentation, add events, and implement proper error handling.");
  }

  if (features.hasOwner && !features.pausable) {
    recommendations.push("Consider implementing multi-signature ownership or decentralized governance.");
  }

  return recommendations;
}
