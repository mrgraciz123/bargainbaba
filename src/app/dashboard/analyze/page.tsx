'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  TrendingDown,
  Info,
  DollarSign,
  Users,
  MapPin,
  Camera,
  Utensils,
  Maximize,
  Smile,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MarigoldPetals from '@/components/MarigoldPetals';

const cities = [
  'Delhi NCR', 'Lucknow', 'Mumbai', 'Bengaluru', 'Jaipur', 'Udaipur', 'Kolkata', 'Ahmedabad', 'Patna', 'Dehradun', 'Goa'
];

const weddingTypes = [
  'Grand Royal Palace Wedding', 'Modern Minimalist Glass Wedding', 'Big Fat Punjabi Dhol Wedding', 'Traditional South Indian Feast', 'Royal Marwari Heritage Wedding'
];

const venueTypes = [
  'Premium AC Lawn / Farmhouse', '5-Star Luxury Hotel Hall', 'Heritage Palace Resort', 'Standard Banquet Hall', 'Local Community Center'
];

const decorStyles = [
  'Exotic Imported Orchid Theme', 'Palace Royale Gold Theme', 'Traditional Marigold (Genda) & Warm LED', 'Modernist Neon Light Glass', 'Minimalist Rustic Greens'
];

const cateringPrefs = [
  'Premium Royal Multi-Cuisine Buffet', '5-Star Plated Service', 'Traditional Pure Veg Sit-Down Feast', 'Standard Unlimited Buffet', 'Basic Traditional Spread'
];

const loadingTexts = [
  "Negotiating with decorators...",
  "Detecting overpriced vendors...",
  "Calculating emotional blackmail potential...",
  "Predicting mama ji dissatisfaction...",
  "Negotiating with local flower cart distributors...",
  "Auditing standard caterer plate-marker scams...",
  "Comparing paneer cube volumes against Indian Standard Code...",
  "Calculating emotional blackmail impact indexes...",
  "Estimating probability of Phupha Ji valet parking outrage...",
  "Evaluating Mama Ji stage sofa complaint margins...",
  "Scanning Delhi farmhouses for hidden service tax margins...",
  "Generating Hinglish WhatsApp messages under 'Daughter's Dream' leverage...",
  "Consulting Baba's secret guide to maternal uncle shagun bribes...",
  "Finalizing financial squeeze ratios..."
];

