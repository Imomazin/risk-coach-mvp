import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
  provider?: 'email' | 'google' | 'github';
  createdAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated Google OAuth accounts
const googleAccounts = [
  { email: 'admin@luminar.ai', name: 'Admin User', role: 'admin' as const, avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=fff' },
  { email: 'john.doe@gmail.com', name: 'John Doe', role: 'user' as const, avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10B981&color=fff' },
];

// Simulated GitHub OAuth accounts
const githubAccounts = [
  { email: 'dev@github.com', name: 'Dev User', role: 'admin' as const, avatar: 'https://ui-avatars.com/api/?name=Dev+User&background=1F2937&color=fff' },
  { email: 'coder@github.com', name: 'Code Master', role: 'user' as const, avatar: 'https://ui-avatars.com/api/?name=Code+Master&background=6366F1&color=fff' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('lumina_r_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Ensure role exists for backward compatibility
        if (!parsed.role) parsed.role = 'user';
        setUser(parsed);
      } catch {
        localStorage.removeItem('lumina_r_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData: User) => {
    const userWithDefaults = {
      ...userData,
      role: userData.role || 'user',
      provider: userData.provider || 'email',
      createdAt: userData.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setUser(userWithDefaults);
    localStorage.setItem('lumina_r_user', JSON.stringify(userWithDefaults));
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);

    // Simulate OAuth popup delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate Google OAuth - randomly select an account or show picker
    const selectedAccount = googleAccounts[Math.floor(Math.random() * googleAccounts.length)];

    const userData: User = {
      email: selectedAccount.email,
      name: selectedAccount.name,
      role: selectedAccount.role,
      avatar: selectedAccount.avatar,
      provider: 'google',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem('lumina_r_user', JSON.stringify(userData));
    setIsLoading(false);
  }, []);

  const loginWithGitHub = useCallback(async () => {
    setIsLoading(true);

    // Simulate OAuth popup delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate GitHub OAuth
    const selectedAccount = githubAccounts[Math.floor(Math.random() * githubAccounts.length)];

    const userData: User = {
      email: selectedAccount.email,
      name: selectedAccount.name,
      role: selectedAccount.role,
      avatar: selectedAccount.avatar,
      provider: 'github',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem('lumina_r_user', JSON.stringify(userData));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('lumina_r_user');
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('lumina_r_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        loginWithGoogle,
        loginWithGitHub,
        logout,
        updateUser,
      }}
    >
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
