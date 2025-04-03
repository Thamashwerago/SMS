// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import {
  setAuthToken as saveAuthToken,
  getAuthToken,
  clearAuthToken,
  isAuthenticated,
  getUserRole,
} from '../utils/authHelper';

interface AuthContextProps {
  authToken: string | null;
  userRole: string;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize state from session storage using authHelper functions.
  const [authToken, setAuthToken] = useState<string | null>(getAuthToken());
  const [userRole, setUserRole] = useState<string>(getUserRole());
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());

  // Login function: stores token and updates auth state.
  const login = useCallback((token: string) => {
    saveAuthToken(token);
    setAuthToken(token);
    setUserRole(getUserRole());
    setAuthenticated(true);
  }, []);

  // Logout function: clears token and resets auth state.
  const logout = useCallback(() => {
    clearAuthToken();
    setAuthToken(null);
    setUserRole('');
    setAuthenticated(false);
  }, []);

  // Update authentication state when the authToken changes.
  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUserRole(getUserRole());
  }, [authToken]);

  const contextValue = useMemo(() => ({
    authToken,
    userRole,
    isAuthenticated: authenticated,
    login,
    logout,
  }), [authToken, userRole, authenticated, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
