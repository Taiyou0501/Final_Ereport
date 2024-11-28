import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/Dashboard.css';
import logo from '../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFile, faUsers, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import moment from 'moment';
import Logout from '../../Logout';
import api from '../../config/axios';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/api/full_reports/all');
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

  const handleStatusChange = async (reportId) => {
    try {
      await api.put(`/api/full_report/${reportId}/status`, { 
        status: 'Responded Manually'
      });
      
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: 'Responded Manually' } : report
      ));
      
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({ ...selectedReport, status: 'Responded Manually' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesType = filterType ? report.type === filterType : true;
    const matchesDate = filterDate ? new Date(report.uploadedAt).toLocaleDateString() === new Date(filterDate).toLocaleDateString() : true;
    return matchesType && matchesDate;
  });

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('M/D/YYYY, h:mm:ss A');
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
                <a onClick={() => handleNavigation('/admin/home')}>
                  <FontAwesomeIcon icon={faHouse} className="icon" />
                  <span className="text nav-text">Home</span>
                </a>
              </li>
              <li className="nav-link">
                <a onClick={() => handleNavigation('/admin/reports')}>
                  <FontAwesomeIcon icon={faFile} className="icon" />
                  <span className="text nav-text">Reports</span>
                </a>
              </li>
              <li className="nav-link">
                <a onClick={() => handleNavigation('/admin/accounts')}>
                  <FontAwesomeIcon icon={faUsers} className="icon" />
                  <span className="text nav-text">Accounts</span>
                </a>
              </li>
              <li className="nav-link">
                <a onClick={() => handleNavigation('/admin/profile')}>
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
                <p><strong>Date/Time:</strong> {formatDate(selectedReport.uploadedAt)}</p>
                <p><strong>Status:</strong> {selectedReport.status}</p>
                {selectedReport.status !== 'Responded Manually' && 
                 !selectedReport.status.startsWith('Responded by') && (
                  <button 
                    className="btn-responded" 
                    onClick={() => handleStatusChange(selectedReport.id)}
                  >
                    Mark as Responded
                  </button>
                )}
                {selectedReport.imageUrl && (
                  <div>
                    <img 
                      src={`${api.defaults.baseURL}/${selectedReport.imageUrl}`} 
                      alt="Report" 
                      className="small-image" 
                      onError={(e) => {
                        console.error('Failed to load image:', `${api.defaults.baseURL}/${selectedReport.imageUrl}`);
                        e.target.style.display = 'none';
                      }}
                    />
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
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {filteredReports.map((report) => (
                      <tr key={report.id} onClick={() => handleRowClick(report)}>
                        <td>{report.id}</td>
                        <td>{report.description}</td>
                        <td>{report.type}</td>
                        <td>{report.location}</td>
                        <td>{formatDate(report.uploadedAt)}</td>
                        <td>{report.status}</td>
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