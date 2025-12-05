// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to parse saved user:', error);
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:27500/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }
      } catch (error) {
        console.warn('Token invalid, logging out:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback(async (userData, token) => {
    try {
      setIsLoading(true);
      setAuthError('');
      
      // Store auth data
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Set initial view based on role with fallbacks
      let initialView = 'home';
      switch (userData.role) {
        case 'driver':
          initialView = 'driver';
          break;
        case 'admin':
          initialView = 'admin';
          break;
        case 'waiter':
          initialView = 'waiter';
          break;
        case 'customer':
          initialView = 'customer';
          break;
        default:
          initialView = 'home';
          break;
      }
      
      setCurrentView(initialView);
      
      // Store last view in localStorage for persistence
      localStorage.setItem('lastView', initialView);
      
    } catch (error) {
      setAuthError('Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Clear all auth-related data
    setUser(null);
    setCurrentView('home');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('lastView');
    
    // Clear any session storage if used
    sessionStorage.clear();
    
    // Optional: Redirect to home
    window.location.href = '/';
  }, []);

  const switchView = useCallback((view) => {
    setCurrentView(view);
    localStorage.setItem('lastView', view);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user has any of the given roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);

  const value = {
    user,
    login,
    logout,
    currentView,
    switchView,
    isLoading,
    authError,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user && !!localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
