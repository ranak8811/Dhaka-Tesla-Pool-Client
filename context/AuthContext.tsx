'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  walletBalancePoysha?: number;
  walletBalanceBdt?: number;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: 'PASSENGER' | 'DRIVER',
  ) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  topupWallet: (amountBdt?: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const emptySubscribe = () => () => {};

function getStoredSession(): { user: User | null; token: string | null } {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }
  try {
    const storedToken = localStorage.getItem('tesla_token');
    const storedUser = localStorage.getItem('tesla_user');
    return {
      user: storedUser ? (JSON.parse(storedUser) as User) : null,
      token: storedToken,
    };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [session, setSession] = useState<{ user: User | null; token: string | null }>(
    getStoredSession,
  );
  const router = useRouter();

  const login = async (email: string, password: string): Promise<void> => {
    const data = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('tesla_token', data.accessToken);
    localStorage.setItem('tesla_user', JSON.stringify(data.user));

    setSession({ user: data.user, token: data.accessToken });

    if (data.user.role === 'DRIVER') {
      router.push('/driver');
    } else {
      router.push('/passenger');
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'PASSENGER' | 'DRIVER' = 'PASSENGER',
  ): Promise<void> => {
    const data = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });

    localStorage.setItem('tesla_token', data.accessToken);
    localStorage.setItem('tesla_user', JSON.stringify(data.user));

    setSession({ user: data.user, token: data.accessToken });

    if (data.user.role === 'DRIVER') {
      router.push('/driver');
    } else {
      router.push('/passenger');
    }
  };

  const logout = () => {
    localStorage.removeItem('tesla_token');
    localStorage.removeItem('tesla_user');
    setSession({ user: null, token: null });
    router.push('/login');
  };

  const refreshProfile = useCallback(async (): Promise<void> => {
    try {
      const profile = await apiClient<User & { walletBalanceBdt?: number }>('/auth/me');
      if (profile && profile.id) {
        setSession((prev) => {
          if (!prev.user) return prev;
          const updatedUser: User = {
            ...prev.user,
            ...profile,
          };
          localStorage.setItem('tesla_user', JSON.stringify(updatedUser));
          return { ...prev, user: updatedUser };
        });
      }
    } catch {
      // Ignore background errors
    }
  }, []);

  useEffect(() => {
    if (session.token) {
      refreshProfile();
    }
  }, [session.token, refreshProfile]);

  const topupWallet = async (amountBdt = 500): Promise<void> => {
    const data = await apiClient<{
      message: string;
      walletBalancePoysha: number;
      walletBalanceBdt: number;
    }>('/auth/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amountBdt }),
    });

    setSession((prev) => {
      if (!prev.user) return prev;
      const updatedUser: User = {
        ...prev.user,
        walletBalancePoysha: data.walletBalancePoysha,
        walletBalanceBdt: data.walletBalanceBdt,
      };
      localStorage.setItem('tesla_user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  const user = isHydrated ? session.user : null;
  const token = isHydrated ? session.token : null;
  const isLoading = !isHydrated;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        topupWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
