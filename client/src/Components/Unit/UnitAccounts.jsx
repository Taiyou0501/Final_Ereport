import React from "react";
import '../CSS/Dashboard.css';
import { useNavigate } from 'react-router-dom';
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
        <div className="tabs-admin-accounts">
          <div className="home-wrapper"> 
          <button className="create-account" onClick={() => handleNavigation('/unit/check-accounts')}>Check Accounts</button>
          <button className="create-account"onClick={() => handleNavigation('/unit/add-responder')}>Add Responder</button>
          <button className="create-account" onClick={() => handleNavigation('/unit/add-police')}>Add Police</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UnitDashboard;