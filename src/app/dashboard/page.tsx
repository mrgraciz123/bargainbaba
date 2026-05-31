'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  FileText,
  Activity,
  AlertTriangle,
  TrendingDown,
  Calendar,
  MapPin,
  Users,
  Wallet,
  LogOut,
  ArrowRight,
  Brain,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Edit2,
  X,
  Target,
  BadgeCheck,
  BarChart3,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { supabase, isUsingMock, WeddingProject } from '@/lib/supabase';
import MarigoldPetals from '@/components/MarigoldPetals';

const cities = [
  'Delhi NCR', 'Lucknow', 'Mumbai', 'Bengaluru', 'Jaipur', 'Udaipur',
  'Kolkata', 'Ahmedabad', 'Patna', 'Dehradun', 'Goa', 'Hyderabad', 'Chennai', 'Pune'
];
const weddingTypes = [
  'Grand Royal Palace Wedding', 'Modern Minimalist Glass Wedding', 'Big Fat Punjabi Dhol Wedding',
  'Traditional South Indian Feast', 'Royal Marwari Heritage Wedding',
];
const venueTypes = [
  'Premium AC Lawn / Farmhouse', '5-Star Luxury Hotel Hall', 'Heritage Palace Resort',
  'Standard Banquet Hall', 'Local Community Center',
];
const cateringPrefs = [
  'Premium Royal Multi-Cuisine Buffet', '5-Star Plated Service', 'Traditional Pure Veg Sit-Down Feast',
  'Standard Unlimited Buffet', 'Basic Traditional Spread',
];

const updatingTexts = [
  'Re-scanning vendor market data...',
  'Comparing updated price signals...',
  'Rebuilding procurement strategy...',
  'Recalculating negotiation leverage...',
  'Generating updated savings plan...',
];

