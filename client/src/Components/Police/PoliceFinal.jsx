import '../CSS/responder.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import samplepic from '../Assets/sampleaccident.png';

const PoliceFinal = () => {
    const navigate = useNavigate();

    const handleRespondClick = () => {
        localStorage.setItem('victim', '[Insert Victim Name]');
        localStorage.setItem('reporterId', '[Insert Reporter ID]');
        localStorage.setItem('distance', '[Distance]');
        localStorage.setItem('location', '[Insert Location]');
        localStorage.setItem('description', '[Insert Description]');
        localStorage.setItem('dateTime', '[Insert Date/Time]');
    };

    const handleBackToMainMenu = () => {
        localStorage.setItem('situationStatus', 'Unavailable');
        navigate('/police-home');
    };

    return (
        <div className="index-responder-body">
            <header className="index-responder-header">
                <div className="index-main-text">E-REPORT</div>
            </header>
            <header className="index-header-tab">
                <button className="index-menu-btn">
                    <FontAwesomeIcon icon={faBars} />
                    <span className="index-menu-text">HELLO, OFFICER</span>
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
                <p className="final-text">You are now at the scene</p>
                <div className="final-layout-container">
                    
                    <div className="final-report-container">
                        <p className="freport-header-text">Emergency Report Details</p>
                        <div className="final-report-details-container">
                            <p className="fd1">Victim: {localStorage.getItem('victim')}</p>
                            <p className="fd2">Reporter ID: {localStorage.getItem('reporterId')}</p>
                            <p className="fd3">Distance: {localStorage.getItem('distance')}</p>
                            <p className="fd4">Location: {localStorage.getItem('location')}</p>
                            <p className="fd5">Description: {localStorage.getItem('description')}</p>
                            <p className="fd6">Date/Time: {localStorage.getItem('dateTime')}</p>
                        </div>
                    </div>
                    <div className="picture-container">
                        <img src={samplepic} alt="Scene Photo" className="scene-picture" />
                    </div>
                </div>
                
                <div className="mmb-container">
                    <button className="main-menu-btn" onClick={handleBackToMainMenu}>
                        BACK TO MAIN MENU
                    </button>
                </div>
            </div>
        </div>
    );

}
export default PoliceFinal;
