'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Percent, 
  MessageCircle, 
  TrendingDown, 
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Play,
  Heart,
  Scale,
  Smile,
  X
} from 'lucide-react';
import MarigoldPetals from '@/components/MarigoldPetals';
import { supabase } from '@/lib/supabase';

// High-fidelity testimonials & ticker negotiations
const bargainingTicker = [
  { vendor: "Lucknow Lawn Manager", original: "₹3,50,000", negotiated: "₹2,70,000", message: "Bhaiya... catering bhi hum aapse hi karwa rahe hain, beti ki shadi hai thoda aashirwad de dijiye...😭" },
  { vendor: "NCR Luxury Decorator", original: "₹2,20,000", negotiated: "₹1,65,000", message: "We don't need real orchids. Mix local genda phool with warm LEDs, it will look twice as royal! ✨" },
  { vendor: "Imperial Caterer (500 Plates)", original: "₹15,00,000", negotiated: "₹12,40,000", message: "Bhaiya, 15% of our relatives are strict fasting and won't eat.Squeeze standard plate buffer to 80%!" },
  { vendor: "Cinematographer", original: "₹3,00,000", negotiated: "₹2,20,000", message: "Remove the '3-minute cinematic teaser drone shot' and lower the album binding. We'll pay digital advance now." }
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      setUser(res?.data?.session?.user || null);
    });

    const authSubscription = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });

    // Rotation ticker interval
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % bargainingTicker.length);
    }, 4500);

    return () => {
      authSubscription.data.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative min-h-screen grid-bg">
      {/* Decorative falling marigold petals */}
      <MarigoldPetals />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-wedding-gold/15 bg-wedding-burgundy/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-cinzel text-xl md:text-2xl font-black text-gold-gradient tracking-widest flex items-center gap-1.5">
              BARGAIN<span className="text-[#FF8A00]">BABA</span> <span className="font-sans text-xs bg-wedding-crimson/50 text-wedding-gold-light border border-wedding-gold/30 px-2 py-0.5 rounded-full glow-gold font-bold">AI</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 md:gap-6">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm font-semibold text-wedding-gold-light hover:text-wedding-gold transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.refresh();
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
                <Link 
                  href="/dashboard/analyze" 
                  className="glass-card text-wedding-gold text-xs md:text-sm font-bold border border-wedding-gold/40 px-4 py-2 rounded-full hover:bg-wedding-gold/10 hover:border-wedding-gold transition-all duration-300 glow-gold"
                >
                  Analyze Wedding
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/auth" 
                  className="text-sm font-semibold text-wedding-gold-light hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  href="/auth?signup=true" 
                  className="relative group overflow-hidden bg-gradient-to-r from-wedding-crimson to-wedding-crimson-light px-5 py-2 rounded-full text-sm font-bold text-white shadow-lg hover:shadow-wedding-crimson/30 hover:scale-[1.02] transition-all duration-300 border border-wedding-gold/30"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-wedding-gold to-wedding-gold-bright opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-wedding-gold/30 text-wedding-gold text-xs md:text-sm font-bold tracking-wider uppercase mb-8"
          >
            <Sparkles className="w-4 h-4 text-wedding-gold animate-pulse" /> 
            India's First AI Wedding Budget & Negotiation Advisor
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cinzel text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6"
          >
            Indian weddings are <br className="hidden md:inline"/>
            <span className="text-gold-gradient font-black tracking-wide drop-shadow-md">not planned.</span> <br />
            <span className="relative inline-block text-white mt-2">
              They are <span className="underline decoration-wedding-crimson-light decoration-4 underline-offset-8">negotiated.</span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="max-w-2xl mx-auto text-gray-300 text-base md:text-xl font-light leading-relaxed mb-12"
          >
            Meet the AI agent that negotiates smarter than your smartest chacha. Save up to 25% on venue, catering, and decor using psychological leverage & local pricing intelligence.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link 
              href={user ? "/dashboard/analyze" : "/auth"}
              className="w-full sm:w-auto relative group overflow-hidden bg-gradient-to-r from-wedding-gold via-wedding-gold-light to-wedding-gold-bright px-8 py-4 rounded-full text-base font-bold text-black shadow-xl hover:shadow-wedding-gold/45 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 glow-gold"
            >
              <span>Try BargainBaba AI</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto glass-card px-8 py-4 rounded-full text-base font-bold text-wedding-gold border border-wedding-gold/30 hover:bg-wedding-gold/10 hover:border-wedding-gold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-wedding-gold text-wedding-gold" />
              <span>Watch AI Demo</span>
            </button>
          </motion.div>

          {/* Live Negotiation Ticker Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-3xl mx-auto mt-8 glass-card rounded-2xl border border-wedding-gold/20 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-wedding-gold to-wedding-crimson" />
            
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-wedding-gold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Negotiation Intelligence
              </span>
              <span className="text-xs text-gray-400 font-medium">BargainBaba in Action 🕵️‍♂️</span>
            </div>

            <div className="min-h-[140px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tickerIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{bargainingTicker[tickerIndex].vendor}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 line-through">{bargainingTicker[tickerIndex].original}</span>
                      <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" /> {bargainingTicker[tickerIndex].negotiated}
                      </span>
                    </div>
                  </div>

                  <div className="bg-wedding-crimson/10 border border-wedding-crimson/25 p-3 rounded-lg relative">
                    <p className="text-sm italic text-wedding-gold-light leading-relaxed">
                      "{bargainingTicker[tickerIndex].message}"
                    </p>
                    <div className="absolute -bottom-2 left-6 w-3 h-3 bg-wedding-crimson/20 border-r border-b border-wedding-crimson/25 rotate-45" />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2 mt-4 self-end">
                {bargainingTicker.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTickerIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${tickerIndex === i ? 'bg-wedding-gold scale-125' : 'bg-wedding-gold/30'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Statistics Banner */}
      <section className="border-t border-b border-wedding-gold/15 bg-wedding-burgundy/40 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="block font-cinzel text-3xl md:text-5xl font-black text-gold-gradient glow-text-gold">₹2.4 Lakhs</span>
            <span className="block text-xs md:text-sm text-gray-400 uppercase tracking-widest mt-2 font-bold">Average Savings</span>
          </div>
          <div>
            <span className="block font-cinzel text-3xl md:text-5xl font-black text-gold-gradient glow-text-gold">8,400+</span>
            <span className="block text-xs md:text-sm text-gray-400 uppercase tracking-widest mt-2 font-bold">Caterers Audited</span>
          </div>
          <div>
            <span className="block font-cinzel text-3xl md:text-5xl font-black text-gold-gradient glow-text-gold">98.2%</span>
            <span className="block text-xs md:text-sm text-gray-400 uppercase tracking-widest mt-2 font-bold">Drama Avoidance</span>
          </div>
          <div>
            <span className="block font-cinzel text-3xl md:text-5xl font-black text-gold-gradient glow-text-gold">4.9 ★</span>
            <span className="block text-xs md:text-sm text-gray-400 uppercase tracking-widest mt-2 font-bold">Chacha Trust Score</span>
          </div>
        </div>
      </section>

      {/* Futuristic AI Features Showcase */}
      <section className="px-6 py-24 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">Cunning Algorithms, Epic Savings</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-extrabold text-white mt-2">
            The Secrets of <span className="text-gold-gradient">Baba's Negotiation</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-sm md:text-base mt-4 font-light">
            We combine high-level financial risk analytics with deep-rooted Indian cultural psychology. Here is what you get:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card glass-card-hover rounded-2xl p-8 border border-wedding-gold/15 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-wedding-crimson/20 border border-wedding-crimson/30 flex items-center justify-center text-wedding-gold mb-6 group-hover:scale-110 transition-transform">
                <Percent className="w-6 h-6 text-wedding-gold" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-3">Vendor Overpricing Audits</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Our AI cross-checks your venue, catering, and decor quotes against real-time wholesale rates in your specific city. We instantly flag standard markups and "NRI Tax".
              </p>
            </div>
            <span className="text-xs font-bold tracking-widest text-wedding-gold group-hover:translate-x-1.5 transition-transform flex items-center gap-1 mt-4">
              LEARN MORE <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-hover rounded-2xl p-8 border border-wedding-gold/15 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-wedding-crimson/20 border border-wedding-crimson/30 flex items-center justify-center text-wedding-gold mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-wedding-gold" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-3">Guilt-Powered Hinglish Templates</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Generate highly emotional copy-paste-ready bargaining messages for WhatsApp. Select guilt levels like the "Chacha Business Loss Card" or "Beti ki shadi" to melt vendors.
              </p>
            </div>
            <span className="text-xs font-bold tracking-widest text-wedding-gold group-hover:translate-x-1.5 transition-transform flex items-center gap-1 mt-4">
              LEARN MORE <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-hover rounded-2xl p-8 border border-wedding-gold/15 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-wedding-crimson/20 border border-wedding-crimson/30 flex items-center justify-center text-wedding-gold mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-wedding-gold" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-3">Relative Drama & Risk Scores</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Calculate the probability of key friction events: "Mama Ji stage sofa complaint probability", "Paneer shortage argument risk", and "DJ police conflict threshold".
              </p>
            </div>
            <span className="text-xs font-bold tracking-widest text-wedding-gold group-hover:translate-x-1.5 transition-transform flex items-center gap-1 mt-4">
              LEARN MORE <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* How it Works / Cinematic Steps */}
      <section className="px-6 py-24 bg-gradient-to-b from-transparent via-wedding-burgundy/20 to-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">4 Simple Steps to Freedom</span>
            <h2 className="font-cinzel text-3xl md:text-5xl font-extrabold text-white mt-2">
              How BargainBaba <span className="text-gold-gradient">Saves the Day</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-wedding-gold/5 via-wedding-gold/30 to-wedding-gold/5 -translate-y-1/2 hidden md:block z-0" />
            
            {[
              { step: "01", title: "Feed the Details", desc: "Enter your budget, guest count, decoration preference, and current vendor quotes." },
              { step: "02", title: "Run Baba AI Audit", desc: "Our neural net analyzes city-wide wholesale data and detects overcharging margins." },
              { step: "03", title: "Deploy Emotional Leverage", desc: "Copy hyper-personalized, emotional bargaining messages and shoot them to vendors." },
              { step: "04", title: "Squeeze Margins", desc: "Watch vendor quotes drop by 15-30% while maintaining absolute respect and royal class." }
            ].map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 border border-wedding-gold/10 relative z-10 flex flex-col justify-between hover:border-wedding-gold/30 transition-colors">
                <div>
                  <span className="block font-cinzel text-4xl font-black text-wedding-gold/20 mb-4">{item.step}</span>
                  <h4 className="font-cinzel text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Video Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl glass-card rounded-2xl border border-wedding-gold/30 p-6 relative overflow-hidden"
            >
              <button 
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="font-cinzel text-xl md:text-2xl font-bold text-gold-gradient mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-wedding-gold" /> BargainBaba AI Platform Demo Walkthrough
              </h3>

              <div className="aspect-video bg-wedding-burgundy/60 rounded-xl border border-wedding-gold/15 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-radial-gradient opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="w-16 h-16 rounded-full bg-wedding-gold flex items-center justify-center shadow-lg shadow-wedding-gold/30 group-hover:scale-110 transition-transform cursor-pointer relative z-10">
                  <Play className="w-6 h-6 text-black fill-black ml-1" />
                </div>
                <div className="absolute bottom-6 left-6 text-left max-w-md relative z-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-wedding-gold bg-wedding-crimson/40 border border-wedding-gold/30 px-3 py-1 rounded-full inline-block mb-2">Platform Mockup Demo</span>
                  <p className="text-sm text-gray-300">
                    Watch how BargainBaba AI calculates regional drama quotients, identifies catering plate inflation buffers, and automatically writes custom WhatsApp texts using relative-guilt modeling.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-400 italic">No real chachas were harmed during the development of this AI.</p>
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    router.push(user ? '/dashboard/analyze' : '/auth');
                  }}
                  className="bg-wedding-gold text-black font-bold text-xs uppercase px-5 py-2.5 rounded-full hover:bg-wedding-gold-bright transition-colors"
                >
                  Start My Analysis
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Footer Section */}
      <section className="px-6 py-24 text-center relative z-10 border-t border-wedding-gold/15 overflow-hidden bg-[#200407]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,30,63,0.15),transparent_70%)]" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Heart className="w-10 h-10 text-wedding-crimson-light animate-pulse mx-auto mb-6" />
          <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white mb-6">
            Don't Overpay the Vendors. <br className="hidden md:inline" />
            <span className="text-gold-gradient">Let Baba Handle It.</span>
          </h2>
          <p className="max-w-lg mx-auto text-gray-300 text-sm md:text-base leading-relaxed mb-8">
            Create an account, map your wedding details, and lock down your budgets before the caterers double the price next month. 
          </p>

          <Link
            href={user ? "/dashboard/analyze" : "/auth?signup=true"}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-wedding-crimson to-wedding-crimson-light px-8 py-4 rounded-full text-base font-bold text-white shadow-xl hover:shadow-wedding-crimson/30 hover:scale-[1.03] transition-all duration-300 border border-wedding-gold/30 glow-crimson"
          >
            <span>Analyze Your Wedding Now</span> <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Real Footer */}
      <footer className="border-t border-wedding-gold/10 bg-[#110204] py-8 text-center text-xs text-gray-500 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} BargainBaba AI. All rights reserved. Made in India with emotional blackmail.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-wedding-gold transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-wedding-gold transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-wedding-gold transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
