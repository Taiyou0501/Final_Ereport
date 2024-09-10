import './user.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';

const Dashboard = () => {

    const navigate = useNavigate();

    return (
        <div className="index-responder-body">
            <header className="index-responder-header">
                <div className="index-main-text">E-REPORT</div>
            </header>
            <header className="index-header-tab">
                <button className="index-menu-btn">
                    <FontAwesomeIcon icon={faBars} />
                    <span className="index-menu-text">HELLO, REPORTER</span>
                </button>
                <div className="index-responder-actions">
                    <button className="index-profile-btn">
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button className="index-logout-btn" onClick={() => navigate('/login')}>
                        <FontAwesomeIcon icon={faPowerOff} />
                    </button>
                </div>
            </header>

            <div className="index-tabs-responder">
            <p className="et-text">SELECT EMERGENCY TYPE:</p>
                <div className="emergency-type-container">
                    

                    <div className="et-individual">
                        <div className="et-image" onClick={() => navigate('/individual')}></div>
                        <p className="et-label">Injured Individuals</p>
                    </div>

                    <div className="et-vehicular">
                        <div className="et-image" onClick={() => navigate('/vehicular')}></div>
                        <p className="et-label">Vehicular Emergency</p>
                    </div>

                    <div className="et-fire">
                        <div className="et-image" onClick={() => navigate('/submission-success')}></div>
                        <p className="et-label">Fire Emergency</p>
                    </div>

                    <div className="et-others">
                        <div className="et-image" onClick={() => navigate('/others')}></div>
                        <p className="et-label">Others</p>
                    </div>
                </div>
            </div>

            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
        </div>
    );
};

export default Dashboard;
