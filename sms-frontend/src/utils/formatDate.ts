// src/utils/formatDate.ts

/**
 * formatDate.ts
 *
 * This module provides a utility function for formatting dates in a secure and advanced manner.
 * It leverages the built-in Intl.DateTimeFormat API to format dates according to locale and custom options.
 *
 * Security Considerations:
 * - Uses built-in internationalization APIs which are well-tested and secure.
 * - Validates the input date to avoid processing invalid or malicious data.
 * - Error handling is in place to prevent application crashes and to log errors for debugging.
 *
 * Usage Example:
 *   const formatted = formatDate(new Date(), "en-US", { year: "numeric", month: "long", day: "numeric" });
 *   console.log(formatted); // e.g., "September 30, 2023"
 */

/**
 * Formats a given date according to the specified locale and formatting options.
 *
 * @param dateInput - The date to format (can be a Date object or a valid date string).
 * @param locale - A BCP 47 language tag for locale formatting (default is 'en-US').
 * @param options - Optional formatting options for Intl.DateTimeFormat.
 * @returns A string representing the formatted date.
 */
export const formatDate = (
    dateInput: Date | string,
    locale: string = 'en-US',
    options?: Intl.DateTimeFormatOptions
  ): string => {
    try {
      // Convert dateInput to a Date object if it's a string.
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
      // Validate the date. isNaN() returns true if date.getTime() is not a valid number.
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date provided.');
      }
  
      // Define default formatting options.
      const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
  
      // Merge default options with any user-provided options.
      const formatOptions = { ...defaultOptions, ...options };
  
      // Securely format the date using Intl.DateTimeFormat.
      return new Intl.DateTimeFormat(locale, formatOptions).format(date);
    } catch (error) {
      // Log the error for debugging purposes.
      console.error('Error formatting date:', error);
      // Return a fallback string (empty string) to prevent exposing error details to the end user.
      return '';
    }
  };
  
  export default formatDate;
  