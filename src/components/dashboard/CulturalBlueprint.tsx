import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, BookOpen, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function CulturalBlueprint({ blueprint, profile }: { blueprint: any, profile: any }) {
  if (!blueprint || (!blueprint.requiredRituals && !blueprint.optionalRituals)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-wedding-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">Cultural Blueprint</span>
      </div>

      <div className="glass-card rounded-3xl border border-wedding-gold/20 p-6 md:p-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Tradition Focus</span>
          <h3 className="font-cinzel text-2xl font-bold text-white">
            {profile?.religion} {profile?.community ? `(${profile.community})` : ''} Wedding
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {blueprint.requiredRituals?.length > 0 && (
              <div>
                <span className="text-xs font-bold text-wedding-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4" /> Required Rituals
                </span>
                <div className="flex flex-wrap gap-2">
                  {blueprint.requiredRituals.map((r: string, i: number) => (
                    <span key={i} className="text-xs text-white bg-wedding-gold/10 border border-wedding-gold/20 px-3 py-1.5 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {blueprint.optionalRituals?.length > 0 && (
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Optional Rituals
                </span>
                <div className="flex flex-wrap gap-2">
                  {blueprint.optionalRituals.map((r: string, i: number) => (
                    <span key={i} className="text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {blueprint.culturalRecommendations?.length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Cultural Recommendations
                </span>
                <ul className="space-y-2">
                  {blueprint.culturalRecommendations.map((req: string, i: number) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {blueprint.prohibitedItems?.length > 0 && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Prohibited Items / Taboos
                </span>
                <ul className="space-y-2">
                  {blueprint.prohibitedItems.map((req: string, i: number) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5">✕</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {blueprint.specialRequirements?.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Special Requirements
                </span>
                <ul className="space-y-2">
                  {blueprint.specialRequirements.map((req: string, i: number) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
