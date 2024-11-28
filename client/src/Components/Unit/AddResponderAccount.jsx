import React, { useState } from "react";
import '../CSS/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import Sidebar from "./Sidebar";

const AddResponderAccount = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    vehicle: '',
    respondertype: '',
    cpnumber: ''
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate all fields are filled
    const requiredFields = ['firstname', 'lastname', 'respondertype', 'vehicle', 'email', 'username', 'password', 'cpnumber'];
    const emptyFields = requiredFields.filter(field => !values[field]);
    
    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      return;
    }

    try {
      const response = await api.post('/u-add-responder', values);
      console.log("API Response:", response.data);
      alert("Responder added successfully");
      navigate("/unit/accounts");
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
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
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      name='firstname' 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="inputbox">
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      name='lastname' 
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="two-forms">
                  <div className="inputbox">
                    <select 
                      name='respondertype' 
                      required 
                      onChange={handleChange}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Responder Type</option>
                      <option value="Medical Professional">Medical Professional</option>
                      <option value="Police">Police</option>
                      <option value="Fire Fighter">Fire Fighter</option>
                    </select>
                  </div>
                  <div className="inputbox">
                    <select 
                      name='vehicle' 
                      required 
                      onChange={handleChange}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Vehicle Type</option>
                      <option value="Ambulance">Ambulance</option>
                      <option value="Fire Truck">Fire Truck</option>
                      <option value="Rescue Vehicle">Rescue Vehicle</option>
                      <option value="Police Car">Police Car</option>
                    </select>
                  </div>
                </div>
                <div className="inputbox">
                    <input type="email" placeholder="Email" name='email' required onChange={handleChange}/>
                </div>
                <div className="inputbox">
                    <input type="cpnumber" placeholder="CP Number" name='cpnumber' required onChange={handleChange}/> {/* Add CP number input */}
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

export default AddResponderAccount;