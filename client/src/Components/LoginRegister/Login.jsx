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
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loginResponse = await api.post('/checkAllTables', {
        username,
        password
      });
      
      console.log('Login response:', loginResponse.data);
      
      if (loginResponse.data.message === "Login Successful") {
        const sessionResponse = await api.get('/checkSession');
        console.log('Session check:', sessionResponse.data);
        
        if (sessionResponse.data.isAuthenticated) {
          await login();
          const table = loginResponse.data.table;
          
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

          if (redirectPath) {
            navigate(redirectPath, { replace: true });
          }
        } else {
          setError('Session could not be established');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
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
            {loading && <div>Logging in...</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;