import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, IndianRupee, Users, Heart, ListChecks, ArrowRight, Loader2, BookHeart, Users2, Map } from 'lucide-react';

export interface FormData {
  religion: string;
  community: string;
  state: string;
  city: string;
  budget: string;
  guestCount: string;
  priorities: string[];
}

interface MultiStepFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const steps = [
  { id: 'religion', title: 'Religion', icon: BookHeart },
  { id: 'community', title: 'Community', icon: Users2 },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'budget', title: 'Budget', icon: IndianRupee },
  { id: 'guests', title: 'Guests', icon: Users },
  { id: 'priorities', title: 'Priorities', icon: ListChecks },
];

const religionOptions = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Interfaith'];

const priorityOptions = [
  'Premium Food & Catering',
  'Luxurious Venue',
  'High-end Photography',
  'Elaborate Decor',
  'Designer Outfits',
  'Entertainment & Music',
  'Guest Experience',
  'Cultural Authenticity'
];

export default function MultiStepForm({ onSubmit, isLoading }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    religion: '',
    community: '',
    state: '',
    city: '',
    budget: '',
    guestCount: '',
    priorities: [],
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const togglePriority = (priority: string) => {
    setFormData(prev => {
      const current = prev.priorities;
      if (current.includes(priority)) {
        return { ...prev, priorities: current.filter(p => p !== priority) };
      } else {
        if (current.length >= 3) return prev;
        return { ...prev, priorities: [...current, priority] };
      }
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.religion.length > 0;
      case 1: return true; // Community is optional
      case 2: return formData.state.length > 2 && formData.city.length > 2;
      case 3: return parseInt(formData.budget) > 50000;
      case 4: return parseInt(formData.guestCount) > 0;
      case 5: return formData.priorities.length > 0;
      default: return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-2xl">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8 relative px-2">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-500 -z-10"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index <= currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center group relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                <StepIcon className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-6 text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="min-h-[300px] flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What is the religion?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">This helps us tailor the specific rituals and traditions.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {religionOptions.map((rel) => (
                    <button
                      key={rel}
                      onClick={() => setFormData({ ...formData, religion: rel })}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        formData.religion === rel
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                          : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Specific Community/Sub-culture?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Optional. E.g., Punjabi, Tamil Brahmin, Syrian Christian, Marwari.</p>
                <input
                  type="text"
                  placeholder="e.g. Punjabi"
                  value={formData.community}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                  className="w-full px-6 py-4 text-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  autoFocus
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Where is the wedding happening?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Enter the State and City to pull local market intelligence.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="State (e.g. Rajasthan)"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-6 py-4 text-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="City (e.g. Udaipur)"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-6 py-4 text-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What is your estimated total budget?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">In Indian Rupees (₹). We will build 3 tiers based on this.</p>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-lg">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 2500000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full pl-12 pr-6 py-4 text-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How many guests are you expecting?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">An approximate count helps with venue and catering estimates.</p>
                <input
                  type="number"
                  placeholder="e.g. 300"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="w-full px-6 py-4 text-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                  autoFocus
                />
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What are your top 3 priorities?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Select up to 3 to help us tailor the strategy.</p>
                <div className="flex flex-wrap gap-3">
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => togglePriority(priority)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                        formData.priorities.includes(priority)
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isLoading}
          className={`px-6 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 transition-opacity ${currentStep === 0 ? 'opacity-0' : 'opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isStepValid() || isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Strategy...
            </>
          ) : currentStep === steps.length - 1 ? (
            'Generate Consultant Report'
          ) : (
            <>
              Next
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
