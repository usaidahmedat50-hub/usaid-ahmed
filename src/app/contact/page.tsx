'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Data Correction / Price Revision',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114] mb-2">
          Contact Editorial
        </h1>
        <p className="text-xs text-gray-500">
          Reach our editorial team for tariff updates, vehicle spec corrections, or general inquiries.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-lg bg-white border border-gray-200 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <CheckCircle2 className="w-6 h-6 text-blue-700" />
          </div>
          <h2 className="text-lg font-semibold text-[#111114]">Message Received</h2>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            Thank you for contacting PakEVFinder editorial. We review all submitted corrections and tariff updates directly against distributor records.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-blue-700 font-semibold hover:underline pt-2 inline-block"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ali Khan"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs text-[#111114] placeholder:text-gray-400 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ali@example.com"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs text-[#111114] placeholder:text-gray-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs text-[#111114] focus:outline-none focus:border-blue-600"
            >
              <option value="Data Correction / Price Revision">Data Correction / Price Revision</option>
              <option value="New Charging Station Info">New Charging Station Info</option>
              <option value="Distributor Announcement">Distributor Announcement</option>
              <option value="Other Inquiries">Other Inquiries</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Details & Source Reference
            </label>
            <textarea
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide specific vehicle/station details, URL links to official circulars, or your feedback..."
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-xs text-[#111114] placeholder:text-gray-400 focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      )}

      <div className="mt-12 p-5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-2 text-[#111114] font-semibold mb-1">
          <Mail className="w-4 h-4 text-blue-700" />
          <span>Editorial Integrity Notice</span>
        </div>
        <p>
          PakEVFinder is an independent publisher. We do not accept payment to alter published vehicle specifications or remove verified pricing records.
        </p>
      </div>
    </div>
  );
}
