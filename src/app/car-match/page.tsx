import React from 'react';
import type { Metadata } from 'next';
import { getAllVehicles } from '@/lib/vehicles';
import { CarMatchQuiz } from '@/components/quiz/CarMatchQuiz';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Car Match Quiz — Find Your Ideal EV in Pakistan | PakEVFinder',
  description:
    'Take our 60-second interactive questionnaire to discover the best electric or hybrid vehicle tailored to your daily commute, budget, seating, and home charging setup.',
};

export const revalidate = 3600;

export default async function CarMatchPage() {
  const vehicles = await getAllVehicles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header Block */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive Recommendation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111114] tracking-tight">
          Find Your Perfect EV Match
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Answer 5 quick lifestyle questions to receive an unbiased, data-backed shortlist of electric cars sold or upcoming in Pakistan.
        </p>
      </div>

      {/* Interactive Quiz Component */}
      <CarMatchQuiz vehicles={vehicles} />
    </div>
  );
}
