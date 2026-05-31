import React from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, Palette, Camera, UtensilsCrossed, Music, Crown, Gift, Mail } from 'lucide-react';

export default function WeddingDeliverables({ deliverables }: { deliverables: any[] }) {
  if (!deliverables || deliverables.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-wedding-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">Wedding Deliverables Blueprint</span>
      </div>

      <div className="grid gap-6">
        {deliverables.map((deliv: any, i: number) => (
          <div key={i} className="glass-card rounded-3xl border border-wedding-gold/20 p-6 md:p-8">
            <h3 className="font-cinzel text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              Theme: <span className="text-wedding-gold">{deliv.themeName}</span>
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Venue Concept
                </span>
                <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">{deliv.venueConcept}</p>
              </div>

              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-purple-400" /> Decoration Plan
                </span>
                <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">{deliv.decorationPlan}</p>
              </div>

              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Camera className="w-4 h-4 text-blue-400" /> Photography Plan
                </span>
                <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">{deliv.photographyPlan}</p>
              </div>

              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <UtensilsCrossed className="w-4 h-4 text-orange-400" /> Food Experience
                </span>
                <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">{deliv.foodExperience}</p>
              </div>

              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Music className="w-4 h-4 text-pink-400" /> Entertainment
                </span>
                <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">{deliv.entertainmentExperience}</p>
              </div>

              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-wedding-gold" /> Bride Entry Concept
                </span>
                <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">{deliv.brideEntryConcept}</p>
              </div>
              
              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Gift className="w-4 h-4 text-rose-400" /> Return Gifts
                </span>
                <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">{deliv.returnGiftIdeas}</p>
              </div>

              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-teal-400" /> Invitation Style
                </span>
                <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">{deliv.invitationStyle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
