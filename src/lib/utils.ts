import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function maskAddress(address: string, maskLength = 6) {
  const len = address.length;
  return `${address.slice(0, 2 + maskLength)}...${address?.slice(
    len - maskLength,
    len,
  )}`;
}

export const formatAmountToPrecision = (amount: string | number, precision = 4) => {
  if (Number(amount) < 1) {
    return new Intl.NumberFormat('en-US', {
      maximumSignificantDigits: precision,
    }).format(Number(amount));
  } else {
    const factor = Math.pow(10, precision);
    return Math.floor(Number(amount) * factor) / factor;
  }
};