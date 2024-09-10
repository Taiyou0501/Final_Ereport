import React, { useState } from "react";
import '../CSS/Dashboard.css';
import logo from'../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';


const AdminDashboard = () => {
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    barangay: '',
    email: '',
    username: '',
    password: ''

  })
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    axios.post('http://localhost:8081/a-add-barangay', values)
      .then(res => {
        console.log("Barangay added successfully");
        alert("Barangay added successfully");
        window.location.href = "/a-accounts";
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
    <div className="body">
      <nav className="sidebar">
        <header className="header">
          <div className="image-text">
            <span className = "image">
              <img src={logo} alt="logo" />
              <span className="title">Electronic</span>
              <span className="title">Response</span>
              <span className="title">Portal</span>
            </span>
          </div>
        </header>
        <div className="menu-bar">
          <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <a href="a-home">
              <FontAwesomeIcon icon={faHouse} className="icon"/>    
                <span className="text nav-text">Home</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="a-reports">
              <FontAwesomeIcon icon={faFile} className="icon"/>  
                <span className="text nav-text">Reports</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="a-accounts">
              <FontAwesomeIcon icon={faUsers} className="icon"/> 
                <span className="text nav-text">Accounts</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="a-profile">
              <FontAwesomeIcon icon={faCircleUser} className="icon"/> 
                <span className="text nav-text">Profile</span>
              </a>
            </li>
            </ul>
          </div>
          <div className="bottom-content">
            <li className="nav-link">
              <a href="/">
              <FontAwesomeIcon icon={faRightToBracket} className="icon"/> 
                <span className="text nav-text">Logout</span>
              </a>
            </li>
          </div>
        </div>
      </nav>
      <section className="home">
        <div className="text">Dashboard</div>
        <div className="text">Welcome, Admin</div>
        <div className="tabs-add-barangay">
          <div className="new-wrapper">
            <div className="new-formbox">
              <form onSubmit={handleSubmit}>
                <h1>Add Barangay Account</h1>
                <div className="two-forms">
                <div className="inputbox">
                    <input type="firstname" placeholder="Barangay Captain First Name" name='firstname' onChange={handleChange}/>
                  </div>
                  <div className="inputbox">
                    <input type="lastname" placeholder="Barangay Captain Last Name" name='lastname' onChange={handleChange}/>
                  </div>
                </div>
                <div className="inputbox">
                  <input type="barangay" placeholder="Barangay" name='barangay' onChange={handleChange}/>
                </div>
                <div className="inputbox">
                    <input type="email" placeholder="Email" name='email' onChange={handleChange} />
                </div>
                <div className="inputbox">
                  {error && <p className="error">{error}</p>}
                    <input type="username" placeholder="Username" name='username' onChange={handleChange}/>
                </div>
                <div className="inputbox">
                    <input type="password" placeholder="Password" name='password' onChange={handleChange}/>
                </div>
                <button className="btn-register"type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;