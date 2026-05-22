'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowLeft, 
  MessageCircle, 
  Copy, 
  Check, 
  HelpCircle,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import MarigoldPetals from '@/components/MarigoldPetals';

const vendors = [
  { id: 'catering', name: 'Catering Vendor' },
  { id: 'venue', name: 'Banquet Lawn / Venue Host' },
  { id: 'decor', name: 'Stage & Flower Decorator' },
  { id: 'photo', name: 'Cinematographer / Photographer' },
  { id: 'makeup', name: 'Bridal Makeup Artist' }
];

const guiltLevels = [
  { id: 'chacha', name: "Chacha's Financial Loss Card 😭", desc: "Use the fake story that the wealthy uncle supporting the budget just lost a cargo shipment." },
  { id: 'daughter', name: "Daughter's Dream Wedding Card ✨", desc: "Appeal to their fatherly guilt by saying the daughter has dreamt of this since age 5, but budget is low." },
  { id: 'middle', name: "Aam Middle Class Guarantee Card 🤵", desc: "A simple, solid appeal to high volume digital advance payment in exchange for a clean discount." },
  { id: 'once', name: "Shaadi Ek Hi Baar Hoti Hai 💍", desc: "Remind them that you will hire them for 3 other cousins next year if they adjust rates today." },
  { id: 'behen', name: "Ultimate Sisterly Guilt Card 😭", desc: "Combine the classic sister's wedding emotional pressure with life-long customer and Sharma ji comparisons." }
];

const tones = [
  { id: 'polite', name: 'Heartbreakingly Polite' },
  { id: 'firm', name: 'Firm but Respectful' },
  { id: 'sweet', name: 'Extremely Sweet & Buttering' }
];

