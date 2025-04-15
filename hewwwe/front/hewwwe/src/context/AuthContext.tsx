import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (name?: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user database
const mockUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Basic password validation (in real app this would be proper hashing)
      if (user.password !== password) {
        throw new Error('Invalid password');
      }
      
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        password, // Store password (in real app this would be hashed)
      };

      mockUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(mockUsers));
      
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (name?: string, photoURL?: string) => {
    if (!user) return;
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = {
        ...user,
        name: name || user.name,
        photoURL: photoURL || user.photoURL
      };

      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(mockUsers));
      }

      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};