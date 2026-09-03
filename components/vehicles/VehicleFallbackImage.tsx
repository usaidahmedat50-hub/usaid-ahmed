'use client';

import React, { useState } from 'react';

interface VehicleFallbackImageProps {
  src?: string | null;
  alt: string;
  brandName?: string;
  modelName?: string;
  bodyType?: string;
  className?: string;
}

export default function VehicleFallbackImage({
  src,
  alt,
  brandName = '',
  modelName = '',
  bodyType = '',
  className = 'w-full h-full object-cover',
}: VehicleFallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || '/images/placeholder-ev.svg');
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc !== '/images/placeholder-ev.svg') {
      setImgSrc('/images/placeholder-ev.svg');
    } else {
      setHasError(true);
    }
  };

  if (hasError || !src) {
    const formattedBrand = brandName.trim();
    const formattedModel = modelName.trim();
    const formattedBody = bodyType.trim();

    let title = formattedBrand && formattedModel
      ? `${formattedBrand} ${formattedModel}`
      : (formattedModel || formattedBrand || 'ELECTRIC VEHICLE');

    title = title.toUpperCase();

    const badgeLabel = formattedBody
      ? `${title} • ${formattedBody.toUpperCase()}`
      : title;

    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none rounded-lg bg-slate-100"
      >
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm px-3.5 py-2 rounded-xl flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-800 tracking-wider">
            {badgeLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}
