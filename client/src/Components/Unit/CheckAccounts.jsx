import React from "react";
import '../CSS/Dashboard.css';
import logo from'../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons'


const UnitDashboard = () => {
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
              <a href="u-home">
              <FontAwesomeIcon icon={faHouse} className="icon"/>    
                <span className="text nav-text">Home</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="u-accounts">
              <FontAwesomeIcon icon={faUsers} className="icon"/> 
                <span className="text nav-text">Accounts</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="u-profile">
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
        <div className="text">Welcome, Unit</div>
        <div className="tabs-admin">
        <div class="home-wrapper">
          List of Accounts
        </div>
        </div>
      </section>
    </div>
  );
}

export default UnitDashboard;