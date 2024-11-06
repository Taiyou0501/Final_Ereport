import React, { useState } from "react";
import '../CSS/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import logo from'../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import Sidebar from "./Sidebar";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    unit: '',
    rank: '',
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
    axios.post('http://localhost:8081/u-add-police', values)
      .then(res => {
        console.log("Police officer added successfully");
        alert("Police officer added successfully");
        navigate("/unit/accounts");
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
      <Sidebar/>
      <section className="home">
        <div className="text">Dashboard</div>
        <div className="text">Welcome, Admin</div>
        <div className="tabs-add-police">
          <div className="new-wrapper">
            <div className="new-formbox">
              <form onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                <div className="two-forms">
                <div className="inputbox">
                    <input type="firstname" placeholder="Head First Name" name='firstname' onChange={handleChange}/>
                  </div>
                  <div className="inputbox">
                    <input type="lastname" placeholder="Head Last Name" name='lastname' onChange={handleChange}/>
                  </div>
                </div>
                <div className="inputbox">
                  <input type="unit" placeholder="Unit" name='unit' onChange={handleChange} />
                </div>
                <div className="inputbox">
                  <input type="rank" placeholder="Rank" name='rank' onChange={handleChange}/>
                </div>
                <div className="inputbox">
                    <input type="email" placeholder="Email" name='email' onChange={handleChange}/>
                </div>
                <div className="inputbox">
                {error && <p className="error-message">{error}</p>}
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