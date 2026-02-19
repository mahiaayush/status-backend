import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken as saveToken, clearToken, getMe } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await getToken();
        if (stored) {
          setTokenState(stored);
          const me = await getMe();
          setUser(me);
        }
      } catch {
        setTokenState(null);
        setUser(null);
        await clearToken();
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (newToken, newUser) => {
    await saveToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