export default function AnalyzePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Steps state: 1, 2, 3
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loaderIndex, setLoaderIndex] = useState(0);

  // Form inputs
  const [budget, setBudget] = useState('1500000');
  const [guestCount, setGuestCount] = useState('300');
  const [city, setCity] = useState('Delhi NCR');
  const [weddingType, setWeddingType] = useState('Grand Royal Palace Wedding');
  const [venueType, setVenueType] = useState('Premium AC Lawn / Farmhouse');
  const [decorStyle, setDecorStyle] = useState('Traditional Marigold (Genda) & Warm LED');
  const [cateringPref, setCateringPref] = useState('Premium Royal Multi-Cuisine Buffet');
  const [photographyBudget, setPhotographyBudget] = useState('150000');

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      const session = res?.data?.session;
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
      }
    });
  }, [router]);

  // Loading text rotational interval
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoaderIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setLoaderIndex(0);

    try {
      const payload = {
        budget: Number(budget),
        guestCount: Number(guestCount),
        city,
        weddingType,
        venueType,
        decorStyle,
        cateringPref,
        photographyBudget: Number(photographyBudget)
      };

      // 1. Fire analysis API request to Next.js route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const apiResult = await response.json();

      // 2. Insert wedding project directly in wedding_projects table
      const enrichedAnalysis = {
        ...apiResult,
        metadata: {
          decor_style: decorStyle,
          photography_budget: Number(photographyBudget)
        }
      };

      const { data: projData, error: projErr } = await supabase
        .from('wedding_projects')
        .insert({
          user_id: user.id,
          budget: Number(budget),
          guests: Number(guestCount),
          city,
          wedding_type: weddingType,
          venue_type: venueType,
          catering: cateringPref,
          ai_analysis: enrichedAnalysis
        });

      if (projErr) throw projErr;

      const createdProject = projData?.[0];
      const projectId = createdProject?.id || Math.random().toString(36).substring(2, 15);

      // 3. Navigate directly to details report page using the wedding project ID
      router.push(`/dashboard/analysis/${projectId}?confetti=true`);

    } catch (err) {
      console.error('Failed to run wedding analysis:', err);
      alert('Could not connect to OpenRouter API. Please make sure the server is fully running.');
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#110204] text-white pb-20 relative">
      <MarigoldPetals />

      {/* API Loading Overlay Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#060001]/97 z-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden"
          >
            {/* Cinematic Background Blur Blobs */}
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-wedding-crimson/10 blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-wedding-gold/5 blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Glowing Vortex Container */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Cinematic pulsing vortex loader */}
              <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
                {/* Glowing neon aura rings */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-wedding-crimson to-wedding-gold opacity-10 blur-xl animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-wedding-gold/20 animate-ping opacity-40" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full border-4 border-double border-wedding-crimson animate-pulse opacity-50" />
                <div className="absolute inset-6 rounded-full border border-dashed border-wedding-gold/60 animate-spin" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-wedding-crimson via-[#8B1E3F] to-[#FF8A00] flex items-center justify-center shadow-[0_0_50px_rgba(139,30,63,0.6)] glow-gold">
                  <Sparkles className="w-11 h-11 text-white animate-bounce" />
                </div>
              </div>

              <h3 className="font-cinzel text-xl md:text-2xl font-black text-gold-gradient tracking-widest uppercase mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                Baba is Negotiating...
              </h3>

              {/* Rotating loader text block */}
              <div className="min-h-[70px] max-w-md px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl backdrop-blur-md shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loaderIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-sm md:text-base italic text-wedding-gold-light leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  >
                    "{loadingTexts[loaderIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-12 text-xs text-gray-500 max-w-xs leading-relaxed">
                Baba AI is scanning dealer margins, estimating Phupha Ji dissatisfaction thresholds, and structuring copy-paste guilt messages.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-wedding-gold/15 bg-wedding-burgundy/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-cinzel text-xl font-black text-gold-gradient tracking-widest">
              BARGAIN<span className="text-[#FF8A00]">BABA</span>
            </span>
          </Link>
          <Link 
            href="/dashboard" 
            className="text-xs md:text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12 relative z-10">
        
        {/* Progress steps bar */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-between max-w-xs mx-auto mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? 'bg-wedding-gold text-black shadow-md shadow-wedding-gold/25' : 'bg-wedding-burgundy/60 text-gray-500 border border-white/10'}`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 ${step > s ? 'bg-wedding-gold' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-wedding-gold">
            Step {step} of 3: {step === 1 ? 'Core Parameters' : step === 2 ? 'Venue & Theme Styling' : 'Catering & Photography'}
          </span>
        </div>

        {/* Wizard Multi-Step Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl border border-wedding-gold/25 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wedding-crimson via-wedding-gold to-wedding-crimson-light" />

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Core parameters */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="font-cinzel text-xl font-bold text-white">Enter Core Shaadi Details</h2>
                  <p className="text-xs text-gray-400 mt-1">Feed the baseline numbers to BargainBaba's budget model.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-wedding-gold" /> Total Wedding Budget (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 1500000"
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-wedding-gold" /> Guest Count (Heads)
                    </label>
                    <input
                      type="number"
                      required
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="e.g. 300"
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-wedding-gold" /> City of Wedding
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c} className="bg-wedding-burgundy text-white">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5 text-wedding-gold" /> Wedding Style / Type
                    </label>
                    <select
                      value={weddingType}
                      onChange={(e) => setWeddingType(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                    >
                      {weddingTypes.map((t) => (
                        <option key={t} value={t} className="bg-wedding-burgundy text-white">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-wedding-crimson/10 border border-wedding-gold/15 p-4 rounded-2xl flex gap-3 mt-6">
                  <Info className="w-5 h-5 text-wedding-gold shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <strong>Baba Tip:</strong> Setting a realistic budget and guest count enables the model to accurately estimate regional plate budgets and flag overcharging vendors.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Venue & Styling */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="font-cinzel text-xl font-bold text-white">Select Venue & Themes</h2>
                  <p className="text-xs text-gray-400 mt-1">Specify your dream setup. Baba will inspect if they are charging overpriced flower premiums.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block">Venue Category</label>
                    <select
                      value={venueType}
                      onChange={(e) => setVenueType(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                    >
                      {venueTypes.map((v) => (
                        <option key={v} value={v} className="bg-wedding-burgundy text-white">{v}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block">Decoration Styling Preference</label>
                    <select
                      value={decorStyle}
                      onChange={(e) => setDecorStyle(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                    >
                      {decorStyles.map((d) => (
                        <option key={d} value={d} className="bg-wedding-burgundy text-white">{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-wedding-crimson/10 border border-wedding-gold/15 p-4 rounded-2xl flex gap-3 mt-6">
                  <Info className="w-5 h-5 text-wedding-gold shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <strong>Baba Tip:</strong> Vendor decorators routinely mark up floral designs by 80% under the pretext of 'foreign orchids'. We will prepare alternative local styling guides.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Catering & Cinema */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="font-cinzel text-xl font-bold text-white">Catering & Media Specifications</h2>
                  <p className="text-xs text-gray-400 mt-1">Plate charges and movie cameras take up the maximum margins. Let's audit them.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-wedding-gold" /> Catering Menu Style
                    </label>
                    <select
                      value={cateringPref}
                      onChange={(e) => setCateringPref(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                    >
                      {cateringPrefs.map((c) => (
                        <option key={c} value={c} className="bg-wedding-burgundy text-white">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-wedding-gold" /> Photography Budget (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={photographyBudget}
                      onChange={(e) => setPhotographyBudget(e.target.value)}
                      placeholder="e.g. 150000"
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold transition-all"
                    />
                  </div>
                </div>

                <div className="bg-wedding-crimson/10 border border-wedding-gold/15 p-4 rounded-2xl flex gap-3 mt-6">
                  <Info className="w-5 h-5 text-wedding-gold shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <strong>Baba Tip:</strong> The average caterer assumes that 15% of your guest base will double-count plates or throw them away. Squeezing this plate buffer saves lakhs!
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="glass-card text-wedding-gold border border-wedding-gold/30 px-6 py-3.5 rounded-xl text-xs font-bold hover:bg-wedding-gold/10 transition-colors uppercase tracking-wider flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="relative group overflow-hidden bg-gradient-to-r from-wedding-gold to-wedding-gold-bright text-black font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:shadow-wedding-gold/25 transition-all flex items-center gap-1"
              >
                <span>{step === 3 ? 'Generate AI Analysis' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </form>
        </motion.div>
      </main>
    </div>
  );
}