// Funny generator data mapping
const templates: Record<string, Record<string, string>> = {
  catering: {
    chacha: "Bhaiya, namaste. Plate count aur swad to aapka hi sabse badhiya hai, ghar me sab haan bol rahe hain. Par sach bataun to mere chacha ji jo funding de rahe the, unki factory me short circuit ki wajah se thoda nuksan ho gaya hai aur hamara budget bilkul collapse hone wala hai. Agar aap ₹150 per plate thoda adjust kar dein to hum deal pakki kar dein... beti ki shadi hai thoda shagun samajh ke adjust kar dijiye...😭",
    daughter: "Sir, beti bachpan se bolti thi ki shadi me khana sabse lajawab hona chahiye. Aapka standard dekh kar vo behad khush hai, lekin aam middle class baap ki pocket allow nahi kar rahi. Hum standard dessert cut karne ko taiyar hain, kripya plate charge ₹1200 se ₹1000 kar dijiye... aapke ghar me bhi beti hai, thoda aashirwad samajh ke haan kar dijiye.",
    middle: "Bhaiya, hum koi dikhava nahi chahte, aam parivar ke log hain. Dusre caterers hume ₹200 kam me de rahe hain par hume aapka kaam pasand hai. Ek baar me cash advanced direct online transfer kar denge agar aap shagun ke taur pe flat 15% discount adjust karein to. Bataiye, abhi advance bhej dein?",
    once: "Bhaiya, hamare khandan me agle 2 saal me 4 shadiyan aur hain! Agar aapne is baar catering me thoda haath halka rakha aur ₹150 per plate adjust kar diya, to aapse hi saare contract sign karwaunga, chacha ji se bol ke abhi pakka karwa dunga. Shadi to ek hi baar hoti hai, hamara rishta humesha ke liye jud jayega!",
    behen: "Bhaiya, thoda to discount banta hai na, aakhir bhaiya meri behen ki shaadi hai 😭! Dekhiye Sharma ji ko aapne ₹950 per plate ka itna sasta rate diya tha pichle saal, hamare saath aisa bhedbhav kyu? Agar aap thoda sa adjust kar dein to hamare pure circle me jab bhi shadi hogi aapse hi cater karwaenge, aapko lifetime customer bana denge sir! Bataiye shagun ka deal pakka karein?"
  },
  venue: {
    chacha: "Sir, venue to aapse hi lena hai, hume sab bol rahe hain ki aapka lawn sabse royal lagta hai. Par problem ye hai ki mere chacha ji jo financially support kar rahe the, unka thoda business me issue ho gaya hai aur budget ab extreme limit pe chala gaya hai. Agar aap standard service charges aur lighting cost adjust kar sakein to hum advance abhi bhej dein... beti ki shadi hai thoda aashirwad samajh ke haan kar dijiye...😭",
    daughter: "Aadarniya Sir, hamari bachhi ka sapna tha ki vo isi heritage palace se apni nayi zindagi shuru karegi. Humne pure budget me se paise bacha kar aapke hall ke liye rakhe hain par fir bhi ₹1 Lakh kam pad rahe hain. Aam baap ki ijjat ka sawal hai, thoda sa discount adjust kar dijiye... beti ki dua lagegi sir.",
    middle: "Bhaiya, hum aam log hain aur shadi shant tarike se karna chahte hain. Dusre banquets me ₹1.5 Lakhs kam lag rahe hain par aapki brand value acchi hai. Agar aap electricity generator cost aur entry decor standard waive off kar sakein, to hum direct digital advance abhi transfer kar denge. Kripya deal close kijiye.",
    once: "Sir, hamare pure circle me pehli shadi ho rahi hai, baki sabhi cousins line me hain! Agar aapne is baar rate me adjustment kar diya to pure khandan ki shadi yahi hogi. Shadi ek hi baar hoti hai sir, thoda adjust karke hume aage badhne ka mauka dijiye!",
    behen: "Sir, please thoda sa adjust kar lijiye na, bhaiya meri behen ki shaadi hai 😭! Sharma ji ko aapne yahi exact banquet lawn kitna sasta diya tha, hum to unhi se puch kar aaye hain. Agar is baar rate thoda adjust kar denge to aage pure khandan ki shadiyon me aapse hi venue book karenge, aapko lifetime customer bana denge sir!"
  },
  decor: {
    chacha: "Bhaiya, decor ka design to kamaal hai! Par thoda rate zyada lag raha hai. Mere chacha ji jo financial support kar rahe the, unka thoda business me issue ho gaya hai aur budget ab extreme limit pe chala gaya hai. Agar aap artificial flowers ka thoda blend kar dein aur heavy structures replace karein to hamare budget me fit ho jayega...😭",
    daughter: "Sir, meri beti ko flowers ka bahut shauk hai, unka sapna tha ki mandap me imported orchids lagein. Lekin hamare paas decor ke liye maximum ₹2 Lakhs hi bache hain. Agar aap orchids ki jagah local premium marigold (Genda) and warm LED mix kar sakein to please kar dijiye, beti ki khushi ke liye thoda adjust kar dijiye.",
    middle: "Bhaiya, hum seedhe-saadhe log hain, hume zyada show-off nahi chahiye par clean looks chahiye. Agar aap is pricing me flat 18% kam karein to hum standard structures hata denge. Advance cash abhi transfer kar rahe hain, please check karke finalize kijiye.",
    once: "Dekho bhaiya, pure colony me shadi ki charcha hai! Agar aapka decor logo ko pasand aaya to agle season me aapko kam se kam 5 naye decor ke orders main khud dilwaunga. Shadi ek hi baar hoti hai, thoda adjust karke hamara rishta pakka kijiye!",
    behen: "Bhaiya, decor to aapse hi karwaenge, aakhir bhaiya meri behen ki shaadi hai 😭! Par rate thoda sahi lagao, Sharma ji ko yahi exact stage flower decoration kitna sasta diya tha aapne unke bete ki shadi me. Agar is baar shagun ka discount thoda adjust kiya to agle saal bhai ki shadi me bhi aapko hi layenge, aapko lifetime customer bana denge!"
  },
  photo: {
    chacha: "Bhaiya, cinematography ke liye to aap hi hamari pehli choice hain. Par chacha ji jo funding de rahe the unki factory me issues ke wajah se budget extreme tight ho gaya hai. Hum robotic drone cover and cinematic teaser ka packet cut kar sakte hain, please package cost ₹40k adjust kar dijiye...😭",
    daughter: "Sir, shadi ki memories hi to reh jati hain, bachhi aapke photos dekh kar shadi fix hone se pehle se hi bolti thi ki shooting aapse hi karwani hai. Par hamara budget bohot low ho gaya hai. Aap raw footage compress karke simple album de dijiye par hume aapse hi karwana hai, thoda adjust kar lijiye please.",
    middle: "Bhaiya, digital zamana hai hume heavy leather-bound physical albums nahi chahiye, bas virtual drive me high resolution raw folder de dijiye. Isse aapki cost bachegi, to please package cost ₹30,000 kam kar dijiye... hum digital advance abhi transfer kar denge.",
    once: "Bhaiya, abhi to agle saal meri sagi behen ki shadi hai, uske baad cousins ki. Agar aapne is baar shooting bohot premium di aur rate adjust kiya, to pure family contracts aapse hi pakke honge! Shadi ek hi baar hoti hai, kripya thoda discount de dijiye!",
    behen: "Bhaiya, thoda package cost adjust kar lijiye na, bhaiya meri behen ki shaadi hai 😭! Sharma ji ko aapne yahi custom pre-wedding + candid shoot kitna sasta diya tha. Agar is baar rate thoda adjust kar dein to aane wali saari shadiyon aur functions ke portfolios aapko hi denge, aapko lifetime customer bana denge!"
  },
  makeup: {
    chacha: "Ma'am, aapka signature bridal glow to lajawab hai! Lekin mere chacha ji jo finance kar rahe the unke business me heavy loss ho gaya hai aur hamara makeup budget collapse ho gaya hai. Agar aap standard draping aur assistant makeup support adjust kar skein to hum abhi sign up kar lete hain...😭",
    daughter: "Ma'am, bride bachpan se aapke Instagram page ko follow kar rahi hai, uska sapna tha ki shadi ke din vo aapse hi ready ho. Lekin hamare parivar ke paas ab bilkul limit cross ho gayi hai. Draping hum ghar pe kar lenge, kripya signature airbrush makeup ka cost thoda standard level par adjust kar dijiye... beti ka din hai please.",
    middle: "Dear, hum soft makeup hi chahte hain bina heavy dramatic extensions ke. Hum standard packages me se hair extensions waive off karne ko taiyar hain agar aap flat 15% pricing adjust karein to. Full advanced digital payment abhi bhej dete hain, kripya block kijiye slot.",
    once: "Ma'am, hum high society families me pitch karne ja rahe hain, aapka card pure guests ko showcase karenge! Agar aapne is bridal package me rate adjust kiya, to agle season me custom makeup references main khud share karunga. Beti ki shadi ek hi baar hoti hai ma'am, thoda adjust kar lijiye!",
    behen: "Ma'am, please bridal party makeup pack thoda sahi kijiye na, bhaiya meri behen ki shaadi hai 😭! Sharma ji ki beti ko aapne same signature airbrush kitna sasta diya tha pichle month. Agar is baar bride bilkul shandaar glowing lagi, to pure relatives aapse hi book karenge, aapko lifetime customer bana denge ma'am!"
  }
};

