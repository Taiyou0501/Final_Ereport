// src/auth/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../config/axios';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await api.get('/checkSession');
        console.log('Session check response:', response.data);
        
        if (response.data.isAuthenticated) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;