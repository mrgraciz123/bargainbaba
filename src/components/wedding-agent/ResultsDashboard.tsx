import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import CulturalInsights, { CulturalIntelligence } from './CulturalInsights';
import PlanCard, { Plan } from './PlanCard';

interface ResultsDashboardProps {
  data: {
    culturalIntelligence: CulturalIntelligence;
    plans: Plan[];
  };
  onReset: () => void;
  city: string;
  state: string;
}

export default function ResultsDashboard({ data, onReset, city, state }: ResultsDashboardProps) {
  if (!data || !data.culturalIntelligence || !data.plans) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Failed to load insights. Please try again.</p>
        <button onClick={onReset} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full">Go Back</button>
      </div>
    );
  }

  // Find the plan with the highest compatibility score to mark as recommended
  const maxScore = Math.max(...data.plans.map(p => p.compatibilityScore));

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <button
          onClick={onReset}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Refine Search
        </button>
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mb-4">
          Your Cultural <span className="text-indigo-600 dark:text-indigo-400">Wedding Blueprint</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto flex items-center justify-center gap-2">
          <MapPin className="w-5 h-5 text-rose-500" />
          Tailored for {city}, {state}
        </p>
      </motion.div>

      <div className="space-y-16">
        {/* Cultural Insights Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Cultural Intelligence</h2>
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-grow" />
          </div>
          <CulturalInsights data={data.culturalIntelligence} />
        </section>

        {/* Financial Plans Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Financial Strategies</h2>
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-grow" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {data.plans.map((plan, index) => (
              <PlanCard 
                key={index} 
                plan={plan} 
                index={index} 
                isRecommended={plan.compatibilityScore === maxScore}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
