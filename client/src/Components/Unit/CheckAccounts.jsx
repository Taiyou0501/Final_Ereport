import React, { useEffect, useState } from "react";
import '../CSS/Dashboard.css';
import api from '../../config/axios';
import Sidebar from "./Sidebar";

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
        const response = await api.get('/api/accounts');
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
        )
      };
      setFilteredAccounts(filtered);
    };

    filterAccounts();
  }, [search, accounts]);

  const handleAccountClick = async (table, id) => {
    setLoading(true); // Show loading popup
    try {
      const response = await api.get(`/api/accounts/${table}/${id}`);
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
      <Sidebar/>
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