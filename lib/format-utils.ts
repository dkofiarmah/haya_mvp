/**
 * Formats a duration in minutes to a human-readable format.
 * @param minutes - The duration in minutes
 * @returns A formatted string like "2 hours 30 minutes" or "45 minutes"
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return 'N/A'
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} hr ${remainingMinutes} min`
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  } else {
    return `${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`
  }
}

/**
 * Formats a monetary amount with the specified currency code.
 * @param amount - The amount to format
 * @param currencyCode - The ISO currency code (default: 'USD')
 * @returns A formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  if (amount === undefined || amount === null) return 'N/A'
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
  } catch (error) {
    return `${currencyCode} ${amount.toFixed(2)}`
  }
}

/**
 * Formats a date object or ISO date string to a human-readable format.
 * @param date - Date object or ISO date string
 * @param format - Format style: 'short', 'medium', 'long', or 'full' (default: 'medium')
 * @returns A formatted date string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  if (!date) return 'N/A'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return 'Invalid date'
  
  const options: Intl.DateTimeFormatOptions = { 
    dateStyle: format 
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj)
}

/**
 * Formats a timestamp to a relative time string (e.g., "2 hours ago")
 * @param timestamp - Date object or ISO date string
 * @returns A relative time string
 */
export function formatRelativeTime(timestamp: Date | string): string {
  if (!timestamp) return 'N/A'
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  
  if (isNaN(date.getTime())) return 'Invalid date'
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }
  
  let counter
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(diffInSeconds / secondsInUnit)
    if (counter > 0) {
      return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`
    }
  }
  
  return 'Just now'
}

/**
 * Truncates text to a specified length and adds ellipsis if needed.
 * @param text - The input text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength) + '...'
}
