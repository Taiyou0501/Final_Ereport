// src/auth/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../config/axios';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await api.get('/checkSession');
        setIsValid(response.data.isAuthenticated);
      } catch (error) {
        console.error('Session verification error:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#333'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;