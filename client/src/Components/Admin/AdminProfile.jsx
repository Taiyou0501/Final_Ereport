import React from "react";
import '../CSS/Dashboard.css';
import logo from'../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons'


const AdminDashboard = () => {
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
        <div className="tabs-profile">
        <div className="new-wrapper">
          <form action="">
            <div className="profile-info">
          <h1>Profile</h1>
          <div className="two-forms">
                                <div className="title">FirstName: </div>
                                <div className="subtext">Admin</div>
                                <div className="title">Lastname: </div>
                                <div className="subtext">Admin</div>
                                </div>
                                <div className="title">Username: </div>
                                <div className="subtext">Admin123</div>
                                <div className="title">Email: </div>
                                <div className="subtext">admin@gmail.com</div>
                                <div className="title">Password: </div>
                                <div className="subtext">*************</div>
                                <div className="title">Role: </div>
                                <div className="subtext">Admin</div>
                                <button className="btn-register" >Edit Account</button>
                                </div>
          </form>
        </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;