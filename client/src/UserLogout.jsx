// src/Logout.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});

  const handleLogout = () => {
    axios.post('http://localhost:8081/logout', {}, { withCredentials: true })
      .then(() => {
        logout(); // Clear the authentication state
        navigate('/login'); // Redirect to login page
      })
      .catch(err => {
        console.error('Error logging out', err);
      });
  };

  const handleProfileClick = () => {
    axios.get('http://localhost:8081/checkSession', { withCredentials: true })
      .then(response => {
        setAccountDetails(response.data.user);
        setEditedDetails(response.data.user);
        setIsModalOpen(true);
      })
      .catch(err => {
        console.error('Error fetching account details', err);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails({ ...editedDetails, [name]: value });
  };

  const handleSaveClick = () => {
    axios.put('http://localhost:8081/updateAccount', editedDetails, { withCredentials: true })
      .then(response => {
        setAccountDetails(editedDetails);
        setIsEditing(false);
      })
      .catch(err => {
        console.error('Error updating account details', err);
      });
  };

  return (
    <>
      <header className="index-responder-header">
        <div className="index-main-text">E-REPORT</div>
      </header>
      <header className="index-header-tab">
        <button className="index-menu-btn">
          <FontAwesomeIcon icon={faBars} />
          <span className="index-menu-text">HELLO, USER</span>
        </button>
        <div className="index-responder-actions">
          <button className="index-profile-btn" onClick={handleProfileClick}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className="index-logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </header>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            {accountDetails ? (
              <div>
                <h2>Account Details</h2>
                {accountDetails.role === 'USER' ? (
                  <>
                    <p>User ID: {accountDetails.id}</p>
                    <p>First Name: {isEditing ? <input type="text" name="firstname" value={editedDetails.firstname} onChange={handleInputChange} /> : accountDetails.firstname}</p>
                    <p>Last Name: {isEditing ? <input type="text" name="lastname" value={editedDetails.lastname} onChange={handleInputChange} /> : accountDetails.lastname}</p>
                    <p>Username: {isEditing ? <input type="text" name="username" value={editedDetails.username} onChange={handleInputChange} /> : accountDetails.username}</p>
                    <p>Email: {isEditing ? <input type="text" name="email" value={editedDetails.email} onChange={handleInputChange} /> : accountDetails.email}</p>
                    <p>
                      Password: {showPassword ? (isEditing ? <input type="text" name="password" value={editedDetails.password} onChange={handleInputChange} /> : accountDetails.password) : '********'}
                      <button onClick={togglePasswordVisibility} className="password-toggle-btn">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </p>
                    <p>CP Number: {isEditing ? <input type="text" name="cpnumber" value={editedDetails.cpnumber} onChange={handleInputChange} /> : accountDetails.cpnumber}</p>
                    <p>Role: {accountDetails.role}</p>
                  </>
                ) : accountDetails.role === 'RESPONDER' ? (
                  <>
                    <p>Responder ID: {accountDetails.id}</p>
                    <p>First Name: {isEditing ? <input type="text" name="firstname" value={editedDetails.firstname} onChange={handleInputChange} /> : accountDetails.firstname}</p>
                    <p>Last Name: {isEditing ? <input type="text" name="lastname" value={editedDetails.lastname} onChange={handleInputChange} /> : accountDetails.lastname}</p>
                    <p>Username: {isEditing ? <input type="text" name="username" value={editedDetails.username} onChange={handleInputChange} /> : accountDetails.username}</p>
                    <p>Email: {isEditing ? <input type="text" name="email" value={editedDetails.email} onChange={handleInputChange} /> : accountDetails.email}</p>
                    <p>
                      Password: {showPassword ? (isEditing ? <input type="text" name="password" value={editedDetails.password} onChange={handleInputChange} /> : accountDetails.password) : '********'}
                      <button onClick={togglePasswordVisibility} className="password-toggle-btn">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </p>
                    <p>Responder Type: {isEditing ? <input type="text" name="respondertype" value={editedDetails.respondertype} onChange={handleInputChange} /> : accountDetails.respondertype}</p>
                    <p>Vehicle: {isEditing ? <input type="text" name="vehicle" value={editedDetails.vehicle} onChange={handleInputChange} /> : accountDetails.vehicle}</p>
                    <p>CP Number: {isEditing ? <input type="text" name="cpnumber" value={editedDetails.cpnumber} onChange={handleInputChange} /> : accountDetails.cpnumber}</p>
                    <p>Role: {accountDetails.role}</p>
                  </>
                ) : accountDetails.role === 'POLICE' ? (
                  <>
                    <p>Police ID: {accountDetails.id}</p>
                    <p>First Name: {isEditing ? <input type="text" name="firstname" value={editedDetails.firstname} onChange={handleInputChange} /> : accountDetails.firstname}</p>
                    <p>Last Name: {isEditing ? <input type="text" name="lastname" value={editedDetails.lastname} onChange={handleInputChange} /> : accountDetails.lastname}</p>
                    <p>Username: {isEditing ? <input type="text" name="username" value={editedDetails.username} onChange={handleInputChange} /> : accountDetails.username}</p>
                    <p>Email: {isEditing ? <input type="text" name="email" value={editedDetails.email} onChange={handleInputChange} /> : accountDetails.email}</p>
                    <p>
                      Password: {showPassword ? (isEditing ? <input type="text" name="password" value={editedDetails.password} onChange={handleInputChange} /> : accountDetails.password) : '********'}
                      <button onClick={togglePasswordVisibility} className="password-toggle-btn">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </p>
                    <p>Unit: {isEditing ? <input type="text" name="unit" value={editedDetails.unit} onChange={handleInputChange} /> : accountDetails.unit}</p>
                    <p>Rank: {isEditing ? <input type="text" name="rank" value={editedDetails.rank} onChange={handleInputChange} /> : accountDetails.rank}</p>
                    <p>Role: {accountDetails.role}</p>
                  </>
                ) : accountDetails.role === 'BARANGAY' ? (
                  <>
                    <p>Barangay ID: {accountDetails.id}</p>
                    <p>First Name: {isEditing ? <input type="text" name="firstname" value={editedDetails.firstname} onChange={handleInputChange} /> : accountDetails.firstname}</p>
                    <p>Last Name: {isEditing ? <input type="text" name="lastname" value={editedDetails.lastname} onChange={handleInputChange} /> : accountDetails.lastname}</p>
                    <p>Username: {isEditing ? <input type="text" name="username" value={editedDetails.username} onChange={handleInputChange} /> : accountDetails.username}</p>
                    <p>Email: {isEditing ? <input type="text" name="email" value={editedDetails.email} onChange={handleInputChange} /> : accountDetails.email}</p>
                    <p>
                      Password: {showPassword ? (isEditing ? <input type="text" name="password" value={editedDetails.password} onChange={handleInputChange} /> : accountDetails.password) : '********'}
                      <button onClick={togglePasswordVisibility} className="password-toggle-btn">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </p>
                    <p>Barangay: {isEditing ? <input type="text" name="barangay" value={editedDetails.barangay} onChange={handleInputChange} /> : accountDetails.barangay}</p>
                    <p>Role: {accountDetails.role}</p>
                  </>
                ) : (
                  <p>Unknown role</p>
                )}
                {isEditing ? (
                  <button onClick={handleSaveClick}>Save</button>
                ) : (
                  <button onClick={handleEditClick}>Edit Account</button>
                )}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;