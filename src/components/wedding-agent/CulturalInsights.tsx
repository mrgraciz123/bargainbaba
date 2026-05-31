import React from 'react';
import { motion } from 'framer-motion';
import { BookHeart, CalendarClock, ShoppingBag, Store, PieChart, Sparkles, CheckCircle2 } from 'lucide-react';

export interface CulturalIntelligence {
  requiredRituals: string[];
  recommendedTimeline: { day: string; events: string }[];
  procurementRequirements: string[];
  vendorCategoriesNeeded: string[];
  costAllocationStrategy: { category: string; percentage: number }[];
  themeRecommendations: string[];
  culturalBestPractices: string[];
}

export default function CulturalInsights({ data }: { data: CulturalIntelligence }) {
  return (
    <div className="space-y-8">
      {/* Timeline & Rituals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookHeart className="text-rose-500 w-6 h-6" />
            Cultural Rituals & Practices
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-2">Required Rituals</h4>
              <ul className="space-y-2">
                {data.requiredRituals.map((ritual, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    {ritual}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-2">Best Practices</h4>
              <ul className="space-y-2">
                {data.culturalBestPractices.map((practice, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {practice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CalendarClock className="text-indigo-500 w-6 h-6" />
            Recommended Timeline
          </h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-200 dark:before:via-indigo-800 before:to-transparent">
            {data.recommendedTimeline.map((item, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-indigo-500 bg-white dark:bg-gray-900 group-[.is-active]:bg-indigo-500 text-indigo-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 shadow-sm">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">{item.day}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.events}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Procurement & Budget Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl p-6 lg:col-span-2"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingBag className="text-amber-500 w-6 h-6" />
            Procurement & Vendors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-500" /> Key Items
              </h4>
              <ul className="space-y-2">
                {data.procurementRequirements.map((req, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <Store className="w-4 h-4 text-blue-500" /> Vendor Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.vendorCategoriesNeeded.map((cat, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-100 dark:border-blue-800/50">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> Themes
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.themeRecommendations.map((theme, i) => (
                <span key={i} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-100 dark:border-purple-800/50">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <PieChart className="text-emerald-500 w-6 h-6" />
            Cost Allocation
          </h3>
          <div className="space-y-4">
            {data.costAllocationStrategy.map((alloc, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{alloc.category}</span>
                  <span className="text-gray-500 dark:text-gray-400">{alloc.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${alloc.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
