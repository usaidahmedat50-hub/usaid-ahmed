'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle, Clock, ExternalLink, X, Info } from 'lucide-react';
import { VerificationStatus } from '@/lib/types';
import { getVerificationTheme, formatDate } from '@/lib/verification';

interface VerificationBadgeProps {
  status: VerificationStatus;
  sourceUrl?: string | null;
  lastVerifiedAt?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  interactive?: boolean;
}

export function VerificationBadge({
  status,
  sourceUrl,
  lastVerifiedAt,
  size = 'md',
  showLabel = true,
  interactive = true,
}: VerificationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = getVerificationTheme(status);

  const renderIcon = () => {
    const iconProps = {
      className: size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5',
    };
    switch (theme.iconName) {
      case 'ShieldCheck':
        return <ShieldCheck {...iconProps} className={`${iconProps.className} text-emerald-600`} />;
      case 'AlertTriangle':
        return <AlertTriangle {...iconProps} className={`${iconProps.className} text-amber-600`} />;
      case 'Clock':
        return <Clock {...iconProps} className={`${iconProps.className} text-rose-600`} />;
      case 'HelpCircle':
      default:
        return <HelpCircle {...iconProps} className={`${iconProps.className} text-gray-500`} />;
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const badgeElement = (
    <button
      type="button"
      onClick={(e) => {
        if (interactive) {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }
      }}
      className={`inline-flex items-center font-medium rounded-full border transition-all ${sizeClasses} ${
        interactive ? 'cursor-pointer hover:opacity-90 active:scale-95' : 'cursor-default'
      } bg-white text-gray-800 border-gray-200`}
      title={`Status: ${theme.label}. Click to view verification citation.`}
    >
      {renderIcon()}
      {showLabel && <span>{theme.shortLabel}</span>}
      {interactive && <Info className="w-2.5 h-2.5 opacity-60 ml-0.5 text-gray-400" />}
    </button>
  );

  return (
    <span className="relative inline-block">
      {badgeElement}

      {/* Citation Popover Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div
            className="fixed md:absolute z-50 top-1/2 left-1/2 md:top-full md:left-0 -translate-x-1/2 -translate-y-1/2 md:translate-y-2 md:translate-x-0 w-[90vw] max-w-sm bg-white border border-gray-200 p-4 rounded-lg shadow-xl text-left text-[#111114] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {renderIcon()}
                <span className="font-semibold text-sm text-[#111114]">{theme.label}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-[#111114] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
              {theme.description}
            </p>

            <div className="mt-3.5 space-y-2 pt-2 border-t border-gray-100 text-xs">
              <div className="flex justify-between items-center text-gray-500">
                <span>Last Verified:</span>
                <span className="font-mono text-gray-700">{formatDate(lastVerifiedAt)}</span>
              </div>

              {sourceUrl ? (
                <div className="pt-1">
                  <span className="text-gray-500 block mb-1">Primary Source Attribution:</span>
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-700 hover:underline font-medium break-all bg-blue-50 border border-blue-200 px-2 py-1 rounded"
                  >
                    <span>{new URL(sourceUrl).hostname}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              ) : (
                <p className="text-gray-400 italic text-[11px]">
                  No primary URL attached. Awaiting official tariff documentation.
                </p>
              )}
            </div>

            <div className="mt-3 text-[10px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              <strong>Data Policy:</strong> PakevFinder strictly disallows invented specs.
            </div>
          </div>
        </>
      )}
    </span>
  );
}
