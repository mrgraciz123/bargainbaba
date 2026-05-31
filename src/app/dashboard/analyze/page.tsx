'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Users,
  MapPin,
  Maximize,
  CheckCircle,
  Check,
  Star,
  Zap,
  Target,
  Building2,
  Camera,
  UtensilsCrossed,
  Palette,
  HeartHandshake,
  Music,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MarigoldPetals from '@/components/MarigoldPetals';

const cities = [
  'Delhi NCR', 'Lucknow', 'Mumbai', 'Bengaluru', 'Jaipur', 'Udaipur',
  'Kolkata', 'Ahmedabad', 'Patna', 'Dehradun', 'Goa', 'Hyderabad', 'Chennai', 'Pune'
];



const availableServices = [
  { id: 'venues', label: 'Venues & Banquet Halls', icon: Building2, description: 'Lawns, hotels, heritage palaces' },
  { id: 'caterers', label: 'Catering Services', icon: UtensilsCrossed, description: 'Per plate pricing, live counters' },
  { id: 'photographers', label: 'Photography & Cinema', icon: Camera, description: 'Pre-wedding, ceremony, reception' },
  { id: 'decorators', label: 'Decorators & Florists', icon: Palette, description: 'Floral, LED, thematic setups' },
  { id: 'makeup', label: 'Bridal Makeup Artists', icon: HeartHandshake, description: 'Airbrush, HD, traditional' },
];

const availablePriorities = [
  { id: 'premium_photography', label: 'Premium Photography', icon: Camera },
  { id: 'quality_food', label: 'Quality Food & Catering', icon: UtensilsCrossed },
  { id: 'budget_venue', label: 'Budget-Friendly Venue', icon: Building2 },
  { id: 'luxury_decor', label: 'Luxury Decoration', icon: Palette },
  { id: 'bridal_makeup', label: 'Top Bridal Makeup', icon: HeartHandshake },
  { id: 'entertainment', label: 'Entertainment & DJ', icon: Music },
  { id: 'savings_first', label: 'Maximum Savings', icon: DollarSign },
  { id: 'vendor_quality', label: 'Highest Vendor Quality', icon: Star },
];

// AI Processing stages
const processingStages = [
  { id: 1, label: 'Searching Vendors Online...', sublabel: 'Scanning WedMeGood, JustDial & directories', icon: '🔍' },
  { id: 2, label: 'Analyzing Reviews & Ratings...', sublabel: 'Processing vendor reputation signals', icon: '⭐' },
  { id: 3, label: 'Comparing Market Pricing...', sublabel: 'Detecting overcharging patterns', icon: '📊' },
  { id: 4, label: 'Optimizing Budget Allocation...', sublabel: 'Building best vendor combination', icon: '💡' },
  { id: 5, label: 'Building Procurement Strategy...', sublabel: 'Generating negotiation intelligence', icon: '🎯' },
];

