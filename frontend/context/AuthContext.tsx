'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// We no longer need jwt-decode, which simplifies the code and removes a point of failure.

interface AuthContextType {
  user: { email: string } | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This effect runs once when the app loads.
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // If a token exists, we'll consider the user logged in.
        // Our secure API service will handle token validation on actual requests.
        // We can use a placeholder email or derive it if needed later.
        setUser({ email: 'user' }); 
      }
    } catch (error) {
      // This catch block handles any unexpected errors during initialization.
      console.error("Error during auth initialization:", error);
      setUser(null);
    } finally {
      // This block ALWAYS runs, ensuring the app never gets stuck on "Initializing..."
      setIsInitialized(true);
    }
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // On login, we set the user state.
    setUser({ email: 'user' });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.href = '/';
  };

  const value = { user, login, logout, isInitialized };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
