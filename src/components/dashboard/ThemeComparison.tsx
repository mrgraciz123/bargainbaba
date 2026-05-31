import React from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

export default function ThemeComparison({ themes }: { themes: any[] }) {
  if (!themes || themes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="space-y-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <List className="w-4 h-4 text-wedding-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">Theme Comparison</span>
      </div>

      <div className="glass-card rounded-3xl border border-wedding-gold/20 p-6 md:p-8 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-4">Theme Name</th>
              <th className="py-3 px-4">Badges</th>
              <th className="py-3 px-4 text-right">Est. Cost</th>
              <th className="py-3 px-4 text-center">Luxury</th>
              <th className="py-3 px-4 text-center">Trending</th>
              <th className="py-3 px-4 text-center">Cultural Match</th>
            </tr>
          </thead>
          <tbody>
            {themes.map((theme: any, idx: number) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-bold text-white text-sm">{theme.conceptName}</td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    {theme.badges?.map((b: string, i: number) => (
                      <span key={i} className="text-[9px] bg-wedding-gold/10 text-wedding-gold px-2 py-0.5 rounded-full border border-wedding-gold/20 w-fit">
                        {b}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 font-cinzel text-wedding-gold text-right font-bold">{theme.estimatedCost}</td>
                <td className="py-4 px-4 text-center text-sm font-bold text-gray-200">{theme.luxuryScore}/100</td>
                <td className="py-4 px-4 text-center text-sm font-bold text-gray-200">{theme.trendScore}/100</td>
                <td className="py-4 px-4 text-center text-sm font-bold text-gray-200">
                  <span className={theme.culturalCompatibility >= 90 ? 'text-emerald-400' : 'text-amber-400'}>
                    {theme.culturalCompatibility}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
