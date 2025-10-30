'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      router.push('/login');
    }
  }, [router]);

  const login = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    router.push('/admin');
  };

  const logout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
