import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MarketIntelligence({ heatmap, insights }: { heatmap: any[], insights: any[] }) {
  if ((!heatmap || heatmap.length === 0) && (!insights || insights.length === 0)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-wedding-gold" />
          <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">Market Intelligence</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {heatmap.length > 0 && (
          <div className="glass-card rounded-3xl border border-wedding-gold/20 p-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-6">Price Distribution Heatmap</span>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmap} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} width={80} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#110204', borderColor: 'rgba(212,175,55,0.2)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="low" stackId="a" fill="#10B981" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="average" stackId="a" fill="#D4AF37" />
                  <Bar dataKey="high" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {insights.length > 0 && (
          <div className="glass-card rounded-3xl border border-wedding-gold/20 p-6 space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Live Market Insights</span>
            {insights.map((insight: any, idx: number) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="text-sm font-bold text-white block mb-1">{insight.trend}</span>
                <p className="text-xs text-gray-400 leading-relaxed">{insight.impact}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
