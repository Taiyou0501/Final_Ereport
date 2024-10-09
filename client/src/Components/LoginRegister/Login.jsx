import React, { useEffect, useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons'   
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
  console.log(username, password);
  
  axios.post('http://localhost:8081/checkAllTables', { username, password })
    .then(res => {
      console.log(res.data);
      if (res.data.message === "Login Successful") {
        console.log(`Redirecting to dashboard for table: ${res.data.table}`);
        switch (res.data.table) {
          case 'admin_details':
            window.location.href = "/a-home";
            break;
          case 'user_details':
            window.location.href = "/user";
            break;
          case 'police_details':
            window.location.href = "/police-home";
            break;
          case 'responder_details':
            window.location.href = "/responder-home";
            break;
          case 'unit_details':
            window.location.href = "/u-home";
            break;
          case 'barangay_details':
            window.location.href = "/barangay-home";
            break;
          default:
            alert("Unknown table");
        }
      } else {
        alert("Invalid Credentials");
      }
    })
    .catch(error => {
      console.error("There was an error checking the tables!", error);
    });
}


  return (
    <div className="body-login">
      <div className= "wrapper-login">
        <div className="formbox-login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="inputbox-login">
                    <input type="username" id="username" placeholder="Username" 
                    onChange={e=>setUsername(e.target.value)} required/>
                    <FontAwesomeIcon icon={faEnvelope} className="icon"/>
                </div>
                <div className="inputbox-login">
                    <input type="password" id="password" placeholder="Password" 
                    onChange={e=>setPassword(e.target.value)} required/>
                    <FontAwesomeIcon icon={faLock} className="icon"/>
                </div>

                <div className="remember-forgot-login">
                    <label>
                        <input type="checkbox"/> Remember me
                    </label>
                    <a href="#">Forgot password?</a>
                </div>
                <button className="btn-login" type="submit-login">   
                    Login
                </button>
                <div className="register-link-login">
                    <p>Don't have an account? <a href="/register" >Create Account</a></p>
                </div> 
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;