// src/Logout.jsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';

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
    <><header className="index-responder-header">
      <div className="index-main-text">E-REPORT</div>
      </header>
        <header className="index-header-tab">
        <button className="index-menu-btn">
          <FontAwesomeIcon icon={faBars} />
          <span className="index-menu-text">HELLO, USER</span>
        </button>
        <div className="index-responder-actions">
          <button className="index-profile-btn">
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className="index-logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div> 
      </header></>
  );
};

export default Logout;