'use client';

import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { ConnectorType } from '@/lib/types';
import { submitStationForReview } from '@/lib/stations';

interface StationSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StationSubmitModal({ isOpen, onClose }: StationSubmitModalProps) {
  const [name, setName] = useState('');
  const [operator, setOperator] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [powerKw, setPowerKw] = useState('60');
  const [selectedConnectors, setSelectedConnectors] = useState<ConnectorType[]>(['CCS2']);
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const connectorOptions: ConnectorType[] = ['CCS2', 'GB/T', 'Type 2', 'CHAdeMO', 'Tesla Supercharger'];

  const toggleConnector = (conn: ConnectorType) => {
    if (selectedConnectors.includes(conn)) {
      setSelectedConnectors(selectedConnectors.filter((c) => c !== conn));
    } else {
      setSelectedConnectors([...selectedConnectors, conn]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      setSubmitResult({
        success: false,
        message: 'Please provide valid decimal coordinates for latitude and longitude.',
      });
      setIsSubmitting(false);
      return;
    }

    const result = await submitStationForReview({
      name,
      network_operator: operator || undefined,
      city,
      address: address || undefined,
      latitude,
      longitude,
      power_kw: parseFloat(powerKw) || 30,
      connector_types: selectedConnectors,
      submitter_contact: contact || undefined,
      notes: notes || undefined,
    });

    setIsSubmitting(false);
    setSubmitResult(result);

    if (result.success) {
      setTimeout(() => {
        onClose();
        setSubmitResult(null);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Submit a Charging Station</h3>
              <p className="text-[11px] text-slate-500">Contribute to Pakistan&apos;s verified public charging directory</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitResult && (
          <div
            className={`mt-4 p-3 rounded text-xs flex items-center gap-2 ${
              submitResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {submitResult.success ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{submitResult.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Station Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. ChargeIn Bhera Service Area M-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Network / Operator</label>
              <input
                type="text"
                placeholder="e.g. TotalEnergies, PSO, Shell"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">City / Motorway *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lahore, Sukkur, M-2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Address / Landmark</label>
            <input
              type="text"
              placeholder="e.g. DHA Phase 5 Commercial Broadway"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Latitude *</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 31.4704"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Longitude *</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 74.4087"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Max Power (kW)</label>
            <input
              type="number"
              placeholder="e.g. 60 or 120"
              value={powerKw}
              onChange={(e) => setPowerKw(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Connector Standards</label>
            <div className="flex flex-wrap gap-2">
              {connectorOptions.map((conn) => {
                const isSelected = selectedConnectors.includes(conn);
                return (
                  <button
                    key={conn}
                    type="button"
                    onClick={() => toggleConnector(conn)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {conn}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Your Email / WhatsApp (Optional)</label>
            <input
              type="text"
              placeholder="For editorial verification if questions arise"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {isSubmitting ? 'Submitting for Editorial Review...' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
