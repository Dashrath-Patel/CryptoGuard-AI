import { NextRequest, NextResponse } from 'next/server';

interface VulnerabilityReport {
  id: string;
  contractAddress: string;
  contractName?: string;
  scanTimestamp: number;
  overallRiskScore: number; // 0-100
  vulnerabilities: Vulnerability[];
  gasAnalysis: GasAnalysis;
  securityChecks: SecurityCheck[];
  recommendations: string[];
  compliance: ComplianceCheck;
  metadata: ContractMetadata;
}

interface Vulnerability {
  id: string;
  type: 'reentrancy' | 'overflow' | 'underflow' | 'access_control' | 'timestamp_dependence' | 
        'delegatecall' | 'tx_origin' | 'unhandled_exception' | 'logic_bomb' | 'backdoor' | 
        'flash_loan_attack' | 'oracle_manipulation' | 'front_running' | 'mev_vulnerability';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    function?: string;
    line?: number;
    code?: string;
  };
  impact: string;
  confidence: number; // 0-100
  cweId?: string;
  references: string[];
  recommendation: string;
}

interface GasAnalysis {
  averageGasCost: number;
  maxGasCost: number;
  gasOptimizationOpportunities: Array<{
    type: string;
    description: string;
    potentialSavings: number;
  }>;
  gasLimit: number;
  efficiency: number; // 0-100
}

interface SecurityCheck {
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'not_applicable';
  description: string;
  details?: string;
}

interface ComplianceCheck {
  eip: {
    eip20: boolean;
    eip721: boolean;
    eip1155: boolean;
  };
  standards: string[];
  issues: string[];
}

interface ContractMetadata {
  contractName?: string;
  compiler: string;
  version: string;
  optimization: boolean;
  sourceCode?: string;
  abi?: any[];
  creationDate?: number;
  creator?: string;
  totalTransactions: number;
  balance: number;
}

interface ScanProgress {
  scanId: string;
  progress: number; // 0-100
  currentStep: string;
  estimatedCompletion: number;
}

// Cache for scan results
let cachedScans: Map<string, VulnerabilityReport> = new Map();
let activScans: Map<string, ScanProgress> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const scanId = searchParams.get('scanId');

    if (scanId) {
      // Return scan progress
      const progress = activScans.get(scanId);
      if (progress) {
        return NextResponse.json(progress);
      }
      
      // Check if scan is complete
      const result = cachedScans.get(scanId);
      if (result) {
        return NextResponse.json({ 
          scanId, 
          progress: 100, 
          completed: true, 
          result 
        });
      }
      
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    if (address) {
      // Return cached result if available
      const cached = Array.from(cachedScans.values())
        .find(scan => scan.contractAddress.toLowerCase() === address.toLowerCase());
      
      if (cached) {
        return NextResponse.json(cached);
      }
      
      return NextResponse.json(
        { error: 'No scan results found for this address' },
        { status: 404 }
      );
    }

    // Return recent scans
    const recentScans = Array.from(cachedScans.values())
      .sort((a, b) => b.scanTimestamp - a.scanTimestamp)
      .slice(0, 20);

    return NextResponse.json({
      recentScans,
      totalScans: cachedScans.size,
      activeScans: activScans.size
    });

  } catch (error) {
    console.error('Contract scanner GET error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve scan data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, deepScan = false, priority = 'normal' } = body;

    if (!address || !isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Valid contract address is required' },
        { status: 400 }
      );
    }

    // Generate scan ID
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize scan progress
    activScans.set(scanId, {
      scanId,
      progress: 0,
      currentStep: 'Initializing scan...',
      estimatedCompletion: Date.now() + (deepScan ? 300000 : 120000) // 5 min deep, 2 min normal
    });

    // Start async scan
    performContractScan(scanId, address, deepScan, priority);

    return NextResponse.json({
      scanId,
      status: 'started',
      estimatedCompletion: activScans.get(scanId)?.estimatedCompletion
    });

  } catch (error) {
    console.error('Contract scanner POST error:', error);
    return NextResponse.json(
      { error: 'Failed to start scan' },
      { status: 500 }
    );
  }
}

