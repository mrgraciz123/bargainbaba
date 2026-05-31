import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingDown, Users, Building2, Palette, Camera, UtensilsCrossed, Music } from 'lucide-react';

export default function WeddingThemes({ themes }: { themes: any[] }) {
  if (!themes || themes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-wedding-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">AI Wedding Themes</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {themes.map((theme: any, i: number) => {
          const isTop = i === 0;
          return (
            <div key={i} className={`glass-card rounded-3xl border transition-all hover:-translate-y-1 relative overflow-hidden ${isTop ? 'border-wedding-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] lg:col-span-2' : 'border-wedding-gold/15'}`}>
              {isTop && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wedding-gold to-wedding-crimson" />}
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider inline-block px-2.5 py-1 rounded-full ${isTop ? 'bg-wedding-gold text-black' : 'bg-white/10 text-gray-300'}`}>
                        {theme.tier}
                      </span>
                      {theme.badges?.map((b: string, bIdx: number) => (
                        <span key={bIdx} className="text-[10px] font-bold uppercase tracking-wider inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {b}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-cinzel text-2xl font-bold text-white mb-2">{theme.conceptName}</h3>
                    <p className="text-sm text-gray-400 italic max-w-2xl">{theme.description}</p>
                  </div>
                  <div className="shrink-0 text-left md:text-right">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Est. Cost</span>
                    <span className="font-cinzel text-xl font-bold text-wedding-gold block mb-2">{theme.estimatedCost}</span>
                    <div className="flex items-center justify-start md:justify-end gap-1 mb-2">
                      {theme.colorPalette?.map((hex: string, hx: number) => (
                        <div key={hx} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: hex }} title={hex} />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                  <div className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider"><Palette className="w-3.5 h-3.5" /> Decor</span>
                    <p className="text-sm text-gray-200">{theme.decorStyle || 'Classic'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider"><Camera className="w-3.5 h-3.5" /> Photography</span>
                    <p className="text-sm text-gray-200">{theme.photographyStyle || 'Candid'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider"><UtensilsCrossed className="w-3.5 h-3.5" /> Food</span>
                    <p className="text-sm text-gray-200">{theme.foodStyle || 'Multi-cuisine'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider"><Music className="w-3.5 h-3.5" /> Entertainment</span>
                    <p className="text-sm text-gray-200">{theme.entertainmentStyle || 'DJ & Live'}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
