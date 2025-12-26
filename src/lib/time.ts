/**
 * Calculate the time difference between a date and now, and return a human-readable string
 * @param date - The date to calculate from
 * @returns A human-readable time difference string (ex: 2 hours ago, 3 days ago)
 */
export function getTimeSince(date: string | Date): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInMs = now.getTime() - pastDate.getTime();

  // Convert to different time units
  const minuteInMs = 60 * 1000;
  const hourInMs = 60 * minuteInMs;
  const dayInMs = 24 * hourInMs;
  const weekInMs = 7 * dayInMs;
  const monthInMs = 30 * dayInMs;
  const yearInMs = 365 * dayInMs;

  if (diffInMs < minuteInMs) {
    const seconds = Math.floor(diffInMs / 1000);
    return seconds <= 1 ? "just now" : `${seconds} seconds ago`;
  } else if (diffInMs < hourInMs) {
    const minutes = Math.floor(diffInMs / minuteInMs);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (diffInMs < dayInMs) {
    const hours = Math.floor(diffInMs / hourInMs);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (diffInMs < weekInMs) {
    const days = Math.floor(diffInMs / dayInMs);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (diffInMs < monthInMs) {
    const weeks = Math.floor(diffInMs / weekInMs);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (diffInMs < yearInMs) {
    const months = Math.floor(diffInMs / monthInMs);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    const years = Math.floor(diffInMs / yearInMs);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
}

/**
 * Format a date for display in a short format
 * @param date - The date to format
 * @returns A short date string (e.g., "Jan 15, 2024")
 */
export function formatShortDate(date: string | Date): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      dateObj.getFullYear() !== new Date().getFullYear()
        ? "numeric"
        : undefined,
  });
}

/**
 * Format a date for display in a long format
 * @param date - The date to format
 * @returns A long date string (e.g., "January 15, 2024 at 2:30 PM")
 */
export function formatLongDate(date: string | Date): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns True if the date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = new Date(date);
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is within the last 24 hours
 * @param date - The date to check
 * @returns True if the date is within the last 24 hours
 */
export function isWithin24Hours(date: string | Date): boolean {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();

  return diffInMs <= 24 * 60 * 60 * 1000;
}

/**
 * Add days to a date and return ISO string
 * @param date - The base date
 * @param days - Number of days to add
 * @returns ISO string of the new date
 */
export function addDaysIso(date: string | Date, days: number): string {
  const dateObj = new Date(date);
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result.toISOString();
}
