import React, { useEffect, useState } from "react";
import "./Register.css";
import axios from 'axios';

const Register = () => {
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    cpnumber: '' // Add CP number here
  })
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    axios.post('http://localhost:8081/register', values)
      .then(res => {
        console.log("Registered Successfully");
        alert("Registered Successfully");
        window.location.href = "/login";
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred. Please try again.');
        }
      });
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
              <input type="text" placeholder="CP Number" name='cpnumber' onChange={handleChange} /> {/* Add CP number input */}
            </div>
            <button className="btn-register" type="submit">
              Register
            </button>
            <div className="register-link">
              <p>Already have an Account? <a href="/">Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;