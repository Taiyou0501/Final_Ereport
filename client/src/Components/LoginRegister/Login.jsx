import React, { useState, useEffect } from "react";
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { username, password });
      const response = await api.post('/checkAllTables', {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.message === "Login Successful") {
        await login(); // Wait for login to complete
        
        const table = response.data.table;
        console.log('User type:', table);

        // Use a switch statement for clearer routing logic
        let redirectPath;
        switch (table) {
          case 'user_details':
            redirectPath = '/user/index';
            break;
          case 'admin_details':
            redirectPath = '/admin/home';
            break;
          case 'police_details':
            redirectPath = '/police/home';
            break;
          case 'responder_details':
            redirectPath = '/responder/home';
            break;
          case 'unit_details':
            redirectPath = '/unit/home';
            break;
          case 'barangay_details':
            redirectPath = '/barangay/home';
            break;
          default:
            throw new Error('Unknown user type');
        }

        console.log('Redirecting to:', redirectPath);
        // Use navigate with state to force a refresh
        navigate(redirectPath, { 
          replace: true,
          state: { from: 'login' }
        });
        
        // Force a page reload if navigation doesn't work
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            window.location.href = redirectPath;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  // Add this effect to check if we're stuck on login page
  useEffect(() => {
    const checkStuckOnLogin = async () => {
      try {
        const response = await api.get('/checkSession');
        if (response.data.isAuthenticated) {
          navigate('/user/index', { replace: true });
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkStuckOnLogin();
  }, [navigate]);

  return (
    <div className="body-login">
      <div className="wrapper-login">
        <div className="formbox-login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <div className="inputbox-login">
              <input 
                type="text" 
                id="username" 
                placeholder="Username" 
                value={username}
                onChange={e => setUsername(e.target.value)} 
                required 
              />
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
            </div>
            <div className="inputbox-login">
              <input 
                type="password" 
                id="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <FontAwesomeIcon icon={faLock} className="icon" />
            </div>
            <div className="remember-forgot-login">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button className="btn-login" type="submit">   
              Login
            </button>
            <div className="register-link-login">
              <p>Don't have an account? <Link to="/register">Create Account</Link></p>
            </div> 
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;