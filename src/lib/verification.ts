// PakevFinder.com — Verification & Trust Business Logic
// Strictly implements docs/03-RULES.md (Rule 1, Rule 2, Rule 4)

import { VerificationStatus } from './types';

export const PRICE_STALENESS_DAYS = 90;
export const SPEC_STALENESS_DAYS = 180;

/**
 * Computes effective verification status taking staleness thresholds into account.
 * If older than 90 days (price) or 180 days (spec), automatically flags as outdated.
 */
export function computeVerificationStatus(
  status: VerificationStatus,
  lastVerifiedAt: string | null | undefined,
  type: 'price' | 'spec'
): VerificationStatus {
  if (status === 'unverified' || !lastVerifiedAt) {
    return 'unverified';
  }

  const verifiedDate = new Date(lastVerifiedAt);
  if (isNaN(verifiedDate.getTime())) {
    return status;
  }

  const now = new Date();
  const diffDays = Math.floor((now.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24));
  const maxDays = type === 'price' ? PRICE_STALENESS_DAYS : SPEC_STALENESS_DAYS;

  if (diffDays > maxDays) {
    return 'outdated';
  }

  return status;
}

export interface VerificationBadgeTheme {
  label: string;
  shortLabel: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  iconName: 'ShieldCheck' | 'AlertTriangle' | 'HelpCircle' | 'Clock';
  description: string;
}

export function getVerificationTheme(status: VerificationStatus): VerificationBadgeTheme {
  switch (status) {
    case 'verified':
      return {
        label: 'Verified Primary Source',
        shortLabel: 'Verified',
        bgClass: 'bg-emerald-500/10 dark:bg-emerald-950/40',
        borderClass: 'border-emerald-500/30 dark:border-emerald-500/30',
        textClass: 'text-emerald-700 dark:text-emerald-400',
        badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        iconName: 'ShieldCheck',
        description: 'Directly verified from official manufacturer press release, distributor tariff, or regulatory document.',
      };
    case 'partially_verified':
      return {
        label: 'Partially Verified',
        shortLabel: 'Partially Verified',
        bgClass: 'bg-amber-500/10 dark:bg-amber-950/40',
        borderClass: 'border-amber-500/30 dark:border-amber-500/30',
        textClass: 'text-amber-700 dark:text-amber-400',
        badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
        iconName: 'AlertTriangle',
        description: 'Sourced from credible industry media or dealer quotes, pending direct manufacturer tariff confirmation.',
      };
    case 'outdated':
      return {
        label: 'Outdated (>90d / 180d)',
        shortLabel: 'Outdated',
        bgClass: 'bg-rose-500/10 dark:bg-rose-950/40',
        borderClass: 'border-rose-500/30 dark:border-rose-500/30',
        textClass: 'text-rose-700 dark:text-rose-400',
        badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
        iconName: 'Clock',
        description: 'Previously verified, but has exceeded the verification validity threshold and needs re-checking.',
      };
    case 'unverified':
    default:
      return {
        label: 'Unverified / Pending',
        shortLabel: 'Unverified',
        bgClass: 'bg-slate-500/10 dark:bg-slate-800/60',
        borderClass: 'border-slate-500/20 dark:border-slate-700',
        textClass: 'text-slate-600 dark:text-slate-400',
        badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
        iconName: 'HelpCircle',
        description: 'Estimated or market hearsay without an authoritative primary citation. Treated with caution.',
      };
  }
}

/**
 * Formats a Pakistani Rupee amount into Crore / Lakh or standard formatted integer.
 * e.g. 14,990,000 -> "PKR 1.50 Crore (14,990,000)" or "PKR 1.50 Crore"
 */
export function formatPKR(amount: number | null | undefined, includeExact = false): string {
  if (amount === null || amount === undefined || isNaN(amount) || amount === 0) {
    return 'Price on request';
  }

  const crore = amount / 10000000;
  const lakh = amount / 100000;

  if (crore >= 1) {
    const croreStr = `PKR ${crore.toFixed(2)} Crore`;
    return includeExact ? `${croreStr} (Rs. ${amount.toLocaleString('en-PK')})` : croreStr;
  } else if (lakh >= 1) {
    const lakhStr = `PKR ${lakh.toFixed(2)} Lakh`;
    return includeExact ? `${lakhStr} (Rs. ${amount.toLocaleString('en-PK')})` : lakhStr;
  }

  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Not verified';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
