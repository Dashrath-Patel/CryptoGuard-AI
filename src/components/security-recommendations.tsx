"use client";
import React from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { 
  IconShield, 
  IconKey, 
  IconEye, 
  IconRefresh,
  IconAlertCircle,
  IconCircleCheck
} from "@tabler/icons-react";

interface SecurityTip {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'wallet' | 'contracts' | 'general';
  icon: React.ComponentType<any>;
  completed?: boolean;
}

const securityTips: SecurityTip[] = [
  {
    id: '1',
    title: 'Use Hardware Wallet for BNB',
    description: 'Use a hardware wallet for storing large amounts of BNB and BEP-20 tokens',
    priority: 'high',
    category: 'wallet',
    icon: IconShield
  },
  {
    id: '2', 
    title: 'Review BEP-20 Token Approvals',
    description: 'Regularly check and revoke unnecessary BEP-20 token approvals on BSCScan',
    priority: 'high',
    category: 'contracts',
    icon: IconKey
  },
  {
    id: '3',
    title: 'Monitor BSC Transactions',
    description: 'Set up alerts for unusual transaction patterns on BNB Chain',
    priority: 'medium',
    category: 'wallet',
    icon: IconEye
  },
  {
    id: '4',
    title: 'Stay Updated on BSC Threats',
    description: 'Stay informed about latest BNB Chain security threats and best practices',
    priority: 'medium',
    category: 'general',
    icon: IconRefresh
  },
  {
    id: '5',
    title: 'Verify BEP-20 Contract Sources',
    description: 'Always verify BEP-20 smart contract source code on BSCScan before interacting',
    priority: 'high',
    category: 'contracts',
    icon: IconAlertCircle
  },
  {
    id: '6',
    title: 'Check PancakeSwap Liquidity Locks',
    description: 'Verify that token liquidity is locked before investing in new BEP-20 projects',
    priority: 'high',
    category: 'contracts',
    icon: IconShield
  },
  {
    id: '7',
    title: 'Use BSC Official RPCs',
    description: 'Only connect to official Binance Smart Chain RPC endpoints',
    priority: 'medium',
    category: 'general',
    icon: IconKey
  }
];

export function SecurityRecommendations() {
  const [completedTips, setCompletedTips] = React.useState<Set<string>>(new Set());

  const toggleTip = (tipId: string) => {
    setCompletedTips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tipId)) {
        newSet.delete(tipId);
      } else {
        newSet.add(tipId);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wallet': return '👛';
      case 'contracts': return '📄';
      default: return '🔒';
    }
  };

  const highPriorityCount = securityTips.filter(tip => tip.priority === 'high' && !completedTips.has(tip.id)).length;
  const completionRate = Math.round((completedTips.size / securityTips.length) * 100);

  return (
    <CardSpotlight className="h-full">
      <div className="relative z-20 h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <IconShield className="h-6 w-6 text-green-400" />
            Security Recommendations
          </h2>
          
          <div className="text-right">
            <div className="text-sm text-neutral-400">Completion Rate</div>
            <div className="text-lg font-bold text-green-400">{completionRate}%</div>
          </div>
        </div>

        {highPriorityCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <IconAlertCircle className="h-5 w-5" />
              <span className="font-medium">High Priority Actions</span>
            </div>
            <p className="text-sm text-neutral-400">
              You have {highPriorityCount} high-priority security recommendations to address.
            </p>
          </div>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {securityTips.map((tip) => {
            const isCompleted = completedTips.has(tip.id);
            const IconComponent = tip.icon;
            
            return (
              <div
                key={tip.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isCompleted 
                    ? 'bg-green-500/5 border-green-500/20 opacity-60' 
                    : getPriorityColor(tip.priority)
                }`}
                onClick={() => toggleTip(tip.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/20' : 'bg-neutral-800'}`}>
                    {isCompleted ? (
                      <IconCircleCheck className="h-5 w-5 text-green-400" />
                    ) : (
                      <IconComponent className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                        {tip.title}
                      </h3>
                      <span className="text-xs">{getCategoryIcon(tip.category)}</span>
                      {!isCompleted && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          tip.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          tip.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {tip.priority}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-sm ${isCompleted ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {tip.description}
                    </p>
                  </div>
                  
                  <button
                    className={`text-xs px-3 py-1 rounded transition-colors ${
                      isCompleted 
                        ? 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isCompleted ? 'Undo' : 'Done'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-800">
          <div className="text-sm text-neutral-400 mb-2">Security Score Progress</div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>Vulnerable</span>
            <span>Protected</span>
          </div>
        </div>
      </div>
    </CardSpotlight>
  );
}
