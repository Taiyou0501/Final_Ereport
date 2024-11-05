import React, { useEffect, useState } from "react";
import '../CSS/Dashboard.css';
import logo from'../Assets/newbackground.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CheckAccounts = () => {
  const [accounts, setAccounts] = useState({
    responder_details: [],
    unit_details: [],
    police_details: []
  });
  const [filteredAccounts, setFilteredAccounts] = useState({
    responder_details: [],
    unit_details: [],
    police_details: []
  });
  const [selectedAccount, setSelectedAccount] = useState(null); // State to manage selected account
  const [loading, setLoading] = useState(false); // State to manage loading
  const [search, setSearch] = useState(''); // State to manage search input

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/accounts');
        setAccounts({
          responder_details: response.data.responder_details,
          unit_details: response.data.unit_details,
          police_details: response.data.police_details
        });
        setFilteredAccounts({
          responder_details: response.data.responder_details,
          unit_details: response.data.unit_details,
          police_details: response.data.police_details
        }); // Initialize filtered accounts
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const filterAccounts = () => {
      const lowercasedSearch = search.toLowerCase();
      const filtered = {
        responder_details: accounts.responder_details.filter(account =>
          account.username.toLowerCase().includes(lowercasedSearch) ||
          account.email.toLowerCase().includes(lowercasedSearch)
        ),
        unit_details: accounts.unit_details.filter(account =>
          account.username.toLowerCase().includes(lowercasedSearch) ||
          account.email.toLowerCase().includes(lowercasedSearch)
        ),
        police_details: accounts.police_details.filter(account =>
          account.username.toLowerCase().includes(lowercasedSearch) ||
          account.email.toLowerCase().includes(lowercasedSearch)
        )
      };
      setFilteredAccounts(filtered);
    };

    filterAccounts();
  }, [search, accounts]);

  const handleAccountClick = async (table, id) => {
    setLoading(true); // Show loading popup
    try {
      const response = await axios.get(`http://localhost:8081/api/accounts/${table}/${id}`);
      setSelectedAccount(response.data);
    } catch (error) {
      console.error('Error fetching account details:', error);
    } finally {
      setLoading(false); // Hide loading popup
    }
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
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
          <div className="home-wrapper">
            <h2>List of Accounts</h2>
            <input
              type="text"
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />
            <div className="account-section">
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
            <div className="account-section">
              <strong>RESPONDER</strong>
              <ul>
                {filteredAccounts.responder_details.map(account => (
                  <li key={account.id} onClick={() => handleAccountClick('responder_details', account.id)}>
                    <span>{account.id}</span>
                    <span>{account.username}</span>
                    <span>{account.email}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="account-section">
              <strong>POLICE</strong>
              <ul>
                {filteredAccounts.police_details.map(account => (
                  <li key={account.id} onClick={() => handleAccountClick('police_details', account.id)}>
                    <span>{account.id}</span>
                    <span>{account.username}</span>
                    <span>{account.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-popup">
            <p>Loading...</p>
          </div>
        </div>
      )}

      {selectedAccount && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Account Details</h3>
            <p>ID: {selectedAccount.id}</p>
            <p>Username: {selectedAccount.username}</p>
            <p>Email: {selectedAccount.email}</p>
            {/* Add more account details here */}
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckAccounts;