import React, { useEffect, useState } from "react";
import '../CSS/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "./Sidebar";


const UnitDashboard = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    vehicle: '',
    respondertype: ''
  })
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    axios.post('http://localhost:8081/u-add-responder', values)
      .then(res => {
        console.log("Responder added successfully");
        alert("Responder added successfully");
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
        <div className="text">Welcome, Unit</div>
        <div className="tabs-add-unit">
          <div className="new-wrapper">
            <div className="new-formbox">
              <form onSubmit={handleSubmit}>
                <h1>Create Responder</h1>
                <div className="two-forms">
                <div className="inputbox">
                    <input type="firstname" placeholder="First Name" name='firstname' required onChange={handleChange}/>
                  </div>
                  <div className="inputbox">
                    <input type="lastname" placeholder="Last Name" name='lastname' required onChange={handleChange}/>
                  </div>
                </div>
                <div className="inputbox">
                  <input type="responder-type" placeholder="Responder Type" name='respondertype' required onChange={handleChange}/>
                </div>
                <div className="inputbox">
                  <input type="vehicle" placeholder="Vehicle" name='vehicle' required onChange={handleChange}/>
                </div>
                <div className="inputbox">
                    <input type="email" placeholder="Email" name='email' required onChange={handleChange}/>
                </div>
                <div className="inputbox">
                {error && <p className="error-message">{error}</p>}
                    <input type="username" placeholder="Username" name='username' required onChange={handleChange}/>
                </div>
                <div className="inputbox">
                    <input type="password" placeholder="Password" name='password' required onChange={handleChange}/>
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

export default UnitDashboard;