function RiskBadge({ level }: { level: string }) {
  const cfg = {
    Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
    Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25' },
    High: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/25' },
  };
  const c = cfg[level as keyof typeof cfg] || cfg.Medium;
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${c.color} ${c.bg}`}>
      {level} Risk
    </span>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<WeddingProject[]>([]);

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

  useEffect(() => {
    async function loadData() {
      const sessionRes: any = await supabase.auth.getSession();
      const session = sessionRes?.data?.session;
      if (!session) { router.push('/auth'); return; }
      setUser(session.user);
      try {
        const { data: userProjects, error } = await supabase
          .from('wedding_projects').select('*').eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProjects(userProjects || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  useEffect(() => {
    let interval: any;
    if (updating) {
      interval = setInterval(() => setUpdatingTextIndex(p => (p + 1) % updatingTexts.length), 1400);
    }
    return () => clearInterval(interval);
  }, [updating]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this procurement analysis permanently?')) return;
    try {
      const { error } = await supabase.from('wedding_projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleOpenEdit = (project: WeddingProject) => {
    setEditingProject(project);
    setEditBudget(project.budget.toString());
    setEditGuests(project.guests.toString());
    setEditCity(project.city);
    setEditWeddingType(project.wedding_type);
    setEditVenueType(project.venue_type);
    setEditCatering(project.catering);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
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
        requiredServices: editingProject.ai_analysis?.metadata?.services || ['venues', 'photographers', 'caterers'],
        priorities: editingProject.ai_analysis?.metadata?.priorities || [],
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Re-analysis API error');
      const apiResult = await response.json();

      const enriched = {
        ...apiResult,
        metadata: { ...editingProject.ai_analysis?.metadata, ...payload },
      };

      const { error } = await supabase.from('wedding_projects').update({
        budget: Number(editBudget), guests: Number(editGuests),
        city: editCity, wedding_type: editWeddingType,
        venue_type: editVenueType, catering: editCatering,
        ai_analysis: enriched,
      }).eq('id', editingProject.id);
      if (error) {
        console.error('Supabase Update Error:', {
          table: 'wedding_projects',
          failedFields: Object.keys(error),
          errorDetails: error.message || error,
          hint: error.hint || 'Check for missing columns like catering or venue_type.'
        });
        throw new Error('Database schema mismatch detected. Please run the provided SQL migration.');
      }

      setProjects(projects.map(p => p.id === editingProject.id
        ? { ...p, budget: Number(editBudget), guests: Number(editGuests), city: editCity, wedding_type: editWeddingType, venue_type: editVenueType, catering: editCatering, ai_analysis: enriched }
        : p
      ));
      setIsUpdateModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110204] flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
        <p className="font-cinzel text-sm text-wedding-gold-light uppercase tracking-widest animate-pulse">Loading Intelligence Platform...</p>
      </div>
    );
  }

  // Aggregate stats across all projects
  const totalBudget = projects.reduce((a, p) => a + p.budget, 0);
  const totalSavings = projects.reduce((a, p) => a + (p.ai_analysis?.procurementSummary?.estimatedSavingsOpportunity || p.ai_analysis?.savingsSuggestions?.reduce((s: number, x: any) => s + x.amount, 0) || 0), 0);
  const totalVendors = projects.reduce((a, p) => a + (p.ai_analysis?.procurementSummary?.totalVendorsAnalyzed || p.ai_analysis?.recommendedVendors?.length || 0), 0);
  const avgScore = projects.length > 0
    ? Math.round(projects.reduce((a, p) => a + (p.ai_analysis?.procurementSummary?.procurementScore || 75), 0) / projects.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#110204] text-white pb-20 relative">
      <MarigoldPetals />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-wedding-gold/15 bg-wedding-burgundy/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-cinzel text-xl font-black text-gold-gradient tracking-widest">
            BARGAIN<span className="text-[#FF8A00]">BABA</span>{' '}
            <span className="font-sans text-xs bg-wedding-crimson/50 text-wedding-gold px-2 py-0.5 rounded-full border border-wedding-gold/20">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-wedding-gold-light font-medium bg-wedding-crimson/10 border border-wedding-gold/10 px-3 py-1.5 rounded-full hidden sm:block">
              {user?.email?.split('@')[0]} 🤵
            </span>
            <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 relative z-10 space-y-8">

        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-wedding-crimson-dark/50 via-[#200407]/60 to-transparent p-7 rounded-3xl border border-wedding-gold/15 glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-l from-wedding-gold/5 to-transparent pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Procurement Intelligence Platform
            </span>
            <h1 className="font-cinzel text-2xl md:text-3xl font-extrabold text-white">
              Welcome back,{' '}
              <span className="text-gold-gradient">{user?.name || user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-gray-400 text-sm font-light">
              {projects.length > 0
                ? `You have ${projects.length} active procurement plan${projects.length !== 1 ? 's' : ''}. AI has identified ₹${(totalSavings / 100000).toFixed(1)}L in potential savings.`
                : 'Start your first AI procurement analysis to discover vendors, compare pricing, and optimize your wedding budget.'}
            </p>
          </div>
          <Link
            href="/dashboard/analyze"
            className="self-start md:self-center relative group overflow-hidden bg-gradient-to-r from-wedding-gold to-wedding-gold-bright text-black font-bold px-6 py-3.5 rounded-full shadow-lg hover:shadow-wedding-gold/30 hover:scale-[1.02] transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3px]" /> New Procurement Analysis
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Vendors Analyzed',
              value: totalVendors,
              suffix: '',
              sub: `Across ${projects.length} project${projects.length !== 1 ? 's' : ''}`,
              icon: <BarChart3 className="w-4 h-4 text-wedding-gold" />,
              color: 'text-white',
            },
            {
              label: 'Potential Savings',
              value: Math.round(totalSavings / 1000),
              prefix: '₹',
              suffix: 'k',
              sub: 'AI-identified opportunities',
              icon: <TrendingDown className="w-4 h-4 text-emerald-400" />,
              color: 'text-emerald-400',
            },
            {
              label: 'Avg Procurement Score',
              value: avgScore || 0,
              suffix: '/100',
              sub: projects.length > 0 ? 'Optimization rating' : 'No analyses yet',
              icon: <Target className="w-4 h-4 text-wedding-gold" />,
              color: 'text-wedding-gold',
            },
            {
              label: 'Negotiation Status',
              value: null,
              label2: projects.length > 0 ? 'Active' : 'Ready',
              sub: 'AI scripts available',
              icon: <Activity className="w-4 h-4 text-wedding-gold" />,
              color: 'text-wedding-gold-light',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl border border-wedding-gold/15 p-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                {stat.icon}
              </div>
              <div className={`font-cinzel text-2xl font-black ${stat.color}`}>
                {stat.value !== null ? `${stat.prefix || ''}${stat.value.toLocaleString('en-IN')}${stat.suffix || ''}` : stat.label2}
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Projects + Sidebar */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left: Projects list */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-wedding-gold" /> Procurement Reports
              </h2>
              <span className="text-xs text-gray-400 font-bold">{projects.length} Analysis{projects.length !== 1 ? 'es' : ''}</span>
            </div>

            {projects.length === 0 ? (
              <div className="glass-card rounded-3xl border border-dashed border-wedding-gold/20 p-12 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-wedding-gold/10 border border-wedding-gold/20 flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-wedding-gold/60 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white mb-2">No Analyses Yet</h3>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Run your first AI procurement analysis to discover vendors, detect overpricing, and build your wedding strategy.
                  </p>
                </div>
                <Link
                  href="/dashboard/analyze"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-wedding-gold to-wedding-gold-bright text-black font-bold text-xs uppercase px-6 py-3 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-wedding-gold/20"
                >
                  <Sparkles className="w-4 h-4" /> Start AI Procurement
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, i) => {
                  const ps = project.ai_analysis?.procurementSummary || {};
                  const savings = ps.estimatedSavingsOpportunity || project.ai_analysis?.savingsSuggestions?.reduce((s: number, x: any) => s + x.amount, 0) || 0;
                  const score = ps.procurementScore || 75;
                  const riskLevel = ps.riskLevel || (project.ai_analysis?.riskScore > 60 ? 'High' : project.ai_analysis?.riskScore > 35 ? 'Medium' : 'Low');
                  const vendorsCount = ps.totalVendorsAnalyzed || project.ai_analysis?.recommendedVendors?.length || 0;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="glass-card glass-card-hover rounded-2xl border border-wedding-gold/15 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                    >
                      {/* Left: Meta */}
                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold tracking-wider bg-wedding-crimson/40 border border-wedding-gold/20 text-wedding-gold px-2.5 py-0.5 rounded-full uppercase">
                            {project.wedding_type?.split(' ').slice(0, 2).join(' ') || 'Wedding'}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-wedding-gold" /> {project.city}
                          </span>
                          <RiskBadge level={riskLevel} />
                        </div>

                        <h3 className="font-cinzel text-base font-extrabold text-white">
                          ₹{(project.budget || 0).toLocaleString('en-IN')} Budget
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-wedding-gold" /> {project.guests} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-wedding-gold" />
                            {new Date(project.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3 text-wedding-gold" /> {vendorsCount} vendors
                          </span>
                        </div>
                      </div>

                      {/* Right: Metrics + Actions */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-5 gap-3 shrink-0">
                        <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
                          <div className="text-left md:text-right">
                            <span className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold">Savings</span>
                            <span className="text-sm font-bold text-emerald-400">₹{savings.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="text-left md:text-right">
                            <span className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold">Score</span>
                            <span className="text-sm font-bold text-wedding-gold">{score}/100</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="bg-wedding-crimson/10 hover:bg-wedding-crimson/25 text-wedding-crimson-light border border-wedding-crimson/20 p-2 rounded-xl transition-all"
                            title="Delete Analysis"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(project)}
                            className="bg-white/5 hover:bg-white/10 text-wedding-gold-light border border-wedding-gold/15 p-2 rounded-xl transition-all"
                            title="Edit & Re-analyze"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/dashboard/analysis/${project.id}`}
                            className="bg-gradient-to-r from-wedding-gold to-wedding-gold-bright text-black font-bold text-[10px] uppercase px-4 py-2.5 rounded-xl hover:scale-[1.02] transition-all flex items-center gap-1 shadow-md shadow-wedding-gold/15"
                          >
                            View Report <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-wedding-gold" /> Quick Tools
            </h2>

            {/* Negotiation Script Generator */}
            <div className="glass-card rounded-2xl border border-wedding-gold/15 p-5 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-wedding-crimson/20 border border-wedding-gold/15 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-wedding-gold" />
              </div>
              <h3 className="font-cinzel text-sm font-bold text-white">Negotiation Script Generator</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generate emotional, copy-paste-ready bargaining messages for caterers, decorators, and photographers.
              </p>
              <Link
                href="/dashboard/bargaining"
                className="w-full block text-center bg-wedding-crimson/20 hover:bg-wedding-crimson/40 text-wedding-gold-light border border-wedding-gold/20 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
              >
                Open Script Generator
              </Link>
            </div>

            {/* Intelligence Card */}
            <div className="glass-card rounded-2xl border border-wedding-gold/15 p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-wedding-gold/5 rounded-full blur-xl" />
              <div className="flex items-center gap-2 text-wedding-gold text-xs font-bold uppercase tracking-widest">
                <Brain className="w-4 h-4" /> AI Tip
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                "The best time to negotiate with caterers is a weekday afternoon, 3–4 months before your wedding date. They're far more flexible when their calendar isn't full."
              </p>
              <div className="border-t border-white/5 pt-3">
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "Always ask for a 'bulk booking discount' even if you're only booking one service — it signals you're comparing multiple vendors."
                </p>
              </div>
            </div>

            {/* Mock mode indicator */}
            {isUsingMock && (
              <div className="bg-amber-500/8 border border-amber-500/20 p-4 rounded-xl text-xs text-gray-400 leading-relaxed">
                <strong className="text-amber-400">Demo Mode Active:</strong> Data is stored in localStorage. Connect Supabase to enable persistent cloud storage and multi-device access.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── EDIT MODAL ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080102]/90 backdrop-blur-md">
            {updating && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#080102]/95 z-50 flex flex-col items-center justify-center gap-6 text-center"
              >
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-wedding-gold/20 animate-ping opacity-40" />
                  <div className="absolute inset-3 rounded-full border border-dashed border-wedding-gold/50 animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute inset-6 rounded-full bg-gradient-to-br from-wedding-gold to-wedding-crimson flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white animate-bounce" />
                  </div>
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-black text-gold-gradient mb-3">Re-analyzing...</h3>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={updatingTextIndex}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="text-sm italic text-wedding-gold-light"
                    >
                      {updatingTexts[updatingTextIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card border border-wedding-gold/25 max-w-lg w-full p-8 rounded-3xl relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wedding-crimson via-wedding-gold to-wedding-crimson-light" />
              <button
                onClick={() => { setIsUpdateModalOpen(false); setEditingProject(null); }}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-wedding-gold block mb-1">Re-Analyze</span>
                <h2 className="font-cinzel text-xl font-bold text-white">Update Wedding Parameters</h2>
                <p className="text-xs text-gray-400 mt-1">AI will re-run the full procurement analysis with updated data.</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Budget (₹)', value: editBudget, set: setEditBudget, type: 'number' },
                    { label: 'Guest Count', value: editGuests, set: setEditGuests, type: 'number' },
                  ].map(({ label, value, set, type }) => (
                    <div key={label} className="space-y-1">
                      <label className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-wider block">{label}</label>
                      <input
                        type={type} required value={value}
                        onChange={e => set(e.target.value)}
                        className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                      />
                    </div>
                  ))}
                </div>

                {[
                  { label: 'City', value: editCity, set: setEditCity, options: cities },
                  { label: 'Wedding Style', value: editWeddingType, set: setEditWeddingType, options: weddingTypes },
                  { label: 'Venue Category', value: editVenueType, set: setEditVenueType, options: venueTypes },
                  { label: 'Catering Style', value: editCatering, set: setEditCatering, options: cateringPrefs },
                ].map(({ label, value, set, options }) => (
                  <div key={label} className="space-y-1">
                    <label className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-wider block">{label}</label>
                    <select
                      value={value} onChange={e => set(e.target.value)}
                      className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-wedding-gold transition-all"
                    >
                      {options.map(o => <option key={o} value={o} className="bg-[#2D050B] text-white">{o}</option>)}
                    </select>
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setIsUpdateModalOpen(false); setEditingProject(null); }}
                    className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-wedding-gold to-wedding-gold-bright text-black font-bold text-xs uppercase tracking-wider hover:scale-[1.01] transition-all shadow-md"
                  >
                    Re-Analyze
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
