import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../CSS/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Logout from '../../Logout';
import Sidebar from "./Sidebar";

const UnitDashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8081/checkSession', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.isAuthenticated) {
          setUserDetails(data.user);
          setEditedDetails(data.user);
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails({ ...editedDetails, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch('http://localhost:8081/updateAccount', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedDetails),
      });
      const data = await response.json();
      if (response.ok) {
        setUserDetails(editedDetails);
        setIsEditing(false);
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Error updating account details');
      }
    } catch (error) {
      console.error('Error updating account details:', error);
      setErrorMessage('Error updating account details');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="body">
      <Sidebar/>
      <section className="home">
        <div className="text">Dashboard</div>
        <div className="text">Welcome, Unit</div>
        <div className={`tabs-profile ${isEditing ? 'editing-mode' : ''}`}>
          <div className="new-wrapper">
            <form action="">
              <div className="profile-info">
                <h1>Profile</h1>
                {userDetails ? (
                  <div className="two-forms">
                    <div className="form-group">
                      <div className="title">FirstName: </div>
                      <div className="subtext">
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstname"
                            value={editedDetails.firstname}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userDetails.firstname
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="title">Lastname: </div>
                      <div className="subtext">
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastname"
                            value={editedDetails.lastname}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userDetails.lastname
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="title">Unit: </div>
                      <div className="subtext">
                        {isEditing ? (
                          <input
                            type="text"
                            name="unit"
                            value={editedDetails.unit}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userDetails.unit
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="title">Username: </div>
                      <div className="subtext">
                        {isEditing ? (
                          <input
                            type="text"
                            name="username"
                            value={editedDetails.username}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userDetails.username
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="title">Email: </div>
                      <div className="subtext">
                        {isEditing ? (
                          <input
                            type="text"
                            name="email"
                            value={editedDetails.email}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userDetails.email
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="title">Password: </div>
                      <div className="subtext">
                        {isEditing ? (
                          <>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={editedDetails.password}
                              onChange={handleInputChange}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="password-toggle-btn"
                            >
                              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                          </>
                        ) : (
                          "********"
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="title">CP Number: </div>
                      <div className="subtext">
                        {isEditing ? (
                          <input
                            type="text"
                            name="cpnumber"
                            value={editedDetails.cpnumber}
                            onChange={handleInputChange}
                          />
                        ) : (
                          userDetails.cpnumber
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="title">Role: </div>
                      <div className="subtext">{userDetails.role}</div>
                    </div>
                    {isEditing ? (
                      <>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <button className='save' type="button" onClick={handleSaveClick}>
                          Save
                        </button>
                      </>
                    ) : (
                      <button className='save' type="button" onClick={handleEditClick}>
                        Edit Account
                      </button>
                    )}
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UnitDashboard;