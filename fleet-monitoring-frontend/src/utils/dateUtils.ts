import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format date for display
 */
export const formatDate = (date: string | Date, formatStr = 'yyyy-MM-dd HH:mm:ss'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format date relative to now
 */
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Check if date is within last N minutes
 */
export const isWithinLastMinutes = (date: string | Date, minutes: number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  return diffMs <= minutes * 60 * 1000;
};
