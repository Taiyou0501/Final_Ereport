// src/auth/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check session status when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/checkSession');
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);