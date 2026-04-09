'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { RoleType } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  role: RoleType | null;
  userId: string | null;
  isApproved: boolean | null;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<RoleType | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const router = useRouter();

  const refreshAuth = useCallback(() => {
    const auth = authService.getAuth();
    if (auth.token && auth.role && auth.userId) {
      setIsAuthenticated(true);
      setRole(parseInt(auth.role) as RoleType);
      setUserId(auth.userId);
      setIsApproved(auth.isApproved !== null ? auth.isApproved === 'true' : null);
    } else {
      setIsAuthenticated(false);
      setRole(null);
      setUserId(null);
      setIsApproved(null);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setRole(null);
    setUserId(null);
    setIsApproved(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userId, isApproved, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
