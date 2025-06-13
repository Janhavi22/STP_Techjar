import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSites } from '../data/mockData';

// Define types
export type UserRole = 'operator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  siteId?: string;
  siteName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, siteId?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo (would come from API in production)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@aquaguard.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    email: 'operator@aquaguard.com',
    password: 'operator123',
    name: 'John Operator',
    role: 'operator' as UserRole,
  },
];

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aquaguard_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, siteId?: string) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // For operators, require site selection
    if (foundUser.role === 'operator' && !siteId) {
      setIsLoading(false);
      throw new Error('Site selection required for operators');
    }

    // Add site information for operators
    let authenticatedUser: User;
    if (foundUser.role === 'operator' && siteId) {
      const site = mockSites.find(s => s.id === siteId);
      if (!site) {
        setIsLoading(false);
        throw new Error('Invalid site selected');
      }
      authenticatedUser = {
        ...foundUser,
        siteId,
        siteName: site.name,
      };
    } else {
      // Remove password before saving user
      const { password: _, ...userWithoutPassword } = foundUser;
      authenticatedUser = userWithoutPassword;
    }
    
    setUser(authenticatedUser);
    localStorage.setItem('aquaguard_user', JSON.stringify(authenticatedUser));
    setIsLoading(false);
    
    // Navigate based on role
    if (authenticatedUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/operator');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('aquaguard_user');
    navigate('/login');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};