export default function BargainingGenerator() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState('catering');
  const [guilt, setGuilt] = useState('chacha');
  const [tone, setTone] = useState('polite');
  const [originalQuote, setOriginalQuote] = useState('250000');
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  // Calculate customized details
  const generatedText = templates[vendor]?.[guilt] || "Bhaiya, rates thoda adjust kijiye please...😭";

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setToastMsg('Copied to clipboard! Send to WhatsApp now! 📋');
    setTimeout(() => {
      setCopied(false);
      setToastMsg('');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110204] flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin glow-gold" />
        <p className="font-cinzel text-sm text-wedding-gold-light uppercase tracking-widest animate-pulse">Loading strategist room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110204] text-white pb-20 relative">
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
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12 relative z-10 space-y-10">
        
        {/* Banner */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-wedding-gold uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse">
            <Sparkles className="w-4 h-4" /> Emotional Blackmail Engine
          </span>
          <h1 className="font-cinzel text-3xl md:text-4xl font-extrabold text-white">
            Guilt-Powered <span className="text-gold-gradient">Text Generator</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto font-light">
            Adjust the psychological leverages, target specific vendor categories, and copy custom copy-paste bargaining messages.
          </p>
        </div>

        {/* Two-Column Grid: Selectors vs Preview Output */}
        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Left panel: Config Selectors (Col span 2) */}
          <div className="md:col-span-2 space-y-6 bg-wedding-burgundy/40 border border-wedding-gold/15 p-6 rounded-3xl glass-card">
            
            {/* 1. Vendor Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block">Target Vendor</label>
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full bg-wedding-burgundy border border-wedding-gold/25 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-wedding-gold transition-all"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* 2. Leverage Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block">Leverage Card</label>
              <div className="space-y-2.5">
                {guiltLevels.map((gl) => (
                  <button
                    key={gl.id}
                    onClick={() => setGuilt(gl.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex flex-col justify-between transition-all ${guilt === gl.id ? 'border-wedding-gold bg-wedding-crimson/30 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10'}`}
                  >
                    <span className="font-bold text-white block mb-0.5">{gl.name}</span>
                    <span className="text-[10px] text-gray-400 leading-normal">{gl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Original Quote Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-wedding-gold-light uppercase tracking-wider block flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-wedding-gold" /> Current Quote (₹)
              </label>
              <input
                type="number"
                value={originalQuote}
                onChange={(e) => setOriginalQuote(e.target.value)}
                className="w-full bg-wedding-burgundy border border-wedding-gold/25 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-wedding-gold transition-all"
              />
            </div>

          </div>

          {/* Right panel: Preview Output (Col span 3) */}
          <div className="md:col-span-3 space-y-6 flex flex-col justify-between">
            
            <div className="glass-card rounded-3xl border border-wedding-gold/15 p-6 space-y-5 flex-grow flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-wedding-gold/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-wedding-gold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Custom Output hinges
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hinglish Template</span>
                </div>

                <div className="bg-[#2D050B]/30 border border-wedding-gold/10 p-5 rounded-2xl min-h-[220px] flex items-center">
                  <p className="text-sm italic text-wedding-gold-light leading-relaxed font-light">
                    "{generatedText}"
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-wedding-crimson/10 border border-wedding-gold/15 p-4 rounded-xl text-xs text-gray-300 leading-relaxed flex gap-2">
                  <AlertCircle className="w-5 h-5 text-wedding-gold shrink-0 mt-0.5" />
                  <p>
                    <strong>Platform Advice:</strong> Copy this message and paste it directly on WhatsApp. Baba recommends executing this at odd hours (like 11:30 PM) so vendors think about it in bed!
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${copied ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-gradient-to-r from-wedding-gold to-wedding-gold-bright text-black shadow-lg shadow-wedding-gold/25'}`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3px]" /> Copy Successful!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Bargaining Message
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
