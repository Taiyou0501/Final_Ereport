// src/Logout.jsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
      .then(() => {
        logout(); // Clear the authentication state
        navigate('/login'); // Redirect to login page
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