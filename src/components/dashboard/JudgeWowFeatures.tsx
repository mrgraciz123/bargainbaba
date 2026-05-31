import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Heart, Diamond, Palette, Hash } from 'lucide-react';

export default function JudgeWowFeatures({ judgeFeatures }: { judgeFeatures: any }) {
  if (!judgeFeatures) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Diamond className="w-4 h-4 text-wedding-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">AI Wedding Architect Intelligence</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card rounded-2xl border border-wedding-gold/20 p-4 text-center">
          <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2" />
          <div className="font-cinzel text-2xl font-bold text-white">{judgeFeatures.aiCompatibilityScore}%</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">AI Compatibility</div>
        </div>
        <div className="glass-card rounded-2xl border border-wedding-gold/20 p-4 text-center">
          <Star className="w-5 h-5 text-wedding-gold mx-auto mb-2" />
          <div className="font-cinzel text-2xl font-bold text-wedding-gold">{judgeFeatures.luxuryIndex}/100</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Luxury Index</div>
        </div>
        <div className="glass-card rounded-2xl border border-wedding-gold/20 p-4 text-center">
          <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <div className="font-cinzel text-xl font-bold text-white truncate px-2" title={judgeFeatures.trendAnalysis}>
            Trending
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Trend Analysis</div>
        </div>
        <div className="glass-card rounded-2xl border border-wedding-gold/20 p-4 text-center">
          <Palette className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <div className="font-cinzel text-2xl font-bold text-white">{judgeFeatures.culturalAuthenticityScore}%</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Cultural Match</div>
        </div>
        <div className="glass-card rounded-2xl border border-wedding-gold/20 p-4 text-center">
          <Hash className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-white flex flex-col gap-1 mt-1">
            {judgeFeatures.weddingHashtags?.slice(0, 2).map((tag: string, i: number) => (
              <span key={i} className="truncate">{tag}</span>
            ))}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Hashtags</div>
        </div>
      </div>
    </motion.div>
  );
}
