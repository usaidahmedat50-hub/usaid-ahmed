export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified' | 'outdated';

export interface VerificationBadgeConfig {
  status: VerificationStatus;
  label: string;
  badgeClass: string;
  iconColorClass: string;
  description: string;
}

export function getVerificationBadgeConfig(status: VerificationStatus = 'verified'): VerificationBadgeConfig {
  switch (status) {
    case 'verified':
      return {
        status: 'verified',
        label: 'Verified Data',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        iconColorClass: 'text-emerald-600',
        description: 'Verified from official manufacturer tariff or official press release.',
      };
    case 'partially_verified':
      return {
        status: 'partially_verified',
        label: 'Partially Verified',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        iconColorClass: 'text-amber-600',
        description: 'Basic specifications verified; local distributor pricing pending official quote.',
      };
    case 'outdated':
      return {
        status: 'outdated',
        label: 'Historical / Outdated',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        iconColorClass: 'text-rose-600',
        description: 'Information may have changed following recent tariff updates.',
      };
    case 'unverified':
    default:
      return {
        status: 'unverified',
        label: 'Unverified Preview',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        iconColorClass: 'text-slate-500',
        description: 'Preliminary specs compiled from international automotive filings.',
      };
  }
}
