import React, { useState } from "react";
import "./Register.css";
import api from '../../config/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    cpnumber: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log('Making request to:', api.defaults.baseURL + '/register');
        const response = await api.post('/register', {
            firstname: values.firstname,
            lastname: values.lastname,
            username: values.username,
            email: values.email,
            password: values.password,
            cpnumber: values.cpnumber
        });
        console.log('Response:', response.data);
        console.log("Registered Successfully");
        alert("Registered Successfully");
        navigate('/login');
    } catch (error) {
        console.error('Registration error:', error);
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        } else {
            setError('An error occurred. Please try again.');
        }
    }
  };

  return (
    <div className="body-register">
      <div className="wrapper">
        <div className="formbox">
          <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className="two-forms">
              <div className="inputbox">
                <input type="text" placeholder="First Name" name='firstname' onChange={handleChange} />
              </div>
              <div className="inputbox">
                <input type="text" placeholder="Last Name" name='lastname' onChange={handleChange} />
              </div>
            </div>
            <div className="inputbox">
              <input type="email" placeholder="Email" name='email' onChange={handleChange} />
            </div>
            <div className="inputbox">
            {error && <p className="error-message">{error}</p>}
              <input type="text" placeholder="Username" name='username' onChange={handleChange} />
            </div>
            <div className="inputbox">
              <input type="password" placeholder="Password" name='password' onChange={handleChange} />
            </div>
            <div className="inputbox">
              <input type="text" placeholder="CP Number" name='cpnumber' onChange={handleChange} />
            </div>
            <button className="btn-register" type="submit">
              Register
            </button>
            <div className="register-link">
              <p>Already have an Account? <Link to="/login">Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;