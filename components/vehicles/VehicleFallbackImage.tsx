'use client';

import React, { useState } from 'react';
import { Car, Zap } from 'lucide-react';

interface VehicleFallbackImageProps {
  src: string;
  alt: string;
  brandName: string;
  modelName: string;
  bodyType: string;
  className?: string;
}

export default function VehicleFallbackImage({
  src,
  alt,
  brandName,
  modelName,
  bodyType,
  className = 'w-full h-full object-cover',
}: VehicleFallbackImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-blue-600/10 text-blue-600 p-3 rounded-2xl mb-2 border border-blue-200/50">
            <Car className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase bg-blue-100/80 px-2.5 py-0.5 rounded-full mb-1">
            {bodyType} • ELECTRIC
          </span>
          <h4 className="text-base font-black text-slate-900 tracking-tight leading-tight">
            {brandName} {modelName}
          </h4>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" /> Official Specs Verified
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
