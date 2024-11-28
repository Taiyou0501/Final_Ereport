// src/Logout.jsx
import React from 'react';
import api from './config/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    api.post('/logout')
      .then(() => {
        logout();
        navigate('/login');
      })
      .catch(err => {
        console.error('Error logging out', err);
      });
  };

  return (
    <li className="nav-link">
      <a href="#" onClick={handleLogout}>
        <FontAwesomeIcon icon={faRightToBracket} className="icon" />
        <span className="text nav-text">Logout</span>
      </a>
    </li>
  );
};

export default Logout;