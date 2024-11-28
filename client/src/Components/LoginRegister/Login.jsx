import React, { useState } from "react";
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
        login(); // Set the authentication state
        
        // Get the table from response
        const table = response.data.table;
        console.log('User type:', table);

        // Define the redirect paths
        const redirectPaths = {
          'admin_details': '/admin/home',
          'user_details': '/user/index',
          'police_details': '/police/home',
          'responder_details': '/responder/home',
          'unit_details': '/unit/home',
          'barangay_details': '/barangay/home'
        };

        const redirectPath = redirectPaths[table];
        if (redirectPath) {
          console.log('Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        } else {
          setError('Invalid user type');
          console.error('Unknown table type:', table);
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

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