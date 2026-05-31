'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Brain,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  ShieldX
} from 'lucide-react';
import { supabase, WeddingAnalysis, WeddingProject } from '@/lib/supabase';
import MarigoldPetals from '@/components/MarigoldPetals';
import confetti from 'canvas-confetti';

// Import New Modular Components
import JudgeWowFeatures from '@/components/dashboard/JudgeWowFeatures';
import WeddingThemes from '@/components/dashboard/WeddingThemes';
import ThemeComparison from '@/components/dashboard/ThemeComparison';
import WeddingDeliverables from '@/components/dashboard/WeddingDeliverables';
import CulturalBlueprint from '@/components/dashboard/CulturalBlueprint';
import WeddingTimeline from '@/components/dashboard/WeddingTimeline';
import VendorRecommendations from '@/components/dashboard/VendorRecommendations';
import NegotiationIntelligence from '@/components/dashboard/NegotiationIntelligence';
import BudgetAllocation from '@/components/dashboard/BudgetAllocation';
import MarketIntelligence from '@/components/dashboard/MarketIntelligence';

// ─── Animated Counter ──────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1500 }: {
  value: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{prefix}{display.toLocaleString('en-IN')}{suffix}</>;
}

// ─── Risk Badge ─────────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: string }) {
  const config = {
    Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: <ShieldCheck className="w-3 h-3" /> },
    Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: <ShieldAlert className="w-3 h-3" /> },
    High: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', icon: <ShieldX className="w-3 h-3" /> },
  };
  const c = config[level as keyof typeof config] || config.Medium;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.color} ${c.bg}`}>
      {c.icon} {level}
    </span>
  );
}

// ─── Procurement Score Ring ─────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const size = 120;
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <svg width={size} height={size}>
      <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
      <circle
        cx={60} cy={60} r={r} fill="none"
        stroke="url(#scoreGrad)" strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)' }}
      />
      <defs>
        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ProcurementDashboard() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const analysisId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<WeddingAnalysis | null>(null);
  const [project, setProject] = useState<WeddingProject | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const { data: projectData, error: projErr } = await supabase
          .from('wedding_projects').select('*').eq('id', analysisId).single();
        if (projErr) throw projErr;
        if (projectData) {
          setProject(projectData as any);
          setAnalysis({
            id: projectData.id, project_id: projectData.id,
            user_id: projectData.user_id, created_at: projectData.created_at,
            data: projectData.ai_analysis,
          });
        }
      } catch (err) {
        console.error('Failed to load procurement report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [analysisId]);

  useEffect(() => {
    if (!loading && searchParams.get('confetti') === 'true') {
      const end = Date.now() + 2500;
      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 65, origin: { x: 0, y: 0.8 }, colors: ['#D4AF37', '#10B981', '#8B1E3F', '#FF8A00'] });
        confetti({ particleCount: 5, angle: 120, spread: 65, origin: { x: 1, y: 0.8 }, colors: ['#D4AF37', '#10B981', '#8B1E3F', '#FF8A00'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    }
  }, [loading, searchParams]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setToastMsg('Negotiation script copied! 📋');
    setTimeout(() => { setCopiedIndex(null); setToastMsg(''); }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110204] flex items-center justify-center flex-col gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-wedding-gold/20 animate-ping opacity-50" />
          <div className="absolute inset-2 rounded-full border-2 border-wedding-gold border-t-transparent animate-spin" />
          <div className="absolute inset-4 rounded-full bg-wedding-gold/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-wedding-gold animate-pulse" />
          </div>
        </div>
        <p className="font-cinzel text-sm text-wedding-gold uppercase tracking-widest animate-pulse">Loading Blueprint...</p>
      </div>
    );
  }

  if (!analysis || !analysis.data) {
    return (
      <div className="min-h-screen bg-[#110204] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-wedding-crimson-light animate-bounce" />
        <h2 className="font-cinzel text-2xl font-bold">Blueprint Not Found</h2>
        <Link href="/dashboard" className="bg-wedding-gold text-black font-bold px-6 py-3 rounded-full text-xs uppercase">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const d = analysis.data;
  
  const recLen = d.recommendedVendors?.length || 0;
  const poolLen = d.vendorPool?.length || 0;
  const vendors = recLen > 0 ? d.recommendedVendors : poolLen > 0 ? d.vendorPool : [];

  const summary = d.procurementSummary || {};
  summary.totalVendorsAnalyzed = vendors.length;

  const allocation = d.budgetAllocation || [];
  const negotiation = d.negotiationIntelligence || [];
  const heatmap = d.pricingHeatmap || [];
  const insights = d.marketInsights || [];

  const procScore = summary.procurementScore || 78;
  const totalOptimized = summary.optimizedCost || allocation.reduce((a: number, c: any) => a + (c.allocatedAmount || 0), 0);
  const marketCost = summary.marketCost || Math.round(totalOptimized * 1.17);
  const savings = summary.estimatedSavingsOpportunity || (marketCost - totalOptimized);
  const budgetRemaining = summary.budgetRemaining || ((project?.budget || 0) - totalOptimized);
  const riskLevel = summary.riskLevel || 'Medium';

  return (
    <div className="min-h-screen bg-[#110204] text-white pb-24 relative overflow-x-hidden">
      <MarigoldPetals />

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0D0204] border border-emerald-500/40 text-emerald-400 px-6 py-3.5 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-wedding-gold/15 bg-wedding-burgundy/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-cinzel text-xl font-black text-gold-gradient tracking-widest">
            BARGAIN<span className="text-[#FF8A00]">BABA</span>{' '}
            <span className="font-sans text-xs bg-wedding-crimson/50 text-wedding-gold px-2 py-0.5 rounded-full border border-wedding-gold/20 ml-1">AI Architect</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Blueprint
            </span>
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 relative z-10 space-y-12">

        {/* AI Judge / Wow Features */}
        <JudgeWowFeatures judgeFeatures={d.judgeFeatures} />

        {/* Wedding Themes */}
        <WeddingThemes themes={d.weddingConcepts} />
        
        {/* Theme Comparison */}
        <ThemeComparison themes={d.weddingConcepts} />

        {/* Cultural Blueprint */}
        <CulturalBlueprint blueprint={d.culturalBlueprint} profile={d.religionProfile} />

        {/* Wedding Deliverables */}
        <WeddingDeliverables deliverables={d.weddingDeliverables} />

        {/* Wedding Timeline */}
        <WeddingTimeline timeline={d.weddingTimeline} />

        {/* Procurement Summary (Inline) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-wedding-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">AI Procurement Summary</span>
          </div>

          <div className="glass-card rounded-3xl border border-wedding-gold/20 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wedding-crimson via-wedding-gold to-wedding-crimson-light" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <div className="relative">
                  <ScoreRing score={procScore} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-cinzel text-2xl font-black text-gold-gradient">{procScore}</span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Score</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-wedding-gold mt-2">Procurement Score</span>
              </div>
              <div className="hidden md:block md:col-span-1 w-px h-24 bg-wedding-gold/10 mx-auto" />
              <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Potential Savings</span>
                  <span className="font-cinzel text-xl font-black text-emerald-400">
                    <AnimatedNumber value={savings} prefix="₹" />
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400/80">
                    <TrendingDown className="w-3 h-3" /> vs market rate
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Vendors Analyzed</span>
                  <span className="font-cinzel text-xl font-black text-white">
                    <AnimatedNumber value={vendors.length} />
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <BarChart3 className="w-3 h-3" /> total sourced
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Risk Level</span>
                  <RiskBadge level={riskLevel} />
                </div>
              </div>
            </div>
            {/* Budget Bar */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget Utilization</span>
                <span className="text-xs font-bold text-wedding-gold">{Math.round(summary.budgetUtilization || (totalOptimized / (project?.budget || 1) * 100))}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.round(summary.budgetUtilization || (totalOptimized / (project?.budget || 1) * 100)))}%` }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-wedding-gold to-wedding-gold-bright"
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1.5">
                <span>₹0</span>
                <span className="text-wedding-gold font-bold">Optimized: ₹{totalOptimized.toLocaleString('en-IN')}</span>
                <span>₹{(project?.budget || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vendor Recommendations */}
        <VendorRecommendations vendors={vendors} />

        {/* Negotiation Intelligence */}
        <NegotiationIntelligence negotiation={negotiation} handleCopy={handleCopy} copiedIndex={copiedIndex} />

        {/* Budget Allocation */}
        <BudgetAllocation allocation={allocation} />

        {/* Market Intelligence */}
        <MarketIntelligence heatmap={heatmap} insights={insights} />

      </main>
    </div>
  );
}
