import React, { useEffect, useState } from "react";
import '../CSS/Dashboard.css';
import logo from '../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/full_reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleRowClick = (report) => {
    setSelectedReport(report);
  };

  return (
    <div className="body">
      <nav className="sidebar">
        <header className="header">
          <div className="image-text">
            <span className="image">
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
                  <FontAwesomeIcon icon={faHouse} className="icon" />
                  <span className="text nav-text">Home</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="a-reports">
                  <FontAwesomeIcon icon={faFile} className="icon" />
                  <span className="text nav-text">Reports</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="a-accounts">
                  <FontAwesomeIcon icon={faUsers} className="icon" />
                  <span className="text nav-text">Accounts</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="a-profile">
                  <FontAwesomeIcon icon={faCircleUser} className="icon" />
                  <span className="text nav-text">Profile</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="bottom-content">
            <li className="nav-link">
              <a href="/">
                <FontAwesomeIcon icon={faRightToBracket} className="icon" />
                <span className="text nav-text">Logout</span>
              </a>
            </li>
          </div>
        </div>
      </nav>
      <section className="home">
        <div className="text">Dashboard</div>
        <div className="text">Welcome, Admin</div>
        <div className="tabs-admin">
          <div className="home-wrapper">
            {selectedReport ? (
              <div className="report-details">
                <h2>Report Details</h2>
                <p><strong>ID:</strong> {selectedReport.id}</p>
                <p><strong>Victim:</strong> {selectedReport.victim}</p>
                <p><strong>Reporter ID:</strong> {selectedReport.reporterId}</p>
                <p><strong>Description:</strong> {selectedReport.description}</p>
                <p><strong>Type:</strong> {selectedReport.type}</p>
                <p><strong>Location:</strong> Latitude: {selectedReport.latitude}, Longitude: {selectedReport.longitude}</p>
                <p><strong>Date/Time:</strong> {new Date(selectedReport.uploadedAt).toLocaleString()}</p>
                {selectedReport.imageUrl && (
                  <div>
                    <img src={`http://localhost:8081/${selectedReport.imageUrl}`} alt="Report" className="small-image" />
                  </div>
                )}
                <button onClick={() => setSelectedReport(null)}>Back to Reports</button>
              </div>
            ) : (
              <table>
                <thead className="table-header">
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Date/Time</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {reports.map((report) => (
                    <tr key={report.id} onClick={() => handleRowClick(report)}>
                      <td>{report.id}</td>
                      <td>{report.description}</td>
                      <td>{report.type}</td>
                      <td>{new Date(report.uploadedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminReports;