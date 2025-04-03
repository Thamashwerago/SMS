// src/utils/authHelper.ts

/**
 * Stores the authentication token in session storage.
 * @param token - The JWT token to store.
 */
export function setAuthToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }
  
  /**
   * Retrieves the authentication token from session storage.
   * @returns The JWT token or null if not found.
   */
  export function getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }
  
  /**
   * Clears the authentication token from session storage.
   */
  export function clearAuthToken(): void {
    sessionStorage.removeItem('authToken');
  }
  
  /**
   * Checks if a user is authenticated by verifying if a token exists and is not expired.
   * @returns True if authenticated; otherwise, false.
   */
  export function isAuthenticated(): boolean {
    const token = getAuthToken();
    return token !== null && !isTokenExpired(token);
  }
  
  /**
   * Checks if a JWT token is expired.
   * @param token - The JWT token to check.
   * @returns True if expired; otherwise, false.
   */
  export function isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      // Assuming the payload contains an 'exp' field (expiration time in seconds)
      if (!payload.exp) return false;
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
  
  /**
   * Returns an object with the Authorization header, if an auth token exists.
   * @returns An object with the Authorization header or an empty object.
   */
  export function getAuthHeader(): Record<string, string> {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  /**
   * Extracts and returns the user's role from the JWT token payload.
   * This function assumes that the token payload contains a 'role' property.
   * @returns The user role if available; otherwise, an empty string.
   */
  export function getUserRole(): string {
    const token = getAuthToken();
    if (!token) return '';
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.role || '';
    } catch (error) {
      console.error('Error extracting user role from token:', error);
      return '';
    }
  }
  