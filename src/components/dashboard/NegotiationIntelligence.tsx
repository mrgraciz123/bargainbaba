import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp, Copy, ShieldCheck } from 'lucide-react';

export default function NegotiationIntelligence({ negotiation, handleCopy, copiedIndex }: { negotiation: any[], handleCopy: any, copiedIndex: number | null }) {
  const [expandedNeg, setExpandedNeg] = useState<number | null>(0);

  if (!negotiation || negotiation.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-wedding-gold" />
          <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">Negotiation Intelligence</span>
        </div>
      </div>

      <div className="space-y-3">
        {negotiation.map((neg: any, idx: number) => {
          const isOpen = expandedNeg === idx;
          return (
            <div key={idx} className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-wedding-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/5 hover:border-white/10'}`}>
              <button
                onClick={() => setExpandedNeg(isOpen ? null : idx)}
                className="w-full p-5 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-wedding-gold/10 border border-wedding-gold/20 flex items-center justify-center font-cinzel font-bold text-wedding-gold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{neg.vendorName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{neg.vendorCategory}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[10px] text-emerald-400 font-bold tracking-wider">
                        Target Discount: {neg.expectedDiscountPercent}% (₹{neg.expectedSavings?.toLocaleString('en-IN') || 0})
                      </span>
                    </div>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5"
                  >
                    <div className="p-5 md:p-6 bg-black/20 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Best Timing</span>
                          <p className="text-sm text-gray-200 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                            {neg.bestTimingToNegotiate}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <span className="text-[10px] font-bold text-wedding-gold uppercase tracking-wider mb-2 block">AI Generated Negotiation Script</span>
                        <div className="relative bg-[#0D0204] rounded-xl border border-wedding-gold/20 p-5 group">
                          <div className="absolute top-0 left-0 w-1 h-full bg-wedding-gold rounded-l-xl" />
                          <p className="text-sm text-gray-300 italic font-medium leading-relaxed pr-10">
                            "{neg.negotiationScript}"
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(neg.negotiationScript, idx); }}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
                            title="Copy script"
                          >
                            {copiedIndex === idx ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
