'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  FileText, 
  MessageSquare, 
  Activity,
  AlertTriangle,
  TrendingDown,
  Calendar,
  MapPin,
  Users,
  Wallet,
  LogOut,
  ArrowRight,
  TrendingUp,
  Flame,
  BadgeAlert,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { supabase, isUsingMock, WeddingProject } from '@/lib/supabase';
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

const cateringPrefs = [
  'Premium Royal Multi-Cuisine Buffet', '5-Star Plated Service', 'Traditional Pure Veg Sit-Down Feast', 'Standard Unlimited Buffet', 'Basic Traditional Spread'
];

const updatingTexts = [
  "Auditing standard caterer plate-marker scams...",
  "Comparing paneer cube volumes against Indian Standard Code...",
  "Baba is renegotiating flower cart prices...",
  "Estimating Phupha Ji valet outrage risk factor...",
  "Applying maternal uncle shagun bribes calculations...",
  "Finalizing new financial squeeze ratios..."
];

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<WeddingProject[]>([]);

  // Update modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<WeddingProject | null>(null);
  const [editBudget, setEditBudget] = useState('');
  const [editGuests, setEditGuests] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editWeddingType, setEditWeddingType] = useState('');
  const [editVenueType, setEditVenueType] = useState('');
  const [editCatering, setEditCatering] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updatingTextIndex, setUpdatingTextIndex] = useState(0);

  // 1. Fetch user projects on load
  useEffect(() => {
    async function loadData() {
      const sessionRes: any = await supabase.auth.getSession();
      const session = sessionRes?.data?.session;
      if (!session) {
        router.push('/auth');
        return;
      }
      setUser(session.user);

      try {
        const { data: userProjects, error: projErr } = await supabase
          .from('wedding_projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (projErr) throw projErr;
        setProjects(userProjects || []);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // 2. Rotate updating texts
  useEffect(() => {
    let interval: any;
    if (updating) {
      interval = setInterval(() => {
        setUpdatingTextIndex((prev) => (prev + 1) % updatingTexts.length);
      }, 1300);
    }
    return () => clearInterval(interval);
  }, [updating]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // 3. Delete Project functionality
  const handleDeleteProject = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this wedding negotiation plan? All saved strategies will be lost!");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('wedding_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== id));
      alert("Wedding plan deleted successfully! 🗑️");
    } catch (err: any) {
      console.error("Delete error:", err);
      alert("Failed to delete the report. Please try again.");
    }
  };

  // 4. Open update modal pre-filled
  const handleOpenUpdateModal = (project: WeddingProject) => {
    setEditingProject(project);
    setEditBudget(project.budget.toString());
    setEditGuests(project.guests.toString());
    setEditCity(project.city);
    setEditWeddingType(project.wedding_type);
    setEditVenueType(project.venue_type);
    setEditCatering(project.catering);
    setIsUpdateModalOpen(true);
  };

  // 5. Submit update form to API & Supabase
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setUpdating(true);
    setUpdatingTextIndex(0);

    try {
      const payload = {
        budget: Number(editBudget),
        guestCount: Number(editGuests),
        city: editCity,
        weddingType: editWeddingType,
        venueType: editVenueType,
        decorStyle: editingProject.ai_analysis?.metadata?.decor_style || 'Traditional Marigold (Genda) & Warm LED',
        cateringPref: editCatering,
        photographyBudget: editingProject.ai_analysis?.metadata?.photography_budget || 150000
      };

      // Call Next.js API to run OpenRouter analysis on updated parameters
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('API server returned error');
      const apiResult = await response.json();

      const enrichedAnalysis = {
        ...apiResult,
        metadata: {
          decor_style: payload.decorStyle,
          photography_budget: payload.photographyBudget
        }
      };

      // Update in Supabase
      const { error } = await supabase
        .from('wedding_projects')
        .update({
          budget: Number(editBudget),
          guests: Number(editGuests),
          city: editCity,
          wedding_type: editWeddingType,
          venue_type: editVenueType,
          catering: editCatering,
          ai_analysis: enrichedAnalysis
        })
        .eq('id', editingProject.id);

      if (error) throw error;

      // Update local state
      setProjects(projects.map(p => p.id === editingProject.id ? {
        ...p,
        budget: Number(editBudget),
        guests: Number(editGuests),
        city: editCity,
        wedding_type: editWeddingType,
        venue_type: editVenueType,
        catering: editCatering,
        ai_analysis: enrichedAnalysis
      } : p));

      setIsUpdateModalOpen(false);
      setEditingProject(null);
      alert("Wedding plan and AI audit successfully updated! 🎉");
    } catch (err: any) {
      console.error("Update error:", err);
      alert("Failed to update and regenerate wedding analysis. Please check your network or API keys.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110204] flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin glow-gold" />
        <p className="font-cinzel text-sm text-wedding-gold-light uppercase tracking-widest animate-pulse">Loading strategy room...</p>
      </div>
    );
  }

  // Calculate statistics across all wedding projects
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSavings = projects.reduce((acc, p) => {
    const savings = p.ai_analysis?.savingsSuggestions?.reduce((sum: number, s: any) => sum + s.amount, 0) || 0;
    return acc + savings;
  }, 0);
  const avgRisk = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.ai_analysis?.riskScore || 0), 0) / projects.length) 
    : 0;

  return (
    <div className="min-h-screen bg-[#110204] text-white pb-20 relative">
      <MarigoldPetals />

      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-wedding-gold/15 bg-wedding-burgundy/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-cinzel text-xl font-black text-gold-gradient tracking-widest">
            BARGAIN<span className="text-[#FF8A00]">BABA</span> <span className="font-sans text-xs bg-wedding-crimson/50 text-wedding-gold px-2 py-0.5 rounded-full border border-wedding-gold/20">AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs md:text-sm text-wedding-gold-light font-medium bg-wedding-crimson/10 border border-wedding-gold/10 px-3 py-1 rounded-full">
              Host: {user?.email?.split('@')[0]} 🤵
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 relative z-10 space-y-10">
        
        {/* Banner with indicators */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-wedding-crimson-dark/40 to-transparent p-8 rounded-3xl border border-wedding-gold/15 glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-l from-wedding-gold/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-pulse" /> Active Strategy Center
            </span>
            <h1 className="font-cinzel text-3xl md:text-4xl font-extrabold text-white">
              Bargain Room of <span className="text-gold-gradient">{user?.name || user?.email?.split('@')[0]}'s Shaadi</span>
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Audit venue costs, squeeze caterers, check relative drama scores, and view high-leverage bargaining templates.
            </p>
          </div>

          <Link
            href="/dashboard/analyze"
            className="self-start md:self-center relative group overflow-hidden bg-gradient-to-r from-wedding-gold to-wedding-gold-bright text-black font-bold px-6 py-3.5 rounded-full shadow-lg hover:shadow-wedding-gold/25 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5 stroke-[3px]" />
            <span>Create New Analysis</span>
          </Link>
        </div>

        {/* Dynamic Analytics Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="glass-card rounded-2xl border border-wedding-gold/15 p-6 relative overflow-hidden">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Active Budgets</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-cinzel text-2xl md:text-3xl font-black text-white">₹{(totalBudget / 100000).toFixed(1)}L</span>
              <span className="text-xs text-wedding-gold">Planned</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-4">
              <Wallet className="w-3.5 h-3.5 text-wedding-gold" />
              <span>Across {projects.length} wedding project(s)</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-wedding-gold/15 p-6 relative overflow-hidden">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Optimized Savings</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-cinzel text-2xl md:text-3xl font-black text-emerald-400">₹{(totalSavings / 100000).toFixed(1)}L</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">~22% Off</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400/80 mt-4">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Squeezed out of bloated vendor rates</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-wedding-gold/15 p-6 relative overflow-hidden">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Wedding Chaos Risk</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-cinzel text-2xl md:text-3xl font-black text-orange-400">{avgRisk}%</span>
              <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full font-bold">Uncles Alert</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-orange-400/80 mt-4">
              <Flame className="w-3.5 h-3.5 animate-bounce" />
              <span>Mama & Phupha drama threshold</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-wedding-gold/15 p-6 relative overflow-hidden">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Negotation Status</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-cinzel text-2xl md:text-3xl font-black text-wedding-gold-light">Active</span>
              <span className="text-[10px] bg-wedding-gold/10 text-wedding-gold border border-wedding-gold/20 px-2 py-0.5 rounded-full">Secure</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-4">
              <Activity className="w-3.5 h-3.5 text-wedding-gold" />
              <span>Psychological leverage enabled</span>
            </div>
          </div>

        </div>

        {/* Two-Column Grid: Left (Saved Analyses) & Right (Quick Action Tools) */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left: Saved Wedding Projects & Analyses (Col span 2) */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-cinzel text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-wedding-gold" /> Recent AI Wedding Reports
              </h2>
              <span className="text-xs text-gray-400 font-bold">{projects.length} Reports Found</span>
            </div>

            {projects.length === 0 ? (
              <div className="glass-card rounded-3xl border border-dashed border-wedding-gold/20 p-12 text-center space-y-4">
                <FileText className="w-12 h-12 text-wedding-gold/40 mx-auto animate-pulse" />
                <h3 className="font-cinzel text-lg font-bold text-white">No Wedding Reports Yet</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  You haven't run any AI budget audits. Fill out the cinematic wedding questionnaire to audit quotes, detect overpricing, and get your strategy!
                </p>
                <Link
                  href="/dashboard/analyze"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-wedding-crimson to-wedding-crimson-light text-white text-xs font-bold px-6 py-3 rounded-full border border-wedding-gold/20 hover:scale-102 transition-all mt-4"
                >
                  Start Budget Audit <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => {
                  const suggestionsCount = project.ai_analysis?.savingsSuggestions?.length || 0;
                  const savings = project.ai_analysis?.savingsSuggestions?.reduce((sum: number, s: any) => sum + s.amount, 0) || 0;
                  const riskScore = project.ai_analysis?.riskScore || 50;

                  return (
                    <div 
                      key={project.id}
                      className="glass-card glass-card-hover rounded-2xl border border-wedding-gold/15 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs uppercase font-extrabold tracking-wider bg-wedding-crimson/50 border border-wedding-gold/20 text-wedding-gold px-2.5 py-0.5 rounded-full">
                            {project.wedding_type || 'Royal Indian'}
                          </span>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-wedding-gold" /> {project.city || 'Delhi/NCR'}
                          </span>
                        </div>

                        <h3 className="font-cinzel text-lg font-extrabold text-white">
                          Wedding Budget: ₹{(project.budget || 1500000).toLocaleString('en-IN')}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-wedding-gold" /> {project.guests || 300} Guests</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-wedding-gold" /> {new Date(project.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 gap-3">
                        <div className="text-left md:text-right">
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Predicted Savings</span>
                          <span className="block text-sm font-bold text-emerald-400">₹{savings.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Drama Risk</span>
                          <span className="text-xs font-bold text-orange-400">{riskScore}% Risk</span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 shrink-0">
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-wedding-crimson/10 hover:bg-wedding-crimson/30 text-wedding-crimson-light border border-wedding-crimson/25 p-2.5 rounded-xl transition-all"
                            title="Delete Negotiation Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleOpenUpdateModal(project)}
                            className="bg-[#2D050B]/30 hover:bg-[#2D050B]/60 text-wedding-gold-light border border-wedding-gold/20 p-2.5 rounded-xl transition-all"
                            title="Edit parameters & recalculate strategy"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <Link 
                            href={`/dashboard/analysis/${project.id}`}
                            className="bg-wedding-gold text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl hover:bg-wedding-gold-bright transition-colors flex items-center gap-1 shadow-md shadow-wedding-gold/10"
                          >
                            View Strategy <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Quick Action Tools / Sarcastic Indian Wedding Advice (Col span 1) */}
          <div className="space-y-6">
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-wedding-gold" /> Quick Strategist Tools
            </h2>

            {/* Micro negotiation card */}
            <div className="glass-card rounded-2xl border border-wedding-gold/15 p-6 space-y-4">
              <div className="w-8 h-8 rounded-lg bg-wedding-crimson/30 border border-wedding-gold/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-wedding-gold" />
              </div>
              <h3 className="font-cinzel text-base font-bold text-white">Guilt Text Generator</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Generate highly emotional copy-paste-ready bargaining messages on the fly. Squeeze caterers, DJs, and photographers.
              </p>
              <Link
                href="/dashboard/bargaining"
                className="w-full bg-wedding-crimson/30 hover:bg-wedding-crimson/50 text-wedding-gold-light border border-wedding-gold/20 py-2.5 rounded-xl text-xs font-bold transition-all block text-center uppercase tracking-wider mt-2"
              >
                Launch Text Generator
              </Link>
            </div>

            {/* Indian Wedding Intelligence Tidbit */}
            <div className="glass-card rounded-2xl border border-wedding-gold/15 p-6 space-y-3 relative overflow-hidden bg-[#2D050B]/30">
              <div className="absolute top-0 right-0 w-20 h-20 bg-wedding-gold/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-wedding-gold text-xs font-bold uppercase tracking-widest">
                <BadgeAlert className="w-4 h-4" /> Baba's Golden Rules
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                "Rule #1: Never count plate markers yourself. Hire a teenage cousin who wants a new smartphone, tell him you will give a ₹2,000 bonus if he catches the caterer stealing markers. High ROI."
              </p>
              <p className="text-xs text-gray-300 italic leading-relaxed pt-2 border-t border-white/5">
                "Rule #2: The 'Mama ji' sofa is critical. If your uncle looks slightly grumpy, hand him a VIP cold drink and tell him the groom's side is absolutely terrified of his high taste. The crisis is avoided."
              </p>
            </div>

            {/* Quick Demo indicator */}
            {isUsingMock && (
              <div className="bg-[#AA7C11]/10 border border-[#D4AF37]/20 p-4 rounded-xl text-xs text-gray-300 leading-relaxed">
                <strong>Platform Info:</strong> All analyzed wedding data are stored locally on your device's <code>localStorage</code>. Feel free to create multiple scenarios with different budgets to check how BargainBaba's algorithms react!
              </div>
            )}
          </div>

        </div>

      </main>

      {/* 🚀 PREMIUM PARAMETERS EDIT / UPDATE MODAL */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0204]/90 backdrop-blur-md">
            
            {/* If regenerating/updating AI strategy, display a gorgeous custom full screen loader overlay */}
            {updating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0F0204]/95 z-50 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-wedding-gold/10 animate-ping opacity-30" />
                  <div className="absolute inset-2 rounded-full border-4 border-double border-wedding-crimson animate-pulse opacity-40" />
                  <div className="absolute inset-6 rounded-full border border-dashed border-wedding-gold animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-wedding-crimson to-[#FF8A00] flex items-center justify-center shadow-2xl glow-gold">
                    <Sparkles className="w-8 h-8 text-white animate-bounce" />
                  </div>
                </div>

                <h3 className="font-cinzel text-lg md:text-xl font-black text-gold-gradient tracking-widest uppercase mb-4">
                  Recalculating Squeeze Strategy...
                </h3>

                <div className="min-h-[50px] max-w-sm">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={updatingTextIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-xs md:text-sm italic text-wedding-gold-light"
                    >
                      "{updatingTexts[updatingTextIndex]}"
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4 }}
              className="glass-card border border-wedding-gold/25 max-w-xl w-full p-8 rounded-3xl relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wedding-crimson via-wedding-gold to-wedding-crimson-light" />
              
              {/* Close Button */}
              <button 
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setEditingProject(null);
                }}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <span className="text-xs uppercase font-extrabold tracking-widest text-wedding-gold block mb-1">Adjust Parameters</span>
                <h2 className="font-cinzel text-xl font-bold text-white">Edit Wedding Details</h2>
                <p className="text-xs text-gray-400 mt-1">Baba will re-evaluate market quotes and rebuild your negotiation plan.</p>
              </div>

              <form onSubmit={handleUpdateProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-wider block">Total Budget (₹)</label>
                    <input
                      type="number"
                      required
                      value={editBudget}
                      onChange={(e) => setEditBudget(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-wider block">Guests (Heads)</label>
                    <input
                      type="number"
                      required
                      value={editGuests}
                      onChange={(e) => setEditGuests(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-wider block">City</label>
                    <select
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-wedding-gold transition-all"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c} className="bg-wedding-burgundy text-white">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-wider block">Style / Type</label>
                    <select
                      value={editWeddingType}
                      onChange={(e) => setEditWeddingType(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-wedding-gold transition-all"
                    >
                      {weddingTypes.map((t) => (
                        <option key={t} value={t} className="bg-wedding-burgundy text-white">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-wider block">Venue Category</label>
                  <select
                    value={editVenueType}
                    onChange={(e) => setEditVenueType(e.target.value)}
                    className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-wedding-gold transition-all"
                  >
                    {venueTypes.map((v) => (
                      <option key={v} value={v} className="bg-wedding-burgundy text-white">{v}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-wider block">Catering Menu Style</label>
                  <select
                    value={editCatering}
                    onChange={(e) => setEditCatering(e.target.value)}
                    className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-wedding-gold transition-all"
                  >
                    {cateringPrefs.map((c) => (
                      <option key={c} value={c} className="bg-wedding-burgundy text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdateModalOpen(false);
                      setEditingProject(null);
                    }}
                    className="flex-1 py-3 px-6 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-wedding-gold to-wedding-gold-bright hover:scale-[1.02] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-wedding-gold/15"
                  >
                    Update & Squeeze
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
