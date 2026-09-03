import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema, createFaqPageSchema } from '@/components/seo/SchemaScript';
import { getAllFaqs } from '@/lib/data/mock-db';
import { HelpCircle, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'EV Frequently Asked Questions — PakevFinder FAQ Directory',
  description: 'Find answers to common EV questions in Pakistan: charging speeds, battery life, electricity costs, solar integration, and customs duties.',
  alternates: {
    canonical: 'https://pakevfinder.com/faq',
  },
};

export default function FaqIndexPage() {
  const faqs = getAllFaqs();

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'EV FAQs', url: 'https://pakevfinder.com/faq' },
  ];

  const faqSchemaData = faqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript
        schemaData={[
          createBreadcrumbSchema(breadcrumbs),
          createFaqPageSchema(faqSchemaData),
        ]}
      />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Knowledge Base
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
            {faqs.length} Answers Indexed
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Electric Vehicle Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Direct, concise answers to essential questions regarding EV charging, battery lifespan, home solar charging, and Pakistani import regulations.
        </p>
      </div>

      <AnswerFirstSummary
        answer={`PakevFinder FAQ directory contains ${faqs.length} verified answers addressing charging speeds, electricity rates, battery warranties, and intercity route planning across Pakistan.`}
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Knowledge Base"
      />

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
              {f.question}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed pl-7">
              {f.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
