'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowLeft, 
  TrendingDown, 
  Check, 
  Copy, 
  AlertTriangle,
  Users,
  MapPin,
  Wallet,
  MessageCircle,
  HelpCircle,
  Info,
  DollarSign,
  TrendingUp,
  Percent,
  Activity,
  Flame,
  Award,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { supabase, WeddingAnalysis, WeddingProject } from '@/lib/supabase';
import MarigoldPetals from '@/components/MarigoldPetals';
import confetti from 'canvas-confetti';

export default function AnalysisDetails() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const analysisId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<WeddingAnalysis | null>(null);
  const [project, setProject] = useState<WeddingProject | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // 1. Fetch analysis report details
  useEffect(() => {
    async function loadAnalysis() {
      try {
        const { data: projectData, error: projErr } = await supabase
          .from('wedding_projects')
          .select('*')
          .eq('id', analysisId)
          .single();

        if (projErr) throw projErr;
        
        if (projectData) {
          // Map to project state
          setProject({
            ...projectData,
            guest_count: projectData.guests, // Map guests to guest_count for JSX compatibility
            decor_style: projectData.ai_analysis?.metadata?.decor_style || 'Traditional Marigold',
            photography_budget: projectData.ai_analysis?.metadata?.photography_budget || 150000
          } as any);
          
          // Map to analysis state
          setAnalysis({
            id: projectData.id,
            project_id: projectData.id,
            user_id: projectData.user_id,
            created_at: projectData.created_at,
            data: projectData.ai_analysis
          });
        }
      } catch (err) {
        console.error('Failed to load analysis report details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [analysisId]);

  // 2. Celebratory confetti explosion
  useEffect(() => {
    if (!loading && searchParams.get('confetti') === 'true') {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.8 },
          colors: ['#D4AF37', '#FF8A00', '#8B1E3F', '#F5F2EB']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.8 },
          colors: ['#D4AF37', '#FF8A00', '#8B1E3F', '#F5F2EB']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [loading, searchParams]);

  // Copy to clipboard helper
  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setToastMsg('Bargaining template copied to clipboard! 📋');
    setTimeout(() => {
      setCopiedIndex(null);
      setToastMsg('');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110204] flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin glow-gold" />
        <p className="font-cinzel text-sm text-wedding-gold-light uppercase tracking-widest animate-pulse">Baba is polishing stats...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#110204] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-wedding-crimson-light animate-bounce" />
        <h2 className="font-cinzel text-2xl font-bold">Report Not Found</h2>
        <p className="text-gray-400 max-w-sm">This wedding audit analysis report does not exist or has been deleted.</p>
        <Link href="/dashboard" className="bg-wedding-gold text-black font-bold px-6 py-3 rounded-full text-xs uppercase">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Get data breakdown from AI engine
  const reportData = analysis.data;
  const totalSuggested = reportData.budgetHealth?.breakdown?.reduce((sum: number, b: any) => sum + b.suggested, 0) || 0;
  const totalPlanned = reportData.budgetHealth?.breakdown?.reduce((sum: number, b: any) => sum + b.planned, 0) || 0;
  const savings = totalPlanned - totalSuggested;

  return (
    <div className="min-h-screen bg-[#110204] text-white pb-24 relative">
      <MarigoldPetals />

      {/* Copy notification Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#110204] border border-emerald-500/40 text-emerald-400 px-6 py-3.5 rounded-full text-sm font-bold shadow-2xl shadow-emerald-500/20 flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-wedding-gold/15 bg-wedding-burgundy/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-cinzel text-xl font-black text-gold-gradient tracking-widest">
            BARGAIN<span className="text-[#FF8A00]">BABA</span>
          </Link>
          <Link 
            href="/dashboard" 
            className="text-xs md:text-sm text-wedding-gold-light hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Strategy Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 relative z-10 space-y-8">
        
        {/* Top Report header banner */}
        <div className="bg-gradient-to-r from-wedding-crimson-dark/40 via-[#2D050B]/30 to-transparent p-8 rounded-3xl border border-wedding-gold/20 glass-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4" /> AI Negotiation Master Plan
            </span>
            <h1 className="font-cinzel text-2xl md:text-3xl font-extrabold text-white">
              Squeeze Strategy for {project?.city || 'Delhi'} Wedding
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-wedding-gold" /> {project?.guest_count || 300} Guests</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-wedding-gold" /> {project?.city}</span>
              <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-wedding-gold" /> Total: ₹{project?.budget?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl md:text-right flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 min-w-[200px]">
            <div>
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Optimized AI Savings</span>
              <span className="block font-cinzel text-xl md:text-2xl font-black text-emerald-400">₹{savings.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Secure 20% Budget Cut
            </span>
          </div>
        </div>

        {/* 1. Budget Health Analysis Row */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left panel: Dial/Score & descriptive card */}
          <div className="glass-card rounded-3xl border border-wedding-gold/15 p-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest block mb-4">Budget Health Status</span>
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                {/* SVG circular progress bar */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="62" strokeWidth="8" stroke="rgba(212,175,55,0.06)" fill="transparent" />
                  <circle cx="72" cy="72" r="62" strokeWidth="8" stroke="#D4AF37" strokeDasharray={2 * Math.PI * 62} strokeDashoffset={2 * Math.PI * 62 * (1 - (reportData.budgetHealth?.percentage || 70) / 100)} fill="transparent" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-cinzel text-3xl font-black text-gold-gradient">{reportData.budgetHealth?.percentage || 70}%</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Health Index</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block text-xs font-bold bg-wedding-crimson/50 text-wedding-gold px-3 py-0.5 rounded-full border border-wedding-gold/25">
                {reportData.budgetHealth?.status || 'Moderately Bloated'}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                "{reportData.budgetHealth?.label}"
              </p>
            </div>
          </div>

          {/* Right panel: Planned vs Suggested categories (Col span 2) */}
          <div className="md:col-span-2 glass-card rounded-3xl border border-wedding-gold/15 p-6 space-y-4">
            <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest block">Audit Breakdown</span>
            
            <div className="space-y-4">
              {reportData.budgetHealth?.breakdown?.map((item: any, idx: number) => {
                const isSaving = item.planned > item.suggested;
                const savingsPct = item.planned > 0 ? Math.round(((item.planned - item.suggested) / item.planned) * 100) : 0;

                return (
                  <div key={idx} className="space-y-1.5 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500' : 'bg-emerald-500'}`} /> {item.category}
                      </span>
                      <span className="text-gray-400">
                        Planned: <strong className="text-white">₹{item.planned.toLocaleString('en-IN')}</strong> | Suggested: <strong className="text-emerald-400">₹{item.suggested.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Comparison visual progress bar */}
                      <div className="h-2 bg-white/5 rounded-full flex-grow relative overflow-hidden">
                        <div className="h-full bg-wedding-crimson/40 absolute left-0" style={{ width: '100%' }} />
                        <div className="h-full bg-emerald-500 absolute left-0 transition-all duration-1000" style={{ width: `${(item.suggested / item.planned) * 100}%` }} />
                      </div>
                      {isSaving && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                          Squeeze {savingsPct}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Vendor Overpricing Detection & Flags */}
        <div className="space-y-4">
          <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
            <Percent className="w-5 h-5 text-wedding-gold" /> Vendor Overpricing Detection
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {reportData.vendorOverpricing?.map((vendor: any, idx: number) => {
              const isCritical = vendor.flag === 'Critical';
              const isModerate = vendor.flag === 'Moderate';

              return (
                <div 
                  key={idx} 
                  className={`glass-card rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between ${isCritical ? 'border-wedding-crimson-light/40 bg-[#2D050B]/20' : isModerate ? 'border-amber-500/30' : 'border-emerald-500/30'}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-cinzel text-base font-extrabold text-white">{vendor.vendor}</h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${isCritical ? 'bg-wedding-crimson-light/20 text-wedding-crimson-light border-wedding-crimson-light/30 animate-pulse' : isModerate ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        {vendor.flag} overprice
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-3 rounded-xl text-center">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Vendor Quote</span>
                        <span className="text-sm font-bold text-white">₹{vendor.charge.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-widest">BargainBaba Target</span>
                        <span className="text-sm font-bold text-emerald-400">₹{vendor.marketRate.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-light">
                      <strong>Baba Strategy:</strong> {vendor.advice}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Target Discount</span>
                    <span className="text-emerald-400 text-sm font-black">-{vendor.overpricePercent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Smart Savings Suggestions */}
        <div className="space-y-4">
          <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-wedding-gold" /> Smart Savings Suggestions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {reportData.savingsSuggestions?.map((sug: any, idx: number) => (
              <div 
                key={idx} 
                className="glass-card rounded-2xl border border-wedding-gold/15 p-6 space-y-4 hover:border-wedding-gold/30 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${sug.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : sug.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25' : 'bg-wedding-crimson/30 text-wedding-gold-light border border-wedding-gold/25'}`}>
                      {sug.difficulty} Squeeze
                    </span>
                    <span className="text-xs font-black text-emerald-400">+ ₹{sug.amount.toLocaleString('en-IN')} Saved</span>
                  </div>

                  <h3 className="font-cinzel text-base font-extrabold text-white">{sug.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{sug.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Emotional Bargaining Messages (Hinglish copy-paste) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-wedding-gold" /> Emotional Bargaining WhatsApp Templates
            </h2>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-wedding-crimson/30 border border-wedding-gold/20 px-3 py-1 rounded-full">
              Copy & Melt Vendors 😭
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reportData.bargainingMessages?.map((msg: any, idx: number) => {
              const isCopied = copiedIndex === idx;

              return (
                <div 
                  key={idx} 
                  className="glass-card rounded-2xl border border-wedding-gold/15 p-5 flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-wedding-gold tracking-wider">Leverage Card</span>
                        <span className="text-xs font-black text-white">{msg.guiltLevel}</span>
                      </div>
                      <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                        {msg.vendorType}
                      </span>
                    </div>

                    <div className="bg-[#2D050B]/30 border border-wedding-gold/10 p-3.5 rounded-xl min-h-[140px] max-h-[160px] overflow-y-auto">
                      <p className="text-[12px] italic text-wedding-gold-light leading-relaxed">
                        "{msg.message}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyText(msg.message, idx)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${isCopied ? 'bg-emerald-500 text-black' : 'bg-wedding-crimson hover:bg-wedding-crimson-light text-white border border-wedding-gold/20'}`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Template
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy WhatsApp Template
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Relative Drama Prediction & gossips */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left panel: Drama levels (Col span 2) */}
          <div className="md:col-span-2 glass-card rounded-3xl border border-wedding-gold/15 p-6 space-y-5">
            <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest block">Relative Drama Predictor</span>
            
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Mama Ji Sofa Complaining</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-cinzel text-xl md:text-2xl font-black text-orange-400">{reportData.dramaPrediction?.mamaJiDrama || 87}%</span>
                  <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider">Ultra High</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-orange-400" style={{ width: `${reportData.dramaPrediction?.mamaJiDrama || 87}%` }} />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Paneer Shortage argument</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-cinzel text-xl md:text-2xl font-black text-rose-500">{reportData.dramaPrediction?.paneerShortageRisk || 92}%</span>
                  <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">Critical</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${reportData.dramaPrediction?.paneerShortageRisk || 92}%` }} />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">DJ Police Curfew conflict</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-cinzel text-xl md:text-2xl font-black text-yellow-400">{reportData.dramaPrediction?.djConflictRisk || 70}%</span>
                  <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-wider">Moderate</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${reportData.dramaPrediction?.djConflictRisk || 70}%` }} />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Shagun argument threshold</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-cinzel text-xl md:text-2xl font-black text-indigo-400">{reportData.dramaPrediction?.shagunArgumentRisk || 45}%</span>
                  <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Low Risk</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${reportData.dramaPrediction?.shagunArgumentRisk || 45}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Right panel: Gossip / Quotes */}
          <div className="glass-card rounded-3xl border border-wedding-gold/15 p-6 flex flex-col justify-between bg-wedding-burgundy/40">
            <div>
              <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest block mb-4">Relative Gossip Intercepts</span>
              
              <div className="space-y-4">
                {reportData.dramaPrediction?.relativeQuotes?.map((quote: string, idx: number) => (
                  <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 relative">
                    <p className="text-[11px] italic text-gray-300 font-light leading-relaxed">
                      "{quote}"
                    </p>
                    <div className="absolute -left-1 top-4 w-2.5 h-2.5 bg-[#1C0407] border-l border-b border-white/10 rotate-45" />
                  </div>
                ))}
              </div>
            </div>

            <span className="text-[9px] uppercase tracking-widest font-black text-wedding-crimson-light text-center block mt-4 border-t border-white/5 pt-3">
              Containment rate: 98%
            </span>
          </div>

        </div>

        {/* 6 & 7. Wedding Risk Score & AI Wedding Strategy */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Risk Factors (Col span 1) */}
          <div className="glass-card rounded-3xl border border-wedding-gold/15 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest block mb-4">Baba's Chaos Risk Score</span>
              
              <div className="text-center mb-6">
                <span className="block font-cinzel text-5xl font-black text-wedding-crimson-light glow-text-gold">{reportData.riskScore || 72}%</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mt-1">Total Chaos probability</span>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Key Risk Factors</span>
                {reportData.riskFactors?.map((factor: string, idx: number) => (
                  <div key={idx} className="flex gap-2 items-start text-xs text-gray-300 font-light leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-wedding-gold shrink-0 mt-0.5 animate-pulse" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Wedding Master Plan Strategy (Col span 2) */}
          <div className="md:col-span-2 glass-card rounded-3xl border border-wedding-gold/15 p-6 space-y-4">
            <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest block">AI Wedding Strategy Master Plan</span>
            
            <div className="space-y-4">
              {reportData.strategy?.map((step: string, idx: number) => (
                <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-wedding-gold text-black flex items-center justify-center font-cinzel font-black text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-light">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 border-t border-white/5">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-wedding-crimson hover:bg-wedding-crimson-light text-white font-bold text-xs uppercase px-8 py-4 rounded-full border border-wedding-gold/25 text-center"
          >
            Back to Dashboard
          </Link>

          <Link
            href="/dashboard/analyze"
            className="w-full sm:w-auto bg-wedding-gold hover:bg-wedding-gold-bright text-black font-bold text-xs uppercase px-8 py-4 rounded-full text-center flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3px]" /> Audit Another Wedding
          </Link>
        </div>

      </main>
    </div>
  );
}
