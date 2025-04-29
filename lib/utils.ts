import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean };

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs Class names to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  try {
    return twMerge(clsx(inputs));
  } catch (error) {
    console.error("Error in cn function:", error);
    // Return a fallback when there's an error
    return inputs.filter(Boolean).join(" ");
  }
}

/**
 * Format a number as currency
 * @param amount Amount to format
 * @param currency Currency code (USD, EUR, etc.)
 * @param locale Locale for formatting (defaults to 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
