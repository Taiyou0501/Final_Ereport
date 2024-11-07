import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../CSS/Dashboard.css';
import Sidebar from "./Sidebar";

const UnitDashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

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

  return (
    <div className="body">
      <Sidebar/>
      <section className="home">
        <div className="text">Dashboard</div>
        <div className="text">Welcome, Unit</div>
        <div className="tabs-profile">
          <div className="new-wrapper">
            <form action="">
              <div className="profile-info">
                <h1>Profile</h1>
                {userDetails ? (
                  <div className="two-forms">
                    <div className="title">FirstName: </div>
                    <div className="subtext">{userDetails.firstname}</div>
                    <div className="title">Lastname: </div>
                    <div className="subtext">{userDetails.lastname}</div>
                    <div className="title">Unit: </div>
                    <div className="subtext">{userDetails.unit}</div>
                    <div className="title">Username: </div>
                    <div className="subtext">{userDetails.username}</div>
                    <div className="title">Email: </div>
                    <div className="subtext">{userDetails.email}</div>
                    <div className="title">Password: </div>
                    <div className="subtext">*************</div>
                    <div className="title">Role: </div>
                    <div className="subtext">{userDetails.role}</div>
                    <button className="btn-register">Edit Account</button>
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