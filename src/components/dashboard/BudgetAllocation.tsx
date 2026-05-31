import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PIE_COLORS = ['#D4AF37', '#10B981', '#FF8A00', '#8B5CF6', '#EC4899', '#6366F1'];

export default function BudgetAllocation({ allocation }: { allocation: any[] }) {
  if (!allocation || allocation.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-4 h-4 text-wedding-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">AI Budget Allocation</span>
      </div>

      <div className="glass-card rounded-3xl border border-wedding-gold/20 p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocation}
                  cx="50%" cy="50%"
                  innerRadius={80} outerRadius={110}
                  paddingAngle={2} dataKey="allocatedAmount"
                  stroke="none"
                >
                  {allocation.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `₹${Number(value || 0).toLocaleString('en-IN')}`}
                  contentStyle={{ backgroundColor: '#110204', borderColor: 'rgba(212,175,55,0.2)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <PieChartIcon className="w-6 h-6 text-wedding-gold/50 mb-1" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Distribution</span>
            </div>
          </div>

          <div className="space-y-3">
            {allocation.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-wedding-gold/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="text-sm font-bold text-gray-200">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-cinzel font-bold text-white">₹{item.allocatedAmount.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-gray-500">{item.percentage}% of budget</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
