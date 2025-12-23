/**
 * Date utility functions
 */

/**
 * Check if date is expired
 */
export const isExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};

/**
 * Add minutes to current date
 */
export const addMinutes = (minutes: number, fromDate = new Date()): Date => {
  return new Date(fromDate.getTime() + minutes * 60 * 1000);
};

/**
 * Add hours to current date
 */
export const addHours = (hours: number, fromDate = new Date()): Date => {
  return new Date(fromDate.getTime() + hours * 60 * 60 * 1000);
};

/**
 * Add days to current date
 */
export const addDays = (days: number, fromDate = new Date()): Date => {
  return new Date(fromDate.getTime() + days * 24 * 60 * 60 * 1000);
};

/**
 * Format date to ISO string with timezone
 */
export const formatDateISO = (date: Date = new Date()): string => {
  return date.toISOString();
};

/**
 * Get time difference in minutes
 */
export const getMinutesDifference = (date1: Date, date2: Date): number => {
  return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60);
};