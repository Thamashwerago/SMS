// src/utils/formatDate.ts
/**
 * formatDate.ts
 *
 * Utility functions for formatting dates.
 */

/**
 * Formats a given date into a human-readable string.
 *
 * @param dateInput - The date to format (as a Date object or a date string).
 * @param locale - A BCP 47 language tag for locale formatting (default: 'en-US').
 * @param options - Optional Intl.DateTimeFormat options.
 * @returns A formatted date string, or 'Invalid Date' if the input is invalid.
 */
export function formatDate(
    dateInput: Date | string,
    locale: string = 'en-US',
    options?: Intl.DateTimeFormatOptions
  ): string {
    const date: Date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      dateStyle: 'medium',
      timeStyle: 'short',
    };
  
    const formatOptions = { ...defaultOptions, ...options };
    return new Intl.DateTimeFormat(locale, formatOptions).format(date);
  }
  
  /**
   * Formats a given date into a relative time string (e.g., "5 minutes ago").
   *
   * @param dateInput - The date to compare (as a Date object or a date string).
   * @param locale - A BCP 47 language tag for locale formatting (default: 'en-US').
   * @returns A relative time string or 'Invalid Date' if the input is invalid.
   */
  export function formatRelativeDate(
    dateInput: Date | string,
    locale: string = 'en-US'
  ): string {
    const date: Date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
    // Calculate differences in various units.
    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(diff / (1000 * 60));
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7));
    const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365));
  
    if (Math.abs(years) >= 1) {
      return rtf.format(-years, 'year');
    } else if (Math.abs(months) >= 1) {
      return rtf.format(-months, 'month');
    } else if (Math.abs(weeks) >= 1) {
      return rtf.format(-weeks, 'week');
    } else if (Math.abs(days) >= 1) {
      return rtf.format(-days, 'day');
    } else if (Math.abs(hours) >= 1) {
      return rtf.format(-hours, 'hour');
    } else if (Math.abs(minutes) >= 1) {
      return rtf.format(-minutes, 'minute');
    } else {
      return rtf.format(-seconds, 'second');
    }
  }
  