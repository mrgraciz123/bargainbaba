import React from 'react';
import { motion } from 'framer-motion';
import { Target, MapPin, Award, BadgeCheck } from 'lucide-react';
import { categoryIcons, categoryColors } from '@/lib/vendorConfig';

// We need a helper for confidence ring
function ConfidenceRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#D4AF37' : '#EF4444';

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.4em" fill={color} fontSize={size / 4.5} fontWeight="bold">
        {score}%
      </text>
    </svg>
  );
}

function RiskBadge({ level }: { level: string }) {
  const config: any = {
    Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    High: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  };
  const c = config[level] || config.Medium;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.color} ${c.bg}`}>
      {level} Risk
    </span>
  );
}

export default function VendorRecommendations({ vendors }: { vendors: any[] }) {
  if (!vendors || vendors.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-wedding-gold animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">AI Recommended Vendor Stack</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor: any, idx: number) => {
          const catColor = categoryColors[vendor.category] || '#D4AF37';
          const catIcon = categoryIcons[vendor.category] || <Award className="w-5 h-5" />;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              className="bg-white/3 hover:bg-white/5 border border-white/8 hover:border-wedding-gold/30 rounded-2xl p-5 flex flex-col gap-4 group transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 blur-2xl rounded-full opacity-20 transition-opacity group-hover:opacity-40 pointer-events-none"
                style={{ background: catColor }} />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: catColor + '20', color: catColor }}>
                    {catIcon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{vendor.category}</span>
                </div>
                <ConfidenceRing score={vendor.confidenceScore || 82} size={44} />
              </div>

              <div>
                <h3 className="font-cinzel text-base font-extrabold text-white leading-tight">
                  {vendor.website ? (
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:text-wedding-gold hover:underline">
                      {vendor.name}
                    </a>
                  ) : vendor.name}
                </h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < Math.floor(parseFloat(vendor.rating) || 4) ? 'text-wedding-gold' : 'text-gray-700'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-wedding-gold font-bold">{vendor.rating}</span>
                  {vendor.reviewCount && (
                    <span className="text-[10px] text-gray-500">({vendor.reviewCount} reviews)</span>
                  )}
                </div>
              </div>
              
              {vendor.address && (
                <div className="flex flex-col gap-1 mt-1 mb-2">
                  <span className="text-[10px] text-gray-400 flex items-start gap-1 leading-tight">
                    <MapPin className="w-3 h-3 text-wedding-gold shrink-0 mt-0.5" /> {vendor.address}
                  </span>
                </div>
              )}

              <div className="bg-black/20 rounded-xl p-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">Est. Cost</span>
                {vendor.priceEstimate ? (
                  <span className="font-cinzel text-lg font-black" style={{ color: catColor }}>
                    ₹{Number(vendor.priceEstimate).toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-gray-500 italic">Market data unavailable</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <RiskBadge level={vendor.riskLevel || 'Low'} />
                <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-emerald-500" />
                  {vendor.trustIndicator || 'Trusted'}
                </span>
              </div>

              {vendor.reason && (
                <p className="text-[11px] text-gray-400 italic leading-relaxed border-t border-white/5 pt-3">
                  {vendor.reason}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
