import React, { useEffect, useState } from "react";
import '../CSS/Dashboard.css';
import logo from '../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Logout from '../../Logout';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');

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

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };

  const filteredReports = reports.filter(report => {
    const matchesType = filterType ? report.type === filterType : true;
    const matchesDate = filterDate ? new Date(report.uploadedAt).toLocaleDateString() === new Date(filterDate).toLocaleDateString() : true;
    return matchesType && matchesDate;
  });

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
          <Logout />
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
                <p><strong>Location:</strong> {selectedReport.location}</p>
                <p><strong>Coordinates:</strong> Latitude: {selectedReport.latitude}, Longitude: {selectedReport.longitude}</p>
                <p><strong>Date/Time:</strong> {new Date(selectedReport.uploadedAt).toLocaleString()}</p>
                {selectedReport.imageUrl && (
                  <div>
                    <img src={`http://localhost:8081/${selectedReport.imageUrl}`} alt="Report" className="small-image" />
                  </div>
                )}
                <button className="btn-back" onClick={() => setSelectedReport(null)}>Back to Reports</button>
              </div>
            ) : (
              <div>
                <div className="filters">
                  <label>
                    Filter by Type:
                    <select value={filterType} onChange={handleFilterTypeChange}>
                      <option value="">All</option>
                      <option value="Injured Individual">Injured Individual</option>
                      <option value="Fire Emergency">Fire Emergency</option>
                      <option value="Vehicular Accident">Vehicular Accident</option>
                      <option value="Others">Others</option>
                    </select>
                  </label>
                  <label>
                    Filter by Date:
                    <input type="date" value={filterDate} onChange={handleFilterDateChange} />
                  </label>
                </div>
                <table>
                  <thead className="table-header">
                    <tr>
                      <th>ID</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Date/Time</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {filteredReports.map((report) => (
                      <tr key={report.id} onClick={() => handleRowClick(report)}>
                        <td>{report.id}</td>
                        <td>{report.description}</td>
                        <td>{report.type}</td>
                        <td>{report.location}</td>
                        <td>{new Date(report.uploadedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminReports;