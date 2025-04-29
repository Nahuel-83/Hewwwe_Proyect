import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUserById } from '../api/users';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    // Check local storage for existing session
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      getUserById(Number(storedUserId))
        .then(response => setUser(response.data))
        .catch(() => logout());
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userId', String(userData.userId));
    localStorage.setItem('userRole', userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
