// src/utils/authHelper.ts

/**
 * authHelper.ts
 *
 * This module provides utility functions to manage authentication tokens
 * in a secure and advanced manner. It includes functions to:
 * - Store, retrieve, and remove the auth token from localStorage.
 * - Decode a JWT token to extract its payload.
 * - Check if a token has expired.
 * - Verify if a user is authenticated.
 *
 * Security Considerations:
 * - All token operations assume the use of HTTPS in production.
 * - Token expiry is checked based on the "exp" claim in the JWT payload.
 * - Generic error handling is used to avoid exposing sensitive details.
 */

/**
 * Stores the authentication token securely in localStorage.
 *
 * @param token - The JWT token to be stored.
 */
export const setAuthToken = (token: string): void => {
    // In production, consider secure storage mechanisms beyond localStorage.
    localStorage.setItem('authToken', token);
  };
  
  /**
   * Retrieves the authentication token from localStorage.
   *
   * @returns The JWT token if it exists, or null otherwise.
   */
  export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
  };
  
  /**
   * Removes the authentication token from localStorage.
   */
  export const removeAuthToken = (): void => {
    localStorage.removeItem('authToken');
  };
  
  /**
   * Decodes a JWT token to extract its payload.
   *
   * JWT Format: header.payload.signature
   *
   * @param token - The JWT token to decode.
   * @returns The decoded payload as an object, or null if decoding fails.
   */
  export const decodeToken = (token: string): Record<string, unknown> | null => {
    try {
      // Split the token into its parts and extract the payload.
      const payload = token.split('.')[1];
      if (!payload) {
        throw new Error("Invalid token format.");
      }
      // JWT uses base64url encoding. Convert to base64.
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // Decode the base64 string.
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      // Return null if decoding fails for security reasons.
      return null;
    }
  };
  
  /**
   * Checks if a given JWT token is expired.
   *
   * @param token - The JWT token to check.
   * @returns True if the token is expired or invalid; otherwise, false.
   */
  export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded?.exp) {
      // If the token cannot be decoded or has no expiration, treat it as expired.
      return true;
    }
    // Convert current time from milliseconds to seconds and compare with token expiration.
    const currentTime = Date.now() / 1000;
    return typeof decoded.exp === 'number' && decoded.exp < currentTime;
  };
  
  /**
   * Determines if a user is authenticated based on the stored token.
   *
   * @returns True if a valid, non-expired token exists; otherwise, false.
   */
  export const isAuthenticated = (): boolean => {
    const token = getAuthToken();
    if (!token) {
      return false;
    }
    return !isTokenExpired(token);
  };
  