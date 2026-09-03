export function formatPkr(amount: number): string {
  if (!amount || amount <= 0) return 'Price on Request';
  if (amount >= 10000000) {
    return `PKR ${(amount / 10000000).toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    return `PKR ${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function formatKm(km: number): string {
  if (!km || km <= 0) return 'N/A';
  return `${km.toLocaleString()} km`;
}

export function formatKwh(kwh: number): string {
  if (!kwh || kwh <= 0) return 'N/A';
  return `${kwh} kWh`;
}