export default function SourcingFormPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);

  // Form inputs
  const [budget, setBudget] = useState('1500000');
  const [guestCount, setGuestCount] = useState('300');
  const [city, setCity] = useState('Delhi NCR');
  const [religion, setReligion] = useState('Hindu');
  const [community, setCommunity] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['venues', 'photographers', 'caterers']);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['quality_food', 'premium_photography']);
  const [email, setEmail] = useState('');



  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      const session = res?.data?.session;
      if (!session) router.push('/auth');
      else setUser(session.user);
    });
  }, [router]);

  // Progressive stage animation during loading
  useEffect(() => {
    if (!loading) return;
    setCurrentStage(0);
    setCompletedStages([]);

    const timings = [0, 2800, 5600, 8400, 11200];
    const timers: NodeJS.Timeout[] = [];

    timings.forEach((delay, i) => {
      timers.push(setTimeout(() => {
        setCurrentStage(i);
        if (i > 0) setCompletedStages(prev => [...prev, i - 1]);
      }, delay));
    });

    setTimeLeft(15);
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(1, prev - 1));
    }, 1000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [loading]);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const togglePriority = (id: string) => {
    setSelectedPriorities(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (selectedServices.length === 0) {
      alert('Please select at least one vendor service to source.');
      return;
    }

    setLoading(true);

    try {
      const priorityLabels = selectedPriorities.map(id =>
        availablePriorities.find(p => p.id === id)?.label || id
      );

      const payload = {
        budget: Number(budget),
        guestCount: Number(guestCount),
        city,
        requiredServices: selectedServices,
        priorities: priorityLabels,
        religion,
        community,
        email: email.trim() || undefined,
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errMsg = 'Procurement engine returned an error';
        try {
          const errData = await response.json();
          if (errData.error) errMsg = errData.error;
        } catch {}
        throw new Error(errMsg);
      }

      const apiResult = await response.json();

      const enrichedAnalysis = {
        ...apiResult,
        metadata: {
          services: selectedServices,
          priorities: priorityLabels,
          city,
          budget: Number(budget),
          guestCount: Number(guestCount),
          religion,
          community,
        },
      };

      // === START SUPABASE SAVE TRACE ===
      console.log("SUPABASE SAVE PAYLOAD", JSON.stringify(enrichedAnalysis, null, 2));
      console.log("SAVE recommendedVendors", enrichedAnalysis.recommendedVendors?.length || 0);
      console.log("SAVE vendorPool", enrichedAnalysis.vendorPool?.length || 0);
      // === END SUPABASE SAVE TRACE ===

      const { data: projData, error: projErr } = await supabase
        .from('wedding_projects')
        .insert({
          user_id: user.id,
          budget: Number(budget),
          guests: Number(guestCount),
          city,
          wedding_type: 'AI Recommended Concepts',
          religion,
          community,
          venue_type: 'Auto-Sourced',
          catering: 'Auto-Sourced',
          ai_analysis: enrichedAnalysis,
        })
        .select();

      if (projErr) {
        console.error('Supabase Insert Error:', {
          table: 'wedding_projects',
          failedFields: Object.keys(projErr),
          errorDetails: projErr.message || projErr,
          hint: projErr.hint || 'Check for missing columns like catering or venue_type.'
        });
        throw new Error('Database schema mismatch detected. Please run the provided SQL migration.');
      }

      const createdProject = projData?.[0];
      const projectId = createdProject?.id || Math.random().toString(36).substring(2, 15);

      // === START POST SAVE VERIFICATION ===
      if (createdProject?.id) {
        const { data: verifyData } = await supabase
          .from("wedding_projects")
          .select("ai_analysis")
          .eq("id", createdProject.id)
          .single();

        console.log("POST SAVE recommendedVendors", verifyData?.ai_analysis?.recommendedVendors?.length || 0);
        console.log("POST SAVE vendorPool", verifyData?.ai_analysis?.vendorPool?.length || 0);
      }
      // === END POST SAVE VERIFICATION ===

      router.push(`/dashboard/analysis/${projectId}?confetti=true`);
    } catch (err: any) {
      console.error('Procurement engine error:', err);
      alert('Error: ' + err.message);
      setLoading(false);
      setCurrentStage(0);
      setCompletedStages([]);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const budgetFormatted = Number(budget).toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-[#110204] text-white pb-20 relative overflow-hidden">
      <MarigoldPetals />

      {/* ============ AI PROCESSING OVERLAY ============ */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-[15px] flex items-center justify-center p-6"
          >
            <div className="relative w-full max-w-md bg-[#110204] border border-wedding-gold/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
              {/* Top Progress Bar */}
              <div className="h-1.5 w-full bg-white/5 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-wedding-gold to-emerald-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(100, (currentStage / processingStages.length) * 100 + 15)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="p-8 text-center flex flex-col items-center">
                {/* Central AI orb */}
                <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-wedding-gold/20 animate-ping opacity-40" style={{ animationDuration: '2.5s' }} />
                  <div className="absolute inset-2 rounded-full border border-dashed border-wedding-gold/50 animate-spin" style={{ animationDuration: '10s' }} />
                  <div className="absolute inset-5 rounded-full bg-gradient-to-br from-wedding-gold via-[#AA7C11] to-wedding-crimson flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  </div>
                </div>

                <h2 className="font-cinzel text-xl font-bold text-white mb-2">
                  AI Consultant Analyzing
                </h2>
                <div className="text-sm text-gray-400 mb-8 font-medium">
                  {Math.round((currentStage / processingStages.length) * 100 + 15)}% Complete
                </div>

                {/* Active Step Indicator (Only One at a Time) */}
                <div className="w-full h-[80px] flex items-center justify-center relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStage}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-wedding-gold/10 border border-wedding-gold/30 flex items-center justify-center text-xl mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                        <span className="animate-pulse">{processingStages[Math.min(currentStage, processingStages.length - 1)]?.icon}</span>
                      </div>
                      <p className="text-sm font-bold text-wedding-gold">
                        {processingStages[Math.min(currentStage, processingStages.length - 1)]?.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {processingStages[Math.min(currentStage, processingStages.length - 1)]?.sublabel}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Estimated Time */}
                <div className="mt-8 pt-6 border-t border-white/5 w-full">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    Estimated time remaining: {timeLeft}s
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-40 border-b border-wedding-gold/15 bg-wedding-burgundy/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-cinzel text-xl font-black text-gold-gradient tracking-widest">
              BARGAIN<span className="text-[#FF8A00]">BABA</span>
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* ============ MAIN FORM ============ */}
      <main className="max-w-2xl mx-auto px-6 pt-12 relative z-10">

        {/* Progress Steps */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-0 mb-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-400 ${
                  step > s
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : step === s
                    ? 'bg-wedding-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-white/8 text-gray-500 border border-white/10'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-0.5 transition-all duration-500 ${step > s ? 'bg-emerald-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-widest text-wedding-gold block">
              Step {step} of 3
            </span>
            <span className="text-gray-400 text-sm">
              {step === 1 && 'Wedding Parameters'}
              {step === 2 && 'Required Vendor Services'}
              {step === 3 && 'Procurement Priorities'}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-3xl border border-wedding-gold/25 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wedding-crimson via-wedding-gold to-wedding-crimson-light" />

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ====== STEP 1: CORE PARAMETERS ====== */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-wedding-gold/10 border border-wedding-gold/25 flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-wedding-gold" />
                    </div>
                    <h2 className="font-cinzel text-xl font-bold text-white">Wedding Parameters</h2>
                    <p className="text-xs text-gray-400 mt-1">Tell the AI what you need. Be specific for better results.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-wedding-gold" /> Total Budget (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="e.g. 1500000"
                        className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold/50 transition-all"
                      />
                      {budget && (
                        <p className="text-xs text-wedding-gold/70 font-medium">
                          ₹{Number(budget).toLocaleString('en-IN')} INR
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-wedding-gold" /> Guest Count
                      </label>
                      <input
                        type="number"
                        required
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        placeholder="e.g. 300"
                        className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5 mt-5 mb-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider flex items-center gap-1.5">
                        <HeartHandshake className="w-3.5 h-3.5 text-wedding-gold" /> Religion
                      </label>
                      <select
                        value={religion}
                        onChange={(e) => setReligion(e.target.value)}
                        className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                      >
                        {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Interfaith'].map((r) => (
                          <option key={r} value={r} className="bg-[#2D050B] text-white">{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-wedding-gold" /> Community (Optional)
                      </label>
                      <input
                        type="text"
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        placeholder="e.g. Punjabi, Marwari, Syrian Christian"
                        className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-wedding-gold" /> Search City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                      >
                        {cities.map((c) => (
                          <option key={c} value={c} className="bg-[#2D050B] text-white">{c}</option>
                        ))}
                      </select>
                    </div>


                  </div>

                  {/* Summary preview */}
                  <div className="bg-wedding-gold/5 border border-wedding-gold/15 rounded-2xl p-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-wedding-gold shrink-0 animate-pulse" />
                    <p className="text-xs text-gray-300 leading-relaxed">
                      The AI will search for the best <strong className="text-wedding-gold">{selectedServices.length} vendor categories</strong> in{' '}
                      <strong className="text-wedding-gold">{city}</strong> within a budget of{' '}
                      <strong className="text-wedding-gold">₹{budgetFormatted}</strong> for{' '}
                      <strong className="text-wedding-gold">{guestCount} guests</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* ====== STEP 2: VENDOR SERVICES ====== */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-wedding-gold/10 border border-wedding-gold/25 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-wedding-gold" />
                    </div>
                    <h2 className="font-cinzel text-xl font-bold text-white">Vendor Categories</h2>
                    <p className="text-xs text-gray-400 mt-1">Select what the AI should source for your wedding.</p>
                  </div>

                  <div className="space-y-3">
                    {availableServices.map((service) => {
                      const isSelected = selectedServices.includes(service.id);
                      const Icon = service.icon;
                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`cursor-pointer border p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${
                            isSelected
                              ? 'bg-wedding-gold/10 border-wedding-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.12)]'
                              : 'bg-white/3 border-white/8 hover:border-wedding-gold/25 hover:bg-white/6'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? 'bg-wedding-gold text-black' : 'bg-white/5 text-gray-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm font-bold block ${isSelected ? 'text-wedding-gold' : 'text-gray-300'}`}>
                              {service.label}
                            </span>
                            <span className="text-xs text-gray-500">{service.description}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-wedding-gold border-wedding-gold' : 'border-white/20'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-black" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-white/3 border border-white/8 p-4 rounded-2xl flex gap-3">
                    <CheckCircle className="w-5 h-5 text-wedding-gold/60 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <strong className="text-wedding-gold">{selectedServices.length} categor{selectedServices.length !== 1 ? 'ies' : 'y'} selected.</strong>{' '}
                      The AI will crawl public listings in <strong className="text-white">{city}</strong> and build an optimized procurement plan within ₹{budgetFormatted}.
                    </p>
                  </div>
                </div>
              )}

              {/* ====== STEP 3: PRIORITIES ====== */}
              {step === 3 && (
                <>
                  <div className="space-y-5">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-wedding-gold/10 border border-wedding-gold/25 flex items-center justify-center mx-auto mb-4">
                        <Star className="w-6 h-6 text-wedding-gold" />
                      </div>
                      <h2 className="font-cinzel text-xl font-bold text-white">Procurement Priorities</h2>
                      <p className="text-xs text-gray-400 mt-1">What matters most? The AI will weight recommendations accordingly.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {availablePriorities.map((priority) => {
                        const isSelected = selectedPriorities.includes(priority.id);
                        const Icon = priority.icon;
                        return (
                          <div
                            key={priority.id}
                            onClick={() => togglePriority(priority.id)}
                            className={`cursor-pointer border p-3.5 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                              isSelected
                                ? 'bg-wedding-crimson/15 border-wedding-crimson/50 shadow-[0_0_15px_rgba(139,30,63,0.15)]'
                                : 'bg-white/3 border-white/8 hover:border-wedding-gold/20 hover:bg-white/5'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-wedding-crimson/30 text-wedding-gold' : 'bg-white/5 text-gray-500'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-wedding-gold-light' : 'text-gray-400'}`}>
                              {priority.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Final confirmation card */}
                    <div className="bg-gradient-to-r from-wedding-gold/8 to-wedding-crimson/8 border border-wedding-gold/20 p-5 rounded-2xl space-y-2 mt-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-wedding-gold animate-pulse" />
                        <span className="text-xs font-bold text-wedding-gold uppercase tracking-wider">Procurement Summary</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <span className="text-gray-400">City:</span>
                        <span className="text-white font-semibold">{city}</span>
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-wedding-gold font-bold">₹{budgetFormatted}</span>
                        <span className="text-gray-400">Guests:</span>
                        <span className="text-white font-semibold">{guestCount}</span>
                        <span className="text-gray-400">Religion:</span>
                        <span className="text-white font-semibold">{religion} {community ? `(${community})` : ''}</span>
                        <span className="text-gray-400">Services:</span>
                        <span className="text-white font-semibold">{selectedServices.length} categories</span>
                        <span className="text-gray-400">Priorities:</span>
                        <span className="text-white font-semibold">{selectedPriorities.length} selected</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Email Report (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to receive the PDF Blueprint"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-wedding-gold/50 transition-colors"
                    />
                    <p className="text-[10px] text-gray-500 mt-2">
                      If provided, BargainBaba AI will email you a beautiful PDF copy of the Executive Summary.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="glass-card text-wedding-gold border border-wedding-gold/30 px-5 py-3 rounded-xl text-xs font-bold hover:bg-wedding-gold/10 transition-colors uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="relative group overflow-hidden bg-gradient-to-r from-wedding-gold to-wedding-gold-bright text-black font-bold px-7 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:shadow-wedding-gold/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {step < 3 ? (
                    <>Next Step <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Run AI Procurement Agent
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
