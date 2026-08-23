export function formatPkr(amountPkr: number): string {
  if (amountPkr >= 10000000) {
    const crore = amountPkr / 10000000;
    return `PKR ${crore.toFixed(2)} Crore`;
  } else if (amountPkr >= 100000) {
    const lakh = amountPkr / 100000;
    return `PKR ${lakh.toFixed(2)} Lakh`;
  }
  return `PKR ${amountPkr.toLocaleString()}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}
