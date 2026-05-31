'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { supabase, isUsingMock } from '@/lib/supabase';
import MarigoldPetals from '@/components/MarigoldPetals';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignupParam = searchParams.get('signup') === 'true';

  const [isSignup, setIsSignup] = useState(isSignupParam);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Check if user already logged in
    supabase.auth.getSession().then((res: any) => {
      if (res?.data?.session) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password || (isSignup && !name)) {
      setErrorMsg('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });

        if (error) throw error;
        
        setSuccessMsg(isUsingMock 
          ? 'Mock Signup Successful! Logging you in...' 
          : 'Registration successful! Checking details...'
        );
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        setSuccessMsg('Successfully logged in!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
      setSuccessMsg('Redirecting to Google login...');
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setErrorMsg(err.message || 'Google authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid-bg flex flex-col justify-center items-center px-6 py-12">
      {/* Decorative petals background */}
      <MarigoldPetals />

      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-wedding-gold-light hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="font-cinzel text-2xl md:text-3xl font-black text-gold-gradient tracking-widest block mb-2">
            BARGAIN<span className="text-[#FF8A00]">BABA</span>
          </span>
          <p className="text-xs text-gray-400 font-light">
            {isSignup ? 'Create your BargainBaba Wedding Project' : 'Welcome back to your Wedding Strategy Room'}
          </p>
        </div>

        {/* Auth Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl border border-wedding-gold/25 p-8 relative overflow-hidden"
        >
          {/* Top subtle golden light */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wedding-crimson via-wedding-gold to-wedding-crimson-light" />

          {/* AI / Local indicator */}
          {isUsingMock && (
            <div className="mb-6 flex items-center justify-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs text-center">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Running in <strong>Interactive Demo Mode</strong> (Local Database)</span>
            </div>
          )}

          <h2 className="font-cinzel text-xl md:text-2xl font-bold text-white text-center mb-6">
            {isSignup ? 'Register New Project' : 'Strategist Login'}
          </h2>

          {errorMsg && (
            <div className="mb-6 bg-wedding-crimson-light/10 border border-wedding-crimson-light/30 text-wedding-crimson-light p-3.5 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignup && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block">Your Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wedding-gold/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wedding-gold/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@weddingemail.com"
                  className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block">Password</label>
                {!isSignup && (
                  <a href="#" className="text-[10px] text-gray-400 hover:text-wedding-gold transition-colors">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wedding-gold/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-wedding-burgundy/60 border border-wedding-gold/20 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-wedding-gold via-wedding-gold-light to-wedding-gold px-6 py-4 rounded-xl text-sm font-bold text-black shadow-lg hover:shadow-wedding-gold/25 transition-all duration-300 flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignup ? 'Create Project Strategy' : 'Enter Strategy Room'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-[#1C0407] hover:bg-[#2D050B] text-wedding-gold-light border border-wedding-gold/20 hover:border-wedding-gold/40 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.507 0-6.35-2.843-6.35-6.35 0-3.507 2.843-6.35 6.35-6.35 1.547 0 2.956.55 4.06 1.458l3.078-3.078C18.912 2.217 15.79 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.87-4.22 10.87-11.24 0-.768-.068-1.512-.196-2.24H12.24z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/5">
            {['256-bit Encrypted', 'No Card Required', 'GDPR Safe'].map(t => (
              <span key={t} className="text-[10px] text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-wedding-gold/50" /> {t}
              </span>
            ))}
          </div>

          {/* Toggle form link */}
          <div className="text-center mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-400">
              {isSignup ? 'Already have a wedding project?' : 'Planning an Indian wedding for the first time?'}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-wedding-gold font-bold hover:underline ml-1.5"
              >
                {isSignup ? 'Login Now' : 'Sign Up Free'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#110204] flex items-center justify-center flex-col gap-4 text-center">
        <div className="w-12 h-12 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin glow-gold" />
        <p className="font-cinzel text-sm text-wedding-gold-light uppercase tracking-widest animate-pulse">Entering Strategy Room...</p>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
