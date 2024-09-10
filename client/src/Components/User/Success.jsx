import '../CSS/user.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

const UserIndex = () => {
  const navigate = useNavigate();

    const [holdText, setHoldText] = useState("FINDING NEAREST RESPONDER...");
    const [clickCount, setClickCount] = useState(0);
    const [fadeClass, setFadeClass] = useState('');

    const handleNextClick = () => {
        setFadeClass('fade-out');

        setTimeout(() => {
            setClickCount(prevCount => prevCount + 1);

            if (clickCount === 0) {
                setHoldText("RESPONDER IS ON THE WAY");
            } else if (clickCount === 1) {
                setHoldText("RESPONDER IS ON YOUR LOCATION");
            }

            setFadeClass('fade-in');
        }, 150);
    };

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
                <p
                    className={`hold-text ${fadeClass}`}
                    style={{ color: holdText === "RESPONDER IS ON YOUR LOCATION" ? 'green' : 'red' }}
                >
                    {holdText}
                </p>
                <p className="submit-text">YOUR REPORT: </p>
                <div className="report-container">
                    <div className='report-parent-container'>
                        <div className="report-details-container">
                            <p className="d1">Victim: [Insert Victim Name]</p>
                            <p className="d2">Reporter ID: [Insert Reporter ID]</p>
                            <p className="d3" id="distance">Distance: [Distance]</p>
                            <p className="d4">Location: [Insert Location]</p>
                            <p className="d5">Description: [Insert Description]</p>
                            <p className="d6">Date/Time: [Insert Date/Time]</p>
                        </div>
                        <div className="notif-picture-container">
                            <img src="/path-to-your-image.jpg" alt="Scene Photo" className="scene-picture" />
                        </div>
                    </div>
                    <button className="btn-next" onClick={handleNextClick}>Next</button> {/*temporary*/}

                    {holdText === "RESPONDER IS ON YOUR LOCATION" && (
                        <button className="menu-btn" onClick={() => navigate('/user')}>
                            RETURN TO MAIN MENU
                        </button>
                    )}
                </div>
            </div>

            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
        </div>
    );
};
export default UserIndex;