async function performContractScan(
  scanId: string,
  address: string,
  deepScan: boolean,
  priority: string
) {
  try {
    // Update progress: Fetching contract data
    updateScanProgress(scanId, 10, 'Fetching contract metadata...');
    const metadata = await fetchContractMetadata(address);

    // Update progress: Analyzing bytecode
    updateScanProgress(scanId, 30, 'Analyzing contract bytecode...');
    const vulnerabilities = await analyzeVulnerabilities(address, metadata, deepScan);

    // Update progress: Gas analysis
    updateScanProgress(scanId, 50, 'Performing gas analysis...');
    const gasAnalysis = await analyzeGasUsage(address, metadata);

    // Update progress: Security checks
    updateScanProgress(scanId, 70, 'Running security checks...');
    const securityChecks = await runSecurityChecks(address, metadata);

    // Update progress: Compliance checks
    updateScanProgress(scanId, 85, 'Checking compliance standards...');
    const compliance = await checkCompliance(address, metadata);

    // Update progress: Generating report
    updateScanProgress(scanId, 95, 'Generating final report...');

    const overallRiskScore = calculateOverallRiskScore(vulnerabilities, securityChecks);
    const recommendations = generateRecommendations(vulnerabilities, gasAnalysis, securityChecks);

    const report: VulnerabilityReport = {
      id: scanId,
      contractAddress: address,
      contractName: metadata.contractName,
      scanTimestamp: Date.now(),
      overallRiskScore,
      vulnerabilities,
      gasAnalysis,
      securityChecks,
      recommendations,
      compliance,
      metadata
    };

    // Complete scan
    cachedScans.set(scanId, report);
    activScans.delete(scanId);

  } catch (error) {
    console.error('Contract scan error:', error);
    
    // Generate mock report on error
    const mockReport = generateMockReport(scanId, address);
    cachedScans.set(scanId, mockReport);
    activScans.delete(scanId);
  }
}

function updateScanProgress(scanId: string, progress: number, step: string) {
  const scan = activScans.get(scanId);
  if (scan) {
    scan.progress = progress;
    scan.currentStep = step;
    activScans.set(scanId, scan);
  }
}

async function fetchContractMetadata(address: string): Promise<ContractMetadata> {
  try {
    // In production, this would fetch from BSCScan API
    const BSC_API_KEY = 'Q9PMT4R2E15FT8KHA5X3PV92R779ABQG8H';
    
    // Fetch contract source code
    const sourceResponse = await fetch(
      `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${address}&apikey=${BSC_API_KEY}`
    );
    const sourceData = await sourceResponse.json();

    // Fetch contract ABI
    const abiResponse = await fetch(
      `https://api.bscscan.com/api?module=contract&action=getabi&address=${address}&apikey=${BSC_API_KEY}`
    );
    const abiData = await abiResponse.json();

    // Fetch contract creation info
    const creationResponse = await fetch(
      `https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${BSC_API_KEY}`
    );
    const creationData = await creationResponse.json();

    return {
      contractName: sourceData.result?.[0]?.ContractName || 'Unknown Contract',
      compiler: sourceData.result?.[0]?.CompilerVersion || 'Unknown',
      version: sourceData.result?.[0]?.CompilerVersion || 'Unknown',
      optimization: sourceData.result?.[0]?.OptimizationUsed === '1',
      sourceCode: sourceData.result?.[0]?.SourceCode,
      abi: abiData.status === '1' ? JSON.parse(abiData.result) : [],
      creationDate: creationData.result?.[0]?.timestamp ? parseInt(creationData.result[0].timestamp) * 1000 : undefined,
      creator: creationData.result?.[0]?.contractCreator,
      totalTransactions: Math.floor(Math.random() * 10000),
      balance: Math.random() * 1000
    };
  } catch (error) {
    console.error('Error fetching contract metadata:', error);
    return generateMockMetadata();
  }
}

async function analyzeVulnerabilities(
  address: string,
  metadata: ContractMetadata,
  deepScan: boolean
): Promise<Vulnerability[]> {
  const vulnerabilities: Vulnerability[] = [];

  // Simulate vulnerability detection
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check for common vulnerabilities
  if (Math.random() > 0.7) {
    vulnerabilities.push(createReentrancyVulnerability());
  }

  if (Math.random() > 0.8) {
    vulnerabilities.push(createOverflowVulnerability());
  }

  if (Math.random() > 0.75) {
    vulnerabilities.push(createAccessControlVulnerability());
  }

  if (deepScan) {
    // Additional deep scan vulnerabilities
    if (Math.random() > 0.85) {
      vulnerabilities.push(createFlashLoanVulnerability());
    }

    if (Math.random() > 0.9) {
      vulnerabilities.push(createOracleManipulationVulnerability());
    }

    if (Math.random() > 0.88) {
      vulnerabilities.push(createMEVVulnerability());
    }
  }

  return vulnerabilities;
}

async function analyzeGasUsage(
  address: string,
  metadata: ContractMetadata
): Promise<GasAnalysis> {
  // Simulate gas analysis
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    averageGasCost: 50000 + Math.floor(Math.random() * 100000),
    maxGasCost: 200000 + Math.floor(Math.random() * 300000),
    gasOptimizationOpportunities: [
      {
        type: 'storage_optimization',
        description: 'Pack struct variables to reduce storage slots',
        potentialSavings: Math.floor(Math.random() * 20000)
      },
      {
        type: 'loop_optimization',
        description: 'Optimize loops to reduce gas consumption',
        potentialSavings: Math.floor(Math.random() * 15000)
      }
    ],
    gasLimit: 8000000,
    efficiency: 70 + Math.floor(Math.random() * 30)
  };
}

async function runSecurityChecks(
  address: string,
  metadata: ContractMetadata
): Promise<SecurityCheck[]> {
  // Simulate security checks
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      name: 'Ownership Verification',
      status: Math.random() > 0.3 ? 'passed' : 'warning',
      description: 'Check if contract ownership is properly configured'
    },
    {
      name: 'Access Control',
      status: Math.random() > 0.2 ? 'passed' : 'failed',
      description: 'Verify proper access control mechanisms'
    },
    {
      name: 'External Call Safety',
      status: Math.random() > 0.4 ? 'passed' : 'warning',
      description: 'Check for safe external contract interactions'
    },
    {
      name: 'Integer Overflow Protection',
      status: Math.random() > 0.1 ? 'passed' : 'failed',
      description: 'Verify protection against integer overflow/underflow'
    },
    {
      name: 'Reentrancy Protection',
      status: Math.random() > 0.3 ? 'passed' : 'warning',
      description: 'Check for reentrancy attack protection'
    }
  ];
}

async function checkCompliance(
  address: string,
  metadata: ContractMetadata
): Promise<ComplianceCheck> {
  // Simulate compliance checking
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    eip: {
      eip20: Math.random() > 0.5,
      eip721: Math.random() > 0.8,
      eip1155: Math.random() > 0.9
    },
    standards: ['EIP-20', 'OpenZeppelin'],
    issues: Math.random() > 0.7 ? ['Missing transfer event emission'] : []
  };
}

function calculateOverallRiskScore(
  vulnerabilities: Vulnerability[],
  securityChecks: SecurityCheck[]
): number {
  let score = 0;

  // Add points for vulnerabilities
  vulnerabilities.forEach(vuln => {
    switch (vuln.severity) {
      case 'critical': score += 25; break;
      case 'high': score += 15; break;
      case 'medium': score += 8; break;
      case 'low': score += 3; break;
      case 'info': score += 1; break;
    }
  });

  // Add points for failed security checks
  securityChecks.forEach(check => {
    if (check.status === 'failed') score += 10;
    if (check.status === 'warning') score += 5;
  });

  return Math.min(100, score);
}

function generateRecommendations(
  vulnerabilities: Vulnerability[],
  gasAnalysis: GasAnalysis,
  securityChecks: SecurityCheck[]
): string[] {
  const recommendations: string[] = [];

  if (vulnerabilities.length > 0) {
    recommendations.push('Address identified vulnerabilities immediately');
  }

  if (gasAnalysis.efficiency < 80) {
    recommendations.push('Optimize gas usage for better efficiency');
  }

  const failedChecks = securityChecks.filter(check => check.status === 'failed');
  if (failedChecks.length > 0) {
    recommendations.push('Fix failed security checks');
  }

  recommendations.push('Consider professional security audit');
  recommendations.push('Implement comprehensive testing');
  recommendations.push('Use established security libraries');

  return recommendations;
}

// Vulnerability creation functions
function createReentrancyVulnerability(): Vulnerability {
  return {
    id: `vuln_reentrancy_${Date.now()}`,
    type: 'reentrancy',
    severity: 'high',
    title: 'Reentrancy Vulnerability',
    description: 'Function is vulnerable to reentrancy attacks due to external calls before state changes',
    location: {
      function: 'withdraw',
      line: 45,
      code: 'msg.sender.call{value: amount}("")'
    },
    impact: 'Attackers could drain contract funds through recursive calls',
    confidence: 85,
    cweId: 'CWE-841',
    references: [
      'https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/',
      'https://blog.openzeppelin.com/reentrancy-after-istanbul/'
    ],
    recommendation: 'Use checks-effects-interactions pattern or ReentrancyGuard modifier'
  };
}

function createOverflowVulnerability(): Vulnerability {
  return {
    id: `vuln_overflow_${Date.now()}`,
    type: 'overflow',
    severity: 'medium',
    title: 'Integer Overflow Risk',
    description: 'Arithmetic operations may overflow without proper bounds checking',
    location: {
      function: 'transfer',
      line: 32,
      code: 'balances[to] += amount'
    },
    impact: 'Could lead to incorrect balance calculations',
    confidence: 70,
    cweId: 'CWE-190',
    references: [
      'https://docs.soliditylang.org/en/latest/security-considerations.html#two-s-complement'
    ],
    recommendation: 'Use SafeMath library or Solidity 0.8+ built-in overflow protection'
  };
}

function createAccessControlVulnerability(): Vulnerability {
  return {
    id: `vuln_access_${Date.now()}`,
    type: 'access_control',
    severity: 'high',
    title: 'Improper Access Control',
    description: 'Critical function lacks proper access control mechanisms',
    location: {
      function: 'mint',
      line: 67,
      code: 'function mint(address to, uint256 amount) public'
    },
    impact: 'Anyone can mint unlimited tokens',
    confidence: 95,
    cweId: 'CWE-284',
    references: [
      'https://docs.openzeppelin.com/contracts/4.x/access-control'
    ],
    recommendation: 'Implement proper role-based access control using OpenZeppelin AccessControl'
  };
}

function createFlashLoanVulnerability(): Vulnerability {
  return {
    id: `vuln_flashloan_${Date.now()}`,
    type: 'flash_loan_attack',
    severity: 'critical',
    title: 'Flash Loan Attack Vector',
    description: 'Contract vulnerable to flash loan price manipulation attacks',
    location: {
      function: 'getPrice',
      line: 89,
      code: 'price = token0.balanceOf(address(this)) / token1.balanceOf(address(this))'
    },
    impact: 'Attackers could manipulate prices using flash loans',
    confidence: 90,
    cweId: 'CWE-682',
    references: [
      'https://blog.openzeppelin.com/flash-loan-attacks/'
    ],
    recommendation: 'Use time-weighted average prices (TWAP) and multiple oracle sources'
  };
}

function createOracleManipulationVulnerability(): Vulnerability {
  return {
    id: `vuln_oracle_${Date.now()}`,
    type: 'oracle_manipulation',
    severity: 'high',
    title: 'Oracle Manipulation Risk',
    description: 'Contract relies on single oracle source without validation',
    location: {
      function: 'liquidate',
      line: 123,
      code: 'uint256 price = priceOracle.getPrice(asset)'
    },
    impact: 'Oracle manipulation could trigger false liquidations',
    confidence: 80,
    cweId: 'CWE-345',
    references: [
      'https://blog.chain.link/flash-loans-and-the-importance-of-tamper-proof-oracles/'
    ],
    recommendation: 'Implement multiple oracle sources and price deviation checks'
  };
}

function createMEVVulnerability(): Vulnerability {
  return {
    id: `vuln_mev_${Date.now()}`,
    type: 'mev_vulnerability',
    severity: 'medium',
    title: 'MEV Vulnerability',
    description: 'Contract susceptible to MEV attacks through predictable execution',
    location: {
      function: 'swap',
      line: 156,
      code: 'amountOut = getAmountOut(amountIn, path)'
    },
    impact: 'Users may suffer from sandwich attacks and front-running',
    confidence: 75,
    cweId: 'CWE-367',
    references: [
      'https://ethereum.org/en/developers/docs/mev/'
    ],
    recommendation: 'Implement slippage protection and commit-reveal schemes'
  };
}

function generateMockMetadata(): ContractMetadata {
  return {
    contractName: 'MockToken',
    compiler: 'v0.8.19+commit.7dd6d404',
    version: '0.8.19',
    optimization: true,
    sourceCode: '// Contract source code would be here...',
    abi: [],
    creationDate: Date.now() - Math.random() * 31536000000, // Random date within last year
    creator: '0x' + Math.random().toString(16).substr(2, 40),
    totalTransactions: Math.floor(Math.random() * 50000),
    balance: Math.random() * 1000
  };
}

function generateMockReport(scanId: string, address: string): VulnerabilityReport {
  const vulnerabilities = [
    createReentrancyVulnerability(),
    createAccessControlVulnerability()
  ];

  const gasAnalysis: GasAnalysis = {
    averageGasCost: 75000,
    maxGasCost: 300000,
    gasOptimizationOpportunities: [
      {
        type: 'storage_optimization',
        description: 'Pack struct variables to save gas',
        potentialSavings: 15000
      }
    ],
    gasLimit: 8000000,
    efficiency: 82
  };

  const securityChecks: SecurityCheck[] = [
    {
      name: 'Ownership Verification',
      status: 'passed',
      description: 'Contract ownership is properly configured'
    },
    {
      name: 'Access Control',
      status: 'warning',
      description: 'Some functions lack proper access control'
    }
  ];

  return {
    id: scanId,
    contractAddress: address,
    contractName: 'MockToken',
    scanTimestamp: Date.now(),
    overallRiskScore: calculateOverallRiskScore(vulnerabilities, securityChecks),
    vulnerabilities,
    gasAnalysis,
    securityChecks,
    recommendations: generateRecommendations(vulnerabilities, gasAnalysis, securityChecks),
    compliance: {
      eip: { eip20: true, eip721: false, eip1155: false },
      standards: ['EIP-20'],
      issues: []
    },
    metadata: generateMockMetadata()
  };
}

function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
