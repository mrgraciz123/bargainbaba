'use client';

import React, { useState } from 'react';
import MultiStepForm, { FormData } from '@/components/wedding-agent/MultiStepForm';
import ResultsDashboard from '@/components/wedding-agent/ResultsDashboard';

export default function WeddingAgentPage() {
  const [resultData, setResultData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationContext, setLocationContext] = useState({ city: '', state: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setLocationContext({ city: formData.city, state: formData.state });
    
    try {
      const res = await fetch('/api/wedding-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await res.json();
      setResultData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 selection:bg-indigo-200 dark:selection:bg-indigo-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-300/30 dark:bg-rose-900/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {!resultData ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold font-serif text-gray-900 dark:text-white mb-6">
                Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Dream Wedding</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Tell us about your cultural background and vision. Our AI consultant will craft personalized rituals, timelines, and financial strategies.
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl max-w-2xl w-full text-center">
                {error}
              </div>
            )}

            <MultiStepForm onSubmit={handleSubmit} isLoading={isLoading} />
          </>
        ) : (
          <ResultsDashboard 
            data={resultData} 
            onReset={handleReset} 
            city={locationContext.city} 
            state={locationContext.state} 
          />
        )}
      </main>
    </div>
  );
}
