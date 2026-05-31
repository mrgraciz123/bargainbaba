import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, MapPin, Sparkles, Camera, Map } from 'lucide-react';

export interface Theme {
  name: string;
  compatibilityScore: number;
  estimatedBudgetRange: string;
  pros: string[];
  cons: string[];
  venueStyle: string;
  decorStyle: string;
  photographyStyle: string;
  localMarketTrends: string;
  whyRecommended: string;
}

interface ThemeCardProps {
  theme: Theme;
  index: number;
}

export default function ThemeCard({ theme, index }: ThemeCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 80) return 'text-blue-500';
    return 'text-amber-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-serif">
            {theme.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
              {theme.estimatedBudgetRange}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={28 * 2 * Math.PI}
                strokeDashoffset={28 * 2 * Math.PI - (theme.compatibilityScore / 100) * 28 * 2 * Math.PI}
                className={getScoreColor(theme.compatibilityScore)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-900 dark:text-white">
              {theme.compatibilityScore}%
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Match</span>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
        <h4 className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-semibold mb-2">
          <Sparkles className="w-5 h-5" />
          Why This Theme?
        </h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          {theme.whyRecommended}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Pros
          </h4>
          <ul className="space-y-2">
            {theme.pros.map((pro, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            Cons
          </h4>
          <ul className="space-y-2">
            {theme.cons.map((con, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Style Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <MapPin className="w-5 h-5 text-rose-500 mb-2" />
            <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Venue</h5>
            <p className="text-sm text-gray-800 dark:text-gray-200">{theme.venueStyle}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <Sparkles className="w-5 h-5 text-amber-500 mb-2" />
            <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Decor</h5>
            <p className="text-sm text-gray-800 dark:text-gray-200">{theme.decorStyle}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <Camera className="w-5 h-5 text-blue-500 mb-2" />
            <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Photography</h5>
            <p className="text-sm text-gray-800 dark:text-gray-200">{theme.photographyStyle}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
          <Map className="w-4 h-4 text-purple-500" />
          Local Market Trends
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {theme.localMarketTrends}
        </p>
      </div>
    </motion.div>
  );
}
