'use client';

import React from 'react';
import VehicleImage from '@/components/VehicleImage';

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
  return (
    <VehicleImage
      src={src}
      alt={alt}
      brandName={brandName}
      modelName={modelName}
      bodyType={bodyType}
      className={className}
    />
  );
}
