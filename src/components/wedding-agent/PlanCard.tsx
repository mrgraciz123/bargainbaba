import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, TrendingDown, ShoppingCart, IndianRupee } from 'lucide-react';

export interface Plan {
  tier: string;
  estimatedCost: string;
  compatibilityScore: number;
  pros: string[];
  cons: string[];
  procurementStrategy: string;
  expectedSavings: string;
}

interface PlanCardProps {
  plan: Plan;
  index: number;
  isRecommended?: boolean;
}

export default function PlanCard({ plan, index, isRecommended }: PlanCardProps) {
  const isPremium = plan.tier.toLowerCase().includes('premium');
  const isBudget = plan.tier.toLowerCase().includes('budget');

  const getThemeColors = () => {
    if (isPremium) return 'from-amber-500/10 to-orange-500/10 border-amber-500/30 dark:border-amber-500/20';
    if (isBudget) return 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 dark:border-emerald-500/20';
    return 'from-indigo-500/10 to-purple-500/10 border-indigo-500/50 dark:border-indigo-500/40 ring-2 ring-indigo-500/50';
  };

  const getHeaderIconColor = () => {
    if (isPremium) return 'text-amber-500';
    if (isBudget) return 'text-emerald-500';
    return 'text-indigo-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`relative flex flex-col bg-white/40 dark:bg-black/60 backdrop-blur-xl border rounded-3xl p-6 shadow-xl transition-all duration-300 bg-gradient-to-br ${getThemeColors()}`}
    >
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
          Recommended
        </div>
      )}

      <div className="text-center mb-6 pt-2">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">
          {plan.tier}
        </h3>
        <div className="flex justify-center items-center gap-2 mb-4">
          <IndianRupee className={`w-5 h-5 ${getHeaderIconColor()}`} />
          <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {plan.estimatedCost}
          </span>
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-black/50 rounded-full border border-gray-200 dark:border-gray-800">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Match Score:</span>
          <span className={`font-bold ${plan.compatibilityScore >= 90 ? 'text-emerald-500' : 'text-blue-500'}`}>
            {plan.compatibilityScore}%
          </span>
        </div>
      </div>

      <div className="flex-grow space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pros
          </h4>
          <ul className="space-y-2">
            {plan.pros.map((pro, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-red-500" /> Cons
          </h4>
          <ul className="space-y-2">
            {plan.cons.map((con, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-800/50 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-blue-500" /> Procurement Strategy
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/30 dark:bg-black/30 p-3 rounded-xl">
            {plan.procurementStrategy}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-500" /> Expected Savings
          </h4>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100/50 dark:border-emerald-800/30">
            {plan.expectedSavings}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
