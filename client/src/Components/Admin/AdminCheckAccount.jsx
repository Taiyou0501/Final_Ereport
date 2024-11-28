import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/Dashboard.css';
import logo from'../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFile, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/axios';
import Logout from "../../Logout";

const AdminCheckAccount = () => {
  const [accounts, setAccounts] = useState({
    user_details: [],
    responder_details: [],
    unit_details: [],
    barangay_details: []
  });
  const [filteredAccounts, setFilteredAccounts] = useState({
    user_details: [],
    responder_details: [],
    unit_details: [],
    barangay_details: []
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/accounts');
        console.log('Accounts fetched:', response.data);
        setAccounts(response.data);
        setFilteredAccounts(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountClick = async (table, id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/accounts/${table}/${id}`);
      setSelectedAccount(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching account details:', err);
      setError('Failed to load account details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
  };

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
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
            <h2>List of Accounts</h2>
            {error && <div className="error-message">{error}</div>}
            <input
              type="text"
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />
            {loading && !selectedAccount ? (
              <div className="loading">Loading accounts...</div>
            ) : (
              <>
                <div className="account-section user">
                  <strong>USER</strong>
                  <ul>
                    {filteredAccounts.user_details.map(account => (
                      <li key={account.id} onClick={() => handleAccountClick('user_details', account.id)}>
                        <span>{account.id}</span>
                        <span>{account.username}</span>
                        <span>{account.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="account-section responder">
                  <strong>RESPONDER</strong>
                  <ul>
                    {filteredAccounts.responder_details.map(account => (
                      <li key={account.id} onClick={() => handleAccountClick('responder_details', account.id)}>
                        <span>{account.id}</span>
                        <span>{account.username}</span>
                        <span>{account.email}</span>
                        <span>{account.respondertype}</span>
                        <span>{account.vehicle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="account-section unit">
                  <strong>UNIT</strong>
                  <ul>
                    {filteredAccounts.unit_details.map(account => (
                      <li key={account.id} onClick={() => handleAccountClick('unit_details', account.id)}>
                        <span>{account.id}</span>
                        <span>{account.username}</span>
                        <span>{account.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="account-section barangay">
                  <strong>BARANGAY</strong>
                  <ul>
                    {filteredAccounts.barangay_details.map(account => (
                      <li key={account.id} onClick={() => handleAccountClick('barangay_details', account.id)}>
                        <span>{account.id}</span>
                        <span>{account.username}</span>
                        <span>{account.email}</span>
                        <span>{account.barangay}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {selectedAccount && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Account Details</h3>
            <p>ID: {selectedAccount.id}</p>
            <p>First Name: {selectedAccount.firstname}</p>
            <p>Last Name: {selectedAccount.lastname}</p>
            <p>Username: {selectedAccount.username}</p>
            <p>Email: {selectedAccount.email}</p>
            <p>Phone Number: {selectedAccount.cpnumber}</p>
            {selectedAccount.respondertype && (
              <p>Responder Type: {selectedAccount.respondertype}</p>
            )}
            {selectedAccount.vehicle && (
              <p>Vehicle: {selectedAccount.vehicle}</p>
            )}
            {selectedAccount.barangay && (
              <p>Barangay: {selectedAccount.barangay}</p>
            )}
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCheckAccount;