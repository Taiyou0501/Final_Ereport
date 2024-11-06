import React from "react";
import { useNavigate } from 'react-router-dom';
import '../CSS/Dashboard.css';
import Sidebar from "./Sidebar";

const UnitDashboard = () => {
  const navigate = useNavigate();

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
          <div className="two-forms">
                                <div className="title">FirstName: </div>
                                <div className="subtext">Chief</div>
                                <div className="title">Lastname: </div>
                                <div className="subtext">Chief</div>
                                </div>
                                <div className="title">Unit: </div>
                                <div className="subtext">Legazpi City</div>
                                <div className="title">Username: </div>
                                <div className="subtext">Unit123</div>
                                <div className="title">Email: </div>
                                <div className="subtext">unit@gmail.com</div>
                                <div className="title">Password: </div>
                                <div className="subtext">*************</div>
                                <div className="title">Role: </div>
                                <div className="subtext">Unit Head Chief</div>
                                <button className="btn-register" >Edit Account</button>
                                </div>
          </form>
        </div>
        </div>
      </section>
    </div>
  );
}

export default UnitDashboard;